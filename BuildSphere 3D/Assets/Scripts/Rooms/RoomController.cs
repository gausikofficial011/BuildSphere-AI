using System;
using System.Collections.Generic;
using UnityEngine;
using BuildSphere.Interaction;
using BuildSphere.Core;

namespace BuildSphere.Rooms
{
    public enum RoomStatus
    {
        Normal,
        Warning,
        Critical,
        Maintenance,
        UnderConstruction
    }

    public enum RoomType
    {
        Office,
        MeetingRoom,
        ServerRoom,
        Laboratory,
        ExecutiveSuite,
        Restroom,
        Corridor,
        Storage
    }

    [DisallowMultipleComponent]
    [RequireComponent(typeof(Collider))]
    public class RoomController : MonoBehaviour, ISelectable
    {
        [Header("Room Identity")]
        [SerializeField] private string roomId = "ROOM_101";
        [SerializeField] private string roomName = "Robotics & Automation Lab";
        [SerializeField] private string floorId = "FL_01";
        [SerializeField] private RoomType roomType = RoomType.Laboratory;

        [Header("Digital Twin Telemetry")]
        [Tooltip("Floor area in square meters (m²)")]
        [SerializeField] private float area = 55.0f;
        [Tooltip("Current occupant count")]
        [SerializeField] private int occupancy = 8;
        [Tooltip("Max designed capacity")]
        [SerializeField] private int capacity = 15;
        [Tooltip("Ambient temperature in Celsius (°C)")]
        [SerializeField] private float temperature = 22.5f;
        [Tooltip("Real-time power draw in kWh")]
        [SerializeField] private float energyConsumption = 5.4f;
        [SerializeField] private RoomStatus status = RoomStatus.Normal;

        [Header("Visual Feedback & Meshes")]
        [SerializeField] private MeshRenderer roomVolumeRenderer;
        [SerializeField] private List<MeshRenderer> wallRenderers = new List<MeshRenderer>();
        [SerializeField] private Material defaultMaterial;
        [SerializeField] private Material highlightMaterial;
        [SerializeField] private Material hoverMaterial;

        [Header("Visualization Mode Palette")]
        [SerializeField] private Material energyLowMaterial;
        [SerializeField] private Material energyNormalMaterial;
        [SerializeField] private Material energyHighMaterial;
        [SerializeField] private Material energyCriticalMaterial;

        [Header("State")]
        [SerializeField] private bool isSelected = false;
        [SerializeField] private bool isHovered = false;

        private Material originalVolumeMaterial;
        private VisualizationMode activeVisualizationMode = VisualizationMode.Normal;

        public string SelectableId => roomId;
        public string DisplayName => $"{roomName} ({roomId})";
        public SelectableType Type => SelectableType.Room;

        public string RoomId => roomId;
        public string RoomName => roomName;
        public string FloorId => floorId;
        public RoomType RoomCategory => roomType;
        public float Area => area;
        public int Occupancy => occupancy;
        public int Capacity => capacity;
        public float Temperature => temperature;
        public float EnergyConsumption => energyConsumption;
        public RoomStatus Status => status;
        public bool IsSelected => isSelected;

        public void InitializeRoom(string assignedFloorId)
        {
            floorId = assignedFloorId;
            
            if (roomVolumeRenderer == null)
            {
                roomVolumeRenderer = GetComponentInChildren<MeshRenderer>();
            }

            if (roomVolumeRenderer != null)
            {
                if (defaultMaterial == null)
                {
                    defaultMaterial = roomVolumeRenderer.sharedMaterial;
                }
                originalVolumeMaterial = defaultMaterial;
            }

            if (wallRenderers.Count == 0)
            {
                MeshRenderer[] renderers = GetComponentsInChildren<MeshRenderer>(true);
                foreach (var r in renderers)
                {
                    if (r != roomVolumeRenderer)
                    {
                        wallRenderers.Add(r);
                    }
                }
            }

            if (BuildSphereManager.Instance != null)
            {
                BuildSphereManager.Instance.OnVisualizationModeChanged += HandleModeChanged;
            }
        }

        private void OnDestroy()
        {
            if (BuildSphereManager.Instance != null)
            {
                BuildSphereManager.Instance.OnVisualizationModeChanged -= HandleModeChanged;
            }
        }

        public void OnSelect()
        {
            isSelected = true;
            UpdateVisualState();
            Core.BuildSphereManager.Instance?.NotifyRoomSelected(roomId);
        }

        public void OnDeselect()
        {
            isSelected = false;
            UpdateVisualState();
        }

        public void OnHoverEnter()
        {
            if (isSelected) return;
            isHovered = true;
            UpdateVisualState();
        }

        public void OnHoverExit()
        {
            if (isSelected) return;
            isHovered = false;
            UpdateVisualState();
        }

        public Vector3 GetFocusPoint()
        {
            return transform.position;
        }

        public void SetHighlight(bool highlight)
        {
            isSelected = highlight;
            UpdateVisualState();
        }

        private void HandleModeChanged(VisualizationMode mode)
        {
            activeVisualizationMode = mode;
            UpdateVisualState();
        }

        public void UpdateVisualState()
        {
            if (roomVolumeRenderer == null) return;

            if (isSelected && highlightMaterial != null)
            {
                roomVolumeRenderer.material = highlightMaterial;
                return;
            }

            if (isHovered && (hoverMaterial != null || highlightMaterial != null))
            {
                roomVolumeRenderer.material = hoverMaterial != null ? hoverMaterial : highlightMaterial;
                return;
            }

            if (activeVisualizationMode == VisualizationMode.Energy)
            {
                ApplyEnergyVisualization();
                return;
            }

            if (defaultMaterial != null)
            {
                roomVolumeRenderer.material = defaultMaterial;
            }
        }

        private void ApplyEnergyVisualization()
        {
            if (energyConsumption < 3.0f && energyLowMaterial != null)
            {
                roomVolumeRenderer.material = energyLowMaterial;
            }
            else if (energyConsumption <= 5.0f && energyNormalMaterial != null)
            {
                roomVolumeRenderer.material = energyNormalMaterial;
            }
            else if (energyConsumption <= 7.5f && energyHighMaterial != null)
            {
                roomVolumeRenderer.material = energyHighMaterial;
            }
            else if (energyConsumption > 7.5f && energyCriticalMaterial != null)
            {
                roomVolumeRenderer.material = energyCriticalMaterial;
            }
            else if (defaultMaterial != null)
            {
                roomVolumeRenderer.material = defaultMaterial;
            }
        }

        public void UpdateTelemetry(int newOccupancy, float newTemperature, float newEnergy, RoomStatus newStatus)
        {
            occupancy = newOccupancy;
            temperature = newTemperature;
            energyConsumption = newEnergy;
            status = newStatus;

            if (activeVisualizationMode != VisualizationMode.Normal)
            {
                UpdateVisualState();
            }
        }
    }
}