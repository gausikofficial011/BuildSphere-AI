from typing import List, Dict, Any

class ExecutionValidator:
    """
    Rule 11: Command Dependency Graph (Topological Sort).
    Rule 33: DRY RUN.
    """
    @staticmethod
    def topological_sort(commands: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        # Sort based on inherent BIM rules: Levels -> Walls -> Doors -> Rooms
        type_priority = {
            "CREATE_LEVEL": 0,
            "CREATE_WALL": 1,
            "CREATE_DOOR": 2,
            "CREATE_WINDOW": 2,
            "CREATE_ROOM": 3
        }
        
        # In a real graph we would check explicit command['dependencies'] array
        # For this test logic, we sort by priority tier
        return sorted(commands, key=lambda c: type_priority.get(c.get("commandType", ""), 99))

    @staticmethod
    def dry_run(commands: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Rule 33: Validate commands without executing."""
        sorted_cmds = ExecutionValidator.topological_sort(commands)
        
        errors = []
        for cmd in sorted_cmds:
            if "commandType" not in cmd:
                errors.append(f"Missing commandType in {cmd.get('commandId')}")
            if cmd.get("commandType") not in ["CREATE_LEVEL", "CREATE_WALL", "CREATE_DOOR", "CREATE_ROOM"]:
                # Rule 9: Reject unknown types
                errors.append(f"Unknown command type {cmd.get('commandType')} in {cmd.get('commandId')}")
                
        return {
            "status": "DRY_RUN_FAILED" if errors else "DRY_RUN_SUCCESS",
            "errors": errors,
            "sorted_commands": sorted_cmds
        }
