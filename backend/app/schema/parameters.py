from pydantic import BaseModel
from typing import Any, Optional
from enum import Enum

class StorageType(str, Enum):
    STRING = "STRING"
    INTEGER = "INTEGER"
    DOUBLE = "DOUBLE"
    BOOLEAN = "BOOLEAN"
    ELEMENT_ID = "ELEMENT_ID"
    ENUM = "ENUM"
    UNKNOWN = "UNKNOWN"

class BIMParameter(BaseModel):
    parameterId: str
    name: str
    displayName: Optional[str] = None
    storageType: StorageType
    value: Any
    normalizedValue: Any
    unit: Optional[str] = None
    normalizedUnit: Optional[str] = None
    isReadOnly: bool = False
    isInstanceParameter: bool = True
    isTypeParameter: bool = False
    isSharedParameter: bool = False
    source: str
