from typing import Dict, Any, List
from app.execution.adapters.interface import IRevitExecutionAdapter
from app.execution.safety.validator import ExecutionValidator
from app.execution.sync.verifier import ExecutionVerifier

class ExecutionEngine:
    """
    Rule 2: Execution Architecture.
    Rule 74: Execution Job System.
    """
    def __init__(self, adapter: IRevitExecutionAdapter):
        self.adapter = adapter
        self.journal = []
        
    def execute_design(self, design: Dict[str, Any]) -> Dict[str, Any]:
        # 1. VALIDATING (Dry Run)
        commands = design.get("commands", [])
        dry_run_result = ExecutionValidator.dry_run(commands)
        
        if dry_run_result["status"] != "DRY_RUN_SUCCESS":
            return {"status": "FAILED", "reason": "DRY_RUN_FAILED", "errors": dry_run_result["errors"]}
            
        sorted_cmds = dry_run_result["sorted_commands"]
        
        # 2. EXECUTING
        self.adapter.open_model("TestModel")
        self.adapter.begin_transaction("BuildSphere Auto Generation")
        
        # For simplicity, simulating mapped ids globally.
        # In real scenario, commands contain dependencies.
        level_map = {}
        wall_map = {}
        
        for cmd in sorted_cmds:
            cmd_id = cmd["commandId"]
            cmd_type = cmd["commandType"]
            params = cmd["parameters"]
            
            try:
                if cmd_type == "CREATE_LEVEL":
                    el_id = self.adapter.create_level(params["name"], params["elevation"])
                    level_map["default"] = el_id # Storing first level created
                    
                elif cmd_type == "CREATE_WALL":
                    el_id = self.adapter.create_wall(
                        params["geometry"], 
                        params["geometry"], 
                        level_map.get("default", "lvl_mock"), 
                        "Basic Wall"
                    )
                    wall_map[cmd_id] = el_id
                    
                elif cmd_type == "CREATE_DOOR":
                    el_id = self.adapter.create_door(
                        wall_map.get(params.get("host_wall", "cmd_wall_0"), "wall_mock"), 
                        params["geometry"], 
                        "Basic Door"
                    )
                    
                elif cmd_type == "CREATE_ROOM":
                    el_id = self.adapter.create_room(
                        params["name"],
                        level_map.get("default", "lvl_mock"),
                        []
                    )
                else:
                    raise Exception(f"Unsupported execution for {cmd_type}")
                    
                self.journal.append({
                    "commandId": cmd_id,
                    "status": "SUCCESS",
                    "revit_element_id": el_id
                })
                
            except Exception as e:
                # Rule 51: Failure Handling
                # Rule 52: Partial Failure (we catch and continue where independent)
                self.journal.append({
                    "commandId": cmd_id,
                    "status": "FAILED",
                    "error": str(e)
                })
                
        self.adapter.commit_transaction()
        
        # 3. VERIFYING (Rule 36, 37)
        verification_result = ExecutionVerifier.verify(self.adapter, self.journal)
        
        self.adapter.close_model()
        
        return {
            "status": verification_result["status"],
            "verification": verification_result,
            "journal": self.journal
        }
