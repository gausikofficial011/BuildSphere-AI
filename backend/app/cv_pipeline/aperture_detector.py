"""
BuildSphere AI — Aperture (Door & Window) Detector
==================================================
Detects architectural door swing arcs, wall gaps, and multi-line window symbols.
Crucially binds apertures to host walls and calculates normalized cutouts so the
3D wall generator can construct true physical openings.
"""

from typing import List, Tuple, Dict, Any, Optional
import math
import numpy as np
import cv2
from .geometry_detector import DetectedWallSegment


class DetectedAperture:
    """Represents a detected door or window aperture."""

    def __init__(
        self,
        id_str: str,
        aperture_type: str,  # 'door' | 'window'
        position_px: Tuple[float, float],
        width_px: float,
        host_wall_id: Optional[str] = None,
        offset_along_wall_px: float = 0.0,
        rotation_deg: float = 0.0,
        sub_type: str = "standard",
        confidence: float = 0.88,
        metadata: Optional[Dict[str, Any]] = None
    ):
        self.id = id_str
        self.aperture_type = aperture_type
        self.position_px = position_px
        self.width_px = width_px
        self.host_wall_id = host_wall_id
        self.offset_along_wall_px = offset_along_wall_px
        self.rotation_deg = rotation_deg
        self.sub_type = sub_type
        self.confidence = confidence
        self.metadata = metadata or {}


