from enum import Enum
from typing import List

class ResourcePermission(Enum):
    """Rule 7: Fine-Grained Permissions"""
    PROJECT_VIEW = "PROJECT_VIEW"
    PROJECT_EDIT = "PROJECT_EDIT"
    BIM_VIEW = "BIM_VIEW"
    BIM_EDIT = "BIM_EDIT"
    BIM_EXECUTE = "BIM_EXECUTE"
    DOCUMENT_APPROVE = "DOCUMENT_APPROVE"

class RBACEngine:
    """
    Rule 6: Role Model
    Rule 8: RBAC + Project Permissions
    """
    ROLES = {
        "SUPER_ADMIN": [p for p in ResourcePermission],
        "ORG_ADMIN": [p for p in ResourcePermission],
        "ARCHITECT": [
            ResourcePermission.PROJECT_VIEW,
            ResourcePermission.BIM_VIEW,
            ResourcePermission.BIM_EDIT,
            ResourcePermission.DOCUMENT_APPROVE
        ],
        "CLIENT": [
            ResourcePermission.PROJECT_VIEW,
            ResourcePermission.BIM_VIEW
        ]
    }
    
    @staticmethod
    def check_permission(role: str, permission: ResourcePermission) -> bool:
        allowed = RBACEngine.ROLES.get(role, [])
        return permission in allowed
