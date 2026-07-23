"""
Data loader for RAG sources.
Loads and indexes all data sources: cmdb, incidents, change_requests, architecture, runbooks, source_registry.
"""

import json
import os
import re
from typing import Dict, Any, List, Optional
from pathlib import Path


DATA_DIR = Path(__file__).parent.parent.parent / "data"

# Common English filler words excluded from keyword-overlap scoring. Without
# this, a query like "show me the runbook for the mainframe teller subsystem"
# matched unrelated records purely on "for"/"the"/"show" overlaps, surfacing
# irrelevant services and incidents in chat answers.
_STOPWORDS = {
    "the", "and", "for", "are", "was", "were", "with", "from", "about", "this",
    "that", "these", "those", "what", "when", "where", "which", "whose", "how",
    "why", "who", "can", "could", "should", "would", "will", "shall", "may",
    "might", "must", "have", "has", "had", "does", "did", "done", "been", "being",
    "you", "your", "our", "their", "its", "his", "her", "him", "she", "they",
    "them", "show", "tell", "give", "please", "get", "any", "all", "some", "more",
    "most", "very", "just", "like", "into", "onto", "over", "under", "than",
    "then", "there", "here", "out", "not", "but", "also", "too",
}


class DataLoader:
    """Loads and provides access to all RAG data sources."""

    def __init__(self):
        self.data: Dict[str, Any] = {}
        self._load_all()

    def _load_all(self):
        """Load all data sources."""
        self._load_json("cmdb", "cmdb.json")
        self._load_json("incidents", "incidents.json")
        self._load_json("change_requests", "change_requests.json")
        self._load_json("source_registry", "source_registry.json")
        self._load_markdown("architecture", "architecture.md")
        self._load_runbooks()

    def _load_json(self, key: str, filename: str):
        """Load a JSON file."""
        filepath = DATA_DIR / filename
        if filepath.exists():
            with open(filepath, 'r') as f:
                self.data[key] = json.load(f)
        else:
            self.data[key] = []
            print(f"Warning: {filename} not found at {filepath}")

    def _load_markdown(self, key: str, filename: str):
        """Load a markdown file."""
        filepath = DATA_DIR / filename
        if filepath.exists():
            with open(filepath, 'r') as f:
                content = f.read()
            self.data[key] = {
                "filename": filename,
                "content": content,
                "sections": self._parse_markdown_sections(content)
            }
        else:
            self.data[key] = {"filename": filename, "content": "", "sections": []}
            print(f"Warning: {filename} not found at {filepath}")

    def _load_runbooks(self):
        """Load all runbook markdown files."""
        runbooks_dir = DATA_DIR / "runbooks"
        self.data["runbooks"] = []
        if runbooks_dir.exists():
            for md_file in runbooks_dir.glob("*.md"):
                with open(md_file, 'r') as f:
                    content = f.read()
                service_name = md_file.stem.replace("-runbook", "").replace("-", " ")
                self.data["runbooks"].append({
                    "service": service_name,
                    "filename": md_file.name,
                    "content": content,
                    "sections": self._parse_markdown_sections(content)
                })

    def _parse_markdown_sections(self, content: str) -> List[Dict[str, str]]:
        """Parse markdown into sections."""
        sections = []
        lines = content.split('\n')
        current_section = {"title": "overview", "content": ""}
        
        for line in lines:
            if line.startswith('## '):
                if current_section["content"].strip():
                    sections.append(current_section)
                current_section = {"title": line.strip('# ').strip(), "content": ""}
            else:
                current_section["content"] += line + '\n'
        
        if current_section["content"].strip():
            sections.append(current_section)
        
        return sections

    def get_services(self) -> List[Dict[str, Any]]:
        """Get all CMDB services."""
        return self.data.get("cmdb", [])

    def get_incidents(self, limit: int = None) -> List[Dict[str, Any]]:
        """Get all incidents."""
        incidents = self.data.get("incidents", [])
        if limit:
            return incidents[:limit]
        return incidents

    def get_change_requests(self, limit: int = None) -> List[Dict[str, Any]]:
        """Get all change requests."""
        crs = self.data.get("change_requests", [])
        if limit:
            return crs[:limit]
        return crs

    def get_architecture(self) -> Dict[str, Any]:
        """Get architecture document."""
        return self.data.get("architecture", {"content": ""})

    def get_runbooks(self) -> List[Dict[str, Any]]:
        """Get all runbooks."""
        return self.data.get("runbooks", [])

    def get_source_registry(self) -> List[Dict[str, Any]]:
        """Get source registry."""
        return self.data.get("source_registry", [])

    def search_all(self, query: str, embedding_service=None) -> Dict[str, List]:
        """Search across all data sources."""
        results = {}

        # Explicit record-id references (e.g. "inc-004", "cr-012") must resolve
        # to that exact record even though "id" isn't one of the free-text
        # fields scored by _keyword_search — otherwise a question like "what
        # caused incident inc-004" never retrieves inc-004 at all (its title/
        # description share no words with the query) and the chatbot ends up
        # answering about some other, unrelated record instead.
        referenced_ids = {m.group(0).lower() for m in re.finditer(r"\b(?:inc|cr)-\d+\b", query, re.IGNORECASE)}

        # Search services
        services = self.get_services()
        if embedding_service and services:
            service_docs = [
                {"id": s["id"], "content": f"{s['name']}: {s['description']} ({s['type']})", "type": "service",
                 "name": s["name"], "criticality": s.get("criticality", "unknown")}
                for s in services
            ]
            results["services"] = embedding_service.search(query, service_docs, top_k=5)
        else:
            results["services"] = self._keyword_search(
                services, query, fields=["name", "description"]
            )

        # Search incidents
        incidents = self.get_incidents()
        if embedding_service and incidents:
            incident_docs = [
                {"id": inc["id"], "content": f"{inc['title']}: {inc['description']} (root cause: {inc.get('rootCause', 'unknown')})",
                 "type": "incident", "severity": inc.get("severity", "unknown")}
                for inc in incidents
            ]
            results["incidents"] = embedding_service.search(query, incident_docs, top_k=5)
        else:
            results["incidents"] = self._keyword_search(
                incidents, query, fields=["title", "description", "rootCause"]
            )
        results["incidents"] = self._prioritize_exact_id_matches(incidents, referenced_ids, results["incidents"])

        # Search change requests
        crs = self.get_change_requests()
        if embedding_service and crs:
            cr_docs = [
                {"id": cr["id"], "content": f"{cr['title']}: {cr['description']} (type: {cr.get('type', 'unknown')})",
                 "type": "change_request", "status": cr.get("status", "unknown")}
                for cr in crs
            ]
            results["change_requests"] = embedding_service.search(query, cr_docs, top_k=5)
        else:
            results["change_requests"] = self._keyword_search(
                crs, query, fields=["title", "description", "justification"]
            )
        results["change_requests"] = self._prioritize_exact_id_matches(crs, referenced_ids, results["change_requests"])

        # Search runbooks
        runbooks = self.get_runbooks()
        if embedding_service and runbooks:
            rb_docs = [
                {"id": rb["service"], "content": rb["content"], "type": "runbook",
                 "service": rb["service"]}
                for rb in runbooks
            ]
            results["runbooks"] = embedding_service.search(query, rb_docs, top_k=3)
        else:
            results["runbooks"] = self._keyword_search(
                runbooks, query, fields=["service", "content"]
            )

        # Search architecture
        arch = self.get_architecture()
        if embedding_service and arch.get("content"):
            arch_docs = [
                {"id": "architecture", "content": arch["content"], "type": "architecture"}
            ]
            results["architecture"] = embedding_service.search(query, arch_docs, top_k=2)
        else:
            results["architecture"] = []
            arch_content_lower = arch.get("content", "").lower()
            query_lower = query.lower()
            query_words = {
                w for w in re.findall(r"[a-z0-9]+", query_lower)
                if len(w) > 3 and w not in _STOPWORDS
            }
            if arch_content_lower and (
                "architecture" in query_lower
                or "topology" in query_lower
                or "system design" in query_lower
                or any(word in arch_content_lower for word in query_words)
            ):
                results["architecture"] = [{"id": "architecture", "type": "architecture"}]

        return results

    @staticmethod
    def _prioritize_exact_id_matches(
        items: List[Dict], referenced_ids: set, existing_results: List[Dict]
    ) -> List[Dict]:
        """Ensure any record whose id was explicitly named in the query (e.g.
        "inc-004") is present and ranked first in the results, regardless of
        whether it scored on free-text keyword overlap.
        """
        if not referenced_ids:
            return existing_results

        by_id = {str(item.get("id", "")).lower(): item for item in items}
        exact_matches = [
            {**by_id[rid], "similarity_score": 999.0}
            for rid in referenced_ids
            if rid in by_id
        ]
        if not exact_matches:
            return existing_results

        exact_ids = {m["id"] for m in exact_matches}
        rest = [r for r in existing_results if r.get("id") not in exact_ids]
        return (exact_matches + rest)[:5]

    def _keyword_search(self, items: List[Dict], query: str, fields: List[str]) -> List[Dict]:
        """
        Simple keyword-based search fallback.

        Matches bidirectionally: a full-sentence query (e.g. "tell me about
        payment-gateway") won't literally contain a field's value nor be
        literally contained by it, so — in addition to the direct substring
        check in either direction — this also tokenizes both the query and
        each field into words (splitting on non-alphanumeric characters, so
        hyphenated identifiers like "payment-gateway" or "order-service"
        match "payment"/"gateway"/"order"/"service" individually) and scores
        on word overlap. This is what lets a natural-language chat question
        actually retrieve the right record instead of only working for a
        single bare keyword query.
        """
        query_lower = query.lower()
        query_words = {
            w for w in re.findall(r"[a-z0-9]+", query_lower)
            if len(w) > 2 and w not in _STOPWORDS
        }

        results = []
        for item in items:
            score = 0.0
            for field in fields:
                value = item.get(field)
                if not isinstance(value, str) or not value:
                    continue
                value_lower = value.lower()

                if value_lower in query_lower or query_lower in value_lower:
                    score += 2.0

                field_words = set(re.findall(r"[a-z0-9]+", value_lower))
                score += len(query_words & field_words)

            if score > 0:
                results.append({**item, "similarity_score": score / max(len(fields), 1)})

        results.sort(key=lambda x: x["similarity_score"], reverse=True)
        return results[:5]

    def get_counts(self) -> Dict[str, int]:
        """Get counts of loaded data."""
        return {
            "services": len(self.get_services()),
            "incidents": len(self.get_incidents()),
            "change_requests": len(self.get_change_requests()),
            "source_registry": len(self.get_source_registry()),
            "runbooks": len(self.get_runbooks()),
            "architecture": 1 if self.get_architecture().get("content") else 0
        }

