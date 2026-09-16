from typing import Dict, Any

class VisionAdapter:
    """
    Phase 10: Closed-Loop Computer Vision Integration.
    Parses structural discrepancies found by edge site cameras/drones.
    """
    @staticmethod
    def parse_discrepancy_report(payload: Dict[str, Any]) -> Dict[str, Any]:
        """
        Takes a vision model output (e.g., 'Wall 10cm off axis') and structures it for the Decision Engine.
        """
        element_id = payload.get("element_id")
        variance_mm = payload.get("variance_mm", 0)
        
        return {
            "element": element_id,
            "variance_mm": variance_mm,
            "requires_rework": abs(variance_mm) > 50,  # 5cm tolerance hardcoded for demo
            "source": "SITE_CAMERA",
            "description": payload.get("description", "Vision discrepancy detected")
        }
