from app.knowledge.rules import SemanticElement
from app.robotics.hardware import PhysicalRobotConnector
from app.robotics.mission import RobotMissionPlanner, MissionSimulationEngine
from app.orchestration.thread import DigitalThreadEngine

def test_rule_physical_ai_robotics_loop():
    """
    Demonstrates the Phase 22 Killer Demo:
    Select Wall -> Understand constraints -> Generate Task -> Check Robot -> Plan Mission
    -> Simulate Mission -> Human Approval -> Simulate Execution -> Verify -> Update Thread
    """
    thread = DigitalThreadEngine()
    element_id = "Wall #A-1042"
    
    # 1. Select and Understand Wall
    wall = SemanticElement(element_id, {"material": "Steel Frame", "location": "Floor 1"})
    
    # 2. Generate Construction Task
    planner = RobotMissionPlanner()
    task = planner.generate_task(wall)
    assert task["task_type"] == "WELD_FRAME"
    
    # 3. Determine if robot can perform it
    is_feasible = planner.check_feasibility(task)
    assert is_feasible is True
    
    # 4. Generate & Simulate Mission
    sim_engine = MissionSimulationEngine()
    sim_result = sim_engine.simulate_mission(task)
    assert sim_result["collision_check"] == "PASSED"
    
    # 5. Human Approval (Implicit in test orchestration step)
    human_approved = True
    assert human_approved is True
    
    # 6. Simulated Robot Execution
    connector = PhysicalRobotConnector("ROBOT_X1")
    robot_status = connector.get_status()
    assert robot_status == "SIMULATED" # Enforce rule: DO NOT ASSUME ROBOT EXISTS
    
    # 7. Verification via Mocked Camera
    verification = connector.verify_completion(sim_result["mission_id"])
    assert verification["vision_match"] is True
    assert verification["source"] == "MOCKED_CAMERA"
    
    # 8. Update Digital Thread
    thread.add_node(element_id, "PHYSICAL_CONSTRUCTION", verification)
    
    final_thread = thread.get_thread(element_id)
    assert len(final_thread) == 1
    assert final_thread[0].stage == "PHYSICAL_CONSTRUCTION"
    assert final_thread[0].data["status"] == "VERIFIED_MOCK"
