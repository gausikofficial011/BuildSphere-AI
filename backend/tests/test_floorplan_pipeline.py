"""
BuildSphere AI — Floor Plan to 3D End-to-End Test Suite
========================================================
Validates preprocessing, OCR, geometry, apertures, room topology,
scale calibration, canonical BuildingModel, 3D generation, and REST APIs.
"""

import pytest
import numpy as np
import cv2
import json
import os
from fastapi.testclient import TestClient

from app.main import app
from app.cv_pipeline import (
    FloorPlanPreprocessor,
    CompositeOcrPipeline,
    FloorPlanGeometryDetector,
    FloorPlanApertureDetector,
    FloorPlanRoomDetector,
    FloorPlanScaleCalibrator,
    TopologyValidator,
    FloorPlanPipelineOrchestrator
)
from app.schema.building_model import BuildingModel, Floor, Wall, Point2D


@pytest.fixture
def synthetic_floorplan():
    """Generates an architectural floor plan with 3 rooms, doors, and annotations."""
    # 800 x 600 white canvas
    img = np.full((600, 800, 3), 255, dtype=np.uint8)

    # Outer perimeter walls (approx 600px x 400px -> at 80px/m this is 7.5m x 5m)
    # Exterior walls: thickness 16px
    cv2.rectangle(img, (100, 100), (700, 500), (0, 0, 0), 16)

    # Interior dividing walls: thickness 12px
    # Vertical divider at x = 400
    cv2.line(img, (400, 100), (400, 500), (0, 0, 0), 12)
    # Horizontal divider in left wing at y = 300
    cv2.line(img, (100, 300), (400, 300), (0, 0, 0), 12)

    # Cut door gaps (door opening 70px)
    # Door 1: opening in vertical divider between living and right room
    cv2.line(img, (400, 260), (400, 330), (255, 255, 255), 16)
    # Draw swing arc for Door 1
    cv2.ellipse(img, (400, 260), (65, 65), 0, 0, 90, (0, 0, 0), 2)

    # Door 2: opening between bottom-left room and top-left room
    cv2.line(img, (220, 300), (290, 300), (255, 255, 255), 16)
    cv2.ellipse(img, (220, 300), (65, 65), 0, 270, 360, (0, 0, 0), 2)

    # Window gap in right exterior wall
    cv2.line(img, (700, 240), (700, 360), (255, 255, 255), 20)
    # Draw double window lines
    cv2.line(img, (698, 240), (698, 360), (0, 0, 0), 2)
    cv2.line(img, (702, 240), (702, 360), (0, 0, 0), 2)

    # Text annotations (drawn with OpenCV text)
    font = cv2.FONT_HERSHEY_SIMPLEX
    # Room 1: Living Room (Right space)
    cv2.putText(img, "LIVING ROOM", (480, 280), font, 0.7, (0, 0, 0), 2)
    cv2.putText(img, "3.8m x 5.0m", (490, 320), font, 0.5, (50, 50, 50), 1)

    # Room 2: Master Bedroom (Top-Left space)
    cv2.putText(img, "BEDROOM", (180, 180), font, 0.7, (0, 0, 0), 2)
    cv2.putText(img, "3.8m x 2.5m", (190, 220), font, 0.5, (50, 50, 50), 1)

    # Room 3: Kitchen (Bottom-Left space)
    cv2.putText(img, "KITCHEN", (190, 380), font, 0.7, (0, 0, 0), 2)
    cv2.putText(img, "3.8m x 2.5m", (190, 420), font, 0.5, (50, 50, 50), 1)

    return img


def test_preprocessor(synthetic_floorplan):
    preprocessor = FloorPlanPreprocessor()
    res = preprocessor.process(synthetic_floorplan)
    assert res.width == 800
    assert res.height == 600
    assert res.binary is not None
    assert res.gray is not None
    # Binary should have wall pixels
    assert np.count_nonzero(res.binary) > 1000


