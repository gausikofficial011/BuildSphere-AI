from typing import Dict, Any
import datetime

class ApprovalEngine:
    """
    Rule 42: Approval Engine
    Rule 44: Approval Version Lock (Supersession)
    Rule 110: Approval Superseded Test
    """
    def __init__(self):
        self.approvals = {}
        self.resource_versions = {}
        
    def submit_for_approval(self, approval_id: str, resource_id: str, resource_version: int, requester: str) -> None:
        self.approvals[approval_id] = {
            "id": approval_id,
            "resource": resource_id,
            "resourceVersion": resource_version,
            "requester": requester,
            "status": "PENDING"
        }
        self.resource_versions[resource_id] = resource_version
        
    def approve(self, approval_id: str) -> None:
        approval = self.approvals.get(approval_id)
        if not approval:
            return
            
        current_resource_version = self.resource_versions.get(approval["resource"])
        
        # Rule 44: Version Lock Check
        if approval["resourceVersion"] != current_resource_version:
            approval["status"] = "SUPERSEDED"
            raise Exception("APPROVAL_FAILED: The resource has changed since submission (SUPERSEDED).")
            
        approval["status"] = "APPROVED"
        
    def update_resource(self, resource_id: str, new_version: int) -> None:
        """Simulates an external modification to the resource"""
        self.resource_versions[resource_id] = new_version
