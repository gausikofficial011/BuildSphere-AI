from typing import Dict, List, Any

class RoomGraph:
    """
    Rule 10: Create a spatial graph. Node: Room. Edge: Relationship.
    """
    def __init__(self, program: Dict[str, Any]):
        self.nodes = []
        self.edges = []
        self._build(program)
        
    def _build(self, program: Dict[str, Any]):
        node_id = 0
        
        # Create Nodes
        for floor, rooms in program.items():
            for room in rooms:
                self.nodes.append({
                    "id": f"room_{node_id}",
                    "name": room["type"],
                    "floor": floor,
                    "privacy": room["privacy"]
                })
                node_id += 1
                
        # Create Edges (Mocking learned adjacencies, Rule 12)
        living_nodes = [n for n in self.nodes if n["name"] == "Living Room"]
        dining_nodes = [n for n in self.nodes if n["name"] == "Dining Room"]
        kitchen_nodes = [n for n in self.nodes if n["name"] == "Kitchen"]
        
        if living_nodes and dining_nodes:
            self.edges.append({"source": living_nodes[0]["id"], "target": dining_nodes[0]["id"], "type": "ADJACENT_TO"})
        if kitchen_nodes and dining_nodes:
            self.edges.append({"source": kitchen_nodes[0]["id"], "target": dining_nodes[0]["id"], "type": "NEAR"})
