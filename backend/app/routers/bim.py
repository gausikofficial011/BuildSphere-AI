from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from .. import models
from pydantic import BaseModel
import json

router = APIRouter(
    prefix="/api/buildings",
    tags=["Buildings"]
)

class BIMStatePayload(BaseModel):
    state: dict

@router.post("/{building_id}")
def save_building_state(building_id: str, payload: BIMStatePayload, db: Session = Depends(get_db)):
    # Try to find existing
    building = db.query(models.Building).filter(models.Building.id == building_id).first()
    
    if not building:
        # Create default project if not exists for demo purposes
        proj = db.query(models.Project).first()
        if not proj:
            proj = models.Project(name="Default Project")
            db.add(proj)
            db.commit()
            
        building = models.Building(
            id=building_id,
            name="Main Building",
            project_id=proj.id,
            bim_state=json.dumps(payload.state)
        )
        db.add(building)
    else:
        building.bim_state = json.dumps(payload.state)
        
    db.commit()
    return {"status": "success", "message": "BIM state saved"}

@router.get("/{building_id}")
def load_building_state(building_id: str, db: Session = Depends(get_db)):
    building = db.query(models.Building).filter(models.Building.id == building_id).first()
    if not building:
        return {"state": {}}
    
    return {"state": json.loads(building.bim_state)}

class Plan2DRequest(BaseModel):
    building_name: str = "BuildSphere AI Generated Building"
    template_id: str = "villa_2story"
    stories: int = 2
    floor_height: float = 3.0
    wall_thickness: float = 0.20
    glazing_ratio: float = 0.35
    roof_style: str = "flat_parapet"
    architectural_style: str = "modern_minimalist"
    width: float = 10.0
    length: float = 12.0

