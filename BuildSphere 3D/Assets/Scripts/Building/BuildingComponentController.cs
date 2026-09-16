using System;
using System.Collections.Generic;
using UnityEngine;
using BuildSphere.Interaction;
using BuildSphere.Core;

namespace BuildSphere.Building
{
    public enum ComponentCategory
    {
        Foundation,
        Column,
        Beam,
        Wall,
        FloorSlab,
        Door,
        Window,
        Staircase,
        Roof,
        HVAC_Duct,
        Electrical_Conduit,
        Plumbing_Pipe,
        Furniture,
        ConstructionEquipment,
        InfrastructureRoad,
        SiteEnvironment,
        Custom
    }

    public enum ComponentConstructionStatus
    {
        Planned,
        Ordered,
        DeliveredToSite,
        InProgress,
        Installed,
        InspectedPassed,
        InspectedFailed,
        MaintenanceRequired,
        Damaged
    }

    public enum ComponentMaterialType
    {
        Concrete,
        StructuralSteel,
        ArchitecturalGlass,
        Hardwood,
        RedBrick,
        Asphalt,
        Soil,
        Grass,
        BrushedMetal,
        MattePlastic,
        CeramicTile,
        WallPaint,
        Composite
    }

    [DisallowMultipleComponent]
    [SelectionBase]
    public class BuildingComponentController : MonoBehaviour, ISelectable
    {
        [Header("Asset Identification")]
        [SerializeField] private string assetId = "ASSET_001";
        [SerializeField] private string componentName = "Modular Architectural Component";
        [SerializeField] private ComponentCategory category = ComponentCategory.Wall;
        [SerializeField] private SelectableType selectableType = SelectableType.Component;

        [Header("Hierarchy & Spatial Context")]
        [SerializeField] private string buildingId = "BLD_001";
        [SerializeField] private string floorId = "FL_01";
        [SerializeField] private string roomId = "";

        [Header("Engineering & Specifications")]
        [SerializeField] private ComponentMaterialType primaryMaterial = ComponentMaterialType.Concrete;
        [SerializeField] private string manufacturer = "BuildSphere Modular Systems";
        [SerializeField] private string modelNumber = "BS-MOD-01";
        [SerializeField] private float weightKg = 120.0f;
        [SerializeField] private float embodiedCarbonKg = 34.5f;
        [SerializeField] private float fireRatingHours = 2.0f;

        [Header("Cost & Schedule")]
        [SerializeField] private float unitCostUSD = 250.0f;
        [SerializeField] private int quantity = 1;
        [SerializeField] private string installationDate = "2026-09-02";

        [Header("Lifecycle & Maintenance")]
        [SerializeField] private ComponentConstructionStatus status = ComponentConstructionStatus.Installed;
        [SerializeField] private string nextMaintenanceDate = "2027-09-01";
        [TextArea(2, 4)]
        [SerializeField] private string safetyInformation = "Standard structural safety clearances apply.";
        [TextArea(2, 4)]
        [SerializeField] private string customMetadataJson = "{}";

        [Header("Visual Feedback & Materials")]
        [SerializeField] private List<MeshRenderer> componentRenderers = new List<MeshRenderer>();
        [SerializeField] private Material highlightMaterial;
        [SerializeField] private Material hoverMaterial;

        [Header("Status Visual Overlays")]
        [SerializeField] private Material plannedMaterial;
        [SerializeField] private Material inProgressMaterial;
        [SerializeField] private Material installedMaterial;
        [SerializeField] private Material warningMaterial;

        [Header("State")]
        [SerializeField] private bool isSelected = false;
        [SerializeField] private bool isHovered = false;

        private Dictionary<MeshRenderer, Material[]> originalMaterialsCache = new Dictionary<MeshRenderer, Material[]>();
        private VisualizationMode activeVisualizationMode = VisualizationMode.Normal;

        // ISelectable Implementation
        public string SelectableId => assetId;
        public string DisplayName => $"{componentName} [{assetId}]";
        public SelectableType Type => selectableType;

        // Public Properties
        public string AssetId => assetId;
        public string ComponentName => componentName;
        public ComponentCategory Category => category;
        public string BuildingId => buildingId;
        public string FloorId => floorId;
        public string RoomId => roomId;
        public ComponentMaterialType PrimaryMaterial => primaryMaterial;
        public string Manufacturer => manufacturer;
        public string ModelNumber => modelNumber;
        public float WeightKg => weightKg;
        public float EmbodiedCarbonKg => embodiedCarbonKg;
        public float FireRatingHours => fireRatingHours;
        public float UnitCostUSD => unitCostUSD;
        public int Quantity => quantity;
        public string InstallationDate => installationDate;
        public ComponentConstructionStatus Status => status;
        public string NextMaintenanceDate => nextMaintenanceDate;
        public string SafetyInformation => safetyInformation;
        public string CustomMetadataJson => customMetadataJson;
        public bool IsSelected => isSelected;

