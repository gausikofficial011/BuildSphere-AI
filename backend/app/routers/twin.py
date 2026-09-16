from fastapi import APIRouter, WebSocket, WebSocketDisconnect
import asyncio
import random
import json
from ..ml.predictive_maintenance import AnomalyDetector

router = APIRouter(prefix="/api/twin", tags=["Digital Twin"])

@router.websocket("/ws/iot-telemetry")
async def websocket_iot_telemetry(websocket: WebSocket):
    await websocket.accept()
    
    # Initialize ML Models
    hvac_model = AnomalyDetector(window_size=10, threshold_z=2.5)
    stress_model = AnomalyDetector(window_size=10, threshold_z=2.5)
    
    # Initial state
    temp = 22.4
    stress = 14.2
    load = 450
    
    # Pre-warm the models with some normal data to establish baseline
    for _ in range(10):
        hvac_model.predict(22.4 + random.uniform(-0.5, 0.5))
        stress_model.predict(14.2 + random.uniform(-0.5, 0.5))
        
    try:
        while True:
            # Simulate normal variations
            temp = round(22 + random.uniform(-1, 1), 1)
            stress_base = 14.0 + random.uniform(-0.5, 0.5)
            
            # 10% chance to simulate a catastrophic structural stress spike (Anomaly)
            if random.random() > 0.9:
                stress = round(stress_base + random.uniform(2, 4), 1)
            else:
                stress = round(stress_base, 1)
                
            load = int(400 + random.uniform(-20, 50))
            
            # Pass data through ML Model
            hvac_anomaly, hvac_conf = hvac_model.predict(temp)
            stress_anomaly, stress_conf = stress_model.predict(stress)
            
            ai_alert = False
            ai_msg = ""
            if stress_anomaly:
                ai_alert = True
                ai_msg = f"Critical Structural Stress Predicted ({stress_conf:.1f}% Confidence)"
            elif hvac_anomaly:
                ai_alert = True
                ai_msg = f"HVAC Failure Predicted ({hvac_conf:.1f}% Confidence)"
                
            data = {
                "hvac": {"temp": temp, "status": "Optimal" if temp < 23.5 else "Warning"},
                "structural": {"stress": stress, "status": "Normal" if stress <= 15 else "High Stress"},
                "energy": {"load": load, "status": "Normal" if load < 480 else "High"},
                "ai_forecast": {
                    "anomaly_detected": ai_alert,
                    "message": ai_msg
                }
            }
            
            await websocket.send_text(json.dumps(data))
            await asyncio.sleep(2)
            
    except WebSocketDisconnect:
        print("Client disconnected from IoT Telemetry stream")

# Digital Twin Provider API Configurations
twin_provider_config = {
    "active_provider": "Autodesk Tandem API",
    "providers": {
        "Autodesk Tandem API": {
            "name": "Autodesk Tandem & APS (Forge)",
            "api_endpoint": "https://developer.api.autodesk.com/tandem/v1",
            "status": "Connected (LOD 400 Revit Sync)",
            "client_id": "aps_live_client_893274",
            "facility_id": "fac_skyline_towers_01"
        },
        "AWS IoT TwinMaker": {
            "name": "AWS IoT TwinMaker",
            "api_endpoint": "https://iottwinmaker.us-east-1.amazonaws.com",
            "status": "Ready for Connect",
            "workspace_id": "ws-skyline-twin-01"
        },
        "Azure Digital Twins": {
            "name": "Microsoft Azure Digital Twins (ADT)",
            "api_endpoint": "https://skyline-adt.api.wus2.digitaltwins.azure.net",
            "status": "Ready for Connect",
            "instance_url": "skyline-adt.digitaltwins.azure.net"
        }
    }
}

@router.get("/config")
async def get_twin_config():
    return twin_provider_config

@router.post("/connect-provider")
async def connect_twin_provider(payload: dict):
    provider_name = payload.get("provider", "Autodesk Tandem API")
    if provider_name in twin_provider_config["providers"]:
        twin_provider_config["active_provider"] = provider_name
        twin_provider_config["providers"][provider_name]["status"] = "Connected (Live IoT Sync)"
        return {"status": "success", "message": f"Successfully connected to {provider_name}", "config": twin_provider_config}
    return {"status": "error", "message": "Unknown Digital Twin Provider"}

@router.get("/telemetry-summary")
async def get_telemetry_summary():
    return {
        "active_provider": twin_provider_config["active_provider"],
        "sensors_online": 48,
        "signal_quality": "100%",
        "as_built_delta": "2.4 mm",
        "curing_temp": "34.2 °C",
        "structural_health": "99.2%"
    }

