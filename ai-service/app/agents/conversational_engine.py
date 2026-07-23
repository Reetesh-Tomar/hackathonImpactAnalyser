"""
Dynamic conversational engine for the /chat and /assistant endpoints.

Two modes, decided by whether a real LLM provider is configured:

  1. LLM-FIRST MODE (AI_PROVIDER=groq/openai/openrouter with a valid key, or
     ollama running locally) — every user message goes to the LLM in a single
     call that BOTH (a) decides whether the message is a change-analysis
     request or normal conversation, and (b) for normal conversation, writes
     the actual answer itself — general-knowledge questions included — with
     retrieved RAG evidence supplied as optional context. This is the
     "route it through ChatGPT first, let it decide" flow: no keyword
     heuristics in the driving seat when a real model is available.

  2. OFFLINE / MOCK MODE (no API key) — heuristic classification plus
     data-grounded synthesis from the ACTUAL matching records in cmdb.json /
     incidents.json / architecture.md / runbooks — but gated by an honesty
     check: if the question isn't about our services/incidents/architecture,
     the bot says so plainly (and explains how to enable live LLM answers)
     instead of dressing up loosely keyword-matched internal records as an
     answer to an unrelated question.

Retrieval always uses keyword/field matching (`DataLoader._keyword_search`,
via `search_all(query, embedding_service=None)`) rather than this project's
mock hash-based "embeddings" for chat grounding: the mock embedding vectors
are pseudo-random (not semantically meaningful), so using them here would
produce confident-sounding but arbitrary answers. Real change-impact
analysis scoring elsewhere in the app already accounts for this; for chat
grounding, literal keyword relevance is more trustworthy AND avoids
spending a real embedding API call on every chat turn.
"""

from __future__ import annotations

import json
import re
from typing import Any, Dict, List, Optional

from app.llm_providers import chat_complete, is_live_llm_available
from app.rag.data_loader import DataLoader
from app.rag.embeddings import EmbeddingService

_CHANGE_VERBS = [
    "upgrade", "upgrading", "migrate", "migration", "migrating", "deploy", "deployment",
    "deploying", "modify", "modification", "modifying", "update", "updating", "change",
    "changing", "rollback", "roll back", "patch", "patching", "remove", "removing", "add",
    "adding", "increase", "increasing", "decrease", "decreasing", "scale", "scaling",
    "rotate", "rotating", "replace", "replacing", "rename", "delete", "deleting",
    "reconfigure", "reconfiguring", "config change", "provision", "provisioning",
]

_GREETING_RE = re.compile(r"^\s*(hi|hello|hey+|yo|good\s?(morning|afternoon|evening))\b", re.IGNORECASE)
_THANKS_RE = re.compile(r"\b(thanks|thank you|appreciate it|cheers)\b", re.IGNORECASE)
_HELP_RE = re.compile(r"^\s*(help|what can you do|how does this work)\b", re.IGNORECASE)
_INTRO_RE = re.compile(r"\bmy name is\s+([A-Za-z]+)|\bi am\s+([A-Za-z]+)\s*$|\bi'?m\s+([A-Za-z]+)\s*$", re.IGNORECASE)

# Signals that a question is actually about THIS system's domain (services,
# incidents, infra changes) rather than a general-knowledge question. Used
# only in offline mode to stop the bot from dumping loosely keyword-matched
# internal records as an "answer" to unrelated questions (e.g. someone asking
# "explain java 8 features" must not be answered with a random incident).
# Word-boundary matched so short tokens like "db"/"api" don't false-positive
# inside unrelated words ("feedback", "capital").
_DOMAIN_KEYWORD_RE = re.compile(
    r"\b(incident|outage|downtime|postmortem|root cause|failure|service|architecture|"
    r"topology|dependency|dependencies|runbook|mitigation|risk|deploy|deployment|"
    r"rollback|database|db|kafka|queue|api|gateway|firewall|network|migration|"
    r"upgrade|infra|infrastructure|cmdb|change request|criticality|monitoring|alert)\b",
    re.IGNORECASE,
)
_RECORD_ID_RE = re.compile(r"\b(inc|cr)-\d+\b", re.IGNORECASE)

