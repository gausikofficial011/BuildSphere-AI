from typing import Dict, Any, List
from .engine import GeometryEngine

class LayoutGenerator:
    """
    Rule 17, 18: Generates multiple candidate layouts deterministically based on requirements.
    """
    @staticmethod
    def generate_candidates(room_graph: Any, site: Dict[str, float]) -> List[Dict[str, Any]]:
        # Mocking layout generation for Demo 4 (Generating multiple valid candidates)
        candidates = []
        
        # Candidate A: Linear arrangement
        layout_a = []
        current_x = 0
        for node in room_graph.nodes:
            # Rule 21: Room Placement
            w, h = 4.0, 4.0
            layout_a.append({
                "roomId": node["id"],
                "name": node["name"],
                "floor": node["floor"],
                "geometry": {"x": current_x, "y": 0, "w": w, "h": h}
            })
            current_x += w
            
        # Candidate B: L-Shape arrangement
        layout_b = []
        cx, cy = 0, 0
        for i, node in enumerate(room_graph.nodes):
            w, h = 4.0, 4.0
            if i % 2 == 0:
                cx += w
            else:
                cy += h
            layout_b.append({
                "roomId": node["id"],
                "name": node["name"],
                "floor": node["floor"],
                "geometry": {"x": cx, "y": cy, "w": w, "h": h}
            })
            
        candidates.append({"id": "Candidate_A", "rooms": layout_a})
        candidates.append({"id": "Candidate_B", "rooms": layout_b})
        
        return candidates
