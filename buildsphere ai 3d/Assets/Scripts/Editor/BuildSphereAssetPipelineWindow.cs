#if UNITY_EDITOR
using System;
using System.Collections.Generic;
using System.IO;
using UnityEditor;
using UnityEngine;
using BuildSphere.Building;
using BuildSphere.Interaction;

namespace BuildSphere.EditorTools
{
    public class BuildSphereAssetPipelineWindow : EditorWindow
    {
        private Vector2 scrollPos;
        private int selectedTab = 0;
        private readonly string[] tabNames = new string[] {
            "🔍 Asset Validator",
            "⚡ Prefab Generator",
            "🎨 Material Library",
            "⚙️ Blender Bridge"
        };

        // Tab 1: Validation
        private GameObject validationTarget;
        private List<string> validationErrors = new List<string>();
        private List<string> validationWarnings = new List<string>();
        private List<string> validationPassed = new List<string>();
        private bool hasRunValidation = false;

        // Tab 2: Prefab Creation
        private GameObject sourceModel;
        private string customAssetId = "MOD_WALL_01";
        private string customComponentName = "Modular Concrete Wall 3m";
        private ComponentCategory selectedCategory = ComponentCategory.Wall;
        private ComponentMaterialType selectedMaterialType = ComponentMaterialType.Concrete;
        private float estimatedCost = 350f;
        private ColliderType selectedColliderType = ColliderType.BoxCollider;
        private string targetPrefabFolder = "Assets/Prefabs/Modular";

        public enum ColliderType
        {
            None,
            BoxCollider,
            MeshColliderConvex,
            MeshColliderExact
        }

        // Tab 4: Blender Bridge
        private string blenderExecutablePath = @"C:\Program Files\Blender Foundation\Blender 5.2\blender.exe";
        private string blenderScriptPath = "Blender/Scripts/buildsphere_blender_pipeline.py";
        private string blenderLog = "";

        [MenuItem("BuildSphere AI/3D Pipeline & Asset Tools", false, 5)]
        public static void ShowWindow()
        {
            var window = GetWindow<BuildSphereAssetPipelineWindow>("BuildSphere 3D Pipeline");
            window.minSize = new Vector2(500, 650);
            window.Show();
        }

        private void OnEnable()
        {
            DetectBlender();
        }

        private void DetectBlender()
        {
            string[] possiblePaths = new string[]
            {
                @"C:\Program Files\Blender Foundation\Blender 5.2\blender.exe",
                @"C:\Program Files\Blender Foundation\Blender 5.1\blender.exe",
                @"C:\Program Files\Blender Foundation\Blender 5.0\blender.exe",
                @"C:\Program Files\Blender Foundation\Blender 4.2\blender.exe",
                @"C:\Program Files\Blender Foundation\Blender 4.1\blender.exe",
                @"C:\Program Files\Blender Foundation\Blender 4.0\blender.exe"
            };

            foreach (var path in possiblePaths)
            {
                if (File.Exists(path))
                {
                    blenderExecutablePath = path;
                    break;
                }
            }
        }

        private void OnGUI()
        {
            DrawHeader();

            selectedTab = GUILayout.Toolbar(selectedTab, tabNames, GUILayout.Height(32));
            EditorGUILayout.Space(10);

            scrollPos = EditorGUILayout.BeginScrollView(scrollPos);

            switch (selectedTab)
            {
                case 0:
                    DrawValidatorTab();
                    break;
                case 1:
                    DrawPrefabGeneratorTab();
                    break;
                case 2:
                    DrawMaterialLibraryTab();
                    break;
                case 3:
                    DrawBlenderBridgeTab();
                    break;
            }

            EditorGUILayout.EndScrollView();
        }

