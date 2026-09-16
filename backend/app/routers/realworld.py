from fastapi import APIRouter, HTTPException
from typing import Dict, Any
from pydantic import BaseModel
from ..realworld.iot import IoTAdapter
from ..realworld.vision import VisionAdapter
from ..loop.decision import ClosedLoopEngine

router = APIRouter(prefix="/api/realworld", tags=["realworld"])
decision_engine = ClosedLoopEngine()

class Payload(BaseModel):
    data: Dict[str, Any]

@router.post("/iot/ingest")
async def ingest_iot(payload: Payload):
    """
    Ingests IoT telemetry, normalizes it, and routes to the Decision Engine.
    """
    try:
        normalized = IoTAdapter.ingest_telemetry(payload.data)
        action = decision_engine.process_realworld_anomaly(normalized)
        return {"status": "SUCCESS", "decision": action}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/vision/report")
async def ingest_vision(payload: Payload):
    """
    Ingests Site Camera discrepancy reports, normalizes, and routes to Decision Engine.
    """
    try:
        normalized = VisionAdapter.parse_discrepancy_report(payload.data)
        action = decision_engine.process_realworld_anomaly(normalized)
        return {"status": "SUCCESS", "decision": action}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
