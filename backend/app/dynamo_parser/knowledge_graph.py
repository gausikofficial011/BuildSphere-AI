from typing import Dict, Any, List

class DynamoKnowledgeGraph:
    """
    Converts a parsed Dynamo graph into a semantic knowledge graph
    so the AI can reason about data flow (Input -> Operation -> Result).
    """
    
    def build_graph(self, parsed_data: Dict[str, Any]) -> Dict[str, Any]:
        nodes_dict = {n["id"]: n for n in parsed_data["nodes"]}
        edges = parsed_data["connections"]
        
        # Build adjacency list
        adjacency = {n_id: [] for n_id in nodes_dict.keys()}
        for edge in edges:
            src = edge["source_node"]
            tgt = edge["target_node"]
            if src in adjacency:
                adjacency[src].append(tgt)
                
        return {
            "nodes": nodes_dict,
            "flow": adjacency
        }
