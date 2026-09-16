from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional

class ProvenanceField(BaseModel):
    value: Any
    source: str
    inferred: bool = False
    confidence: float = 1.0

class RoomRequirement(BaseModel):
    name: str
    count: int = 1
    minimumArea: Optional[float] = None
    adjacencyPreferences: List[str] = []

class SiteRequirement(BaseModel):
    width: float
    length: float
    unit: str = "m"

class BuildingRequirement(BaseModel):
    projectType: ProvenanceField
    buildingType: ProvenanceField
    site: Optional[SiteRequirement] = None
    floors: ProvenanceField
    rooms: List[RoomRequirement] = []
    parking: Optional[ProvenanceField] = None
    unknownRequirements: List[str] = []
