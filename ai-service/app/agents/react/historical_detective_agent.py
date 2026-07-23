"""
MODULE 1 — Agent 2: Historical Detective.

Consumes the Code Auditor's validated CodeAuditReport and autonomously
queries the historical incident vector index (Module 3) to find the top-3
most similar past outages and the mitigations that resolved them.
"""

from __future__ import annotations

import json
from typing import Any, Dict, List

from app.agents.prompts import HISTORICAL_DETECTIVE_SYSTEM_PROMPT
from app.agents.react.base_react_agent import ReactAgent
from app.agents.react.tools import embed_query, fetch_runbook, vector_search_incidents
from app.agents.schemas import CodeAuditReport, HistoricalFindingsReport, HistoricalFindingsReportFallback


_SEVERITY_RANK = {"low": 1, "moderate": 2, "medium": 2, "high": 3, "critical": 4, "severe": 4, "unknown": 0}


def _worst_severity_signal(similar_outages: List[Dict[str, Any]]) -> str:
    if not similar_outages:
        return "none"
    worst_rank = max(_SEVERITY_RANK.get(str(o.get("severity", "unknown")).lower(), 0) for o in similar_outages)
    if worst_rank >= 4:
        return "severe"
    if worst_rank == 3:
        return "moderate"
    if worst_rank >= 1:
        return "low"
    return "none"


class HistoricalDetectiveAgent(ReactAgent):
    def __init__(self, context: Dict[str, Any], code_audit: CodeAuditReport):
        """
        context keys: change_title, change_description, target_component
        code_audit: the validated output of CodeAuditorAgent, used to build
                    the semantic search query (per Module 1 data flow).
        """
        self.context = context
        self.code_audit = code_audit
        super().__init__(
            agent_name="historical_detective",
            system_prompt=HISTORICAL_DETECTIVE_SYSTEM_PROMPT,
            tools={
                "embed_query": embed_query,
                "vector_search_incidents": vector_search_incidents,
                "fetch_runbook": fetch_runbook,
            },
            output_schema=HistoricalFindingsReport,
        )

    def build_initial_message(self) -> str:
        return (
            f"Code Auditor findings (validated JSON):\n{self.code_audit.model_dump_json()}\n\n"
            f"Original change title: {self.context.get('change_title', '')}\n"
            f"Original change description: {self.context.get('change_description', '')}\n\n"
            "Search the historical incident vector database for similar past outages "
            "and their mitigations, then give your Final Answer with at most 3 matches."
        )

    def _search_query_kwargs(self) -> Dict[str, Any]:
        return {
            "change_title": self.context.get("change_title", ""),
            "change_description": self.context.get("change_description", ""),
            "target_component": self.code_audit.primary_component,
            "change_type": self.code_audit.inferred_change_type,
            "top_k": 3,
        }

    # -- deterministic mock-mode responder --------------------------------------

    def mock_respond(self, messages: List[Dict[str, str]], iteration: int) -> str:
        if iteration == 1:
            query_text = (
                f"{self.context.get('change_title', '')} {self.context.get('change_description', '')} "
                f"{self.code_audit.primary_component}"
            )
            return (
                "Thought: I should first embed the change context so I can run a semantic "
                "similarity search against the incident vector index.\n"
                "Action: embed_query\n"
                f"Action Input: {json.dumps({'text': query_text})}"
            )

        if iteration == 2:
            return (
                "Thought: Now I will run the semantic vector search for the top 3 most similar "
                "historical outages against this component and change type.\n"
                "Action: vector_search_incidents\n"
                f"Action Input: {json.dumps(self._search_query_kwargs())}"
            )

        # Final turn: use the same deterministic tool call to build the report.
        search_result = vector_search_incidents(**self._search_query_kwargs())
        similar_outages = [
            {
                "incident_id": r["incident_id"],
                "title": r["title"],
                "similarity_score": r["similarity_score"],
                "root_cause": r["root_cause"] or "Root cause not documented",
                "mitigation_used": r["mitigation_used"],
            }
            for r in search_result.get("results", [])[:3]
        ]

        severity_lookup = {
            r["incident_id"]: r.get("severity", "unknown") for r in search_result.get("results", [])
        }
        signal = _worst_severity_signal(
            [{"severity": severity_lookup.get(o["incident_id"], "unknown")} for o in similar_outages]
        )

        if similar_outages:
            top = similar_outages[0]
            pattern_summary = (
                f"Most similar past incident is '{top['title']}' (similarity "
                f"{top['similarity_score']:.2f}), root cause: {top['root_cause']}."
            )
        else:
            pattern_summary = "No sufficiently similar historical incidents were found in the vector index."

        final_answer = {
            "similar_outages": similar_outages,
            "historical_severity_signal": signal,
            "recurring_pattern_summary": pattern_summary,
            "reasoning": [
                f"Vector search backend: {search_result.get('index_backend')} "
                f"(embedding provider: {search_result.get('embedding_provider')}).",
                f"Retrieved {len(similar_outages)} candidate outage(s) at top_k=3.",
            ],
        }
        return f"Thought: The vector search results give me enough evidence to finalize.\nFinal Answer: {json.dumps(final_answer)}"

    def _fallback_factory(self, raw_text: str, errors: list) -> HistoricalFindingsReportFallback:
        return HistoricalFindingsReportFallback(
            similar_outages=[],
            historical_severity_signal="none",
            recurring_pattern_summary=(
                "Fallback triggered: Historical Detective output failed schema validation twice; "
                "treating historical signal as unknown/none for conservative scoring."
            ),
            reasoning=[f"Validation errors: {errors[:5]}"],
        )

    def _fallback_type(self):
        return HistoricalFindingsReportFallback
