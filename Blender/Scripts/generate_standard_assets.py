"""
BuildSphere AI — Standard Modular 3D Asset Generator
===================================================
Generates clean, production-calibrated modular architectural, furniture,
construction, and infrastructure 3D models in Blender 5.2+.

Saves .blend files to Blender/<Category>/
Exports .fbx to Blender/Exports/ and Unity Assets/Models/<Category>/
"""
try:
    import bpy
    import bmesh
except ImportError:
    bpy = None
    bmesh = None

import os
import sys
import shutil

# Resolve workspace root from current script location
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.abspath(os.path.join(SCRIPT_DIR, "..", ".."))
BLENDER_ROOT = os.path.join(PROJECT_ROOT, "Blender")
UNITY_ROOT_1 = os.path.join(PROJECT_ROOT, "buildsphere ai 3d", "Assets", "Models")
UNITY_ROOT_2 = os.path.join(PROJECT_ROOT, "BuildSphere 3D", "Assets", "Models")

def reset_blender_scene():
    """Wipes all existing objects, materials, meshes, and collections in Blender."""
    bpy.ops.wm.read_factory_settings(use_empty=True)
    if bpy.context.scene.collection:
        for obj in list(bpy.context.scene.collection.objects):
            bpy.data.objects.remove(obj, do_unlink=True)
    for mesh in list(bpy.data.meshes):
        bpy.data.meshes.remove(mesh, do_unlink=True)
    for mat in list(bpy.data.materials):
        bpy.data.materials.remove(mat, do_unlink=True)

def get_or_create_material(name, diffuse_color=(0.8, 0.8, 0.8, 1.0), metallic=0.0, roughness=0.5):
    """Creates a calibrated Principled BSDF material in Blender."""
    if name in bpy.data.materials:
        return bpy.data.materials[name]
    mat = bpy.data.materials.new(name=name)
    mat.use_nodes = True
    bsdf = mat.node_tree.nodes.get("Principled BSDF")
    if bsdf:
        if "Base Color" in bsdf.inputs:
            bsdf.inputs["Base Color"].default_value = diffuse_color
        if "Metallic" in bsdf.inputs:
            bsdf.inputs["Metallic"].default_value = metallic
        if "Roughness" in bsdf.inputs:
            bsdf.inputs["Roughness"].default_value = roughness
    return mat

def apply_transforms_and_uv_unwrap(obj):
    """Bakes transforms, recalculates normals, and generates UV lightmap coordinates."""
    bpy.ops.object.select_all(action='DESELECT')
    obj.select_set(True)
    bpy.context.view_layer.objects.active = obj
    
    # Bake transforms
    bpy.ops.object.transform_apply(location=True, rotation=True, scale=True)
    
    # Edit mode cleanup and UV smart unwrap
    bpy.ops.object.mode_set(mode='EDIT')
    bpy.ops.mesh.select_all(action='SELECT')
    bpy.ops.mesh.normals_make_consistent(inside=False)
    bpy.ops.mesh.remove_doubles(threshold=0.0001)
    bpy.ops.uv.smart_project(angle_limit=66.0, island_margin=0.02)
    bpy.ops.object.mode_set(mode='OBJECT')

def export_asset(name, category):
    """Saves .blend and exports .fbx and copies to Unity directories."""
    blend_dir = os.path.join(BLENDER_ROOT, category)
    export_dir = os.path.join(BLENDER_ROOT, "Exports")
    os.makedirs(blend_dir, exist_ok=True)
    os.makedirs(export_dir, exist_ok=True)
    
    blend_path = os.path.join(blend_dir, f"{name}.blend")
    fbx_path = os.path.join(export_dir, f"{name}.fbx")
    
    # Save .blend
    bpy.ops.wm.save_as_mainfile(filepath=blend_path)
    print(f"  -> Saved Blender file: {blend_path}")
    
    # Export FBX with Unity Standards (-Z forward, Y up)
    bpy.ops.export_scene.fbx(
        filepath=fbx_path,
        global_scale=1.0,
        apply_unit_scale=True,
        apply_scale_options='FBX_SCALE_ALL',
        bake_space_transform=True,
        object_types={'MESH'},
        mesh_smooth_type='FACE',
        axis_forward='-Z',
        axis_up='Y'
    )
    print(f"  -> Exported FBX: {fbx_path}")
    
    # Copy to Unity Assets/Models directories
    for unity_root in [UNITY_ROOT_1, UNITY_ROOT_2]:
        dest_dir = os.path.join(unity_root, category)
        os.makedirs(dest_dir, exist_ok=True)
        dest_file = os.path.join(dest_dir, f"{name}.fbx")
        shutil.copyfile(fbx_path, dest_file)
        print(f"  -> Copied to Unity: {dest_file}")

