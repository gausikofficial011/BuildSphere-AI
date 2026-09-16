using System;
using System.Text.RegularExpressions;
using UnityEngine;
using BuildSphere.Building;
using BuildSphere.Core;

namespace BuildSphere.AI
{
    [DisallowMultipleComponent]
    public class AIModelBuildingEngine : MonoBehaviour
    {
        public static AIModelBuildingEngine Instance { get; private set; }

        [Header("Engine References")]
        [SerializeField] private ParametricArchitectureEngine architectureEngine;
        [SerializeField] private StructuralStressAndDaylightVisualizer stressVisualizer;

        public event Action<BuildingParameters> OnBuildingGeneratedByAI;

        private void Awake()
        {
            if (Instance != null && Instance != this)
            {
                Destroy(gameObject);
                return;
            }
            Instance = this;
        }

        private void Start()
        {
            if (architectureEngine == null)
            {
                architectureEngine = FindFirstObjectByType<ParametricArchitectureEngine>();
            }
            if (stressVisualizer == null)
            {
                stressVisualizer = FindFirstObjectByType<StructuralStressAndDaylightVisualizer>();
            }
        }

        public string GenerateFromPrompt(string naturalLanguagePrompt)
        {
            if (string.IsNullOrWhiteSpace(naturalLanguagePrompt))
                return "Prompt cannot be empty.";

            if (architectureEngine == null)
            {
                architectureEngine = FindFirstObjectByType<ParametricArchitectureEngine>();
                if (architectureEngine == null)
                {
                    var activeBld = BuildSphereManager.Instance?.ActiveBuilding;
                    if (activeBld != null)
                    {
                        architectureEngine = activeBld.gameObject.AddComponent<ParametricArchitectureEngine>();
                    }
                    else
                    {
                        GameObject bldObj = new GameObject("BuildSphere_Generated_Building");
                        var bldCtrl = bldObj.AddComponent<BuildingController>();
                        architectureEngine = bldObj.AddComponent<ParametricArchitectureEngine>();
                    }
                }
            }

            BuildingParameters p = new BuildingParameters();
            string lower = naturalLanguagePrompt.ToLower();

            // 1. Extract Floor Count
            Match floorMatch = Regex.Match(lower, @"(\d+)\s*(?:story|stories|floors|floor|level|levels)");
            if (floorMatch.Success && int.TryParse(floorMatch.Groups[1].Value, out int extractedFloors))
            {
                p.numberOfFloors = Mathf.Clamp(extractedFloors, 1, 40);
            }
            else
            {
                p.numberOfFloors = 6;
            }

            // 2. Extract Architectural Style
            if (lower.Contains("commercial") || lower.Contains("office") || lower.Contains("corporate"))
            {
                p.style = ArchitecturalStylePreset.CommercialTower;
                p.windowToWallRatio = 0.75f;
                p.buildingWidth = 36f;
                p.buildingDepth = 24f;
            }
            else if (lower.Contains("eco") || lower.Contains("sustainable") || lower.Contains("green") || lower.Contains("solar"))
            {
                p.style = ArchitecturalStylePreset.SustainableEcoTower;
                p.generateRooftopSolar = true;
                p.windowToWallRatio = 0.65f;
                p.buildingWidth = 32f;
                p.buildingDepth = 22f;
            }
            else if (lower.Contains("residential") || lower.Contains("apartment") || lower.Contains("housing"))
            {
                p.style = ArchitecturalStylePreset.ResidentialComplex;
                p.windowToWallRatio = 0.45f;
                p.floorHeight = 3.2f;
                p.buildingWidth = 28f;
                p.buildingDepth = 18f;
            }
            else if (lower.Contains("industrial") || lower.Contains("warehouse") || lower.Contains("factory"))
            {
                p.style = ArchitecturalStylePreset.IndustrialHub;
                p.numberOfFloors = Mathf.Min(p.numberOfFloors, 3);
                p.floorHeight = 5.5f;
                p.buildingWidth = 48f;
                p.buildingDepth = 30f;
                p.windowToWallRatio = 0.25f;
            }
            else
            {
                p.style = ArchitecturalStylePreset.CyberDigitalTwin;
                p.windowToWallRatio = 0.6f;
                p.buildingWidth = 30f;
                p.buildingDepth = 20f;
            }

            // 3. Apply to engine and generate
            architectureEngine.Parameters = p;
            GameObject result = architectureEngine.GenerateBuilding();

            OnBuildingGeneratedByAI?.Invoke(p);

            string response = $"AI Architectural Synthesis: Successfully constructed <b>{p.numberOfFloors}-story {p.style}</b> model (Width: {p.buildingWidth}m, Depth: {p.buildingDepth}m, Window/Wall: {p.windowToWallRatio:P0}).";
            Debug.Log($"<color=#10B981>[AIModelBuildingEngine]</color> {response}");
            return response;
        }

        public string RunStructuralAnalysis(AnalysisMode mode)
        {
            if (stressVisualizer == null)
            {
                stressVisualizer = FindFirstObjectByType<StructuralStressAndDaylightVisualizer>();
                if (stressVisualizer == null)
                {
                    var activeBld = BuildSphereManager.Instance?.ActiveBuilding;
                    if (activeBld != null)
                    {
                        stressVisualizer = activeBld.gameObject.AddComponent<StructuralStressAndDaylightVisualizer>();
                    }
                }
            }

            if (stressVisualizer != null)
            {
                stressVisualizer.SetMode(mode);
                return $"Real-time FEA Simulation Active: Displaying <b>{mode}</b> heatmap across all structural components.";
            }

            return "Unable to initialize Structural Analysis visualizer.";
        }

        public string ExportCurrentBIM(string destinationFolder = "")
        {
            var activeBld = BuildSphereManager.Instance?.ActiveBuilding;
            if (activeBld == null) return "No active building model to export.";

            if (string.IsNullOrEmpty(destinationFolder))
            {
                destinationFolder = System.IO.Path.Combine(Application.dataPath, "../Exports");
            }

            string exportPath = BIMModelExporter.ExportToOBJ(activeBld.gameObject, destinationFolder, $"BuildSphere_{activeBld.BuildingName.Replace(" ", "_")}");
            return $"BIM Model successfully exported to: {exportPath}";
        }
    }
}
