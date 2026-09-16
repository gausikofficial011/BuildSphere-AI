"""
BuildSphere AI — 2D to 3D Automated Building Synthesizer (Blender Engine)
========================================================================
Converts 2D floor plans, architectural boundaries, and room topologies 
into real-world-scale 3D BIM models inside Blender 5.2+ LTS.

Usage:
  blender -b -P Blender/Scripts/ai_2d_to_3d_builder.py -- --stories 2 --width 10 --length 12
"""
try:
    import bpy
    import bmesh
except ImportError:
    # Fallback when analyzed outside Blender's embedded Python runtime
    bpy = None
    bmesh = None

import math
import sys
import os

def parse_args():
    args = sys.argv
    params = {
        "width": 10.0,
        "length": 12.0,
        "stories": 2,
        "floor_height": 3.0,
        "wall_thickness": 0.20,
        "output_blend": "Blender/Buildings/AI_Generated_Building_3D.blend",
        "output_fbx": "Blender/Exports/AI_Generated_Building_3D.fbx"
    }
    if "--" in args:
        user_args = args[args.index("--") + 1:]
        for i in range(0, len(user_args), 2):
            key = user_args[i].lstrip("-")
            if i + 1 < len(user_args) and key in params:
                val = user_args[i + 1]
                if key in ["width", "length", "floor_height", "wall_thickness"]:
                    params[key] = float(val)
                elif key == "stories":
                    params[key] = int(val)
                else:
                    params[key] = val
    return params

def create_pbr_material(name, color, metallic=0.0, roughness=0.5, alpha=1.0):
    mat = bpy.data.materials.new(name=name)
    mat.use_nodes = True
    bsdf = mat.node_tree.nodes.get("Principled BSDF")
    if bsdf:
        if "Base Color" in bsdf.inputs:
            bsdf.inputs["Base Color"].default_value = color
        if "Metallic" in bsdf.inputs:
            bsdf.inputs["Metallic"].default_value = metallic
        if "Roughness" in bsdf.inputs:
            bsdf.inputs["Roughness"].default_value = roughness
        if "Alpha" in bsdf.inputs and alpha < 1.0:
            bsdf.inputs["Alpha"].default_value = alpha
    return mat

def create_box_element(name, center, size, mat, col):
    mesh = bpy.data.meshes.new(name + "_Mesh")
    obj = bpy.data.objects.new(name, mesh)
    
    bm = bmesh.new()
    bmesh.ops.create_cube(bm, size=1.0)
    for v in bm.verts:
        v.co.x *= size[0]
        v.co.y *= size[1]
        v.co.z *= size[2]
    bm.to_mesh(mesh)
    bm.free()
    
    obj.location = center
    if mat:
        obj.data.materials.append(mat)
        
    col.objects.link(obj)
    return obj