# ==============================================================================
# MODEL BUILDERS
# ==============================================================================

def create_modular_wall():
    """Builds Building_Modular_Wall_01: 3.0m wide, 3.5m high, 0.2m deep with baseboard."""
    reset_blender_scene()
    print("[1/9] Generating Building_Modular_Wall_01...")
    
    mat_wall = get_or_create_material("MAT_Wall_Paint_White", (0.92, 0.93, 0.94, 1.0), 0.0, 0.2)
    mat_trim = get_or_create_material("MAT_Wood_Oak", (0.58, 0.38, 0.22, 1.0), 0.0, 0.35)
    
    # Main wall body (origin at bottom center)
    bpy.ops.mesh.primitive_cube_add(size=1.0, location=(0, 0, 1.75))
    wall = bpy.context.active_object
    wall.name = "Building_Modular_Wall_01"
    wall.scale = (3.0, 0.2, 3.5)
    wall.data.materials.append(mat_wall)
    
    # Baseboard trim
    bpy.ops.mesh.primitive_cube_add(size=1.0, location=(0, 0, 0.075))
    trim = bpy.context.active_object
    trim.name = "Wall_Baseboard_Trim"
    trim.scale = (3.02, 0.22, 0.15)
    trim.data.materials.append(mat_trim)
    
    # Join meshes
    bpy.ops.object.select_all(action='DESELECT')
    trim.select_set(True)
    wall.select_set(True)
    bpy.context.view_layer.objects.active = wall
    bpy.ops.object.join()
    
    apply_transforms_and_uv_unwrap(wall)
    export_asset("Building_Modular_Wall_01", "Buildings")

def create_modular_column():
    """Builds Building_Modular_Column_01: 0.5m x 0.5m x 3.5m concrete column with beveled edges."""
    reset_blender_scene()
    print("[2/9] Generating Building_Modular_Column_01...")
    
    mat_conc = get_or_create_material("MAT_Concrete_Rough", (0.55, 0.55, 0.56, 1.0), 0.0, 0.8)
    
    bpy.ops.mesh.primitive_cube_add(size=1.0, location=(0, 0, 1.75))
    col = bpy.context.active_object
    col.name = "Building_Modular_Column_01"
    col.scale = (0.5, 0.5, 3.5)
    col.data.materials.append(mat_conc)
    
    # Apply scale then add bevel modifier
    bpy.ops.object.transform_apply(scale=True)
    bev = col.modifiers.new(name="Bevel", type='BEVEL')
    bev.width = 0.02
    bev.segments = 2
    bpy.ops.object.modifier_apply(modifier=bev.name)
    
    apply_transforms_and_uv_unwrap(col)
    export_asset("Building_Modular_Column_01", "Buildings")

def create_modular_floor_slab():
    """Builds Building_Modular_FloorSlab_01: 4.0m x 4.0m x 0.3m structural concrete floor."""
    reset_blender_scene()
    print("[3/9] Generating Building_Modular_FloorSlab_01...")
    
    mat_conc = get_or_create_material("MAT_Concrete_Smooth", (0.72, 0.72, 0.74, 1.0), 0.0, 0.25)
    
    bpy.ops.mesh.primitive_cube_add(size=1.0, location=(0, 0, 0.15))
    slab = bpy.context.active_object
    slab.name = "Building_Modular_FloorSlab_01"
    slab.scale = (4.0, 4.0, 0.3)
    slab.data.materials.append(mat_conc)
    
    apply_transforms_and_uv_unwrap(slab)
    export_asset("Building_Modular_FloorSlab_01", "Buildings")

