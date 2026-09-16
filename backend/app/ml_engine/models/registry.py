import json
import os
from typing import Dict, Any, List
from datetime import datetime

class ModelRegistry:
    """
    Rule 38: Model Registry for reproducible ML.
    """
    def __init__(self, registry_file: str = "model_registry.json"):
        self.registry_file = registry_file
        self.models = self._load()
        
    def _load(self) -> List[Dict[str, Any]]:
        if os.path.exists(self.registry_file):
            with open(self.registry_file, "r") as f:
                return json.load(f)
        return []
        
    def _save(self):
        with open(self.registry_file, "w") as f:
            json.dump(self.models, f, indent=2)
            
    def register_model(self, model_id: str, name: str, version: str, task: str, status: str, metrics: Dict[str, Any]):
        entry = {
            "modelId": model_id,
            "modelName": name,
            "version": version,
            "task": task,
            "status": status,
            "metrics": metrics,
            "createdAt": datetime.utcnow().isoformat()
        }
        self.models.append(entry)
        self._save()
        return entry
        
    def list_models(self) -> List[Dict[str, Any]]:
        return self.models
