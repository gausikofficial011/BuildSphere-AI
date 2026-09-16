from typing import Dict, Any

class RegionalModel:
    """Tracks baseline mock state of a multi-city region."""
    def get_baseline_state(self) -> Dict[str, Any]:
        return {
            "cities_tracked": ["City_A", "City_B", "City_C", "City_D", "City_E"],
            "total_cities": 5,
            "infrastructure_nodes": 15,
            "major_bridges": ["Bridge_Alpha"],
            "source": "MOCKED_NATIONAL_GIS_API"
        }

class IntercityGraph:
    """Defines relationships across intercity networks."""
    def get_relationships(self) -> Dict[str, list]:
        return {
            "Bridge_Alpha": ["City_A_Traffic", "City_B_Traffic", "Regional_Freight"],
            "Regional_Freight": ["City_C_Logistics", "City_D_Logistics", "Construction_Projects"],
            "Construction_Projects": ["City_A_Projects", "City_E_Projects"]
        }
