import json
from typing import Dict, Any, List

class DynamoGraphParser:
    """
    Parses a Dynamo .dyn file (JSON format) and extracts structured data.
    """
    
    def parse_graph(self, graph_json: str) -> Dict[str, Any]:
        """
        Parses raw JSON of a Dynamo graph into a normalized schema.
        """
        data = json.loads(graph_json)
        
        return {
            "graph_id": data.get("Uuid"),
            "dynamo_version": data.get("View", {}).get("Dynamo", {}).get("Version", "Unknown"),
            "nodes": self._extract_nodes(data.get("Nodes", [])),
            "connections": self._extract_connections(data.get("Connectors", [])),
            "dependencies": data.get("NodeLibraryDependencies", [])
        }
        
    def _extract_nodes(self, raw_nodes: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        extracted = []
        for n in raw_nodes:
            extracted.append({
                "id": n.get("Id"),
                "name": n.get("Name"),
                "type": n.get("NodeType"),
                "category": n.get("Category", "BuiltIn"),
                "inputs": [port.get("Name") for port in n.get("Inputs", [])],
                "outputs": [port.get("Name") for port in n.get("Outputs", [])]
            })
        return extracted
        
    def _extract_connections(self, raw_connectors: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        extracted = []
        for c in raw_connectors:
            extracted.append({
                "source_node": c.get("Start"),
                "target_node": c.get("End"),
                "source_port": c.get("Id") # Simplified for phase 1
            })
        return extracted
