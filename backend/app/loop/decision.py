from typing import Dict, Any
from ..agents.orchestrator import AECAgentOrchestrator
from .synchronizer import StateSynchronizer

class ClosedLoopEngine:
    """
    Phase 10: Closed Loop Engine.
    Listens to IoT and Vision data. If critical, summons Phase 8 Agents.
    Routes to Phase 5 Execution Gateway (via Synchronizer) for Human Approval.
    """
    def __init__(self):
        self.orchestrator = AECAgentOrchestrator()
        self.synchronizer = StateSynchronizer()
        
    def process_realworld_anomaly(self, anomaly_report: Dict[str, Any]) -> Dict[str, Any]:
        """
        Receives an anomaly (e.g. from IoT freezing concrete, or Vision off-axis wall).
        """
        target = anomaly_report.get("element", anomaly_report.get("target_element", "UNKNOWN"))
        status = anomaly_report.get("status", "UNKNOWN")
        requires_rework = anomaly_report.get("requires_rework", False)
        
        if status == "CRITICAL" or requires_rework:
            # Step 1: Summon AI Agent Orchestrator to ANALYZE
            agent_review = self.orchestrator.run_design_review({"target": target, "anomaly": anomaly_report})
            
            # Step 2: Route to Synchronizer for Phase 7 Issue & Phase 5 Execution Approval
            sync_result = self.synchronizer.propose_bim_correction(target, anomaly_report, agent_review)
            
            return {
                "loop_status": "CORRECTION_PROPOSED",
                "ai_analysis": agent_review,
                "execution_routing": sync_result
            }
            
        return {
            "loop_status": "NOMINAL",
            "action": "NONE"
        }
