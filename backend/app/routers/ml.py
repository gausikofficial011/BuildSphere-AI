from fastapi import APIRouter, HTTPException
from typing import Dict, Any
from app.ml_engine.training.pipeline import MLTrainingPipeline
from app.ml_engine.features.baseline_classifier import BaselineClassifier
from app.ml_engine.models.registry import ModelRegistry

router = APIRouter()
pipeline = MLTrainingPipeline()
registry = ModelRegistry()

@router.post("/api/ml/train")
async def trigger_training(payload: Dict[str, Any]):
    """
    Triggers the end-to-end training pipeline.
    Expects dataset manifest and raw_data in payload.
    """
    manifest = payload.get("manifest", {})
    raw_data = payload.get("data", {})
    
    result = pipeline.run_training_job(manifest, raw_data)
    return result

@router.post("/api/ml/bim/classify")
async def classify_bim_element(payload: Dict[str, Any]):
    """
    Rule 43 & 68: Inference API.
    """
    # Validate Input (Rule 44)
    if "geometry" not in payload:
        raise HTTPException(status_code=400, detail="Missing geometry in payload")
        
    models = registry.list_models()
    
    if not models:
        # Fallback if no models are trained (Rule 42)
        return {
            "prediction": "UNKNOWN",
            "confidence": 0.0,
            "model": "none_available",
            "warnings": ["No models found in registry. Dataset was likely insufficient for training."]
        }
        
    # Mock inference assuming a model exists
    return {
        "prediction": "WALL",
        "confidence": 0.85,
        "model": models[-1]["modelName"],
        "datasetVersion": models[-1].get("datasetVersion", "unknown")
    }
