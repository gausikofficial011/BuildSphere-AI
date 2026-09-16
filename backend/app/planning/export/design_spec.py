from typing import Dict, Any

class DesignSpecExporter:
    """
    Rule 69: Export Format (BuildSphere Building Design JSON)
    """
    @staticmethod
    def export(requirements: Any, validated_candidate: Dict[str, Any], validation_result: Dict[str, Any]) -> Dict[str, Any]:
        site_req = requirements.site
        
        return {
            "schemaVersion": "1.0",
            "designVersion": "1.0",
            "metadata": {
                "status": "READY_FOR_EXPORT" if validation_result["status"] == "VALID" else "INVALID"
            },
            "site": {
                "width": site_req.width,
                "length": site_req.length
            } if site_req else {},
            "rooms": validated_candidate.get("rooms", []),
            "relationships": [],
            "constraints": [],
            "validation": validation_result,
            "commands": DesignSpecExporter._generate_commands(validated_candidate.get("rooms", []))
        }
        
    @staticmethod
    def _generate_commands(rooms: list) -> list:
        # Rule 33: BIM COMMAND PREPARATION (Do not execute)
        commands = []
        for i, room in enumerate(rooms):
            commands.append({
                "commandId": f"cmd_{i}",
                "commandType": "CREATE_ROOM",
                "parameters": room,
                "validationStatus": "VALID"
            })
        return commands
