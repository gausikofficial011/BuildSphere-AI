from typing import Dict, Any, List
from .specialized_agents import ArchitectAgent, StructuralAgent

class AECAgentOrchestrator:
    """
    Rule 13: Agent Orchestrator.
    Rule 14: Multi-Agent Design Review.
    Rule 15: Agent Conflict Resolution.
    Rule 103: No Uncontrolled Autonomy.
    """
    def __init__(self):
        self.architect = ArchitectAgent()
        self.structural = StructuralAgent()

    def run_design_review(self, design_state: Dict[str, Any]) -> Dict[str, Any]:
        arch_review = self.architect.analyze(design_state)
        struct_review = self.structural.analyze(design_state)
        
        return self._resolve_conflicts(arch_review, struct_review)
        
    def _resolve_conflicts(self, arch_review: Dict, struct_review: Dict) -> Dict[str, Any]:
        """
        Rule 15: If Architect and Structural agents disagree, DO NOT choose automatically.
        Create: CONFLICT. Require human resolution.
        """
        if "Expand Kitchen" in arch_review["suggestion"] and "Maintain Kitchen" in struct_review["suggestion"]:
            return {
                "status": "CONFLICT",
                "message": "Human Resolution Required. Architect suggests expanding, Structural flags load bearing constraint.",
                "evidence": [arch_review["evidence"], struct_review["evidence"]],
                "action_required": "HUMAN_APPROVAL" # Rule 103: Do not bypass Phase 5
            }
            
        return {
            "status": "CONSENSUS",
            "message": "Agents agree on design.",
            "action_required": "NONE"
        }
