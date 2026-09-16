from pydantic import BaseModel
from enum import Enum

class RelationshipType(str, Enum):
    HOSTS = "HOSTS"
    HOSTED_BY = "HOSTED_BY"
    BOUNDS = "BOUNDS"
    BOUNDED_BY = "BOUNDED_BY"
    ADJACENT_TO = "ADJACENT_TO"
    CONNECTED_TO = "CONNECTED_TO"
    SUPPORTS = "SUPPORTS"
    SUPPORTED_BY = "SUPPORTED_BY"
    LOCATED_ON = "LOCATED_ON"
    INSTANCE_OF = "INSTANCE_OF"
    TYPE_OF = "TYPE_OF"
    BELONGS_TO = "BELONGS_TO"
    CONTAINS = "CONTAINS"
    CONTAINED_BY = "CONTAINED_BY"
    OPENS_IN = "OPENS_IN"
    CONNECTS_LEVEL = "CONNECTS_LEVEL"

class BIMRelationship(BaseModel):
    sourceId: str
    targetId: str
    relationshipType: RelationshipType
    confidence: float = 1.0
    source: str
