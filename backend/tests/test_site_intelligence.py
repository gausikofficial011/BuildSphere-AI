import pytest
from app.site_intelligence.perception import SiteObservationEngine, ProgressAnalyzer
from app.site_intelligence.recovery import ScenarioGenerator, ScheduleUpdater
from app.orchestration.delivery import GovernanceViolationException
from app.orchestration.thread import DigitalThreadEngine

def test_rule_autonomous_site_intelligence():
    """
    Demonstrates the Phase 24 Killer Demo:
    Expected (80%) -> Actual (62%) -> 18% Gap Detected -> Root Cause Mocked -> 
    Scenarios Generated -> Reject Automatic Update -> PM Approves -> Workflow Updates.
    """
    thread = DigitalThreadEngine()
    
    # 1. 4D BIM Expected State
    expected_progress = 80
    
    # 2. Site Observation (Explicitly Mocked)
    perception = SiteObservationEngine()
    observation = perception.get_observation("Level 3 Structure")
    
    assert observation["actual_progress"] == 62
    assert observation["source"] == "MOCKED_DRONE"
    
    # 3. Gap Detection
    analyzer = ProgressAnalyzer()
    analysis = analyzer.analyze(expected_progress, observation)
    
    assert analysis["status"] == "DELAY_DETECTED"
    assert analysis["progress_gap"] == 18
    assert "Material delivery delayed" in analysis["root_causes"]
    
    # 4. Generate AI Recovery Scenarios
    generator = ScenarioGenerator()
    scenarios = generator.generate_scenarios(analysis)
    
    assert len(scenarios) == 3
    assert scenarios[0]["id"] == "SCENARIO_A"
    
    # 5. Enforce Governance: AI attempts automatic update (MUST FAIL)
    updater = ScheduleUpdater()
    with pytest.raises(GovernanceViolationException):
        updater.apply_scenario(scenarios[0], approved_by_human=False)
        
    # 6. PM Approves Scenario
    update_result = updater.apply_scenario(scenarios[0], approved_by_human=True)
    
    assert update_result["status"] == "PRODUCTION_UPDATED"
    assert update_result["applied_scenario"] == "SCENARIO_A"
    
    # 7. Digital Thread Updated
    thread.add_node("Level 3 Structure", "SITE_INTELLIGENCE_RECOVERY", update_result)
    
    final_thread = thread.get_thread("Level 3 Structure")
    assert len(final_thread) == 1
    assert final_thread[0].stage == "SITE_INTELLIGENCE_RECOVERY"
