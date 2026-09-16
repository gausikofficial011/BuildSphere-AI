"""
BuildSphere AI — Canonical Building Model Schema (Source of Truth)
==================================================================
Defines the strict, normalized, metric (SI meters) schema for architectural buildings.
Neither the 2D image coordinates nor the 3D meshes are sources of truth.
This canonical model drives 2D rendering, 3D procedural generation, and 5D BOQ/Cost takeoff.
"""

from typing import List, Dict, Optional, Any, Literal
from pydantic import BaseModel, Field
import uuid
import math


class UnitType(str):
    METERS = "m"
    CENTIMETERS = "cm"
    MILLIMETERS = "mm"
    FEET = "ft"
    INCHES = "in"

    @staticmethod
    def meters_to_unit(val_m: float, target_unit: str) -> float:
        u = target_unit.lower()
        if u == "m":
            return val_m
        elif u == "cm":
            return val_m * 100.0
        elif u == "mm":
            return val_m * 1000.0
        elif u == "ft":
            return val_m * 3.28084
        elif u == "in":
            return val_m * 39.3701
        return val_m

    @staticmethod
    def unit_to_meters(val: float, source_unit: str) -> float:
        u = source_unit.lower()
        if u == "m":
            return val
        elif u == "cm":
            return val / 100.0
        elif u == "mm":
            return val / 1000.0
        elif u == "ft":
            return val / 3.28084
        elif u == "in":
            return val / 39.3701
        return val


class Point2D(BaseModel):
    x: float
    z: float  # In BuildSphere 2D-to-3D, the ground plane is X-Z, Y is elevation/height

    def distance_to(self, other: "Point2D") -> float:
        return math.hypot(self.x - other.x, self.z - other.z)


class Point3D(BaseModel):
    x: float
    y: float  # Elevation / vertical building direction
    z: float


class WallOpening(BaseModel):
    id: str = Field(default_factory=lambda: f"op_{uuid.uuid4().hex[:8]}")
    opening_type: Literal["door", "window", "cased_opening"] = "door"
    ref_id: str  # ID of the Door or Window entity
    offset_start: float  # Distance along the wall from startPoint in meters
    width: float  # Width of opening in meters
    sill_height: float = 0.0  # 0.0 for doors, typically ~0.9m for windows
    height: float = 2.1  # Height of opening in meters


class Wall(BaseModel):
    id: str = Field(default_factory=lambda: f"wall_{uuid.uuid4().hex[:8]}")
    start_point: Point2D
    end_point: Point2D
    thickness: float = 0.20  # meters (e.g. 0.20m = 200mm)
    height: float = 3.0  # meters
    wall_type: Literal["exterior", "interior", "load_bearing", "partition", "curtain"] = "interior"
    material: str = "AAC Concrete Block"
    finish: str = "Gypsum Plaster & Emulsion"
    confidence: float = 0.95
    source: Literal["ai_detected", "user_created", "user_modified"] = "ai_detected"
    openings: List[WallOpening] = Field(default_factory=list)

    @property
    def length(self) -> float:
        return self.start_point.distance_to(self.end_point)

    @property
    def gross_area(self) -> float:
        return self.length * self.height

    @property
    def opening_area(self) -> float:
        return sum(op.width * op.height for op in self.openings)

    @property
    def net_area(self) -> float:
        return max(0.0, self.gross_area - self.opening_area)

    @property
    def volume(self) -> float:
        return self.net_area * self.thickness


class Door(BaseModel):
    id: str = Field(default_factory=lambda: f"door_{uuid.uuid4().hex[:8]}")
    wall_id: Optional[str] = None
    position: Point2D
    width: float = 0.90  # 900mm standard entry/room door
    height: float = 2.10  # 2100mm standard height
    rotation: float = 0.0  # Angle in degrees / radians
    swing_direction: Literal["left_in", "right_in", "left_out", "right_out", "sliding", "double"] = "left_in"
    door_type: Literal["single_flush", "single_panel", "double", "sliding", "folding", "glass"] = "single_flush"
    material: str = "Solid Core Engineered Timber"
    confidence: float = 0.90
    source: Literal["ai_detected", "user_created", "user_modified"] = "ai_detected"


