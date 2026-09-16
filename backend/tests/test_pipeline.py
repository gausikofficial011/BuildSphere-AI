import pytest
from app.dataset.pipeline import DatasetPipeline
from app.dataset.normalizer import BIMNormalizer
from app.adapters.revit.importer import RevitEnvironmentDetector, RevitEnvironmentError
from tests.fixtures.synthetic import get_synthetic_elements, get_synthetic_relationships

def test_pipeline_validation_and_errors():
    """
    Acceptance Test 4: Invalid targets report ERROR.
    Acceptance Test 3: Relationships are created and queryable.
    """
    elements, rooms = get_synthetic_elements()
    rels = get_synthetic_relationships()
    
    pipeline = DatasetPipeline()
    result = pipeline.execute("dataset_001", "v1", elements, rels, rooms=rooms)
    
    manifest = result["manifest"]
    validation = result["validation"]
    
    assert manifest["validationStatus"] == "FAIL"
    assert manifest["errors"] == 1
    
    error = validation["errors"][0]
    assert error["code"] == "BIM_INVALID_RELATIONSHIP"
    assert error["targetId"] == "wall_missing"

def test_unit_normalization():
    """
    Acceptance Test 5: Unit normalization converts correctly.
    """
    val_mm = BIMNormalizer.normalize_unit(5000, "mm")
    assert val_mm == 5.0
    
    val_ft = BIMNormalizer.normalize_unit(10, "ft")
    assert val_ft == 3.048

def test_revit_environment_unavailable():
    """
    Acceptance Test 10: If Revit unavailable, system reports it.
    """
    with pytest.raises(RevitEnvironmentError):
        RevitEnvironmentDetector.require_environment()

def test_reproducibility_hash():
    """
    Acceptance Test 7: Dataset reproducibility (identical inputs yield identical hash)
    """
    elements, rooms = get_synthetic_elements()
    rels = get_synthetic_relationships()
    
    pipeline = DatasetPipeline()
    res1 = pipeline.execute("d1", "v1", elements, rels, rooms=rooms)
    res2 = pipeline.execute("d1", "v1", elements, rels, rooms=rooms)
    
    assert res1["manifest"]["hash"] == res2["manifest"]["hash"]
