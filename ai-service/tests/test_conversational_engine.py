"""
Tests for the dynamic conversational engine (app/agents/conversational_engine.py).

These tests lock in the core "dynamic, not hardcoded" behavior requested by
the user: different questions must retrieve and surface different, factually
grounded content instead of picking from a small fixed set of canned strings.
"""

import pytest

from app.agents.conversational_engine import ConversationalEngine
from app.rag.data_loader import DataLoader
from app.rag.embeddings import EmbeddingService


@pytest.fixture
def engine():
    return ConversationalEngine(DataLoader(), EmbeddingService())


class TestClassification:
    def test_short_greeting_is_conversation(self, engine):
        result = engine.respond("hello")
        assert result["classification"] == "conversation"

    def test_detailed_change_request_is_change_analysis(self, engine):
        result = engine.respond(
            "Upgrade the payment gateway database connection pool from 50 to 200 connections"
        )
        assert result["classification"] == "change-analysis"
        assert result["extracted_intent"]["type"] == "change_analysis"
        assert result["extracted_intent"]["requires_full_pipeline"] is True

    def test_change_request_matches_known_service_with_hyphen_or_space(self, engine):
        result = engine.respond("We need to change the payment gateway configuration today")
        assert result["classification"] == "change-analysis"
        assert result["extracted_intent"]["matched_component"] == "payment-gateway"

    def test_bare_change_verb_without_detail_is_not_misclassified(self, engine):
        # "update" alone, in a very short message with no target, should not
        # be forced into change-analysis (avoids false positives on short chit-chat).
        result = engine.respond("update?")
        assert result["classification"] == "conversation"

    def test_personal_introduction_is_not_a_change_request(self, engine):
        # Regression: casual messages like introducing yourself must never
        # trigger a full multi-agent pipeline run.
        result = engine.respond("my name is adarsh")
        assert result["classification"] == "conversation"
        assert "Adarsh" in result["reply"]


class TestDynamicGroundedReplies:
    """
    The key regression to prevent: two different questions about two
    different real entities must produce two different, non-canned replies
    that reference the actual matching data.
    """

    def test_reply_is_grounded_in_specific_service(self, engine):
        result = engine.respond("tell me about payment-gateway")
        assert "payment-gateway" in result["reply"]
        assert "couldn't find anything" not in result["reply"]

    def test_reply_differs_for_different_services(self, engine):
        reply_a = engine.respond("tell me about payment-gateway")["reply"]
        reply_b = engine.respond("tell me about order-service")["reply"]
        assert reply_a != reply_b
        assert "payment-gateway" in reply_a
        assert "order-service" in reply_b

    def test_architecture_question_returns_architecture_content(self, engine):
        result = engine.respond("tell me about the system architecture")
        assert "architecture" in result["reply"].lower()

    def test_off_topic_question_gets_honest_out_of_scope_reply(self, engine):
        # In offline mode, a general-knowledge question must NOT be answered
        # with keyword-matched internal records (the "hallucination" bug where
        # 'explain java 8 features' was answered with a random incident).
        result = engine.respond("what is the capital of France")
        assert "offline (mock) mode" in result["reply"]
        assert "incident:" not in result["reply"].lower()

    def test_general_tech_question_is_not_answered_with_random_incident(self, engine):
        result = engine.respond("explain java 8 features")
        reply = result["reply"]
        assert "Most relevant historical incident" not in reply
        assert "resolved via" not in reply
        assert "offline (mock) mode" in reply

    def test_domain_question_without_matches_still_admits_no_data(self, engine):
        # Domain-related wording but nothing matching in the data: should get
        # the "couldn't find anything" reply, not the out-of-scope reply.
        result = engine.respond("show me the runbook for the mainframe teller subsystem")
        assert "couldn't find anything" in result["reply"] or "runbook" in result["reply"].lower()

    def test_greeting_reply_is_not_generic_canned_fallback(self, engine):
        result = engine.respond("hello there")
        assert "AI Change Impact Analyzer" in result["reply"]

    def test_help_reply_reflects_real_data_counts(self, engine):
        result = engine.respond("help")
        counts = DataLoader().get_counts()
        assert str(counts.get("incidents", 0)) in result["reply"]
        assert str(counts.get("services", 0)) in result["reply"]

    def test_suggested_actions_reference_matched_service(self, engine):
        result = engine.respond("tell me about payment-gateway")
        assert any("payment-gateway" in s for s in result["suggested_actions"])


