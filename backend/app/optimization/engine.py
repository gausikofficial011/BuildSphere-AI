from typing import List, Dict, Any
import copy

class DesignOptimizationEngine:
    """
    Rule 19, 20, 21, 22: Design Optimization and Pareto Evaluation.
    """
    def __init__(self):
        self.weights = {
            "usable_area": 0.6,
            "circulation": 0.4
        }
        
    def optimize_layout(self, base_design: Dict[str, Any]) -> Dict[str, Any]:
        """Generates candidates and returns a Pareto comparison"""
        candidates = self._generate_candidates(base_design)
        
        # Evaluate
        for cand in candidates:
            cand["metrics"] = self._evaluate_metrics(cand)
            cand["score"] = (cand["metrics"]["usable_area"] * self.weights["usable_area"]) - (cand["metrics"]["circulation"] * self.weights["circulation"])
            
        # Rank by score (Simplified Pareto sorting)
        candidates.sort(key=lambda x: x["score"], reverse=True)
        
        return {
            "base_design": base_design,
            "candidates": candidates,
            "best_candidate": candidates[0] if candidates else None
        }
        
    def _generate_candidates(self, base: Dict[str, Any]) -> List[Dict[str, Any]]:
        # Mock candidate generation - slightly modifying coordinates for demo
        cand1 = copy.deepcopy(base)
        cand1["id"] = "Candidate_A"
        cand1["description"] = "Maximizes Usable Area"
        # expand walls by 10%
        for el in cand1.get("elements", []):
            if el.get("category") == "Wall":
                el["geometry"]["w"] = el["geometry"].get("w", 0) * 1.1
                
        cand2 = copy.deepcopy(base)
        cand2["id"] = "Candidate_B"
        cand2["description"] = "Minimizes Circulation"
        # shrink walls by 5%
        for el in cand2.get("elements", []):
            if el.get("category") == "Wall":
                el["geometry"]["w"] = el["geometry"].get("w", 0) * 0.95
                
        return [cand1, cand2]
        
    def _evaluate_metrics(self, design: Dict[str, Any]) -> Dict[str, float]:
        area = 0.0
        for el in design.get("elements", []):
            if el.get("category") == "Wall":
                area += el["geometry"].get("w", 0) * el["geometry"].get("h", 0)
        
        # Fake circulation heuristic: smaller area = better circulation in this dumb mock
        circulation = area * 0.2 
        
        return {
            "usable_area": area,
            "circulation": circulation
        }
