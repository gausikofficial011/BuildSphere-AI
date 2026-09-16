from typing import Dict, Any, List
from app.orchestration.delivery import GovernanceViolationException

class MultiObjectiveOptimizer:
    """Generates options based on time, cost, and risk parameters."""
    def generate_options(self, root_cause_chain: List[str], current_delay_days: int, current_cost: float) -> List[Dict[str, Any]]:
        # Mock options as per demo requirements
        options = [
            {
                "id": "BASELINE",
                "name": "Do Nothing",
                "finish_date": "June 30",
                "cost_delta": 0,
                "risk": "High",
                "time_saved": 0
            },
            {
                "id": "OPTION_A",
                "name": "Add Equipment",
                "finish_date": "June 23",
                "cost_delta": 25000,
                "risk": "Medium",
                "time_saved": 7
            },
            {
                "id": "OPTION_B",
                "name": "Change Sequence",
                "finish_date": "June 25",
                "cost_delta": 5000,
                "risk": "Medium-Low",
                "time_saved": 5
            },
            {
                "id": "OPTION_C",
                "name": "Additional Robot",
                "finish_date": "June 21",
                "cost_delta": 35000,
                "risk": "Low",
                "time_saved": 9
            }
        ]
        return options

class ScenarioEvaluator:
    """Evaluates options and enforces execution rules."""
    def execute_option(self, option_id: str, human_approved: bool) -> Dict[str, Any]:
        if not human_approved:
            raise GovernanceViolationException(f"Agent attempted to modify production schedule without governed approval: {option_id}")
        return {
            "status": "EXECUTED",
            "option_applied": option_id,
            "governance": "HUMAN_APPROVED"
        }
