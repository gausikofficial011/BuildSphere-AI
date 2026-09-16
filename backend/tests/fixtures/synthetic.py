from app.schema.domain import BIMElement, Room, RoomType, Provenance, SourceType
from app.schema.relationships import BIMRelationship, RelationshipType
from app.schema.geometry import GeometryFeatures, Point3D
from app.schema.parameters import BIMParameter, StorageType

def get_synthetic_elements():
    prov = Provenance(
        sourceType=SourceType.SYNTHETIC,
        sourceFile="fixture.rvt",
        sourceModelId="model_001",
        sourceElementId="synth_001",
        sourceVersion="v1",
        importTimestamp="2026-08-17",
        importerVersion="1.0"
    )
    
    wall = BIMElement(
        id="wall_1",
        category="Walls",
        name="Basic Wall",
        provenance=prov,
        parameters={
            "Length": BIMParameter(
                parameterId="p1", 
                name="Length", 
                storageType=StorageType.DOUBLE, 
                value=5000, 
                normalizedValue=5.0, 
                unit="mm", 
                normalizedUnit="m",
                source="Revit"
            )
        }
    )
    
    door = BIMElement(
        id="door_1",
        category="Doors",
        name="Single Flush",
        provenance=prov
    )
    
    room = Room(
        id="room_1",
        category="Rooms",
        name="Living Room",
        roomType=RoomType.LIVING_ROOM,
        provenance=prov
    )
    
    return [wall, door], [room]

def get_synthetic_relationships():
    # Door hosted by Wall
    r1 = BIMRelationship(
        sourceId="door_1",
        targetId="wall_1",
        relationshipType=RelationshipType.HOSTED_BY,
        source="extractor"
    )
    
    # Wall bounds Room
    r2 = BIMRelationship(
        sourceId="wall_1",
        targetId="room_1",
        relationshipType=RelationshipType.BOUNDS,
        source="extractor"
    )
    
    # Invalid target (Acceptance Test 4)
    r3 = BIMRelationship(
        sourceId="door_1",
        targetId="wall_missing",
        relationshipType=RelationshipType.HOSTED_BY,
        source="extractor"
    )
    
    return [r1, r2, r3]
