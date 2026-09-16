from typing import Dict, Any

class NCR:
    def __init__(self, issue: str):
        self.issue = issue
        self.status = "OPEN"
        
class AECQualityEngine:
    """Rule 43: Quality Engine"""
    def __init__(self):
        self.ncrs = []
        
    def create_ncr(self, issue: str) -> NCR:
        ncr = NCR(issue)
        self.ncrs.append(ncr)
        return ncr
        
    def resolve_ncr(self, ncr: NCR) -> None:
        ncr.status = "CLOSED"

class AECProgressEngine:
    """Rule 29: Progress Engine"""
    def __init__(self):
        self.progress_state = {}
        
    def update_progress(self, task_id: str, evidence: Dict[str, Any]) -> None:
        """Rule 160: Task cannot become VERIFIED COMPLETE without evidence"""
        if not evidence:
            raise ValueError("Task cannot be verified without evidence")
        self.progress_state[task_id] = "VERIFIED_COMPLETE"
