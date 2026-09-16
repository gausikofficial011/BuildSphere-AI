from enum import Enum
from typing import List

class ActionPolicy(Enum):
    READ_ONLY = "READ_ONLY"
    NON_DESTRUCTIVE = "NON_DESTRUCTIVE"
    MODIFY = "MODIFY"
    DESTRUCTIVE = "DESTRUCTIVE"

class ToolPermissionSystem:
    """
    Rule 66, 67, 68: Role-Aware Copilot Permissions.
    """
    ROLES = {
        "Client": [ActionPolicy.READ_ONLY],
        "Architect": [ActionPolicy.READ_ONLY, ActionPolicy.NON_DESTRUCTIVE, ActionPolicy.MODIFY],
        "Admin": [ActionPolicy.READ_ONLY, ActionPolicy.NON_DESTRUCTIVE, ActionPolicy.MODIFY, ActionPolicy.DESTRUCTIVE]
    }
    
    @staticmethod
    def check_permission(role: str, required_policy: ActionPolicy) -> bool:
        allowed = ToolPermissionSystem.ROLES.get(role, [])
        return required_policy in allowed
