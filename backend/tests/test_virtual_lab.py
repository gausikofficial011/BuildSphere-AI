import pytest
from app.lab.lab import AECVirtualProjectLab

def test_rule_260_virtual_project_lab_end_to_end():
    """
    Rule 260: Final End-to-End Demonstration.
    Clones project, generates scenarios, simulates, optimizes (Pareto), approves, promotes.
    """
    # 1. Mock Production State
    production_world_model = {"building_cost": 1000000, "walls": 50}
    lab = AECVirtualProjectLab(production_world_model)
    
    # 2. Clone into Scenarios (Rule 4)
    # Scenario A: Baseline
    s_a = lab.clone_to_scenario(assumptions={"cost_multiplier": 1.0, "time_multiplier": 1.0, "risk_score": 0.5})
    # Scenario B: Fast but Expensive
    s_b = lab.clone_to_scenario(assumptions={"cost_multiplier": 1.5, "time_multiplier": 0.6, "risk_score": 0.6})
    # Scenario C: Cheap but Slow & Risky
    s_c = lab.clone_to_scenario(assumptions={"cost_multiplier": 0.7, "time_multiplier": 1.8, "risk_score": 0.9})
    # Scenario D: Worse in every way than A (Dominated)
    s_d = lab.clone_to_scenario(assumptions={"cost_multiplier": 1.2, "time_multiplier": 1.2, "risk_score": 0.8})
    
    # 3. Run Simulation Engine (Rule 21)
    lab.run_simulation(s_a.id)
    lab.run_simulation(s_b.id)
    lab.run_simulation(s_c.id)
    lab.run_simulation(s_d.id)
    
    # 4. Run Optimization Engine (Pareto Candidates) (Rule 32)
    pareto_candidates = lab.get_pareto_candidates()
    
    # We expect A, B, and C to be in the Pareto frontier. D is dominated by A.
    pareto_ids = [c.id for c in pareto_candidates]
    assert s_a.id in pareto_ids
    assert s_b.id in pareto_ids
    assert s_c.id in pareto_ids
    assert s_d.id not in pareto_ids
    
    # 5. Production Promotion Gate (Rule 142)
    # Attempting to promote an unapproved scenario MUST fail.
    with pytest.raises(ValueError, match="Cannot promote an unapproved scenario"):
        lab.promote_to_production(s_a.id)
        
    # 6. Human Approval & Promotion (Rule 140 & 143)
    lab.approve_scenario(s_b.id)  # We choose the Fast/Expensive option
    
    # Actually simulate the geometry change inside the scenario before promoting
    lab.scenarios[s_b.id].state["walls"] = 45 
    
    updated_production_state = lab.promote_to_production(s_b.id)
    
    # 7. World Model Updated Verification
    assert updated_production_state["walls"] == 45
    
    # Verify the original object reference updated
    assert lab.production_state["walls"] == 45
