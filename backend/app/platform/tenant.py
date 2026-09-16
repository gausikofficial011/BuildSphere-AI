from typing import Dict, Any, List

class MultiTenantEngine:
    """
    Rule 3: Organization Architecture
    Rule 4: Multi-Tenancy Isolation
    Rule 108: Multi-Tenant Security Test capability.
    """
    def __init__(self):
        # Database mock
        self.organizations = {}
        self.projects = {}
        
    def create_organization(self, org_id: str, name: str) -> None:
        self.organizations[org_id] = {"id": org_id, "name": name, "members": []}
        
    def add_user_to_org(self, user_id: str, org_id: str, role: str) -> None:
        if org_id in self.organizations:
            self.organizations[org_id]["members"].append({"userId": user_id, "role": role})
            
    def create_project(self, project_id: str, org_id: str, name: str) -> None:
        """Rule 9: Project Creation"""
        self.projects[project_id] = {
            "id": project_id,
            "org_id": org_id,
            "name": name,
            "documents": [],
            "models": []
        }
        
    def assert_tenant_access(self, user_id: str, target_org_id: str) -> bool:
        """
        Rule 108: Verify A cannot access B's projects.
        Throws exception if isolation is violated.
        """
        org = self.organizations.get(target_org_id)
        if not org:
            raise Exception("AUTHORIZATION_FAILED: Organization not found")
            
        for member in org["members"]:
            if member["userId"] == user_id:
                return True
                
        raise Exception("AUTHORIZATION_FAILED: Tenant Isolation Violation")
