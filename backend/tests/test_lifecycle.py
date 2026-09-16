import pytest
from app.lifecycle.digital_twin import FacilityTwin, SensorNetwork
from app.lifecycle.predictive_maintenance import AnomalyDetector, RulePredictor
from app.lifecycle.operations import OperationsOptimizer
from app.orchestration.delivery import GovernanceViolationException

def test_rule_facility_lifecycle_demo():
    """Phase 26 E2E Demo: AI Building Lifecycle Intelligence & Smart Facility Digital Twin."""
    
    element_id = "HVAC-302-A"
    
    # 1. Digital Twin Access
    twin = FacilityTwin()
    asset_info = twin.get_asset_info(element_id)
    assert asset_info["bim_element"] == element_id
    assert asset_info["condition"] == "Degrading"
    
    # 2. Sensor Telemetry (Mocked)
    network = SensorNetwork()
    telemetry = network.get_telemetry(element_id)
    assert telemetry["source"] == "MOCKED_IOT_SENSOR"
    
    # 3. Anomaly Detection
    detector = AnomalyDetector()
    anomalies = detector.detect(telemetry)
    assert anomalies["anomaly_detected"] is True
    assert "Pressure anomaly" in anomalies["anomalies"]
    
    # 4. Predictive Maintenance
    predictor = RulePredictor()
    prediction = predictor.predict(anomalies, telemetry["historical_maintenance_pattern"])
    assert prediction["prediction"] == "Potential performance failure"
    assert prediction["estimated_rul_days"] == 14
    
    # 5. Lifecycle Operations Optimization
    optimizer = OperationsOptimizer()
    options = optimizer.generate_options(prediction)
    
    assert len(options) == 3
    assert options[0]["id"] == "OPTION_A"
    assert options[2]["id"] == "OPTION_C"
    assert options[2]["name"] == "Replace unit"
    
    # 6. Execute without Governance (MUST FAIL)
    with pytest.raises(GovernanceViolationException, match="modify production operations without governed approval"):
        optimizer.execute_option("OPTION_C", human_approved=False)
        
    # 7. Execute with Governance (MUST PASS)
    result = optimizer.execute_option("OPTION_C", human_approved=True)
    assert result["status"] == "EXECUTED"
    assert result["option_applied"] == "OPTION_C"