class Window(BaseModel):
    id: str = Field(default_factory=lambda: f"win_{uuid.uuid4().hex[:8]}")
    wall_id: Optional[str] = None
    position: Point2D
    width: float = 1.50  # 1500mm standard window
    height: float = 1.40  # 1400mm
    sill_height: float = 0.90  # 900mm above finished floor level
    window_type: Literal["casement", "sliding", "fixed", "awning", "louver"] = "casement"
    material: str = "Low-E Double Glazed Argon / UPVC Frame"
    confidence: float = 0.88
    source: Literal["ai_detected", "user_created", "user_modified"] = "ai_detected"


class Room(BaseModel):
    id: str = Field(default_factory=lambda: f"room_{uuid.uuid4().hex[:8]}")
    name: str = "Room"
    room_type: Literal[
        "LIVING_ROOM", "BEDROOM", "MASTER_BEDROOM", "KITCHEN", "DINING",
        "BATHROOM", "BALCONY", "FOYER", "CORRIDOR", "UTILITY", "OFFICE",
        "STAIRCASE", "GARAGE", "STORAGE", "OTHER"
    ] = "OTHER"
    polygon: List[Point2D] = Field(default_factory=list)  # Ordered vertices
    area: float = 0.0  # Calculated square meters (m²)
    perimeter: float = 0.0  # Calculated meters
    floor_id: Optional[str] = None
    floor_finish: str = "Vitrified Tile 600x600"
    ceiling_finish: str = "Suspended Gypsum Board"
    confidence: float = 0.92
    source: Literal["ai_detected", "user_created", "user_modified"] = "ai_detected"

    def compute_polygon_metrics(self) -> None:
        """Computes area and perimeter using Shoelace formula."""
        n = len(self.polygon)
        if n < 3:
            return
        area = 0.0
        peri = 0.0
        for i in range(n):
            p1 = self.polygon[i]
            p2 = self.polygon[(i + 1) % n]
            area += p1.x * p2.z - p2.x * p1.z
            peri += p1.distance_to(p2)
        self.area = round(abs(area) / 2.0, 2)
        self.perimeter = round(peri, 2)


class Stair(BaseModel):
    id: str = Field(default_factory=lambda: f"stair_{uuid.uuid4().hex[:8]}")
    position: Point2D
    width: float = 1.10  # 1100mm standard flight width
    tread: float = 0.28  # 280mm tread depth
    riser: float = 0.17  # 170mm riser height
    step_count: int = 16  # Total steps for 3m elevation
    direction: Literal["up", "down"] = "up"
    style: Literal["straight", "dog_legged", "spiral", "l_shaped"] = "dog_legged"
    floor_from: int = 0
    floor_to: int = 1
    material: str = "Precast Reinforced Concrete"
    confidence: float = 0.85


class DimensionAnnotation(BaseModel):
    id: str = Field(default_factory=lambda: f"dim_{uuid.uuid4().hex[:8]}")
    start_point: Point2D
    end_point: Point2D
    value: float  # Real world value in meters
    unit: str = "m"
    raw_text: str = ""  # OCR captured string e.g. "4.50m"
    confidence: float = 0.90
    source: Literal["ai_ocr", "user_calibrated", "user_measured"] = "ai_ocr"


class MaterialSpec(BaseModel):
    id: str
    category: Literal["Wall", "Floor", "Ceiling", "Glass", "Wood", "Metal", "Concrete", "Brick", "Tile"]
    name: str
    density_kg_m3: float = 2400.0
    unit_cost_usd: float = 120.0  # Rate per m³ or m²
    unit_cost_type: Literal["m3", "m2", "linear_m", "unit"] = "m3"
    carbon_intensity_kg_co2e: float = 210.0


class ValidationIssue(BaseModel):
    id: str = Field(default_factory=lambda: uuid.uuid4().hex[:8])
    severity: Literal["ERROR", "WARNING", "INFO"]
    category: Literal["GEOMETRY", "TOPOLOGY", "SCALE", "APERTURE", "ROOM"]
    message: str
    element_id: Optional[str] = None
    suggested_action: Optional[str] = None


