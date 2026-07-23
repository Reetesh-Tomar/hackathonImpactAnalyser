"""
MODULE 1 / MODULE 4 — Agent 3: Risk Synthesizer.

The final agent in the pipeline. Combines the Code Auditor's blast-radius
analysis with the Historical Detective's outage findings into ONE
deterministic risk verdict, expressed in the exact strict JSON schema
required by the hackathon spec: risk_score, top_risks, applications_impacted,
teams_notified, step_by_step_mitigation.
"""

from __future__ import annotations

import json
from typing import Any, Dict, List

from app.agents.prompts import RISK_SYNTHESIZER_SYSTEM_PROMPT
from app.agents.react.base_react_agent import ReactAgent
from app.agents.react.tools import score_risk_matrix, validate_json_schema
from app.agents.schemas import (
    CodeAuditReport,
    HistoricalFindingsReport,
    MalformedOutputFallback,
    RiskAnalysisReport,
)

_TEAM_OWNER_BY_CRITICALITY = {
    "critical": "Change Advisory Board (CAB)",
    "high": "Site Reliability Engineering (SRE)",
    "medium": "Service Owner Team",
    "low": "Service Owner Team",
}


class RiskSynthesizerAgent(ReactAgent):
    def __init__(
        self,
        context: Dict[str, Any],
        code_audit: CodeAuditReport,
        historical: HistoricalFindingsReport,
    ):
        self.context = context
        self.code_audit = code_audit
        self.historical = historical
        super().__init__(
            agent_name="risk_synthesizer",
            system_prompt=RISK_SYNTHESIZER_SYSTEM_PROMPT,
            tools={
                "score_risk_matrix": score_risk_matrix,
                "validate_json_schema": validate_json_schema,
            },
            output_schema=RiskAnalysisReport,
        )

    def build_initial_message(self) -> str:
        return (
            f"CodeAuditReport (validated):\n{self.code_audit.model_dump_json()}\n\n"
            f"HistoricalFindingsReport (validated):\n{self.historical.model_dump_json()}\n\n"
            "Score the deterministic risk matrix, self-validate your draft against the "
            "RiskAnalysisReport schema, then give your Final Answer."
        )

    # -- draft construction helpers (shared by mock + LLM self-check paths) ----

    def _build_top_risks(self) -> List[str]:
        risks: List[str] = []
        if self.code_audit.blast_radius_score >= 50:
            risks.append(
                f"Wide blast radius: {len(self.code_audit.impacted_applications)} service(s) "
                f"impacted (score {self.code_audit.blast_radius_score}/100)."
            )
        critical_apps = [a for a in self.code_audit.impacted_applications if a.criticality in ("high", "critical")]
        for app in critical_apps[:3]:
            risks.append(f"Critical dependency at risk: '{app.service_name}' ({app.criticality}).")

        for outage in self.historical.similar_outages[:2]:
            risks.append(
                f"Historically similar to incident '{outage.title}' (similarity "
                f"{outage.similarity_score:.2f}): {outage.root_cause}."
            )

        if not risks:
            risks.append("No elevated risk signal detected; standard deployment risk applies.")
        return risks[:10]

    def _build_teams_notified(self) -> List[str]:
        teams = set()
        for app in self.code_audit.impacted_applications:
            teams.add(_TEAM_OWNER_BY_CRITICALITY.get(app.criticality, "Service Owner Team"))
        if self.historical.historical_severity_signal in ("moderate", "severe"):
            teams.add("Incident Response Team")
        teams.add("Change Advisory Board (CAB)")
        return sorted(teams)

    def _build_mitigation_steps(self, risk_score: int) -> List[Dict[str, Any]]:
        steps: List[Dict[str, Any]] = []
        steps.append({"step_number": 1, "action": "Document rollback procedure before deployment begins.", "owner_team": "Service Owner Team"})
        if risk_score >= 60:
            steps.append({"step_number": len(steps) + 1, "action": "Schedule change during an approved maintenance window with CAB sign-off.", "owner_team": "Change Advisory Board (CAB)"})
        for outage in self.historical.similar_outages[:2]:
            steps.append(
                {
                    "step_number": len(steps) + 1,
                    "action": f"Apply the mitigation that resolved a similar past incident: {outage.mitigation_used}",
                    "owner_team": "SRE",
                }
            )
        steps.append({"step_number": len(steps) + 1, "action": "Deploy to a staging/canary environment first and validate against smoke tests.", "owner_team": "Service Owner Team"})
        steps.append({"step_number": len(steps) + 1, "action": "Monitor error rates, latency, and dependency health for 24 hours post-deployment.", "owner_team": "SRE"})
        return steps[:10]

    # -- deterministic mock-mode responder --------------------------------------

    def mock_respond(self, messages: List[Dict[str, str]], iteration: int) -> str:
        if iteration == 1:
            score_input = {
                "code_audit": self.code_audit.model_dump(),
                "historical": self.historical.model_dump(),
            }
            return (
                "Thought: I must compute the deterministic risk score before drafting anything, "
                "since the numeric score is authoritative.\n"
                "Action: score_risk_matrix\n"
                f"Action Input: {json.dumps(score_input, default=str)}"
            )

        if iteration == 2:
            score_result = score_risk_matrix(
                code_audit=self.code_audit.model_dump(), historical=self.historical.model_dump()
            )
            draft = self._build_draft(score_result["risk_score"])
            return (
                "Thought: I have a draft. Before finalizing I will self-validate it against the "
                "RiskAnalysisReport schema.\n"
                "Action: validate_json_schema\n"
                f"Action Input: {json.dumps({'candidate_json': json.dumps(draft), 'schema_name': 'RiskAnalysisReport'})}"
            )

        score_result = score_risk_matrix(
            code_audit=self.code_audit.model_dump(), historical=self.historical.model_dump()
        )
        draft = self._build_draft(score_result["risk_score"])
        return f"Thought: Self-validation passed; finalizing.\nFinal Answer: {json.dumps(draft)}"

    def _build_draft(self, risk_score: int) -> Dict[str, Any]:
        risk_level = "CRITICAL" if risk_score >= 80 else "HIGH" if risk_score >= 60 else "MEDIUM" if risk_score >= 35 else "LOW"
        applications_impacted = [app.service_name for app in self.code_audit.impacted_applications]
        return {
            "risk_score": risk_score,
            "risk_level": risk_level,
            "top_risks": self._build_top_risks(),
            "applications_impacted": applications_impacted,
            "teams_notified": self._build_teams_notified(),
            "step_by_step_mitigation": self._build_mitigation_steps(risk_score),
            "confidence": 0.9 if self.historical.similar_outages else 0.75,
            "executive_summary": (
                f"The proposed change to '{self.code_audit.primary_component}' scores {risk_score}/100 "
                f"({risk_level}) based on a blast radius of {self.code_audit.blast_radius_score}/100 across "
                f"{len(applications_impacted)} service(s) and a historical severity signal of "
                f"'{self.historical.historical_severity_signal}'. {self.historical.recurring_pattern_summary}"
            ),
        }

    def _fallback_factory(self, raw_text: str, errors: list) -> MalformedOutputFallback:
        applications_impacted = [app.service_name for app in self.code_audit.impacted_applications]
        return MalformedOutputFallback(
            applications_impacted=applications_impacted,
            teams_notified=["Change Advisory Board (CAB)", "Site Reliability Engineering (SRE)"],
            raw_model_output=raw_text[:2000],
            validation_errors=[str(e) for e in errors][:10],
        )

    def _fallback_type(self):
        return MalformedOutputFallback