        private void DrawHeader()
        {
            EditorGUILayout.BeginVertical(EditorStyles.helpBox);
            GUIStyle titleStyle = new GUIStyle(EditorStyles.boldLabel)
            {
                fontSize = 15,
                alignment = TextAnchor.MiddleCenter
            };
            titleStyle.normal.textColor = new Color(0.22f, 0.74f, 0.97f);

            EditorGUILayout.LabelField("BUILDSPHERE 3D ASSET PIPELINE", titleStyle);
            EditorGUILayout.LabelField("Blender → Unity Production Workflow & Digital Twin Quality Suite", EditorStyles.centeredGreyMiniLabel);
            EditorGUILayout.EndVertical();
            EditorGUILayout.Space(5);
        }

        #region Tab 1: Asset Quality Validator
        private void DrawValidatorTab()
        {
            EditorGUILayout.LabelField("3D Asset Quality & Scale Validator", EditorStyles.boldLabel);
            EditorGUILayout.HelpBox("Inspects models for scale conformity (1 Unit = 1 Meter), unbaked transforms, non-standard naming (e.g. Cube.001), missing materials, and vertex budgets.", MessageType.Info);

            EditorGUILayout.Space(5);
            validationTarget = (GameObject)EditorGUILayout.ObjectField("Target Model / Object", validationTarget, typeof(GameObject), true);

            EditorGUILayout.Space(10);
            GUI.backgroundColor = new Color(0.2f, 0.7f, 1.0f);
            if (GUILayout.Button("🔍 Run Deep Pipeline Validation", GUILayout.Height(34)))
            {
                RunModelValidation();
            }
            GUI.backgroundColor = Color.white;

            if (hasRunValidation)
            {
                EditorGUILayout.Space(15);
                EditorGUILayout.LabelField("Validation Report", EditorStyles.boldLabel);

                if (validationErrors.Count == 0 && validationWarnings.Count == 0)
                {
                    EditorGUILayout.HelpBox("✅ All checks passed! Model is production-ready for BuildSphere.", MessageType.Info);
                }

                if (validationErrors.Count > 0)
                {
                    EditorGUILayout.LabelField($"❌ Errors ({validationErrors.Count})", EditorStyles.boldLabel);
                    foreach (var err in validationErrors)
                    {
                        EditorGUILayout.HelpBox(err, MessageType.Error);
                    }
                }

                if (validationWarnings.Count > 0)
                {
                    EditorGUILayout.LabelField($"⚠️ Warnings ({validationWarnings.Count})", EditorStyles.boldLabel);
                    foreach (var warn in validationWarnings)
                    {
                        EditorGUILayout.HelpBox(warn, MessageType.Warning);
                    }
                }

                if (validationPassed.Count > 0)
                {
                    EditorGUILayout.LabelField($"✅ Passed Checks ({validationPassed.Count})", EditorStyles.boldLabel);
                    foreach (var pass in validationPassed)
                    {
                        EditorGUILayout.LabelField("  • " + pass);
                    }
                }
            }
        }

