import pytest
from app.superintelligence.engine import AECSuperIntelligenceEngine
from app.superintelligence.router import IntelligenceRouter
from app.superintelligence.memory import AECMemorySystem

def test_rule_185_final_lifecycle_demonstration():
    """
    Rule 185: Final End-to-End Superintelligence Test.
    Proves the system can handle Requirements -> GenDesign -> Execute -> Observe -> Correct.
    """
    # 1. Initialize the Master Engine
    engine = AECSuperIntelligenceEngine()
    
    # 2. Security / Governance Gate
    bad_role_attempt = engine.process_lifecycle_event("GENERATE_DESIGN", {}, user_role="GUEST")
    assert bad_role_attempt["status"] == "ACCESS_DENIED"
    
    # 3. Generate Design (Pareto Optimization)
    gen_result = engine.process_lifecycle_event(
        "GENERATE_DESIGN", 
        {"type": "School"}, 
        user_role="ARCHITECT"
    )
    assert gen_result["status"] == "SUCCESS"
    assert "output" in gen_result
    
    # 4. Human Approves Candidate B -> Execute in Revit
    exec_result = engine.process_lifecycle_event(
        "EXECUTE_APPROVED_DESIGN",
        {"candidate_id": "B"},
        user_role="ARCHITECT"
    )
    assert exec_result["status"] == "SUCCESS"
    assert engine.master_project_state["active_design"] == "B"
    
    # 5. Construction Observation (Anomaly detected on site)
    obs_payload = {
        "status": "CRITICAL",
        "element": "wall_north",
        "requires_rework": True
    }
    obs_result = engine.process_lifecycle_event(
        "CONSTRUCTION_OBSERVATION",
        obs_payload,
        user_role="ARCHITECT"
    )
    assert obs_result["status"] == "SUCCESS"
    
    # 6. Verify the Closed Loop Agent Orchestration halted at Human Approval
    loop_output = obs_result["output"]
    assert loop_output["loop_status"] == "CORRECTION_PROPOSED"
    assert loop_output["execution_routing"]["status"] == "AWAITING_HUMAN_APPROVAL"

def test_rule_94_deterministic_routing():
    """Rule 94: Never use LLM when deterministic data is available."""
    router = IntelligenceRouter()
    project_data = {"door_count": 42}
    
    # Question should map directly to deterministic BIM
    res1 = router.route_query("How many doors are there?", project_data)
    assert res1["router_path"] == "DETERMINISTIC_BIM"
    assert "42" in res1["answer"]
    
    # Question requires reasoning
    res2 = router.route_query("Why is the project delayed?", project_data)
    assert res2["router_path"] == "HYBRID_REASONING"

def test_temporal_and_causal_memory():
    """Rule 6, 7: Temporal and Causal graph storage."""
    memory = AECMemorySystem()
    
    memory.record_state("wall_1", "LoadBearing", "2026-01-01", "2026-06-01")
    memory.record_causation("Design_Change_101", "wall_1", "AFFECTS")
    
    hist_state = memory.query_historical_state("wall_1", "2026-03-01")
    assert hist_state["state"] == "LoadBearing"
    assert len(memory.causal_links) == 1
