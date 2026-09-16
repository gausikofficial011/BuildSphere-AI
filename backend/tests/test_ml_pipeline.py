import pytest
from app.ml_engine.training.pipeline import MLTrainingPipeline

def test_pipeline_blocks_on_insufficient_data():
    """
    Rule 1 & Rule 65: Minimum Dataset Gate.
    Verifies the pipeline blocks training when the dataset is too small.
    """
    pipeline = MLTrainingPipeline()
    
    # Synthetic payload with only 2 elements from 1 project
    payload = {
        "manifest": {"datasetId": "synthetic_v1"},
        "data": {
            "elements": [
                {"id": "1", "provenance": {"sourceModelId": "project_A"}},
                {"id": "2", "provenance": {"sourceModelId": "project_A"}}
            ]
        }
    }
    
    result = pipeline.run_training_job(payload["manifest"], payload["data"])
    
    assert result["job_status"] == "FAILED"
    assert result["reason"] == "NOT_TRAINED_DUE_TO_INSUFFICIENT_DATA"
    assert "BLOCK_TRAINING" not in result # Should be in details or reason, but FAILED handles status
