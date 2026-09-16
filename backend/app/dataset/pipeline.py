from typing import List, Dict, Any
from app.schema.domain import BIMElement, Room
from app.schema.relationships import BIMRelationship
from .validator import BIMValidator
from .versioning import DatasetVersioning
from .manifest import DatasetManifestGenerator

class DatasetPipeline:
    def __init__(self):
        self.validator = BIMValidator()
        
    def execute(self, dataset_id: str, version: str, elements: List[BIMElement], relationships: List[BIMRelationship], rooms: List[Room] = [], dynamo_graphs: List[Any] = []) -> Dict[str, Any]:
        
        # 1. Validate
        val_results = self.validator.validate_dataset(elements, relationships, rooms)
        
        # 2. Serialize for hashing
        raw_data = {
            "elements": [e.model_dump() for e in elements],
            "relationships": [r.model_dump() for r in relationships],
            "rooms": [r.model_dump() for r in rooms]
        }
        
        # 3. Hash
        data_hash = DatasetVersioning.generate_hash(raw_data)
        
        # 4. Generate Manifest
        manifest = DatasetManifestGenerator.generate_manifest(
            dataset_id=dataset_id,
            version=version,
            elements=elements,
            rooms=rooms,
            relationships=relationships,
            dynamo_graphs=dynamo_graphs,
            validation_results=val_results,
            data_hash=data_hash
        )
        
        return {
            "manifest": manifest,
            "data": raw_data,
            "validation": val_results
        }
