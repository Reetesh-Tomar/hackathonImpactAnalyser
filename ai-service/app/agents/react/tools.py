"""
MODULE 1 — Tool implementations callable by the ReAct agents' Action step.

Each tool is a plain Python function: `(input_dict) -> output_dict`. Tools
are deliberately deterministic and side-effect-free (aside from the vector
index lookup, which is a read against a local/embedded store) so that agent
transcripts are fully reproducible for audit purposes.
"""

from __future__ import annotations

import ast
import re
from typing import Any, Dict, List, Optional

from app.rag.data_loader import DataLoader
from app.rag.vector_search import IncidentVectorSearchService, get_incident_vector_search_service


# ---------------------------------------------------------------------------
# Code Auditor Agent tools
# ---------------------------------------------------------------------------

_DIFF_HUNK_HEADER_RE = re.compile(r"^diff --git a/(\S+) b/(\S+)")
_PY_DEF_RE = re.compile(r"^\s*(?:async\s+)?def\s+(\w+)\s*\(")
_PY_CLASS_RE = re.compile(r"^\s*class\s+(\w+)\s*[:\(]")
_GENERIC_SYMBOL_RE = re.compile(
    r"^\s*(?:public|private|protected|static|final|export|const|function|def|class|interface|impl|fn)\s+"
    r"(?:[\w<>\[\], ]+\s+)?(\w+)\s*[\(<:{]"
)


def parse_ast_diff(diff_text: str) -> Dict[str, Any]:
    """
    Parse a (sanitized) unified diff and identify touched symbols.

    For Python content, this uses the real `ast` module against added lines
    reconstructed per-file to precisely identify function/class definitions.
    For non-Python content (Java/TS/Go/etc., common in a bank's polyglot
    estate) it falls back to a signature-based line scanner, since a single
    AST module cannot parse every language — this mirrors how production
    static-analysis pipelines tier full-AST parsing (Python/JS via native
    parsers) with pattern-based extraction for the long tail of languages.

    Returns a bounded summary — never the full diff text — to keep the
    payload small for downstream LLM context (see Module 5.1: token budget).
    """
    if not diff_text or not diff_text.strip():
        return {"files_changed": [], "touched_symbols": [], "change_kind_counts": {}}

    files_changed: List[str] = []
    touched_symbols: List[Dict[str, str]] = []
    current_file = "unknown"
    added_lines_by_file: Dict[str, List[str]] = {}

    for line in diff_text.splitlines():
        header_match = _DIFF_HUNK_HEADER_RE.match(line)
        if header_match:
            current_file = header_match.group(2)
            files_changed.append(current_file)
            added_lines_by_file.setdefault(current_file, [])
            continue

        if line.startswith("+++") or line.startswith("---"):
            continue

        if line.startswith("+") and not line.startswith("++"):
            content = line[1:]
            added_lines_by_file.setdefault(current_file, []).append(content)
            _extract_symbol_from_line(content, current_file, touched_symbols, change_kind="added")
        elif line.startswith("-") and not line.startswith("--"):
            content = line[1:]
            _extract_symbol_from_line(content, current_file, touched_symbols, change_kind="removed")

    # Attempt a real Python AST pass per file for higher precision when the
    # reconstructed added-lines block happens to be valid, self-contained Python.
    for file_path, added_lines in added_lines_by_file.items():
        if not file_path.endswith(".py"):
            continue
        candidate_source = "\n".join(added_lines)
        try:
            tree = ast.parse(candidate_source)
            for node in ast.walk(tree):
                if isinstance(node, (ast.FunctionDef, ast.AsyncFunctionDef, ast.ClassDef)):
                    touched_symbols.append(
                        {"symbol_name": node.name, "file_path": file_path, "change_kind": "modified"}
                    )
        except SyntaxError:
            pass  # partial diff hunk is not standalone-parseable; regex pass above already covered it

    change_kind_counts: Dict[str, int] = {}
    deduped: List[Dict[str, str]] = []
    seen = set()
    for sym in touched_symbols:
        key = (sym["symbol_name"], sym["file_path"])
        if key in seen:
            continue
        seen.add(key)
        deduped.append(sym)
        change_kind_counts[sym["change_kind"]] = change_kind_counts.get(sym["change_kind"], 0) + 1

    return {
        "files_changed": list(dict.fromkeys(files_changed)),
        "touched_symbols": deduped[:50],
        "change_kind_counts": change_kind_counts,
    }


def _extract_symbol_from_line(
    line: str, file_path: str, sink: List[Dict[str, str]], change_kind: str
) -> None:
    for pattern in (_PY_DEF_RE, _PY_CLASS_RE, _GENERIC_SYMBOL_RE):
        match = pattern.match(line)
        if match:
            sink.append({"symbol_name": match.group(1), "file_path": file_path, "change_kind": change_kind})
            return


