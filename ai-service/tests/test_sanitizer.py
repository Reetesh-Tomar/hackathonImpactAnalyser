"""
Tests for the MODULE 2 local PII/credential sanitization engine.
"""

import pytest

from app.security.sanitizer import (
    LocalSanitizer,
    RedactionCategory,
    SanitizationError,
    default_sanitizer,
    shannon_entropy,
)


class TestRegexSignatures:
    def test_db_connection_string_is_redacted(self):
        text = "conn = postgresql://admin:s3cr3t@db-host:5432/mydb"
        clean, report = default_sanitizer.sanitize(text, strict=False)
        assert "<REDACTED_DB_STRING>" in clean
        assert "s3cr3t" not in clean
        assert report.redactions_by_category.get("DB_CONNECTION_STRING") == 1

    def test_jdbc_connection_string_is_redacted(self):
        text = "jdbc:postgresql://admin:hunter2@db-internal.tdh.corp:5432/tdh"
        clean, _ = default_sanitizer.sanitize(text, strict=False)
        assert "hunter2" not in clean
        assert "<REDACTED_DB_STRING>" in clean

    def test_aws_access_key_is_redacted(self):
        text = "AWS_ACCESS_KEY_ID=AKIAABCDEFGHIJKLMNOP"
        clean, report = default_sanitizer.sanitize(text, strict=False)
        assert "AKIAABCDEFGHIJKLMNOP" not in clean
        assert report.redactions_by_category.get("CLOUD_API_KEY") == 1

    def test_openai_style_key_is_redacted(self):
        text = "OPENAI_API_KEY=sk-abcdefghijklmnopqrstuvwx1234"
        clean, _ = default_sanitizer.sanitize(text, strict=False)
        assert "<REDACTED_API_KEY>" in clean

    def test_private_ip_is_redacted(self):
        for ip in ["10.23.5.100", "192.168.1.5", "172.16.0.1"]:
            clean, _ = default_sanitizer.sanitize(f"host at {ip}", strict=False)
            assert ip not in clean
            assert "<REDACTED_IP_ADDRESS>" in clean

    def test_internal_hostname_is_redacted(self):
        text = "Internal host: kafka-broker-01.tdh.corp is unreachable"
        clean, _ = default_sanitizer.sanitize(text, strict=False)
        assert "kafka-broker-01.tdh.corp" not in clean
        assert "<REDACTED_INTERNAL_HOST>" in clean

    def test_email_is_redacted(self):
        text = "Contact ops-team@bank.internal for access"
        clean, _ = default_sanitizer.sanitize(text, strict=False)
        assert "ops-team@bank.internal" not in clean

    def test_generic_secret_assignment_is_redacted(self):
        text = 'password: "myS3cretValue!"'
        clean, _ = default_sanitizer.sanitize(text, strict=False)
        assert "myS3cretValue" not in clean

    def test_private_key_block_is_redacted(self):
        text = (
            "-----BEGIN RSA PRIVATE KEY-----\n"
            "MIIBOgIBAAJBAK...\n"
            "-----END RSA PRIVATE KEY-----"
        )
        clean, _ = default_sanitizer.sanitize(text, strict=False)
        assert "MIIBOgIBAAJBAK" not in clean
        assert "<REDACTED_PRIVATE_KEY>" in clean

    def test_non_secret_text_is_untouched(self):
        text = "Upgrade the Kafka consumer group rebalancing strategy for tdh-etl-services."
        clean, report = default_sanitizer.sanitize(text, strict=True)
        assert clean == text
        assert report.total_redactions == 0
        assert report.is_safe_for_llm is True

    def test_empty_string_returns_safe(self):
        clean, report = default_sanitizer.sanitize("", strict=True)
        assert clean == ""
        assert report.total_redactions == 0
        assert report.is_safe_for_llm is True


class TestEntropyLayer:
    def test_shannon_entropy_of_repeated_char_is_zero(self):
        assert shannon_entropy("aaaaaaaa") == 0.0

    def test_shannon_entropy_of_random_token_is_high(self):
        token = "aZ3xQ9mK7pL2wR8sT1vN4bH6cD0jF5gY"
        assert shannon_entropy(token) > 3.5

    def test_high_entropy_opaque_token_is_redacted(self):
        sanitizer = LocalSanitizer(entropy_threshold=3.8, min_entropy_token_length=20)
        token = "aZ3xQ9mK7pL2wR8sT1vN4bH6cD0jF5gY9xR2"
        text = f"rotated_secret = {token}"
        clean, report = sanitizer.sanitize(text, strict=False)
        assert token not in clean
        assert any(e.detector == "entropy" for e in report.events) or "<REDACTED" in clean

    def test_natural_language_is_not_flagged_as_high_entropy(self):
        sanitizer = LocalSanitizer()
        text = "this.is.a.perfectly.normal.dotted.identifier.path.for.a.java.class"
        clean, report = sanitizer.sanitize(text, strict=False)
        assert clean == text


class TestFailClosedBehavior:
    def test_strict_mode_raises_on_residual_risk(self):
        sanitizer = LocalSanitizer()
        # Deliberately crafted so neither the regex layer (no ':'/'=' separator
        # for the generic-secret-assignment pattern) nor the entropy layer
        # (token is only 18 chars, below the 20-char minimum scan length) fires,
        # but the residual-risk safety net still catches 'password' directly
        # adjacent to a long opaque alphanumeric token.
        text = "password ABC123xyz789LMN045"
        with pytest.raises(SanitizationError):
            sanitizer.sanitize(text, strict=True)

    def test_non_strict_mode_does_not_raise(self):
        sanitizer = LocalSanitizer()
        text = "password ABC123xyz789LMN045"
        clean, report = sanitizer.sanitize(text, strict=False)
        assert isinstance(clean, str)
        assert report.is_safe_for_llm is True  # non-strict mode never flips this flag


class TestRedactionCategoryTagging:
    def test_all_categories_have_a_tag(self):
        from app.security.sanitizer import REDACTION_TAGS

        for category in RedactionCategory:
            assert category in REDACTION_TAGS
            assert REDACTION_TAGS[category].startswith("<REDACTED")
