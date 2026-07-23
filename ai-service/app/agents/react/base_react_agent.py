"""
MODULE 1 / MODULE 5 — Generic ReAct (Reason + Act) agent loop.

Concrete agents (CodeAuditorAgent, HistoricalDetectiveAgent,
RiskSynthesizerAgent) subclass `ReactAgent` and only need to supply:
  - a system prompt (app/agents/prompts.py)
  - a tool dict: {tool_name: callable}
  - an output Pydantic schema (app/agents/schemas.py)
  - a deterministic mock-mode responder (used when AI_PROVIDER=mock, which
    is this project's default so the demo runs with zero API keys)

This module is also where MODULE 5's "Execution caps" guardrail lives:
`MAX_ITERATIONS = 3` is enforced in code, not just described in the prompt.
"""

from __future__ import annotations

import json
import logging
import os
import re
import time
from abc import ABC, abstractmethod
from dataclasses import dataclass, field
from typing import Any, Callable, Dict, List, Optional, Tuple, Type

from pydantic import BaseModel

from app.agents.guardrails import build_repair_prompt, enforce_structured_output

logger = logging.getLogger(__name__)

MAX_ITERATIONS = 3


@dataclass
class ReactStep:
    """One Thought/Action/Observation (or Thought/Final Answer) turn, kept
    for the auditable agent trace shown in the dashboard's 'Agent Trace' tab."""

    iteration: int
    thought: str
    action: Optional[str] = None
    action_input: Optional[Dict[str, Any]] = None
    observation: Optional[Dict[str, Any]] = None
    final_answer_raw: Optional[str] = None
    raw_llm_response: str = ""


@dataclass
class ReactRunResult:
    agent_name: str
    output: BaseModel
    steps: List[ReactStep] = field(default_factory=list)
    hit_iteration_cap: bool = False
    used_fallback: bool = False
    elapsed_ms: int = 0


class ReactParseError(Exception):
    pass


_THOUGHT_RE = re.compile(r"Thought:\s*(.*?)(?=\n(?:Action:|Final Answer:)|\Z)", re.DOTALL)
_ACTION_RE = re.compile(r"Action:\s*([A-Za-z_][A-Za-z0-9_]*)")
_ACTION_INPUT_RE = re.compile(r"Action Input:\s*(\{[\s\S]*?\})\s*(?:$|\n\s*\n|\Z)", re.DOTALL)
_FINAL_ANSWER_RE = re.compile(r"Final Answer:\s*(\{[\s\S]*\})\s*\Z", re.DOTALL)


