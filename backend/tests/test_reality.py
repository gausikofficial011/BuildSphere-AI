import pytest
from app.reality.bus import AECObservationBus, RealityObservation
from app.reality.vision import AECSiteVisionEngine, DeviationEngine, AsBuiltEngine
from app.reality.execution import AECProgressEngine, AECQualityEngine

def test_rule_249_end_to_end_reality_demo():
    """
    Rule 249: End-to-End Reality Demonstration.
    Simulates: Planned BIM -> Field Evidence -> AI Detect -> Human Verify -> As-Built Update.
    """
    # 1. Base systems
    bus = AECObservationBus()
    vision = AECSiteVisionEngine()
    deviation_engine = DeviationEngine()
    as_built_engine = AsBuiltEngine()
    progress_engine = AECProgressEngine()
    quality = AECQualityEngine()
    
    # 2. Production World Model (Planned)
    world_model = {"wall_1_position_x": 100.0, "wall_2_position_y": 50.0}
    
    # 3. Field Evidence Uploaded (Observation Bus)
    obs = bus.ingest(source="drone_camera", data={"image_id": "img123", "wall_1_position_x": 105.0}, confidence=0.8)
    
    # 4. AI Identifies Candidate (Computer Vision)
    vision.process_image(obs)
    assert obs.verification_state == "AI_DETECTED"
    
    # 5. Human Verifies Deviation (Rule 129)
    obs.verification_state = "VERIFIED"
    
    # 6. Deviation Detected
    deviations = deviation_engine.calculate(designed=world_model, observed=obs.data)
    assert len(deviations) == 1
    dev = deviations[0]
    assert dev.element_id == "wall_1_position_x"
    assert dev.diff == 5.0
    assert dev.severity == "MODERATE"
    
    # 7. Quality Workflow Created (NCR)
    ncr = quality.create_ncr(f"Deviation detected on {dev.element_id}")
    assert ncr.status == "OPEN"
    quality.resolve_ncr(ncr)
    assert ncr.status == "CLOSED"
    
    # 8. As-Built Candidate -> Human Verify -> As-Built BIM Update
    as_built_engine.verify_candidate(dev)
    assert dev.verified == True
    
    updated_model = as_built_engine.update_bim(world_model, deviations)
    
    # 9. Verification
    assert updated_model["wall_1_position_x"] == 105.0
    
    # 10. Progress Updated (Rule 160)
    with pytest.raises(ValueError):
        progress_engine.update_progress("task_123", evidence=None)
        
    progress_engine.update_progress("task_123", evidence={"obs_id": obs.id})
    assert progress_engine.progress_state["task_123"] == "VERIFIED_COMPLETE"
