import uuid
from typing import Dict, Any, List

class Scenario:
    def __init__(self, parent_id: str, assumptions: Dict[str, Any]):
        self.id = str(uuid.uuid4())
        self.parent_id = parent_id
        self.assumptions = assumptions
        self.state = {}
        self.metrics = {}
        self.status = "CREATED"

class AECSimulationOrchestrator:
    """Rule 21: AEC Simulation Orchestrator (4D/5D)"""
    def simulate(self, scenario: Scenario) -> Scenario:
        # Rule 272: Deterministic Mock Simulation. No fabrication.
        scenario.metrics["cost"] = 1000000 * scenario.assumptions.get("cost_multiplier", 1.0)
        scenario.metrics["time"] = 100 * scenario.assumptions.get("time_multiplier", 1.0)
        scenario.metrics["risk"] = scenario.assumptions.get("risk_score", 0.5)
        scenario.status = "SIMULATED"
        return scenario

class AECDesignOptimizer:
    """Rule 27 & 32: Multi-Objective Pareto Optimization"""
    def generate_pareto_frontier(self, scenarios: List[Scenario]) -> List[Scenario]:
        # Simple Pareto non-dominated sort (minimize cost and time)
        pareto_front = []
        for s1 in scenarios:
            dominated = False
            for s2 in scenarios:
                if s1.id == s2.id: continue
                # if s2 is better in ALL metrics, s1 is dominated
                if s2.metrics["cost"] <= s1.metrics["cost"] and s2.metrics["time"] <= s1.metrics["time"] and s2.metrics["risk"] <= s1.metrics["risk"]:
                    if s2.metrics["cost"] < s1.metrics["cost"] or s2.metrics["time"] < s1.metrics["time"] or s2.metrics["risk"] < s1.metrics["risk"]:
                        dominated = True
                        break
            if not dominated:
                pareto_front.append(s1)
        return pareto_front

class PromotionGate:
    """Rule 142 & 213: Production Promotion Gate"""
    def promote(self, scenario: Scenario, world_model_state: Dict[str, Any]) -> Dict[str, Any]:
        if scenario.status != "APPROVED":
            raise ValueError("Cannot promote an unapproved scenario.")
        
        # Merge scenario state into production world model
        world_model_state.update(scenario.state)
        return world_model_state

class AECVirtualProjectLab:
    """Phase 15: AEC Virtual Project Lab (Rules 2-12)"""
    def __init__(self, world_model_state: Dict[str, Any]):
        self.production_state = world_model_state
        self.scenarios = {}
        self.simulator = AECSimulationOrchestrator()
        self.optimizer = AECDesignOptimizer()
        self.gate = PromotionGate()

    def clone_to_scenario(self, assumptions: Dict[str, Any]) -> Scenario:
        """Rule 4: Project Cloning"""
        scenario = Scenario(parent_id="PROD", assumptions=assumptions)
        # Deep copy state ideally, but simplified for architecture
        scenario.state = self.production_state.copy()
        self.scenarios[scenario.id] = scenario
        return scenario

    def run_simulation(self, scenario_id: str):
        if scenario_id not in self.scenarios:
            raise KeyError("Scenario not found")
        self.scenarios[scenario_id] = self.simulator.simulate(self.scenarios[scenario_id])

    def get_pareto_candidates(self) -> List[Scenario]:
        simulated = [s for s in self.scenarios.values() if s.status == "SIMULATED" or s.status == "APPROVED"]
        return self.optimizer.generate_pareto_frontier(simulated)
    
    def approve_scenario(self, scenario_id: str):
        self.scenarios[scenario_id].status = "APPROVED"

    def promote_to_production(self, scenario_id: str):
        """Rule 143: Promote to Production"""
        scenario = self.scenarios[scenario_id]
        self.production_state = self.gate.promote(scenario, self.production_state)
        return self.production_state
