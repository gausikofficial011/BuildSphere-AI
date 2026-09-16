using System.Collections.Generic;
using UnityEngine;

namespace BuildSphere.Building
{
    public enum AnalysisMode
    {
        StructuralStress,
        DaylightIllumination,
        ThermalEfficiency,
        OccupancyEgressDensity
    }

    [DisallowMultipleComponent]
    [RequireComponent(typeof(BuildingController))]
    public class StructuralStressAndDaylightVisualizer : MonoBehaviour
    {
        [Header("Analysis Configuration")]
        [SerializeField] private AnalysisMode currentAnalysis = AnalysisMode.StructuralStress;
        [SerializeField] private bool autoUpdateOnModeChange = true;
        [Range(0.1f, 5.0f)] [SerializeField] private float loadMultiplier = 1.0f;

        [Header("Color Heatmap Gradient")]
        [SerializeField] private Gradient stressGradient;
        [SerializeField] private Gradient daylightGradient;
        [SerializeField] private Gradient thermalGradient;

        private BuildingController buildingController;
        private Dictionary<MeshFilter, Color[]> originalMeshColors = new Dictionary<MeshFilter, Color[]>();

        public AnalysisMode CurrentAnalysis => currentAnalysis;

        private void Awake()
        {
            buildingController = GetComponent<BuildingController>();
            InitializeDefaultGradients();
        }

        private void InitializeDefaultGradients()
        {
            if (stressGradient == null || stressGradient.colorKeys.Length == 0)
            {
                stressGradient = new Gradient();
                stressGradient.SetKeys(
                    new GradientColorKey[] {
                        new GradientColorKey(new Color(0.1f, 0.85f, 0.3f), 0.0f),  // Safe (Green)
                        new GradientColorKey(new Color(0.95f, 0.85f, 0.1f), 0.5f),  // Moderate (Yellow)
                        new GradientColorKey(new Color(0.95f, 0.15f, 0.1f), 1.0f)   // Critical (Red)
                    },
                    new GradientAlphaKey[] {
                        new GradientAlphaKey(1.0f, 0.0f),
                        new GradientAlphaKey(1.0f, 1.0f)
                    }
                );
            }

            if (daylightGradient == null || daylightGradient.colorKeys.Length == 0)
            {
                daylightGradient = new Gradient();
                daylightGradient.SetKeys(
                    new GradientColorKey[] {
                        new GradientColorKey(new Color(0.1f, 0.1f, 0.4f), 0.0f),    // Low daylight (Deep Blue)
                        new GradientColorKey(new Color(0.2f, 0.7f, 0.9f), 0.4f),    // Medium (Cyan)
                        new GradientColorKey(new Color(1.0f, 0.95f, 0.4f), 1.0f)    // High daylight (Golden Yellow)
                    },
                    new GradientAlphaKey[] {
                        new GradientAlphaKey(1.0f, 0.0f),
                        new GradientAlphaKey(1.0f, 1.0f)
                    }
                );
            }

            if (thermalGradient == null || thermalGradient.colorKeys.Length == 0)
            {
                thermalGradient = new Gradient();
                thermalGradient.SetKeys(
                    new GradientColorKey[] {
                        new GradientColorKey(new Color(0.0f, 0.6f, 0.9f), 0.0f),   // Cool / Insulated
                        new GradientColorKey(new Color(0.2f, 0.9f, 0.4f), 0.5f),   // Nominal
                        new GradientColorKey(new Color(1.0f, 0.3f, 0.1f), 1.0f)    // Heat Gain / Thermal Bridge
                    },
                    new GradientAlphaKey[] {
                        new GradientAlphaKey(1.0f, 0.0f),
                        new GradientAlphaKey(1.0f, 1.0f)
                    }
                );
            }
        }

