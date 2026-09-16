import json
from typing import Dict, Any, List
from .node_detector import DynamoNodeDetector
from .graph_analyzer import DynamoGraphAnalyzer

class DynamoEnvironmentError(Exception):
    pass

class DynamoGraphParser:
    """
    Parses a Dynamo .dyn file WITHOUT EXECUTING it.
    Treats all Python nodes strictly as data.
    """
    
    def parse(self, json_content: str) -> Dict[str, Any]:
        data = json.loads(json_content)
        
        raw_nodes = data.get("Nodes", [])
        raw_connectors = data.get("Connectors", [])
        
        nodes = [DynamoNodeDetector.identify_node(n) for n in raw_nodes]
        connections = self._extract_connections(raw_connectors)
        metrics = DynamoGraphAnalyzer.calculate_metrics(nodes, connections)
        
        return {
            "graphId": data.get("Uuid", "unknown"),
            "dynamoVersion": data.get("View", {}).get("Dynamo", {}).get("Version", "Unknown"),
            "nodes": nodes,
            "connections": connections,
            "metrics": metrics,
            "metadata": {
                "execution_status": "DYNAMO_EXECUTION_NOT_AVAILABLE_IN_PHASE_2"
            }
        }
        
    def _extract_connections(self, raw_connectors: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        extracted = []
        for c in raw_connectors:
            extracted.append({
                "sourceNodeId": c.get("Start"),
                "targetNodeId": c.get("End")
            })
        return extracted

