from typing import Dict, Any, List

class WebhookDispatcher:
    """
    Phase 9: Webhook / Event Bus integration.
    Allows external systems to subscribe to internal AEC events (e.g. CLASH_DETECTED).
    """
    def __init__(self):
        self.subscribers = {}
        self.dispatched_events = [] # For testing assertions
        
    def register_webhook(self, event_type: str, url: str) -> None:
        if event_type not in self.subscribers:
            self.subscribers[event_type] = []
        self.subscribers[event_type].append(url)
        
    def trigger_event(self, event_type: str, payload: Dict[str, Any]) -> None:
        """
        In production, this would make async HTTP POST requests.
        For testability, it logs the dispatch.
        """
        urls = self.subscribers.get(event_type, [])
        for url in urls:
            self.dispatched_events.append({
                "url": url,
                "event_type": event_type,
                "payload": payload
            })
