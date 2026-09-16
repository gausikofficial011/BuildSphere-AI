"""
BuildSphere AI — Room Polygon & Space Detector
==============================================
Constructs enclosed topological room polygons from wall circuits, computes
geometric metrics (area, perimeter, centroid), and associates OCR semantic
labels (Living Room, Kitchen, Bedroom, etc.) to room boundaries.
"""

from typing import List, Tuple, Dict, Any, Optional
import math
import numpy as np
import cv2
from .geometry_detector import DetectedWallSegment
from .ocr_provider import OcrBox


class DetectedRoom:
    """Represents a detected architectural room polygon in pixel space."""

    def __init__(
        self,
        id_str: str,
        name: str = "Room",
        room_type: str = "OTHER",
        polygon_px: Optional[List[Tuple[float, float]]] = None,
        area_px: float = 0.0,
        perimeter_px: float = 0.0,
        confidence: float = 0.90,
        associated_ocr: Optional[List[Dict[str, Any]]] = None
    ):
        self.id = id_str
        self.name = name
        self.room_type = room_type
        self.polygon_px = polygon_px or []
        self.area_px = area_px
        self.perimeter_px = perimeter_px
        self.confidence = confidence
        self.associated_ocr = associated_ocr or []

    @property
    def centroid_px(self) -> Tuple[float, float]:
        if not self.polygon_px:
            return (0.0, 0.0)
        xs = [p[0] for p in self.polygon_px]
        ys = [p[1] for p in self.polygon_px]
        return (float(np.mean(xs)), float(np.mean(ys)))


class FloorPlanRoomDetector:
    """Detects closed room zones from wall graphs and binds OCR labels."""

    def __init__(self, min_room_area_px: float = 1200.0):
        self.min_room_area_px = min_room_area_px

    def detect_rooms(
        self,
        image_shape: Tuple[int, int],
        walls: List[DetectedWallSegment],
        ocr_boxes: List[OcrBox]
    ) -> List[DetectedRoom]:
        """Extracts room polygons and matches with OCR annotations."""
        h, w = image_shape[:2]

        # 1. Render closed wall mask
        wall_canvas = np.zeros((h, w), dtype=np.uint8)
        for wall in walls:
            pt1 = (int(round(wall.start[0])), int(round(wall.start[1])))
            pt2 = (int(round(wall.end[0])), int(round(wall.end[1])))
            thick = int(max(4, round(wall.thickness_px + 2)))
            cv2.line(wall_canvas, pt1, pt2, 255, thick)

        # Bridge door openings and collinear gaps (up to 110px) to form closed room boundaries
        for i in range(len(walls)):
            w1 = walls[i]
            for j in range(i + 1, len(walls)):
                w2 = walls[j]
                for p1 in [w1.start, w1.end]:
                    for p2 in [w2.start, w2.end]:
                        dist = math.hypot(p1[0] - p2[0], p1[1] - p2[1])
                        if 0 < dist <= 110.0:
                            cv2.line(
                                wall_canvas,
                                (int(round(p1[0])), int(round(p1[1]))),
                                (int(round(p2[0])), int(round(p2[1]))),
                                255, 6
                            )

        # Dilate slightly to ensure full seal
        kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (5, 5))
        wall_dilated = cv2.dilate(wall_canvas, kernel)

        # 2. Invert to get empty interior spaces
        spaces = cv2.bitwise_not(wall_dilated)

        # Floodfill from border to eliminate the infinite exterior region
        exterior_mask = np.zeros((h + 2, w + 2), dtype=np.uint8)
        spaces_copy = spaces.copy()
        cv2.floodFill(spaces_copy, exterior_mask, (0, 0), 0)
        cv2.floodFill(spaces_copy, exterior_mask, (w - 1, 0), 0)
        cv2.floodFill(spaces_copy, exterior_mask, (0, h - 1), 0)
        cv2.floodFill(spaces_copy, exterior_mask, (w - 1, h - 1), 0)

        # 3. Find connected interior room contours
        contours, hierarchy = cv2.findContours(
            spaces_copy, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE
        )

        detected_rooms: List[DetectedRoom] = []
        room_counter = 1

        for cnt in contours:
            area = cv2.contourArea(cnt)
            # Filter out wall corner notches or microscopic cavities
            if area < self.min_room_area_px:
                continue

            # Simplify contour to clean architectural polygon
            epsilon = 0.015 * cv2.arcLength(cnt, True)
            approx = cv2.approxPolyDP(cnt, epsilon, True)

            if len(approx) < 4:
                # If too simple, use slightly smaller epsilon
                approx = cv2.approxPolyDP(cnt, 2.5, True)

            poly_pts = [(float(pt[0][0]), float(pt[0][1])) for pt in approx]
            peri = cv2.arcLength(cnt, True)

            # Check for OCR boxes located inside this room polygon
            matched_ocr: List[Dict[str, Any]] = []
            assigned_name = f"Room {room_counter:02d}"
            assigned_type = "OTHER"
            conf = 0.88

            for ob in ocr_boxes:
                cx, cy = ob.center
                # Point-in-polygon test: > 0 means strictly inside
                dist = cv2.pointPolygonTest(cnt, (float(cx), float(cy)), False)
                if dist >= 0:
                    matched_ocr.append(ob.to_dict())
                    if ob.category == "ROOM_NAME":
                        assigned_name = ob.semantic_data.get("normalized_name", ob.text.title())
                        assigned_type = ob.semantic_data.get("room_type", "OTHER")
                        conf = max(conf, ob.confidence)

            # If no OCR matched, infer from size or room count
            if assigned_name.startswith("Room"):
                room_counter += 1

            detected_rooms.append(DetectedRoom(
                id_str=f"room_{len(detected_rooms) + 1}",
                name=assigned_name,
                room_type=assigned_type,
                polygon_px=poly_pts,
                area_px=float(area),
                perimeter_px=float(peri),
                confidence=conf,
                associated_ocr=matched_ocr
            ))

        # Sort rooms by area descending (largest = Living/Main spaces)
        detected_rooms.sort(key=lambda r: r.area_px, reverse=True)
        return detected_rooms
