"""
End-to-end tests for the MODULE 1 3-agent ReAct pipeline (mock mode).
"""

import os

import pytest

from app.agents.react.api_models import ChangeAnalysisRequestV2
from app.agents.react.base_react_agent import MAX_ITERATIONS
from app.agents.react.react_executor import ReactPipelineExecutor
from app.agents.schemas import MalformedOutputFallback
from app.security.sanitizer import SanitizationError


@pytest.fixture(autouse=True)
def force_mock_provider(monkeypatch):
    monkeypatch.setenv("AI_PROVIDER", "mock")


@pytest.fixture
def executor():
    return ReactPipelineExecutor()


class TestReactAgentProviderIsolation:
    """
    Regression test: the ReAct pipeline's agents (used by
    /api/v2/.../analyze-react) must default to the mock provider even when
    AI_PROVIDER is configured with a live provider for chat, for the same
    reason as the v1 pipeline (see test_agents.py::TestPipelineProviderIsolation).
    """

    def test_react_agent_ignores_ai_provider_and_defaults_to_mock(self, monkeypatch):
        from app.agents.react.code_auditor_agent import CodeAuditorAgent

        monkeypatch.setenv("AI_PROVIDER", "ollama")
        monkeypatch.delenv("PIPELINE_AI_PROVIDER", raising=False)
        agent = CodeAuditorAgent({"change_title": "t", "change_description": "d", "target_component": "c"})
        assert agent.provider == "mock"

    def test_react_agent_honors_explicit_pipeline_ai_provider_override(self, monkeypatch):
        from app.agents.react.code_auditor_agent import CodeAuditorAgent

        monkeypatch.setenv("AI_PROVIDER", "mock")
        monkeypatch.setenv("PIPELINE_AI_PROVIDER", "ollama")
        agent = CodeAuditorAgent({"change_title": "t", "change_description": "d", "target_component": "c"})
        assert agent.provider == "ollama"


class TestReactPipelineExecutor:
    def test_end_to_end_analysis_returns_valid_strict_schema(self, executor):
        request = ChangeAnalysisRequestV2(
            change_title="Upgrade Kafka Cluster 3.4 to 3.7",
            change_description="Rolling upgrade of Kafka cluster used by TDH ETL and orchestration.",
            target_component="kafka-tdh-cluster",
            raw_diff_text=(
                "diff --git a/src/main/java/com/changeanalyzer/service/KafkaConsumerConfig.java "
                "b/src/main/java/com/changeanalyzer/service/KafkaConsumerConfig.java\n"
                "+public class KafkaConsumerConfig {\n"
                "+    public void configure() {}\n"
                "+}\n"
            ),
        )
        response = executor.analyze(request)

        assert 1 <= response.risk_score <= 100
        assert response.risk_level in ("LOW", "MEDIUM", "HIGH", "CRITICAL")
        assert isinstance(response.top_risks, list) and len(response.top_risks) >= 1
        assert isinstance(response.applications_impacted, list) and len(response.applications_impacted) >= 1
        assert isinstance(response.teams_notified, list) and len(response.teams_notified) >= 1
        assert isinstance(response.step_by_step_mitigation, list) and len(response.step_by_step_mitigation) >= 1
        assert response.is_fallback is False
        assert response.analysis_id.startswith("CIA-REACT-")

    def test_secrets_in_description_are_redacted_before_pipeline_runs(self, executor):
        request = ChangeAnalysisRequestV2(
            change_title="Rotate DB credentials",
            change_description=(
                "Connection string jdbc:postgresql://admin:hunter2@db-internal.tdh.corp:5432/tdh "
                "must be updated across all consumers."
            ),
            target_component="oracle-db-tdh-production",
        )
        response = executor.analyze(request)

        assert response.redaction_report.total_redactions >= 1
        assert "DB_CONNECTION_STRING" in response.redaction_report.redactions_by_category
        # The raw secret must never appear anywhere in the final response payload.
        serialized = response.model_dump_json()
        assert "hunter2" not in serialized

    def test_each_agent_respects_the_max_iteration_cap(self, executor):
        request = ChangeAnalysisRequestV2(
            change_title="Feature flag rollout",
            change_description="Enable new checkout flag for 5% of traffic.",
            target_component="checkout-service",
        )
        response = executor.analyze(request)

        for trace in response.agent_traces:
            assert len(trace.steps) <= MAX_ITERATIONS + 1  # +1 accounts for the forced finalize turn
            assert trace.elapsed_ms >= 0

    def test_unresolvable_target_component_still_produces_a_safe_verdict(self, executor):
        request = ChangeAnalysisRequestV2(
            change_title="Totally unknown component change",
            change_description="Change to a component that does not exist in the CMDB.",
            target_component="nonexistent-service-xyz",
        )
        response = executor.analyze(request)

        assert isinstance(response.risk_score, int)
        assert response.applications_impacted  # falls back to the target component itself

    def test_sanitization_error_is_propagated_for_ambiguous_high_risk_input(self, executor):
        request = ChangeAnalysisRequestV2(
            change_title="Suspicious change",
            change_description="password ABC123xyz789LMN045",
            target_component="unknown-service",
        )
        with pytest.raises(SanitizationError):
            executor.analyze(request)
