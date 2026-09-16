from typing import List, Dict, Any
from datetime import datetime, timezone

class DatasetManifestGenerator:
    @staticmethod
    def generate_manifest(
        dataset_id: str, 
        version: str, 
        elements: List[Any], 
        rooms: List[Any], 
        relationships: List[Any], 
        dynamo_graphs: List[Any],
        validation_results: Dict[str, Any],
        data_hash: str
    ) -> Dict[str, Any]:
        
        error_count = len(validation_results.get("errors", []))
        warning_count = len(validation_results.get("warnings", []))
        
        # Naive quality score: 100 - (errors * 10) - (warnings * 2)
        score = max(0, 100 - (error_count * 10) - (warning_count * 2))
        
        return {
            "datasetId": dataset_id,
            "version": version,
            "createdAt": datetime.now(timezone.utc).isoformat(),
            "schemaVersion": "1.0",
            "elementCount": len(elements),
            "roomCount": len(rooms),
            "relationshipCount": len(relationships),
            "dynamoGraphCount": len(dynamo_graphs),
            "validationStatus": "PASS" if error_count == 0 else "FAIL",
            "errors": error_count,
            "warnings": warning_count,
            "qualityScore": f"{score}%",
            "hash": data_hash
        }