        private void Awake()
        {
            CacheRenderersAndMaterials();
        }

        private void Start()
        {
            if (BuildSphereManager.Instance != null)
            {
                BuildSphereManager.Instance.OnVisualizationModeChanged += HandleVisualizationModeChanged;
            }
        }

        private void OnDestroy()
        {
            if (BuildSphereManager.Instance != null)
            {
                BuildSphereManager.Instance.OnVisualizationModeChanged -= HandleVisualizationModeChanged;
            }
        }

        public void ConfigureComponent(
            string newAssetId,
            string newName,
            ComponentCategory newCategory,
            ComponentMaterialType newMaterial,
            float newCost = 0f,
            ComponentConstructionStatus newStatus = ComponentConstructionStatus.Installed)
        {
            assetId = newAssetId;
            componentName = newName;
            category = newCategory;
            primaryMaterial = newMaterial;
            unitCostUSD = newCost;
            status = newStatus;
        }

        public void CacheRenderersAndMaterials()
        {
            if (componentRenderers == null || componentRenderers.Count == 0)
            {
                componentRenderers = new List<MeshRenderer>(GetComponentsInChildren<MeshRenderer>(true));
            }

            originalMaterialsCache.Clear();
            foreach (var r in componentRenderers)
            {
                if (r != null)
                {
                    originalMaterialsCache[r] = r.sharedMaterials;
                }
            }
        }

        public void OnSelect()
        {
            isSelected = true;
            ApplyVisualState();
        }

        public void OnDeselect()
        {
            isSelected = false;
            ApplyVisualState();
        }

        public void OnHoverEnter()
        {
            if (isSelected) return;
            isHovered = true;
            ApplyVisualState();
        }

        public void OnHoverExit()
        {
            if (isSelected) return;
            isHovered = false;
            ApplyVisualState();
        }

        public Vector3 GetFocusPoint()
        {
            Collider col = GetComponent<Collider>();
            if (col != null) return col.bounds.center;

            if (componentRenderers.Count > 0 && componentRenderers[0] != null)
            {
                Bounds bounds = componentRenderers[0].bounds;
                for (int i = 1; i < componentRenderers.Count; i++)
                {
                    if (componentRenderers[i] != null) bounds.Encapsulate(componentRenderers[i].bounds);
                }
                return bounds.center;
            }

            return transform.position;
        }

        private void HandleVisualizationModeChanged(VisualizationMode mode)
        {
            activeVisualizationMode = mode;
            ApplyVisualState();
        }

        public void SetConstructionStatus(ComponentConstructionStatus newStatus)
        {
            status = newStatus;
            ApplyVisualState();
        }

        public void ApplyVisualState()
        {
            if (componentRenderers.Count == 0) return;

            // Selection override
            if (isSelected && highlightMaterial != null)
            {
                AssignOverrideMaterial(highlightMaterial);
                return;
            }

            // Hover override
            if (isHovered && (hoverMaterial != null || highlightMaterial != null))
            {
                AssignOverrideMaterial(hoverMaterial != null ? hoverMaterial : highlightMaterial);
                return;
            }

            // Mode: Construction Status Overlay
            if (activeVisualizationMode == VisualizationMode.ConstructionStatus)
            {
                Material statusMat = GetStatusMaterial();
                if (statusMat != null)
                {
                    AssignOverrideMaterial(statusMat);
                    return;
                }
            }

            // Revert to original
            RestoreOriginalMaterials();
        }

        private Material GetStatusMaterial()
        {
            switch (status)
            {
                case ComponentConstructionStatus.Planned:
                case ComponentConstructionStatus.Ordered:
                    return plannedMaterial;
                case ComponentConstructionStatus.InProgress:
                case ComponentConstructionStatus.DeliveredToSite:
                    return inProgressMaterial;
                case ComponentConstructionStatus.Installed:
                case ComponentConstructionStatus.InspectedPassed:
                    return installedMaterial;
                case ComponentConstructionStatus.InspectedFailed:
                case ComponentConstructionStatus.MaintenanceRequired:
                case ComponentConstructionStatus.Damaged:
                    return warningMaterial;
                default:
                    return null;
            }
        }

        private void AssignOverrideMaterial(Material mat)
        {
            foreach (var r in componentRenderers)
            {
                if (r == null) continue;
                Material[] mats = new Material[r.sharedMaterials.Length];
                for (int i = 0; i < mats.Length; i++)
                {
                    mats[i] = mat;
                }
                r.material = mat;
            }
        }

        public void RestoreOriginalMaterials()
        {
            foreach (var r in componentRenderers)
            {
                if (r == null) continue;
                if (originalMaterialsCache.TryGetValue(r, out Material[] mats) && mats != null && mats.Length > 0)
                {
                    r.sharedMaterials = mats;
                }
            }
        }

        public void SetHighlightMaterial(Material highlight) => highlightMaterial = highlight;
        public void SetHoverMaterial(Material hover) => hoverMaterial = hover;
    }
}
