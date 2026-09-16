import pytest
from app.platform.tenant import MultiTenantEngine
from app.collaboration.concurrency import ConcurrencyEngine
from app.collaboration.approvals import ApprovalEngine
from app.documents.engine import DocumentManagementEngine

def test_multi_tenant_security():
    """
    Rule 108: Multi-Tenant Security Test.
    Verify Organization A cannot access Organization B's data.
    """
    tenant = MultiTenantEngine()
    tenant.create_organization("org_A", "BuildCo")
    tenant.create_organization("org_B", "DesignCorp")
    
    tenant.add_user_to_org("user_A1", "org_A", "ARCHITECT")
    
    # Valid access
    assert tenant.assert_tenant_access("user_A1", "org_A") is True
    
    # Invalid access - Should raise exception
    with pytest.raises(Exception, match="AUTHORIZATION_FAILED: Tenant Isolation Violation"):
        tenant.assert_tenant_access("user_A1", "org_B")

def test_collaboration_conflict():
    """
    Rule 109: Collaboration Test (Optimistic Concurrency).
    User A and User B edit same element.
    """
    concurrency = ConcurrencyEngine()
    
    # Initial state (version 0)
    concurrency.element_versions["wall_1"] = 0
    
    # User A reads version 0, saves successfully (increments to 1)
    concurrency.write_element("wall_1", 0, "user_A")
    
    # User B read version 0 earlier, now tries to save. Must throw VERSION_CONFLICT.
    with pytest.raises(Exception, match="VERSION_CONFLICT"):
        concurrency.write_element("wall_1", 0, "user_B")

def test_approval_supersession():
    """
    Rule 110: Approval Test (Supersession).
    """
    approvals = ApprovalEngine()
    
    # Submit Design v1
    approvals.submit_for_approval("app_1", "design_A", 1, "user_A")
    
    # Modify Design to v2 BEFORE approval goes through
    approvals.update_resource("design_A", 2)
    
    # Attempt to approve app_1 (which points to v1). Must fail as SUPERSEDED.
    with pytest.raises(Exception, match="SUPERSEDED"):
        approvals.approve("app_1")
        
    assert approvals.approvals["app_1"]["status"] == "SUPERSEDED"

def test_document_ocr_mock():
    """
    Rule 32, 111: Document OCR integration mock.
    """
    docs = DocumentManagementEngine()
    docs.upload_document("doc_1", "Spec", "/tmp/spec.pdf", "user_A")
    
    doc = docs.documents["doc_1"]
    assert doc["version"] == 1
    assert "processed_via" in doc["ocr_metadata"]
    assert "client_id" in doc["ocr_metadata"] # Verifies .env ingestion
