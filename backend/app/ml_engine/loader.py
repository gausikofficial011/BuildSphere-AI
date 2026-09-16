from typing import Dict, Any, List

class DatasetLoader:
    """
    Simulates loading the JSON manifests from Phase 2 into ML-ready memory structures.
    """
    def __init__(self):
        self.datasets = {}
        
    def load_dataset(self, manifest_data: Dict[str, Any], raw_data: Dict[str, Any]):
        dataset_id = manifest_data.get("datasetId", "unknown")
        
        self.datasets[dataset_id] = {
            "manifest": manifest_data,
            "elements": raw_data.get("elements", []),
            "rooms": raw_data.get("rooms", []),
            "relationships": raw_data.get("relationships", [])
        }
        return dataset_id
        
    def get_elements(self, dataset_id: str) -> List[Dict[str, Any]]:
        return self.datasets.get(dataset_id, {}).get("elements", [])
