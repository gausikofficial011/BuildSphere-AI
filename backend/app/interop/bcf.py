from typing import Dict, Any

class BCFAdapter:
    """
    Phase 9 Interoperability: BIM Collaboration Format (BCF).
    Maps BCF payloads directly into the existing BuildSphere Issue Engine.
    """
    @staticmethod
    def parse_bcf_to_issue(bcf_payload: Dict[str, Any]) -> Dict[str, Any]:
        """
        Converts a BCF Topic to a BuildSphere Issue format.
        """
        topic = bcf_payload.get("topic", {})
        
        return {
            "title": topic.get("title", "Imported BCF Issue"),
            "description": topic.get("description", ""),
            "status": "OPEN" if topic.get("topic_status") == "Open" else "CLOSED",
            "type": topic.get("topic_type", "Clash"),
            "severity": "HIGH",
            "reporter": topic.get("creation_author", "System"),
            "source": "BCF_IMPORT"
        }