# In-memory storage for Revit/Dynamo Elements & Site Sensors
twin_elements_store = [
    { "id": "RVT-101", "family": "Structural Column (ISMB 400)", "params": "Length: 6.0m | Width: 0.4m | Height: 4.0m", "material": "M40 Grade Concrete", "phase": "Phase 2 - Superstructure", "status": "Modeled (Revit)" },
    { "id": "RVT-102", "family": "Concrete Shear Wall (300mm)", "params": "Length: 12.0m | Thickness: 0.3m | Height: 3.5m", "material": "M50 High-Strength Concrete", "phase": "Phase 1 - Substructure", "status": "Modeled (Revit)" },
    { "id": "RVT-103", "family": "Curtain Wall Glazing", "params": "Height: 3.5m | Mullion Width: 0.05m", "material": "Low-E Double Glazed Glass", "phase": "Phase 3 - Facade", "status": "Parametric (Dynamo)" },
    { "id": "RVT-104", "family": "Rebar Cage (Y25@150)", "params": "Bar Dia: 25mm | Pitch: 150mm c/c", "material": "Fe550D TMT Steel", "phase": "Phase 1 - Substructure", "status": "Parametric (Dynamo)" }
]

twin_sensors_store = [
    { "id": "IOT-TMP-01", "type": "Concrete Curing Temp", "location": "Level 4 Slab - Pour 2", "physicalVal": "34.2 °C", "revitVal": "35.0 °C", "delta": "-0.8 °C", "status": "Normal", "health": 98 },
    { "id": "IOT-STR-04", "type": "Structural Strain Gauge", "location": "Core Wall Structural Column C3", "physicalVal": "142 µε", "revitVal": "138 µε", "delta": "+4 µε", "status": "Normal", "health": 99 },
    { "id": "IOT-GPS-09", "type": "Tower Crane 2 Positioning", "location": "North Tower - Zone A", "physicalVal": "X: 142.4, Y: 88.1", "revitVal": "X: 142.5, Y: 88.0", "delta": "0.14 m", "status": "Normal", "health": 100 },
    { "id": "IOT-VIB-02", "type": "Vibrational Seismic Gauge", "location": "Substructure Retaining Wall W1", "physicalVal": "1.2 mm/s", "revitVal": "0.8 mm/s", "delta": "+0.4 mm/s", "status": "Attention", "health": 88 },
    { "id": "IOT-LID-12", "type": "LiDAR As-Built Pointcloud", "location": "Level 6 Structural Grid A-F", "physicalVal": "Tol: 2.4 mm", "revitVal": "BIM Baseline", "delta": "2.4 mm", "status": "Normal", "health": 97 }
]

@router.get("/elements")
async def get_elements():
    return twin_elements_store

@router.post("/elements")
async def create_element(element: dict):
    new_id = f"RVT-{len(twin_elements_store) + 105}"
    element["id"] = element.get("id", new_id)
    twin_elements_store.insert(0, element)
    return {"status": "success", "element": element, "message": "Element successfully added to Revit model store."}

@router.put("/elements/{element_id}")
async def update_element(element_id: str, updated: dict):
    for idx, el in enumerate(twin_elements_store):
        if el["id"] == element_id:
            twin_elements_store[idx].update(updated)
            return {"status": "success", "element": twin_elements_store[idx], "message": f"Element {element_id} updated."}
    return {"status": "error", "message": "Element not found"}

@router.delete("/elements/{element_id}")
async def delete_element(element_id: str):
    global twin_elements_store
    twin_elements_store = [el for el in twin_elements_store if el["id"] != element_id]
    return {"status": "success", "message": f"Element {element_id} deleted."}

@router.get("/sensors")
async def get_sensors():
    return twin_sensors_store

@router.post("/sensors")
async def create_sensor(sensor: dict):
    new_id = f"IOT-SNS-{len(twin_sensors_store) + 10}"
    sensor["id"] = sensor.get("id", new_id)
    twin_sensors_store.insert(0, sensor)
    return {"status": "success", "sensor": sensor, "message": "Sensor node registered."}

@router.put("/sensors/{sensor_id}")
async def update_sensor(sensor_id: str, updated: dict):
    for idx, s in enumerate(twin_sensors_store):
        if s["id"] == sensor_id:
            twin_sensors_store[idx].update(updated)
            return {"status": "success", "sensor": twin_sensors_store[idx], "message": f"Sensor {sensor_id} recalibrated."}
    return {"status": "error", "message": "Sensor not found"}

@router.delete("/sensors/{sensor_id}")
async def delete_sensor(sensor_id: str):
    global twin_sensors_store
    twin_sensors_store = [s for s in twin_sensors_store if s["id"] != sensor_id]
    return {"status": "success", "message": f"Sensor {sensor_id} removed."}


