from typing import Dict, Any, List
from .interface import IRevitExecutionAdapter
import uuid

class MockRevitExecutionAdapter(IRevitExecutionAdapter):
    """
    Mock adapter for CI integration testing. 
    (Rule 92: MUST NOT fake a successful Revit execution in production. This is explicitly labeled MOCK for tests).
    """
    def __init__(self):
        self.model_open = False
        self.transaction_open = False
        self.elements = {}
        self.simulate_failure_on_element = None # Used for testing Rule 52 (Partial Failure)
        
    def open_model(self, path: str) -> bool:
        self.model_open = True
        return True
        
    def begin_transaction(self, name: str) -> bool:
        self.transaction_open = True
        return True
        
    def commit_transaction(self) -> bool:
        self.transaction_open = False
        return True
        
    def rollback_transaction(self) -> bool:
        self.transaction_open = False
        return True
        
    def _create_element(self, type_str: str, data: Dict) -> str:
        if not self.transaction_open:
            raise Exception("TRANSACTION_REQUIRED")
            
        if self.simulate_failure_on_element == type_str:
            raise Exception(f"SIMULATED_FAILURE: Failed to create {type_str}")
            
        element_id = f"mock_{uuid.uuid4().hex[:8]}"
        self.elements[element_id] = {"type": type_str, **data}
        return element_id
        
    def create_level(self, name: str, elevation: float) -> str:
        return self._create_element("Level", {"name": name, "elevation": elevation})
        
    def create_wall(self, start_pt: Dict, end_pt: Dict, level_id: str, wall_type: str) -> str:
        # Verify host level exists
        if level_id not in self.elements:
            raise Exception("INVALID_LEVEL")
        return self._create_element("Wall", {"start": start_pt, "end": end_pt, "level_id": level_id, "wall_type": wall_type})
        
    def create_door(self, host_wall_id: str, location: Dict, door_type: str) -> str:
        if host_wall_id not in self.elements:
            raise Exception("INVALID_HOST")
        return self._create_element("Door", {"host": host_wall_id, "location": location, "door_type": door_type})

    def create_room(self, name: str, level_id: str, boundaries: List[Dict]) -> str:
        if level_id not in self.elements:
            raise Exception("INVALID_LEVEL")
        return self._create_element("Room", {"name": name, "level_id": level_id, "boundaries": boundaries})
        
    def read_back_element(self, element_id: str) -> Dict[str, Any]:
        return self.elements.get(element_id)
        
    def save_model(self, path: str) -> bool:
        return True
        
    def close_model(self) -> bool:
        self.model_open = False
        # Do not clear elements so tests can introspect final state
        return True