def trace_dependency_graph(
    component_id_or_name: str, max_depth: int = 5, data_loader: Optional[DataLoader] = None
) -> Dict[str, Any]:
    """
    BFS over the CMDB dependency graph (ai-service/data/cmdb.json) to compute
    the deterministic blast radius of a change to `component_id_or_name`.

    This is intentionally NOT an LLM call — reach is computed from structured
    data so the result is reproducible and auditable (Module 5.1 rationale).
    """
    loader = data_loader or DataLoader()
    services = loader.get_services()
    by_key = {}
    for svc in services:
        by_key[svc.get("id", "").lower()] = svc
        by_key[svc.get("name", "").lower()] = svc

    root = by_key.get(component_id_or_name.lower())
    if root is None:
        # fuzzy fallback: substring match against name/id
        needle = component_id_or_name.lower()
        for svc in services:
            if needle in svc.get("name", "").lower() or needle in svc.get("id", "").lower():
                root = svc
                break

    if root is None:
        return {
            "root_component": component_id_or_name,
            "resolved": False,
            "impacted": [],
            "max_depth_reached": 0,
        }

    visited = set()
    queue: List[Any] = [(root, 0, "target")]
    impacted: List[Dict[str, Any]] = []
    max_depth_reached = 0

    while queue:
        current, depth, relationship = queue.pop(0)
        name = current.get("name", current.get("id", ""))
        if name in visited or depth > max_depth:
            continue
        visited.add(name)
        max_depth_reached = max(max_depth_reached, depth)

        impacted.append(
            {
                "service_id": current.get("id", name),
                "service_name": name,
                "criticality": current.get("criticality", "unknown"),
                "owner": current.get("owner", "unknown"),
                "relationship": relationship,
            }
        )

        for dependent_name in current.get("dependents", []):
            dependent = by_key.get(dependent_name.lower())
            if dependent and dependent.get("name") not in visited:
                queue.append((dependent, depth + 1, "downstream_cascade"))

        for dep_name in current.get("dependencies", []):
            dep = by_key.get(dep_name.lower())
            if dep and dep.get("name") not in visited:
                queue.append((dep, depth + 1, "direct_dependency"))

    return {
        "root_component": root.get("name", component_id_or_name),
        "resolved": True,
        "impacted": impacted,
        "max_depth_reached": max_depth_reached,
    }


_CHANGE_TYPE_KEYWORDS = {
    "KAFKA_UPGRADE": ["kafka", "broker", "consumer group", "inter.broker.protocol"],
    "DATABASE_MIGRATION": ["database", "schema migration", "oracle", "postgres", "mysql", "alter table", "flyway", "liquibase"],
    "API_CONTRACT_CHANGE": ["api", "endpoint", "contract", "openapi", "grpc", "rest"],
    "SECURITY_PATCH": ["cve", "vulnerability", "security patch", "tls", "certificate", "auth"],
    "CONFIGURATION_CHANGE": ["config", "yaml", "properties", "env var", "feature flag"],
    "ROLLBACK": ["rollback", "revert"],
    "BUG_FIX": ["bugfix", "hotfix", "fix:"],
    "INFRASTRUCTURE_UPGRADE": ["upgrade", "version bump", "cluster", "kubernetes", "helm"],
}


def detect_change_type(change_title: str, change_description: str) -> Dict[str, Any]:
    """Deterministic keyword classifier used as a cheap first-pass signal
    before/alongside the LLM's own classification in the Final Answer."""
    text = f"{change_title} {change_description}".lower()
    scores: Dict[str, int] = {}
    for change_type, keywords in _CHANGE_TYPE_KEYWORDS.items():
        score = sum(1 for kw in keywords if kw in text)
        if score:
            scores[change_type] = score

    if not scores:
        return {"most_likely_type": "FEATURE_ENHANCEMENT", "candidate_scores": {}}

    best = max(scores.items(), key=lambda kv: kv[1])
    return {"most_likely_type": best[0], "candidate_scores": scores}


# ---------------------------------------------------------------------------
# Historical Detective Agent tools
# ---------------------------------------------------------------------------

def embed_query(text: str) -> Dict[str, Any]:
    """Wraps HybridEmbeddingProvider so the agent can 'reason about' the
    fact that an embedding was computed, without the embedding vector
    itself bloating the transcript (only its dimensionality is reported)."""
    service = get_incident_vector_search_service()
    vector = service.embeddings.embed_one(text)
    return {
        "embedding_dimension": len(vector),
        "embedding_provider": service.embeddings.last_provider_used,
    }


