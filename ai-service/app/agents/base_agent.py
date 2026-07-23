"""
Base agent class for the multi-agent pipeline.
"""

import json
import time
import os
from enum import Enum
from typing import Dict, Any, Optional, List
from abc import ABC, abstractmethod
from datetime import datetime

from app.models import AgentTrace, AgentType
from app.rag.data_loader import DataLoader
from app.rag.embeddings import EmbeddingService


def _json_default(obj: Any) -> Any:
    """json.dumps 'default' hook: makes Enum members (e.g. RiskLevel.MEDIUM)
    and any other non-natively-serializable value JSON-safe by falling back
    to its .value (for Enums) or its string representation."""
    if isinstance(obj, Enum):
        return obj.value
    return str(obj)


class BaseAgent(ABC):
    """Base class for all agents in the pipeline."""

    def __init__(self, agent_type: AgentType, data_loader: DataLoader, 
                 embedding_service: Optional[EmbeddingService] = None):
        self.agent_type = agent_type
        self.data_loader = data_loader
        self.embeddings = embedding_service
        # DELIBERATELY separate from AI_PROVIDER (which controls the chat/
        # assistant's live-LLM behavior). This deterministic multi-agent risk
        # pipeline is architected to produce fast, deterministic risk metrics
        # (see ARCHITECTURE_BLUEPRINT.md / MODULE 4 guardrails) — it must not
        # silently become dependent on 7 sequential live LLM round-trips just
        # because a real provider was configured for conversational chat.
        # That coupling previously caused /api/v1/change-impact/analyze to
        # take 30-120+ seconds (one live call per agent) and time out/crash.
        # Set PIPELINE_AI_PROVIDER explicitly to opt the analysis pipeline
        # into live-LLM narrative generation as well.
        self.provider = os.getenv("PIPELINE_AI_PROVIDER", "mock")
        self.openai_client = None
        self._init_openai()

    def _init_openai(self):
        """Initialize OpenAI client if available."""
        if self.provider == "openai":
            try:
                from openai import OpenAI
                api_key = os.getenv("OPENAI_API_KEY", "")
                if api_key:
                    self.openai_client = OpenAI(api_key=api_key)
            except ImportError:
                pass

    def _call_llm(self, system_prompt: str, user_prompt: str) -> str:
        """Call an LLM for text generation. Falls back to rule-based for mock."""
        if self.provider == "openai" and self.openai_client:
            try:
                response = self.openai_client.chat.completions.create(
                    model=os.getenv("OPENAI_MODEL", "gpt-4"),
                    messages=[
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": user_prompt}
                    ],
                    temperature=0.3,
                    max_tokens=500
                )
                return response.choices[0].message.content
            except Exception:
                return self._rule_based_response(user_prompt)
        elif self.provider == "groq":
            try:
                from openai import OpenAI as GroqClient
                client = GroqClient(
                    base_url="https://api.groq.com/openai/v1",
                    api_key=os.getenv("GROQ_API_KEY", "")
                )
                response = client.chat.completions.create(
                    model=os.getenv("GROQ_MODEL", "llama3-70b-8192"),
                    messages=[
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": user_prompt}
                    ],
                    temperature=0.3
                )
                return response.choices[0].message.content
            except Exception:
                return self._rule_based_response(user_prompt)
        elif self.provider == "openrouter":
            try:
                from openai import OpenAI as ORClient
                client = ORClient(
                    base_url="https://openrouter.ai/api/v1",
                    api_key=os.getenv("OPENROUTER_API_KEY", "")
                )
                response = client.chat.completions.create(
                    model=os.getenv("OPENROUTER_MODEL", "anthropic/claude-3-opus"),
                    messages=[
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": user_prompt}
                    ],
                    temperature=0.3
                )
                return response.choices[0].message.content
            except Exception:
                return self._rule_based_response(user_prompt)
        elif self.provider == "ollama":
            try:
                import httpx
                base_url = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
                model = os.getenv("OLLAMA_MODEL", "llama3")
                response = httpx.post(
                    f"{base_url}/api/chat",
                    json={
                        "model": model,
                        "messages": [
                            {"role": "system", "content": system_prompt},
                            {"role": "user", "content": user_prompt}
                        ],
                        "stream": False
                    },
                    timeout=30
                )
                return response.json()["message"]["content"]
            except Exception:
                return self._rule_based_response(user_prompt)
        else:
            return self._rule_based_response(user_prompt)

    def _rule_based_response(self, prompt: str) -> str:
        """Fallback rule-based response for mock mode."""
        return self._mock_agent_response(prompt)

    @abstractmethod
    def _mock_agent_response(self, prompt: str) -> str:
        """Mock response for testing without LLM."""
        pass

    def execute(self, input_data: Dict[str, Any], context: Dict[str, Any]) -> AgentTrace:
        """Execute the agent and return a trace."""
        start_time = time.time()
        trace = AgentTrace(
            agent=self.agent_type,
            status="running",
            input=str(input_data),
            processingTimeMs=0
        )

        try:
            result = self.process(input_data, context)
            # IMPORTANT: this must be valid JSON, not a Python str(dict) repr
            # (single-quoted, Enum reprs like "<RiskLevel.MEDIUM: 'medium'>",
            # etc). pipeline.py does `json.loads(trace.output)` to rehydrate
            # this agent's structured result into `context[agent_name]` for
            # every downstream agent to read. A str() repr silently fails
            # that json.loads, so every downstream agent would fall back to
            # an empty {} context and produce only generic placeholder
            # output (this was a real, previously-undetected bug).
            trace.output = json.dumps(result, default=_json_default)
            trace.status = "completed"
            trace.evidence = self._get_evidence()
        except Exception as e:
            trace.status = "failed"
            trace.error = str(e)
            trace.output = f"Error: {str(e)}"

        trace.processingTimeMs = int((time.time() - start_time) * 1000)
        return trace

    @abstractmethod
    def process(self, input_data: Dict[str, Any], context: Dict[str, Any]) -> Dict[str, Any]:
        """Process input and return output. Implemented by each agent."""
        pass

    def _get_evidence(self) -> List[Dict[str, Any]]:
        """Get evidence collected by this agent."""
        return []

