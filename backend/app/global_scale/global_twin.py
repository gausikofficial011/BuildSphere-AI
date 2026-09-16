from typing import Dict, Any

class GlobalModel:
    """Tracks baseline mock state of the global AEC portfolio."""
    def get_baseline_state(self) -> Dict[str, Any]:
        return {
            "countries_tracked": ["Country_1", "Country_2", "Country_3", "Country_4", "Country_5", "Country_6", "Country_7", "Country_8", "Country_9", "Country_10"],
            "total_countries": 10,
            "global_projects": 50,
            "major_logistics_corridors": ["Global_Corridor_Alpha"],
            "source": "MOCKED_GLOBAL_LOGISTICS_API"
        }

class GlobalGraph:
    """Defines relationships across international logistics and projects."""
    def get_relationships(self) -> Dict[str, list]:
        return {
            "Global_Corridor_Alpha": ["Port_A", "Port_B", "Ocean_Freight"],
            "Ocean_Freight": ["Steel_Supply", "Timber_Supply", "Concrete_Supply"],
            "Steel_Supply": ["Country_1_Projects", "Country_5_Projects", "Country_9_Projects"]
        }
