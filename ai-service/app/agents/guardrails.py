"""
MODULE 4 — Deterministic guardrail enforcement + malformed-JSON fallback.

This is the "Instructor-style" validation layer: given a raw LLM text
response that is SUPPOSED to be a single JSON object matching a Pydantic
schema, this module:

  1. Extracts the JSON object defensively (strips markdown fences, trims
     leading/trailing prose the model may have added despite instructions).
  2. Validates it against the target Pydantic schema.
  3. On failure, issues ONE bounded "repair" retry: it re-prompts the LLM
     with the exact validation error and asks it to return corrected JSON
     ONLY.
  4. If the repair retry also fails, returns a safe, schema-conformant
     `MalformedOutputFallback` object instead of raising — callers can
     always trust that they get back *some* valid, typed object.
"""

from __future__ import annotations

import json
import logging
import re
from typing import Callable, Optional, Tuple, Type, TypeVar

from pydantic import BaseModel, ValidationError

from app.agents.schemas import MalformedOutputFallback

logger = logging.getLogger(__name__)

SchemaT = TypeVar("SchemaT", bound=BaseModel)

_JSON_FENCE_RE = re.compile(r"```(?:json)?\s*(\{[\s\S]*?\})\s*```", re.IGNORECASE)
_FIRST_JSON_OBJECT_RE = re.compile(r"\{[\s\S]*\}")


class GuardrailValidationError(Exception):
    """Raised when structured output fails validation even after the repair retry."""

    def __init__(self, message: str, raw_output: str, validation_errors: list):
        super().__init__(message)
        self.raw_output = raw_output
        self.validation_errors = validation_errors


def extract_json_object(raw_text: str) -> Optional[str]:
    """
    Best-effort extraction of a single JSON object from an LLM response that
    may contain markdown fences or stray prose despite being instructed not
    to. Returns None if no JSON-object-shaped substring can be found.
    """
    if not raw_text:
        return None

    fenced = _JSON_FENCE_RE.search(raw_text)
    if fenced:
        return fenced.group(1)

    stripped = raw_text.strip()
    if stripped.startswith("{") and stripped.endswith("}"):
        return stripped

    loose_match = _FIRST_JSON_OBJECT_RE.search(raw_text)
    if loose_match:
        return loose_match.group(0)

    return None


def parse_and_validate(raw_text: str, schema: Type[SchemaT]) -> Tuple[Optional[SchemaT], list]:
    """
    Attempt to parse raw_text as JSON and validate it against `schema`.
    Returns (validated_instance_or_None, list_of_error_strings).
    """
    json_str = extract_json_object(raw_text)
    if json_str is None:
        return None, [f"No JSON object could be located in model output: {raw_text[:200]!r}"]

    try:
        parsed = json.loads(json_str)
    except json.JSONDecodeError as exc:
        return None, [f"JSONDecodeError: {exc.msg} at line {exc.lineno} column {exc.colno}"]

    try:
        instance = schema.model_validate(parsed)
        return instance, []
    except ValidationError as exc:
        return None, [str(err) for err in exc.errors()]


def enforce_structured_output(
    raw_text: str,
    schema: Type[SchemaT],
    repair_fn: Optional[Callable[[str, list], str]] = None,
    fallback_factory: Optional[Callable[[str, list], BaseModel]] = None,
) -> BaseModel:
    """
    The main guardrail entry point used by every ReAct agent's finalize step.

    Args:
        raw_text: the LLM's raw Final Answer text.
        schema: the Pydantic model the output must conform to.
        repair_fn: optional callback `(raw_text, errors) -> new_raw_text` that
            re-prompts the LLM with the validation errors for ONE bounded
            repair attempt. If omitted, no repair attempt is made.
        fallback_factory: optional callback `(raw_text, errors) -> BaseModel`
            used instead of the generic MalformedOutputFallback when the
            caller wants a schema-specific safe default (e.g. Code Auditor
            and Historical Detective use lightweight in-agent fallbacks;
            the Risk Synthesizer — the final API output — uses
            MalformedOutputFallback because that shape must always be
            presentable directly to the end user).

    Returns:
        A validated instance of `schema`, or a fallback object if validation
        could not be satisfied even after the repair attempt. This function
        NEVER raises for malformed JSON — it always returns something
        typed and safe to serialize back to the caller.
    """
    instance, errors = parse_and_validate(raw_text, schema)
    if instance is not None:
        return instance

    logger.warning("Structured output failed validation on first attempt: %s", errors)

    if repair_fn is not None:
        try:
            repaired_text = repair_fn(raw_text, errors)
            instance, repair_errors = parse_and_validate(repaired_text, schema)
            if instance is not None:
                return instance
            errors = repair_errors
            raw_text = repaired_text
            logger.warning("Structured output failed validation after repair retry: %s", errors)
        except Exception as exc:
            errors = errors + [f"repair_fn raised: {exc}"]

    if fallback_factory is not None:
        return fallback_factory(raw_text, errors)

    return MalformedOutputFallback(
        raw_model_output=raw_text[:2000],
        validation_errors=[str(e) for e in errors][:10],
    )


def build_repair_prompt(schema: Type[BaseModel], raw_text: str, errors: list) -> str:
    """
    Compose the exact re-prompt text sent back to the LLM for the single
    bounded repair attempt. Kept as a standalone function so it can be unit
    tested independently of any live LLM call.
    """
    schema_json = json.dumps(schema.model_json_schema(), indent=2)
    error_lines = "\n".join(f"- {e}" for e in errors[:10])
    return (
        "Your previous response did not parse as valid JSON matching the "
        "required schema.\n\n"
        f"Validation errors:\n{error_lines}\n\n"
        f"Required JSON schema:\n{schema_json}\n\n"
        f"Your previous response was:\n{raw_text[:1500]}\n\n"
        "Respond again with ONLY the corrected raw JSON object. No markdown "
        "fences, no prose, no explanation — JSON only."
    )
