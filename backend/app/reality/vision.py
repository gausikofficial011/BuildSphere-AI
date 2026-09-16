from typing import Dict, Any, List
from app.reality.bus import RealityObservation

class Deviation:
    def __init__(self, element_id: str, diff: float):
        self.element_id = element_id
        self.diff = diff
        self.severity = "MINOR" if diff < 5 else ("MODERATE" if diff < 15 else "MAJOR")
        self.verified = False

class AECSiteVisionEngine:
    """Rule 10: Computer Vision Site Engine"""
    def process_image(self, obs: RealityObservation) -> None:
        # Rule 261: MOCKED explicitly
        obs.data["ai_detected"] = "MOCKED_DETECTION"
        obs.verification_state = "AI_DETECTED"

class DeviationEngine:
    """Rule 19: Deviation Engine"""
    def calculate(self, designed: Dict[str, Any], observed: Dict[str, Any]) -> List[Deviation]:
        deviations = []
        for k, v in designed.items():
            if k in observed and isinstance(v, (int, float)) and isinstance(observed[k], (int, float)):
                diff = abs(v - observed[k])
                if diff > 0:
                    deviations.append(Deviation(element_id=k, diff=diff))
        return deviations

class AsBuiltEngine:
    """Rule 23: As-Built Engine"""
    def verify_candidate(self, deviation: Deviation) -> None:
        # Rule 25: Verification Process
        deviation.verified = True

    def update_bim(self, world_model_state: Dict[str, Any], deviations: List[Deviation]) -> Dict[str, Any]:
        """Rule 26: BIM As-Built Update"""
        for dev in deviations:
            if dev.verified:
                # Apply deviation (mock logic for demo: we adjust the state)
                # In reality this would be an element delta update
                if dev.element_id in world_model_state:
                    world_model_state[dev.element_id] += dev.diff # Mocking the update
        return world_model_state
