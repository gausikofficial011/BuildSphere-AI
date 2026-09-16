import pytest
from app.interop.gis import GISAdapter
from app.interop.bcf import BCFAdapter
from app.sdk.client import BuildSphereSDK
from app.sdk.webhooks import WebhookDispatcher

def test_sdk_authentication():
    """Verify Developer SDK enforces authentication boundaries."""
    # Valid key
    sdk = BuildSphereSDK("VALID_TEST_KEY")
    result = sdk.get_project_status("proj_123")
    assert result["status"] == "In Progress"
    
    # Invalid key
    bad_sdk = BuildSphereSDK("BAD_KEY")
    with pytest.raises(Exception, match="SDK_AUTH_FAILED"):
        bad_sdk.get_project_status("proj_123")

def test_bcf_interoperability():
    """Verify BCF parsing maps correctly to the Phase 7 Issue format."""
    mock_bcf = {
        "topic": {
            "title": "HVAC Clash with Beam",
            "topic_status": "Open",
            "topic_type": "Clash",
            "creation_author": "External_BIM_Coordinator"
        }
    }
    
    normalized_issue = BCFAdapter.parse_bcf_to_issue(mock_bcf)
    
    assert normalized_issue["title"] == "HVAC Clash with Beam"
    assert normalized_issue["status"] == "OPEN"
    assert normalized_issue["source"] == "BCF_IMPORT"

def test_webhook_event_dispatcher():
    """Verify Webhooks dispatch Phase 6/7 core events to registered URLs."""
    dispatcher = WebhookDispatcher()
    
    dispatcher.register_webhook("CLASH_DETECTED", "https://external-erp.com/webhook")
    
    # Simulate a clash detected by the Phase 6 ClashEngine
    dispatcher.trigger_event("CLASH_DETECTED", {"clash_id": "c_1", "severity": "HIGH"})
    
    assert len(dispatcher.dispatched_events) == 1
    assert dispatcher.dispatched_events[0]["url"] == "https://external-erp.com/webhook"
    assert dispatcher.dispatched_events[0]["payload"]["clash_id"] == "c_1"

def test_gis_coordinate_mapping():
    """Verify the GIS interface correctly abstracts global to local mapping."""
    # Project origin in London
    gis = GISAdapter(project_lat=51.5074, project_lon=-0.1278)
    
    # Point slightly north/east
    local_coords = gis.gis_to_local(lat=51.5084, lon=-0.1268)
    
    # Coordinates should be converted to meters (approx x > 0, y > 0)
    assert local_coords[0] > 0
    assert local_coords[1] > 0
    assert local_coords[2] == 0.0
