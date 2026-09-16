from app.city.urban_twin import UrbanDigitalTwin, UrbanIntelligenceEngine
from app.city.multi_agent import UrbanAgentCoordinator, HumanReviewGate

def test_rule_city_intelligence_loop():
    """
    Simulates the final loop:
    Urban Twin -> Predict/Simulate/Optimize -> Multi-Agent Analysis -> Human Review -> Downward Loop
    Enforces Absolute Rules: No fake live data, No AI auto-approval.
    """
    twin = UrbanDigitalTwin("city_01")
    twin.add_district("district_alpha")
    assert twin.data_status == "SIMULATED" # Enforce No Fabrication
    
    intel = UrbanIntelligenceEngine()
    coordinator = UrbanAgentCoordinator()
    gate = HumanReviewGate()
    
    # 1. Urban Intelligence (Predict, Simulate, Optimize)
    prediction = intel.predict_demand(twin)
    assert prediction["provenance"] == "MOCKED_SIMULATION"
    
    scenario = intel.simulate_scenario(twin, "TRAFFIC_REROUTE")
    assert scenario["status"] == "SIMULATED"
    
    optimization = intel.optimize_infrastructure(twin)
    assert optimization["is_engineering_certification"] == False # Enforce Absolute Rule
    
    # 2. Multi-Agent Analysis
    opinions = coordinator.evaluate_scenario(scenario)
    assert len(opinions) == 2
    assert opinions[0].can_modify_production == False # Enforce Agent Safety Rule
    
    # 3. Human Review Gate (Governance)
    scenario_id = "SCENARIO_99"
    gate.submit_for_review(scenario_id)
    assert gate.pending_approvals[scenario_id] == False
    
    # 4. Approved Scenario Output (Closes loop back to Phase 1-5 Building Projects)
    approval_result = gate.approve_scenario(scenario_id)
    assert approval_result == "APPROVED_SCENARIO"
    assert gate.pending_approvals[scenario_id] == True
