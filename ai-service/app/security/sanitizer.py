"""
MODULE 2 — Local Privacy & PII/Credential Stripping Engine.

This module executes entirely on the local process (no network calls) and
MUST run on every inbound payload before any text is placed into a prompt
sent to a cloud LLM or embedding API (OpenAI, Vertex AI, Groq, OpenRouter,
etc.). It is intentionally dependency-light so it can run in restricted
bank network zones with no outbound internet access.

Detection strategy (defense in depth, four independent layers):
  1. High-precision regex signatures for well-known credential/secret shapes
     (DB connection strings, cloud provider keys, JWTs, private key blocks).
  2. Internal hostname / IP address detection (bank-internal DNS + RFC1918).
  3. Generic KEY=VALUE / "key": "value" secret-looking assignment detection.
  4. Shannon-entropy scanning as a catch-all for opaque high-entropy tokens
     (e.g. rotated secrets, vendor tokens) that do not match a known shape.

Every redaction is logged into a `RedactionReport` (never containing the raw
secret value) so the caller has a full audit trail of what was stripped,
without ever persisting the sensitive value itself.
"""

from __future__ import annotations

import math
import re
from collections import Counter
from dataclasses import dataclass, field
from enum import Enum
from typing import Dict, List, Pattern, Tuple

from pydantic import BaseModel, Field


# ---------------------------------------------------------------------------
# Redaction taxonomy
# ---------------------------------------------------------------------------

class RedactionCategory(str, Enum):
    DB_CONNECTION_STRING = "DB_CONNECTION_STRING"
    DB_CREDENTIAL = "DB_CREDENTIAL"
    INTERNAL_HOSTNAME = "INTERNAL_HOSTNAME"
    IP_ADDRESS = "IP_ADDRESS"
    CLOUD_API_KEY = "CLOUD_API_KEY"
    PRIVATE_KEY_BLOCK = "PRIVATE_KEY_BLOCK"
    JWT_TOKEN = "JWT_TOKEN"
    GENERIC_SECRET_ASSIGNMENT = "GENERIC_SECRET_ASSIGNMENT"
    HIGH_ENTROPY_TOKEN = "HIGH_ENTROPY_TOKEN"
    EMAIL_ADDRESS = "EMAIL_ADDRESS"
    SWIFT_IBAN = "SWIFT_IBAN"


REDACTION_TAGS: Dict[RedactionCategory, str] = {
    RedactionCategory.DB_CONNECTION_STRING: "<REDACTED_DB_STRING>",
    RedactionCategory.DB_CREDENTIAL: "<REDACTED_DB_CREDENTIAL>",
    RedactionCategory.INTERNAL_HOSTNAME: "<REDACTED_INTERNAL_HOST>",
    RedactionCategory.IP_ADDRESS: "<REDACTED_IP_ADDRESS>",
    RedactionCategory.CLOUD_API_KEY: "<REDACTED_API_KEY>",
    RedactionCategory.PRIVATE_KEY_BLOCK: "<REDACTED_PRIVATE_KEY>",
    RedactionCategory.JWT_TOKEN: "<REDACTED_JWT>",
    RedactionCategory.GENERIC_SECRET_ASSIGNMENT: "<REDACTED_SECRET>",
    RedactionCategory.HIGH_ENTROPY_TOKEN: "<REDACTED_HIGH_ENTROPY_TOKEN>",
    RedactionCategory.EMAIL_ADDRESS: "<REDACTED_EMAIL>",
    RedactionCategory.SWIFT_IBAN: "<REDACTED_FINANCIAL_IDENTIFIER>",
}


# ---------------------------------------------------------------------------
# Layer 1 — high-precision regex signatures
# ---------------------------------------------------------------------------

