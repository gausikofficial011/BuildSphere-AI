from app.planning.requirements.schema import BuildingRequirement
from typing import Dict, List, Any

class BuildingProgram:
    @staticmethod
    def generate(reqs: BuildingRequirement) -> Dict[str, Any]:
        """
        Rule 9: Converts requirements into a structured Building Program.
        Handles vertical grouping (Floors).
        """
        floors = {}
        total_floors = int(reqs.floors.value)
        
        for i in range(total_floors):
            floor_name = "Ground Floor" if i == 0 else f"Floor {i}"
            floors[floor_name] = []
            
        # Simplified distribution: put everything on Ground Floor except 2 bedrooms
        bedrooms = [r for r in reqs.rooms if r.name == "Bedroom"]
        other_rooms = [r for r in reqs.rooms if r.name != "Bedroom"]
        
        if bedrooms and total_floors > 1:
            # Move some bedrooms upstairs
            floors["Floor 1"].extend([{"type": "Bedroom", "privacy": "PRIVATE"} for _ in range(min(2, bedrooms[0].count))])
            remaining_beds = bedrooms[0].count - 2
            if remaining_beds > 0:
                floors["Ground Floor"].extend([{"type": "Bedroom", "privacy": "PRIVATE"} for _ in range(remaining_beds)])
        elif bedrooms:
            floors["Ground Floor"].extend([{"type": "Bedroom", "privacy": "PRIVATE"} for _ in range(bedrooms[0].count)])
            
        for r in other_rooms:
            privacy = "PUBLIC" if r.name in ["Living Room", "Dining Room"] else "SERVICE"
            floors["Ground Floor"].extend([{"type": r.name, "privacy": privacy} for _ in range(r.count)])
            
        return floors
