import pytest
from app.orchestration.thread import DigitalThreadEngine
from app.orchestration.delivery import AecDeliveryOrchestrator, GovernanceViolationException

def test_rule_digital_thread_lifecycle():
    """
    Simulates the tracking of a single BIM element (Wall #A-1042)
    across the entire Phase 1-20 lifecycle.
    """
    engine = DigitalThreadEngine()
    element_id = "Wall #A-1042"
    
    # 1. Planning (Owner requirement)
    engine.add_node(element_id, "REQUIREMENT", {"spec": "Acoustic rating STC-50"})
    
    # 2. Design (Revit)
    engine.add_node(element_id, "REVIT_ELEMENT", {"family": "Basic Wall", "type": "Interior - 138mm Partition"})
    
    # 3. Dynamo
    engine.add_node(element_id, "DYNAMO_OPERATION", {"script": "Align_To_Grid.dyn", "result": "Success"})
    
    # 4. Quantity/Cost
    engine.add_node(element_id, "BOQ_ITEM", {"volume_m3": 12.5, "material": "Gypsum"})
    engine.add_node(element_id, "COST", {"amount": 540.00, "status": "SIMULATED_MOCK"})
    
    # 5. Procurement
    engine.add_node(element_id, "PROCUREMENT", {"vendor": "Mock_Materials_Inc", "status": "ORDERED"})
    
    # 6. Construction & QA
    engine.add_node(element_id, "CONSTRUCTION", {"status": "INSTALLED"})
    engine.add_node(element_id, "INSPECTION", {"status": "PASSED", "inspector": "AI_Vision_System"})
    
    # 7. Handover & Operations
    engine.add_node(element_id, "AS_BUILT", {"lod": 500})
    engine.add_node(element_id, "FACILITY_ASSET", {"asset_tag": "WALL-001"})
    
    # Verify the thread is fully intact and chronologically ordered
    thread = engine.get_thread(element_id)
    assert len(thread) == 10
    assert thread[0].stage == "REQUIREMENT"
    assert thread[-1].stage == "FACILITY_ASSET"


def test_rule_ai_governance_restrictions():
    """
    Verifies that AI agents cannot execute forbidden actions.
    """
    orchestrator = AecDeliveryOrchestrator()
    agent_name = "CostAgent_v1"
    
    with pytest.raises(GovernanceViolationException, match="sign a contract"):
        orchestrator.sign_contract(agent_name, {"doc": "subcontractor_agreement.pdf"})
        
    with pytest.raises(GovernanceViolationException, match="approve payment"):
        orchestrator.approve_payment(agent_name, {"invoice_id": "INV-999"})
        
    with pytest.raises(GovernanceViolationException, match="certify engineering"):
        orchestrator.certify_engineering(agent_name, {"sheet": "A101"})
        
    with pytest.raises(GovernanceViolationException, match="certify safety"):
        orchestrator.certify_safety(agent_name, {"form": "daily_safety_log"})
        
    with pytest.raises(GovernanceViolationException, match="control critical infrastructure"):
        orchestrator.control_critical_infrastructure(agent_name, {"device": "main_breaker", "action": "TRIP"})
