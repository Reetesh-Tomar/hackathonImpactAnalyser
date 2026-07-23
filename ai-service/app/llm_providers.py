"""
Shared, lightweight multi-turn chat-completion dispatcher.

This mirrors the provider-selection pattern already used in
app/agents/base_agent.py and app/agents/react/base_react_agent.py (same
env vars: AI_PROVIDER, OPENAI_API_KEY, GROQ_API_KEY, OPENROUTER_API_KEY,
OLLAMA_BASE_URL) so that setting a real provider in .env is honored
consistently across the whole codebase — including the conversational
chat/assistant endpoints, which previously never called an LLM at all.

Every function here is defensive: it NEVER raises. If a provider is
unconfigured, missing credentials, or the network call fails, it returns
None so the caller can fall back to a local, data-grounded synthesis path
instead of crashing or silently going quiet.
"""

from __future__ import annotations

import logging
import os
from typing import Dict, List, Optional

logger = logging.getLogger(__name__)


def get_configured_provider() -> str:
    """Read the active provider from the environment (defaults to 'mock')."""
    return os.getenv("AI_PROVIDER", "mock").strip().lower()


def provider_has_credentials(provider: str) -> bool:
    """Whether the given provider is actually usable right now."""
    if provider == "openai":
        return bool(os.getenv("OPENAI_API_KEY", "").strip())
    if provider == "groq":
        return bool(os.getenv("GROQ_API_KEY", "").strip())
    if provider == "openrouter":
        return bool(os.getenv("OPENROUTER_API_KEY", "").strip())
    if provider == "ollama":
        return True  # local model server, no API key required
    return False


def is_live_llm_available() -> bool:
    """True if a real (non-mock) LLM provider is configured and usable."""
    provider = get_configured_provider()
    return provider != "mock" and provider_has_credentials(provider)


def chat_complete(
    messages: List[Dict[str, str]],
    provider: Optional[str] = None,
    temperature: float = 0.4,
    max_tokens: int = 700,
) -> Optional[str]:
    """
    Dispatch a multi-turn chat completion request to the configured provider.

    Args:
        messages: OpenAI-style [{"role": "system"|"user"|"assistant", "content": str}, ...]
        provider: override the provider; defaults to AI_PROVIDER from the environment.
        temperature / max_tokens: generation controls, ignored by providers that don't support them.

    Returns:
        The assistant's reply text, or None if the provider is unavailable/unconfigured
        or the call failed for any reason (network error, bad credentials, timeout, etc).
    """
    provider = (provider or get_configured_provider()).strip().lower()

    if provider == "mock" or not provider_has_credentials(provider):
        return None

    try:
        if provider == "openai":
            from openai import OpenAI

            client = OpenAI(api_key=os.getenv("OPENAI_API_KEY", ""))
            response = client.chat.completions.create(
                model=os.getenv("OPENAI_MODEL", "gpt-4"),
                messages=messages,
                temperature=temperature,
                max_tokens=max_tokens,
            )
            return response.choices[0].message.content

        if provider == "groq":
            from openai import OpenAI as GroqClient

            client = GroqClient(base_url="https://api.groq.com/openai/v1", api_key=os.getenv("GROQ_API_KEY", ""))
            response = client.chat.completions.create(
                model=os.getenv("GROQ_MODEL", "llama3-70b-8192"),
                messages=messages,
                temperature=temperature,
            )
            return response.choices[0].message.content

        if provider == "openrouter":
            from openai import OpenAI as ORClient

            client = ORClient(base_url="https://openrouter.ai/api/v1", api_key=os.getenv("OPENROUTER_API_KEY", ""))
            response = client.chat.completions.create(
                model=os.getenv("OPENROUTER_MODEL", "anthropic/claude-3-opus"),
                messages=messages,
                temperature=temperature,
            )
            return response.choices[0].message.content

        if provider == "ollama":
            import httpx

            base_url = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
            model = os.getenv("OLLAMA_MODEL", "llama3")
            response = httpx.post(
                f"{base_url}/api/chat",
                json={
                    "model": model,
                    "messages": messages,
                    "stream": False,
                    "options": {"temperature": temperature, "num_predict": max_tokens},
                },
                timeout=90,  # local CPU inference can be slow on first call (model load)
            )
            response.raise_for_status()
            return response.json()["message"]["content"]

    except Exception as exc:
        logger.warning("chat_complete: provider=%s call failed, falling back locally: %s", provider, exc)
        return None

    return None
