import pytest
from app.global_scale.global_twin import GlobalModel
from app.regional_scale.national_twin import RegionalModel
from app.city_scale.urban_twin import CityModel
from app.lifecycle.digital_twin import FacilityTwin
from app.decision_intelligence.optimizer import MultiObjectiveOptimizer, ScenarioEvaluator
from app.orchestration.delivery import GovernanceViolationException

def test_rule_master_os_integration():
    """Phase 30 Master E2E Demo: Global -> Regional -> City -> Facility -> Optimization -> Governance."""
    
    # 1. Global Event
    globe = GlobalModel()
    global_state = globe.get_baseline_state()
    assert "Global_Corridor_Alpha" in global_state["major_logistics_corridors"]
    
    # 2. Regional Cascade
    region = RegionalModel()
    regional_state = region.get_baseline_state()
    assert "Bridge_Alpha" in regional_state["major_bridges"]
    
    # 3. City Impact
    city = CityModel()
    city_state = city.get_baseline_state()
    assert city_state["traffic_congestion_index"] == 6.5
    
    # 4. Facility Impact
    facility = FacilityTwin()
    asset = facility.get_asset_info("HVAC-MASTER-1")
    assert asset["condition"] == "Degrading"
    
    # 5. Multi-Objective Optimization
    optimizer = MultiObjectiveOptimizer()
    options = optimizer.generate_options(["HVAC_FAILURE_DUE_TO_GLOBAL_SUPPLY_DELAY"], current_delay_days=10, current_cost=1000)
    assert len(options) == 4
    assert options[2]["id"] == "OPTION_B"
    
    # 6. Governance Verification (Fail without human)
    evaluator = ScenarioEvaluator()
    with pytest.raises(GovernanceViolationException, match="production schedule without governed approval"):
        evaluator.execute_option(options[2]["id"], human_approved=False)
        
    # 7. Final Governed Execution
    result = evaluator.execute_option(options[2]["id"], human_approved=True)
    assert result["status"] == "EXECUTED"
    assert result["governance"] == "HUMAN_APPROVED"