class ValidationReport(BaseModel):
    is_valid: bool = True
    error_count: int = 0
    warning_count: int = 0
    issues: List[ValidationIssue] = Field(default_factory=list)


class Floor(BaseModel):
    id: str = Field(default_factory=lambda: f"flr_{uuid.uuid4().hex[:8]}")
    level: int = 0  # 0 = Ground Floor, 1 = First Floor, etc.
    name: str = "Ground Floor"
    elevation: float = 0.0  # Height above datum in meters
    height: float = 3.0  # Floor-to-floor height in meters
    slab_thickness: float = 0.15  # 150mm reinforced slab
    walls: List[Wall] = Field(default_factory=list)
    rooms: List[Room] = Field(default_factory=list)
    doors: List[Door] = Field(default_factory=list)
    windows: List[Window] = Field(default_factory=list)
    stairs: List[Stair] = Field(default_factory=list)
    dimensions: List[DimensionAnnotation] = Field(default_factory=list)


class BuildingModel(BaseModel):
    id: str = Field(default_factory=lambda: f"bldg_{uuid.uuid4().hex[:8]}")
    project_id: Optional[int] = None
    name: str = "Architectural Building Model"
    units: str = "m"  # Canonical units: meters
    coordinate_system: Dict[str, str] = Field(
        default_factory=lambda: {
            "x": "Horizontal East-West (m)",
            "y": "Vertical Elevation (m)",
            "z": "Horizontal North-South (m)"
        }
    )
    scale_px_per_meter: float = 80.0  # Drawing scale factor
    floors: List[Floor] = Field(default_factory=list)
    materials: Dict[str, MaterialSpec] = Field(default_factory=dict)
    metadata: Dict[str, Any] = Field(default_factory=dict)
    validation: Optional[ValidationReport] = None

    def get_floor(self, level: int = 0) -> Optional[Floor]:
        for flr in self.floors:
            if flr.level == level:
                return flr
        return None

    def calculate_totals(self) -> Dict[str, float]:
        """Calculates aggregated areas, structural volumes, and rough BOQ totals."""
        total_gfa = 0.0
        total_wall_volume = 0.0
        total_slab_volume = 0.0
        total_door_count = 0
        total_window_count = 0

        for flr in self.floors:
            for room in flr.rooms:
                total_gfa += room.area
            for wall in flr.walls:
                total_wall_volume += wall.volume
            total_door_count += len(flr.doors)
            total_window_count += len(flr.windows)
            # Estimate floor slab volume from GFA
            slab_area = sum(r.area for r in flr.rooms)
            total_slab_volume += slab_area * flr.slab_thickness

        # Compute estimated cost and embodied carbon from material specs & benchmark rates
        wall_cost = total_wall_volume * 65.0   # AAC blocks benchmark ($65/m3)
        slab_cost = total_slab_volume * 115.0  # M25 concrete benchmark ($115/m3)
        steel_cost = (total_wall_volume + total_slab_volume) * 0.10 * 850.0  # Steel rebar
        door_cost = total_door_count * 220.0   # Standard flush door ($220/ea)
        window_cost = total_window_count * 350.0  # Low-E casement window ($350/ea)
        finish_cost = total_gfa * 28.0         # Floor finishes ($28/m2)
        total_cost = wall_cost + slab_cost + steel_cost + door_cost + window_cost + finish_cost

        # Embodied carbon (kg CO2e)
        wall_co2 = total_wall_volume * 90.0
        slab_co2 = total_slab_volume * 230.0
        steel_co2 = (total_wall_volume + total_slab_volume) * 0.10 * 1800.0
        finish_co2 = total_gfa * 22.0
        total_co2 = wall_co2 + slab_co2 + steel_co2 + finish_co2

        return {
            "gross_floor_area_m2": round(total_gfa, 2),
            "total_wall_volume_m3": round(total_wall_volume, 2),
            "total_slab_volume_m3": round(total_slab_volume, 2),
            "total_concrete_volume_m3": round(total_wall_volume + total_slab_volume, 2),
            "door_count": total_door_count,
            "window_count": total_window_count,
            "estimated_total_cost_usd": round(total_cost, 2),
            "estimated_embodied_carbon_kg_co2e": round(total_co2, 2)
        }

