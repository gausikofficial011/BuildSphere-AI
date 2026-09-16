from typing import Dict, Any

class SiteObservationEngine:
    """Mocks site perception data to prevent fabrication."""
    def get_observation(self, target_area: str) -> Dict[str, Any]:
        # Enforce Rule: explicitly state data is mocked/synthetic
        return {
            "area": target_area,
            "actual_progress": 62,
            "source": "MOCKED_DRONE",
            "is_live": False,
            "confidence": 0.95,
            "blocked_by": ["Material delivery delayed", "Equipment unavailable"]
        }

class ProgressAnalyzer:
    """Compares expected vs actual progress."""
    def analyze(self, expected_progress: int, observation: Dict[str, Any]) -> Dict[str, Any]:
        actual = observation.get("actual_progress", 0)
        gap = expected_progress - actual
        
        return {
            "status": "DELAY_DETECTED" if gap > 0 else "ON_TRACK",
            "progress_gap": gap,
            "root_causes": observation.get("blocked_by", []),
            "observation_source": observation.get("source")
        }
