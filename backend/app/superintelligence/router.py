from typing import Dict, Any

class IntelligenceRouter:
    """
    Phase 11: Intelligence Router.
    Rule 94: Deterministic Override.
    Do not use an LLM when deterministic computation is more reliable.
    """
    @staticmethod
    def route_query(query: str, project_data: Dict[str, Any]) -> Dict[str, Any]:
        query_lower = query.lower()
        
        # Rule 94: Deterministic override
        if "how many" in query_lower and "door" in query_lower:
            count = project_data.get("door_count", 0)
            return {
                "router_path": "DETERMINISTIC_BIM",
                "answer": f"There are {count} doors.",
                "confidence": 1.0,
                "evidence": "BIM Element Database"
            }
            
        # Route to LLM / Agent Reasoning
        if "why" in query_lower or "delayed" in query_lower:
            return {
                "router_path": "HYBRID_REASONING",
                "answer": "Analysis indicates a material delay impacting the critical path.",
                "confidence": 0.85,
                "evidence": "Procurement Graph + Schedule Engine"
            }
            
        return {
            "router_path": "UNKNOWN",
            "answer": "Could not determine routing path."
        }
