from typing import Dict, Any, List

class AECKnowledgeGraph:
    """
    Rule 8: AEC Knowledge Graph.
    Rule 9: Knowledge Graph Versioning.
    """
    def __init__(self):
        self.nodes = {}  # Map (node_id, version) -> node data
        self.edges = []
        
    def add_node(self, node_id: str, label: str, properties: Dict[str, Any], version: int):
        self.nodes[(node_id, version)] = {
            "id": node_id,
            "label": label,
            "properties": properties,
            "version": version
        }
        
    def add_edge(self, source_id: str, target_id: str, relationship: str, version: int):
        self.edges.append({
            "source": source_id,
            "target": target_id,
            "relationship": relationship,
            "version": version
        })
        
    def get_related_nodes(self, node_id: str, relationship: str, current_version: int) -> List[Dict]:
        """Returns related nodes for a specific version context to prevent historical mixing."""
        related = []
        for edge in self.edges:
            if edge["source"] == node_id and edge["relationship"] == relationship and edge["version"] == current_version:
                target = self.nodes.get((edge["target"], current_version))
                if target:
                    related.append(target)
        return related
