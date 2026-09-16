from typing import Dict, Any

class IoTAdapter:
    """
    Phase 10: Closed-Loop IoT Telemetry.
    Ingests sensor data and links it to the internal Knowledge Graph schema.
    """
    @staticmethod
    def ingest_telemetry(payload: Dict[str, Any]) -> Dict[str, Any]:
        """
        Validates incoming sensor data, such as concrete curing temps or vibration anomalies.
        """
        if "sensor_id" not in payload or "bim_element_id" not in payload:
            raise ValueError("IoT payload must contain sensor_id and bim_element_id mapping.")
            
        value = payload.get("value", 0.0)
        critical_min = payload.get("critical_min")
        critical_max = payload.get("critical_max")
        
        is_critical = False
        if critical_min is not None and value <= critical_min:
            is_critical = True
        if critical_max is not None and value >= critical_max:
            is_critical = True
        
        # Backward compatibility for the generic 'critical_threshold' if used as a max
        if "critical_threshold" in payload and payload.get("direction", "above") == "above":
            if value >= payload["critical_threshold"]:
                is_critical = True
        elif "critical_threshold" in payload and payload.get("direction") == "below":
            if value <= payload["critical_threshold"]:
                is_critical = True
        
        return {
            "sensor": payload["sensor_id"],
            "target_element": payload["bim_element_id"],
            "reading": value,
            "status": "CRITICAL" if is_critical else "NOMINAL",
            "timestamp": "now"
        }
