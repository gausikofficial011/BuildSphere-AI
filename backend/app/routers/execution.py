from fastapi import APIRouter
from typing import Dict, Any
from app.execution.adapters.interface import IRevitExecutionAdapter

router = APIRouter()

# In production, this would be dependency injected.
# If no real Revit integration is detected, it must be None.
current_adapter = None 

@router.post("/api/execution/run")
async def execute_design(payload: Dict[str, Any]):
    if current_adapter is None:
        # Rule 92: No Fake Success
        return {"status": "REVIT_EXECUTION_UNAVAILABLE"}
        
    from app.execution.engine import ExecutionEngine
    engine = ExecutionEngine(current_adapter)
    return engine.execute_design(payload.get("design", {}))
