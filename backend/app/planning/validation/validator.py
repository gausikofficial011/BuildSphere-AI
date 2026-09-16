from typing import Dict, Any, List
from app.planning.geometry.engine import GeometryEngine

class DesignValidator:
    """
    Rule 37: Design Validation Pipeline
    """
    @staticmethod
    def validate_candidate(candidate: Dict[str, Any], site: Dict[str, float]) -> Dict[str, Any]:
        errors = []
        warnings = []
        
        rooms = candidate.get("rooms", [])
        
        # Check Site Boundary (Rule 22)
        for room in rooms:
            if not GeometryEngine.is_inside_site(room["geometry"], site):
                errors.append(f"Room {room['name']} ({room['roomId']}) is outside site boundary.")
                
        # Check Overlaps
        for i in range(len(rooms)):
            for j in range(i + 1, len(rooms)):
                # Only check overlap if on same floor
                if rooms[i]["floor"] == rooms[j]["floor"]:
                    if GeometryEngine.check_overlap(rooms[i]["geometry"], rooms[j]["geometry"]):
                        errors.append(f"Overlap detected between {rooms[i]['name']} and {rooms[j]['name']}.")
                        
        status = "INVALID" if errors else "VALID"
        if not errors and not warnings:
            warnings.append("No circulation path detected (Warning: simplified validation).")
            
        return {
            "status": status,
            "errors": errors,
            "warnings": warnings
        }
