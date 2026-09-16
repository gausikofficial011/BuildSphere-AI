import pytest
from app.city_scale.urban_twin import CityModel, InfrastructureGraph
from app.city_scale.scenario_simulator import UrbanImpactSimulator
from app.city_scale.urban_optimizer import UrbanScenarioGenerator
from app.orchestration.delivery import GovernanceViolationException

def test_rule_urban_intelligence_demo():
    """Phase 27 E2E Demo: City-Scale Digital Twin & Generative Spatial Planning Engine."""
    
    # 1. Baseline City Model
    city = CityModel()
    baseline = city.get_baseline_state()
    assert baseline["current_buildings"] == 50
    assert baseline["source"] == "MOCKED_GIS_API"
    
    # 2. Infrastructure Graph
    graph = InfrastructureGraph()
    relationships = graph.get_relationships()
    assert "Power Demand" in relationships["Building"]
    
    # 3. Simulate New Development Impact
    simulator = UrbanImpactSimulator()
    impact = simulator.simulate_impact(baseline, new_buildings=20)
    assert impact["additional_power_load_percent"] == 3.0
    
    # 4. Generate Scenarios
    generator = UrbanScenarioGenerator()
    scenarios = generator.generate_scenarios(impact)
    
    assert len(scenarios) == 4
    assert scenarios[0]["id"] == "SCENARIO_A"
    assert scenarios[2]["id"] == "SCENARIO_C"
    assert scenarios[2]["name"] == "Low-Carbon Development"
    
    # 5. Execute without Governance (MUST FAIL)
    with pytest.raises(GovernanceViolationException, match="deploy city-scale scenario without governed approval"):
        generator.execute_scenario("SCENARIO_C", human_approved=False)
        
    # 6. Execute with Governance (MUST PASS)
    result = generator.execute_scenario("SCENARIO_C", human_approved=True)
    assert result["status"] == "APPROVED"
    assert result["scenario_applied"] == "SCENARIO_C"
