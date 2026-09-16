from app.knowledge.standards import AecStandardsRegistry, CompliancePrecheckEngine
from app.knowledge.rules import SemanticElement

def test_rule_global_aec_knowledge_compliance():
    """
    Tests semantic awareness of a BIM element against configured mock standards.
    """
    registry = AecStandardsRegistry()
    engine = CompliancePrecheckEngine(registry)
    
    # 1. Select a Semantic Element (e.g. from 3D viewer)
    wall = SemanticElement("Wall #A-1042", {"stc_rating": 55, "material": "Gypsum"})
    
    # 2. Check Compliance
    results = wall.check_compliance(engine)
    
    # 3. Verify No Fabrication & Semantic Traceability
    assert "TEST_CODE_2026" in results
    result = results["TEST_CODE_2026"]
    
    assert result["status"] == "PASS"
    assert result["standard_evaluated"] == "Mock Acoustic Standard"
    assert "NOT A LEGAL CERTIFICATION" in result["disclaimer"] # Ensure No Claim of Legal Compliance

def test_rule_no_fabrication_compliance_fail():
    """
    Tests that a failing element correctly fails the compliance check.
    """
    registry = AecStandardsRegistry()
    engine = CompliancePrecheckEngine(registry)
    
    # Element with failing STC rating
    wall = SemanticElement("Wall #B-999", {"stc_rating": 30, "material": "Glass"})
    results = wall.check_compliance(engine)
    
    result = results["TEST_CODE_2026"]
    assert result["status"] == "FAIL"
