"""
BuildSphere AI — Architectural Geometry Detector
================================================
Detects horizontal, vertical, and angled walls, extracts wall centerlines and
thickness, merges collinear fragments, and snaps corners and T-junctions into
a clean topological architectural graph.
"""

from typing import List, Tuple, Dict, Any, Optional
import math
import numpy as np
import cv2


class DetectedWallSegment:
    """Intermediate geometric wall segment in pixel space before metric scaling."""

    def __init__(
        self,
        id_str: str,
        start: Tuple[float, float],
        end: Tuple[float, float],
        thickness_px: float = 16.0,
        wall_type: str = "interior",
        confidence: float = 0.95
    ):
        self.id = id_str
        self.start = (float(start[0]), float(start[1]))
        self.end = (float(end[0]), float(end[1]))
        self.thickness_px = float(thickness_px)
        self.wall_type = wall_type
        self.confidence = float(confidence)

    @property
    def length_px(self) -> float:
        dx = self.end[0] - self.start[0]
        dy = self.end[1] - self.start[1]
        return math.hypot(dx, dy)

    @property
    def angle_rad(self) -> float:
        return math.atan2(self.end[1] - self.start[1], self.end[0] - self.start[0])

    @property
    def midpoint(self) -> Tuple[float, float]:
        return (
            (self.start[0] + self.end[0]) / 2.0,
            (self.start[1] + self.end[1]) / 2.0
        )


