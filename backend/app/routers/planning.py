from fastapi import APIRouter
from typing import Dict, Any
from app.planning.orchestrator import BuildingPlanningOrchestrator

router = APIRouter()
orchestrator = BuildingPlanningOrchestrator()

@router.post("/api/design/generate")
async def generate_design(payload: Dict[str, Any]):
    prompt = payload.get("prompt", "")
    return orchestrator.generate_design(prompt)