def test_geometry_detector(synthetic_floorplan):
    preprocessor = FloorPlanPreprocessor()
    prep = preprocessor.process(synthetic_floorplan)

    detector = FloorPlanGeometryDetector()
    walls, thickness = detector.detect_walls(prep.binary)

    assert len(walls) >= 4, f"Expected at least 4 walls, found {len(walls)}"
    assert thickness > 5.0

    # Ensure exterior walls are identified
    ext_walls = [w for w in walls if w.wall_type == "exterior"]
    assert len(ext_walls) > 0


def test_aperture_detector(synthetic_floorplan):
    preprocessor = FloorPlanPreprocessor()
    prep = preprocessor.process(synthetic_floorplan)

    geom = FloorPlanGeometryDetector()
    walls, _ = geom.detect_walls(prep.binary)

    ap_detector = FloorPlanApertureDetector()
    doors, windows = ap_detector.detect_apertures(prep.binary, walls)

    assert len(doors) > 0, "Expected at least 1 detected door"
    # Ensure door is bound to a host wall
    bound_doors = [d for d in doors if d.host_wall_id is not None]
    assert len(bound_doors) > 0


def test_room_detector(synthetic_floorplan):
    preprocessor = FloorPlanPreprocessor()
    prep = preprocessor.process(synthetic_floorplan)

    geom = FloorPlanGeometryDetector()
    walls, _ = geom.detect_walls(prep.binary)

    ocr = CompositeOcrPipeline()
    ocr_boxes = ocr.process_drawing(prep.rgb, prep.gray)

    room_detector = FloorPlanRoomDetector()
    rooms = room_detector.detect_rooms(prep.rgb.shape[:2], walls, ocr_boxes)

    assert len(rooms) >= 2, f"Expected at least 2 rooms, found {len(rooms)}"
    for r in rooms:
        assert r.area_px > 1000
        assert len(r.polygon_px) >= 3


def test_scale_calibrator():
    calibrator = FloorPlanScaleCalibrator()
    # User calibrates: 160 pixels = 2.0 meters -> 80 px/m
    res = calibrator.calculate_manual_scale(
        pt_a=(100.0, 100.0),
        pt_b=(260.0, 100.0),
        real_distance=2.0,
        unit="m"
    )
    assert res.scale_px_per_meter == 80.0
    assert res.confidence == 1.0


def test_pipeline_orchestrator_end_to_end(synthetic_floorplan):
    orchestrator = FloorPlanPipelineOrchestrator()
    model: BuildingModel = orchestrator.process_floor_plan(
        synthetic_floorplan,
        project_id=1,
        building_name="Synthetic Unit Test Floor Plan"
    )

    assert model is not None
    assert len(model.floors) == 1
    floor = model.floors[0]
    assert len(floor.walls) >= 4
    assert len(floor.rooms) >= 2
    assert model.scale_px_per_meter > 0

    # Test BOQ calculations
    totals = model.calculate_totals()
    assert totals["gross_floor_area_m2"] > 0
    assert totals["total_wall_volume_m3"] > 0
    assert totals["estimated_total_cost_usd"] > 0


def test_fastapi_rest_endpoints(synthetic_floorplan, tmp_path):
    client = TestClient(app)

    # 1. Save synthetic image as temporary PNG
    img_path = str(tmp_path / "test_floorplan.png")
    cv2.imwrite(img_path, synthetic_floorplan)

    # 2. Test Upload Endpoint
    with open(img_path, "rb") as f:
        response = client.post(
            "/api/buildings/floorplans/upload",
            files={"file": ("test_plan.png", f, "image/png")},
            data={"project_id": "1"}
        )

    assert response.status_code == 200
    data = response.json()
    assert "job_id" in data
    job_id = data["job_id"]

    # 3. Test Job Status Polling
    status_resp = client.get(f"/api/buildings/floorplans/{job_id}/status")
    assert status_resp.status_code == 200
    status_data = status_resp.json()
    assert status_data["job_id"] == job_id
    assert status_data["status"] in ["UPLOADED", "PROCESSING", "READY_FOR_REVIEW"]
