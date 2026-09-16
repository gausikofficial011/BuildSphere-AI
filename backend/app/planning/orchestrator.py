from typing import Dict, Any
from app.planning.requirements.parser import NaturalLanguageParser
from app.planning.spatial.program import BuildingProgram
from app.planning.spatial.room_graph import RoomGraph
from app.planning.geometry.generator import LayoutGenerator
from app.planning.validation.validator import DesignValidator
from app.planning.export.design_spec import DesignSpecExporter

class BuildingPlanningOrchestrator:
    """
    Rule 49: AI Orchestrator
    """
    def generate_design(self, prompt: str) -> Dict[str, Any]:
        # 1. Parse Requirements
        reqs = NaturalLanguageParser.parse(prompt)
        
        if not reqs.site:
            return {"status": "REQUIRED_INFORMATION", "missing": ["siteDimensions"]}
            
        site_dict = {"w": reqs.site.width, "l": reqs.site.length}
            
        # 2. Building Program
        program = BuildingProgram.generate(reqs)
        
        # 3. Room Graph
        graph = RoomGraph(program)
        
        # 4. Candidate Generation (Fallback to Deterministic - Rule 48)
        candidates = LayoutGenerator.generate_candidates(graph, site_dict)
        
        # 5. Validation
        best_candidate = None
        best_validation = None
        
        for candidate in candidates:
            val = DesignValidator.validate_candidate(candidate, site_dict)
            if val["status"] == "VALID":
                best_candidate = candidate
                best_validation = val
                break
                
        if not best_candidate:
            return {"status": "INVALID", "reason": "No valid geometry candidates found."}
            
        # 6. Export
        final_design = DesignSpecExporter.export(reqs, best_candidate, best_validation)
        
        return {
            "status": "SUCCESS",
            "design": final_design,
            "candidates_generated": len(candidates),
            "assumptions": [f"Assumed project type: {reqs.projectType.value}"]
        }
