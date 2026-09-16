from typing import Dict, Any

class CityModel:
    """Tracks baseline mock state of a city district."""
    def get_baseline_state(self) -> Dict[str, Any]:
        return {
            "current_buildings": 50,
            "power_grid_load_percent": 80.0,
            "water_capacity_percent": 75.0,
            "traffic_congestion_index": 6.5,
            "source": "MOCKED_GIS_API"
        }

class InfrastructureGraph:
    """Defines relationships across infrastructure domains."""
    def get_relationships(self) -> Dict[str, list]:
        return {
            "Building": ["Power Demand", "Water Demand", "Traffic Demand"],
            "Traffic Demand": ["Carbon Emissions", "Congestion"],
            "Power Demand": ["Grid Load", "Carbon Emissions"],
            "Water Demand": ["Drainage Load"]
        }
