from typing import Dict, Any, List

class IRevitExecutionAdapter:
    """
    Rule 6: Execution Adapter interface. 
    The core BuildSphere application must NOT depend directly on Autodesk.Revit classes.
    """
    def open_model(self, path: str) -> bool:
        raise NotImplementedError
        
    def begin_transaction(self, name: str) -> bool:
        raise NotImplementedError
        
    def commit_transaction(self) -> bool:
        raise NotImplementedError
        
    def rollback_transaction(self) -> bool:
        raise NotImplementedError
        
    def create_level(self, name: str, elevation: float) -> str:
        raise NotImplementedError
        
    def create_wall(self, start_pt: Dict, end_pt: Dict, level_id: str, wall_type: str) -> str:
        raise NotImplementedError
        
    def create_door(self, host_wall_id: str, location: Dict, door_type: str) -> str:
        raise NotImplementedError

    def create_room(self, name: str, level_id: str, boundaries: List[Dict]) -> str:
        raise NotImplementedError
        
    def read_back_element(self, element_id: str) -> Dict[str, Any]:
        """Rule 36: Revit Read-Back"""
        raise NotImplementedError
        
    def save_model(self, path: str) -> bool:
        raise NotImplementedError
        
    def close_model(self) -> bool:
        raise NotImplementedError
