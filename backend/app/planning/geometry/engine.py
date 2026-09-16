from typing import Dict, Any

class GeometryEngine:
    """
    Rule 20: Deterministic Geometry Operations.
    """
    @staticmethod
    def check_overlap(rect1: Dict[str, float], rect2: Dict[str, float]) -> bool:
        """
        rect format: {x, y, w, h}
        Returns True if they overlap.
        """
        if (rect1["x"] >= rect2["x"] + rect2["w"] or rect2["x"] >= rect1["x"] + rect1["w"]):
            return False
        if (rect1["y"] >= rect2["y"] + rect2["h"] or rect2["y"] >= rect1["y"] + rect1["h"]):
            return False
        return True
        
    @staticmethod
    def is_inside_site(rect: Dict[str, float], site: Dict[str, float]) -> bool:
        """
        site format: {w, l}
        Assumes site starts at (0,0).
        """
        if rect["x"] < 0 or rect["y"] < 0:
            return False
        if rect["x"] + rect["w"] > site["w"]:
            return False
        if rect["y"] + rect["h"] > site["l"]:
            return False
        return True
