import pytest
from app.site_intelligence.perception import SiteObservationEngine, ProgressAnalyzer
from app.decision_intelligence.optimizer import MultiObjectiveOptimizer, ScenarioEvaluator
from app.decision_intelligence.explanation import TradeoffExplainer
from app.orchestration.delivery import GovernanceViolationException

def test_rule_ai_decision_intelligence():
    """Phase 25 E2E Demo: From Site Delay to AI Optimization & Human Approval."""
    
    # 1. Observe (Phase 24 Mock)
    observer = SiteObservationEngine()
    analyzer = ProgressAnalyzer()
    
    observation = observer.get_observation(target_area="Level 4 Structure")
    gap = analyzer.analyze(expected_progress=100, observation=observation)
    
    # 2. Understand & Predict
    assert gap["status"] == "DELAY_DETECTED"
    delay_days = 11 # As per demo
    root_cause_chain = ["Material Delay", "Crane Downtime", "Inspection Backlog", "Level 4 Delay", "MEP Delay"]
    
    # 3. Simulate & Optimize (Phase 25)
    optimizer = MultiObjectiveOptimizer()
    options = optimizer.generate_options(
        root_cause_chain=root_cause_chain, 
        current_delay_days=delay_days, 
        current_cost=1000000.0
    )
    
    assert len(options) == 4
    assert options[0]["id"] == "BASELINE"
    assert options[3]["id"] == "OPTION_C"
    
    # 4. Explain
    explainer = TradeoffExplainer()
    explanations = explainer.explain(options)
    
    assert "cascading impacts" in explanations["BASELINE"]
    assert "robotic assistance" in explanations["OPTION_C"]
    
    # 5. Execute without Governance (MUST FAIL)
    evaluator = ScenarioEvaluator()
    with pytest.raises(GovernanceViolationException, match="modify production schedule without governed approval"):
        evaluator.execute_option("OPTION_C", human_approved=False)
        
    # 6. Execute with Governance (MUST PASS)
    result = evaluator.execute_option("OPTION_C", human_approved=True)
    assert result["status"] == "EXECUTED"
    assert result["option_applied"] == "OPTION_C"
