# BuildSphere 3D Pipeline — Quick Cheatsheet

## 🚀 60-Second Modeling Checklist
1. **Units**: Set scene units to **Metric (1.0m)**.
2. **Pivot**: Place object origin at **bottom contact point (0, 0, 0)**.
3. **Transforms**: Select object → `Ctrl + A` → **All Transforms**.
4. **Normals**: Edit Mode → Select All (`A`) → `Shift + N` (Recalculate Outside).
5. **Clean Geometry**: Edit Mode → Select All (`A`) → `M` → **By Distance**.
6. **UVs**: `U` → **Smart UV Project** (Island margin: `0.02`).
7. **Name**: Use standard name pattern `Category_Type_Descriptor_##` (e.g. `Building_Modular_Wall_01`).

## 💾 Export Commands (Blender → Unity)
- **FBX Export Settings**:
  - `Forward: -Z Forward`
  - `Up: Y Up`
  - `Scale: 1.0` (Apply Scalings: `FBX All`)
  - `Bake Space Transform: True`
  - `Apply Modifiers: True`

## ⚡ Unity 1-Click Setup
1. In Unity Editor: **BuildSphere AI → 3D Pipeline & Asset Tools**
2. In **Asset Validator** tab: Verify scale, transforms, and shaders.
3. In **Prefab Generator** tab: Set Asset ID, Category, Cost → Click **Generate Production Prefab**.
4. Prefab saved automatically to `Assets/Prefabs/<Category>/` with `BuildingComponentController` and colliders ready!
