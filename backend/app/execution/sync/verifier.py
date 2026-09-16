from typing import Dict, Any, List
from app.execution.adapters.interface import IRevitExecutionAdapter

class ExecutionVerifier:
    """
    Rule 36: Revit Read-back.
    Rule 37: Execution Verification (PARTIAL_SUCCESS).
    """
    @staticmethod
    def verify(adapter: IRevitExecutionAdapter, journal: List[Dict[str, Any]]) -> Dict[str, Any]:
        expected_count = len(journal)
        actual_count = 0
        failed_commands = []
        
        for record in journal:
            if record["status"] == "SUCCESS":
                element_id = record.get("revit_element_id")
                # Rule 36: Actually query the adapter to read it back
                actual_element = adapter.read_back_element(element_id)
                if actual_element:
                    actual_count += 1
                else:
                    record["status"] = "VERIFICATION_FAILED"
                    failed_commands.append(record["commandId"])
            elif record["status"] == "FAILED":
                failed_commands.append(record["commandId"])
                
        if actual_count == expected_count and expected_count > 0:
            status = "SUCCESS"
        elif actual_count > 0:
            status = "PARTIAL_SUCCESS" # Rule 52
        else:
            status = "FAILED"
            
        return {
            "status": status,
            "expected_elements": expected_count,
            "verified_elements": actual_count,
            "failed_commands": failed_commands
        }
