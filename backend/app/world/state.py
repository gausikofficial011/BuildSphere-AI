import copy
import uuid
from typing import Dict, Any

class WorldStateEngine:
    """
    Phase 12: Universal World State Engine.
    Rules 4-10: State Snapshots and Scenario Branching.
    """
    def __init__(self):
        self.production_state = {
            "mode": "PRODUCTION",
            "bim_elements": [],
            "schedule": {"status": "ON_TIME", "delay_days": 0},
            "cost": {"status": "ON_BUDGET", "overrun_amount": 0},
            "procurement": {}
        }
        self.scenarios = {}

    def create_scenario_branch(self, scenario_name: str) -> str:
        """Rule 7: Clone production state into an isolated branch."""
        scenario_id = str(uuid.uuid4())
        cloned_state = copy.deepcopy(self.production_state)
        cloned_state["mode"] = "SCENARIO"
        cloned_state["scenario_name"] = scenario_name
        
        self.scenarios[scenario_id] = cloned_state
        return scenario_id

    def get_state(self, scenario_id: str = None) -> Dict[str, Any]:
        """Returns the requested scenario state, or the production state if None."""
        if scenario_id and scenario_id in self.scenarios:
            return self.scenarios[scenario_id]
        return self.production_state
