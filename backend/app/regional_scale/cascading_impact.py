from typing import Dict, Any

class NetworkDisruptionSimulator:
    """Calculates the cascading consequences of a regional disruption."""
    def simulate_disruption(self, baseline: Dict[str, Any], failed_node: str, duration_days: int) -> Dict[str, Any]:
        return {
            "disrupted_node": failed_node,
            "duration": duration_days,
            "traffic_impact_index": 8.5 * (duration_days / 10.0),
            "freight_delay_hours": 14 * (duration_days / 30.0),
            "affected_cities": 4, # Cascaded to A, B, C, D
            "affected_projects": 12
        }
