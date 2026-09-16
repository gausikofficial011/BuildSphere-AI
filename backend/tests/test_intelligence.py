import pytest
from app.intelligence.knowledge_graph import AECKnowledgeGraph
from app.agents.orchestrator import AECAgentOrchestrator
from app.generative.engine import GenerativeDesignEngine
from app.analytics.scenarios import PredictiveScenarioEngine
from app.analytics.learning import ContinuousLearningPipeline

def test_knowledge_graph_versioning():
    """Rule 9: Never mix historical states."""
    kg = AECKnowledgeGraph()
    kg.add_node("wall_1", "Element", {"type": "LoadBearing"}, version=1)
    kg.add_node("room_1", "Room", {"name": "Kitchen"}, version=1)
    kg.add_edge("room_1", "wall_1", "BOUNDED_BY", version=1)
    
    # Update wall in version 2
    kg.add_node("wall_1", "Element", {"type": "NonLoadBearing"}, version=2)
    
    # Query version 1 relationships
    v1_rels = kg.get_related_nodes("room_1", "BOUNDED_BY", 1)
    assert len(v1_rels) == 1
    assert v1_rels[0]["properties"]["type"] == "LoadBearing"

def test_generative_pareto_frontier():
    """Rule 20 & 23: Hard constraints and Pareto Optimality."""
    engine = GenerativeDesignEngine()
    
    # Hard constraint limits area to 500
    candidates = engine.generate_candidates({"type": "Office"})
    
    # Candidate E (area 600) should be removed by hard constraint
    assert not any(c["id"] == "E" for c in candidates)
    
    # Candidate D is strictly dominated by B (B has same area, lower cost), so D should not be in frontier
    assert not any(c["id"] == "D" for c in candidates)
    
    # A, B, C should be on the Pareto frontier
    ids = [c["id"] for c in candidates]
    assert "A" in ids
    assert "B" in ids
    assert "C" in ids

def test_agent_conflict_resolution():
    """Rule 15: Agent Conflict requires Human Resolution."""
    orchestrator = AECAgentOrchestrator()
    
    # In orchestrator, Architect wants to Expand, Structural wants to Maintain.
    result = orchestrator.run_design_review({"target": "Kitchen"})
    
    assert result["status"] == "CONFLICT"
    assert result["action_required"] == "HUMAN_APPROVAL"

def test_scenario_sandbox():
    """Rule 44: Scenarios must be isolated."""
    engine = PredictiveScenarioEngine()
    base_state = {"projected_cost_overrun": 0}
    
    result = engine.evaluate_what_if(base_state, {"material_delay_days": 10})
    
    assert result["is_authoritative"] is False
    assert result["impact"]["projected_cost_overrun"] == 50000
    # Base state must remain unaffected
    assert base_state["projected_cost_overrun"] == 0

def test_continuous_learning_guardrail():
    """Rule 102: Do not fake intelligence (block training if insufficient data)."""
    learning = ContinuousLearningPipeline()
    
    # Only 1 sample
    learning.collect_feedback("user1", "layout", "A", "B")
    
    result = learning.trigger_retraining_pipeline()
    assert result["status"] == "INSUFFICIENT_DATA"
