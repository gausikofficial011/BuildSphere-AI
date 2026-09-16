from app.knowledge.rules import SemanticElement
from app.knowledge.standards import CompliancePrecheckEngine, AecStandardsRegistry
from app.robotics.mission import RobotMissionPlanner, MissionSimulationEngine
from app.spatial_computing.xr_session import SpatialComputingSession
from app.orchestration.thread import DigitalThreadEngine

def test_rule_spatial_computing_killer_demo():
    """
    Demonstrates the Phase 23 Killer Demo:
    Enter VR -> Select Wall -> Check Compliance -> Place Marker -> 
    Simulate Robot -> Propose Change -> Enforce Governance (PENDING).
    """
    session = SpatialComputingSession()
    thread = DigitalThreadEngine()
    element_id = "Wall #C-500"
    
    # 1. Enter VR (Verify mocked headset)
    assert session.device_manager.verify_device("MOCK_VR_HEADSET") is True
    
    # 2. Select Wall & Check Compliance (Phase 21 integration)
    wall = SemanticElement(element_id, {"stc_rating": 45, "material": "Drywall"})
    registry = AecStandardsRegistry()
    engine = CompliancePrecheckEngine(registry)
    compliance = wall.check_compliance(engine)
    assert compliance["TEST_CODE_2026"]["status"] == "FAIL" # Fails REQ_STC_50
    
    # 3. Place Issue Marker in VR
    marker = session.review.place_issue_marker(element_id, "VR_User_1", "Fails acoustic code, need to upgrade wall.")
    assert marker["status"] == "OPEN"
    
    # 4. Simulate Robot Mission to tear down wall (Phase 22 integration)
    planner = RobotMissionPlanner()
    task = planner.generate_task(wall)
    sim_engine = MissionSimulationEngine()
    sim_result = sim_engine.simulate_mission(task)
    assert sim_result["collision_check"] == "PASSED"
    
    # 5. Propose Design Change from VR
    change = session.propose_design_change(element_id, {"stc_rating": 55, "material": "Acoustic Panel"}, "VR_User_1")
    
    # 6. ENFORCE GOVERNANCE RULE: MUST BE PENDING, NOT AUTOMATICALLY MODIFIED
    assert change["status"] == "PENDING_APPROVAL_QUEUE"
    assert change["governance_rule"] == "HUMAN_APPROVAL_REQUIRED"
    
    # 7. Update Digital Thread
    thread.add_node(element_id, "SPATIAL_COMPUTING_REVIEW", change)
    final_thread = thread.get_thread(element_id)
    assert len(final_thread) == 1
    assert final_thread[0].stage == "SPATIAL_COMPUTING_REVIEW"
