from typing import Dict, Any

class GlobalDisruptionSimulator:
    """Calculates the cascading consequences of a global disruption."""
    def simulate_disruption(self, baseline: Dict[str, Any], failed_corridor: str, duration_days: int) -> Dict[str, Any]:
        return {
            "disrupted_corridor": failed_corridor,
            "duration": duration_days,
            "material_scarcity_index": 7.5 * (duration_days / 15.0),
            "portfolio_schedule_delay_days": 45 * (duration_days / 30.0),
            "affected_countries": 10, # Global cascade
            "affected_projects": 50 # All projects tracked
        }