class ReactAgent(ABC):
    """Base class implementing the bounded Thought -> Action -> Observation loop."""

    def __init__(
        self,
        agent_name: str,
        system_prompt: str,
        tools: Dict[str, Callable[..., Dict[str, Any]]],
        output_schema: Type[BaseModel],
        max_iterations: int = MAX_ITERATIONS,
    ):
        self.agent_name = agent_name
        self.system_prompt = system_prompt
        self.tools = tools
        self.output_schema = output_schema
        self.max_iterations = max_iterations
        # Deliberately separate from AI_PROVIDER (which controls the chat/
        # assistant's live-LLM behavior) — see base_agent.py for the full
        # rationale. This keeps the deterministic ReAct analysis pipeline
        # fast by default even when a real provider is configured for chat.
        self.provider = os.getenv("PIPELINE_AI_PROVIDER", "mock")
        self._llm_call_count = 0

    # -- public entry point ---------------------------------------------------

    def run(self, initial_user_message: str) -> ReactRunResult:
        start = time.time()
        messages: List[Dict[str, str]] = [
            {"role": "system", "content": self.system_prompt},
            {"role": "user", "content": initial_user_message},
        ]
        steps: List[ReactStep] = []

        for iteration in range(1, self.max_iterations + 1):
            raw_response = self._call_llm(messages, iteration)
            step = self._parse_step(raw_response, iteration)
            steps.append(step)

            if step.final_answer_raw is not None:
                output = enforce_structured_output(
                    step.final_answer_raw,
                    self.output_schema,
                    repair_fn=lambda text, errs: self._call_llm(
                        messages + [{"role": "user", "content": build_repair_prompt(self.output_schema, text, errs)}],
                        iteration,
                    ),
                    fallback_factory=self._fallback_factory,
                )
                return ReactRunResult(
                    agent_name=self.agent_name,
                    output=output,
                    steps=steps,
                    hit_iteration_cap=False,
                    used_fallback=isinstance(output, self._fallback_type()),
                    elapsed_ms=int((time.time() - start) * 1000),
                )

            observation = self._dispatch_tool(step.action, step.action_input or {})
            step.observation = observation
            messages.append({"role": "assistant", "content": raw_response})
            messages.append({"role": "user", "content": f"Observation: {json.dumps(observation, default=str)}"})

        # Iteration cap exhausted: force one last finalize-only turn.
        forced_prompt = (
            "You have used all available reasoning iterations. You MUST answer now "
            "using only the evidence already gathered. Respond with ONLY:\n"
            "Thought: <brief>\nFinal Answer: <raw JSON object matching the required schema>"
        )
        messages.append({"role": "user", "content": forced_prompt})
        raw_response = self._call_llm(messages, self.max_iterations + 1)
        forced_step = self._parse_step(raw_response, self.max_iterations + 1, force_final=True)
        steps.append(forced_step)

        final_text = forced_step.final_answer_raw or raw_response
        output = enforce_structured_output(final_text, self.output_schema, fallback_factory=self._fallback_factory)

        return ReactRunResult(
            agent_name=self.agent_name,
            output=output,
            steps=steps,
            hit_iteration_cap=True,
            used_fallback=isinstance(output, self._fallback_type()),
            elapsed_ms=int((time.time() - start) * 1000),
        )

    # -- parsing ---------------------------------------------------------------

    def _parse_step(self, raw_response: str, iteration: int, force_final: bool = False) -> ReactStep:
        thought_match = _THOUGHT_RE.search(raw_response)
        thought = thought_match.group(1).strip() if thought_match else ""

        final_match = _FINAL_ANSWER_RE.search(raw_response)
        if final_match:
            return ReactStep(
                iteration=iteration,
                thought=thought,
                final_answer_raw=final_match.group(1),
                raw_llm_response=raw_response,
            )

        action_match = _ACTION_RE.search(raw_response)
        input_match = _ACTION_INPUT_RE.search(raw_response)

        if not action_match:
            # Model did not follow protocol. Treat the whole response as a
            # candidate Final Answer so the guardrail layer gets a chance to
            # extract JSON from it rather than silently dropping the turn.
            return ReactStep(
                iteration=iteration,
                thought=thought or "(model did not follow ReAct protocol; treating raw output as final answer candidate)",
                final_answer_raw=raw_response,
                raw_llm_response=raw_response,
            )

        action_input: Dict[str, Any] = {}
        if input_match:
            try:
                action_input = json.loads(input_match.group(1))
            except json.JSONDecodeError:
                action_input = {}

        return ReactStep(
            iteration=iteration,
            thought=thought,
            action=action_match.group(1),
            action_input=action_input,
            raw_llm_response=raw_response,
        )

    def _dispatch_tool(self, action: Optional[str], action_input: Dict[str, Any]) -> Dict[str, Any]:
        if not action:
            return {"error": "no action specified"}
        tool = self.tools.get(action)
        if tool is None:
            return {"error": f"unknown tool '{action}'. Available tools: {list(self.tools.keys())}"}
        try:
            return tool(**action_input)
        except TypeError as exc:
            return {"error": f"invalid arguments for tool '{action}': {exc}"}
        except Exception as exc:  # tool-level failure must not crash the agent loop
            logger.exception("Tool '%s' raised an exception", action)
            return {"error": f"tool '{action}' failed: {exc}"}

    # -- LLM dispatch (mirrors app/agents/base_agent.py provider switch) ------

    def _call_llm(self, messages: List[Dict[str, str]], iteration: int) -> str:
        self._llm_call_count += 1
        if self.provider == "openai":
            return self._call_openai(messages)
        if self.provider == "groq":
            return self._call_groq(messages)
        if self.provider == "openrouter":
            return self._call_openrouter(messages)
        if self.provider == "ollama":
            return self._call_ollama(messages)
        return self.mock_respond(messages, iteration)

    def _call_openai(self, messages: List[Dict[str, str]]) -> str:
        try:
            from openai import OpenAI

            client = OpenAI(api_key=os.getenv("OPENAI_API_KEY", ""))
            response = client.chat.completions.create(
                model=os.getenv("OPENAI_MODEL", "gpt-4"),
                messages=messages,
                temperature=0.2,
                max_tokens=800,
            )
            return response.choices[0].message.content or ""
        except Exception as exc:
            logger.warning("OpenAI call failed (%s); falling back to mock responder", exc)
            return self.mock_respond(messages, self._llm_call_count)

    def _call_groq(self, messages: List[Dict[str, str]]) -> str:
        try:
            from openai import OpenAI as GroqClient

            client = GroqClient(base_url="https://api.groq.com/openai/v1", api_key=os.getenv("GROQ_API_KEY", ""))
            response = client.chat.completions.create(
                model=os.getenv("GROQ_MODEL", "llama3-70b-8192"),
                messages=messages,
                temperature=0.2,
            )
            return response.choices[0].message.content or ""
        except Exception as exc:
            logger.warning("Groq call failed (%s); falling back to mock responder", exc)
            return self.mock_respond(messages, self._llm_call_count)

    def _call_openrouter(self, messages: List[Dict[str, str]]) -> str:
        try:
            from openai import OpenAI as ORClient

            client = ORClient(base_url="https://openrouter.ai/api/v1", api_key=os.getenv("OPENROUTER_API_KEY", ""))
            response = client.chat.completions.create(
                model=os.getenv("OPENROUTER_MODEL", "anthropic/claude-3-opus"),
                messages=messages,
                temperature=0.2,
            )
            return response.choices[0].message.content or ""
        except Exception as exc:
            logger.warning("OpenRouter call failed (%s); falling back to mock responder", exc)
            return self.mock_respond(messages, self._llm_call_count)

    def _call_ollama(self, messages: List[Dict[str, str]]) -> str:
        try:
            import httpx

            base_url = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
            model = os.getenv("OLLAMA_MODEL", "llama3")
            response = httpx.post(
                f"{base_url}/api/chat",
                json={"model": model, "messages": messages, "stream": False},
                timeout=30,
            )
            return response.json()["message"]["content"]
        except Exception as exc:
            logger.warning("Ollama call failed (%s); falling back to mock responder", exc)
            return self.mock_respond(messages, self._llm_call_count)

    # -- hooks each concrete agent must implement -------------------------------

    @abstractmethod
    def mock_respond(self, messages: List[Dict[str, str]], iteration: int) -> str:
        """Deterministic ReAct-protocol-formatted response used in mock mode."""
        raise NotImplementedError

    @abstractmethod
    def _fallback_factory(self, raw_text: str, errors: list) -> BaseModel:
        """Schema-appropriate safe fallback when guardrail validation fails twice."""
        raise NotImplementedError

    @abstractmethod
    def _fallback_type(self) -> Type[BaseModel]:
        """The concrete fallback class, used to flag `used_fallback` in ReactRunResult."""
        raise NotImplementedError
