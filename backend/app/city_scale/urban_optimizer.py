from typing import Dict, Any, List
from app.orchestration.delivery import GovernanceViolationException

class UrbanScenarioGenerator:
    """Generates alternative planning scenarios."""
    def generate_scenarios(self, impact: Dict[str, Any]) -> List[Dict[str, Any]]:
        base_power = impact["additional_power_load_percent"]
        base_traffic = impact["additional_traffic_index"]
        base_carbon = impact["carbon_increase_tons"]
        
        return [
            {
                "id": "SCENARIO_A",
                "name": "Maximum Development",
                "power_impact": base_power * 1.5,
                "traffic_impact": base_traffic * 1.5,
                "carbon_impact": base_carbon * 1.5
            },
            {
                "id": "SCENARIO_B",
                "name": "Balanced Development",
                "power_impact": base_power,
                "traffic_impact": base_traffic,
                "carbon_impact": base_carbon
            },
            {
                "id": "SCENARIO_C",
                "name": "Low-Carbon Development",
                "power_impact": base_power * 0.7,
                "traffic_impact": base_traffic * 1.1,
                "carbon_impact": base_carbon * 0.4
            },
            {
                "id": "SCENARIO_D",
                "name": "Mobility Optimized",
                "power_impact": base_power * 1.1,
                "traffic_impact": base_traffic * 0.5,
                "carbon_impact": base_carbon * 0.8
            }
        ]
        
    def execute_scenario(self, scenario_id: str, human_approved: bool) -> Dict[str, Any]:
        if not human_approved:
            raise GovernanceViolationException(f"Agent attempted to deploy city-scale scenario without governed approval: {scenario_id}")
        return {
            "status": "APPROVED",
            "scenario_applied": scenario_id,
            "governance": "HUMAN_APPROVED"
        }