        private void RunModelValidation()
        {
            hasRunValidation = true;
            validationErrors.Clear();
            validationWarnings.Clear();
            validationPassed.Clear();

            if (validationTarget == null)
            {
                validationErrors.Add("No target model selected for validation.");
                return;
            }

            // 1. Root Transform Check
            if (validationTarget.transform.localScale != Vector3.one)
            {
                validationWarnings.Add($"Root Scale is not (1, 1, 1). Current: {validationTarget.transform.localScale}. Consider applying scale in Blender.");
            }
            else
            {
                validationPassed.Add("Root Transform Scale is normalized (1, 1, 1).");
            }

            // 2. Mesh Hierarchy & Geometry Check
            MeshFilter[] meshFilters = validationTarget.GetComponentsInChildren<MeshFilter>(true);
            if (meshFilters.Length == 0)
            {
                validationErrors.Add("No MeshFilter components found in target object or its children.");
                return;
            }

            int totalVertices = 0;
            int totalTriangles = 0;
            Bounds compositeBounds = new Bounds(validationTarget.transform.position, Vector3.zero);
            bool hasBounds = false;

            foreach (var mf in meshFilters)
            {
                if (mf.sharedMesh == null)
                {
                    validationErrors.Add($"MeshFilter on '{mf.name}' has a missing (null) mesh reference.");
                    continue;
                }

                Mesh m = mf.sharedMesh;
                totalVertices += m.vertexCount;
                totalTriangles += m.triangles.Length / 3;

                // Naming convention
                if (mf.name.StartsWith("Cube") || mf.name.StartsWith("Plane") || mf.name.StartsWith("Object") || mf.name.Contains(".00"))
                {
                    validationWarnings.Add($"Object '{mf.name}' uses a default/temporary Blender name. Rename meaningfully (e.g. Wall_Exterior_01).");
                }

                // Bounds calculation
                Renderer r = mf.GetComponent<Renderer>();
                if (r != null)
                {
                    if (!hasBounds)
                    {
                        compositeBounds = r.bounds;
                        hasBounds = true;
                    }
                    else
                    {
                        compositeBounds.Encapsulate(r.bounds);
                    }
                }

                // Normals check
                if (m.normals == null || m.normals.Length == 0)
                {
                    validationErrors.Add($"Mesh '{m.name}' on '{mf.name}' has no vertex normals.");
                }

                // UV check
                if (m.uv == null || m.uv.Length == 0)
                {
                    validationWarnings.Add($"Mesh '{m.name}' on '{mf.name}' has no UV0 coordinates.");
                }
            }

            validationPassed.Add($"Total Geometry: {totalVertices:N0} vertices, {totalTriangles:N0} triangles across {meshFilters.Length} sub-mesh(es).");
            validationPassed.Add($"Calculated Dimensions: {compositeBounds.size.x:F2}m (W) × {compositeBounds.size.y:F2}m (H) × {compositeBounds.size.z:F2}m (D).");

            // 3. Materials Check
            MeshRenderer[] renderers = validationTarget.GetComponentsInChildren<MeshRenderer>(true);
            int missingMaterialCount = 0;
            foreach (var mr in renderers)
            {
                if (mr.sharedMaterials == null || mr.sharedMaterials.Length == 0)
                {
                    missingMaterialCount++;
                    continue;
                }
                foreach (var mat in mr.sharedMaterials)
                {
                    if (mat == null)
                    {
                        missingMaterialCount++;
                    }
                    else if (mat.shader == null || mat.shader.name == "Hidden/InternalErrorShader")
                    {
                        validationErrors.Add($"Material '{mat.name}' on '{mr.name}' has a broken or missing shader.");
                    }
                }
            }

            if (missingMaterialCount > 0)
            {
                validationWarnings.Add($"{missingMaterialCount} renderer slot(s) have missing or null materials assigned.");
            }
            else
            {
                validationPassed.Add("All submeshes have valid materials assigned.");
            }

            // 4. LOD Group Check
            LODGroup lodGroup = validationTarget.GetComponentInChildren<LODGroup>();
            if (lodGroup != null)
            {
                validationPassed.Add($"LODGroup detected with {lodGroup.lodCount} LOD level(s).");
            }
        }
        #endregion

        #region Tab 2: 1-Click Prefab Generator
        private void DrawPrefabGeneratorTab()
        {
            EditorGUILayout.LabelField("1-Click Production Prefab Generator", EditorStyles.boldLabel);
            EditorGUILayout.HelpBox("Instantly converts an imported 3D model into an optimized BuildSphere prefab with Colliders, BuildingComponentController metadata, and URP Material assignment.", MessageType.Info);

            EditorGUILayout.Space(5);
            sourceModel = (GameObject)EditorGUILayout.ObjectField("Source Model (FBX/GLB)", sourceModel, typeof(GameObject), false);

            if (sourceModel != null)
            {
                if (string.IsNullOrEmpty(customAssetId) || customAssetId == "MOD_WALL_01")
                {
                    customAssetId = sourceModel.name.ToUpper();
                    customComponentName = ObjectNames.NicifyVariableName(sourceModel.name);
                }
            }

            EditorGUILayout.Space(5);
            EditorGUILayout.LabelField("BIM & Digital Twin Metadata", EditorStyles.boldLabel);
            customAssetId = EditorGUILayout.TextField("Asset ID", customAssetId);
            customComponentName = EditorGUILayout.TextField("Component Name", customComponentName);
            selectedCategory = (ComponentCategory)EditorGUILayout.EnumPopup("Category", selectedCategory);
            selectedMaterialType = (ComponentMaterialType)EditorGUILayout.EnumPopup("Primary Material", selectedMaterialType);
            estimatedCost = EditorGUILayout.FloatField("Unit Cost ($ USD)", estimatedCost);

            EditorGUILayout.Space(5);
            EditorGUILayout.LabelField("Physics & Hierarchy", EditorStyles.boldLabel);
            selectedColliderType = (ColliderType)EditorGUILayout.EnumPopup("Collider Setup", selectedColliderType);
            targetPrefabFolder = EditorGUILayout.TextField("Target Folder", targetPrefabFolder);

            EditorGUILayout.Space(15);
            GUI.backgroundColor = new Color(0.1f, 0.8f, 0.4f);
            if (GUILayout.Button("⚡ Generate Production Prefab", GUILayout.Height(36)))
            {
                GenerateProductionPrefab();
            }
            GUI.backgroundColor = Color.white;
        }