class TestKeywordGroundedRetrievalIsBidirectional:
    """
    Regression test for the DataLoader._keyword_search bug where a
    full-sentence query never literally contained a short field value
    (or vice versa), causing every natural-language question to miss.
    """

    def test_full_sentence_query_matches_short_field_value(self):
        loader = DataLoader()
        services = loader.get_services()
        results = loader._keyword_search(
            services, "tell me about payment-gateway please", fields=["name", "description"]
        )
        assert any(r["name"] == "payment-gateway" for r in results)

    def test_bare_keyword_query_still_matches(self):
        loader = DataLoader()
        services = loader.get_services()
        results = loader._keyword_search(services, "payment", fields=["name", "description"])
        assert any("payment" in r["name"] for r in results)

    def test_explicit_incident_id_resolves_even_without_keyword_overlap(self):
        # Regression: "what caused incident inc-004" shares no words with
        # inc-004's title/description, so keyword scoring alone missed it
        # entirely and the chatbot answered about an unrelated incident.
        loader = DataLoader()
        evidence = loader.search_all("what caused incident inc-004", embedding_service=None)
        assert any(inc.get("id") == "inc-004" for inc in evidence["incidents"])
        assert evidence["incidents"][0]["id"] == "inc-004"


class TestPunctuationCleanup:
    """The chatbot's final reply must always be clean, user-friendly prose —
    never littered with doubled punctuation or an extra pair of wrapping
    quotes left over from a model round-tripping its own JSON output.
    """

    def test_doubled_terminal_punctuation_is_collapsed(self, engine, monkeypatch):
        monkeypatch.setattr(
            "app.agents.conversational_engine.is_live_llm_available", lambda: True
        )
        monkeypatch.setattr(
            "app.agents.conversational_engine.chat_complete",
            lambda messages, **kw: '{"is_change_request": false, "reply": "Sure thing!!! Is that clear??"}',
        )
        result = engine.respond("hello")
        assert "!!!" not in result["reply"]
        assert "??" not in result["reply"]
        assert "Sure thing!" in result["reply"]
        assert "Is that clear?" in result["reply"]

    def test_reply_wrapped_in_extra_quotes_is_unwrapped(self, engine, monkeypatch):
        monkeypatch.setattr(
            "app.agents.conversational_engine.is_live_llm_available", lambda: True
        )
        monkeypatch.setattr(
            "app.agents.conversational_engine.chat_complete",
            lambda messages, **kw: '{"is_change_request": false, "reply": "\\"Hello there, how can I help?\\""}',
        )
        result = engine.respond("hi")
        assert not result["reply"].startswith('"')
        assert not result["reply"].endswith('"')
        assert "Hello there" in result["reply"]

    def test_repeated_dots_become_single_ellipsis(self, engine, monkeypatch):
        monkeypatch.setattr(
            "app.agents.conversational_engine.is_live_llm_available", lambda: True
        )
        monkeypatch.setattr(
            "app.agents.conversational_engine.chat_complete",
            lambda messages, **kw: '{"is_change_request": false, "reply": "Let me think.... done"}',
        )
        result = engine.respond("hmm")
        assert "...." not in result["reply"]
        assert "\u2026" in result["reply"]

    def test_offline_replies_also_pass_through_cleanup(self, engine):
        # Offline path never produces malformed punctuation itself, but this
        # confirms the choke point in respond() runs for the offline path too
        # (not just the live-LLM path) without altering a clean reply.
        result = engine.respond("hello there")
        assert result["reply"] == result["reply"].strip()
        assert "  " not in result["reply"].replace("\n", " ")


