from typing import Dict, Any, List
from app.orchestration.delivery import GovernanceViolationException

class RecoveryStrategyGenerator:
    """Generates alternative regional recovery strategies."""
    def generate_strategies(self, impact: Dict[str, Any]) -> List[Dict[str, Any]]:
        base_delay = impact["freight_delay_hours"]
        
        return [
            {
                "id": "STRATEGY_A",
                "name": "Repair Immediately",
                "cost_index": 100,
                "freight_delay_recovered_hours": base_delay * 0.9,
                "disruption_reduction": "High"
            },
            {
                "id": "STRATEGY_B",
                "name": "Temporary Alternate Route",
                "cost_index": 40,
                "freight_delay_recovered_hours": base_delay * 0.5,
                "disruption_reduction": "Medium"
            },
            {
                "id": "STRATEGY_C",
                "name": "Prioritize Another Corridor",
                "cost_index": 15,
                "freight_delay_recovered_hours": base_delay * 0.2,
                "disruption_reduction": "Low"
            }
        ]
        
    def execute_strategy(self, strategy_id: str, human_approved: bool) -> Dict[str, Any]:
        if not human_approved:
            raise GovernanceViolationException(f"Agent attempted to deploy regional strategy without governed approval: {strategy_id}")
        return {
            "status": "APPROVED",
            "strategy_applied": strategy_id,
            "governance": "HUMAN_APPROVED"
        }
