# BuildSphere AI — Blender 5.2+ → Unity 6 (URP) 3D Asset Pipeline Guide

Welcome to the **BuildSphere AI** production 3D asset engineering standard. This document defines the end-to-end workflow for creating, optimizing, exporting, importing, and integrating 3D architectural, structural, MEP, furniture, construction, and infrastructure assets into the BuildSphere Digital Twin ecosystem.

---

## Table of Contents
1. [Blender Environment & Installation](#1-blender-environment--installation)
2. [Directory Structure & Organization](#2-directory-structure--organization)
3. [Modeling & Scale Standards](#3-modeling--scale-standards)
4. [UV Mapping & Material Guidelines (URP PBR)](#4-uv-mapping--material-guidelines-urp-pbr)
5. [Blender Export Standards (FBX & GLB)](#5-blender-export-standards-fbx--glb)
6. [Unity Import Pipeline & Postprocessing](#6-unity-import-pipeline--postprocessing)
7. [BIM Metadata & `BuildingComponentController`](#7-bim-metadata--buildingcomponentcontroller)
8. [LOD (Level of Detail) & Real-Time Performance](#8-lod-level-of-detail--real-time-performance)
9. [BuildSphere Editor Suite (1-Click Automation)](#9-buildsphere-editor-suite-1-click-automation)
10. [Troubleshooting Guide](#10-troubleshooting-guide)
11. [Creating Your Next Asset — Step-by-Step](#11-creating-your-next-asset--step-by-step)

---

## 1. Blender Environment & Installation

### Recommended Version
- **Blender 5.2+ LTS** (or Blender 4.2+ LTS)
- Official Download: [https://www.blender.org/download/](https://www.blender.org/download/)
- Windows Default Path: `C:\Program Files\Blender Foundation\Blender 5.2\blender.exe`

### Blender Unit Setup
Always configure Blender units before modeling:
1. Open **Scene Properties** tab (right sidebar).
2. Under **Units**:
   - **Unit System**: `Metric`
   - **Unit Scale**: `1.0`
   - **Length**: `Meters`
   - **Mass**: `Kilograms`
   - **Angle**: `Degrees`

---

## 2. Directory Structure & Organization

BuildSphere uses a strictly mirrored folder architecture between Blender source workspaces and Unity engine assets:

```text
BuildSphere/
├── Assets/                                 <-- Unity Active Assets
│   ├── Models/
│   │   ├── Buildings/                     # Modular walls, slabs, columns, windows, doors, roofs
│   │   ├── Furniture/                     # Desks, chairs, workstations, lab benches
│   │   ├── Construction/                  # Cranes, scaffolding, excavators, formwork
│   │   ├── Infrastructure/                # Roads, bridges, curbs, utility conduits
│   │   └── Environment/                   # Terrain meshes, trees, vegetation
│   ├── Materials/
│   │   ├── Architecture/                  # Concrete, glass, wood, brick, plaster
│   │   ├── Construction/                  # Steel, brushed metal, crane yellow, plastic
│   │   ├── Environment/                   # Asphalt, soil, grass
│   │   └── System/                        # Selection highlight, warning, status overlays
│   ├── Textures/                          # PBR texture maps (Albedo, Normal, MaskMap)
│   ├── Prefabs/
│   │   ├── Buildings/
│   │   ├── Furniture/
│   │   ├── Construction/
│   │   ├── Infrastructure/
│   │   └── Modular/                       # Reusable snapping components
│   ├── Scenes/
│   └── Scripts/
│
├── Blender/                               <-- Blender Source Workspaces
│   ├── Buildings/                         # .blend source files
│   ├── Furniture/
│   ├── Construction/
│   ├── Environment/
│   ├── Infrastructure/
│   ├── Textures/                          # Source texture maps
│   ├── Exports/                           # Intermediate .fbx / .glb exports
│   ├── Scripts/                           # Python automation scripts
│   └── Documentation/                     # Cheatsheets and references
│
└── Documentation/                         # Master Project Engineering Guides
```

---

## 3. Modeling & Scale Standards

### Coordinate System & Orientation
- **Scale**: `1 Unit = 1 Meter (1.0m)`
- **Forward Axis**: `-Z Forward` (Unity Forward is `+Z`; Blender FBX export uses `-Z Forward, Y Up` to match Unity perfectly)
- **Up Axis**: `+Y Up`
- **Pivot Point (Origin)**:
  - **Floors & Slabs**: Bottom corner `(0, 0, 0)` or bottom center.
  - **Walls & Columns**: Bottom center on ground plane `(0, 0, 0)`.
  - **Doors & Windows**: Bottom hinge corner or bottom center `(0, 0, 0)`.
  - **Furniture & Equipment**: Center point on the bottom floor contact plane `(X=0, Y=0, Z=0)`.

### Modeling Checklist Before Export
1. **Apply Transforms**: Press `Ctrl + A` in Blender → select **All Transforms** (Location, Rotation, Scale must be `0, 0, 0` and `1, 1, 1`).
2. **Normals Verification**: In Edit Mode, press `Shift + N` (Recalculate Normals Outside).
3. **Remove Doubles**: In Edit Mode, select all (`A`) → `M` → **By Distance** (threshold `0.0001m`).
4. **Delete Unused Loose Geometry**: `Mesh → Clean Up → Delete Loose`.
5. **Meaningful Naming**:
   - ✅ `Building_Modular_Wall_01`
   - ✅ `Furniture_OfficeDesk_01`
   - ❌ `Cube.001`, `Plane`, `Object_02`

---

## 4. UV Mapping & Material Guidelines (URP PBR)

BuildSphere uses **Unity Universal Render Pipeline (URP)** with physically based `Universal Render Pipeline/Lit` shaders.

### Material Palette Reference

| Material Asset | Shader | Base Color | Metallic | Smoothness | Alpha / Mode |
|---|---|---|---|---|---|
| `MAT_Concrete_Smooth` | URP/Lit | `(0.72, 0.72, 0.74)` | `0.00` | `0.25` | Opaque |
| `MAT_Concrete_Rough` | URP/Lit | `(0.55, 0.55, 0.56)` | `0.00` | `0.10` | Opaque |
| `MAT_Steel_Structural` | URP/Lit | `(0.25, 0.28, 0.32)` | `0.85` | `0.65` | Opaque |
| `MAT_Glass_CurtainWall`| URP/Lit | `(0.65, 0.85, 0.95)` | `0.20` | `0.95` | Transparent (`a=0.45`) |
| `MAT_Wood_Oak` | URP/Lit | `(0.58, 0.38, 0.22)` | `0.00` | `0.35` | Opaque |
| `MAT_Brick_Red` | URP/Lit | `(0.68, 0.28, 0.22)` | `0.00` | `0.15` | Opaque |
| `MAT_Ceramic_Tiles` | URP/Lit | `(0.88, 0.88, 0.90)` | `0.05` | `0.80` | Opaque |
| `MAT_Wall_Paint_White` | URP/Lit | `(0.92, 0.93, 0.94)` | `0.00` | `0.20` | Opaque |
| `MAT_Crane_Yellow` | URP/Lit | `(0.95, 0.72, 0.05)` | `0.20` | `0.60` | Opaque |
| `MAT_Asphalt_Road` | URP/Lit | `(0.22, 0.22, 0.24)` | `0.00` | `0.20` | Opaque |
| `MAT_Component_Highlight`| URP/Lit | `(0.22, 0.74, 0.97)` | `0.10` | `0.80` | Transparent (`a=0.85`) |

---

## 5. Blender Export Standards (FBX & GLB)

### Standard FBX Settings for Unity
When exporting manually from Blender:
- **Include**: Selected Objects (or Limit to Collection)
- **Object Types**: `Mesh`, `Empty` (uncheck Camera, Light, Armature if not rigged)
- **Transform**:
  - **Scale**: `1.0`
  - **Apply Scalings**: `FBX All`
  - **Forward**: `-Z Forward`
  - **Up**: `Y Up`
  - **Bake Space Transform**: `Checked` (True)
- **Geometry**:
  - **Apply Modifiers**: `Checked`
  - **Smoothing**: `Face`
- **Bake Animation**: `Unchecked` (unless rigged/animated)

### Headless Automation CLI
You can run automated export using the included Python script:
```powershell
& "C:\Program Files\Blender Foundation\Blender 5.2\blender.exe" -b "Blender/Buildings/MyBuilding.blend" -P "Blender/Scripts/buildsphere_blender_pipeline.py" -- "Blender/Exports/MyBuilding.fbx"
```

---

## 6. Unity Import Pipeline & Postprocessing

BuildSphere includes `BuildSphereModelPostprocessor.cs` which automatically configures all `.fbx` and `.glb` files imported into `Assets/Models/`:

1. **Unit Scale**: `1.0` (Meters preserved).
2. **Axis Conversion**: `Bake Axis Conversion = True` (-Z forward to Unity +Z).
3. **Mesh Optimization**: Vertex & Polygon caching enabled.
4. **Lightmap UVs**: Secondary UV2 generation automatically enabled for architectural and construction categories.
5. **Tangents**: MikkTSpace tangent calculation for normal maps.

---

## 7. BIM Metadata & `BuildingComponentController`

Every modular component, piece of equipment, and building element integrates with the BuildSphere Digital Twin system via `BuildingComponentController.cs`.

### Metadata Schema
```csharp
[SerializeField] private string assetId = "WALL_MOD_001";
[SerializeField] private string componentName = "Modular Concrete Wall 3m";
[SerializeField] private ComponentCategory category = ComponentCategory.Wall;
[SerializeField] private ComponentMaterialType primaryMaterial = ComponentMaterialType.Concrete;
[SerializeField] private string manufacturer = "BuildSphere Modular Systems";
[SerializeField] private float unitCostUSD = 220.0f;
[SerializeField] private float weightKg = 150.0f;
[SerializeField] private float embodiedCarbonKg = 35.0f;
[SerializeField] private ComponentConstructionStatus status = ComponentConstructionStatus.Installed;
[SerializeField] private string nextMaintenanceDate = "2027-09-01";
[SerializeField] private string safetyInformation = "Standard structural safety clearances apply.";
```

### Digital Twin Interaction
- **Mouse Click / Tap**: Selects the component, invokes `SelectionManager.OnObjectSelected`, focuses camera, and highlights the component using `MAT_Component_Highlight`.
- **WebGL Bridge**: Automatically serializes selection payload `{ "id": "WALL_MOD_001", "name": "Modular Concrete Wall 3m", "type": "Component" }` to the React HUD frontend.
- **Visualization Modes**:
  - `Normal`: Realistic calibrated PBR rendering.
  - `ConstructionStatus`: Automatically color-codes components by status (Planned = Grey, InProgress = Orange, Installed = Green, Damaged/Warning = Red).

---

## 8. LOD (Level of Detail) & Real-Time Performance

To ensure high framerates (60+ FPS) in large 3D twin scenes and WebGL browsers, adhere to the polygon budgets:

| Category | LOD0 (100%) | LOD1 (50%) | LOD2 (25%) | LOD3 (10% Culling) |
|---|---|---|---|---|
| **Modular Wall / Slab** | < 200 tris | < 100 tris | < 50 tris | Cull > 150m |
| **Window / Door Frame** | < 1,500 tris | < 750 tris | < 250 tris | Cull > 100m |
| **Furniture / Chair** | < 3,000 tris | < 1,200 tris | < 400 tris | Cull > 60m |
| **Tower Crane / Scaffolding** | < 12,000 tris | < 5,000 tris | < 1,500 tris | Cull > 300m |
| **Infrastructure Road (10m)** | < 300 tris | < 150 tris | < 80 tris | Cull > 250m |

---

## 9. BuildSphere Editor Suite (1-Click Automation)

Open the editor tool inside Unity:
**Menu Bar → `BuildSphere AI` → `3D Pipeline & Asset Tools`**

### Features:
1. **🔍 Asset Validator**: Select any model in Project or Hierarchy. Instantly checks scale conformity, pivot location, vertex budgets, unbaked transforms, missing shaders, and non-standard names.
2. **⚡ 1-Click Prefab Generator**: Select an FBX model → input Asset ID, Category, Material, Cost → select Collider Type → click **Generate Production Prefab**.
3. **🎨 Material Library**: Generates/updates the 19 standard calibrated URP PBR materials.
4. **⚙️ Blender Automation Bridge**: 1-click execution of Blender CLI to process and export models directly from Unity.

---

## 10. Troubleshooting Guide

| Issue | Root Cause | Solution |
|---|---|---|
| **Model appears pink / magenta in Unity** | Material shader is unassigned or Built-in Standard instead of URP | In Material Inspector, set Shader to `Universal Render Pipeline/Lit` or use Tab 3 in Pipeline window to re-generate materials. |
| **Model is rotated 90° on X-axis** | Blender exported with Z-Up without axis baking | Re-export with `Forward: -Z`, `Up: Y`, `Bake Space Transform = True`, or ensure model is in `Assets/Models/` so `BuildSphereModelPostprocessor` corrects it. |
| **Scale is 100x too big or small** | Unit mismatch in Blender | Set Blender Unit Scale to `1.0 Metric`. Press `Ctrl + A` → **Apply All Transforms** before exporting. |
| **Black / Inverted shadows on mesh** | Inverted vertex normals | In Blender Edit Mode, select all (`A`) → `Shift + N` (Recalculate Outside) → re-export. |
| **Model cannot be clicked in Scene** | Missing Collider | Open Prefab, add `BoxCollider` or `MeshCollider` (Convex), or use the 1-Click Prefab Generator. |

---

## 11. Creating Your Next Asset — Step-by-Step

1. Open Blender (`Blender 5.2`).
2. Model your object with `1.0m` real-world dimensions.
3. Place pivot at bottom contact point `(0, 0, 0)`.
4. Press `Ctrl + A` → **Apply All Transforms**.
5. Press `Shift + N` in Edit Mode to recalculate normals.
6. Unwrap UVs (`U` → Smart UV Project).
7. Assign standard material name (e.g. `MAT_Concrete_Smooth`).
8. Save `.blend` in `Blender/<Category>/YourAssetName.blend`.
9. Export `.fbx` into `Assets/Models/<Category>/YourAssetName.fbx`.
10. In Unity, open **BuildSphere AI → 3D Pipeline & Asset Tools**, select your model, configure metadata, and click **Generate Production Prefab**.
11. Drag your new prefab into any scene or spawn it procedurally!
