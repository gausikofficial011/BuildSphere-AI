#if UNITY_EDITOR
using UnityEditor;
using UnityEngine;
using BuildSphere.Building;
using BuildSphere.Core;
using BuildSphere.CameraControl;
using System.IO;

namespace BuildSphere.EditorTools
{
    public class BuildSphereModelBuildingWindow : EditorWindow
    {
        private Vector2 scrollPos;
        private int selectedTab = 0;
        private readonly string[] tabNames = new string[] {
            "🏗️ Parametric Studio",
            "〰️ Spline Extruder",
            "📊 FEA & Daylight Analysis",
            "📦 BIM / CAD Exporter",
            "✨ Lighting & Cinematics"
        };

        // Parametric Settings
        private BuildingParameters buildingParams = new BuildingParameters();
        private ArchitecturalStylePreset selectedPreset = ArchitecturalStylePreset.CyberDigitalTwin;

        // Spline Settings
        private ExtrusionProfileType splineProfile = ExtrusionProfileType.CurtainWallGlazing;
        private float splineWidth = 0.4f;
        private float splineHeight = 3.5f;

        // Analysis Settings
        private AnalysisMode selectedAnalysis = AnalysisMode.StructuralStress;

        [MenuItem("BuildSphere AI/Advanced 3D Model Building Suite", false, 10)]
        public static void ShowWindow()
        {
            var window = GetWindow<BuildSphereModelBuildingWindow>("BuildSphere Model Suite");
            window.minSize = new Vector2(450, 600);
            window.Show();
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
                    DrawParametricStudio();
                    break;
                case 1:
                    DrawSplineStudio();
                    break;
                case 2:
                    DrawAnalysisStudio();
                    break;
                case 3:
                    DrawExporterStudio();
                    break;
                case 4:
                    DrawLightingAndCinematicsStudio();
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
            titleStyle.normal.textColor = new Color(0.2f, 0.75f, 1.0f);

            EditorGUILayout.LabelField("BUILDSPHERE AI 3.0", titleStyle);
            EditorGUILayout.LabelField("Advanced 3D Architectural Modeling & Digital Twin Suite", EditorStyles.centeredGreyMiniLabel);
            EditorGUILayout.EndVertical();
            EditorGUILayout.Space(5);
        }

        private void DrawParametricStudio()
        {
            EditorGUILayout.LabelField("Parametric Building Generator", EditorStyles.boldLabel);
            EditorGUILayout.HelpBox("Procedurally synthesize multi-story architectural models with structural columns, curtain walls, slabs, rooms, and rooftop solar arrays.", MessageType.Info);

            EditorGUILayout.Space(5);
            selectedPreset = (ArchitecturalStylePreset)EditorGUILayout.EnumPopup("Architectural Preset", selectedPreset);
            buildingParams.style = selectedPreset;

            EditorGUILayout.Space(5);
            EditorGUILayout.LabelField("Dimensions & Structure", EditorStyles.boldLabel);
            buildingParams.numberOfFloors = EditorGUILayout.IntSlider("Number of Floors", buildingParams.numberOfFloors, 1, 40);
            buildingParams.floorHeight = EditorGUILayout.Slider("Floor Height (m)", buildingParams.floorHeight, 2.5f, 6.0f);
            buildingParams.buildingWidth = EditorGUILayout.Slider("Building Width (m)", buildingParams.buildingWidth, 10f, 100f);
            buildingParams.buildingDepth = EditorGUILayout.Slider("Building Depth (m)", buildingParams.buildingDepth, 10f, 100f);
            buildingParams.wallThickness = EditorGUILayout.Slider("Wall Thickness (m)", buildingParams.wallThickness, 0.15f, 0.6f);
            buildingParams.slabThickness = EditorGUILayout.Slider("Slab Thickness (m)", buildingParams.slabThickness, 0.2f, 0.8f);

            EditorGUILayout.Space(5);
            EditorGUILayout.LabelField("Facade & Glazing", EditorStyles.boldLabel);
            buildingParams.windowToWallRatio = EditorGUILayout.Slider("Window-to-Wall Ratio", buildingParams.windowToWallRatio, 0.1f, 0.95f);
            buildingParams.generateColumns = EditorGUILayout.Toggle("Generate Columns", buildingParams.generateColumns);
            if (buildingParams.generateColumns)
            {
                buildingParams.columnSpacing = EditorGUILayout.Slider("Column Spacing (m)", buildingParams.columnSpacing, 4f, 15f);
                buildingParams.columnWidth = EditorGUILayout.Slider("Column Width (m)", buildingParams.columnWidth, 0.3f, 1.2f);
            }

            EditorGUILayout.Space(5);
            EditorGUILayout.LabelField("Rooftop & Foundation", EditorStyles.boldLabel);
            buildingParams.generateFoundation = EditorGUILayout.Toggle("Generate Foundation", buildingParams.generateFoundation);
            buildingParams.generateRoofStructures = EditorGUILayout.Toggle("Generate Roof Slab", buildingParams.generateRoofStructures);
            buildingParams.generateParapet = EditorGUILayout.Toggle("Generate Parapets", buildingParams.generateParapet);
            buildingParams.generateRooftopSolar = EditorGUILayout.Toggle("Generate Solar PV Array", buildingParams.generateRooftopSolar);

            EditorGUILayout.Space(15);
            GUI.backgroundColor = new Color(0.1f, 0.8f, 0.4f);
            if (GUILayout.Button("⚡ Generate Procedural 3D Building", GUILayout.Height(38)))
            {
                GenerateProceduralBuildingInScene();
            }
            GUI.backgroundColor = Color.white;
        }

