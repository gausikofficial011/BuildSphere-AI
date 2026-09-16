import pytest
from app.realworld.iot import IoTAdapter
from app.realworld.vision import VisionAdapter
from app.loop.decision import ClosedLoopEngine

def test_iot_anomaly_summons_agent():
    """Verify that a critical IoT reading triggers the Closed-Loop engine and summons AI."""
    engine = ClosedLoopEngine()
    
    # Simulate a critical concrete freezing event
    raw_payload = {
        "sensor_id": "temp_sensor_1",
        "bim_element_id": "concrete_slab_1",
        "value": -2.0,  # Below freezing
        "critical_threshold": 0.0,
        "direction": "below"
    }
    
    normalized = IoTAdapter.ingest_telemetry(raw_payload)
    assert normalized["status"] == "CRITICAL"
    
    result = engine.process_realworld_anomaly(normalized)
    
    assert result["loop_status"] == "CORRECTION_PROPOSED"
    assert "ai_analysis" in result
    
    # Crucially, Rule 103 Execution Gateway check:
    assert result["execution_routing"]["status"] == "AWAITING_HUMAN_APPROVAL"

def test_vision_discrepancy_human_gate():
    """Verify Vision discrepancy forces human approval, proving Rule 103."""
    engine = ClosedLoopEngine()
    
    # Simulate wall built 10cm off-axis
    raw_payload = {
        "element_id": "wall_north",
        "variance_mm": 100, 
        "description": "Wall framed off axis."
    }
    
    normalized = VisionAdapter.parse_discrepancy_report(raw_payload)
    assert normalized["requires_rework"] is True
    
    result = engine.process_realworld_anomaly(normalized)
    
    assert result["loop_status"] == "CORRECTION_PROPOSED"
    assert result["execution_routing"]["status"] == "AWAITING_HUMAN_APPROVAL"
    assert result["execution_routing"]["target_element"] == "wall_north"

def test_nominal_telemetry_ignored():
    """Verify nominal data does not trigger agent processing."""
    engine = ClosedLoopEngine()
    
    raw_payload = {
        "sensor_id": "temp_sensor_2",
        "bim_element_id": "concrete_slab_2",
        "value": 20.0, 
        "critical_threshold": 30.0
    }
    
    normalized = IoTAdapter.ingest_telemetry(raw_payload)
    assert normalized["status"] == "NOMINAL"
    
    result = engine.process_realworld_anomaly(normalized)
    assert result["loop_status"] == "NOMINAL"
    assert result["action"] == "NONE"
