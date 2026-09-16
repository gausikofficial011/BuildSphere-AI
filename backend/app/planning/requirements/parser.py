from .schema import BuildingRequirement, ProvenanceField, RoomRequirement, SiteRequirement

class NaturalLanguageParser:
    """
    Mock LLM Parser for CI environments.
    Uses regex/heuristics to deterministically parse strings to JSON.
    """
    @staticmethod
    def parse(prompt: str) -> BuildingRequirement:
        text = prompt.lower()
        
        # Rule 6: Unknown Requirements
        unknowns = []
        
        # Extract Floors
        floors = 1
        if "two-floor" in text or "two story" in text:
            floors = 2
            
        # Extract Site
        site_req = None
        if "30m \u00d7 20m" in text or "30m x 20m" in text or "30 x 20 meter" in text:
            site_req = SiteRequirement(width=30, length=20, unit="m")
        else:
            unknowns.append("siteDimensions")
            
        # Extract Parking
        parking = None
        if "parking for two cars" in text:
            parking = ProvenanceField(value=2, source="parking for two cars", confidence=0.98)
            
        # Extract Rooms
        rooms = []
        if "three bedrooms" in text or "3bhk" in text:
            rooms.append(RoomRequirement(name="Bedroom", count=3))
        if "two bathrooms" in text:
            rooms.append(RoomRequirement(name="Bathroom", count=2))
        if "living room" in text:
            rooms.append(RoomRequirement(name="Living Room", count=1))
        if "dining room" in text:
            rooms.append(RoomRequirement(name="Dining Room", count=1))
        if "kitchen" in text:
            rooms.append(RoomRequirement(name="Kitchen", count=1))
        if "staircase" in text:
            rooms.append(RoomRequirement(name="Staircase", count=1))
            
        return BuildingRequirement(
            projectType=ProvenanceField(value="New Construction", source="Inferred", inferred=True, confidence=0.8),
            buildingType=ProvenanceField(value="Residential", source="residential house" if "residential" in text else "house", confidence=0.95),
            floors=ProvenanceField(value=floors, source="extracted via heuristic", confidence=0.99),
            site=site_req,
            parking=parking,
            rooms=rooms,
            unknownRequirements=unknowns
        )
