from typing import List, Dict, Any

class ClashEngine:
    """
    Rule 15, 16: Deterministic BIM Clash Detection.
    """
    @staticmethod
    def detect_clashes(elements: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        clashes = []
        # Naive spatial index for demo
        for i in range(len(elements)):
            for j in range(i + 1, len(elements)):
                el1 = elements[i]
                el2 = elements[j]
                
                # Rule 18: Explanations need categories
                cat1 = el1.get("category", "Unknown")
                cat2 = el2.get("category", "Unknown")
                
                # Skip checking if they are hosted (e.g., Door in Wall is not a clash unless invalid)
                if el1.get("host") == el2.get("id") or el2.get("host") == el1.get("id"):
                    continue
                    
                geom1 = el1.get("geometry", {})
                geom2 = el2.get("geometry", {})
                
                if ClashEngine._is_intersecting(geom1, geom2):
                    severity = ClashEngine._determine_severity(cat1, cat2)
                    clashes.append({
                        "elementA": el1.get("id"),
                        "categoryA": cat1,
                        "elementB": el2.get("id"),
                        "categoryB": cat2,
                        "severity": severity,
                        "description": f"Intersection between {cat1} and {cat2}"
                    })
        return clashes
        
    @staticmethod
    def _is_intersecting(g1: Dict, g2: Dict) -> bool:
        if not g1 or not g2:
            return False
        # Assuming bounding boxes {x, y, w, h}
        if (g1.get("x", 0) >= g2.get("x", 0) + g2.get("w", 0) or g2.get("x", 0) >= g1.get("x", 0) + g1.get("w", 0)):
            return False
        if (g1.get("y", 0) >= g2.get("y", 0) + g2.get("h", 0) or g2.get("y", 0) >= g1.get("y", 0) + g1.get("h", 0)):
            return False
        return True

    @staticmethod
    def _determine_severity(cat1: str, cat2: str) -> str:
        """Rule 17: Clash Severity"""
        if "Structure" in [cat1, cat2] and "Architecture" in [cat1, cat2]:
            return "HIGH"
        if "MEP" in [cat1, cat2]:
            return "CRITICAL"
        return "MEDIUM"