        private void GenerateProductionPrefab()
        {
            if (sourceModel == null)
            {
                EditorUtility.DisplayDialog("Error", "Please select a Source Model (FBX or GameObject).", "OK");
                return;
            }

            // Ensure destination folder exists
            if (!Directory.Exists(targetPrefabFolder))
            {
                Directory.CreateDirectory(targetPrefabFolder);
                AssetDatabase.Refresh();
            }

            // Instantiate temporary instance in scene
            GameObject instance = (GameObject)PrefabUtility.InstantiatePrefab(sourceModel);
            if (instance == null)
            {
                instance = Instantiate(sourceModel);
            }
            instance.name = customComponentName.Replace(" ", "_");

            // Attach / Configure BuildingComponentController
            var comp = instance.GetComponent<BuildingComponentController>();
            if (comp == null) comp = instance.AddComponent<BuildingComponentController>();

            comp.ConfigureComponent(customAssetId, customComponentName, selectedCategory, selectedMaterialType, estimatedCost);

            // Assign Highlight & Status materials if available
            Material highlightMat = AssetDatabase.LoadAssetAtPath<Material>("Assets/Materials/System/MAT_Component_Highlight.mat");
            if (highlightMat != null) comp.SetHighlightMaterial(highlightMat);

            // Setup Colliders
            SetupColliders(instance, selectedColliderType);

            // Setup LODGroup if children have _LOD0, _LOD1 etc.
            SetupLODsIfPresent(instance);

            // Save Prefab
            string prefabPath = $"{targetPrefabFolder}/{instance.name}.prefab";
            prefabPath = AssetDatabase.GenerateUniqueAssetPath(prefabPath);

            GameObject savedPrefab = PrefabUtility.SaveAsPrefabAssetAndConnect(instance, prefabPath, InteractionMode.UserAction);
            DestroyImmediate(instance);

            AssetDatabase.SaveAssets();
            AssetDatabase.Refresh();

            Selection.activeObject = savedPrefab;
            EditorGUIUtility.PingObject(savedPrefab);

            EditorUtility.DisplayDialog("Success", $"Production Prefab generated successfully at:\n{prefabPath}", "OK");
        }

        private void SetupColliders(GameObject obj, ColliderType colType)
        {
            // Remove existing colliders
            Collider[] existing = obj.GetComponentsInChildren<Collider>();
            foreach (var col in existing) DestroyImmediate(col);

            switch (colType)
            {
                case ColliderType.None:
                    break;
                case ColliderType.BoxCollider:
                    BoxCollider box = obj.AddComponent<BoxCollider>();
                    Renderer[] renderers = obj.GetComponentsInChildren<Renderer>();
                    if (renderers.Length > 0)
                    {
                        Bounds b = renderers[0].bounds;
                        for (int i = 1; i < renderers.Length; i++) b.Encapsulate(renderers[i].bounds);
                        box.center = obj.transform.InverseTransformPoint(b.center);
                        box.size = b.size;
                    }
                    break;
                case ColliderType.MeshColliderConvex:
                    MeshFilter[] filters = obj.GetComponentsInChildren<MeshFilter>();
                    foreach (var mf in filters)
                    {
                        MeshCollider mc = mf.gameObject.AddComponent<MeshCollider>();
                        mc.convex = true;
                    }
                    break;
                case ColliderType.MeshColliderExact:
                    MeshFilter[] exactFilters = obj.GetComponentsInChildren<MeshFilter>();
                    foreach (var mf in exactFilters)
                    {
                        MeshCollider mc = mf.gameObject.AddComponent<MeshCollider>();
                        mc.convex = false;
                    }
                    break;
            }
        }