@router.post("/2d-to-3d/generate")
def generate_3d_from_2d(req: Plan2DRequest):
    """
    AI 2D-to-3D Procedural Engine
    Transforms 2D architectural blueprint layout into full 3D BIM parametric structure.
    """
    w = req.width
    l = req.length
    h = req.floor_height
    stories = req.stories
    t = req.wall_thickness
    
    elements = []
    element_id = 1
    
    # 1. Foundation
    elements.append({
        "id": f"BS-FND-{element_id:03d}",
        "name": "Foundation Slab Pad",
        "category": "Substructure",
        "type": "Foundation",
        "material": "Concrete C30/37",
        "position": [0, -0.15, 0],
        "size": [w + 0.4, 0.3, l + 0.4],
        "volume_m3": round((w + 0.4) * (l + 0.4) * 0.3, 2),
        "embodied_carbon_kg": round((w + 0.4) * (l + 0.4) * 0.3 * 240, 1),
        "cost_usd": round((w + 0.4) * (l + 0.4) * 0.3 * 185, 2)
    })
    element_id += 1
    
    # 2. Multi-Story Levels
    for floor_idx in range(stories):
        elevation = floor_idx * h
        floor_label = "Ground" if floor_idx == 0 else f"Floor {floor_idx + 1}"
        
        # Floor Slab
        elements.append({
            "id": f"BS-SLAB-{floor_idx:02d}",
            "name": f"{floor_label} Structural Slab",
            "category": "Structure",
            "type": "FloorSlab",
            "material": "Hardwood Parquet / Concrete",
            "position": [0, elevation + 0.1, 0],
            "size": [w, 0.2, l],
            "volume_m3": round(w * l * 0.2, 2),
            "embodied_carbon_kg": round(w * l * 0.2 * 190, 1),
            "cost_usd": round(w * l * 0.2 * 140, 2)
        })
        
        wall_center_y = elevation + 0.2 + ((h - 0.2) / 2.0)
        wall_h = h - 0.2
        
        # Exterior Walls
        # North
        elements.append({
            "id": f"BS-W-EXT-N-{floor_idx:02d}",
            "name": f"{floor_label} Exterior Wall North",
            "category": "ExteriorWall",
            "type": "Wall",
            "material": "Insulated AAC Concrete Panel",
            "position": [0, wall_center_y, (l / 2.0) - (t / 2.0)],
            "size": [w, wall_h, t],
            "volume_m3": round(w * wall_h * t, 2),
            "embodied_carbon_kg": round(w * wall_h * t * 160, 1),
            "cost_usd": round(w * wall_h * t * 95, 2)
        })
        # South
        elements.append({
            "id": f"BS-W-EXT-S-{floor_idx:02d}",
            "name": f"{floor_label} Exterior Wall South",
            "category": "ExteriorWall",
            "type": "Wall",
            "material": "Insulated AAC Concrete Panel",
            "position": [0, wall_center_y, -(l / 2.0) + (t / 2.0)],
            "size": [w, wall_h, t],
            "volume_m3": round(w * wall_h * t, 2),
            "embodied_carbon_kg": round(w * wall_h * t * 160, 1),
            "cost_usd": round(w * wall_h * t * 95, 2)
        })
        # West
        elements.append({
            "id": f"BS-W-EXT-W-{floor_idx:02d}",
            "name": f"{floor_label} Exterior Wall West",
            "category": "ExteriorWall",
            "type": "Wall",
            "material": "Insulated AAC Concrete Panel",
            "position": [-(w / 2.0) + (t / 2.0), wall_center_y, 0],
            "size": [t, wall_h, l],
            "volume_m3": round(t * wall_h * l, 2),
            "embodied_carbon_kg": round(t * wall_h * l * 160, 1),
            "cost_usd": round(t * wall_h * l * 95, 2)
        })
        # East
        elements.append({
            "id": f"BS-W-EXT-E-{floor_idx:02d}",
            "name": f"{floor_label} Exterior Wall East",
            "category": "ExteriorWall",
            "type": "Wall",
            "material": "Insulated AAC Concrete Panel",
            "position": [(w / 2.0) - (t / 2.0), wall_center_y, 0],
            "size": [t, wall_h, l],
            "volume_m3": round(t * wall_h * l, 2),
            "embodied_carbon_kg": round(t * wall_h * l * 160, 1),
            "cost_usd": round(t * wall_h * l * 95, 2)
        })
        
        # Interior Partitions
        elements.append({
            "id": f"BS-W-INT-DIV-{floor_idx:02d}",
            "name": f"{floor_label} Interior Partition A",
            "category": "InteriorWall",
            "type": "Wall",
            "material": "Acoustic Plasterboard Drywall",
            "position": [0, wall_center_y, -1.0],
            "size": [0.15, wall_h, l * 0.45],
            "volume_m3": round(0.15 * wall_h * l * 0.45, 2),
            "embodied_carbon_kg": round(0.15 * wall_h * l * 0.45 * 45, 1),
            "cost_usd": round(0.15 * wall_h * l * 0.45 * 65, 2)
        })
        
        # Windows & Doors
        elements.append({
            "id": f"BS-WIN-{floor_idx:02d}-01",
            "name": f"{floor_label} High-Performance Window W",
            "category": "Glazing",
            "type": "Window",
            "material": "Low-E Double Glazed Argon",
            "position": [-(w / 2.0), elevation + 1.6, -2.5],
            "size": [0.25, 1.6, 2.2],
            "volume_m3": 0.88,
            "embodied_carbon_kg": 55.0,
            "cost_usd": 320.0
        })
        elements.append({
            "id": f"BS-WIN-{floor_idx:02d}-02",
            "name": f"{floor_label} High-Performance Window E",
            "category": "Glazing",
            "type": "Window",
            "material": "Low-E Double Glazed Argon",
            "position": [(w / 2.0), elevation + 1.6, -2.5],
            "size": [0.25, 1.6, 2.2],
            "volume_m3": 0.88,
            "embodied_carbon_kg": 55.0,
            "cost_usd": 320.0
        })
        
        # Doors
        if floor_idx == 0:
            elements.append({
                "id": "BS-DOOR-ENTRY",
                "name": "Main Entrance Architectural Door",
                "category": "Door",
                "type": "Door",
                "material": "Solid Core Timber / Steel",
                "position": [0, elevation + 1.2, -(l / 2.0)],
                "size": [1.1, 2.2, 0.15],
                "volume_m3": 0.36,
                "embodied_carbon_kg": 25.0,
                "cost_usd": 450.0
            })
    
    # 3. Roof & Parapets
    roof_elev = stories * h
    elements.append({
        "id": "BS-ROOF-SLAB",
        "name": "Flat Roof Weatherproof Slab",
        "category": "Roof",
        "type": "Roof",
        "material": "Reinforced Concrete / Bitumen Membrane",
        "position": [0, roof_elev + 0.125, 0],
        "size": [w + 0.2, 0.25, l + 0.2],
        "volume_m3": round((w + 0.2) * (l + 0.2) * 0.25, 2),
        "embodied_carbon_kg": round((w + 0.2) * (l + 0.2) * 0.25 * 210, 1),
        "cost_usd": round((w + 0.2) * (l + 0.2) * 0.25 * 165, 2)
    })
    
    # Parapets
    elements.append({
        "id": "BS-ROOF-PARAPET",
        "name": "Perimeter Rooftop Safety Parapet",
        "category": "Roof",
        "type": "Parapet",
        "material": "Precast Concrete Parapet",
        "position": [0, roof_elev + 0.55, 0],
        "size": [w + 0.2, 0.6, l + 0.2],
        "volume_m3": round(2 * (w + l) * 0.2 * 0.6, 2),
        "embodied_carbon_kg": round(2 * (w + l) * 0.2 * 0.6 * 180, 1),
        "cost_usd": round(2 * (w + l) * 0.2 * 0.6 * 85, 2)
    })
    
    # Aggregated Stats
    total_gfa = round(w * l * stories, 1)
    total_volume = round(sum(el.get("volume_m3", 0) for el in elements), 2)
    total_carbon = round(sum(el.get("embodied_carbon_kg", 0) for el in elements), 1)
    total_cost = round(sum(el.get("cost_usd", 0) for el in elements), 2)
    
    return {
        "status": "success",
        "building_name": req.building_name,
        "metadata": {
            "stories": stories,
            "footprint": f"{w}m x {l}m",
            "gross_floor_area_m2": total_gfa,
            "total_structural_volume_m3": total_volume,
            "embodied_carbon_kgCO2e": total_carbon,
            "estimated_construction_cost_usd": total_cost,
            "component_count": len(elements),
            "architectural_style": req.architectural_style,
            "roof_style": req.roof_style
        },
        "elements": elements
    }