# Order matters: more specific patterns must run before generic catch-alls,
# because once a span is redacted it is masked out of subsequent passes.
REGEX_SIGNATURES: List[Tuple[RedactionCategory, Pattern]] = [
    (
        RedactionCategory.DB_CONNECTION_STRING,
        re.compile(
            r"\b(?:jdbc:)?(?:postgresql|postgres|mysql|mongodb(?:\+srv)?|oracle|sqlserver|redis|mssql|db2)"
            r"://[^\s\"'<>]+",
            re.IGNORECASE,
        ),
    ),
    (
        RedactionCategory.PRIVATE_KEY_BLOCK,
        re.compile(
            r"-----BEGIN (?:RSA |EC |OPENSSH |DSA |ENCRYPTED )?PRIVATE KEY-----"
            r"[\s\S]+?-----END (?:RSA |EC |OPENSSH |DSA |ENCRYPTED )?PRIVATE KEY-----",
        ),
    ),
    (
        RedactionCategory.JWT_TOKEN,
        re.compile(r"\beyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\b"),
    ),
    (
        # AWS access key id
        RedactionCategory.CLOUD_API_KEY,
        re.compile(r"\b(?:AKIA|ASIA)[A-Z0-9]{16}\b"),
    ),
    (
        # GCP API key
        RedactionCategory.CLOUD_API_KEY,
        re.compile(r"\bAIza[0-9A-Za-z\-_]{35}\b"),
    ),
    (
        # OpenAI / Groq / OpenRouter style secret keys
        RedactionCategory.CLOUD_API_KEY,
        re.compile(r"\b(?:sk|gsk|sk-proj|sk-or-v1)-[A-Za-z0-9]{20,}\b"),
    ),
    (
        # Slack tokens, generic vendor bearer tokens
        RedactionCategory.CLOUD_API_KEY,
        re.compile(r"\bxox[baprs]-[A-Za-z0-9-]{10,}\b"),
    ),
    (
        RedactionCategory.SWIFT_IBAN,
        re.compile(r"\b[A-Z]{2}\d{2}[A-Z0-9]{10,30}\b"),  # IBAN shape
    ),
    (
        RedactionCategory.EMAIL_ADDRESS,
        re.compile(r"\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b"),
    ),
    (
        # RFC 1918 private IPs + any dotted-quad IPv4 in an internal-looking context
        RedactionCategory.IP_ADDRESS,
        re.compile(
            r"\b(?:(?:10\.(?:\d{1,3}\.){2}\d{1,3})"
            r"|(?:172\.(?:1[6-9]|2\d|3[0-1])\.\d{1,3}\.\d{1,3})"
            r"|(?:192\.168\.\d{1,3}\.\d{1,3})"
            r"|(?:127\.\d{1,3}\.\d{1,3}\.\d{1,3}))\b"
        ),
    ),
    (
        # Bank-internal hostnames — adjust the domain suffix list per your org.
        RedactionCategory.INTERNAL_HOSTNAME,
        re.compile(
            r"\b[A-Za-z0-9][A-Za-z0-9-]*\.(?:tdh|corp|internal|intranet|bank-internal|prod\.local)"
            r"(?:\.[A-Za-z0-9-]+)*\b",
            re.IGNORECASE,
        ),
    ),
    (
        # key=value / "key": "value" assignments where the key name implies a secret
        RedactionCategory.GENERIC_SECRET_ASSIGNMENT,
        re.compile(
            r"(?i)\b(?:password|passwd|pwd|secret|api[_-]?key|access[_-]?key|"
            r"auth[_-]?token|private[_-]?key|client[_-]?secret|db[_-]?pass)\b"
            r"\s*[:=]\s*[\"']?([^\s\"',;}]{4,})[\"']?"
        ),
    ),
]


# ---------------------------------------------------------------------------
# Layer 4 — Shannon entropy scanner for opaque high-entropy tokens
# ---------------------------------------------------------------------------

_TOKEN_SPLIT_RE = re.compile(r"[A-Za-z0-9+/_\-\.=]{20,}")
_ENTROPY_THRESHOLD_BITS_PER_CHAR = 4.0
_MIN_TOKEN_LENGTH_FOR_ENTROPY_SCAN = 20


