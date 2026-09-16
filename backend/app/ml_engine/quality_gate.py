from typing import List, Dict, Any

class InsufficientDataError(Exception):
    pass

class DataQualityGate:
    MINIMUM_PROJECTS = 5
    MINIMUM_ELEMENTS = 1000
    
    @staticmethod
    def run_gate(elements: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Rule 65 & Rule 1: Evaluates dataset size. If insufficient, blocks training.
        """
        unique_projects = set()
        for el in elements:
            model_id = el.get("provenance", {}).get("sourceModelId", "unknown")
            unique_projects.add(model_id)
            
        project_count = len(unique_projects)
        element_count = len(elements)
        
        if project_count < DataQualityGate.MINIMUM_PROJECTS or element_count < DataQualityGate.MINIMUM_ELEMENTS:
            return {
                "status": "BLOCK_TRAINING",
                "reason": "NOT_TRAINED_DUE_TO_INSUFFICIENT_DATA",
                "details": f"Found {project_count} projects and {element_count} elements. Required: {DataQualityGate.MINIMUM_PROJECTS} projects, {DataQualityGate.MINIMUM_ELEMENTS} elements."
            }
            
        return {
            "status": "PASS",
            "reason": "DATASET_SUFFICIENT",
            "details": f"Found {project_count} projects and {element_count} elements."
        }
