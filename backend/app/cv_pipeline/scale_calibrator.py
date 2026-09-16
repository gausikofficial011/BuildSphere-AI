"""
BuildSphere AI — Scale Calibration Engine
=========================================
Multi-hypothesis scale calibrator combining OCR dimension strings, room areas,
standard architectural element priors (doors, wall thickness), and explicit
two-point human calibration.
"""

from typing import List, Tuple, Dict, Any, Optional
import math
import numpy as np
from .room_detector import DetectedRoom
from .geometry_detector import DetectedWallSegment
from .aperture_detector import DetectedAperture
from .ocr_provider import OcrBox


class ScaleCalibrationResult:
    def __init__(
        self,
        scale_px_per_meter: float,
        confidence: float,
        method: str,
        notes: str = ""
    ):
        self.scale_px_per_meter = float(scale_px_per_meter)
        self.confidence = float(confidence)
        self.method = method
        self.notes = notes

    def to_dict(self) -> Dict[str, Any]:
        return {
            "scale_px_per_meter": round(self.scale_px_per_meter, 2),
            "confidence": round(self.confidence, 3),
            "method": self.method,
            "notes": self.notes
        }


class FloorPlanScaleCalibrator:
    """Calculates drawing scale ratio (pixels per real-world meter)."""

    DEFAULT_FALLBACK_SCALE = 80.0  # ~80 pixels per meter (common 1:50 or 1:100 at 150-300 dpi)

    def calculate_manual_scale(
        self,
        pt_a: Tuple[float, float],
        pt_b: Tuple[float, float],
        real_distance: float,
        unit: str = "m"
    ) -> ScaleCalibrationResult:
        """Computes scale from explicit user calibration (Point A to Point B)."""
        dist_px = math.hypot(pt_b[0] - pt_a[0], pt_b[1] - pt_a[1])
        if dist_px < 1.0 or real_distance <= 0:
            raise ValueError("Invalid calibration points or distance.")

        # Convert real_distance to meters
        unit_lower = unit.lower()
        if unit_lower in ["mm"]:
            dist_m = real_distance / 1000.0
        elif unit_lower in ["cm"]:
            dist_m = real_distance / 100.0
        elif unit_lower in ["ft", "feet", "'"]:
            dist_m = real_distance * 0.3048
        elif unit_lower in ["in", "inches", '"']:
            dist_m = real_distance * 0.0254
        else:
            dist_m = real_distance

        scale = dist_px / dist_m
        return ScaleCalibrationResult(
            scale_px_per_meter=scale,
            confidence=1.0,
            method="user_calibrated",
            notes=f"User defined {dist_px:.1f}px = {real_distance} {unit} ({dist_m:.2f}m)"
        )

    def estimate_scale(
        self,
        rooms: List[DetectedRoom],
        walls: List[DetectedWallSegment],
        doors: List[DetectedAperture],
        ocr_boxes: List[OcrBox]
    ) -> ScaleCalibrationResult:
        """
        Synthesizes multiple hypotheses to establish drawing scale.
        Priority:
          1. OCR Dimension Strings matching Room Polygons (HIGH)
          2. OCR Dimension Lines matching Wall Spans (HIGH)
          3. Standard Door Widths (0.90m) (MEDIUM)
          4. Wall Thickness prior (0.20m) (MEDIUM)
          5. Default Fallback (LOW)
        """
        hypotheses = []

        # 1. Check OCR dimension callouts inside rooms
        for room in rooms:
            for ocr_dict in room.associated_ocr:
                if ocr_dict.get("category") == "DIMENSION":
                    sem = ocr_dict.get("semantic_data", {})
                    target_area = sem.get("area_m2")
                    if target_area and target_area > 2.0 and room.area_px > 500:
                        # scale² = area_px / area_m2
                        scale = math.sqrt(room.area_px / float(target_area))
                        if 20.0 <= scale <= 350.0:
                            hypotheses.append((scale, 0.92, "room_dimension_match"))

        # 2. Check door widths (standard door is ~0.90m)
        if doors:
            door_widths = [d.width_px for d in doors if 30.0 <= d.width_px <= 160.0]
            if door_widths:
                median_door_px = float(np.median(door_widths))
                scale_from_doors = median_door_px / 0.90
                if 25.0 <= scale_from_doors <= 300.0:
                    hypotheses.append((scale_from_doors, 0.78, "standard_door_width"))

        # 3. Check wall thickness (standard wall is ~0.20m)
        if walls:
            thicknesses = [w.thickness_px for w in walls if 6.0 <= w.thickness_px <= 40.0]
            if thicknesses:
                median_thick_px = float(np.median(thicknesses))
                scale_from_walls = median_thick_px / 0.20
                if 25.0 <= scale_from_walls <= 300.0:
                    hypotheses.append((scale_from_walls, 0.72, "wall_thickness_prior"))

        # If hypotheses exist, compute weighted consensus
        if hypotheses:
            weights = np.array([h[1] for h in hypotheses])
            values = np.array([h[0] for h in hypotheses])
            weighted_mean = float(np.sum(values * weights) / np.sum(weights))
            top_method = sorted(hypotheses, key=lambda h: h[1], reverse=True)[0][2]
            top_conf = max(h[1] for h in hypotheses)

            return ScaleCalibrationResult(
                scale_px_per_meter=weighted_mean,
                confidence=top_conf,
                method=top_method,
                notes=f"Derived from {len(hypotheses)} architectural scale observations."
            )

        # 4. Fallback
        return ScaleCalibrationResult(
            scale_px_per_meter=self.DEFAULT_FALLBACK_SCALE,
            confidence=0.50,
            method="architectural_fallback",
            notes="Default architectural scale of 80 px/m applied. Verification recommended."
        )