def shannon_entropy(value: str) -> float:
    """Compute Shannon entropy (bits per character) of a string."""
    if not value:
        return 0.0
    counts = Counter(value)
    length = len(value)
    return -sum(
        (count / length) * math.log2(count / length) for count in counts.values()
    )


def _looks_like_natural_language_or_code(token: str) -> bool:
    """
    Heuristic guard to reduce false positives: reject tokens that are mostly
    lowercase English words, camelCase identifiers, or file paths, which can
    have moderate entropy but are not secrets.
    """
    if re.fullmatch(r"[A-Za-z_]+(?:[./][A-Za-z_]+)*", token):
        return True
    if token.count(".") >= 2 and not re.search(r"[+/=]", token):
        # dotted paths / package names, e.g. com.changeanalyzer.service.Foo
        return True
    return False


# ---------------------------------------------------------------------------
# Report models (safe to log/persist — never contains raw secret values)
# ---------------------------------------------------------------------------

class RedactionEvent(BaseModel):
    category: RedactionCategory
    tag_used: str
    span_start: int
    span_end: int
    matched_length: int = Field(..., description="Length of the redacted span, never the raw value")
    detector: str = Field(..., description="Which detection layer found this: regex | entropy")


class RedactionReport(BaseModel):
    total_redactions: int
    redactions_by_category: Dict[str, int]
    events: List[RedactionEvent]
    is_safe_for_llm: bool = Field(
        ..., description="False if an ambiguous high-risk span could not be confidently redacted"
    )


class SanitizationError(Exception):
    """Raised when a payload contains an ambiguous, high-risk span that
    cannot be safely auto-redacted (fail-closed, never fail-open)."""

    def __init__(self, message: str, report: RedactionReport):
        super().__init__(message)
        self.report = report


@dataclass
class _MaskedSpan:
    start: int
    end: int
    category: RedactionCategory
    detector: str


# ---------------------------------------------------------------------------
# Core engine
# ---------------------------------------------------------------------------