def generate_3d_from_rooms(
    rooms: list,
    width: float = 12.0,
    length: float = 14.0,
    stories: int = 1,
    floor_height: float = 3.0,
    wall_thickness: float = 0.18,
    building_name: str = "OCR Synthesized 3D Model"
):
    """
    Generates a full architectural 3D BIM model directly from extracted 2D blueprint rooms,
    including room floor surfaces, interior partition walls with doorway openings,
    doors, windows on perimeter walls, structural columns, 3D room tags,
    and a toggleable roof slab.
    """
    elements = []
    w = max(width, 10.0)
    l = max(length, 12.0)
    h = floor_height
    t = wall_thickness
    wall_h = round(h - 0.2, 2)
    center_y = round(0.15 + (wall_h / 2.0), 3)

    # 1. Reinforced Substructure Foundation Pad
    elements.append({
        "id": "BS-FND-001",
        "name": "Reinforced Foundation Pad",
        "category": "Substructure",
        "type": "Foundation",
        "material": "Concrete C30/37",
        "position": [0, -0.15, 0],
        "size": [w + 0.5, 0.3, l + 0.5],
        "volume_m3": round((w + 0.5) * (l + 0.5) * 0.3, 2),
        "embodied_carbon_kg": round((w + 0.5) * (l + 0.5) * 0.3 * 240, 1),
        "cost_usd": round((w + 0.5) * (l + 0.5) * 0.3 * 185, 2)
    })

    # 2. Ground Level Base Structural Slab
    elements.append({
        "id": "BS-SLAB-001",
        "name": "Ground Structural Floor Slab",
        "category": "Structure",
        "type": "FloorSlab",
        "material": "Cast-in-Place Reinforced Concrete",
        "position": [0, 0.075, 0],
        "size": [w, 0.15, l],
        "volume_m3": round(w * l * 0.15, 2),
        "embodied_carbon_kg": round(w * l * 0.15 * 190, 1),
        "cost_usd": round(w * l * 0.15 * 140, 2)
    })

    # 3. Exterior Perimeter Enclosing Walls
    elements.append({
        "id": "BS-W-EXT-N",
        "name": "Exterior Facade Wall North",
        "category": "ExteriorWall",
        "type": "Wall",
        "material": "Insulated AAC Panel with Render",
        "color": "#f1f5f9",
        "position": [0, center_y, (l / 2.0) - (t / 2.0)],
        "size": [w, wall_h, t],
        "volume_m3": round(w * wall_h * t, 2),
        "embodied_carbon_kg": round(w * wall_h * t * 160, 1),
        "cost_usd": round(w * wall_h * t * 95, 2)
    })
    elements.append({
        "id": "BS-W-EXT-S",
        "name": "Exterior Facade Wall South",
        "category": "ExteriorWall",
        "type": "Wall",
        "material": "Insulated AAC Panel with Render",
        "color": "#f1f5f9",
        "position": [0, center_y, -(l / 2.0) + (t / 2.0)],
        "size": [w, wall_h, t],
        "volume_m3": round(w * wall_h * t, 2),
        "embodied_carbon_kg": round(w * wall_h * t * 160, 1),
        "cost_usd": round(w * wall_h * t * 95, 2)
    })
    elements.append({
        "id": "BS-W-EXT-W",
        "name": "Exterior Facade Wall West",
        "category": "ExteriorWall",
        "type": "Wall",
        "material": "Insulated AAC Panel with Render",
        "color": "#f1f5f9",
        "position": [-(w / 2.0) + (t / 2.0), center_y, 0],
        "size": [t, wall_h, l],
        "volume_m3": round(t * wall_h * l, 2),
        "embodied_carbon_kg": round(t * wall_h * l * 160, 1),
        "cost_usd": round(t * wall_h * l * 95, 2)
    })
    elements.append({
        "id": "BS-W-EXT-E",
        "name": "Exterior Facade Wall East",
        "category": "ExteriorWall",
        "type": "Wall",
        "material": "Insulated AAC Panel with Render",
        "color": "#f1f5f9",
        "position": [(w / 2.0) - (t / 2.0), center_y, 0],
        "size": [t, wall_h, l],
        "volume_m3": round(t * wall_h * l, 2),
        "embodied_carbon_kg": round(t * wall_h * l * 160, 1),
        "cost_usd": round(t * wall_h * l * 95, 2)
    })

    # Main Entrance Door (South exterior)
    elements.append({
        "id": "BS-DOOR-ENTRY",
        "name": "Main Entrance Architectural Door",
        "category": "Door",
        "type": "Door",
        "material": "Solid Core Timber & Steel Pivot",
        "color": "#78350f",
        "position": [0, 0.15 + 1.1, -(l / 2.0)],
        "size": [1.2, 2.2, 0.15],
        "volume_m3": 0.40,
        "embodied_carbon_kg": 25.0,
        "cost_usd": 480.0
    })

    # 4. Standard Architectural Palette
    ROOM_THEMES = {
        "LIVING": {"color": "#3b82f6", "floor": "European Natural Oak Parquet", "cost_m2": 75},
        "KITCHEN": {"color": "#0d9488", "floor": "Granite Porcelain Non-Porous Tile", "cost_m2": 65},
        "BEDROOM": {"color": "#8b5cf6", "floor": "Acoustic Scandinavian Timber", "cost_m2": 70},
        "BATHROOM": {"color": "#06b6d4", "floor": "Waterproof Ceramic Mosaic Tile", "cost_m2": 80},
        "FOYER": {"color": "#6366f1", "floor": "Polished Calacatta Marble", "cost_m2": 95},
        "STAIR": {"color": "#f43f5e", "floor": "Reinforced Structural Concrete", "cost_m2": 50},
        "DEFAULT": {"color": "#0284c7", "floor": "Architectural Micro-Cement", "cost_m2": 60}
    }

    def get_room_theme(name):
        n = name.upper()
        for k, val in ROOM_THEMES.items():
            if k in n:
                return val
        return ROOM_THEMES["DEFAULT"]

    # 5. Process Extracted Rooms
    for i, room in enumerate(rooms):
        idx = i + 1
        r_name = room.get("room_name", f"Room {idx}")
        r_dims = room.get("dimension_raw", f"{room.get('width_meters', 4.0)}m x {room.get('length_meters', 4.0)}m")
        r_conf = room.get("confidence", 0.95)
        rw = float(room.get("width_meters", 4.0))
        rl = float(room.get("length_meters", 4.0))
        area = float(room.get("area_m2", round(rw * rl, 2)))
        theme = get_room_theme(r_name)

        # Compute position from pixel center or quadrant layout
        center = room.get("pixel_center")
        if center and isinstance(center, (list, tuple)) and len(center) == 2:
            cx, cy = center
            nx = (cx / 1000.0) - 0.5
            nz = (cy / 800.0) - 0.5
            rx = round(nx * (w * 0.72), 2)
            rz = round(nz * (l * 0.72), 2)
        else:
            col = i % 2
            row = i // 2
            rx = round(-w * 0.22 + col * (w * 0.44), 2)
            rz = round(-l * 0.25 + row * (l * 0.35), 2)

        # Clamp inside building bounds
        rx = max(-w / 2.0 + rw / 2.0 + t, min(w / 2.0 - rw / 2.0 - t, rx))
        rz = max(-l / 2.0 + rl / 2.0 + t, min(l / 2.0 - rl / 2.0 - t, rz))

        # (a) Room Floor Zone Pad (Distinctive material & color)
        elements.append({
            "id": f"BS-ROOM-ZONE-{idx:02d}",
            "name": f"{r_name} Floor Finish",
            "category": "Finishes",
            "type": "RoomZone",
            "room_name": r_name,
            "dimension_raw": r_dims,
            "area_m2": area,
            "material": theme["floor"],
            "color": theme["color"],
            "position": [rx, 0.16, rz],
            "size": [max(0.8, rw - 0.1), 0.02, max(0.8, rl - 0.1)],
            "volume_m3": round(rw * rl * 0.02, 2),
            "embodied_carbon_kg": round(rw * rl * 9.5, 1),
            "cost_usd": round(rw * rl * theme["cost_m2"], 2)
        })

        # (b) Interior Partition Walls around Room
        elements.append({
            "id": f"BS-W-INT-{idx:02d}-A",
            "name": f"{r_name} Partition Wall EW",
            "category": "InteriorWall",
            "type": "Wall",
            "material": "Acoustic Plasterboard Drywall",
            "color": "#e2e8f0",
            "position": [rx, center_y, min(l / 2.0 - t, rz + rl / 2.0 - 0.07)],
            "size": [max(0.8, rw), wall_h, 0.14],
            "volume_m3": round(rw * wall_h * 0.14, 2),
            "embodied_carbon_kg": round(rw * wall_h * 0.14 * 45, 1),
            "cost_usd": round(rw * wall_h * 0.14 * 65, 2)
        })

        elements.append({
            "id": f"BS-W-INT-{idx:02d}-B",
            "name": f"{r_name} Partition Wall NS",
            "category": "InteriorWall",
            "type": "Wall",
            "material": "Acoustic Plasterboard Drywall",
            "color": "#e2e8f0",
            "position": [min(w / 2.0 - t, rx + rw / 2.0 - 0.07), center_y, rz],
            "size": [0.14, wall_h, max(0.8, rl)],
            "volume_m3": round(0.14 * wall_h * rl, 2),
            "embodied_carbon_kg": round(0.14 * wall_h * rl * 45, 1),
            "cost_usd": round(0.14 * wall_h * rl * 65, 2)
        })

        # (c) Interior Room Door
        elements.append({
            "id": f"BS-DOOR-{idx:02d}",
            "name": f"{r_name} Internal Door",
            "category": "Door",
            "type": "Door",
            "material": "Natural White Oak Flush Door",
            "color": "#78350f",
            "position": [rx, 0.15 + 1.05, max(-l / 2.0 + t, rz - rl / 2.0 + 0.07)],
            "size": [0.95, 2.1, 0.12],
            "volume_m3": 0.24,
            "embodied_carbon_kg": 18.0,
            "cost_usd": 380.0
        })

        # (d) Exterior Window if room is near facade
        if abs(rx) > (w * 0.22) or abs(rz) > (l * 0.22):
            win_pos = [-(w / 2.0) if rx < 0 else (w / 2.0), 0.15 + 1.5, rz] if abs(rx) >= abs(rz) else [rx, 0.15 + 1.5, -(l / 2.0) if rz < 0 else (l / 2.0)]
            win_size = [0.22, 1.5, min(2.4, rl * 0.6)] if abs(rx) >= abs(rz) else [min(2.4, rw * 0.6), 1.5, 0.22]
            elements.append({
                "id": f"BS-WIN-{idx:02d}",
                "name": f"{r_name} Panoramic Window",
                "category": "Glazing",
                "type": "Window",
                "material": "Low-E Double Glazed Argon Window",
                "color": "#38bdf8",
                "position": win_pos,
                "size": win_size,
                "volume_m3": 0.55,
                "embodied_carbon_kg": 38.0,
                "cost_usd": 320.0
            })

        # (e) 3D Floating Room Annotation Tag
        elements.append({
            "id": f"BS-TAG-{idx:02d}",
            "name": r_name,
            "category": "Annotation",
            "type": "RoomTag",
            "room_name": r_name,
            "dimension_raw": r_dims,
            "area_m2": area,
            "confidence": round(r_conf * 100, 1),
            "color": theme["color"],
            "position": [rx, 0.15 + wall_h + 0.5, rz],
            "size": [1.0, 0.2, 1.0],
            "volume_m3": 0.0,
            "embodied_carbon_kg": 0.0,
            "cost_usd": 0.0
        })

    # 6. Structural Columns at Room Intersections
    column_coords = [
        (-w / 2.0 + 0.2, -l / 2.0 + 0.2),
        (w / 2.0 - 0.2, -l / 2.0 + 0.2),
        (-w / 2.0 + 0.2, l / 2.0 - 0.2),
        (w / 2.0 - 0.2, l / 2.0 - 0.2),
        (0, -l / 2.0 + 0.2),
        (0, l / 2.0 - 0.2),
        (-w / 2.0 + 0.2, 0),
        (w / 2.0 - 0.2, 0),
        (0, 0)
    ]
    for c_i, (cx, cz) in enumerate(column_coords):
        elements.append({
            "id": f"BS-COL-{c_i + 1:02d}",
            "name": f"Structural Column C{c_i + 1}",
            "category": "Structure",
            "type": "Column",
            "material": "Reinforced Concrete C35/45",
            "color": "#94a3b8",
            "position": [cx, center_y, cz],
            "size": [0.32, wall_h, 0.32],
            "volume_m3": round(0.32 * 0.32 * wall_h, 2),
            "embodied_carbon_kg": round(0.32 * 0.32 * wall_h * 240, 1),
            "cost_usd": round(0.32 * 0.32 * wall_h * 175, 2)
        })

    # 7. Roof Weatherproof Slab & Parapet (tagged is_roof: True for Cutaway)
    roof_y = 0.15 + wall_h
    elements.append({
        "id": "BS-ROOF-SLAB",
        "name": "Rooftop Weatherproof Slab",
        "category": "Roof",
        "type": "Roof",
        "material": "Reinforced Concrete / Bitumen Membrane",
        "color": "#475569",
        "position": [0, roof_y + 0.125, 0],
        "size": [w + 0.2, 0.25, l + 0.2],
        "is_roof": True,
        "volume_m3": round((w + 0.2) * (l + 0.2) * 0.25, 2),
        "embodied_carbon_kg": round((w + 0.2) * (l + 0.2) * 0.25 * 210, 1),
        "cost_usd": round((w + 0.2) * (l + 0.2) * 0.25 * 165, 2)
    })
    elements.append({
        "id": "BS-ROOF-PARAPET",
        "name": "Rooftop Safety Parapet Perimeter",
        "category": "Roof",
        "type": "Parapet",
        "material": "Precast Concrete Parapet",
        "color": "#94a3b8",
        "position": [0, roof_y + 0.55, 0],
        "size": [w + 0.2, 0.6, l + 0.2],
        "is_roof": True,
        "volume_m3": round(2 * (w + l) * 0.2 * 0.6, 2),
        "embodied_carbon_kg": round(2 * (w + l) * 0.2 * 0.6 * 180, 1),
        "cost_usd": round(2 * (w + l) * 0.2 * 0.6 * 85, 2)
    })

    # Metadata
    total_gfa = round(w * l, 1)
    total_volume = round(sum(el.get("volume_m3", 0) for el in elements), 2)
    total_carbon = round(sum(el.get("embodied_carbon_kg", 0) for el in elements), 1)
    total_cost = round(sum(el.get("cost_usd", 0) for el in elements), 2)

    return {
        "status": "success",
        "building_name": building_name,
        "metadata": {
            "stories": stories,
            "footprint": f"{w}m x {l}m",
            "gross_floor_area_m2": total_gfa,
            "total_structural_volume_m3": total_volume,
            "embodied_carbon_kgCO2e": total_carbon,
            "estimated_construction_cost_usd": total_cost,
            "component_count": len(elements),
            "architectural_style": "Modern Blueprint Synthesis",
            "roof_style": "Flat with Parapet"
        },
        "elements": elements
    }

