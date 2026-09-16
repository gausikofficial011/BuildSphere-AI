from typing import List, Dict, Any
from app.schema.domain import BIMElement
from app.schema.relationships import BIMRelationship

class BIMValidator:
    def __init__(self):
        self.errors = []
        self.warnings = []

    def validate_dataset(self, elements: List[BIMElement], relationships: List[BIMRelationship], rooms: List[Any] = []):
        element_ids = {e.id for e in elements}
        element_ids.update({r.id for r in rooms})
        
        # Check for orphan elements (e.g. elements with no level or host, though some are valid)
        # Check for invalid relationships
        for rel in relationships:
            if rel.sourceId not in element_ids:
                self.errors.append({
                    "code": "BIM_INVALID_RELATIONSHIP",
                    "message": f"Source element {rel.sourceId} does not exist.",
                    "sourceId": rel.sourceId,
                    "targetId": rel.targetId,
                    "severity": "ERROR"
                })
            
            # Target might be a level ID not explicitly in the element list, but for strictness:
            if rel.targetId not in element_ids and not rel.targetId.startswith("Level"):
                 self.errors.append({
                    "code": "BIM_INVALID_RELATIONSHIP",
                    "message": f"Target element {rel.targetId} does not exist.",
                    "sourceId": rel.sourceId,
                    "targetId": rel.targetId,
                    "severity": "ERROR"
                })

        return {
            "is_valid": len(self.errors) == 0,
            "errors": self.errors,
            "warnings": self.warnings
        }
