from typing import Dict, Any, List

class ParetoFrontier:
    """
    Rule 22: Multi-Objective Generation.
    Rule 23: Pareto Frontier.
    """
    @staticmethod
    def get_non_dominated_candidates(candidates: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """
        Calculates the Pareto frontier based on:
        minimize Cost, maximize Area.
        """
        frontier = []
        for i, candidate in enumerate(candidates):
            dominated = False
            for j, other in enumerate(candidates):
                if i == j:
                    continue
                # A candidate is dominated if another candidate is better or equal in ALL objectives,
                # and strictly better in at least one objective.
                cost_better = other["cost"] <= candidate["cost"]
                area_better = other["area"] >= candidate["area"]
                strict_improvement = other["cost"] < candidate["cost"] or other["area"] > candidate["area"]
                
                if cost_better and area_better and strict_improvement:
                    dominated = True
                    break
            
            if not dominated:
                frontier.append(candidate)
                
        return frontier