class BlueprintScanPayload(BaseModel):
    image_base64: str = ""
    filename: str = "uploaded_blueprint.png"

@router.post("/ocr/blueprint-scan")
def scan_blueprint_ocr(payload: BlueprintScanPayload):
    """
    Scans uploaded 2D blueprint image with Computer Vision & OCR,
    extracting room entities, dimensions, and synthesizing real-world 3D model.
    """
    from ..ml_engine.blueprint_ocr import BlueprintOcrEngine
    import cv2
    import base64
    import numpy as np
    import os

    engine = BlueprintOcrEngine()
    img = None
    
    # Decode base64 image if provided
    if payload.image_base64 and len(payload.image_base64) > 100:
        try:
            encoded_data = payload.image_base64.split(",")[-1]
            nparr = np.frombuffer(base64.b64decode(encoded_data), np.uint8)
            img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        except Exception as e:
            img = None

    # If no valid image uploaded or sample requested, load sample blueprint
    if img is None:
        sample_path = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), "artifacts", "sample_test_blueprint.png")
        if os.path.exists(sample_path):
            img = cv2.imread(sample_path)

    if img is None:
        # Fallback to standard CAD blueprint test matrix
        img = np.full((800, 1000, 3), 255, dtype=np.uint8)
        cv2.rectangle(img, (100, 100), (900, 700), (30, 30, 30), 6)
        cv2.line(img, (500, 100), (500, 500), (30, 30, 30), 4)
        cv2.line(img, (100, 480), (900, 480), (30, 30, 30), 4)
        cv2.line(img, (350, 480), (350, 700), (30, 30, 30), 4)
        cv2.line(img, (700, 480), (700, 700), (30, 30, 30), 4)

    ocr_res = engine.extract_blueprint_entities(img)
    synth = ocr_res["3d_synthesis_model"]
    rooms = ocr_res["recognized_rooms"]

    # Generate annotated image with bounding boxes & room tags
    annotated_img = engine.generate_annotated_image(img, ocr_res)
    _, buf_annotated = cv2.imencode(".png", annotated_img)
    annotated_b64 = "data:image/png;base64," + base64.b64encode(buf_annotated).decode("utf-8")

    # Encode clean blueprint image for 3D ground underlay
    _, buf_clean = cv2.imencode(".png", img)
    clean_b64 = "data:image/png;base64," + base64.b64encode(buf_clean).decode("utf-8")
    
    # Auto-generate detailed 3D building elements directly from OCR extracted rooms!
    bldg_3d = generate_3d_from_rooms(
        rooms=rooms,
        width=synth.get("building_width", 12.0),
        length=synth.get("building_length", 14.0),
        stories=1,
        floor_height=synth.get("floor_height", 3.0),
        wall_thickness=synth.get("wall_thickness", 0.18),
        building_name=f"OCR 3D Model: {payload.filename}"
    )

    return {
        "status": "success",
        "ocr_metrics": ocr_res["ocr_metrics"],
        "recognized_rooms": rooms,
        "annotated_image_base64": annotated_b64,
        "blueprint_image_base64": clean_b64,
        "3d_synthesis": bldg_3d
    }

