using System.Collections.Generic;
using UnityEngine;
using BuildSphere.Rooms;

namespace BuildSphere.Building
{
    [DisallowMultipleComponent]
    public class FloorController : MonoBehaviour
    {
        [Header("Floor Metadata")]
        [SerializeField] private string floorId = "FL_01";
        [SerializeField] private int floorNumber = 1;
        [SerializeField] private string floorName = "Ground Level - Engineering & Labs";
        [SerializeField] private float floorElevation = 0f;

        [Header("Floor Rooms")]
        [SerializeField] private List<RoomController> registeredRooms = new List<RoomController>();

        [Header("Visual Feedback")]
        [SerializeField] private MeshRenderer floorRenderer;
        [SerializeField] private Material defaultMaterial;
        [SerializeField] private Material highlightMaterial;

        private BuildingController parentBuilding;
        private Vector3 originalLocalPosition;

        public string FloorId => floorId;
        public int FloorNumber => floorNumber;
        public string FloorName => floorName;
        public float FloorElevation => floorElevation;
        public IReadOnlyList<RoomController> Rooms => registeredRooms;

        public void InitializeFloor(BuildingController building)
        {
            parentBuilding = building;
            originalLocalPosition = transform.localPosition;

            if (floorRenderer == null)
            {
                floorRenderer = GetComponentInChildren<MeshRenderer>();
            }

            DiscoverRooms();
        }

        [ContextMenu("Auto-Discover Floor Rooms")]
        public void DiscoverRooms()
        {
            registeredRooms.Clear();
            RoomController[] roomComponents = GetComponentsInChildren<RoomController>(true);
            foreach (var room in roomComponents)
            {
                registeredRooms.Add(room);
                room.InitializeRoom(floorId);
            }
            Debug.Log($"<color=#10B981>[FloorController]</color> Floor <b>{floorName}</b> discovered <b>{registeredRooms.Count}</b> room(s).");
        }

        public RoomController GetRoom(string targetRoomId)
        {
            return registeredRooms.Find(r => r.RoomId.Equals(targetRoomId, System.StringComparison.OrdinalIgnoreCase));
        }

        public void SetVisibility(bool isVisible)
        {
            gameObject.SetActive(isVisible);
        }

        public void SetHighlight(bool isHighlighted)
        {
            if (floorRenderer != null && highlightMaterial != null && defaultMaterial != null)
            {
                floorRenderer.material = isHighlighted ? highlightMaterial : defaultMaterial;
            }
        }

        public void SetExplodedOffset(float yOffset)
        {
            transform.localPosition = originalLocalPosition + new Vector3(0, yOffset, 0);
        }

        public void ResetPosition()
        {
            transform.localPosition = originalLocalPosition;
        }
    }
}