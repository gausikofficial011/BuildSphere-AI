from fastapi import APIRouter, HTTPException
from typing import Dict, Any, List
from pydantic import BaseModel

from app.global_scale.global_twin import GlobalModel
from app.regional_scale.national_twin import RegionalModel
from app.city_scale.urban_twin import CityModel
from app.lifecycle.digital_twin import FacilityTwin
from app.decision_intelligence.optimizer import MultiObjectiveOptimizer, ScenarioEvaluator
from app.orchestration.delivery import GovernanceViolationException

router = APIRouter(
    prefix="/api/spatial",
    tags=["Spatial OS"]
)

class DisruptionRequest(BaseModel):
    corridor: str
    duration_days: int

class OptimizeRequest(BaseModel):
    event_id: str
    current_delay_days: int
    current_cost: float

class ExecuteRequest(BaseModel):
    option_id: str
    human_approved: bool

@router.get("/global/baseline")
def get_global_baseline():
    globe = GlobalModel()
    return globe.get_baseline_state()

@router.get("/regional/baseline")
def get_regional_baseline():
    region = RegionalModel()
    return region.get_baseline_state()

@router.get("/city/baseline")
def get_city_baseline():
    city = CityModel()
    return city.get_baseline_state()

@router.get("/facility/{element_id}")
def get_facility_status(element_id: str):
    facility = FacilityTwin()
    return facility.get_asset_info(element_id)

@router.post("/optimization/generate")
def generate_options(req: OptimizeRequest):
    optimizer = MultiObjectiveOptimizer()
    options = optimizer.generate_options([req.event_id], current_delay_days=req.current_delay_days, current_cost=req.current_cost)
    return {"options": options}

@router.post("/governance/execute")
def execute_option(req: ExecuteRequest):
    evaluator = ScenarioEvaluator()
    try:
        result = evaluator.execute_option(req.option_id, human_approved=req.human_approved)
        return result
    except GovernanceViolationException as e:
        raise HTTPException(status_code=403, detail=str(e))
