from app.operations.operations import BuildingOperationsEngine
from app.operations.faults import FaultDetectionEngine, FaultDiagnosticsEngine
from app.operations.maintenance import FacilityMaintenanceEngine
from app.operations.energy import BuildingEnergyEngine, ComfortEngine

def test_rule_operations_end_to_end_demo():
    """
    Simulates: Verified As-Built Twin -> IoT Ingest -> Fault Detected -> 
    Diagnostic Root Cause -> Maintenance Recommended -> Human Approval -> 
    Work Order Executed -> Operational State Restored.
    """
    ops = BuildingOperationsEngine()
    faults = FaultDetectionEngine()
    diag = FaultDiagnosticsEngine()
    maint = FacilityMaintenanceEngine()
    energy = BuildingEnergyEngine()
    comfort = ComfortEngine()
    
    # 1. Register Asset (Phase 16 As-Built handoff)
    asset = ops.registry.register_asset("chiller_01", "HVAC_CHILLER", "bim_id_99")
    assert asset.state == "ONLINE"
    
    # 2. IoT Data Ingest (MOCKED per Rule 261)
    ops.ingest_sensor_data(asset.id, "temperature", 90.0) # Overheating
    ops.ingest_sensor_data(asset.id, "energy_kw", 130.0) # Anomaly
    
    # 3. Energy Anomaly Detection
    is_anomaly = energy.detect_anomaly(130.0)
    assert is_anomaly == True
    
    # 4. Fault Detection
    detected_faults = faults.evaluate_telemetry(ops.telemetry)
    assert len(detected_faults) == 1
    fault = detected_faults[0]
    assert fault.issue == "Overheating"
    assert fault.severity == "CRITICAL"
    
    # 5. Fault Diagnostics (Root Cause)
    root_cause = diag.diagnose(fault)
    assert "Coolant leak" in root_cause
    
    # 6. Maintenance Work Order Created
    wo = maint.create_work_order_from_fault(fault, root_cause)
    assert wo.status == "DETECTED"
    
    # 7. Asset degraded state
    ops.registry.update_state(asset.id, "FAULT")
    assert ops.registry.assets[asset.id].state == "FAULT"
    
    # 8. Human Approval & Work Order Execution Lifecycle
    wo.advance_status("ASSIGNED")
    wo.advance_status("COMPLETED")
    wo.advance_status("VERIFIED")
    wo.advance_status("CLOSED")
    
    # 9. Operational State Restored
    ops.registry.update_state(asset.id, "ONLINE")
    assert ops.registry.assets[asset.id].state == "ONLINE"
    
    # 10. Comfort check
    assert comfort.check_comfort(72.0) == "OPTIMAL"
    assert comfort.check_comfort(80.0) == "TOO_HOT"
