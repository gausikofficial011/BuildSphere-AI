using System;
using UnityEngine;
using UnityEngine.UI;
using TMPro;
using BuildSphere.Core;
using BuildSphere.Building;
using BuildSphere.Rooms;
using BuildSphere.Interaction;
using BuildSphere.CameraControl;
using BuildSphere.Data;

namespace BuildSphere.UI
{
    [DisallowMultipleComponent]
    public class BuildSphereUIManager : MonoBehaviour
    {
        public static BuildSphereUIManager Instance { get; private set; }

        [Header("Top Header Bar")]
        [SerializeField] private TextMeshProUGUI platformTitleText;
        [SerializeField] private TextMeshProUGUI activeModeBadgeText;

        [Header("Selected Object Info Panel (Right)")]
        [SerializeField] private GameObject infoPanelContainer;
        [SerializeField] private GameObject noSelectionPlaceholder;
        [SerializeField] private GameObject selectionDataContainer;
        
        [SerializeField] private TextMeshProUGUI titleText;
        [SerializeField] private TextMeshProUGUI idText;
        [SerializeField] private TextMeshProUGUI typeText;
        [SerializeField] private TextMeshProUGUI areaText;
        [SerializeField] private TextMeshProUGUI occupancyText;
        [SerializeField] private TextMeshProUGUI temperatureText;
        [SerializeField] private TextMeshProUGUI energyText;
        [SerializeField] private TextMeshProUGUI statusBadgeText;
        [SerializeField] private Image statusBadgeBackground;

        [Header("Status Pill Colors")]
        [SerializeField] private Color normalStatusColor = new Color(0.06f, 0.72f, 0.51f);
        [SerializeField] private Color warningStatusColor = new Color(0.96f, 0.62f, 0.04f);
        [SerializeField] private Color criticalStatusColor = new Color(0.94f, 0.27f, 0.27f);
        [SerializeField] private Color maintenanceStatusColor = new Color(0.55f, 0.36f, 0.96f);

        [Header("Control Buttons")]
        [SerializeField] private Button focusButton;
        [SerializeField] private Button closeInfoButton;

        private ISelectable currentSelected;

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
            if (SelectionManager.Instance != null)
            {
                SelectionManager.Instance.OnObjectSelected += HandleObjectSelected;
                SelectionManager.Instance.OnObjectDeselected += HandleObjectDeselected;
            }

            if (BuildSphereManager.Instance != null)
            {
                BuildSphereManager.Instance.OnVisualizationModeChanged += HandleModeChanged;
            }

            if (DigitalTwinDataManager.Instance != null)
            {
                DigitalTwinDataManager.Instance.OnRoomDataUpdated += HandleRoomTelemetryUpdated;
            }

            if (focusButton != null)
            {
                focusButton.onClick.AddListener(OnFocusButtonClicked);
            }

            if (closeInfoButton != null)
            {
                closeInfoButton.onClick.AddListener(OnCloseInfoClicked);
            }

            ShowNoSelectionState();
            UpdateHeaderTitle();
        }

        private void OnDestroy()
        {
            if (SelectionManager.Instance != null)
            {
                SelectionManager.Instance.OnObjectSelected -= HandleObjectSelected;
                SelectionManager.Instance.OnObjectDeselected -= HandleObjectDeselected;
            }

            if (BuildSphereManager.Instance != null)
            {
                BuildSphereManager.Instance.OnVisualizationModeChanged -= HandleModeChanged;
            }

            if (DigitalTwinDataManager.Instance != null)
            {
                DigitalTwinDataManager.Instance.OnRoomDataUpdated -= HandleRoomTelemetryUpdated;
            }
        }

        private void UpdateHeaderTitle()
        {
            if (platformTitleText != null)
            {
                platformTitleText.text = "<b>BuildSphere</b> <color=#94A3B8>| Digital Twin Platform</color>";
            }
            if (activeModeBadgeText != null)
            {
                activeModeBadgeText.text = "MODE: NORMAL";
            }
        }

        private void HandleModeChanged(VisualizationMode mode)
        {
            if (activeModeBadgeText != null)
            {
                activeModeBadgeText.text = $"MODE: {mode.ToString().ToUpper()}";
            }
        }

        private void HandleObjectSelected(ISelectable selectable)
        {
            currentSelected = selectable;
            if (selectable is RoomController room)
            {
                DisplayRoomData(room);
            }
            else
            {
                DisplayGenericData(selectable);
            }
        }

        private void HandleRoomTelemetryUpdated(RoomData data)
        {
            if (currentSelected != null && currentSelected is RoomController room && room.RoomId == data.roomId)
            {
                DisplayRoomData(room);
            }
        }

        private void HandleObjectDeselected()
        {
            currentSelected = null;
            ShowNoSelectionState();
        }

