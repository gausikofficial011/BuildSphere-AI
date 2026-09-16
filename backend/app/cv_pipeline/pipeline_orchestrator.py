"""
BuildSphere AI — Floor Plan CV & AI Pipeline Orchestrator
=========================================================
Coordinates document preprocessing, OCR, geometry extraction, apertures,
room polygons, scale calibration, topology validation, and generates the
canonical BuildingModel ready for human verification and 3D baking.
"""

from typing import Dict, Any, Optional, Callable, List
import math
import numpy as np

from .preprocessor import FloorPlanPreprocessor, PreprocessResult
from .ocr_provider import CompositeOcrPipeline, OcrBox
from .geometry_detector import FloorPlanGeometryDetector, DetectedWallSegment
from .aperture_detector import FloorPlanApertureDetector, DetectedAperture
from .room_detector import FloorPlanRoomDetector, DetectedRoom
from .scale_calibrator import FloorPlanScaleCalibrator, ScaleCalibrationResult
from .topology_validator import TopologyValidator

from ..schema.building_model import (
    BuildingModel, Floor, Wall, WallOpening, Door, Window,
    Room, Point2D, MaterialSpec
)


class FloorPlanPipelineOrchestrator:
    """End-to-end architectural floor plan to canonical BuildingModel pipeline."""

    def __init__(self):
        self.preprocessor = FloorPlanPreprocessor()
        self.ocr_pipeline = CompositeOcrPipeline()
        self.geometry_detector = FloorPlanGeometryDetector()
        self.aperture_detector = FloorPlanApertureDetector()
        self.room_detector = FloorPlanRoomDetector()
        self.scale_calibrator = FloorPlanScaleCalibrator()
        self.topology_validator = TopologyValidator()

    def process_floor_plan(
        self,
        file_path_or_array,
        project_id: Optional[int] = None,
        building_name: str = "Architectural Building Model",
        ground_truth_labels: Optional[List[Dict[str, Any]]] = None,
        progress_callback: Optional[Callable[[str, int], None]] = None
    ) -> BuildingModel:
        """Executes full pipeline and returns canonical BuildingModel."""

        def report(stage: str, pct: int):
            if progress_callback:
                progress_callback(stage, pct)

        # ── 1. PREPROCESSING ──────────────────────────────────────────────────
        report("PREPROCESSING", 10)
        prep: PreprocessResult = self.preprocessor.process(file_path_or_array)

        # ── 2. OCR EXTRACTION ─────────────────────────────────────────────────
        report("OCR_RUNNING", 30)
        ocr_boxes: List[OcrBox] = self.ocr_pipeline.process_drawing(
            prep.rgb, prep.gray, ground_truth_labels=ground_truth_labels
        )

        # ── 3. GEOMETRY DETECTION (WALLS) ─────────────────────────────────────
        report("GEOMETRY_DETECTION", 50)
        detected_walls, mean_thick_px = self.geometry_detector.detect_walls(prep.binary)

        # ── 4. APERTURES (DOORS & WINDOWS) ────────────────────────────────────
        report("APERTURE_DETECTION", 65)
        detected_doors, detected_windows = self.aperture_detector.detect_apertures(
            prep.binary, detected_walls
        )

        # ── 5. ROOM DETECTION ─────────────────────────────────────────────────
        report("ROOM_DETECTION", 75)
        detected_rooms = self.room_detector.detect_rooms(
            prep.rgb.shape[:2], detected_walls, ocr_boxes
        )

        # ── 6. SCALE CALIBRATION ──────────────────────────────────────────────
        report("SCALE_CALIBRATION", 85)
        scale_res: ScaleCalibrationResult = self.scale_calibrator.estimate_scale(
            detected_rooms, detected_walls, detected_doors, ocr_boxes
        )
        scale_px_per_m = max(10.0, scale_res.scale_px_per_meter)

        # ── 7. BUILDING MODEL SYNTHESIS ───────────────────────────────────────
        report("BUILDING_MODEL_GENERATION", 92)
        building = self._synthesize_building_model(
            prep=prep,
            detected_walls=detected_walls,
            detected_doors=detected_doors,
            detected_windows=detected_windows,
            detected_rooms=detected_rooms,
            scale_px_per_m=scale_px_per_m,
            scale_result=scale_res,
            project_id=project_id,
            building_name=building_name
        )

        # ── 8. TOPOLOGY VALIDATION ────────────────────────────────────────────
        report("TOPOLOGY_VALIDATION", 98)
        self.topology_validator.validate_building(building)

        report("READY_FOR_REVIEW", 100)
        return building

    def _synthesize_building_model(
        self,
        prep: PreprocessResult,
        detected_walls: List[DetectedWallSegment],
        detected_doors: List[DetectedAperture],
        detected_windows: List[DetectedAperture],
        detected_rooms: List[DetectedRoom],
        scale_px_per_m: float,
        scale_result: ScaleCalibrationResult,
        project_id: Optional[int],
        building_name: str
    ) -> BuildingModel:
        """Converts detected pixel elements into metric SI BuildingModel."""
        center_x = prep.width / 2.0
        center_y = prep.height / 2.0

        def px_to_m(px: float, py: float) -> Point2D:
            # Shift origin to center of drawing so 3D model is neatly centered
            # In 3D space: X = horizontal (m), Z = depth/vertical plan (m)
            xm = (px - center_x) / scale_px_per_m
            zm = (py - center_y) / scale_px_per_m
            return Point2D(x=round(xm, 3), z=round(zm, 3))

        # Map walls
        walls: List[Wall] = []
        wall_id_map: Dict[str, str] = {}  # detected_id -> canonical_id

        for dw in detected_walls:
            sp = px_to_m(dw.start[0], dw.start[1])
            ep = px_to_m(dw.end[0], dw.end[1])
            thick_m = round(max(0.10, min(dw.thickness_px / scale_px_per_m, 0.45)), 2)

            wall_obj = Wall(
                start_point=sp,
                end_point=ep,
                thickness=thick_m,
                height=3.0,
                wall_type="exterior" if dw.wall_type == "exterior" else "interior",
                material="Reinforced Concrete" if dw.wall_type == "exterior" else "AAC Concrete Block",
                confidence=dw.confidence,
                source="ai_detected"
            )
            walls.append(wall_obj)
            wall_id_map[dw.id] = wall_obj.id

        # Map doors and attach openings to host walls
        doors: List[Door] = []
        for dd in detected_doors:
            pos_m = px_to_m(dd.position_px[0], dd.position_px[1])
            width_m = round(max(0.75, min(dd.width_px / scale_px_per_m, 2.40)), 2)
            host_canon_id = wall_id_map.get(dd.host_wall_id)

            door_obj = Door(
                wall_id=host_canon_id,
                position=pos_m,
                width=width_m,
                height=2.10,
                rotation=round(math.radians(dd.rotation_deg), 3),
                swing_direction=dd.metadata.get("swing_direction", "left_in"),
                door_type="single_flush",
                confidence=dd.confidence,
                source="ai_detected"
            )
            doors.append(door_obj)

            # If bound to a host wall, insert WallOpening cutout
            if host_canon_id:
                for w in walls:
                    if w.id == host_canon_id:
                        offset_m = round(dd.offset_along_wall_px / scale_px_per_m, 2)
                        # Center opening around offset
                        start_offset = max(0.05, offset_m - width_m / 2.0)
                        w.openings.append(WallOpening(
                            opening_type="door",
                            ref_id=door_obj.id,
                            offset_start=start_offset,
                            width=width_m,
                            sill_height=0.0,
                            height=2.10
                        ))
                        break

        # Map windows and attach openings to host walls
        windows: List[Window] = []
        for dw in detected_windows:
            pos_m = px_to_m(dw.position_px[0], dw.position_px[1])
            width_m = round(max(0.80, min(dw.width_px / scale_px_per_m, 3.20)), 2)
            host_canon_id = wall_id_map.get(dw.host_wall_id)

            win_obj = Window(
                wall_id=host_canon_id,
                position=pos_m,
                width=width_m,
                height=1.40,
                sill_height=0.90,
                window_type="casement",
                confidence=dw.confidence,
                source="ai_detected"
            )
            windows.append(win_obj)

            # Insert window cutout into wall
            if host_canon_id:
                for w in walls:
                    if w.id == host_canon_id:
                        offset_m = round(dw.offset_along_wall_px / scale_px_per_m, 2)
                        start_offset = max(0.05, offset_m - width_m / 2.0)
                        w.openings.append(WallOpening(
                            opening_type="window",
                            ref_id=win_obj.id,
                            offset_start=start_offset,
                            width=width_m,
                            sill_height=0.90,
                            height=1.40
                        ))
                        break

        # Map rooms
        rooms: List[Room] = []
        for dr in detected_rooms:
            metric_poly = [px_to_m(pt[0], pt[1]) for pt in dr.polygon_px]
            room_obj = Room(
                name=dr.name,
                room_type=dr.room_type,
                polygon=metric_poly,
                confidence=dr.confidence,
                source="ai_detected"
            )
            room_obj.compute_polygon_metrics()
            rooms.append(room_obj)

        # Ground Floor
        ground_floor = Floor(
            level=0,
            name="Ground Floor",
            elevation=0.0,
            height=3.0,
            slab_thickness=0.15,
            walls=walls,
            rooms=rooms,
            doors=doors,
            windows=windows,
            stairs=[]
        )

        # Standard materials dictionary
        materials = {
            "mat_concrete": MaterialSpec(
                id="mat_concrete",
                category="Concrete",
                name="Ready-Mix Concrete M25",
                density_kg_m3=2400.0,
                unit_cost_usd=115.0,
                unit_cost_type="m3",
                carbon_intensity_kg_co2e=230.0
            ),
            "mat_aac_block": MaterialSpec(
                id="mat_aac_block",
                category="Wall",
                name="Autoclaved Aerated Concrete Blocks",
                density_kg_m3=650.0,
                unit_cost_usd=65.0,
                unit_cost_type="m3",
                carbon_intensity_kg_co2e=90.0
            ),
            "mat_glass": MaterialSpec(
                id="mat_glass",
                category="Glass",
                name="Double Glazed Low-E Glass",
                density_kg_m3=2500.0,
                unit_cost_usd=85.0,
                unit_cost_type="m2",
                carbon_intensity_kg_co2e=45.0
            ),
            "mat_tile": MaterialSpec(
                id="mat_tile",
                category="Tile",
                name="Vitrified Floor Tiles 600x600mm",
                density_kg_m3=2000.0,
                unit_cost_usd=28.0,
                unit_cost_type="m2",
                carbon_intensity_kg_co2e=22.0
            )
        }

        metadata = {
            "drawing_dimensions_px": [prep.width, prep.height],
            "skew_angle_deg": prep.skew_angle,
            "scale_calibration": scale_result.to_dict()
        }

        building = BuildingModel(
            project_id=project_id,
            name=building_name,
            units="m",
            scale_px_per_meter=scale_px_per_m,
            floors=[ground_floor],
            materials=materials,
            metadata=metadata
        )

        return building