_MAX_HISTORY_TURNS_FOR_LLM = 6


class ConversationalEngine:
    """Stateless — a single instance is safe to reuse across requests."""

    def __init__(self, data_loader: DataLoader, embeddings: Optional[EmbeddingService] = None):
        self.data_loader = data_loader
        self.embeddings = embeddings

    # -- public entry point ---------------------------------------------------

    def respond(self, message: str, history: Optional[List[Dict[str, str]]] = None) -> Dict[str, Any]:
        """Public entry point. Delegates to `_respond_raw` for the actual
        routing/synthesis, then runs the result's `reply` through
        `_clean_punctuation` as a single choke point so EVERY path (live-LLM
        or offline) always returns clean, user-friendly punctuation —
        instead of duplicating cleanup logic at every individual return
        statement below.
        """
        result = self._respond_raw(message, history)
        if isinstance(result, dict) and isinstance(result.get("reply"), str):
            result["reply"] = self._clean_punctuation(result["reply"])
        return result

    def _respond_raw(self, message: str, history: Optional[List[Dict[str, str]]] = None) -> Dict[str, Any]:
        history = history or []
        message = (message or "").strip()

        # ==================================================================
        # LLM-FIRST ROUTING (when a real provider is configured).
        # The LLM itself decides whether this message is a change-analysis
        # request or normal conversation — and for normal conversation it
        # writes the actual answer (general knowledge included), instead of
        # a keyword heuristic guessing and a template stitching together
        # whatever internal records loosely matched.
        # ==================================================================
        if is_live_llm_available():
            llm_result = self._llm_route_and_reply(message, history)
            if llm_result is not None:
                return llm_result
            # Provider call failed (network/quota) — fall through to the
            # offline path below rather than erroring out.

        # ==================================================================
        # OFFLINE (mock) PATH — heuristic classification + honest, gated,
        # data-grounded replies. Never pretends to be a general-purpose LLM.
        # ==================================================================
        classification, matched_service = self._classify(message)

        if classification == "change-analysis":
            return {
                "classification": "change-analysis",
                "reply": self._change_analysis_ack(matched_service),
                "extracted_intent": {
                    "type": "change_analysis",
                    "requires_full_pipeline": True,
                    "matched_component": matched_service,
                },
                "suggested_actions": [
                    "Run full impact analysis",
                    "View similar past incidents",
                    "Check service dependencies",
                ],
            }

        # Keyword-grounded retrieval across every RAG source (see module
        # docstring for why embedding_service is intentionally omitted here).
        evidence = self.data_loader.search_all(message, embedding_service=None)

        reply = self._synthesize_grounded_reply(message, evidence)
        suggested_actions = self._build_suggestions(evidence)

        return {
            "classification": "conversation",
            "reply": reply,
            "extracted_intent": {"type": "general_chat"},
            "suggested_actions": suggested_actions,
        }

    # -- LLM-first routing --------------------------------------------------------

    def _llm_route_and_reply(
        self, message: str, history: List[Dict[str, str]]
    ) -> Optional[Dict[str, Any]]:
        """Single LLM call that both classifies AND answers.

        Returns None only if the provider call itself failed, so the caller
        can fall back to the offline path.
        """
        evidence = self.data_loader.search_all(message, embedding_service=None)
        context_block = self._format_evidence_for_prompt(evidence)

        system_prompt = (
            "You are the conversational assistant inside the AI Change Impact Analyzer — a "
            "multi-agent risk-analysis platform built for Deutsche Bank's bank-wide '10 Years of "
            "Technology, Data & Innovation' hackathon. You have two jobs for every user message:\n\n"
            "1. DECIDE whether the message is a request to analyze a specific system or "
            "infrastructure CHANGE (an upgrade, deployment, migration, scaling, config/firewall "
            "change, etc. targeting a component). Greetings, introductions ('my name is ...'), "
            "small talk, and general technical questions (e.g. 'explain java 8 features') are NOT "
            "change requests.\n"
            "2. If it is NOT a change request, answer it yourself, fully and helpfully, like a "
            "general-purpose assistant. Use the retrieved internal context below when the question "
            "is about our services, incidents, or architecture; for general-knowledge questions, "
            "answer from your own knowledge and simply ignore the internal context. Never dump "
            "irrelevant internal records into an answer.\n\n"
            "Respond with ONLY a JSON object (no code fences, no extra text):\n"
            '{"is_change_request": true or false, "reply": "<your reply>"}\n'
            "Formatting rules for the reply field: plain prose and simple markdown only "
            "(use **bold**, and '- ' for bullet lists if needed) — NEVER use HTML tags like "
            "<p>, <h1>, <ol>, or <li>. Keep it conversational, 3-6 sentences unless more detail "
            "is explicitly requested.\n"
            "If is_change_request is true, keep the reply to one short sentence acknowledging that "
            "the full multi-agent impact analysis is starting.\n\n"
            f"Retrieved internal context (may be irrelevant to this message):\n{context_block}"
        )

        messages: List[Dict[str, str]] = [{"role": "system", "content": system_prompt}]
        for turn in history[-_MAX_HISTORY_TURNS_FOR_LLM:]:
            role = turn.get("role", "user")
            content = turn.get("content", "")
            if role in ("user", "assistant") and content:
                messages.append({"role": role, "content": content})
        messages.append({"role": "user", "content": message})

        raw = chat_complete(messages, temperature=0.4, max_tokens=900)
        if not raw:
            return None

        is_change_request, reply = self._parse_router_json(raw)
        reply = self._strip_html(reply)

        if is_change_request:
            matched_service = self._match_known_service(message.lower())
            return {
                "classification": "change-analysis",
                "reply": reply or self._change_analysis_ack(matched_service),
                "extracted_intent": {
                    "type": "change_analysis",
                    "requires_full_pipeline": True,
                    "matched_component": matched_service,
                },
                "suggested_actions": [
                    "Run full impact analysis",
                    "View similar past incidents",
                    "Check service dependencies",
                ],
            }

        return {
            "classification": "conversation",
            "reply": reply,
            "extracted_intent": {"type": "general_chat"},
            "suggested_actions": self._build_suggestions(
                self.data_loader.search_all(message, embedding_service=None)
            ),
        }

    @staticmethod
    def _strip_html(text: str) -> str:
        """Defensive cleanup for smaller local models that sometimes ignore the
        'no HTML' instruction and emit <p>/<h1>/<ol>/<li> tags instead of markdown.
        Converts the common structural tags to markdown-ish equivalents rather
        than just deleting them, so lists/headings still read sensibly.
        """
        if "<" not in text:
            return text
        t = text
        t = re.sub(r"</?h[1-6][^>]*>", "\n\n", t, flags=re.IGNORECASE)
        t = re.sub(r"<li[^>]*>", "\n- ", t, flags=re.IGNORECASE)
        t = re.sub(r"</li>", "", t, flags=re.IGNORECASE)
        t = re.sub(r"</?(ol|ul)[^>]*>", "\n", t, flags=re.IGNORECASE)
        t = re.sub(r"</p>", "\n\n", t, flags=re.IGNORECASE)
        t = re.sub(r"<p[^>]*>", "", t, flags=re.IGNORECASE)
        t = re.sub(r"<br\s*/?>", "\n", t, flags=re.IGNORECASE)
        t = re.sub(r"<strong[^>]*>|</strong>", "**", t, flags=re.IGNORECASE)
        t = re.sub(r"<em[^>]*>|</em>", "*", t, flags=re.IGNORECASE)
        t = re.sub(r"<[^>]+>", "", t)  # strip any remaining tags
        t = re.sub(r"\n{3,}", "\n\n", t).strip()
        return t

    @staticmethod
    def _clean_punctuation(text: str) -> str:
        """Tidy up common punctuation artifacts smaller/local LLMs tend to
        leave in — so the user always sees clean, natural prose rather than
        stray symbols cluttering the response:
          - a reply fully wrapped in one extra pair of quotes (a classic
            "the model echoed its own JSON string value literally" artifact)
          - leftover backslash-escaped quotes from the same cause
          - doubled/repeated terminal punctuation ("??", "!!!", "....")
          - stray whitespace immediately before a punctuation mark
        Markdown tokens (**, `, "- ") are intentionally left alone here —
        those are rendered as real formatting by the frontend, not stripped.
        """
        if not text:
            return text
        t = text.strip()

        # Un-escape stray backslash-escaped quotes left over from a model
        # that emitted its reply as an already-JSON-encoded string.
        t = t.replace('\\"', '"').replace("\\'", "'")

        # A reply entirely wrapped in one extra pair of matching quotes.
        if len(t) >= 2 and t[0] == t[-1] and t[0] in ('"', "'") and t.count(t[0]) == 2:
            t = t[1:-1].strip()

        # Collapse repeated terminal punctuation into a single sensible mark.
        t = re.sub(r"\.{2,}", "\u2026", t)  # ".." / "...." -> a single ellipsis
        t = re.sub(r"!{2,}", "!", t)
        t = re.sub(r"\?{2,}", "?", t)
        t = re.sub(r",{2,}", ",", t)

        # Remove stray space(s) immediately before punctuation.
        t = re.sub(r"\s+([.,!?;:])", r"\1", t)

        t = re.sub(r"\n{3,}", "\n\n", t).strip()
        return t

    @staticmethod
    def _parse_router_json(raw: str) -> tuple:
        """Extract (is_change_request, reply) from the LLM's response.

        Tolerates code fences and surrounding prose. If no valid JSON can be
        recovered, the whole raw text is treated as a plain conversational
        reply — a wrong-format answer must never crash the chat or get
        misrouted into a full pipeline run.
        """
        text = raw.strip()
        # Strip markdown code fences if the model added them anyway
        text = re.sub(r"^```(?:json)?\s*|\s*```$", "", text, flags=re.MULTILINE).strip()

        start = text.find("{")
        end = text.rfind("}")
        if start != -1 and end > start:
            candidate = text[start:end + 1]
            try:
                data = json.loads(candidate)
                if isinstance(data, dict) and "reply" in data:
                    return bool(data.get("is_change_request", False)), str(data.get("reply", "")).strip()
            except (json.JSONDecodeError, TypeError, ValueError):
                pass
        return False, raw.strip()

    # -- classification ----------------------------------------------------------

    def _classify(self, message: str) -> tuple:
        message_lower = message.lower()
        has_change_verb = any(verb in message_lower for verb in _CHANGE_VERBS)
        matched_service = self._match_known_service(message_lower)

        # A message reads as a change request when it uses change language AND
        # either names a real component or is detailed enough to plausibly be
        # a change description (short imperative verbs alone are too weak a signal).
        if has_change_verb and (matched_service or len(message.split()) >= 6):
            return "change-analysis", matched_service
        return "conversation", matched_service

    def _match_known_service(self, message_lower: str) -> Optional[str]:
        for svc in self.data_loader.get_services():
            name = svc.get("name", "")
            if not name:
                continue
            # Service identifiers use hyphens (e.g. "payment-gateway"), but
            # users naturally type spaces ("payment gateway") — match both.
            if name.lower() in message_lower or name.lower().replace("-", " ") in message_lower:
                return name
        return None

    def _change_analysis_ack(self, matched_service: Optional[str]) -> str:
        if matched_service:
            return (
                f"I've identified this as a change impact analysis request targeting "
                f"**{matched_service}**. Running the full multi-agent risk analysis now."
            )
        return (
            "I've identified this as a change impact analysis request. "
            "I'll analyze the potential risks and impacts across the dependency graph now."
        )

    def _format_evidence_for_prompt(self, evidence: Dict[str, List]) -> str:
        lines: List[str] = []

        for svc in evidence.get("services", [])[:3]:
            lines.append(
                f"[service] {svc.get('name')} ({svc.get('criticality', 'unknown')} criticality, "
                f"owner: {svc.get('owner', 'unknown')}): {svc.get('description', '')}"
            )
        for inc in evidence.get("incidents", [])[:3]:
            lines.append(
                f"[incident {inc.get('id', '')}] {inc.get('title', '')} (severity: "
                f"{inc.get('severity', 'unknown')}): {inc.get('description', '')} "
                f"— resolution: {inc.get('resolution', 'not documented')}"
            )
        for cr in evidence.get("change_requests", [])[:2]:
            lines.append(f"[past change {cr.get('id', '')}] {cr.get('title', '')}: {cr.get('description', '')}")
        for rb in evidence.get("runbooks", [])[:2]:
            lines.append(f"[runbook] {rb.get('service', 'unknown service')}: {rb.get('content', '')[:300]}")
        if evidence.get("architecture"):
            arch_content = self.data_loader.get_architecture().get("content", "")
            if arch_content:
                lines.append(f"[architecture] {arch_content[:500]}")

        return "\n".join(lines) if lines else "(no directly relevant records found in the RAG data sources)"

    # -- grounded synthesis (no LLM available) ------------------------------------

    def _is_domain_related(self, message: str) -> bool:
        """Gate for offline mode: is this message actually about our system?

        True when the message names a known service, references a record id
        (inc-004 / cr-012), or uses infrastructure/incident vocabulary. If
        False, the offline bot must NOT answer with keyword-matched internal
        records — that is exactly the 'hallucination' failure mode where an
        unrelated question got answered with a random incident summary.
        """
        message_lower = message.lower()
        if self._match_known_service(message_lower):
            return True
        if _RECORD_ID_RE.search(message):
            return True
        return bool(_DOMAIN_KEYWORD_RE.search(message))

    def _offline_out_of_scope_reply(self) -> str:
        counts = self.data_loader.get_counts()
        return (
            "That looks like a general question rather than something in my change-analysis "
            "knowledge base — and I'm currently running in **offline (mock) mode** without an "
            "LLM API key, so I can't answer general questions the way ChatGPT would.\n\n"
            f"What I *can* do right now: (1) run a **change impact analysis** for any of the "
            f"{counts.get('services', 0)} tracked services, (2) look up any of the "
            f"{counts.get('incidents', 0)} historical incidents, and (3) answer questions about "
            f"the system architecture.\n\n"
            "*To enable full conversational answers, add a `GROQ_API_KEY` or `OPENAI_API_KEY` to "
            "`ai-service/.env`, set `AI_PROVIDER` accordingly, and restart the AI service.*"
        )

    def _synthesize_grounded_reply(self, message: str, evidence: Dict[str, List]) -> str:
        if _GREETING_RE.search(message):
            return (
                "Hello! I'm the AI Change Impact Analyzer. Ask me about a service, a past "
                "incident, the system architecture, or describe a change you're planning and "
                "I'll run a full multi-agent risk analysis."
            )
        if _THANKS_RE.search(message):
            return "You're welcome! Let me know if you'd like to dig into another service, incident, or change."
        intro_match = _INTRO_RE.search(message)
        if intro_match:
            name = next((g for g in intro_match.groups() if g), "there").capitalize()
            return (
                f"Nice to meet you, {name}! I'm the AI Change Impact Analyzer. Describe a change "
                f"you're planning (e.g. \"upgrade the payment-gateway database\") and I'll run a "
                f"full multi-agent risk analysis, or ask me about any service, incident, or the "
                f"system architecture."
            )
        if _HELP_RE.search(message):
            counts = self.data_loader.get_counts()
            return (
                f"I can help with three things: (1) **Change Impact Analysis** — describe a "
                f"proposed change and I'll run the multi-agent risk pipeline; (2) **Incident "
                f"Lookup** — I have {counts.get('incidents', 0)} historical incidents indexed; "
                f"(3) **Architecture Q&A** — ask about any of the {counts.get('services', 0)} "
                f"tracked services."
            )

        # HONESTY GATE: if the question is not about our services/incidents/
        # architecture, say so plainly instead of stitching together whatever
        # internal records happened to share a keyword with the question.
        if not self._is_domain_related(message):
            return self._offline_out_of_scope_reply()

        services = evidence.get("services", [])
        incidents = evidence.get("incidents", [])
        change_requests = evidence.get("change_requests", [])
        runbooks = evidence.get("runbooks", [])
        architecture = evidence.get("architecture", [])

        parts: List[str] = []

        # An explicit architecture question should win outright, even if a
        # change request or service also happens to share a keyword.
        if architecture and re.search(r"\b(architecture|topology|system design)\b", message, re.IGNORECASE):
            arch_content = self.data_loader.get_architecture().get("content", "")
            if arch_content:
                return f"From the system architecture docs: {arch_content[:500].strip()}..."

        if services:
            top = services[0]
            parts.append(
                f"**{top.get('name', 'This service')}** ({top.get('criticality', 'unknown')} "
                f"criticality, owned by {top.get('owner', 'an unknown team')}) — "
                f"{top.get('description', 'no description on file')}."
            )
            other_names = [s.get("name", "") for s in services[1:3] if s.get("name")]
            if other_names:
                parts.append(f"Related services you might also check: {', '.join(other_names)}.")

        if incidents:
            top = incidents[0]
            resolution = top.get("resolution", "")
            parts.append(
                f"Most relevant historical incident: **{top.get('title', top.get('id', 'an incident'))}** "
                f"(severity: {top.get('severity', 'unknown')})"
                + (f", resolved via: {resolution}" if resolution else ", resolution not documented")
                + "."
            )

        if not services and not incidents and runbooks:
            top_rb = runbooks[0]
            parts.append(
                f"There's an operational runbook on file for **{top_rb.get('service', 'a service')}**: "
                f"{top_rb.get('content', '')[:200]}"
            )

        if not parts and architecture:
            arch_content = self.data_loader.get_architecture().get("content", "")
            if arch_content:
                parts.append(f"From the system architecture docs: {arch_content[:400].strip()}...")

        if not parts and change_requests:
            top_cr = change_requests[0]
            parts.append(
                f"Closest related past change request: **{top_cr.get('title', '')}** — "
                f"{top_cr.get('description', '')[:250]}"
            )

        if not parts:
            return (
                "I couldn't find anything in the services, incidents, or architecture data "
                "directly matching that. Try asking about a specific service name, or describe "
                "an infrastructure change and I'll run a full impact analysis."
            )

        return " ".join(parts)

    # -- suggestions -------------------------------------------------------------

    def _build_suggestions(self, evidence: Dict[str, List]) -> List[str]:
        suggestions: List[str] = []
        services = evidence.get("services", [])
        incidents = evidence.get("incidents", [])

        if services:
            suggestions.append(f"Analyze the impact of upgrading {services[0].get('name', '')}")
            if len(services) > 1:
                suggestions.append(f"Show past incidents for {services[1].get('name', '')}")
        if incidents:
            suggestions.append(f"Tell me more about incident {incidents[0].get('id', '')}")
        suggestions.append("Tell me about the system architecture")

        seen = set()
        deduped: List[str] = []
        for s in suggestions:
            if s and s not in seen:
                seen.add(s)
                deduped.append(s)
        return deduped[:4]
