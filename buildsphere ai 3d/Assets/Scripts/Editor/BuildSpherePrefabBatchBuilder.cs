#if UNITY_EDITOR
using System.IO;
using UnityEditor;
using UnityEngine;
using BuildSphere.Building;
using BuildSphere.Interaction;

namespace BuildSphere.EditorTools
{
    public static class BuildSpherePrefabBatchBuilder
    {
        public static void GenerateAllStandardPrefabs()
        {
            Debug.Log("[BuildSphere Batch] Starting Prefab Generation...");
            BuildSphereAssetPipelineWindow.GenerateAllStandardMaterials();

            // Definition of all 9 standard assets
            var assetConfigs = new[]
            {
                new {
                    fbx = "Assets/Models/Buildings/Building_Modular_Wall_01.fbx",
                    prefabFolder = "Assets/Prefabs/Modular",
                    prefabName = "Building_Modular_Wall_01",
                    assetId = "WALL_MOD_001",
                    compName = "Modular Concrete Wall 3m",
                    cat = ComponentCategory.Wall,
                    matType = ComponentMaterialType.Concrete,
                    cost = 220f,
                    colType = BuildSphereAssetPipelineWindow.ColliderType.BoxCollider
                },
                new {
                    fbx = "Assets/Models/Buildings/Building_Modular_Column_01.fbx",
                    prefabFolder = "Assets/Prefabs/Modular",
                    prefabName = "Building_Modular_Column_01",
                    assetId = "COL_MOD_001",
                    compName = "Structural Concrete Column 3.5m",
                    cat = ComponentCategory.Column,
                    matType = ComponentMaterialType.Concrete,
                    cost = 450f,
                    colType = BuildSphereAssetPipelineWindow.ColliderType.BoxCollider
                },
                new {
                    fbx = "Assets/Models/Buildings/Building_Modular_FloorSlab_01.fbx",
                    prefabFolder = "Assets/Prefabs/Modular",
                    prefabName = "Building_Modular_FloorSlab_01",
                    assetId = "SLAB_MOD_001",
                    compName = "Modular Floor Slab 4x4m",
                    cat = ComponentCategory.FloorSlab,
                    matType = ComponentMaterialType.Concrete,
                    cost = 680f,
                    colType = BuildSphereAssetPipelineWindow.ColliderType.BoxCollider
                },
                new {
                    fbx = "Assets/Models/Buildings/Building_Modular_Window_01.fbx",
                    prefabFolder = "Assets/Prefabs/Modular",
                    prefabName = "Building_Modular_Window_01",
                    assetId = "WIN_MOD_001",
                    compName = "Commercial Glazed Window 2x2.2m",
                    cat = ComponentCategory.Window,
                    matType = ComponentMaterialType.ArchitecturalGlass,
                    cost = 380f,
                    colType = BuildSphereAssetPipelineWindow.ColliderType.BoxCollider
                },
                new {
                    fbx = "Assets/Models/Buildings/Building_Modular_Door_01.fbx",
                    prefabFolder = "Assets/Prefabs/Modular",
                    prefabName = "Building_Modular_Door_01",
                    assetId = "DOOR_MOD_001",
                    compName = "Architectural Fire Door 1x2.2m",
                    cat = ComponentCategory.Door,
                    matType = ComponentMaterialType.StructuralSteel,
                    cost = 290f,
                    colType = BuildSphereAssetPipelineWindow.ColliderType.BoxCollider
                },
                new {
                    fbx = "Assets/Models/Furniture/Furniture_OfficeDesk_01.fbx",
                    prefabFolder = "Assets/Prefabs/Furniture",
                    prefabName = "Furniture_OfficeDesk_01",
                    assetId = "FURN_DESK_001",
                    compName = "Executive Workstation Desk 1.6m",
                    cat = ComponentCategory.Furniture,
                    matType = ComponentMaterialType.Hardwood,
                    cost = 320f,
                    colType = BuildSphereAssetPipelineWindow.ColliderType.BoxCollider
                },
                new {
                    fbx = "Assets/Models/Furniture/Furniture_OfficeChair_01.fbx",
                    prefabFolder = "Assets/Prefabs/Furniture",
                    prefabName = "Furniture_OfficeChair_01",
                    assetId = "FURN_CHAIR_001",
                    compName = "Ergonomic Task Chair",
                    cat = ComponentCategory.Furniture,
                    matType = ComponentMaterialType.MattePlastic,
                    cost = 180f,
                    colType = BuildSphereAssetPipelineWindow.ColliderType.BoxCollider
                },
                new {
                    fbx = "Assets/Models/Construction/Construction_TowerCrane_01.fbx",
                    prefabFolder = "Assets/Prefabs/Construction",
                    prefabName = "Construction_TowerCrane_01",
                    assetId = "CRANE_TWR_001",
                    compName = "Tower Crane 15m Mast",
                    cat = ComponentCategory.ConstructionEquipment,
                    matType = ComponentMaterialType.StructuralSteel,
                    cost = 45000f,
                    colType = BuildSphereAssetPipelineWindow.ColliderType.BoxCollider
                },
                new {
                    fbx = "Assets/Models/Infrastructure/Infrastructure_Road_Straight_01.fbx",
                    prefabFolder = "Assets/Prefabs/Infrastructure",
                    prefabName = "Infrastructure_Road_Straight_01",
                    assetId = "ROAD_STR_001",
                    compName = "Dual-Lane Asphalt Road 10m",
                    cat = ComponentCategory.InfrastructureRoad,
                    matType = ComponentMaterialType.Asphalt,
                    cost = 2500f,
                    colType = BuildSphereAssetPipelineWindow.ColliderType.BoxCollider
                }
            };

            foreach (var cfg in assetConfigs)
            {
                if (!Directory.Exists(cfg.prefabFolder))
                {
                    Directory.CreateDirectory(cfg.prefabFolder);
                }

                GameObject modelAsset = AssetDatabase.LoadAssetAtPath<GameObject>(cfg.fbx);
                if (modelAsset == null)
                {
                    Debug.LogWarning($"[BuildSphere Batch] Model not found at: {cfg.fbx}");
                    continue;
                }

                GameObject instance = (GameObject)PrefabUtility.InstantiatePrefab(modelAsset);
                if (instance == null) instance = Object.Instantiate(modelAsset);
                instance.name = cfg.prefabName;

                // Setup BuildingComponentController
                var comp = instance.GetComponent<BuildingComponentController>();
                if (comp == null) comp = instance.AddComponent<BuildingComponentController>();
                comp.ConfigureComponent(cfg.assetId, cfg.compName, cfg.cat, cfg.matType, cfg.cost);

                // Setup BoxCollider
                BoxCollider box = instance.GetComponent<BoxCollider>();
                if (box == null) box = instance.AddComponent<BoxCollider>();
                Renderer[] renderers = instance.GetComponentsInChildren<Renderer>();
                if (renderers.Length > 0)
                {
                    Bounds b = renderers[0].bounds;
                    for (int i = 1; i < renderers.Length; i++) b.Encapsulate(renderers[i].bounds);
                    box.center = instance.transform.InverseTransformPoint(b.center);
                    box.size = b.size;
                }

                // Assign highlight material
                Material highlightMat = AssetDatabase.LoadAssetAtPath<Material>("Assets/Materials/System/MAT_Component_Highlight.mat");
                if (highlightMat != null) comp.SetHighlightMaterial(highlightMat);

                // Save Prefab
                string savePath = $"{cfg.prefabFolder}/{cfg.prefabName}.prefab";
                PrefabUtility.SaveAsPrefabAsset(instance, savePath);
                Object.DestroyImmediate(instance);

                Debug.Log($"[BuildSphere Batch] Successfully generated Prefab: {savePath}");
            }

            AssetDatabase.SaveAssets();
            AssetDatabase.Refresh();
            Debug.Log("[BuildSphere Batch] ALL PREFABS GENERATED SUCCESSFULLY!");
        }
    }
}
#endif
