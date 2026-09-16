from typing import Dict, Any

class BuildSphereDigitalTwin:
    """
    Rule 39, 40: Digital Twin State Tracker.
    Maintains the mapping between BuildSphere Design, Revit Execution, and real-world verified state.
    """
    def __init__(self, project_id: str):
        self.project_id = project_id
        self.design_version = "v0"
        self.revit_version = "v0"
        self.status = "DESIGNED" # DESIGNED, EXECUTED, VERIFIED, CURRENT, OUT_OF_SYNC, CONFLICTED
        self.elements = []
        
    def sync_from_execution(self, verified_elements: list):
        self.elements = verified_elements
        self.status = "VERIFIED"
        self.revit_version = self.design_version
        
    def check_conflict(self, incoming_revit_changes: list) -> bool:
        """
        Rule 58, 59: Revit Change Detection and Conflict Detection.
        """
        if incoming_revit_changes:
            self.status = "CONFLICTED"
            return True
        return False
        
    def get_timeline(self) -> Dict[str, Any]:
        """Rule 43: Digital Twin Timeline"""
        return {
            "projectId": self.project_id,
            "status": self.status,
            "elementCount": len(self.elements),
            "designVersion": self.design_version
        }
