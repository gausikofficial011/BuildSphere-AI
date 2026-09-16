import pytest
from app.copilot.orchestrator import BuildSphereBIMCopilot
from app.digital_twin.state import BuildSphereDigitalTwin
from app.analytics.quantities import QuantityEngine
from app.copilot.responses import TrustCategory

def test_demo_clash_detection():
    """
    Rule 97, 93: End-to-End Demo - Analyze building for clashes.
    """
    design = {
        "elements": [
            {"id": "w1", "category": "Architecture", "geometry": {"x": 0, "y": 0, "w": 10, "h": 10}},
            {"id": "p1", "category": "MEP", "geometry": {"x": 5, "y": 5, "w": 2, "h": 2}} # Intersects w1
        ]
    }
    
    copilot = BuildSphereBIMCopilot(current_design=design, role="Architect")
    result = copilot.process_query("Analyze my current building and find the problems")
    
    assert result["trust_category"] == TrustCategory.CALCULATION.value
    assert len(result["data"]["clashes"]) == 1
    assert result["data"]["clashes"][0]["severity"] == "CRITICAL" # Arch vs MEP
    assert "Failed" in result["validation"]

def test_demo_layout_optimization():
    """
    Rule 98, 94: End-to-End Demo - Optimize layout.
    """
    design = {
        "elements": [
            {"id": "w1", "category": "Wall", "geometry": {"x": 0, "y": 0, "w": 100, "h": 10}}
        ]
    }
    
    copilot = BuildSphereBIMCopilot(current_design=design, role="Architect")
    result = copilot.process_query("Optimize the ground floor for better space utilization")
    
    assert result["trust_category"] == TrustCategory.CALCULATION.value
    assert result["approval_required"] is True # Rule 47
    
    candidates = result["data"]["candidates"]
    assert len(candidates) == 2
    assert result["data"]["best_candidate"]["id"] == "Candidate_A" # Maximizes area

def test_demo_role_based_security():
    """
    Rule 66, 68: End-to-End Demo - Tool Permission System.
    """
    design = {"elements": []}
    
    # Client tries to delete
    client_copilot = BuildSphereBIMCopilot(current_design=design, role="Client")
    client_result = client_copilot.process_query("Delete all walls")
    
    assert client_result["validation"] == "Rejected"
    assert "Permission Denied" in client_result["data"]["error"]
    
    # Admin tries to delete
    admin_copilot = BuildSphereBIMCopilot(current_design=design, role="Admin")
    admin_result = admin_copilot.process_query("Delete all walls")
    
    assert admin_result["validation"] == "Pass"
    
def test_digital_twin_synchronization():
    """
    Rule 100, 95: Digital Twin Synchronization.
    """
    twin = BuildSphereDigitalTwin("proj_123")
    assert twin.status == "DESIGNED"
    
    # Sync from execution
    twin.sync_from_execution([{"id": "el1"}])
    assert twin.status == "VERIFIED"
    assert twin.revit_version == "v0"
    
    # Conflict detection
    conflict = twin.check_conflict([{"id": "el1", "mod": True}])
    assert conflict is True
    assert twin.status == "CONFLICTED"
    
def test_quantity_takeoff():
    """
    Rule 26, 28: Quantity Takeoff (Deterministic)
    """
    design = [
        {"id": "w1", "category": "Wall", "geometry": {"w": 10, "h": 10}}, # 100 sqm
        {"id": "d1", "category": "Door", "geometry": {}}
    ]
    
    boq = QuantityEngine.generate_boq(design)
    assert len(boq["architectural"]) == 2
    assert boq["total_estimated_cost"] == (100 * 150.0) + 500.0 # 15000 + 500