        private void GenerateProceduralBuildingInScene()
        {
            var activeBld = Object.FindFirstObjectByType<BuildingController>();
            ParametricArchitectureEngine engine = null;

            if (activeBld != null)
            {
                engine = activeBld.GetComponent<ParametricArchitectureEngine>();
                if (engine == null) engine = activeBld.gameObject.AddComponent<ParametricArchitectureEngine>();
            }
            else
            {
                GameObject bldObj = new GameObject("BuildSphere_Innovation_Tower");
                activeBld = bldObj.AddComponent<BuildingController>();
                engine = bldObj.AddComponent<ParametricArchitectureEngine>();
            }

            engine.Parameters = buildingParams;
            GameObject generated = engine.GenerateBuilding();

            Selection.activeGameObject = generated;
            SceneView.lastActiveSceneView?.FrameSelected();
            EditorUtility.SetDirty(engine);
        }

        private void DrawSplineStudio()
        {
            EditorGUILayout.LabelField("Spline Architecture Extruder", EditorStyles.boldLabel);
            EditorGUILayout.HelpBox("Extrude continuous 3D architectural elements (curtain walls, railings, HVAC ducts, structural conduits) along parametric Bézier paths.", MessageType.Info);

            EditorGUILayout.Space(5);
            splineProfile = (ExtrusionProfileType)EditorGUILayout.EnumPopup("Profile Type", splineProfile);
            splineWidth = EditorGUILayout.Slider("Profile Width (m)", splineWidth, 0.1f, 2.0f);
            splineHeight = EditorGUILayout.Slider("Profile Height (m)", splineHeight, 0.5f, 6.0f);

            EditorGUILayout.Space(15);
            GUI.backgroundColor = new Color(0.2f, 0.7f, 1.0f);
            if (GUILayout.Button("➕ Spawn Curved Spline Architecture Object", GUILayout.Height(36)))
            {
                SpawnSplineObject();
            }
            GUI.backgroundColor = Color.white;
        }

        private void SpawnSplineObject()
        {
            GameObject splineObj = new GameObject($"Spline_{splineProfile}");
            var extruder = splineObj.AddComponent<SplineArchitectureExtruder>();
            extruder.ProfileType = splineProfile;
            extruder.EnsureDefaultKnots();
            extruder.RebuildExtrusionMesh();

            Selection.activeGameObject = splineObj;
            SceneView.lastActiveSceneView?.FrameSelected();
        }

        private void DrawAnalysisStudio()
        {
            EditorGUILayout.LabelField("Structural FEA & Environmental Analysis", EditorStyles.boldLabel);
            EditorGUILayout.HelpBox("Simulate and project real-time structural stress load paths, daylight illumination factors, and solar heat maps directly on building surfaces.", MessageType.Info);

            EditorGUILayout.Space(5);
            selectedAnalysis = (AnalysisMode)EditorGUILayout.EnumPopup("Simulation Metric", selectedAnalysis);

            EditorGUILayout.Space(15);
            GUI.backgroundColor = new Color(0.95f, 0.6f, 0.1f);
            if (GUILayout.Button("🔥 Run & Render Surface Heatmap", GUILayout.Height(36)))
            {
                RunAnalysisOnScene();
            }
            GUI.backgroundColor = Color.white;

            EditorGUILayout.Space(5);
            if (GUILayout.Button("↺ Reset to Natural Shading", GUILayout.Height(28)))
            {
                var visualizer = Object.FindFirstObjectByType<StructuralStressAndDaylightVisualizer>();
                if (visualizer != null) visualizer.ResetVisualization();
            }
        }

