from typing import Dict, Any, List
import uuid
import datetime

class IssueEngine:
    """
    Rule 44: BIM Issue Management.
    Rule 45: Issue Workflow.
    """
    def __init__(self):
        self.issues = {}
        
    def create_issue(self, issue_type: str, severity: str, element_ids: List[str], description: str) -> Dict[str, Any]:
        issue_id = f"iss_{uuid.uuid4().hex[:6]}"
        issue = {
            "issueId": issue_id,
            "type": issue_type, # CLASH, GEOMETRY, PARAMETER, etc.
            "severity": severity,
            "status": "OPEN", # OPEN, ACKNOWLEDGED, RESOLVED
            "elementIds": element_ids,
            "description": description,
            "createdAt": datetime.datetime.now(datetime.UTC).isoformat()
        }
        self.issues[issue_id] = issue
        return issue
        
    def resolve_issue(self, issue_id: str) -> bool:
        if issue_id in self.issues:
            self.issues[issue_id]["status"] = "RESOLVED"
            self.issues[issue_id]["resolvedAt"] = datetime.datetime.now(datetime.UTC).isoformat()
            return True
        return False