        private void SetupLODsIfPresent(GameObject obj)
        {
            Transform lod0 = obj.transform.Find(obj.name + "_LOD0");
            Transform lod1 = obj.transform.Find(obj.name + "_LOD1");
            Transform lod2 = obj.transform.Find(obj.name + "_LOD2");

            if (lod0 != null)
            {
                LODGroup lodGroup = obj.GetComponent<LODGroup>();
                if (lodGroup == null) lodGroup = obj.AddComponent<LODGroup>();

                List<LOD> lods = new List<LOD>();
                if (lod0 != null) lods.Add(new LOD(0.6f, lod0.GetComponentsInChildren<Renderer>()));
                if (lod1 != null) lods.Add(new LOD(0.3f, lod1.GetComponentsInChildren<Renderer>()));
                if (lod2 != null) lods.Add(new LOD(0.1f, lod2.GetComponentsInChildren<Renderer>()));

                lodGroup.SetLODs(lods.ToArray());
                lodGroup.RecalculateBounds();
            }
        }
        #endregion

        #region Tab 3: Calibrated URP Material Library
        private void DrawMaterialLibraryTab()
        {
            EditorGUILayout.LabelField("Standard URP PBR Construction Materials", EditorStyles.boldLabel);
            EditorGUILayout.HelpBox("Generates calibrated Universal Render Pipeline (URP) PBR Lit materials for realistic architectural and construction rendering.", MessageType.Info);

            EditorGUILayout.Space(10);
            GUI.backgroundColor = new Color(0.95f, 0.6f, 0.1f);
            if (GUILayout.Button("🎨 Generate Complete Construction Material Library", GUILayout.Height(36)))
            {
                GenerateAllStandardMaterials();
            }
            GUI.backgroundColor = Color.white;
        }