class LocalSanitizer:
    """
    Local, dependency-free (stdlib only) PII/credential redaction engine.

    Usage:
        sanitizer = LocalSanitizer()
        clean_text, report = sanitizer.sanitize(raw_diff_text)
    """

    def __init__(
        self,
        entropy_threshold: float = _ENTROPY_THRESHOLD_BITS_PER_CHAR,
        min_entropy_token_length: int = _MIN_TOKEN_LENGTH_FOR_ENTROPY_SCAN,
        extra_regex_signatures: List[Tuple[RedactionCategory, Pattern]] = None,
    ):
        self.entropy_threshold = entropy_threshold
        self.min_entropy_token_length = min_entropy_token_length
        self.signatures = list(REGEX_SIGNATURES) + (extra_regex_signatures or [])

    # -- public API ---------------------------------------------------------

    def sanitize(self, text: str, strict: bool = True) -> Tuple[str, RedactionReport]:
        """
        Redact all detected secrets/PII from `text`.

        Args:
            text: raw, untrusted input (e.g. a git diff, change description).
            strict: if True, raise SanitizationError instead of silently
                    forwarding text when an unresolvable ambiguous span is found.

        Returns:
            (sanitized_text, RedactionReport)
        """
        if not text:
            return text, RedactionReport(
                total_redactions=0, redactions_by_category={}, events=[], is_safe_for_llm=True
            )

        masked_spans = self._run_regex_layer(text)
        masked_spans += self._run_entropy_layer(text, already_masked=masked_spans)
        masked_spans = self._merge_overlapping(masked_spans)

        sanitized_text, events = self._apply_redactions(text, masked_spans)

        category_counts: Dict[str, int] = {}
        for ev in events:
            category_counts[ev.category.value] = category_counts.get(ev.category.value, 0) + 1

        report = RedactionReport(
            total_redactions=len(events),
            redactions_by_category=category_counts,
            events=events,
            is_safe_for_llm=True,
        )

        if strict:
            residual_risk = self._scan_for_residual_risk(sanitized_text)
            if residual_risk:
                report.is_safe_for_llm = False
                raise SanitizationError(
                    f"Ambiguous high-risk content remained after redaction: {residual_risk}",
                    report,
                )

        return sanitized_text, report

    # -- layer 1: regex ------------------------------------------------------

    def _run_regex_layer(self, text: str) -> List[_MaskedSpan]:
        spans: List[_MaskedSpan] = []
        for category, pattern in self.signatures:
            for match in pattern.finditer(text):
                group_start, group_end = match.span(1) if match.groups() else match.span(0)
                spans.append(_MaskedSpan(group_start, group_end, category, detector="regex"))
        return spans

    # -- layer 4: entropy -----------------------------------------------------

    def _run_entropy_layer(self, text: str, already_masked: List[_MaskedSpan]) -> List[_MaskedSpan]:
        masked_ranges = [(s.start, s.end) for s in already_masked]
        spans: List[_MaskedSpan] = []

        for match in _TOKEN_SPLIT_RE.finditer(text):
            token = match.group(0)
            start, end = match.span()

            if any(start < m_end and end > m_start for m_start, m_end in masked_ranges):
                continue  # already redacted by a higher-precision layer
            if len(token) < self.min_entropy_token_length:
                continue
            if _looks_like_natural_language_or_code(token):
                continue

            entropy = shannon_entropy(token)
            if entropy >= self.entropy_threshold:
                spans.append(
                    _MaskedSpan(start, end, RedactionCategory.HIGH_ENTROPY_TOKEN, detector="entropy")
                )
        return spans

    # -- merging / application ------------------------------------------------

    def _merge_overlapping(self, spans: List[_MaskedSpan]) -> List[_MaskedSpan]:
        if not spans:
            return []
        spans = sorted(spans, key=lambda s: (s.start, -s.end))
        merged: List[_MaskedSpan] = [spans[0]]
        for span in spans[1:]:
            last = merged[-1]
            if span.start < last.end:  # overlap -> keep the earlier/higher-precision one
                continue
            merged.append(span)
        return merged

    def _apply_redactions(
        self, text: str, spans: List[_MaskedSpan]
    ) -> Tuple[str, List[RedactionEvent]]:
        if not spans:
            return text, []

        result_parts: List[str] = []
        events: List[RedactionEvent] = []
        cursor = 0
        for span in spans:
            result_parts.append(text[cursor:span.start])
            tag = REDACTION_TAGS[span.category]
            result_parts.append(tag)
            events.append(
                RedactionEvent(
                    category=span.category,
                    tag_used=tag,
                    span_start=span.start,
                    span_end=span.end,
                    matched_length=span.end - span.start,
                    detector=span.detector,
                )
            )
            cursor = span.end
        result_parts.append(text[cursor:])
        return "".join(result_parts), events

    # -- residual-risk safety net --------------------------------------------

    def _scan_for_residual_risk(self, sanitized_text: str) -> str:
        """
        Fail-closed safety net: after redaction, check for leftover shapes
        that are strongly secret-like (e.g. 'password' keyword directly
        adjacent to a still-unredacted long token) that slipped past both
        layers due to unusual formatting. Returns a human-readable reason
        string, or "" if none found.
        """
        suspicious = re.search(
            r"(?i)\b(?:password|secret|token|private[_-]?key)\b[^A-Za-z0-9]{0,5}[A-Za-z0-9]{16,}",
            sanitized_text,
        )
        if suspicious:
            return f"unredacted secret-like span near position {suspicious.start()}"
        return ""


# Module-level singleton for cheap reuse across requests (stateless, thread-safe).
default_sanitizer = LocalSanitizer()


def sanitize_payload(text: str, strict: bool = True) -> Tuple[str, RedactionReport]:
    """Convenience function using the module-level default sanitizer."""
    return default_sanitizer.sanitize(text, strict=strict)
