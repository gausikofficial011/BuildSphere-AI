from typing import Dict, Any

class RealtimeAgentOrchestrator:
    """
    Phase 14: Real-Time Agent Orchestration & AEC Swarm Coordinator.
    Rules 38-50: Agent events, concurrency, conflict detection.
    """
    def __init__(self, fabric):
        self.fabric = fabric
        self.fabric.subscribe("bim.clash.detected", self.handle_clash)
        self.fabric.subscribe("agent.proposal.created", self.detect_conflicts)
        self.active_proposals = {}
        self.locks = set()

    def handle_clash(self, event: Dict[str, Any]):
        """Rule 38: Real-Time Agent Orchestrator summons swarm."""
        project_id = event["projectId"]
        element = event["payload"].get("element_id")
        
        # Rule 42 & 43: Agent Concurrency Control & Locking
        if element in self.locks:
            return # Already being processed
        self.locks.add(element)
        
        # Swarm triggers multiple agents. For simplicity, we just publish proposals.
        self.fabric.publish_event(
            event_type="agent.proposal.created",
            project_id=project_id,
            payload={"agent": "Structural", "element_id": element, "action": "move_up"},
            actor="AgentSwarm"
        )
        self.fabric.publish_event(
            event_type="agent.proposal.created",
            project_id=project_id,
            payload={"agent": "MEP", "element_id": element, "action": "move_down"},
            actor="AgentSwarm"
        )
        self.locks.remove(element)

    def detect_conflicts(self, event: Dict[str, Any]):
        """Rule 44: Agent Conflict Detection"""
        project_id = event["projectId"]
        element_id = event["payload"]["element_id"]
        
        if element_id not in self.active_proposals:
            self.active_proposals[element_id] = []
            
        self.active_proposals[element_id].append(event["payload"])
        
        # If we have multiple different actions for the same element, it's a conflict
        actions = set(p["action"] for p in self.active_proposals[element_id])
        if len(actions) > 1:
            # CONFLICT DETECTED
            self.fabric.publish_event(
                event_type="agent.conflict.detected",
                project_id=project_id,
                payload={"element_id": element_id, "proposals": self.active_proposals[element_id]},
                actor="Orchestrator"
            )
            # Clear to prevent infinite loops (Rule 41 Debouncing)
            self.active_proposals[element_id] = []
