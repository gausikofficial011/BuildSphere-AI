using System;
using System.Collections.Generic;
using UnityEngine;
using BuildSphere.Core;
using BuildSphere.Building;
using BuildSphere.Rooms;

namespace BuildSphere.Data
{
    [DisallowMultipleComponent]
    public class DigitalTwinDataManager : MonoBehaviour
    {
        public static DigitalTwinDataManager Instance { get; private set; }

        [Header("Active Digital Twin State")]
        [SerializeField] private BuildingData currentBuildingData = new BuildingData();

        [Header("Configuration")]
        [SerializeField] private TextAsset defaultStateJson;
        [SerializeField] private bool loadDefaultOnStart = true;

        public BuildingData CurrentBuildingData => currentBuildingData;

        public event Action<BuildingData> OnBuildingDataUpdated;
        public event Action<RoomData> OnRoomDataUpdated;
        public event Action<AlertData> OnAlertReceived;

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
            if (loadDefaultOnStart)
            {
                if (defaultStateJson != null && !string.IsNullOrEmpty(defaultStateJson.text))
                {
                    LoadFromJson(defaultStateJson.text);
                }
                else
                {
                    CaptureDataFromScene();
                }
            }
        }

        public void LoadFromJson(string jsonContent)
        {
            try
            {
                BuildingData loadedData = JsonUtility.FromJson<BuildingData>(jsonContent);
                if (loadedData != null)
                {
                    currentBuildingData = loadedData;
                    ApplyDataToScene(currentBuildingData);
                    Debug.Log($"<color=#10B981>[DigitalTwinDataManager]</color> Loaded digital twin data for: <b>{currentBuildingData.buildingName}</b> ({currentBuildingData.floors.Count} floors).");
                    OnBuildingDataUpdated?.Invoke(currentBuildingData);
                }
            }
            catch (Exception ex)
            {
                Debug.LogError($"[DigitalTwinDataManager] Error deserializing JSON data: {ex.Message}");
            }
        }

        public string ExportToJson(bool prettyPrint = true)
        {
            CaptureDataFromScene();
            return JsonUtility.ToJson(currentBuildingData, prettyPrint);
        }

        public void ApplyDataToScene(BuildingData data)
        {
            if (data == null) return;

            var building = BuildSphereManager.Instance?.ActiveBuilding;
            if (building == null) building = FindFirstObjectByType<BuildingController>();
            if (building == null) return;

            foreach (var floorData in data.floors)
            {
                var floorController = building.GetFloor(floorData.floorNumber);
                if (floorController != null)
                {
                    foreach (var roomData in floorData.rooms)
                    {
                        var roomController = floorController.GetRoom(roomData.roomId);
                        if (roomController != null)
                        {
                            RoomStatus statusEnum = RoomStatus.Normal;
                            Enum.TryParse(roomData.status, true, out statusEnum);
                            roomController.UpdateTelemetry(roomData.occupancy, roomData.temperature, roomData.energyConsumption, statusEnum);
                        }
                    }
                }
            }
        }

        [ContextMenu("Capture Data From Scene")]
        public void CaptureDataFromScene()
        {
            var building = BuildSphereManager.Instance?.ActiveBuilding;
            if (building == null) building = FindFirstObjectByType<BuildingController>();
            if (building == null) return;

            currentBuildingData = new BuildingData
            {
                buildingId = building.BuildingId,
                buildingName = building.BuildingName,
                location = building.Location,
                constructionStatus = building.ConstructionStatus,
                totalFloors = building.Floors.Count,
                floors = new List<FloorData>()
            };

            foreach (var floor in building.Floors)
            {
                FloorData fData = new FloorData
                {
                    floorId = floor.FloorId,
                    buildingId = building.BuildingId,
                    floorNumber = floor.FloorNumber,
                    floorName = floor.FloorName,
                    elevation = floor.FloorElevation,
                    rooms = new List<RoomData>()
                };

                foreach (var room in floor.Rooms)
                {
                    RoomData rData = new RoomData
                    {
                        roomId = room.RoomId,
                        floorId = floor.FloorId,
                        name = room.RoomName,
                        category = room.RoomCategory.ToString(),
                        area = room.Area,
                        occupancy = room.Occupancy,
                        capacity = room.Capacity,
                        temperature = room.Temperature,
                        energyConsumption = room.EnergyConsumption,
                        status = room.Status.ToString()
                    };
                    fData.rooms.Add(rData);
                }

                currentBuildingData.floors.Add(fData);
            }

            Debug.Log($"<color=#38BDF8>[DigitalTwinDataManager]</color> Captured <b>{currentBuildingData.floors.Count}</b> floors and rooms from 3D scene.");
        }

        public RoomData GetRoomData(string roomId)
        {
            foreach (var f in currentBuildingData.floors)
            {
                var r = f.rooms.Find(x => x.roomId.Equals(roomId, StringComparison.OrdinalIgnoreCase));
                if (r != null) return r;
            }
            return null;
        }

        public void UpdateRoomTelemetry(string roomId, int occupancy, float temperature, float energy, string status)
        {
            RoomData rData = GetRoomData(roomId);
            if (rData != null)
            {
                rData.occupancy = occupancy;
                rData.temperature = temperature;
                rData.energyConsumption = energy;
                rData.status = status;

                var building = BuildSphereManager.Instance?.ActiveBuilding;
                if (building != null)
                {
                    foreach (var f in building.Floors)
                    {
                        var rController = f.GetRoom(roomId);
                        if (rController != null)
                        {
                            Enum.TryParse(status, true, out RoomStatus s);
                            rController.UpdateTelemetry(occupancy, temperature, energy, s);
                            break;
                        }
                    }
                }

                OnRoomDataUpdated?.Invoke(rData);
            }
        }
    }
}