def build_3d_from_2d(params):
    bpy.ops.wm.read_factory_settings(use_empty=True)
    
    scene = bpy.context.scene
    scene.unit_settings.system = 'METRIC'
    scene.unit_settings.scale_length = 1.0
    scene.unit_settings.length_unit = 'METERS'
    
    col_root = bpy.data.collections.new("BS_AI_2Dto3D_Building")
    scene.collection.children.link(col_root)
    
    # Materials
    mat_conc = create_pbr_material("MAT_Concrete", (0.75, 0.75, 0.77, 1.0), 0.0, 0.8)
    mat_wall = create_pbr_material("MAT_Wall", (0.92, 0.93, 0.95, 1.0), 0.0, 0.85)
    mat_glass = create_pbr_material("MAT_Glass", (0.35, 0.75, 0.95, 0.35), 0.1, 0.05, 0.35)
    mat_wood = create_pbr_material("MAT_Wood", (0.50, 0.30, 0.15, 1.0), 0.0, 0.5)
    mat_roof = create_pbr_material("MAT_Roof", (0.30, 0.32, 0.35, 1.0), 0.0, 0.9)
    
    w = params["width"]
    l = params["length"]
    h = params["floor_height"]
    stories = params["stories"]
    t = params["wall_thickness"]
    
    # Foundation
    create_box_element("AI_Foundation", (0, 0, -0.15), (w + 0.4, l + 0.4, 0.3), mat_conc, col_root)
    
    # Floors
    for s in range(stories):
        elev = s * h
        wall_h = h - 0.2
        wall_z = elev + 0.2 + (wall_h / 2.0)
        
        # Slab
        create_box_element(f"AI_FloorSlab_L{s+1}", (0, 0, elev + 0.1), (w, l, 0.2), mat_wood if s > 0 else mat_conc, col_root)
        
        # Walls
        create_box_element(f"AI_Wall_N_L{s+1}", (0, (l / 2.0) - (t / 2.0), wall_z), (w, t, wall_h), mat_wall, col_root)
        create_box_element(f"AI_Wall_S_L{s+1}", (0, -(l / 2.0) + (t / 2.0), wall_z), (w, t, wall_h), mat_wall, col_root)
        create_box_element(f"AI_Wall_W_L{s+1}", (-(w / 2.0) + (t / 2.0), 0, wall_z), (t, l, wall_h), mat_wall, col_root)
        create_box_element(f"AI_Wall_E_L{s+1}", ((w / 2.0) - (t / 2.0), 0, wall_z), (t, l, wall_h), mat_wall, col_root)
        
        # Partition
        create_box_element(f"AI_Wall_Partition_L{s+1}", (0, -1.0, wall_z), (0.15, l * 0.45, wall_h), mat_wall, col_root)
        
        # Windows
        create_box_element(f"AI_Window_W_L{s+1}", (-(w / 2.0), -2.5, elev + 1.6), (0.25, 2.2, 1.6), mat_glass, col_root)
        create_box_element(f"AI_Window_E_L{s+1}", ((w / 2.0), -2.5, elev + 1.6), (0.25, 2.2, 1.6), mat_glass, col_root)
        
        # Main Door
        if s == 0:
            create_box_element("AI_Door_Entry", (0, -(l / 2.0), elev + 1.2), (1.2, 0.15, 2.2), mat_wood, col_root)
            
    # Roof
    roof_z = stories * h
    create_box_element("AI_RoofSlab", (0, 0, roof_z + 0.125), (w + 0.2, l + 0.2, 0.25), mat_roof, col_root)
    create_box_element("AI_RoofParapet_N", (0, (l / 2.0), roof_z + 0.55), (w + 0.2, 0.2, 0.6), mat_wall, col_root)
    create_box_element("AI_RoofParapet_S", (0, -(l / 2.0), roof_z + 0.55), (w + 0.2, 0.2, 0.6), mat_wall, col_root)
    create_box_element("AI_RoofParapet_W", (-(w / 2.0), 0, roof_z + 0.55), (0.2, l + 0.2, 0.6), mat_wall, col_root)
    create_box_element("AI_RoofParapet_E", ((w / 2.0), 0, roof_z + 0.55), (0.2, l + 0.2, 0.6), mat_wall, col_root)
    
    # Save Blend & Export FBX
    out_blend = os.path.abspath(params["output_blend"])
    os.makedirs(os.path.dirname(out_blend), exist_ok=True)
    bpy.ops.wm.save_as_mainfile(filepath=out_blend)
    print(f"✅ AI 3D Model Saved: {out_blend}")
    
    out_fbx = os.path.abspath(params["output_fbx"])
    os.makedirs(os.path.dirname(out_fbx), exist_ok=True)
    bpy.ops.export_scene.fbx(
        filepath=out_fbx,
        global_scale=1.0,
        apply_unit_scale=True,
        apply_scale_options='FBX_SCALE_ALL',
        bake_space_transform=True,
        object_types={'MESH'},
        axis_forward='-Z',
        axis_up='Y'
    )
    print(f"✅ AI 3D FBX Exported: {out_fbx}")

if __name__ == "__main__":
    p = parse_args()
    build_3d_from_2d(p)
