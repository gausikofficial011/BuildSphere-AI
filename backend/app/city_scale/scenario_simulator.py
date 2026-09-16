from typing import Dict, Any

class UrbanImpactSimulator:
    """Calculates the consequences of a new development."""
    def simulate_impact(self, baseline: Dict[str, Any], new_buildings: int) -> Dict[str, Any]:
        # Simple mock scaling for demonstration
        scale = new_buildings / 100.0
        return {
            "additional_power_load_percent": 15.0 * scale,
            "additional_water_load_percent": 10.0 * scale,
            "additional_traffic_index": 2.0 * scale,
            "carbon_increase_tons": 5000 * scale
        }
