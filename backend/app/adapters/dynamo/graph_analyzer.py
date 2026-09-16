from typing import Dict, Any, List

class DynamoGraphAnalyzer:
    @staticmethod
    def calculate_metrics(nodes: List[Dict[str, Any]], connections: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Calculates graph-theoretic metrics for the Dynamo graph.
        """
        python_count = sum(1 for n in nodes if n.get("isPython"))
        custom_count = sum(1 for n in nodes if n.get("isCustom"))
        revit_count = sum(1 for n in nodes if n.get("isRevit"))
        
        return {
            "nodeCount": len(nodes),
            "edgeCount": len(connections),
            "pythonNodeCount": python_count,
            "customNodeCount": custom_count,
            "revitNodeCount": revit_count
        }
