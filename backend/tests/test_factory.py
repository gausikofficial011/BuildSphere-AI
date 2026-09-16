import pytest
from app.factory.dataset import AECDatasetFactory
from app.factory.training import AECModelTrainingPipeline
from app.factory.evaluator import AECBenchmarkEngine
from app.factory.registry import AECModelRegistry
from app.factory.rag import AECRagEngine

def test_rule_201_full_model_training_demonstration():
    """
    Rule 201: Full Model Training Demonstration.
    Pipeline: DATA -> CLEAN -> LABEL -> SPLIT -> TRAIN -> VALIDATE -> TEST -> METRICS -> ERROR ANALYSIS -> REGISTER.
    """
    # 1. Dataset Generation
    dataset_factory = AECDatasetFactory()
    dataset = dataset_factory.build_bim_dataset(
        project_id="PROJ-001",
        organization_id="ORG-TEST",
        raw_data=[{"element_id": "W-1", "type": "Wall"}]
    )
    assert dataset["quality_score"] > 0
    assert "train" in dataset["split"]
    
    # 2. Model Training (Mocked execution per Rule 209)
    training_pipeline = AECModelTrainingPipeline()
    job = training_pipeline.execute_training(
        dataset_id=dataset["dataset_id"],
        model_type="AEC-BIM",
        config={"learning_rate": 0.001, "epochs": 10}
    )
    assert job["status"] == "MOCKED_SUCCESS"
    
    # 3. Model Evaluation
    evaluator = AECBenchmarkEngine()
    evaluation = evaluator.evaluate_model(job)
    assert evaluation["evaluation_status"] == "MOCKED_SUCCESS"
    assert evaluation["metrics"]["F1"] > evaluation["baseline"]["F1"]
    
    # 4. Model Registration
    registry = AECModelRegistry()
    registered_model = registry.register_model(
        model_name="AEC-BIM-v1",
        training_job=job,
        evaluation=evaluation
    )
    assert registered_model["status"] == "STAGING"
    
    # 5. Champion Promotion
    production_model = registry.promote_to_production("AEC-BIM-v1")
    assert production_model["status"] == "PRODUCTION"
    assert production_model["deployment"] == "CHAMPION"

def test_rule_30_leakage_detection():
    """Rule 30: Prevent Duplicate Project training leakage."""
    dataset_factory = AECDatasetFactory()
    dataset_factory.build_bim_dataset("PROJ-LEAK", "ORG-TEST", [{"data": "test"}])
    
    with pytest.raises(ValueError, match="LEAKAGE_DETECTED"):
        dataset_factory.build_bim_dataset("PROJ-LEAK", "ORG-TEST", [{"data": "test2"}])

def test_rule_87_bim_aware_rag():
    """Rule 87: BIM-Aware RAG."""
    rag_engine = AECRagEngine()
    result = rag_engine.retrieve(
        query="What specifications apply to this wall?",
        context_filters={"element_id": "Wall-101"}
    )
    assert result["status"] == "SUCCESS"
    assert len(result["evidence"]) > 0
    assert "timestamp" in result["evidence"][0]
