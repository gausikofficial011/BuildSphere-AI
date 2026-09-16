from typing import Dict, Any, List
from app.orchestration.delivery import GovernanceViolationException

class GlobalPortfolioOptimizer:
    """Generates alternative global recovery strategies."""
    def generate_portfolios(self, impact: Dict[str, Any]) -> List[Dict[str, Any]]:
        base_delay = impact["portfolio_schedule_delay_days"]
        
        return [
            {
                "id": "PORTFOLIO_A",
                "name": "Re-route Shipments",
                "cost_premium": "High",
                "portfolio_delay_recovered_days": base_delay * 0.8,
                "strategy": "Aggressive"
            },
            {
                "id": "PORTFOLIO_B",
                "name": "Local Material Substitution",
                "cost_premium": "Medium",
                "portfolio_delay_recovered_days": base_delay * 0.4,
                "strategy": "Adaptive"
            },
            {
                "id": "PORTFOLIO_C",
                "name": "Pause Non-Critical Global Projects",
                "cost_premium": "Low",
                "portfolio_delay_recovered_days": base_delay * 0.1,
                "strategy": "Conservative"
            }
        ]
        
    def execute_portfolio(self, portfolio_id: str, human_approved: bool) -> Dict[str, Any]:
        if not human_approved:
            raise GovernanceViolationException(f"Agent attempted to deploy global portfolio without governed approval: {portfolio_id}")
        return {
            "status": "APPROVED",
            "portfolio_applied": portfolio_id,
            "governance": "HUMAN_APPROVED"
        }
