from typing import Dict, Any
from .state import WorldStateEngine
from .simulator import AECUniversalSimulator
from ..superintelligence.engine import AECSuperIntelligenceEngine

class AECWorldModelEngine:
    """
    Phase 12: The God-Level World Model Orchestrator.
    Rule 169: Final Super-Demo integration.
    """
    def __init__(self):
        self.state_engine = WorldStateEngine()
        self.simulator = AECUniversalSimulator()
        self.superintelligence = AECSuperIntelligenceEngine()
        
    def process_world_event(self, event_type: str, payload: Dict[str, Any], user_role: str) -> Dict[str, Any]:
        """
        Wraps Phase 11 Superintelligence inside World State Management.
        """
        # Production Lifecycle Passthrough
        if event_type in ["GENERATE_DESIGN", "EXECUTE_APPROVED_DESIGN", "CONSTRUCTION_OBSERVATION"]:
            # Route to Phase 11 Superintelligence
            return self.superintelligence.process_lifecycle_event(event_type, payload, user_role)
            
        # Phase 12 Counterfactual Scenarios
        if event_type == "SIMULATE_SCENARIO":
            # 1. Branch isolated world state
            scenario_id = self.state_engine.create_scenario_branch(payload.get("scenario_name", "Test Scenario"))
            scenario_state = self.state_engine.get_state(scenario_id)
            
            # 2. Run universal simulation
            if payload.get("action") == "SUPPLIER_DELAY":
                sim_result = self.simulator.simulate_procurement_delay(
                    world_state=scenario_state,
                    supplier_id=payload.get("supplier_id"),
                    delay_days=payload.get("delay_days", 0)
                )
                return {
                    "status": "SUCCESS",
                    "scenario_id": scenario_id,
                    "simulation_result": sim_result
                }
                
        return {"status": "UNKNOWN_WORLD_EVENT"}
