from .fabric import AECEventFabric
from .sync import WorldSynchronizationEngine
from .orchestrator import RealtimeAgentOrchestrator

class AECNeuralOperatingEnvironment:
    """
    Phase 14: The God-Level AEC Neural Operating Environment.
    Wraps the Event Fabric, Sync Engine, and Orchestrator.
    """
    def __init__(self):
        self.fabric = AECEventFabric()
        self.sync_engine = WorldSynchronizationEngine(self.fabric)
        self.orchestrator = RealtimeAgentOrchestrator(self.fabric)

    def process_external_event(self, event_type: str, project_id: str, payload: dict, actor: str = "USER") -> dict:
        """Entrypoint for external systems (Revit, UI, Sensors) to push events into the Neural OS."""
        return self.fabric.publish_event(event_type, project_id, payload, actor)
