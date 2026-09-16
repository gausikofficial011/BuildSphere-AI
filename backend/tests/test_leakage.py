import pytest
from app.ml_engine.splits import ProjectLevelSplitter

def test_project_level_splitter_prevents_leakage():
    """
    Rule 3: PREVENT DATA LEAKAGE.
    Verifies that elements from the same sourceModelId NEVER end up in both Train and Test splits.
    """
    elements = [
        {"id": "w1", "provenance": {"sourceModelId": "project_A"}},
        {"id": "w2", "provenance": {"sourceModelId": "project_A"}},
        {"id": "d1", "provenance": {"sourceModelId": "project_B"}},
        {"id": "d2", "provenance": {"sourceModelId": "project_B"}},
        {"id": "f1", "provenance": {"sourceModelId": "project_C"}},
    ]
    
    train_els, test_els = ProjectLevelSplitter.split(elements, train_ratio=0.6, seed=42)
    
    train_projects = {el["provenance"]["sourceModelId"] for el in train_els}
    test_projects = {el["provenance"]["sourceModelId"] for el in test_els}
    
    # Assert there is no intersection (NO LEAKAGE)
    assert len(train_projects.intersection(test_projects)) == 0
    
    # Assert all elements are accounted for
    assert len(train_els) + len(test_els) == len(elements)
