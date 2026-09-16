from typing import Dict, Any

class DynamoNodeDetector:
    @staticmethod
    def identify_node(node: Dict[str, Any]) -> Dict[str, Any]:
        """
        Analyzes a single node to determine its safety, type, and missing dependencies.
        """
        node_type = node.get("NodeType", "")
        name = node.get("Name", "")
        
        is_python = "Python" in node_type or "Python" in name
        is_custom = "CustomNode" in node_type or "DSFunction" in node_type
        is_revit = "Revit" in name or "Revit" in node.get("Category", "")
        
        status = "SAFE"
        if is_python:
            status = "UNTRUSTED_DO_NOT_EXECUTE"
            
        return {
            "nodeId": node.get("Id"),
            "nodeType": node_type,
            "nodeName": name,
            "isPython": is_python,
            "isCustom": is_custom,
            "isRevit": is_revit,
            "scriptMetadata": status,
            "inputs": [p.get("Name") for p in node.get("Inputs", [])],
            "outputs": [p.get("Name") for p in node.get("Outputs", [])]
        }