def vector_search_incidents(
    change_title: str,
    change_description: str,
    target_component: str,
    change_type: str = "UNKNOWN",
    top_k: int = 3,
    service: Optional[IncidentVectorSearchService] = None,
) -> Dict[str, Any]:
    """The core Module 3 tool: semantic search over the historical incident
    vector index, returning the top-k similar outages + mitigations used."""
    svc = service or get_incident_vector_search_service()
    result = svc.find_similar_outages(
        change_title=change_title,
        change_description=change_description,
        target_component=target_component,
        change_type=change_type,
        top_k=top_k,
    )
    return result.model_dump()


def fetch_runbook(service_name: str, data_loader: Optional[DataLoader] = None) -> Dict[str, Any]:
    """Retrieve the operational runbook (if any) for a given service name."""
    loader = data_loader or DataLoader()
    for rb in loader.get_runbooks():
        if service_name.lower() in rb.get("service", "").lower():
            return {"found": True, "service": rb["service"], "content": rb["content"][:3000]}
    return {"found": False, "service": service_name, "content": ""}


# ---------------------------------------------------------------------------
# Risk Synthesizer Agent tools (deterministic scoring only — no new I/O)
# ---------------------------------------------------------------------------

_CHANGE_TYPE_BASE_RISK = {
    "INFRASTRUCTURE_UPGRADE": 30,
    "KAFKA_UPGRADE": 32,
    "DATABASE_MIGRATION": 35,
    "API_CONTRACT_CHANGE": 22,
    "CONFIGURATION_CHANGE": 15,
    "SECURITY_PATCH": 25,
    "FEATURE_ENHANCEMENT": 12,
    "BUG_FIX": 10,
    "ROLLBACK": 18,
    "UNKNOWN": 15,
}

_SEVERITY_WEIGHT = {"none": 0, "low": 5, "moderate": 15, "severe": 30}
_CRITICALITY_WEIGHT = {"low": 2, "medium": 5, "high": 10, "critical": 15}


def score_risk_matrix(code_audit: Dict[str, Any], historical: Dict[str, Any]) -> Dict[str, Any]:
    """
    Deterministic, versioned risk-scoring formula (documented in
    ARCHITECTURE_BLUEPRINT.md Module 5.3 as the compliance-auditable core of
    the final risk_score) — the LLM narrates around this number but cannot
    silently override it beyond a +/-5 correction window.
    """
    change_type = code_audit.get("inferred_change_type", "UNKNOWN")
    base = _CHANGE_TYPE_BASE_RISK.get(change_type, 15)

    blast_radius_score = code_audit.get("blast_radius_score", 0)
    blast_component = round(blast_radius_score * 0.35)

    critical_services = [
        app for app in code_audit.get("impacted_applications", [])
        if app.get("criticality") in ("high", "critical")
    ]
    criticality_component = sum(_CRITICALITY_WEIGHT.get(app.get("criticality", "low"), 2) for app in critical_services)
    criticality_component = min(criticality_component, 25)

    severity_signal = historical.get("historical_severity_signal", "none")
    history_component = _SEVERITY_WEIGHT.get(severity_signal, 0)

    total = base + blast_component + criticality_component + history_component
    total = max(1, min(100, round(total)))

    return {
        "risk_score": total,
        "components": {
            "base_change_type_risk": base,
            "blast_radius_component": blast_component,
            "criticality_component": criticality_component,
            "historical_severity_component": history_component,
        },
        "formula_version": "v1.0-deterministic-weighted-sum",
    }


def validate_json_schema(candidate_json: str, schema_name: str) -> Dict[str, Any]:
    """
    Lets the Risk Synthesizer agent self-check its draft Final Answer against
    the strict Pydantic schema BEFORE committing to it, using the same
    guardrail machinery the executor uses after the fact. This gives the
    agent a chance to self-correct within its iteration budget rather than
    relying solely on the post-hoc repair retry.
    """
    from app.agents import schemas as schema_module
    from app.agents.guardrails import parse_and_validate

    schema_cls = getattr(schema_module, schema_name, None)
    if schema_cls is None:
        return {"valid": False, "errors": [f"Unknown schema_name: {schema_name}"]}

    instance, errors = parse_and_validate(candidate_json, schema_cls)
    return {"valid": instance is not None, "errors": errors}


TOOL_REGISTRY = {
    "parse_ast_diff": parse_ast_diff,
    "trace_dependency_graph": trace_dependency_graph,
    "detect_change_type": detect_change_type,
    "embed_query": embed_query,
    "vector_search_incidents": vector_search_incidents,
    "fetch_runbook": fetch_runbook,
    "score_risk_matrix": score_risk_matrix,
    "validate_json_schema": validate_json_schema,
}
