from pydantic import BaseModel, Field
from typing import Optional, List, Dict
from enum import Enum
from datetime import datetime

from .geometry import GeometryFeatures
from .parameters import BIMParameter
from .relationships import BIMRelationship

class SourceType(str, Enum):
    REVIT = "REVIT"
    IFC = "IFC"
    DYNAMO = "DYNAMO"
    USER = "USER"
    GENERATED = "GENERATED"
    SYNTHETIC = "SYNTHETIC"

class Provenance(BaseModel):
    sourceType: SourceType
    sourceFile: str
    sourceModelId: str
    sourceElementId: str
    sourceVersion: str
    importTimestamp: str
    importerVersion: str
    licenseStatus: str = "UNKNOWN"

class BIMElement(BaseModel):
    id: str
    category: str
    name: str
    family: Optional[str] = None
    type: Optional[str] = None
    levelId: Optional[str] = None
    geometry: Optional[GeometryFeatures] = None
    parameters: Dict[str, BIMParameter] = Field(default_factory=dict)
    provenance: Provenance

class RoomType(str, Enum):
    BEDROOM = "BEDROOM"
    LIVING_ROOM = "LIVING_ROOM"
    KITCHEN = "KITCHEN"
    BATHROOM = "BATHROOM"
    DINING = "DINING"
    OFFICE = "OFFICE"
    CORRIDOR = "CORRIDOR"
    STAIR = "STAIR"
    UTILITY = "UTILITY"
    OTHER = "OTHER"
    UNKNOWN = "UNKNOWN"

class Room(BIMElement):
    roomType: RoomType = RoomType.UNKNOWN
    area: float = 0.0
    volume: float = 0.0
    perimeter: float = 0.0