class FloorPlanGeometryDetector:
    """Extracts clean architectural wall topology from binary drawings."""

    def __init__(
        self,
        min_wall_length_px: int = 30,
        snap_distance_px: float = 18.0,
        collinear_tolerance_deg: float = 6.0
    ):
        self.min_wall_length_px = min_wall_length_px
        self.snap_distance_px = snap_distance_px
        self.collinear_tolerance_deg = collinear_tolerance_deg

    def separate_wall_binary(self, binary: np.ndarray) -> Tuple[np.ndarray, float]:
        """
        Isolates structural wall lines and estimates mean wall thickness
        using distance transform.
        """
        # Long morphological kernels extract horizontal and vertical structural lines
        kernel_h = cv2.getStructuringElement(cv2.MORPH_RECT, (20, 2))
        kernel_v = cv2.getStructuringElement(cv2.MORPH_RECT, (2, 20))

        walls_h = cv2.morphologyEx(binary, cv2.MORPH_OPEN, kernel_h)
        walls_v = cv2.morphologyEx(binary, cv2.MORPH_OPEN, kernel_v)
        walls_binary = cv2.bitwise_or(walls_h, walls_v)

        # Close small gaps in wall joints
        close_kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (5, 5))
        walls_closed = cv2.morphologyEx(walls_binary, cv2.MORPH_CLOSE, close_kernel)

        # Estimate average wall thickness via distance transform
        dist = cv2.distanceTransform(walls_closed, cv2.DIST_L2, 5)
        non_zero_dist = dist[dist > 1.0]
        if len(non_zero_dist) > 0:
            # Thickness is twice the median distance to background
            mean_thickness_px = float(np.median(non_zero_dist) * 2.0)
            mean_thickness_px = max(8.0, min(mean_thickness_px, 45.0))
        else:
            mean_thickness_px = 16.0

        return walls_closed, mean_thickness_px

    def detect_raw_segments(self, walls_binary: np.ndarray) -> List[Tuple[float, float, float, float]]:
        """Uses HoughLinesP and contour bounding to extract raw line segments."""
        edges = cv2.Canny(walls_binary, 50, 150)
        lines = cv2.HoughLinesP(
            edges,
            rho=1,
            theta=np.pi / 180,
            threshold=40,
            minLineLength=self.min_wall_length_px,
            maxLineGap=12
        )

        segments = []
        if lines is not None:
            lines_reshaped = lines.reshape(-1, 4)
            for x1, y1, x2, y2 in lines_reshaped:
                segments.append((float(x1), float(y1), float(x2), float(y2)))

        # Also extract contours for solid walls / filled components
        contours, _ = cv2.findContours(walls_binary, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        for cnt in contours:
            area = cv2.contourArea(cnt)
            if area > 400:
                rect = cv2.minAreaRect(cnt)
                (cx, cy), (rw, rh), angle = rect
                if rw < rh:
                    rw, rh = rh, rw
                    angle += 90.0
                # If elongated, it represents a solid wall
                if rh > 0 and (rw / rh) >= 2.5 and rw >= self.min_wall_length_px:
                    rad = math.radians(angle)
                    dx = (rw / 2.0) * math.cos(rad)
                    dy = (rw / 2.0) * math.sin(rad)
                    segments.append((cx - dx, cy - dy, cx + dx, cy + dy))

        return segments

    def merge_collinear_segments(
        self,
        raw_segments: List[Tuple[float, float, float, float]],
        thickness_px: float
    ) -> List[DetectedWallSegment]:
        """Clusters and merges overlapping or fragmented collinear wall segments."""
        if not raw_segments:
            return []

        # Snap near-horizontal and near-vertical segments to strict orthogonal axes
        orthogonal_segments = []
        for x1, y1, x2, y2 in raw_segments:
            dx = x2 - x1
            dy = y2 - y1
            length = math.hypot(dx, dy)
            if length < self.min_wall_length_px:
                continue

            angle_deg = abs(math.degrees(math.atan2(dy, dx))) % 180
            # Snap to horizontal
            if angle_deg < 8 or angle_deg > 172:
                my = (y1 + y2) / 2.0
                sx = min(x1, x2)
                ex = max(x1, x2)
                orthogonal_segments.append((sx, my, ex, my, "H"))
            # Snap to vertical
            elif 82 < angle_deg < 98:
                mx = (x1 + x2) / 2.0
                sy = min(y1, y2)
                ey = max(y1, y2)
                orthogonal_segments.append((mx, sy, mx, ey, "V"))
            else:
                # Angled wall
                orthogonal_segments.append((x1, y1, x2, y2, "A"))

        # Merge parallel H segments
        merged_walls: List[DetectedWallSegment] = []
        h_segs = [s for s in orthogonal_segments if s[4] == "H"]
        v_segs = [s for s in orthogonal_segments if s[4] == "V"]
        a_segs = [s for s in orthogonal_segments if s[4] == "A"]

        # Merge H segments with similar Y
        h_segs.sort(key=lambda s: s[1])
        used_h = [False] * len(h_segs)
        for i in range(len(h_segs)):
            if used_h[i]:
                continue
            x1, y, x2, _, _ = h_segs[i]
            cur_x1, cur_x2 = x1, x2
            y_acc = [y]
            used_h[i] = True

            for j in range(i + 1, len(h_segs)):
                if used_h[j]:
                    continue
                ox1, oy, ox2, _, _ = h_segs[j]
                if abs(oy - y) <= thickness_px * 0.8:
                    # Check X overlap or small gap
                    if not (ox2 < cur_x1 - 35 or ox1 > cur_x2 + 35):
                        cur_x1 = min(cur_x1, ox1)
                        cur_x2 = max(cur_x2, ox2)
                        y_acc.append(oy)
                        used_h[j] = True

            avg_y = float(np.mean(y_acc))
            if (cur_x2 - cur_x1) >= self.min_wall_length_px:
                merged_walls.append(DetectedWallSegment(
                    id_str=f"w_h_{len(merged_walls)}",
                    start=(cur_x1, avg_y),
                    end=(cur_x2, avg_y),
                    thickness_px=thickness_px
                ))

        # Merge V segments with similar X
        v_segs.sort(key=lambda s: s[0])
        used_v = [False] * len(v_segs)
        for i in range(len(v_segs)):
            if used_v[i]:
                continue
            x, y1, _, y2, _ = v_segs[i]
            cur_y1, cur_y2 = y1, y2
            x_acc = [x]
            used_v[i] = True

            for j in range(i + 1, len(v_segs)):
                if used_v[j]:
                    continue
                ox, oy1, _, oy2, _ = v_segs[j]
                if abs(ox - x) <= thickness_px * 0.8:
                    if not (oy2 < cur_y1 - 35 or oy1 > cur_y2 + 35):
                        cur_y1 = min(cur_y1, oy1)
                        cur_y2 = max(cur_y2, oy2)
                        x_acc.append(ox)
                        used_v[j] = True

            avg_x = float(np.mean(x_acc))
            if (cur_y2 - cur_y1) >= self.min_wall_length_px:
                merged_walls.append(DetectedWallSegment(
                    id_str=f"w_v_{len(merged_walls)}",
                    start=(avg_x, cur_y1),
                    end=(avg_x, cur_y2),
                    thickness_px=thickness_px
                ))

        # Add angled segments directly
        for i, (ax1, ay1, ax2, ay2, _) in enumerate(a_segs):
            merged_walls.append(DetectedWallSegment(
                id_str=f"w_a_{len(merged_walls)}",
                start=(ax1, ay1),
                end=(ax2, ay2),
                thickness_px=thickness_px
            ))

        return merged_walls

    def snap_junctions_and_corners(
        self,
        walls: List[DetectedWallSegment]
    ) -> List[DetectedWallSegment]:
        """
        Snaps endpoints within snap_distance_px into common corner (L) and
        T-junction nodes so the walls form a manifold topological graph.
        """
        if len(walls) < 2:
            return walls

        # 1. Snap Corner (L-Junction) endpoints
        for i in range(len(walls)):
            w1 = walls[i]
            for j in range(i + 1, len(walls)):
                w2 = walls[j]

                pairs = [
                    ("start", "start", w1.start, w2.start),
                    ("start", "end", w1.start, w2.end),
                    ("end", "start", w1.end, w2.start),
                    ("end", "end", w1.end, w2.end)
                ]

                for end1_type, end2_type, pt1, pt2 in pairs:
                    dist = math.hypot(pt1[0] - pt2[0], pt1[1] - pt2[1])
                    if 0.0 < dist <= self.snap_distance_px:
                        avg_pt = ((pt1[0] + pt2[0]) / 2.0, (pt1[1] + pt2[1]) / 2.0)
                        if end1_type == "start":
                            w1.start = avg_pt
                        else:
                            w1.end = avg_pt

                        if end2_type == "start":
                            w2.start = avg_pt
                        else:
                            w2.end = avg_pt

        # 2. Snap T-Junctions: where a wall endpoint touches along another wall's body
        for i in range(len(walls)):
            w1 = walls[i]
            for j in range(len(walls)):
                if i == j:
                    continue
                w2 = walls[j]

                for end_type in ["start", "end"]:
                    pt = w1.start if end_type == "start" else w1.end
                    # Project pt onto line segment w2
                    proj, t = self._project_point_to_segment(pt, w2.start, w2.end)
                    if 0.08 < t < 0.92:
                        dist = math.hypot(pt[0] - proj[0], pt[1] - proj[1])
                        if dist <= self.snap_distance_px:
                            if end_type == "start":
                                w1.start = proj
                            else:
                                w1.end = proj

        return walls

    def classify_exterior_walls(
        self,
        walls: List[DetectedWallSegment]
    ) -> List[DetectedWallSegment]:
        """Labels outer perimeter envelope walls as 'exterior', rest as 'interior'."""
        if len(walls) < 4:
            for w in walls:
                w.wall_type = "interior"
            return walls

        all_points = []
        for w in walls:
            all_points.append(w.start)
            all_points.append(w.end)

        pts_array = np.array(all_points, dtype=np.float32)
        min_x, min_y = np.min(pts_array, axis=0)
        max_x, max_y = np.max(pts_array, axis=0)

        # Walls within 10% margin of boundary envelope are considered exterior
        margin_x = (max_x - min_x) * 0.12
        margin_y = (max_y - min_y) * 0.12

        for w in walls:
            mx, my = w.midpoint
            is_near_boundary = (
                mx <= min_x + margin_x or mx >= max_x - margin_x or
                my <= min_y + margin_y or my >= max_y - margin_y
            )
            if is_near_boundary and w.length_px > self.min_wall_length_px * 1.5:
                w.wall_type = "exterior"
            else:
                w.wall_type = "interior"

        return walls

    def detect_walls(self, binary: np.ndarray) -> Tuple[List[DetectedWallSegment], float]:
        """Main entry point for wall extraction."""
        walls_bin, mean_thickness_px = self.separate_wall_binary(binary)
        raw_segs = self.detect_raw_segments(walls_bin)
        merged = self.merge_collinear_segments(raw_segs, mean_thickness_px)
        snapped = self.snap_junctions_and_corners(merged)
        classified = self.classify_exterior_walls(snapped)
        return classified, mean_thickness_px

    def _project_point_to_segment(
        self,
        p: Tuple[float, float],
        a: Tuple[float, float],
        b: Tuple[float, float]
    ) -> Tuple[Tuple[float, float], float]:
        """Projects point p onto segment ab and returns (projected_point, normalized_t)."""
        abx = b[0] - a[0]
        aby = b[1] - a[1]
        mag_sq = abx * abx + aby * aby
        if mag_sq == 0:
            return a, 0.0
        apx = p[0] - a[0]
        apy = p[1] - a[1]
        t = (apx * abx + apy * aby) / mag_sq
        t_clamped = max(0.0, min(1.0, t))
        proj = (a[0] + t_clamped * abx, a[1] + t_clamped * aby)
        return proj, t
