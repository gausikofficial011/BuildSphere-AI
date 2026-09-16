from typing import Dict, Any, List
from app.operations.operations import Asset

class Fault:
    def __init__(self, asset_id: str, issue: str, severity: str):
        self.asset_id = asset_id
        self.issue = issue
        self.severity = severity
        self.confidence = 0.95

class FaultDetectionEngine:
    """Rule 25: Fault Detection Engine"""
    def evaluate_telemetry(self, telemetry: List[Dict[str, Any]]) -> List[Fault]:
        faults = []
        for reading in telemetry:
            if reading["type"] == "vibration" and reading["value"] > 5.0:
                faults.append(Fault(reading["asset_id"], "High Vibration Detected", "HIGH"))
            if reading["type"] == "temperature" and reading["value"] > 85.0:
                faults.append(Fault(reading["asset_id"], "Overheating", "CRITICAL"))
        return faults

class FaultDiagnosticsEngine:
    """Rule 31: Fault Diagnostics"""
    def diagnose(self, fault: Fault) -> str:
        if fault.issue == "High Vibration Detected":
            return "Probable Cause: Bearing wear or misalignment."
        if fault.issue == "Overheating":
            return "Probable Cause: Coolant leak or fan failure."
        return "Unknown"