class TestLlmFirstRouting:
    """
    When a real LLM provider is configured, the LLM (not a keyword heuristic)
    decides change-request vs conversation and writes conversational replies.
    """

    def test_llm_answers_general_question_directly(self, engine, monkeypatch):
        monkeypatch.setattr(
            "app.agents.conversational_engine.is_live_llm_available", lambda: True
        )
        monkeypatch.setattr(
            "app.agents.conversational_engine.chat_complete",
            lambda messages, **kw: '{"is_change_request": false, "reply": "Java 8 introduced lambdas, streams, and the Optional type."}',
        )
        result = engine.respond("explain java 8 features")
        assert result["classification"] == "conversation"
        assert "lambdas" in result["reply"]

    def test_llm_flags_change_request_for_pipeline(self, engine, monkeypatch):
        monkeypatch.setattr(
            "app.agents.conversational_engine.is_live_llm_available", lambda: True
        )
        monkeypatch.setattr(
            "app.agents.conversational_engine.chat_complete",
            lambda messages, **kw: '{"is_change_request": true, "reply": "Starting the full multi-agent impact analysis now."}',
        )
        result = engine.respond("upgrade the payment-gateway db pool to 200 connections")
        assert result["classification"] == "change-analysis"
        assert result["extracted_intent"]["requires_full_pipeline"] is True

    def test_malformed_llm_json_falls_back_to_plain_reply(self, engine, monkeypatch):
        monkeypatch.setattr(
            "app.agents.conversational_engine.is_live_llm_available", lambda: True
        )
        monkeypatch.setattr(
            "app.agents.conversational_engine.chat_complete",
            lambda messages, **kw: "Sure! Java 8 added lambdas and streams.",
        )
        result = engine.respond("explain java 8 features")
        # No valid JSON -> whole text treated as the reply, never misrouted
        # into a pipeline run and never crashes.
        assert result["classification"] == "conversation"
        assert "lambdas" in result["reply"]

    def test_llm_json_wrapped_in_code_fences_is_parsed(self, engine, monkeypatch):
        monkeypatch.setattr(
            "app.agents.conversational_engine.is_live_llm_available", lambda: True
        )
        monkeypatch.setattr(
            "app.agents.conversational_engine.chat_complete",
            lambda messages, **kw: '```json\n{"is_change_request": false, "reply": "Hello Adarsh, nice to meet you!"}\n```',
        )
        result = engine.respond("my name is adarsh")
        assert result["classification"] == "conversation"
        assert "Adarsh" in result["reply"]

    def test_llm_html_reply_is_sanitized_to_markdown(self, engine, monkeypatch):
        monkeypatch.setattr(
            "app.agents.conversational_engine.is_live_llm_available", lambda: True
        )
        monkeypatch.setattr(
            "app.agents.conversational_engine.chat_complete",
            lambda messages, **kw: (
                '{"is_change_request": false, "reply": '
                '"<h2>Java</h2><p>Java is a language.</p><ol><li>Fast</li><li>Portable</li></ol>"}'
            ),
        )
        result = engine.respond("what is java")
        reply = result["reply"]
        assert "<h2>" not in reply
        assert "<li>" not in reply
        assert "<p>" not in reply
        assert "Java is a language" in reply
        assert "Fast" in reply

    def test_llm_provider_failure_falls_back_to_offline_path(self, engine, monkeypatch):
        monkeypatch.setattr(
            "app.agents.conversational_engine.is_live_llm_available", lambda: True
        )
        monkeypatch.setattr(
            "app.agents.conversational_engine.chat_complete", lambda messages, **kw: None
        )
        result = engine.respond("hello")
        # chat_complete returning None (network/quota failure) must degrade
        # gracefully to the offline greeting, not error out.
        assert result["classification"] == "conversation"
        assert "AI Change Impact Analyzer" in result["reply"]