        [ContextMenu("Run Analysis Visualization")]
        public void ApplyAnalysisVisualization()
        {
            InitializeDefaultGradients();
            if (buildingController == null) buildingController = GetComponent<BuildingController>();

            MeshFilter[] meshFilters = GetComponentsInChildren<MeshFilter>(true);

            foreach (var mf in meshFilters)
            {
                if (mf.sharedMesh == null) continue;

                // Ensure an instantiated unique mesh for vertex colors
                if (!originalMeshColors.ContainsKey(mf))
                {
                    mf.mesh = Instantiate(mf.sharedMesh);
                    originalMeshColors[mf] = mf.mesh.colors.Length > 0 ? mf.mesh.colors : new Color[mf.mesh.vertexCount];
                }

                Mesh mesh = mf.mesh;
                Vector3[] verts = mesh.vertices;
                Color[] colors = new Color[verts.Length];

                for (int i = 0; i < verts.Length; i++)
                {
                    Vector3 worldPos = mf.transform.TransformPoint(verts[i]);
                    float normalizedMetric = CalculateMetric(worldPos, currentAnalysis);

                    Gradient activeGradient = currentAnalysis switch
                    {
                        AnalysisMode.StructuralStress => stressGradient,
                        AnalysisMode.DaylightIllumination => daylightGradient,
                        AnalysisMode.ThermalEfficiency => thermalGradient,
                        _ => stressGradient
                    };

                    colors[i] = activeGradient.Evaluate(Mathf.Clamp01(normalizedMetric));
                }

                mesh.colors = colors;
            }

            Debug.Log($"<color=#38BDF8>[StructuralAnalysisVisualizer]</color> Applied <b>{currentAnalysis}</b> heatmap across {meshFilters.Length} structural meshes.");
        }

        private float CalculateMetric(Vector3 worldPos, AnalysisMode mode)
        {
            float totalHeight = (buildingController != null && buildingController.Floors.Count > 0)
                ? buildingController.Floors.Count * 3.5f
                : 35f;

            float relY = Mathf.Clamp01(worldPos.y / totalHeight);
            float distFromCenter = Mathf.Sqrt(worldPos.x * worldPos.x + worldPos.z * worldPos.z);

            switch (mode)
            {
                case AnalysisMode.StructuralStress:
                    // Lower floors carry cumulative load of upper floors + cantilever corner amplification
                    float gravityLoad = (1.0f - relY) * 0.85f;
                    float cornerStress = (distFromCenter / 25f) * 0.25f;
                    return Mathf.Clamp01((gravityLoad + cornerStress) * loadMultiplier);

                case AnalysisMode.DaylightIllumination:
                    // Perimeter has high daylight factor; deep core and lower floors have lower daylight
                    float perimeterFactor = Mathf.Clamp01(distFromCenter / 15f);
                    float skyExposure = relY * 0.4f;
                    return Mathf.Clamp01(perimeterFactor * 0.7f + skyExposure);

                case AnalysisMode.ThermalEfficiency:
                    // South/West facades and rooftop get high solar gain
                    float solarExposure = Mathf.Clamp01((worldPos.z + 15f) / 30f) * 0.6f + (relY * 0.4f);
                    return Mathf.Clamp01(solarExposure);

                case AnalysisMode.OccupancyEgressDensity:
                default:
                    // Core egress stairs & lower ground floors have higher flow concentration
                    float egressProximity = 1.0f - Mathf.Clamp01(distFromCenter / 20f);
                    return Mathf.Clamp01(egressProximity * 0.7f + (1.0f - relY) * 0.3f);
            }
        }

        [ContextMenu("Reset to Natural Shading")]
        public void ResetVisualization()
        {
            foreach (var kvp in originalMeshColors)
            {
                if (kvp.Key != null && kvp.Key.mesh != null)
                {
                    Color[] neutral = new Color[kvp.Key.mesh.vertexCount];
                    for (int i = 0; i < neutral.Length; i++) neutral[i] = Color.white;
                    kvp.Key.mesh.colors = neutral;
                }
            }
            Debug.Log("<color=#10B981>[StructuralAnalysisVisualizer]</color> Reset building mesh colors to neutral shading.");
        }

        public void SetMode(AnalysisMode mode)
        {
            currentAnalysis = mode;
            if (autoUpdateOnModeChange)
            {
                ApplyAnalysisVisualization();
            }
        }
    }
}
