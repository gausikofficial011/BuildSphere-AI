from typing import Dict, Any

class SensorNetwork:
    """Simulates mock IoT telemetry for facility assets."""
    def get_telemetry(self, element_id: str) -> Dict[str, Any]:
        # Enforce Rule: explicitly state data is mocked/synthetic
        return {
            "source": "MOCKED_IOT_SENSOR",
            "element_id": element_id,
            "metrics": {
                "temperature": 85.0,
                "pressure": 120.5,
                "flow": 45.2,
                "energy": 1500
            },
            "historical_maintenance_pattern": "irregular"
        }

class FacilityTwin:
    """Tracks post-construction assets."""
    def get_asset_info(self, element_id: str) -> Dict[str, Any]:
        return {
            "bim_element": element_id,
            "location": "Level 3 -> Room 302",
            "current_state": "Operational",
            "condition": "Degrading"
        }