def create_modular_window():
    """Builds Building_Modular_Window_01: 2.0m x 2.2m modern commercial window with mullions and glass."""
    reset_blender_scene()
    print("[4/9] Generating Building_Modular_Window_01...")
    
    mat_metal = get_or_create_material("MAT_Metal_Brushed", (0.8, 0.82, 0.85, 1.0), 0.9, 0.3)
    mat_glass = get_or_create_material("MAT_Glass_CurtainWall", (0.65, 0.85, 0.95, 0.45), 0.2, 0.05)
    
    # Outer frame (2.0 x 0.15 x 2.2)
    bpy.ops.mesh.primitive_cube_add(size=1.0, location=(0, 0, 1.1))
    frame = bpy.context.active_object
    frame.name = "Building_Modular_Window_01"
    frame.scale = (2.0, 0.15, 2.2)
    frame.data.materials.append(mat_metal)
    bpy.ops.object.transform_apply(scale=True)
    
    # Glass pane (1.8m x 0.02m x 2.0m)
    bpy.ops.mesh.primitive_cube_add(size=1.0, location=(0, 0, 1.1))
    glass = bpy.context.active_object
    glass.name = "Window_Glass_Pane"
    glass.scale = (1.8, 0.02, 2.0)
    glass.data.materials.append(mat_glass)
    bpy.ops.object.transform_apply(scale=True)
    
    # Join
    bpy.ops.object.select_all(action='DESELECT')
    glass.select_set(True)
    frame.select_set(True)
    bpy.context.view_layer.objects.active = frame
    bpy.ops.object.join()
    
    apply_transforms_and_uv_unwrap(frame)
    export_asset("Building_Modular_Window_01", "Buildings")

def create_modular_door():
    """Builds Building_Modular_Door_01: 1.0m x 2.2m architectural heavy duty fire-rated door."""
    reset_blender_scene()
    print("[5/9] Generating Building_Modular_Door_01...")
    
    mat_steel = get_or_create_material("MAT_Steel_Structural", (0.25, 0.28, 0.32, 1.0), 0.85, 0.4)
    mat_wood = get_or_create_material("MAT_Wood_Oak", (0.58, 0.38, 0.22, 1.0), 0.0, 0.35)
    mat_handle = get_or_create_material("MAT_Metal_Brushed", (0.8, 0.82, 0.85, 1.0), 0.9, 0.2)
    
    # Steel frame
    bpy.ops.mesh.primitive_cube_add(size=1.0, location=(0, 0, 1.1))
    frame = bpy.context.active_object
    frame.name = "Building_Modular_Door_01"
    frame.scale = (1.0, 0.15, 2.2)
    frame.data.materials.append(mat_steel)
    bpy.ops.object.transform_apply(scale=True)
    
    # Door leaf
    bpy.ops.mesh.primitive_cube_add(size=1.0, location=(0, 0, 1.08))
    leaf = bpy.context.active_object
    leaf.name = "Door_Leaf"
    leaf.scale = (0.88, 0.06, 2.1)
    leaf.data.materials.append(mat_wood)
    bpy.ops.object.transform_apply(scale=True)
    
    # Handle
    bpy.ops.mesh.primitive_cylinder_add(radius=0.02, depth=0.12, location=(0.35, 0.05, 1.0), rotation=(1.57, 0, 0))
    handle = bpy.context.active_object
    handle.name = "Door_Handle"
    handle.data.materials.append(mat_handle)
    bpy.ops.object.transform_apply(location=True, rotation=True, scale=True)
    
    # Join
    bpy.ops.object.select_all(action='DESELECT')
    handle.select_set(True)
    leaf.select_set(True)
    frame.select_set(True)
    bpy.context.view_layer.objects.active = frame
    bpy.ops.object.join()
    
    apply_transforms_and_uv_unwrap(frame)
    export_asset("Building_Modular_Door_01", "Buildings")

