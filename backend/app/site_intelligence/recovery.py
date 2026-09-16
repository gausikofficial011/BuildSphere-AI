from typing import Dict, Any, List
from app.orchestration.delivery import GovernanceViolationException

class ScenarioGenerator:
    """Generates AI recovery scenarios based on site delays."""
    def generate_scenarios(self, delay_analysis: Dict[str, Any]) -> List[Dict[str, Any]]:
        if delay_analysis["status"] != "DELAY_DETECTED":
            return []
            
        return [
            {"id": "SCENARIO_A", "action": "+1 equipment", "cost_impact": 5000, "time_saved": 2},
            {"id": "SCENARIO_B", "action": "change sequence", "cost_impact": 0, "time_saved": 1},
            {"id": "SCENARIO_C", "action": "alternative resource", "cost_impact": 2000, "time_saved": 3}
        ]

class ScheduleUpdater:
    """Manages the governance gate for schedule updates."""
    def apply_scenario(self, scenario: Dict[str, Any], approved_by_human: bool) -> Dict[str, Any]:
        """
        Enforces Rule: DO NOT AUTOMATICALLY REWRITE PRODUCTION SCHEDULES.
        """
        if not approved_by_human:
            raise GovernanceViolationException(
                f"Attempted to automatically apply scenario {scenario['id']} to production schedule without PM approval."
            )
            
        return {
            "applied_scenario": scenario["id"],
            "status": "PRODUCTION_UPDATED",
            "approved_by": "PM"
        }
