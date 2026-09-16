import pytest
from app.regional_scale.national_twin import RegionalModel, IntercityGraph
from app.regional_scale.cascading_impact import NetworkDisruptionSimulator
from app.regional_scale.regional_optimizer import RecoveryStrategyGenerator
from app.orchestration.delivery import GovernanceViolationException

def test_rule_regional_infrastructure_demo():
    """Phase 28 E2E Demo: Regional Infrastructure & Network Optimization."""
    
    # 1. Baseline Regional Model
    region = RegionalModel()
    baseline = region.get_baseline_state()
    assert baseline["total_cities"] == 5
    assert baseline["infrastructure_nodes"] == 15
    assert "Bridge_Alpha" in baseline["major_bridges"]
    
    # 2. Intercity Graph Connectivity
    graph = IntercityGraph()
    relationships = graph.get_relationships()
    assert "City_B_Traffic" in relationships["Bridge_Alpha"]
    assert "Regional_Freight" in relationships["Bridge_Alpha"]
    assert "Construction_Projects" in relationships["Regional_Freight"]
    
    # 3. Simulate Bridge Failure Impact (Cascading)
    simulator = NetworkDisruptionSimulator()
    impact = simulator.simulate_disruption(baseline, failed_node="Bridge_Alpha", duration_days=30)
    assert impact["affected_cities"] == 4
    assert impact["freight_delay_hours"] == 14.0
    assert impact["affected_projects"] == 12
    
    # 4. Generate Recovery Strategies
    generator = RecoveryStrategyGenerator()
    strategies = generator.generate_strategies(impact)
    
    assert len(strategies) == 3
    assert strategies[0]["id"] == "STRATEGY_A"
    assert strategies[1]["id"] == "STRATEGY_B"
    assert strategies[1]["name"] == "Temporary Alternate Route"
    
    # 5. Execute without Governance (MUST FAIL)
    with pytest.raises(GovernanceViolationException, match="deploy regional strategy without governed approval"):
        generator.execute_strategy("STRATEGY_B", human_approved=False)
        
    # 6. Execute with Governance (MUST PASS)
    result = generator.execute_strategy("STRATEGY_B", human_approved=True)
    assert result["status"] == "APPROVED"
    assert result["strategy_applied"] == "STRATEGY_B"
