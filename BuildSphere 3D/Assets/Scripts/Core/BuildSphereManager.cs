using System;
using System.Collections.Generic;
using UnityEngine;

namespace BuildSphere.Core
{
    public enum VisualizationMode
    {
        Normal,
        ConstructionStatus,
        Energy,
        Occupancy,
        Temperature,
        Alerts,
        Maintenance,
        StructuralInspection
    }

    [DisallowMultipleComponent]
    public class BuildSphereManager : MonoBehaviour
    {
        public static BuildSphereManager Instance { get; private set; }

        [Header("Digital Twin Core Configuration")]
        [Tooltip("Active building controller managing the 3D structure")]
        [SerializeField] private Building.BuildingController activeBuilding;

        [Header("Visualization Mode")]
        [SerializeField] private VisualizationMode currentMode = VisualizationMode.Normal;

        [Header("System Status")]
        [SerializeField] private bool isInitialized = false;

        public event Action<Building.BuildingController> OnBuildingInitialized;
        public event Action<VisualizationMode> OnVisualizationModeChanged;
        public event Action<int> OnFloorSelectionChanged;
        public event Action<string> OnRoomSelectionChanged;

        public Building.BuildingController ActiveBuilding => activeBuilding;
        public VisualizationMode CurrentMode => currentMode;
        public bool IsInitialized => isInitialized;

        private void Awake()
        {
            if (Instance != null && Instance != this)
            {
                Destroy(gameObject);
                return;
            }
            Instance = this;
            DontDestroyOnLoad(gameObject);
        }

        private void Start()
        {
            InitializeSystem();
        }

        public void InitializeSystem()
        {
            if (activeBuilding == null)
            {
                activeBuilding = FindFirstObjectByType<Building.BuildingController>();
            }

            if (activeBuilding != null)
            {
                activeBuilding.InitializeBuilding();
                Debug.Log($"<color=#38BDF8>[BuildSphere 3D]</color> Initialized with building: <b>{activeBuilding.BuildingName}</b> (ID: {activeBuilding.BuildingId})");
                OnBuildingInitialized?.Invoke(activeBuilding);
            }
            else
            {
                Debug.LogWarning("<color=#F59E0B>[BuildSphere 3D]</color> No BuildingController found in scene hierarchy.");
            }

            isInitialized = true;
        }

        public void SetVisualizationMode(VisualizationMode newMode)
        {
            if (currentMode == newMode) return;
            currentMode = newMode;
            Debug.Log($"<color=#38BDF8>[BuildSphere 3D]</color> Visualization mode changed to: <b>{currentMode}</b>");
            OnVisualizationModeChanged?.Invoke(currentMode);
        }

        public void NotifyFloorSelected(int floorNumber)
        {
            OnFloorSelectionChanged?.Invoke(floorNumber);
        }

        public void NotifyRoomSelected(string roomId)
        {
            OnRoomSelectionChanged?.Invoke(roomId);
        }
    }
}