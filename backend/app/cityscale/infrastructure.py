from typing import Dict, List, Set

class InfrastructureNode:
    def __init__(self, node_id: str, node_type: str):
        self.id = node_id
        self.type = node_type # e.g., 'TRANSFORMER', 'BUILDING'
        self.state = "ONLINE"
        self.dependencies: List[str] = [] # IDs of nodes this node depends on

class InfrastructureGraph:
    """Rule 23: Infrastructure Graph"""
    def __init__(self):
        self.nodes: Dict[str, InfrastructureNode] = {}
        
    def add_node(self, node_id: str, node_type: str) -> InfrastructureNode:
        node = InfrastructureNode(node_id, node_type)
        self.nodes[node_id] = node
        return node
        
    def add_dependency(self, node_id: str, depends_on_id: str):
        if node_id in self.nodes and depends_on_id in self.nodes:
            self.nodes[node_id].dependencies.append(depends_on_id)
            
    def propagate_failure(self, failed_node_id: str) -> Set[str]:
        """Rule 26: Impact Propagation (Topology-based)"""
        self.nodes[failed_node_id].state = "OFFLINE"
        impacted_nodes = set()
        
        # Simple BFS for topological impact
        queue = [failed_node_id]
        while queue:
            current = queue.pop(0)
            for node_id, node in self.nodes.items():
                if current in node.dependencies and node.state == "ONLINE":
                    node.state = "DEGRADED"
                    impacted_nodes.add(node_id)
                    queue.append(node_id)
                    
        return impacted_nodes
