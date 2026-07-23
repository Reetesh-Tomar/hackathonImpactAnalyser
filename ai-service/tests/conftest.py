"""
Shared pytest fixtures/config for the ai-service test suite.

IMPORTANT: the test suite must never depend on (or be slowed down / made
flaky by) whatever LLM provider happens to be configured in the developer's
ai-service/.env (e.g. AI_PROVIDER=ollama for local dev). Tests that want to
exercise live-LLM behavior deterministically monkeypatch
`is_live_llm_available` / `chat_complete` directly instead of relying on a
real provider.

The env vars below are set at MODULE IMPORT time (not inside a fixture),
because pytest imports this conftest.py before it imports/collects any test
module in this directory — including any session/module-scoped fixtures
that construct an AgentPipeline or agent instance at collection time and
read AI_PROVIDER in their own __init__. A function-scoped autouse fixture
using monkeypatch would run too late to protect those broader-scoped
fixtures, since pytest sets up session/module-scoped fixtures before
function-scoped ones for a given test.
"""

import os

os.environ["AI_PROVIDER"] = "mock"
for _key in ("OPENAI_API_KEY", "GROQ_API_KEY", "OPENROUTER_API_KEY"):
    os.environ.pop(_key, None)


import pytest


@pytest.fixture(autouse=True)
def _force_mock_provider_by_default(monkeypatch):
    """Re-assert the mock provider before every test in case an earlier test
    (or code under test) mutated the environment.
    """
    monkeypatch.setenv("AI_PROVIDER", "mock")
    for key in ("OPENAI_API_KEY", "GROQ_API_KEY", "OPENROUTER_API_KEY"):
        monkeypatch.delenv(key, raising=False)
    yield
