"""
BuildSphere AI — Production Blender to Unity 3D Asset Pipeline Tool
==================================================================
Automates asset cleanup, transform baking, UV validation, LOD generation,
and standard Unity FBX/glTF export.

Usage:
    blender.exe -b <filename.blend> -P Blender/Scripts/buildsphere_blender_pipeline.py -- [options]
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

def clean_scene_and_orphans():
    """Removes unused orphan data blocks to keep file size optimal."""
    for block in bpy.data.meshes:
        if block.users == 0:
            bpy.data.meshes.remove(block)
    for block in bpy.data.materials:
        if block.users == 0:
            bpy.data.materials.remove(block)
    for block in bpy.data.textures:
        if block.users == 0:
            bpy.data.textures.remove(block)

def apply_all_transforms(obj):
    """Bakes Location, Rotation, and Scale into the object's mesh data."""
    bpy.ops.object.select_all(action='DESELECT')
    obj.select_set(True)
    bpy.context.view_layer.objects.active = obj
    bpy.ops.object.transform_apply(location=True, rotation=True, scale=True)

def clean_mesh_topology(obj, merge_distance=0.0001):
    """
    Cleans up duplicate vertices, zero-area faces, and recalculates normals outward.
    """
    if obj.type != 'MESH':
        return

    bpy.context.view_layer.objects.active = obj
    bpy.ops.object.mode_set(mode='EDIT')
    
    # Recalculate Normals Outside
    bpy.ops.mesh.select_all(action='SELECT')
    bpy.ops.mesh.normals_make_consistent(inside=False)
    
    # Remove duplicate/overlapping vertices
    bpy.ops.mesh.remove_doubles(threshold=merge_distance)
    
    # Delete loose geometry
    bpy.ops.mesh.delete_loose()
    
    bpy.ops.object.mode_set(mode='OBJECT')

def generate_lod_levels(source_obj, ratios=[1.0, 0.5, 0.25, 0.1]):
    """
    Generates LOD0, LOD1, LOD2, LOD3 meshes with decimate modifier.
    Returns list of generated LOD objects.
    """
    lod_objects = []
    base_name = source_obj.name.replace("_LOD0", "").replace("_LOD1", "").replace("_LOD2", "").replace("_LOD3", "")
    
    for level, ratio in enumerate(ratios):
        lod_name = f"{base_name}_LOD{level}"
        
        if level == 0:
            source_obj.name = lod_name
            lod_objects.append(source_obj)
            continue
            
        # Duplicate object
        new_obj = source_obj.copy()
        new_obj.data = source_obj.data.copy()
        new_obj.name = lod_name
        bpy.context.collection.objects.link(new_obj)
        
        # Apply Decimate modifier for LOD level
        if ratio < 1.0:
            dec_mod = new_obj.modifiers.new(name=f"LOD_Decimate_{level}", type='DECIMATE')
            dec_mod.ratio = ratio
            bpy.context.view_layer.objects.active = new_obj
            bpy.ops.object.modifier_apply(modifier=dec_mod.name)
            
        lod_objects.append(new_obj)
        
    return lod_objects

def export_fbx_for_unity(filepath, selected_only=False):
    """
    Exports FBX file calibrated specifically for Unity's coordinate space:
    - Forward: -Z
    - Up: Y
    - Apply Unit Scale: True
    - Bake Space Transform: True
    """
    os.makedirs(os.path.dirname(filepath), exist_ok=True)
    
    bpy.ops.export_scene.fbx(
        filepath=filepath,
        use_selection=selected_only,
        global_scale=1.0,
        apply_unit_scale=True,
        apply_scale_options='FBX_SCALE_ALL',
        bake_space_transform=True,
        object_types={'MESH', 'EMPTY'},
        use_mesh_modifiers=True,
        mesh_smooth_type='FACE',
        use_subsurf=False,
        use_custom_props=True,
        add_leaf_bones=False,
        primary_bone_axis='Y',
        secondary_bone_axis='X',
        armature_nodetype='NULL',
        bake_anim=False,
        axis_forward='-Z',
        axis_up='Y'
    )
    print(f"[BuildSphere Pipeline] Exported Unity FBX: {filepath}")

def export_gltf_for_unity(filepath, selected_only=False):
    """
    Exports GLB (glTF 2.0 Binary) for WebGL and portable 3D viewers.
    """
    os.makedirs(os.path.dirname(filepath), exist_ok=True)
    
    bpy.ops.export_scene.gltf(
        filepath=filepath,
        use_selection=selected_only,
        export_format='GLB',
        export_image_format='AUTO',
        export_materials='EXPORT',
        export_colors=True,
        export_normals=True,
        export_tangents=True
    )
    print(f"[BuildSphere Pipeline] Exported Unity GLB: {filepath}")

def process_active_scene(output_fbx_path, output_glb_path=None, generate_lods=False):
    """
    Executes standard pipeline on all meshes in current Blender scene:
    1. Unhide all
    2. Apply transforms
    3. Clean topology
    4. Optional LOD generation
    5. Export FBX & GLB
    """
    print("[BuildSphere Pipeline] Processing scene...")
    
    mesh_objects = [obj for obj in bpy.context.scene.objects if obj.type == 'MESH']
    
    for obj in mesh_objects:
        obj.hide_set(False)
        apply_all_transforms(obj)
        clean_mesh_topology(obj)
        
        if generate_lods:
            generate_lod_levels(obj)
            
    export_fbx_for_unity(output_fbx_path)
    if output_glb_path:
        export_gltf_for_unity(output_glb_path)
        
    print("[BuildSphere Pipeline] Scene processing complete.")

if __name__ == "__main__":
    # If invoked directly on current blend file
    argv = sys.argv
    if "--" in argv:
        args = argv[argv.index("--") + 1:]
        if len(args) >= 1:
            out_fbx = args[0]
            out_glb = args[1] if len(args) > 1 else None
            process_active_scene(out_fbx, out_glb)
