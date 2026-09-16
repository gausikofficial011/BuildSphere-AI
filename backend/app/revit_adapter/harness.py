from typing import List, Dict, Any
from .interfaces import IRevitConnection, IRevitReader, IRevitWriter, IRevitTransaction

class MockRevitConnection(IRevitConnection):
    def connect(self) -> bool:
        return True

class MockRevitReader(IRevitReader):
    def __init__(self):
        self.mock_data = {
            "wall_001": {
                "UniqueId": "wall_001",
                "Category": "Walls",
                "Family": "Basic Wall",
                "Type": "Generic - 200mm",
                "Level": "Level 1",
                "HostedElements": ["door_001", "window_001"],
                "Geometry": {
                    "BoundingBox": {"min": [0,0,0], "max": [5000, 3000, 200]},
                    "LocationCurve": {"start": [0,0,0], "end": [5000,0,0]},
                    "Volume": 3.0,
                    "Area": 15.0
                },
                "Parameters": {
                    "Length": {"value": 5000, "unit": "mm", "type": "BuiltIn"},
                    "Unconnected Height": {"value": 3000, "unit": "mm", "type": "BuiltIn"}
                }
            },
            "door_001": {
                "UniqueId": "door_001",
                "Category": "Doors",
                "Family": "Single-Flush",
                "Type": "900 x 2100mm",
                "Level": "Level 1",
                "HostedElements": [],
                "Geometry": {
                    "LocationPoint": [2500, 0, 0]
                },
                "Parameters": {
                    "Width": {"value": 900, "unit": "mm", "type": "Family"},
                    "Height": {"value": 2100, "unit": "mm", "type": "Family"}
                }
            }
        }

    def get_all_elements(self) -> List[Dict[str, Any]]:
        return list(self.mock_data.values())
        
    def get_element_by_id(self, element_id: str) -> Dict[str, Any]:
        return self.mock_data.get(element_id, {})
        
    def get_parameters(self, element_id: str) -> Dict[str, Any]:
        element = self.get_element_by_id(element_id)
        return element.get("Parameters", {})

class MockRevitTransaction(IRevitTransaction):
    def start(self, name: str) -> None:
        print(f"Transaction started: {name}")
        
    def commit(self) -> None:
        print("Transaction committed")
        
    def rollback(self) -> None:
        print("Transaction rolled back")
