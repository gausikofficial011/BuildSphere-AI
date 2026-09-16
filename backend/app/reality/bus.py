import uuid
from typing import Dict, Any, List

class RealityObservation:
    def __init__(self, source: str, data: Dict[str, Any], confidence: float):
        self.id = str(uuid.uuid4())
        self.source = source
        self.data = data
        self.confidence = confidence
        self.verification_state = "UNVERIFIED"
        
class AECObservationBus:
    """Rule 5: Observation Bus"""
    def __init__(self):
        self.observations: List[RealityObservation] = []
        
    def ingest(self, source: str, data: Dict[str, Any], confidence: float = 1.0) -> RealityObservation:
        obs = RealityObservation(source, data, confidence)
        self.observations.append(obs)
        return obs
        
    def get_unverified(self) -> List[RealityObservation]:
        return [o for o in self.observations if o.verification_state in ("UNVERIFIED", "AI_DETECTED")]
