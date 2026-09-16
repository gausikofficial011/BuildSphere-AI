from app.cityscale.spatial import SpatialWorldEngine
from app.cityscale.campus import MultiBuildingEngine, CampusDigitalTwin
from app.cityscale.infrastructure import InfrastructureGraph
from app.cityscale.masterplan import AECMasterPlanningEngine, SiteLogisticsEngine

def test_rule_cityscale_end_to_end_demo():
    """
    Simulates: BIM-GIS fusion -> Infrastructure Graph dependency -> 
    Failure propagation -> Federated Twin query -> Masterplan generation.
    """
    spatial = SpatialWorldEngine()
    campus = MultiBuildingEngine()
    infra = InfrastructureGraph()
    masterplan = AECMasterPlanningEngine()
    logistics = SiteLogisticsEngine()
    
    # 1. Spatial GIS Fusion (Rule 7, Rule 12)
    spatial.ingest_terrain(40.7128, -74.0060, 10.0)
    fusion_result = spatial.fusion_engine.fuse_building_to_site("B1", 100, 200)
    assert fusion_result["status"] == "FUSED_TO_GIS_WORLD"
    
    # 2. Campus Digital Twin Federation (Rule 143)
    twin1 = CampusDigitalTwin("campus_north")
    twin1.add_building("B1")
    twin1.add_building("B2")
    campus.federation.register_twin(twin1)
    
    query_results = campus.federation.federated_query("count buildings")
    assert "Campus campus_north has 2 buildings." in query_results[0]
    
    # 3. Infrastructure Graph Dependency (Rule 23, 26)
    substation = infra.add_node("sub_01", "SUBSTATION")
    b1_node = infra.add_node("B1", "BUILDING")
    infra.add_dependency("B1", "sub_01")
    
    # Simulate substation failure
    impacted = infra.propagate_failure("sub_01")
    assert "B1" in impacted
    assert infra.nodes["B1"].state == "DEGRADED"
    
    # 4. Master Planning Candidate Generation (Rule 105, 110)
    candidates = masterplan.generate_candidate_layouts("site_01", {"buildings": 3})
    assert len(candidates) >= 2
    assert candidates[0]["status"] == "CANDIDATE_ONLY"
    
    # 5. Site Logistics Conflict (Rule 125)
    conflicts = logistics.detect_conflicts(["project_A", "project_B"])
    assert "SHARED_ACCESS_ROAD_CONTENTION" in conflicts
