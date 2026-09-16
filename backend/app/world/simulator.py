from typing import Dict, Any

class AECUniversalSimulator:
    """
    Phase 12: Universal AEC Simulator.
    Rules 41-45, 60: Counterfactual & Procurement Scenario Simulation.
    """
    def simulate_procurement_delay(self, world_state: Dict[str, Any], supplier_id: str, delay_days: int) -> Dict[str, Any]:
        """
        Rule 60: "What if Supplier A is delayed?"
        Rule 192: Copilot Example 2.
        Propagates delay through schedule and cost without mutating production.
        """
        if world_state.get("mode") != "SCENARIO":
            raise ValueError("Rule 8: Do not modify production state for simulation!")
            
        # Simulate Impact
        world_state["schedule"]["delay_days"] += delay_days
        world_state["schedule"]["status"] = "DELAYED"
        
        # Arbitrary cost penalty simulation for delay
        cost_penalty = delay_days * 5000 
        world_state["cost"]["overrun_amount"] += cost_penalty
        world_state["cost"]["status"] = "OVER_BUDGET"
        
        return {
            "status": "SIMULATION_COMPLETE",
            "impact_summary": f"Schedule delayed by {delay_days} days. Cost overrun: ${cost_penalty}.",
            "new_state": world_state
        }