def create_office_desk():
    """Builds Furniture_OfficeDesk_01: 1.6m x 0.8m x 0.75m modern executive workstation."""
    reset_blender_scene()
    print("[6/9] Generating Furniture_OfficeDesk_01...")
    
    mat_wood = get_or_create_material("MAT_Wood_Oak", (0.58, 0.38, 0.22, 1.0), 0.0, 0.35)
    mat_steel = get_or_create_material("MAT_Steel_Structural", (0.25, 0.28, 0.32, 1.0), 0.85, 0.4)
    
    # Desktop slab
    bpy.ops.mesh.primitive_cube_add(size=1.0, location=(0, 0, 0.73))
    desk = bpy.context.active_object
    desk.name = "Furniture_OfficeDesk_01"
    desk.scale = (1.6, 0.8, 0.04)
    desk.data.materials.append(mat_wood)
    bpy.ops.object.transform_apply(scale=True)
    
    # Steel legs (left & right frames)
    for x_pos in [-0.75, 0.75]:
        bpy.ops.mesh.primitive_cube_add(size=1.0, location=(x_pos, 0, 0.35))
        leg = bpy.context.active_object
        leg.scale = (0.05, 0.75, 0.7)
        leg.data.materials.append(mat_steel)
        bpy.ops.object.transform_apply(scale=True)
        
        # Join into main desk
        bpy.ops.object.select_all(action='DESELECT')
        leg.select_set(True)
        desk.select_set(True)
        bpy.context.view_layer.objects.active = desk
        bpy.ops.object.join()
        
    apply_transforms_and_uv_unwrap(desk)
    export_asset("Furniture_OfficeDesk_01", "Furniture")

def create_office_chair():
    """Builds Furniture_OfficeChair_01: 0.65m x 0.65m x 1.05m ergonomic task chair."""
    reset_blender_scene()
    print("[7/9] Generating Furniture_OfficeChair_01...")
    
    mat_plastic = get_or_create_material("MAT_Plastic_Matte", (0.2, 0.2, 0.22, 1.0), 0.0, 0.5)
    mat_metal = get_or_create_material("MAT_Metal_Brushed", (0.8, 0.82, 0.85, 1.0), 0.9, 0.3)
    
    # 5-star base center
    bpy.ops.mesh.primitive_cylinder_add(radius=0.3, depth=0.06, location=(0, 0, 0.08))
    chair = bpy.context.active_object
    chair.name = "Furniture_OfficeChair_01"
    chair.data.materials.append(mat_plastic)
    
    # Central gas cylinder
    bpy.ops.mesh.primitive_cylinder_add(radius=0.04, depth=0.35, location=(0, 0, 0.25))
    cylinder = bpy.context.active_object
    cylinder.data.materials.append(mat_metal)
    
    # Seat cushion
    bpy.ops.mesh.primitive_cube_add(size=1.0, location=(0, 0, 0.46))
    seat = bpy.context.active_object
    seat.scale = (0.5, 0.5, 0.08)
    seat.data.materials.append(mat_plastic)
    bpy.ops.object.transform_apply(scale=True)
    
    # Ergonomic backrest
    bpy.ops.mesh.primitive_cube_add(size=1.0, location=(0, -0.22, 0.78), rotation=(0.1, 0, 0))
    back = bpy.context.active_object
    back.scale = (0.46, 0.06, 0.55)
    back.data.materials.append(mat_plastic)
    bpy.ops.object.transform_apply(location=True, rotation=True, scale=True)
    
    # Join parts
    bpy.ops.object.select_all(action='DESELECT')
    back.select_set(True)
    seat.select_set(True)
    cylinder.select_set(True)
    chair.select_set(True)
    bpy.context.view_layer.objects.active = chair
    bpy.ops.object.join()
    
    apply_transforms_and_uv_unwrap(chair)
    export_asset("Furniture_OfficeChair_01", "Furniture")

