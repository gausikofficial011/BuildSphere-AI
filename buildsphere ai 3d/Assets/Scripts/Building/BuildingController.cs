using System.Collections.Generic;
using UnityEngine;

namespace BuildSphere.Building
{
    [DisallowMultipleComponent]
    public class BuildingController : MonoBehaviour
    {
        [Header("Building Metadata")]
        [SerializeField] private string buildingId = "BLD_001";
        [SerializeField] private string buildingName = "BuildSphere Innovation Tower";
        [SerializeField] private string location = "Main Tech Campus, Zone A";
        [SerializeField] private string constructionStatus = "Operational";

        [Header("Floors Configuration")]
        [SerializeField] private List<FloorController> registeredFloors = new List<FloorController>();
        [SerializeField] private GameObject groundStructure;
        [SerializeField] private GameObject roofStructure;

        [Header("State")]
        [SerializeField] private int selectedFloorIndex = -1;
        [SerializeField] private bool isExploded = false;

        public string BuildingId => buildingId;
        public string BuildingName => buildingName;
        public string Location => location;
        public string ConstructionStatus => constructionStatus;
        public IReadOnlyList<FloorController> Floors => registeredFloors;
        public int SelectedFloorIndex => selectedFloorIndex;
        public bool IsExploded => isExploded;

        public void InitializeBuilding()
        {
            DiscoverFloors();
        }

        [ContextMenu("Auto-Discover Floors")]
        public void DiscoverFloors()
        {
            registeredFloors.Clear();
            FloorController[] floorComponents = GetComponentsInChildren<FloorController>(true);
            foreach (var floor in floorComponents)
            {
                registeredFloors.Add(floor);
                floor.InitializeFloor(this);
            }
            Debug.Log($"<color=#10B981>[BuildingController]</color> Auto-discovered <b>{registeredFloors.Count}</b> floor(s) in {buildingName}.");
        }

        public FloorController GetFloor(int floorNumber)
        {
            return registeredFloors.Find(f => f.FloorNumber == floorNumber);
        }

        public void SelectFloor(int floorNumber)
        {
            selectedFloorIndex = floorNumber;
            foreach (var floor in registeredFloors)
            {
                bool isTarget = (floor.FloorNumber == floorNumber);
                floor.SetHighlight(isTarget);
            }
            Core.BuildSphereManager.Instance?.NotifyFloorSelected(floorNumber);
        }

        public void IsolateFloor(int floorNumber)
        {
            selectedFloorIndex = floorNumber;
            foreach (var floor in registeredFloors)
            {
                floor.SetVisibility(floor.FloorNumber == floorNumber);
            }
            if (roofStructure != null) roofStructure.SetActive(false);
        }

        public void ShowAllFloors()
        {
            selectedFloorIndex = -1;
            foreach (var floor in registeredFloors)
            {
                floor.SetVisibility(true);
                floor.SetHighlight(false);
            }
            if (roofStructure != null) roofStructure.SetActive(true);
            if (groundStructure != null) groundStructure.SetActive(true);
        }

        public void ExplodeFloors(float separationDistance = 3.5f)
        {
            isExploded = true;
            for (int i = 0; i < registeredFloors.Count; i++)
            {
                float yOffset = i * separationDistance;
                registeredFloors[i].SetExplodedOffset(yOffset);
            }
            if (roofStructure != null)
            {
                roofStructure.transform.localPosition = new Vector3(0, (registeredFloors.Count) * separationDistance + 10.5f, 0);
            }
        }

        public void CollapseFloors()
        {
            isExploded = false;
            foreach (var floor in registeredFloors)
            {
                floor.ResetPosition();
            }
            if (roofStructure != null)
            {
                roofStructure.transform.localPosition = new Vector3(0, 10.5f, 0);
            }
        }

        public void ResetBuilding()
        {
            ShowAllFloors();
            CollapseFloors();
        }
    }
}