        public static void GenerateAllStandardMaterials()
        {
            Shader urpLitShader = Shader.Find("Universal Render Pipeline/Lit");
            if (urpLitShader == null) urpLitShader = Shader.Find("Standard");

            if (urpLitShader == null)
            {
                EditorUtility.DisplayDialog("Error", "Could not locate 'Universal Render Pipeline/Lit' or 'Standard' shader.", "OK");
                return;
            }

            // Ensure material subfolders exist
            string[] folders = new string[] {
                "Assets/Materials/Architecture",
                "Assets/Materials/Construction",
                "Assets/Materials/Environment",
                "Assets/Materials/System"
            };
            foreach (var f in folders)
            {
                if (!Directory.Exists(f)) Directory.CreateDirectory(f);
            }

            // Architecture
            CreateOrUpdateMaterial("Assets/Materials/Architecture/MAT_Concrete_Smooth.mat", urpLitShader, new Color(0.72f, 0.72f, 0.74f), 0.0f, 0.25f);
            CreateOrUpdateMaterial("Assets/Materials/Architecture/MAT_Concrete_Rough.mat", urpLitShader, new Color(0.55f, 0.55f, 0.56f), 0.0f, 0.1f);
            CreateOrUpdateMaterial("Assets/Materials/Architecture/MAT_Glass_CurtainWall.mat", urpLitShader, new Color(0.65f, 0.85f, 0.95f, 0.45f), 0.2f, 0.95f, true);
            CreateOrUpdateMaterial("Assets/Materials/Architecture/MAT_Wood_Oak.mat", urpLitShader, new Color(0.58f, 0.38f, 0.22f), 0.0f, 0.35f);
            CreateOrUpdateMaterial("Assets/Materials/Architecture/MAT_Brick_Red.mat", urpLitShader, new Color(0.68f, 0.28f, 0.22f), 0.0f, 0.15f);
            CreateOrUpdateMaterial("Assets/Materials/Architecture/MAT_Ceramic_Tiles.mat", urpLitShader, new Color(0.88f, 0.88f, 0.90f), 0.05f, 0.8f);
            CreateOrUpdateMaterial("Assets/Materials/Architecture/MAT_Wall_Paint_White.mat", urpLitShader, new Color(0.92f, 0.93f, 0.94f), 0.0f, 0.2f);

            // Construction & Structural
            CreateOrUpdateMaterial("Assets/Materials/Construction/MAT_Steel_Structural.mat", urpLitShader, new Color(0.25f, 0.28f, 0.32f), 0.85f, 0.65f);
            CreateOrUpdateMaterial("Assets/Materials/Construction/MAT_Metal_Brushed.mat", urpLitShader, new Color(0.8f, 0.82f, 0.85f), 0.9f, 0.7f);
            CreateOrUpdateMaterial("Assets/Materials/Construction/MAT_Plastic_Matte.mat", urpLitShader, new Color(0.2f, 0.2f, 0.22f), 0.0f, 0.4f);
            CreateOrUpdateMaterial("Assets/Materials/Construction/MAT_Crane_Yellow.mat", urpLitShader, new Color(0.95f, 0.72f, 0.05f), 0.2f, 0.6f);

            // Environment & Infrastructure
            CreateOrUpdateMaterial("Assets/Materials/Environment/MAT_Asphalt_Road.mat", urpLitShader, new Color(0.22f, 0.22f, 0.24f), 0.0f, 0.2f);
            CreateOrUpdateMaterial("Assets/Materials/Environment/MAT_Soil_Ground.mat", urpLitShader, new Color(0.35f, 0.26f, 0.18f), 0.0f, 0.1f);
            CreateOrUpdateMaterial("Assets/Materials/Environment/MAT_Grass_Lawn.mat", urpLitShader, new Color(0.28f, 0.52f, 0.22f), 0.0f, 0.15f);

            // System Overlays
            CreateOrUpdateMaterial("Assets/Materials/System/MAT_Component_Highlight.mat", urpLitShader, new Color(0.22f, 0.74f, 0.97f, 0.85f), 0.1f, 0.8f);
            CreateOrUpdateMaterial("Assets/Materials/System/MAT_Component_Warning.mat", urpLitShader, new Color(0.95f, 0.30f, 0.25f, 0.85f), 0.1f, 0.8f);
            CreateOrUpdateMaterial("Assets/Materials/System/MAT_Status_Planned.mat", urpLitShader, new Color(0.6f, 0.6f, 0.6f, 0.7f), 0.0f, 0.2f);
            CreateOrUpdateMaterial("Assets/Materials/System/MAT_Status_InProgress.mat", urpLitShader, new Color(0.95f, 0.65f, 0.1f, 0.8f), 0.0f, 0.5f);
            CreateOrUpdateMaterial("Assets/Materials/System/MAT_Status_Installed.mat", urpLitShader, new Color(0.15f, 0.75f, 0.35f, 0.8f), 0.0f, 0.5f);

            AssetDatabase.SaveAssets();
            AssetDatabase.Refresh();

            EditorUtility.DisplayDialog("Complete", "Standard URP PBR Construction Material Library has been generated in Assets/Materials/.", "OK");
        }

