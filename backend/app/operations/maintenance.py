import uuid
from typing import List
from app.operations.faults import Fault

class WorkOrder:
    """Rule 39: Work Order Engine"""
    def __init__(self, asset_id: str, issue: str, root_cause: str):
        self.id = str(uuid.uuid4())
        self.asset_id = asset_id
        self.issue = issue
        self.root_cause = root_cause
        self.status = "DETECTED"
        
    def advance_status(self, new_status: str):
        self.status = new_status

class FacilityMaintenanceEngine:
    """Rule 37: Maintenance Engine"""
    def __init__(self):
        self.work_orders: List[WorkOrder] = []
        
    def create_work_order_from_fault(self, fault: Fault, root_cause: str) -> WorkOrder:
        wo = WorkOrder(fault.asset_id, fault.issue, root_cause)
        self.work_orders.append(wo)
        return wo