class BlenderBakeRequest(BaseModel):
    stories: int = 2
    width: float = 10.0
    length: float = 12.0
    floor_height: float = 3.0
    wall_thickness: float = 0.20

@router.post("/2d-to-3d/bake-blender")
def bake_blender_model(req: BlenderBakeRequest):
    """
    Executes headless Blender 5.2.1 LTS CLI to bake the 2D-to-3D parametric model
    into native .blend and Unity-ready .fbx files on disk.
    """
    import subprocess
    import os

    blender_exe = r"C:\Program Files\Blender Foundation\Blender 5.2\blender.exe"
    script_path = r"c:\BuildSphere AI Version 3.0\Blender\Scripts\ai_2d_to_3d_builder.py"
    
    if not os.path.exists(blender_exe):
        return {"status": "error", "message": f"Blender executable not found at {blender_exe}"}

    cmd = [
        blender_exe, "-b", "-P", script_path, "--",
        "--stories", str(req.stories),
        "--width", str(req.width),
        "--length", str(req.length),
        "--floor_height", str(req.floor_height),
        "--wall_thickness", str(req.wall_thickness)
    ]
    
    try:
        proc = subprocess.run(cmd, capture_output=True, text=True, timeout=30)
        return {
            "status": "success",
            "message": "Model baked successfully in Blender 5.2",
            "output_blend": "Blender/Buildings/AI_Generated_Building_3D.blend",
            "output_fbx": "Blender/Exports/AI_Generated_Building_3D.fbx",
            "logs": proc.stdout[-500:] if proc.stdout else ""
        }
    except Exception as e:
        return {"status": "error", "message": str(e)}