def create_tower_crane():
    """Builds Construction_TowerCrane_01: 15m mast, 12m horizontal jib, counterweight."""
    reset_blender_scene()
    print("[8/9] Generating Construction_TowerCrane_01...")
    
    mat_yellow = get_or_create_material("MAT_Crane_Yellow", (0.95, 0.72, 0.05, 1.0), 0.2, 0.5)
    mat_steel = get_or_create_material("MAT_Steel_Structural", (0.25, 0.28, 0.32, 1.0), 0.85, 0.4)
    mat_conc = get_or_create_material("MAT_Concrete_Rough", (0.55, 0.55, 0.56, 1.0), 0.0, 0.8)
    
    # Vertical mast tower (1.2m x 1.2m x 15m)
    bpy.ops.mesh.primitive_cube_add(size=1.0, location=(0, 0, 7.5))
    crane = bpy.context.active_object
    crane.name = "Construction_TowerCrane_01"
    crane.scale = (1.2, 1.2, 15.0)
    crane.data.materials.append(mat_yellow)
    bpy.ops.object.transform_apply(scale=True)
    
    # Operator Cab (1.5m x 1.2m x 1.8m)
    bpy.ops.mesh.primitive_cube_add(size=1.0, location=(0.9, 0, 14.5))
    cab = bpy.context.active_object
    cab.scale = (1.5, 1.2, 1.8)
    cab.data.materials.append(mat_steel)
    bpy.ops.object.transform_apply(scale=True)
    
    # Main horizontal Jib (12m forward)
    bpy.ops.mesh.primitive_cube_add(size=1.0, location=(6.0, 0, 15.5))
    jib = bpy.context.active_object
    jib.scale = (12.0, 0.8, 1.0)
    jib.data.materials.append(mat_yellow)
    bpy.ops.object.transform_apply(scale=True)
    
    # Counter-jib (4m backward) with concrete weight
    bpy.ops.mesh.primitive_cube_add(size=1.0, location=(-2.0, 0, 15.5))
    counter_jib = bpy.context.active_object
    counter_jib.scale = (4.0, 0.8, 1.0)
    counter_jib.data.materials.append(mat_yellow)
    bpy.ops.object.transform_apply(scale=True)
    
    bpy.ops.mesh.primitive_cube_add(size=1.0, location=(-3.2, 0, 15.2))
    weight = bpy.context.active_object
    weight.scale = (1.2, 1.4, 1.2)
    weight.data.materials.append(mat_conc)
    bpy.ops.object.transform_apply(scale=True)
    
    # Join parts
    bpy.ops.object.select_all(action='DESELECT')
    weight.select_set(True)
    counter_jib.select_set(True)
    jib.select_set(True)
    cab.select_set(True)
    crane.select_set(True)
    bpy.context.view_layer.objects.active = crane
    bpy.ops.object.join()
    
    apply_transforms_and_uv_unwrap(crane)
    export_asset("Construction_TowerCrane_01", "Construction")

def create_straight_road():
    """Builds Infrastructure_Road_Straight_01: 8.0m dual-lane roadway with curbs (10m long)."""
    reset_blender_scene()
    print("[9/9] Generating Infrastructure_Road_Straight_01...")
    
    mat_asphalt = get_or_create_material("MAT_Asphalt_Road", (0.22, 0.22, 0.24, 1.0), 0.0, 0.8)
    mat_curb = get_or_create_material("MAT_Concrete_Rough", (0.6, 0.6, 0.62, 1.0), 0.0, 0.7)
    
    # Asphalt surface (8.0m wide x 10.0m long x 0.1m thick)
    bpy.ops.mesh.primitive_cube_add(size=1.0, location=(0, 5.0, 0.05))
    road = bpy.context.active_object
    road.name = "Infrastructure_Road_Straight_01"
    road.scale = (8.0, 10.0, 0.1)
    road.data.materials.append(mat_asphalt)
    bpy.ops.object.transform_apply(scale=True)
    
    # Curbs (left & right)
    for x_pos in [-4.3, 4.3]:
        bpy.ops.mesh.primitive_cube_add(size=1.0, location=(x_pos, 5.0, 0.15))
        curb = bpy.context.active_object
        curb.scale = (0.6, 10.0, 0.2)
        curb.data.materials.append(mat_curb)
        bpy.ops.object.transform_apply(scale=True)
        
        # Join into main road
        bpy.ops.object.select_all(action='DESELECT')
        curb.select_set(True)
        road.select_set(True)
        bpy.context.view_layer.objects.active = road
        bpy.ops.object.join()
        
    apply_transforms_and_uv_unwrap(road)
    export_asset("Infrastructure_Road_Straight_01", "Infrastructure")

# ==============================================================================
# MAIN RUNNER
# ==============================================================================

def main():
    print("=" * 60)
    print("BuildSphere AI — Generating Production 3D Asset Library")
    print("=" * 60)
    
    create_modular_wall()
    create_modular_column()
    create_modular_floor_slab()
    create_modular_window()
    create_modular_door()
    create_office_desk()
    create_office_chair()
    create_tower_crane()
    create_straight_road()
    
    print("=" * 60)
    print("ALL 9 BUILDSPHERE 3D ASSETS SUCCESSFULLY GENERATED & EXPORTED!")
    print("=" * 60)

if __name__ == "__main__":
    main()
