from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional

class GeometryFeature(BaseModel):
    bounding_box: Optional[Dict[str, Any]] = None
    location: Optional[Any] = None
    volume: float = 0.0
    area: float = 0.0

class NormalizedElement(BaseModel):
    element_id: str
    category: str
    family: str
    type: str
    level: str
    geometry_features: GeometryFeature
    parameters: Dict[str, Any]
    
class SemanticRelationship(BaseModel):
    source: str
    target: str
    type: str # e.g. "HOSTS", "LOCATED_ON"

class TrainingDatasetRecord(BaseModel):
    project_id: str
    building_type: str = "unknown"
    elements: List[NormalizedElement]
    relationships: List[SemanticRelationship]
    source: str = "revit"
    version: str = "v1"
