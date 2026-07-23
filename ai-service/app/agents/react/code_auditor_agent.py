"""
MODULE 1 — Agent 1: Code Auditor.

Parses the (already-sanitized) git diff, walks it for touched symbols using
AST-backed tooling, and resolves the CMDB dependency graph to compute the
change's blast radius. See app/agents/react/tools.py for the concrete tool
implementations and app/agents/prompts.py for the exact system prompt.
"""

from __future__ import annotations

import json
from typing import Any, Dict, List

from app.agents.prompts import CODE_AUDITOR_SYSTEM_PROMPT
from app.agents.react.base_react_agent import ReactAgent
from app.agents.react.tools import (
    detect_change_type,
    parse_ast_diff,
    trace_dependency_graph,
)
from app.agents.schemas import CodeAuditReport, CodeAuditReportFallback


class CodeAuditorAgent(ReactAgent):
    def __init__(self, context: Dict[str, Any]):
        """
        context keys:
          change_title, change_description, target_component,
          sanitized_diff_text (already redacted — see app/security/sanitizer.py)
        """
        self.context = context
        super().__init__(
            agent_name="code_auditor",
            system_prompt=CODE_AUDITOR_SYSTEM_PROMPT,
            tools={
                "parse_ast_diff": parse_ast_diff,
                "trace_dependency_graph": trace_dependency_graph,
                "detect_change_type": detect_change_type,
            },
            output_schema=CodeAuditReport,
        )

    def build_initial_message(self) -> str:
        return (
            f"Proposed change title: {self.context.get('change_title', '')}\n"
            f"Proposed change description: {self.context.get('change_description', '')}\n"
            f"Target component (as declared by the requester): {self.context.get('target_component', '')}\n"
            f"Sanitized diff (secrets already redacted):\n{self.context.get('sanitized_diff_text', '(no diff provided)')}\n\n"
            "Determine the change type, the touched symbols, and the full blast radius "
            "using your tools, then give your Final Answer."
        )

    # -- deterministic mock-mode responder --------------------------------------

    def mock_respond(self, messages: List[Dict[str, str]], iteration: int) -> str:
        if iteration == 1:
            diff_text = self.context.get("sanitized_diff_text", "") or ""
            action_input = {"diff_text": diff_text}
            return (
                "Thought: I should first identify exactly which symbols/files this diff touches "
                "before I trace how far the impact spreads through the dependency graph.\n"
                "Action: parse_ast_diff\n"
                f"Action Input: {json.dumps(action_input)}"
            )

        if iteration == 2:
            target = self.context.get("target_component", "")
            action_input = {"component_id_or_name": target, "max_depth": 5}
            return (
                "Thought: Now I need the deterministic blast radius from the CMDB dependency graph "
                "for the target component.\n"
                "Action: trace_dependency_graph\n"
                f"Action Input: {json.dumps(action_input)}"
            )

        # Final turn: synthesize the audit report from the same deterministic
        # tools directly (fully reproducible; matches what the tool calls above returned).
        diff_summary = parse_ast_diff(self.context.get("sanitized_diff_text", "") or "")
        dependency_result = trace_dependency_graph(self.context.get("target_component", ""), max_depth=5)
        change_type_guess = detect_change_type(
            self.context.get("change_title", ""), self.context.get("change_description", "")
        )

        impacted_applications = [
            {
                "service_id": item["service_id"],
                "service_name": item["service_name"],
                "criticality": item["criticality"] if item["criticality"] in ("low", "medium", "high", "critical") else "medium",
                "relationship": item["relationship"],
            }
            for item in dependency_result.get("impacted", [])
        ] or [
            {
                "service_id": self.context.get("target_component", "unknown"),
                "service_name": self.context.get("target_component", "unknown"),
                "criticality": "medium",
                "relationship": "target",
            }
        ]

        blast_radius_score = min(100, len(impacted_applications) * 12 + dependency_result.get("max_depth_reached", 0) * 8)

        final_answer = {
            "inferred_change_type": change_type_guess.get("most_likely_type", "UNKNOWN"),
            "primary_component": dependency_result.get("root_component", self.context.get("target_component", "unknown")),
            "touched_symbols": diff_summary.get("touched_symbols", []),
            "impacted_applications": impacted_applications,
            "blast_radius_score": blast_radius_score,
            "reasoning": [
                f"Parsed diff: {len(diff_summary.get('touched_symbols', []))} touched symbol(s) across "
                f"{len(diff_summary.get('files_changed', []))} file(s).",
                f"Dependency graph resolved={dependency_result.get('resolved')}, "
                f"{len(impacted_applications)} impacted service(s) up to depth {dependency_result.get('max_depth_reached', 0)}.",
                f"Change type classifier scores: {change_type_guess.get('candidate_scores', {})}.",
            ],
        }
        return f"Thought: I have enough evidence from the AST diff parse and dependency trace to finalize.\nFinal Answer: {json.dumps(final_answer)}"

    def _fallback_factory(self, raw_text: str, errors: list) -> CodeAuditReportFallback:
        target = self.context.get("target_component", "unknown-component")
        return CodeAuditReportFallback(
            inferred_change_type="UNKNOWN",
            primary_component=target,
            touched_symbols=[],
            impacted_applications=[
                {
                    "service_id": target,
                    "service_name": target,
                    "criticality": "medium",
                    "relationship": "target",
                }
            ],
            blast_radius_score=50,
            reasoning=[
                "Fallback triggered: Code Auditor output failed schema validation twice.",
                f"Validation errors: {errors[:5]}",
            ],
        )

    def _fallback_type(self):
        return CodeAuditReportFallback
