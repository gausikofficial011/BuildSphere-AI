import pytest
from app.world.engine import AECWorldModelEngine

def test_rule_169_final_world_model_super_demo():
    """
    Rule 169: Final Super-Demo.
    Rule 8: Do not modify production state.
    """
    engine = AECWorldModelEngine()
    
    # 1. Normal Production Superintelligence Flow (Phase 11 Passthrough)
    gen_result = engine.process_world_event(
        "GENERATE_DESIGN", 
        {"type": "Hospital"}, 
        user_role="SUPER_ADMIN"
    )
    assert gen_result["status"] == "SUCCESS"
    assert "output" in gen_result
    
    # Production state is ON_TIME initially
    assert engine.state_engine.production_state["schedule"]["status"] == "ON_TIME"
    assert engine.state_engine.production_state["cost"]["overrun_amount"] == 0
    
    # 2. Copilot Scenario Mode (Phase 12: What if supplier A is delayed?)
    scenario_payload = {
        "scenario_name": "Supplier Concrete Delay",
        "action": "SUPPLIER_DELAY",
        "supplier_id": "ConcreteCorp",
        "delay_days": 14
    }
    
    scenario_result = engine.process_world_event(
        "SIMULATE_SCENARIO",
        scenario_payload,
        user_role="SUPER_ADMIN"
    )
    
    assert scenario_result["status"] == "SUCCESS"
    
    # 3. Verify the simulation branch propagated the impact
    sim_data = scenario_result["simulation_result"]
    assert sim_data["status"] == "SIMULATION_COMPLETE"
    assert sim_data["new_state"]["schedule"]["status"] == "DELAYED"
    assert sim_data["new_state"]["schedule"]["delay_days"] == 14
    assert sim_data["new_state"]["cost"]["overrun_amount"] == 70000  # 14 days * 5000
    
    # 4. Verify Absolute Rule 8: Production State must remain unchanged
    assert engine.state_engine.production_state["schedule"]["status"] == "ON_TIME"
    assert engine.state_engine.production_state["schedule"]["delay_days"] == 0
    assert engine.state_engine.production_state["cost"]["overrun_amount"] == 0
