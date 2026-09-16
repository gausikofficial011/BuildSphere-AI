from typing import Dict, Any

class HardwareAbstractionLayer:
    """Manages connection states to physical robotics."""
    STATES = ["SIMULATED", "DIGITAL_TWIN", "CONNECTED", "LIVE", "OFFLINE", "UNKNOWN"]
    
    @staticmethod
    def get_allowed_states():
        return HardwareAbstractionLayer.STATES

class PhysicalRobotConnector:
    """Mock connector to ensure NO FABRICATION."""
    def __init__(self, robot_id: str):
        self.robot_id = robot_id
        
    def get_status(self) -> str:
        # Enforce rule: DO NOT ASSUME A PHYSICAL ROBOT EXISTS
        return "SIMULATED"
        
    def verify_completion(self, mission_id: str) -> Dict[str, Any]:
        """Returns explicitly mocked verification data."""
        return {
            "mission": mission_id,
            "status": "VERIFIED_MOCK",
            "vision_match": True,
            "source": "MOCKED_CAMERA",
            "provenance": "TEST_ENVIRONMENT"
        }