class FloorPlanApertureDetector:
    """Detects doors and windows, and binds them to host walls."""

    def __init__(
        self,
        min_door_width_px: float = 40.0,
        max_door_width_px: float = 140.0,
        min_window_width_px: float = 50.0,
        max_window_width_px: float = 240.0
    ):
        self.min_door_width_px = min_door_width_px
        self.max_door_width_px = max_door_width_px
        self.min_window_width_px = min_window_width_px
        self.max_window_width_px = max_window_width_px

    def detect_door_arcs(
        self,
        binary: np.ndarray,
        walls: List[DetectedWallSegment]
    ) -> List[DetectedAperture]:
        """
        Detects quarter-circle door swing arcs in non-wall drawing elements.
        """
        doors = []

        # Mask out walls to isolate thin symbol lines and swing arcs
        wall_mask = np.zeros_like(binary)
        for w in walls:
            pt1 = (int(w.start[0]), int(w.start[1]))
            pt2 = (int(w.end[0]), int(w.end[1]))
            thick = int(max(4, w.thickness_px + 4))
            cv2.line(wall_mask, pt1, pt2, 255, thick)

        symbols_bin = cv2.subtract(binary, wall_mask)

        # Detect contours of door swing arcs
        contours, _ = cv2.findContours(symbols_bin, cv2.RETR_LIST, cv2.CHAIN_APPROX_NONE)

        for i, cnt in enumerate(contours):
            if len(cnt) < 25:
                continue

            # Check if contour resembles an elliptical / circular arc
            area = cv2.contourArea(cnt)
            arc_len = cv2.arcLength(cnt, False)

            if arc_len > 40:
                rect = cv2.minAreaRect(cnt)
                (cx, cy), (rw, rh), rot = rect
                max_side = max(rw, rh)
                min_side = min(rw, rh)

                # Door arcs are roughly square in bounding box (radius R by R)
                if (
                    self.min_door_width_px <= max_side <= self.max_door_width_px
                    and (min_side / float(max_side) > 0.45)
                ):
                    # Check proximity to any wall
                    host_wall, proj, offset, dist = self._find_host_wall((cx, cy), walls)
                    if host_wall and dist < host_wall.thickness_px * 2.5:
                        doors.append(DetectedAperture(
                            id_str=f"door_arc_{len(doors)}",
                            aperture_type="door",
                            position_px=proj,
                            width_px=max_side,
                            host_wall_id=host_wall.id,
                            offset_along_wall_px=offset,
                            rotation_deg=rot,
                            sub_type="single_flush",
                            confidence=0.92,
                            metadata={"swing_direction": "left_in", "detected_by": "arc"}
                        ))

        return doors

    def detect_wall_gaps(
        self,
        walls: List[DetectedWallSegment]
    ) -> Tuple[List[DetectedAperture], List[DetectedAperture]]:
        """
        Detects collinear wall gaps where openings (doors or windows) occur.
        """
        doors = []
        windows = []

        # Group collinear walls
        for i in range(len(walls)):
            w1 = walls[i]
            for j in range(i + 1, len(walls)):
                w2 = walls[j]

                # Check if collinear and parallel
                is_horiz = abs(w1.start[1] - w1.end[1]) < 5 and abs(w2.start[1] - w2.end[1]) < 5
                is_vert = abs(w1.start[0] - w1.end[0]) < 5 and abs(w2.start[0] - w2.end[0]) < 5

                if is_horiz and abs(w1.start[1] - w2.start[1]) < 10:
                    # Check gap along X
                    x_span1 = (min(w1.start[0], w1.end[0]), max(w1.start[0], w1.end[0]))
                    x_span2 = (min(w2.start[0], w2.end[0]), max(w2.start[0], w2.end[0]))

                    left_wall, right_wall = (w1, w2) if x_span1[1] < x_span2[0] else (w2, w1)
                    left_max = max(left_wall.start[0], left_wall.end[0])
                    right_min = min(right_wall.start[0], right_wall.end[0])
                    gap = right_min - left_max

                    if self.min_door_width_px <= gap <= self.max_window_width_px:
                        gap_center = ((left_max + right_min) / 2.0, left_wall.start[1])
                        # If exterior, prefer window; if interior, prefer door
                        if left_wall.wall_type == "exterior" and gap > self.min_window_width_px:
                            windows.append(DetectedAperture(
                                id_str=f"win_gap_{len(windows)}",
                                aperture_type="window",
                                position_px=gap_center,
                                width_px=gap,
                                host_wall_id=left_wall.id,
                                sub_type="casement",
                                confidence=0.86,
                                metadata={"detected_by": "gap"}
                            ))
                        else:
                            doors.append(DetectedAperture(
                                id_str=f"door_gap_{len(doors)}",
                                aperture_type="door",
                                position_px=gap_center,
                                width_px=gap,
                                host_wall_id=left_wall.id,
                                sub_type="single_flush",
                                confidence=0.89,
                                metadata={"detected_by": "gap"}
                            ))

                elif is_vert and abs(w1.start[0] - w2.start[0]) < 10:
                    y_span1 = (min(w1.start[1], w1.end[1]), max(w1.start[1], w1.end[1]))
                    y_span2 = (min(w2.start[1], w2.end[1]), max(w2.start[1], w2.end[1]))

                    top_wall, bot_wall = (w1, w2) if y_span1[1] < y_span2[0] else (w2, w1)
                    top_max = max(top_wall.start[1], top_wall.end[1])
                    bot_min = min(bot_wall.start[1], bot_wall.end[1])
                    gap = bot_min - top_max

                    if self.min_door_width_px <= gap <= self.max_window_width_px:
                        gap_center = (top_wall.start[0], (top_max + bot_min) / 2.0)
                        if top_wall.wall_type == "exterior" and gap > self.min_window_width_px:
                            windows.append(DetectedAperture(
                                id_str=f"win_gap_{len(windows)}",
                                aperture_type="window",
                                position_px=gap_center,
                                width_px=gap,
                                host_wall_id=top_wall.id,
                                sub_type="casement",
                                confidence=0.86,
                                metadata={"detected_by": "gap"}
                            ))
                        else:
                            doors.append(DetectedAperture(
                                id_str=f"door_gap_{len(doors)}",
                                aperture_type="door",
                                position_px=gap_center,
                                width_px=gap,
                                host_wall_id=top_wall.id,
                                sub_type="single_flush",
                                confidence=0.89,
                                metadata={"detected_by": "gap"}
                            ))

        return doors, windows

    def detect_apertures(
        self,
        binary: np.ndarray,
        walls: List[DetectedWallSegment]
    ) -> Tuple[List[DetectedAperture], List[DetectedAperture]]:
        """Main detection method for doors and windows."""
        arc_doors = self.detect_door_arcs(binary, walls)
        gap_doors, gap_windows = self.detect_wall_gaps(walls)

        # Merge doors avoiding duplicate locations (< 30px)
        all_doors: List[DetectedAperture] = list(arc_doors)
        for gd in gap_doors:
            is_dup = False
            for ad in arc_doors:
                dist = math.hypot(gd.position_px[0] - ad.position_px[0], gd.position_px[1] - ad.position_px[1])
                if dist < 45.0:
                    is_dup = True
                    break
            if not is_dup:
                all_doors.append(gd)

        # If exterior walls don't have windows yet, add characteristic architectural exterior windows
        all_windows: List[DetectedAperture] = list(gap_windows)
        if len(all_windows) == 0:
            for w in walls:
                if w.wall_type == "exterior" and w.length_px > 160.0:
                    mx, my = w.midpoint
                    all_windows.append(DetectedAperture(
                        id_str=f"win_ext_{len(all_windows)}",
                        aperture_type="window",
                        position_px=(mx, my),
                        width_px=min(120.0, w.length_px * 0.4),
                        host_wall_id=w.id,
                        offset_along_wall_px=w.length_px * 0.5,
                        sub_type="casement",
                        confidence=0.85,
                        metadata={"inferred": True}
                    ))

        return all_doors, all_windows

    def _find_host_wall(
        self,
        pt: Tuple[float, float],
        walls: List[DetectedWallSegment]
    ) -> Tuple[Optional[DetectedWallSegment], Tuple[float, float], float, float]:
        """Finds the nearest host wall, its projected point, offset along wall, and distance."""
        best_wall = None
        best_proj = pt
        best_offset = 0.0
        min_dist = float("inf")

        for w in walls:
            abx = w.end[0] - w.start[0]
            aby = w.end[1] - w.start[1]
            length = math.hypot(abx, aby)
            if length == 0:
                continue

            apx = pt[0] - w.start[0]
            apy = pt[1] - w.start[1]
            t = (apx * abx + apy * aby) / (length * length)
            t_clamped = max(0.0, min(1.0, t))
            proj = (w.start[0] + t_clamped * abx, w.start[1] + t_clamped * aby)
            dist = math.hypot(pt[0] - proj[0], pt[1] - proj[1])

            if dist < min_dist:
                min_dist = dist
                best_wall = w
                best_proj = proj
                best_offset = t_clamped * length

        return best_wall, best_proj, best_offset, min_dist
