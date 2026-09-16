from fastapi import APIRouter, Depends, HTTPException
from typing import Dict, Any
from pydantic import BaseModel
from ..interop.bcf import BCFAdapter
from ..sdk.webhooks import WebhookDispatcher

router = APIRouter(prefix="/api/os", tags=["os"])
webhook_engine = WebhookDispatcher()

class BCFPayload(BaseModel):
    bcf_data: Dict[str, Any]

@router.post("/bcf/import")
async def import_bcf(payload: BCFPayload):
    """
    Imports a BCF payload and normalizes it to the Phase 7 Issue Engine format.
    """
    try:
        issue = BCFAdapter.parse_bcf_to_issue(payload.bcf_data)
        return {"status": "SUCCESS", "created_issue": issue}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
