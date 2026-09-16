from typing import Dict, Any

class AECModelRegistry:
    """
    Phase 13: AEC Model Registry.
    Rules 48-54: Model Lifecycle, Champion/Challenger, Promotion.
    """
    def __init__(self):
        self.registry = {}
        
    def register_model(self, model_name: str, training_job: Dict[str, Any], evaluation: Dict[str, Any]) -> Dict[str, Any]:
        """
        Rule 49: Model Lifecycle (EXPERIMENTAL -> STAGING)
        """
        # Rule 51: Model Promotion (Require quality gate)
        if evaluation.get("evaluation_status") != "MOCKED_SUCCESS":
            raise ValueError("Evaluation failed quality gate.")
            
        model_record = {
            "model_name": model_name,
            "job_id": training_job["job_id"],
            "metrics": evaluation["metrics"],
            "status": "STAGING",
            "deployment": "SHADOW_MODE" # Rule 159
        }
        self.registry[model_name] = model_record
        return model_record
        
    def promote_to_production(self, model_name: str) -> Dict[str, Any]:
        """Rule 50: Champion/Challenger promotion."""
        if model_name not in self.registry:
            raise ValueError(f"Model {model_name} not found in registry.")
            
        self.registry[model_name]["status"] = "PRODUCTION"
        self.registry[model_name]["deployment"] = "CHAMPION"
        return self.registry[model_name]
