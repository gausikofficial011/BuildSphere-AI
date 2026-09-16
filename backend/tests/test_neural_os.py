import pytest
from app.neural.environment import AECNeuralOperatingEnvironment

def test_rule_248_full_end_to_end_realtime_demo():
    """
    Rule 248: Final End-to-End Real-Time Demo.
    Traces an event from origin through the fabric to synchronization.
    """
    os_env = AECNeuralOperatingEnvironment()
    
    # 1. Revit connector sends a sync event (Rule 14)
    sync_event = os_env.process_external_event(
        event_type="revit.sync.completed",
        project_id="PROJ-LIVE-1",
        payload={"elements": ["W-100", "W-101"]}
    )
    
    assert sync_event["status"] == "PUBLISHED"
    
    # 2. Verify World Model Sync Engine caught the event
    assert os_env.sync_engine.get_sync_state("PROJ-LIVE-1") == "SYNCED"

def test_rule_251_agent_conflict_test():
    """
    Rule 251: Agent Conflict Test.
    Two agents propose conflicting changes.
    """
    os_env = AECNeuralOperatingEnvironment()
    
    # Trigger a clash which summons the swarm
    os_env.process_external_event(
        event_type="bim.clash.detected",
        project_id="PROJ-LIVE-1",
        payload={"element_id": "W-200"}
    )
    
    # The swarm (Structural & MEP) automatically creates two proposals for W-200.
    # The Orchestrator detects this and emits a conflict event.
    
    # Let's inspect the fabric log for the conflict event
    conflict_events = [e for e in os_env.fabric.events_log if e["eventType"] == "agent.conflict.detected"]
    
    assert len(conflict_events) == 1
    assert conflict_events[0]["payload"]["element_id"] == "W-200"
    assert len(conflict_events[0]["payload"]["proposals"]) == 2

def test_rule_6_event_idempotency():
    """Rule 6 & 252: Event Idempotency and Duplication test."""
    os_env = AECNeuralOperatingEnvironment()
    
    # Send normal event
    event1 = os_env.process_external_event(
        event_type="test.event",
        project_id="PROJ-LIVE-1",
        payload={"test": "data"}
    )
    
    # Attempt to route the exact same event ID again
    # The fabric tracks processed_event_ids and ignores it.
    os_env.fabric._route_event(event1)
    
    # Subscribers should only have been triggered once (if we had a mock subscriber to count it)
    assert len(os_env.fabric._processed_event_ids) == 1
