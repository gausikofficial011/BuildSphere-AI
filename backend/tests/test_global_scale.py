import pytest
from app.global_scale.global_twin import GlobalModel, GlobalGraph
from app.global_scale.global_cascading import GlobalDisruptionSimulator
from app.global_scale.global_optimizer import GlobalPortfolioOptimizer
from app.orchestration.delivery import GovernanceViolationException

def test_rule_global_intelligence_demo():
    """Phase 29 E2E Demo: Global AEC Digital Twin & Portfolio Optimization."""
    
    # 1. Baseline Global Model
    globe = GlobalModel()
    baseline = globe.get_baseline_state()
    assert baseline["total_countries"] == 10
    assert baseline["global_projects"] == 50
    assert "Global_Corridor_Alpha" in baseline["major_logistics_corridors"]
    
    # 2. Global Graph Connectivity
    graph = GlobalGraph()
    relationships = graph.get_relationships()
    assert "Ocean_Freight" in relationships["Global_Corridor_Alpha"]
    assert "Steel_Supply" in relationships["Ocean_Freight"]
    assert "Country_1_Projects" in relationships["Steel_Supply"]
    
    # 3. Simulate Global Disruption (Cascading)
    simulator = GlobalDisruptionSimulator()
    impact = simulator.simulate_disruption(baseline, failed_corridor="Global_Corridor_Alpha", duration_days=30)
    assert impact["affected_countries"] == 10
    assert impact["affected_projects"] == 50
    assert impact["portfolio_schedule_delay_days"] == 45.0
    
    # 4. Generate Recovery Portfolios
    generator = GlobalPortfolioOptimizer()
    portfolios = generator.generate_portfolios(impact)
    
    assert len(portfolios) == 3
    assert portfolios[0]["id"] == "PORTFOLIO_A"
    assert portfolios[1]["id"] == "PORTFOLIO_B"
    assert portfolios[1]["name"] == "Local Material Substitution"
    
    # 5. Execute without Governance (MUST FAIL)
    with pytest.raises(GovernanceViolationException, match="deploy global portfolio without governed approval"):
        generator.execute_portfolio("PORTFOLIO_B", human_approved=False)
        
    # 6. Execute with Governance (MUST PASS)
    result = generator.execute_portfolio("PORTFOLIO_B", human_approved=True)
    assert result["status"] == "APPROVED"
    assert result["portfolio_applied"] == "PORTFOLIO_B"
