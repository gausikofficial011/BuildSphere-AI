import uuid
from typing import Dict, Any, List, Optional
from datetime import datetime, timezone

class AECEventFabric:
    """
    Phase 14: AEC Event Fabric.
    Rules 3-10: Event Schema, Idempotency, Dead-Letter Queue.
    """
    def __init__(self):
        self.events_log = []
        self.dead_letter_queue = []
        self._processed_event_ids = set()
        self.subscribers = {}

    def publish_event(self, event_type: str, project_id: str, payload: Dict[str, Any], actor: str = "SYSTEM") -> Dict[str, Any]:
        """Rule 4: Standardized Event Schema"""
        event_id = str(uuid.uuid4())
        
        # Rule 6: Event Idempotency (prevent duplicate operations by deduplication on publish if needed, though strictly ID based here)
        
        event = {
            "eventId": event_id,
            "eventType": event_type,
            "projectId": project_id,
            "source": "NeuralOS",
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "actor": actor,
            "payload": payload,
            "status": "PUBLISHED"
        }
        
        self.events_log.append(event)
        self._route_event(event)
        return event

    def subscribe(self, event_type: str, handler: Any):
        """Register a handler for a specific event type."""
        if event_type not in self.subscribers:
            self.subscribers[event_type] = []
        self.subscribers[event_type].append(handler)

    def _route_event(self, event: Dict[str, Any]):
        """Routes the event to all subscribers synchronously (for testability)."""
        event_type = event["eventType"]
        event_id = event["eventId"]
        
        # Rule 6: Idempotency
        if event_id in self._processed_event_ids:
            return
            
        self._processed_event_ids.add(event_id)
        
        if event_type in self.subscribers:
            for handler in self.subscribers[event_type]:
                try:
                    handler(event)
                except Exception as e:
                    # Rule 9: Event Dead Letter Queue
                    self.dead_letter_queue.append({
                        "event": event,
                        "error": str(e),
                        "timestamp": datetime.now(timezone.utc).isoformat()
                    })
