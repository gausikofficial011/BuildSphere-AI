import pytest
from app.planning.orchestrator import BuildingPlanningOrchestrator

def test_demo_1_end_to_end_planning():
    """
    Rule 80: END-TO-END DEMO 1
    Verifies Natural Language -> Requirements -> Program -> Candidates -> Geometry Validation -> Final Design.
    """
    orchestrator = BuildingPlanningOrchestrator()
    prompt = "Create a two-floor 3BHK residential house on a 30m x 20m site. I need parking for two cars, three bedrooms, two bathrooms, living room, dining room, kitchen and staircase."
    
    result = orchestrator.generate_design(prompt)
    
    assert result["status"] == "SUCCESS"
    design = result["design"]
    
    # Verify Schema output
    assert design["schemaVersion"] == "1.0"
    assert design["metadata"]["status"] == "READY_FOR_EXPORT"
    
    # Verify NLP Parsing (Site & Floors)
    assert design["site"]["width"] == 30.0
    assert design["site"]["length"] == 20.0
    
    # Verify Building Program Generation (Rooms)
    rooms = design["rooms"]
    assert len(rooms) > 5 # Should have placed multiple rooms
    
    # Verify Validation Pipeline
    val = design["validation"]
    assert val["status"] == "VALID"
    assert len(val["errors"]) == 0
    assert len(val["warnings"]) == 1 # Circulation warning is expected
    
    # Verify Command Pre-computation (Phase 5 prep)
    commands = design["commands"]
    assert len(commands) == len(rooms)
    assert commands[0]["commandType"] == "CREATE_ROOM"

def test_demo_missing_requirements():
    """
    Rule 6: Unknown Requirements
    Verifies that if site dimension is missing, the AI requests it rather than hallucinating geometry.
    """
    orchestrator = BuildingPlanningOrchestrator()
    prompt = "Create a house."
    
    result = orchestrator.generate_design(prompt)
    assert result["status"] == "REQUIRED_INFORMATION"
    assert "siteDimensions" in result["missing"]
