from typing import Dict, Any, List
from app.schema.parameters import BIMParameter, StorageType
from .environment import RevitEnvironmentDetector

class ParameterExtractor:
    @staticmethod
    def extract_from_native(raw_params: List[Any]) -> Dict[str, BIMParameter]:
        """
        Converts raw Autodesk API Parameters into the normalized BuildSphere schema.
        """
        extracted = {}
        for p in raw_params:
            try:
                storage_type_str = p.get("storageType", "UNKNOWN")
                st = StorageType.UNKNOWN
                if hasattr(StorageType, storage_type_str.upper()):
                    st = StorageType[storage_type_str.upper()]
                    
                param = BIMParameter(
                    parameterId=p.get("id", "unknown"),
                    name=p.get("name", "Unnamed"),
                    displayName=p.get("displayName"),
                    storageType=st,
                    value=p.get("value"),
                    normalizedValue=p.get("value"), # Pipeline handles actual unit conversion
                    unit=p.get("unit"),
                    isReadOnly=p.get("isReadOnly", False),
                    isInstanceParameter=p.get("isInstance", True),
                    source="Revit"
                )
                extracted[param.name] = param
            except Exception as e:
                # Log extraction warning instead of failing entire model
                pass
        return extracted
