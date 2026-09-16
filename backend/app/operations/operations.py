import uuid
from typing import Dict, Any, List

class Asset:
    def __init__(self, asset_id: str, asset_type: str, bim_element_id: str):
        self.id = asset_id
        self.type = asset_type
        self.bim_element_id = bim_element_id
        self.state = "ONLINE"
        self.health_score = 100.0

class FacilityAssetRegistry:
    """Rule 5: Asset Registry"""
    def __init__(self):
        self.assets: Dict[str, Asset] = {}
        
    def register_asset(self, asset_id: str, asset_type: str, bim_element_id: str) -> Asset:
        asset = Asset(asset_id, asset_type, bim_element_id)
        self.assets[asset.id] = asset
        return asset
        
    def update_state(self, asset_id: str, new_state: str) -> None:
        if asset_id in self.assets:
            self.assets[asset_id].state = new_state

class BuildingOperationsEngine:
    """Rule 2: Building Operations Engine"""
    def __init__(self):
        self.registry = FacilityAssetRegistry()
        self.telemetry = []

    def ingest_sensor_data(self, asset_id: str, sensor_type: str, value: float) -> None:
        """Rule 12: Sensor Ingestion. Rule 261: MOCKED for real IoT"""
        self.telemetry.append({
            "asset_id": asset_id,
            "type": sensor_type,
            "value": value,
            "status": "MOCKED_IOT"
        })