        private static void CreateOrUpdateMaterial(string path, Shader shader, Color baseColor, float metallic, float smoothness, bool isTransparent = false)
        {
            Material mat = AssetDatabase.LoadAssetAtPath<Material>(path);
            if (mat == null)
            {
                mat = new Material(shader);
                AssetDatabase.CreateAsset(mat, path);
            }
            else
            {
                mat.shader = shader;
            }

            if (mat.HasProperty("_BaseColor")) mat.SetColor("_BaseColor", baseColor);
            else if (mat.HasProperty("_Color")) mat.SetColor("_Color", baseColor);

            if (mat.HasProperty("_Metallic")) mat.SetFloat("_Metallic", metallic);
            if (mat.HasProperty("_Smoothness")) mat.SetFloat("_Smoothness", smoothness);

            if (isTransparent)
            {
                mat.SetFloat("_Surface", 1); // 1 = Transparent in URP
                mat.SetOverrideTag("RenderType", "Transparent");
                mat.SetInt("_SrcBlend", (int)UnityEngine.Rendering.BlendMode.SrcAlpha);
                mat.SetInt("_DstBlend", (int)UnityEngine.Rendering.BlendMode.OneMinusSrcAlpha);
                mat.SetInt("_ZWrite", 0);
                mat.renderQueue = (int)UnityEngine.Rendering.RenderQueue.Transparent;
            }

            EditorUtility.SetDirty(mat);
        }
        #endregion

        #region Tab 4: Blender Automation Bridge
        private void DrawBlenderBridgeTab()
        {
            EditorGUILayout.LabelField("Blender Automation CLI Bridge", EditorStyles.boldLabel);
            EditorGUILayout.HelpBox("Connects directly to Blender 5.2 to run automated mesh optimization, LOD generation, transform baking, and Unity-compliant FBX/GLB export.", MessageType.Info);

            EditorGUILayout.Space(5);
            blenderExecutablePath = EditorGUILayout.TextField("Blender Executable", blenderExecutablePath);
            blenderScriptPath = EditorGUILayout.TextField("Pipeline Script", blenderScriptPath);

            bool blenderFound = File.Exists(blenderExecutablePath);
            if (blenderFound)
            {
                EditorGUILayout.HelpBox("✅ Blender executable detected and verified.", MessageType.Info);
            }
            else
            {
                EditorGUILayout.HelpBox("⚠️ Blender executable not found at specified path. Please update path or install Blender.", MessageType.Warning);
            }

            EditorGUILayout.Space(10);
            GUI.backgroundColor = new Color(0.2f, 0.7f, 1.0f);
            if (GUILayout.Button("🚀 Run Headless Blender Pipeline Export", GUILayout.Height(36)))
            {
                RunBlenderHeadlessExport();
            }
            GUI.backgroundColor = Color.white;

            if (!string.IsNullOrEmpty(blenderLog))
            {
                EditorGUILayout.Space(10);
                EditorGUILayout.LabelField("Blender CLI Output", EditorStyles.boldLabel);
                EditorGUILayout.TextArea(blenderLog, GUILayout.Height(150));
            }
        }

        private void RunBlenderHeadlessExport()
        {
            if (!File.Exists(blenderExecutablePath))
            {
                EditorUtility.DisplayDialog("Error", $"Blender executable not found at: {blenderExecutablePath}", "OK");
                return;
            }

            string fullScriptPath = Path.GetFullPath(blenderScriptPath);
            if (!File.Exists(fullScriptPath))
            {
                EditorUtility.DisplayDialog("Error", $"Blender script not found at: {fullScriptPath}", "OK");
                return;
            }

            try
            {
                System.Diagnostics.Process process = new System.Diagnostics.Process();
                process.StartInfo.FileName = blenderExecutablePath;
                process.StartInfo.Arguments = $"-b -P \"{fullScriptPath}\"";
                process.StartInfo.UseShellExecute = false;
                process.StartInfo.RedirectStandardOutput = true;
                process.StartInfo.RedirectStandardError = true;
                process.StartInfo.CreateNoWindow = true;

                process.Start();
                string output = process.StandardOutput.ReadToEnd();
                string err = process.StandardError.ReadToEnd();
                process.WaitForExit();

                blenderLog = output + "\n" + err;
                AssetDatabase.Refresh();

                EditorUtility.DisplayDialog("Blender Bridge", "Blender execution completed. Check log for details.", "OK");
            }
            catch (Exception ex)
            {
                blenderLog = "Execution error: " + ex.Message;
                EditorUtility.DisplayDialog("Error", ex.Message, "OK");
            }
        }
        #endregion
    }
}
#endif