        public void DisplayRoomData(RoomController room)
        {
            if (infoPanelContainer != null) infoPanelContainer.SetActive(true);
            if (noSelectionPlaceholder != null) noSelectionPlaceholder.SetActive(false);
            if (selectionDataContainer != null) selectionDataContainer.SetActive(true);

            if (titleText != null) titleText.text = room.RoomName;
            if (idText != null) idText.text = room.RoomId.Replace("_", " ");
            if (typeText != null) typeText.text = $"CATEGORY: {room.RoomCategory}";
            if (areaText != null) areaText.text = $"{room.Area:F1} m²";
            if (occupancyText != null) occupancyText.text = $"{room.Occupancy} / {room.Capacity} Persons";
            if (temperatureText != null) temperatureText.text = $"{room.Temperature:F1} °C";
            if (energyText != null) energyText.text = $"{room.EnergyConsumption:F2} kWh";

            if (statusBadgeText != null) statusBadgeText.text = room.Status.ToString().ToUpper();
            if (statusBadgeBackground != null)
            {
                switch (room.Status)
                {
                    case RoomStatus.Normal:
                        statusBadgeBackground.color = normalStatusColor;
                        break;
                    case RoomStatus.Warning:
                        statusBadgeBackground.color = warningStatusColor;
                        break;
                    case RoomStatus.Critical:
                        statusBadgeBackground.color = criticalStatusColor;
                        break;
                    case RoomStatus.Maintenance:
                    case RoomStatus.UnderConstruction:
                        statusBadgeBackground.color = maintenanceStatusColor;
                        break;
                }
            }
        }

        public void DisplayGenericData(ISelectable selectable)
        {
            if (infoPanelContainer != null) infoPanelContainer.SetActive(true);
            if (noSelectionPlaceholder != null) noSelectionPlaceholder.SetActive(false);
            if (selectionDataContainer != null) selectionDataContainer.SetActive(true);

            if (titleText != null) titleText.text = selectable.DisplayName;
            if (idText != null) idText.text = selectable.SelectableId;
            if (typeText != null) typeText.text = $"TYPE: {selectable.Type}";
            if (areaText != null) areaText.text = "--";
            if (occupancyText != null) occupancyText.text = "--";
            if (temperatureText != null) temperatureText.text = "--";
            if (energyText != null) energyText.text = "--";
            if (statusBadgeText != null) statusBadgeText.text = "ACTIVE";
            if (statusBadgeBackground != null) statusBadgeBackground.color = normalStatusColor;
        }

        public void ShowNoSelectionState()
        {
            if (infoPanelContainer != null) infoPanelContainer.SetActive(true);
            if (noSelectionPlaceholder != null) noSelectionPlaceholder.SetActive(true);
            if (selectionDataContainer != null) selectionDataContainer.SetActive(false);
        }

        private void OnFocusButtonClicked()
        {
            if (currentSelected != null && BuildSphereCameraController.Instance != null)
            {
                BuildSphereCameraController.Instance.FocusOnRoom(currentSelected.GetFocusPoint());
            }
        }

        private void OnCloseInfoClicked()
        {
            SelectionManager.Instance?.DeselectCurrent();
        }

        public void OnClickSelectFloor(int floorNumber)
        {
            var building = BuildSphereManager.Instance?.ActiveBuilding;
            if (building != null)
            {
                if (floorNumber == -1 || floorNumber == 0)
                {
                    building.ShowAllFloors();
                    BuildSphereCameraController.Instance?.ResetView();
                }
                else
                {
                    building.SelectFloor(floorNumber);
                    var floor = building.GetFloor(floorNumber);
                    if (floor != null && BuildSphereCameraController.Instance != null)
                    {
                        BuildSphereCameraController.Instance.FocusOnFloor(floor.transform.position);
                    }
                }
            }
        }

        public void OnClickIsolateFloor(int floorNumber)
        {
            var building = BuildSphereManager.Instance?.ActiveBuilding;
            if (building != null)
            {
                building.IsolateFloor(floorNumber);
                var floor = building.GetFloor(floorNumber);
                if (floor != null && BuildSphereCameraController.Instance != null)
                {
                    BuildSphereCameraController.Instance.FocusOnFloor(floor.transform.position);
                }
            }
        }

        public void OnClickShowAllFloors()
        {
            var building = BuildSphereManager.Instance?.ActiveBuilding;
            if (building != null)
            {
                building.ShowAllFloors();
            }
            BuildSphereCameraController.Instance?.ResetView();
        }

        public void OnClickToggleExplodedView()
        {
            var building = BuildSphereManager.Instance?.ActiveBuilding;
            if (building != null)
            {
                if (building.IsExploded)
                {
                    building.CollapseFloors();
                }
                else
                {
                    building.ExplodeFloors(3.5f);
                }
            }
        }

        public void OnClickResetBuilding()
        {
            var building = BuildSphereManager.Instance?.ActiveBuilding;
            if (building != null)
            {
                building.ResetBuilding();
            }
            BuildSphereCameraController.Instance?.ResetView();
        }

        public void OnClickSetVisualizationMode(string modeName)
        {
            if (Enum.TryParse(modeName, true, out VisualizationMode mode))
            {
                BuildSphereManager.Instance?.SetVisualizationMode(mode);
            }
        }
    }
}