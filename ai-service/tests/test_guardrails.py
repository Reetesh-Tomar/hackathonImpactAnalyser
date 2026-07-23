"""
Tests for the MODULE 4 deterministic guardrail / malformed-JSON fallback layer.
"""

import json

from app.agents.guardrails import (
    build_repair_prompt,
    enforce_structured_output,
    extract_json_object,
    parse_and_validate,
)
from app.agents.schemas import MalformedOutputFallback, RiskAnalysisReport


VALID_PAYLOAD = {
    "risk_score": 72,
    "risk_level": "HIGH",
    "top_risks": ["Connection pool exhaustion", "Consumer group rebalancing storm"],
    "applications_impacted": ["kafka-tdh-cluster", "tdh-etl-services"],
    "teams_notified": ["SRE", "Data Platform Team"],
    "step_by_step_mitigation": [
        {"step_number": 1, "action": "Pause ETL consumers", "owner_team": "SRE"},
    ],
    "confidence": 0.85,
    "executive_summary": "High risk Kafka upgrade.",
}


class TestJsonExtraction:
    def test_extracts_fenced_json(self):
        raw = f"Here is my answer:\n```json\n{json.dumps(VALID_PAYLOAD)}\n```\nThanks."
        extracted = extract_json_object(raw)
        assert extracted is not None
        assert json.loads(extracted)["risk_score"] == 72

    def test_extracts_bare_json(self):
        raw = json.dumps(VALID_PAYLOAD)
        extracted = extract_json_object(raw)
        assert json.loads(extracted)["risk_score"] == 72

    def test_extracts_json_with_surrounding_prose(self):
        raw = f"Thought: done.\nFinal Answer: {json.dumps(VALID_PAYLOAD)}"
        extracted = extract_json_object(raw)
        assert extracted is not None
        assert json.loads(extracted)["risk_score"] == 72

    def test_returns_none_for_non_json(self):
        assert extract_json_object("no json here at all") is None

    def test_returns_none_for_empty_string(self):
        assert extract_json_object("") is None


class TestParseAndValidate:
    def test_valid_payload_parses(self):
        instance, errors = parse_and_validate(json.dumps(VALID_PAYLOAD), RiskAnalysisReport)
        assert instance is not None
        assert errors == []
        assert instance.risk_score == 72
        assert instance.risk_level.value == "HIGH"

    def test_invalid_json_returns_errors(self):
        # A '{' with no matching '}' cannot be located as a JSON-object-shaped
        # substring at all, so extraction itself fails before JSON parsing runs.
        instance, errors = parse_and_validate("{not valid json", RiskAnalysisReport)
        assert instance is None
        assert len(errors) == 1
        assert "No JSON object could be located" in errors[0]

    def test_malformed_but_bracket_balanced_json_returns_decode_error(self):
        # This IS located as a JSON-object-shaped substring (balanced braces)
        # but fails to actually parse, so this exercises the JSONDecodeError path.
        instance, errors = parse_and_validate('{"risk_score": 72,}', RiskAnalysisReport)
        assert instance is None
        assert len(errors) == 1
        assert "JSONDecodeError" in errors[0]

    def test_schema_violation_returns_errors(self):
        bad_payload = dict(VALID_PAYLOAD)
        bad_payload["risk_score"] = 500  # out of 1-100 bounds
        instance, errors = parse_and_validate(json.dumps(bad_payload), RiskAnalysisReport)
        assert instance is None
        assert len(errors) > 0

    def test_risk_level_is_corrected_to_match_score(self):
        mismatched = dict(VALID_PAYLOAD)
        mismatched["risk_score"] = 95
        mismatched["risk_level"] = "LOW"  # deliberately wrong
        instance, errors = parse_and_validate(json.dumps(mismatched), RiskAnalysisReport)
        assert instance is not None
        assert instance.risk_level.value == "CRITICAL"  # corrected deterministically


class TestEnforceStructuredOutput:
    def test_valid_output_returns_schema_instance(self):
        result = enforce_structured_output(json.dumps(VALID_PAYLOAD), RiskAnalysisReport)
        assert isinstance(result, RiskAnalysisReport)
        assert result.risk_score == 72

    def test_malformed_output_without_repair_returns_fallback(self):
        result = enforce_structured_output("this is not json at all", RiskAnalysisReport)
        assert isinstance(result, MalformedOutputFallback)
        assert result.is_fallback is True
        assert result.confidence == 0.0

    def test_repair_fn_is_used_to_fix_malformed_output(self):
        def repair_fn(raw_text: str, errors: list) -> str:
            return json.dumps(VALID_PAYLOAD)

        result = enforce_structured_output(
            "totally broken output", RiskAnalysisReport, repair_fn=repair_fn
        )
        assert isinstance(result, RiskAnalysisReport)
        assert result.risk_score == 72

    def test_repair_fn_that_also_fails_falls_back(self):
        def repair_fn(raw_text: str, errors: list) -> str:
            return "still not valid json"

        result = enforce_structured_output(
            "totally broken output", RiskAnalysisReport, repair_fn=repair_fn
        )
        assert isinstance(result, MalformedOutputFallback)

    def test_custom_fallback_factory_is_used(self):
        sentinel = object()

        def fallback_factory(raw_text: str, errors: list):
            return sentinel

        result = enforce_structured_output(
            "broken", RiskAnalysisReport, fallback_factory=fallback_factory
        )
        assert result is sentinel


class TestRepairPromptConstruction:
    def test_repair_prompt_includes_errors_and_schema(self):
        prompt = build_repair_prompt(RiskAnalysisReport, "{bad json", ["some error"])
        assert "some error" in prompt
        assert "risk_score" in prompt
        assert "JSON only" in prompt