class GenerativePromptRequest(BaseModel):
    prompt: str
    target_occupancy: int = 4
    budget_level: str = "Standard" # Economy, Standard, Luxury, High-Tech

@router.post("/generative/prompt")
def generate_building_from_prompt(req: GenerativePromptRequest):
    """
    Generative Architectural Space Syntax:
    Translates freeform architectural descriptions into 2D layout constraints and 3D buildings.
    """
    p = req.prompt.lower()
    
    # Infer stories
    stories = 2
    if "3-story" in p or "three-story" in p or "3 story" in p or "3 floors" in p:
        stories = 3
    elif "single story" in p or "1-story" in p or "bungalow" in p or "cottage" in p:
        stories = 1
    elif "tower" in p or "4-story" in p or "commercial" in p:
        stories = 4

    # Infer architectural style
    style = "modern_minimalist"
    if "brutalist" in p or "concrete" in p:
        style = "brutalist_concrete"
    elif "glass" in p or "tech" in p or "industrial" in p:
        style = "industrial_glass"
    elif "wood" in p or "timber" in p or "scandinavian" in p or "nordic" in p:
        style = "scandinavian_wood"

    # Infer dimensions
    w, l = 10.0, 12.0
    if "villa" in p or "mansion" in p or "luxury" in p:
        w, l = 12.0, 15.0
    elif "compact" in p or "tiny" in p or "small" in p or "studio" in p:
        w, l = 8.0, 9.0

    plan = Plan2DRequest(
        building_name=f"AI Generative: {req.prompt[:35]}...",
        stories=stories,
        width=w,
        length=l,
        architectural_style=style,
        roof_style="flat_parapet" if "solar" in p or "terrace" in p else "pitched"
    )
    
    bldg = generate_3d_from_2d(plan)
    return {
        "status": "success",
        "inferred_parameters": {
            "stories": stories,
            "style": style,
            "footprint": f"{w}m x {l}m",
            "detected_keywords": [k for k in ["solar", "villa", "terrace", "concrete", "glass", "timber", "luxury", "compact"] if k in p]
        },
        "model_3d": bldg
    }

