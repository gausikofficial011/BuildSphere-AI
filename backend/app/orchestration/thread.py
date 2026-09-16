import datetime
from typing import Dict, List, Any

class LifecycleNode:
    def __init__(self, stage: str, data: Dict[str, Any], timestamp: str = None):
        self.stage = stage # e.g. "REQUIREMENT", "REVIT_ELEMENT", "CONSTRUCTION"
        self.data = data
        self.timestamp = timestamp or datetime.datetime.now(datetime.timezone.utc).isoformat()

class DigitalThreadEngine:
    """The key Phase 20 feature: traceable BIM element lifecycle"""
    def __init__(self):
        self.threads: Dict[str, List[LifecycleNode]] = {}
        
    def add_node(self, element_id: str, stage: str, data: Dict[str, Any]):
        if element_id not in self.threads:
            self.threads[element_id] = []
        node = LifecycleNode(stage, data)
        self.threads[element_id].append(node)
        
    def get_thread(self, element_id: str) -> List[LifecycleNode]:
        return self.threads.get(element_id, [])