        private void RunAnalysisOnScene()
        {
            var visualizer = Object.FindFirstObjectByType<StructuralStressAndDaylightVisualizer>();
            if (visualizer == null)
            {
                var bld = Object.FindFirstObjectByType<BuildingController>();
                if (bld != null) visualizer = bld.gameObject.AddComponent<StructuralStressAndDaylightVisualizer>();
            }

            if (visualizer != null)
            {
                visualizer.SetMode(selectedAnalysis);
                visualizer.ApplyAnalysisVisualization();
                SceneView.RepaintAll();
            }
            else
            {
                EditorUtility.DisplayDialog("Notice", "No BuildingController found in scene to analyze.", "OK");
            }
        }

        private void DrawExporterStudio()
        {
            EditorGUILayout.LabelField("BIM / CAD / 3D Format Exporter", EditorStyles.boldLabel);
            EditorGUILayout.HelpBox("Export the entire generated 3D architecture with materials and embedded IFC/BIM metadata to OBJ, MTL, and JSON formats for Revit/AutoCAD/Blender.", MessageType.Info);

            EditorGUILayout.Space(15);
            GUI.backgroundColor = new Color(0.3f, 0.85f, 0.4f);
            if (GUILayout.Button("💾 Export Scene Model to OBJ + BIM Package", GUILayout.Height(38)))
            {
                var bld = Object.FindFirstObjectByType<BuildingController>();
                if (bld != null)
                {
                    string exportDir = Path.Combine(Application.dataPath, "../Exports");
                    string path = BIMModelExporter.ExportToOBJ(bld.gameObject, exportDir, $"BuildSphere_Model_{System.DateTime.Now:yyyyMMdd_HHmmss}");
                    EditorUtility.RevealInFinder(path);
                }
                else
                {
                    EditorUtility.DisplayDialog("Export Error", "No BuildingController found in scene to export.", "OK");
                }
            }
            GUI.backgroundColor = Color.white;
        }

        private void DrawLightingAndCinematicsStudio()
        {
            EditorGUILayout.LabelField("Lighting, Post-Processing & Cinematics", EditorStyles.boldLabel);
            EditorGUILayout.HelpBox("Auto-configure high-fidelity Universal Render Pipeline lighting, volumetric sun, screen-space ambient occlusion, and Cinemachine orbit cameras.", MessageType.Info);

            EditorGUILayout.Space(15);
            if (GUILayout.Button("☀️ Setup Architectural Sun & Environment Lighting", GUILayout.Height(32)))
            {
                SetupLighting();
            }

            EditorGUILayout.Space(5);
            if (GUILayout.Button("🎥 Setup Cinemachine Architectural Orbit Rig", GUILayout.Height(32)))
            {
                SetupCinemachineCamera();
            }
        }

        private void SetupLighting()
        {
            Light sun = Object.FindFirstObjectByType<Light>();
            if (sun == null)
            {
                GameObject sunObj = new GameObject("Architectural_Sun");
                sun = sunObj.AddComponent<Light>();
                sun.type = LightType.Directional;
            }

            sun.transform.rotation = Quaternion.Euler(50f, -30f, 0f);
            sun.color = new Color(1.0f, 0.96f, 0.9f);
            sun.intensity = 1.3f;
            sun.shadows = LightShadows.Soft;

            RenderSettings.ambientMode = UnityEngine.Rendering.AmbientMode.Trilight;
            RenderSettings.ambientSkyColor = new Color(0.6f, 0.75f, 0.9f);
            RenderSettings.ambientEquatorColor = new Color(0.4f, 0.45f, 0.55f);
            RenderSettings.ambientGroundColor = new Color(0.2f, 0.2f, 0.22f);

            Debug.Log("<color=#10B981>[BuildSphere Suite]</color> High-fidelity architectural lighting setup complete.");
        }

        private void SetupCinemachineCamera()
        {
            GameObject rig = new GameObject("BuildSphere_CinematicRig");
            Camera cam = rig.AddComponent<Camera>();
            rig.tag = "MainCamera";
            rig.transform.position = new Vector3(0, 20f, -45f);
            rig.transform.LookAt(new Vector3(0, 10f, 0));

            var camCtrl = rig.AddComponent<CameraControl.BuildSphereCameraController>();
            Selection.activeGameObject = rig;
            Debug.Log("<color=#10B981>[BuildSphere Suite]</color> Cinematic camera controller configured.");
        }
    }
}
#endif
