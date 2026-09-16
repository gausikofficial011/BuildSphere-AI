from typing import List, Dict, Any

class RevitDataExtractor:
    """
    Extracts raw data from Revit (or our mock harness) and structures it 
    hierarchically: Category -> Family -> Type -> Instance.
    """
    
    def __init__(self, reader):
        from .interfaces import IRevitReader
        self.reader: IRevitReader = reader

    def extract_element_taxonomy(self, element: Dict[str, Any]) -> Dict[str, Any]:
        """
        Normalizes a raw Revit element into a structured taxonomy.
        """
        return {
            "instance_id": element.get("UniqueId"),
            "category": element.get("Category", "Unknown"),
            "family": element.get("Family", "Unknown"),
            "type": element.get("Type", "Unknown"),
            "level": element.get("Level", "Unknown")
        }

    def extract_geometry_metadata(self, element: Dict[str, Any]) -> Dict[str, Any]:
        """
        Extracts semantic geometry features (BoundingBox, location curves)
        instead of arbitrary raw meshes.
        """
        raw_geom = element.get("Geometry", {})
        return {
            "bounding_box": raw_geom.get("BoundingBox"),
            "location": raw_geom.get("LocationCurve", raw_geom.get("LocationPoint")),
            "volume": raw_geom.get("Volume", 0),
            "area": raw_geom.get("Area", 0)
        }

    def extract_relationships(self, element: Dict[str, Any]) -> List[Dict[str, str]]:
        """
        Extracts semantic relationships (e.g. Wall HOSTS Door)
        """
        rels = []
        element_id = element.get("UniqueId")
        
        # Hosted elements
        for child_id in element.get("HostedElements", []):
            rels.append({
                "source": element_id,
                "target": child_id,
                "type": "HOSTS"
            })
            
        # Level relationship
        level = element.get("Level")
        if level:
            rels.append({
                "source": element_id,
                "target": level,
                "type": "LOCATED_ON"
            })
            
        return rels

    def process_all_elements(self) -> List[Dict[str, Any]]:
        raw_elements = self.reader.get_all_elements()
        processed = []
        for raw in raw_elements:
            processed.append({
                "taxonomy": self.extract_element_taxonomy(raw),
                "geometry": self.extract_geometry_metadata(raw),
                "parameters": self.reader.get_parameters(raw.get("UniqueId")),
                "relationships": self.extract_relationships(raw),
                "source": "revit"
            })
        return processed
