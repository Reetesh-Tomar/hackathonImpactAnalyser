"""
Intake Agent - First agent in the pipeline.
Analyzes the change request to understand scope, type, and basic info.
"""

from typing import Dict, Any, List
from app.agents.base_agent import BaseAgent
from app.models import AgentType


class IntakeAgent(BaseAgent):
    """Agent responsible for analyzing change intake information."""

    def __init__(self, data_loader, embedding_service=None):
        super().__init__(AgentType.INTAKE, data_loader, embedding_service)

    def process(self, input_data: Dict[str, Any], context: Dict[str, Any]) -> Dict[str, Any]:
        """Analyze the change request and extract key information."""
        change_title = input_data.get("change_title", "")
        change_description = input_data.get("change_description", "")
        change_type = input_data.get("change_type", "enhancement")
        affected_services_input = input_data.get("affected_services", [])
        priority = input_data.get("priority", "medium")

        # Use LLM or rule-based to interpret the change
        system_prompt = """You are an intake agent analyzing a change request. 
        Extract structured information about the change.
        Identify: change type category, primary service affected, scope of impact."""

        user_prompt = f"""
        Change Title: {change_title}
        Description: {change_description}
        Type: {change_type}
        Affected Services: {affected_services_input}
        Priority: {priority}
        """

        # Get LLM interpretation
        interpretation = self._call_llm(system_prompt, user_prompt)

        # Identify affected services from CMDB.
        #
        # Explicit affected_services_input matches always win. For free-text
        # matching against the title/description, require ALL of a service's
        # name words to be present (not just any single word) — otherwise a
        # generic word shared by many service names (e.g. "gateway" in both
        # "payment-gateway" and "api-gateway", or "database" in
        # "database-proxy") causes unrelated services to match on that one
        # word alone, which was previously producing noisy/incorrect primary
        # component resolution.
        services = self.data_loader.get_services()
        change_lower = (change_title + " " + change_description).lower()

        explicit_matches = [svc["name"] for svc in services if svc["name"] in affected_services_input]
        text_matches = []
        for svc in services:
            name_words = [w for w in svc["name"].lower().replace("-", " ").split() if w]
            if name_words and all(word in change_lower for word in name_words):
                text_matches.append(svc["name"])

        # Preserve order: explicit input matches first (most authoritative),
        # then free-text matches, de-duplicated.
        matched_services = []
        for name in explicit_matches + text_matches:
            if name not in matched_services:
                matched_services.append(name)

        # If no services matched, use the input or a default
        if not matched_services and affected_services_input:
            matched_services = list(affected_services_input)
        elif not matched_services:
            matched_services = ["unknown"]

        result = {
            "change_title": change_title,
            "change_description": change_description,
            "change_type": change_type,
            "priority": priority,
            "primary_services": matched_services,
            "interpretation": interpretation,
            "scope": self._determine_scope(change_type, matched_services)
        }

        return result

    def _determine_scope(self, change_type: str, services: List[str]) -> str:
        """Determine the scope of the change, purely by how many concrete
        services it touches (change_type is reported separately — mixing it
        into the scope label made an infrastructure change to a single
        service get classified the same as a multi-service change)."""
        if len(services) > 3:
            return "enterprise-wide"
        elif len(services) > 1:
            return "multi-service"
        else:
            return "single-service"

    def _mock_agent_response(self, prompt: str) -> str:
        """Mock response for intake agent."""
        return """[Mock Intake Analysis]
        Change Type: Enhancement
        Primary Impact: payment-gateway service
        Scope: Single-service change affecting payment processing
        Key Concern: Database configuration changes require careful migration planning
        """

