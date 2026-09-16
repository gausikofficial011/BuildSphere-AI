from typing import List, Dict, Any

class QuantityEngine:
    """
    Rule 26, 27, 28: Cost Estimation and BOQ Engine.
    Never estimate quantities from an LLM. Use actual geometry.
    """
    @staticmethod
    def generate_boq(elements: List[Dict[str, Any]]) -> Dict[str, Any]:
        boq = {
            "civil": [],
            "architectural": [],
            "total_estimated_cost": 0.0
        }
        
        for el in elements:
            cat = el.get("category", "")
            geom = el.get("geometry", {})
            
            if cat == "Wall":
                area = geom.get("w", 0) * geom.get("h", 0) # simplified 2D area
                cost = area * 150.0 # Configurable rate (Rule 29)
                boq["architectural"].append({
                    "elementId": el.get("id"),
                    "item": "Basic Wall",
                    "quantity": area,
                    "unit": "sqm",
                    "cost": cost
                })
                boq["total_estimated_cost"] += cost
                
            elif cat == "Door":
                boq["architectural"].append({
                    "elementId": el.get("id"),
                    "item": "Basic Door",
                    "quantity": 1,
                    "unit": "ea",
                    "cost": 500.0
                })
                boq["total_estimated_cost"] += 500.0
                
        return boq
