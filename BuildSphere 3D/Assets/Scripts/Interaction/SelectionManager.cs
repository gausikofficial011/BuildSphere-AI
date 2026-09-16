using System;
using UnityEngine;
using UnityEngine.EventSystems;
using BuildSphere.CameraControl;

namespace BuildSphere.Interaction
{
    [DisallowMultipleComponent]
    public class SelectionManager : MonoBehaviour
    {
        public static SelectionManager Instance { get; private set; }

        [Header("Raycast Settings")]
        [SerializeField] private LayerMask selectableLayers = ~0;
        [SerializeField] private float maxRaycastDistance = 150f;
        [SerializeField] private bool autoFocusCameraOnSelect = false;

        [Header("Current Selection State")]
        [SerializeField] private MonoBehaviour currentSelectedObject;
        private ISelectable currentSelectable;
        private ISelectable currentHovered;

        public event Action<ISelectable> OnObjectSelected;
        public event Action OnObjectDeselected;
        public event Action<ISelectable> OnObjectHovered;

        public ISelectable CurrentSelection => currentSelectable;

        private UnityEngine.Camera mainCam;

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
            mainCam = UnityEngine.Camera.main;
        }

        private void Update()
        {
            if (EventSystem.current != null && EventSystem.current.IsPointerOverGameObject())
            {
                ClearHover();
                return;
            }

            HandleHoverRaycast();
            HandleClickSelection();
        }

        private void HandleHoverRaycast()
        {
            if (mainCam == null) mainCam = UnityEngine.Camera.main;
            if (mainCam == null) return;

            Ray ray = mainCam.ScreenPointToRay(Input.mousePosition);
            if (Physics.Raycast(ray, out RaycastHit hit, maxRaycastDistance, selectableLayers))
            {
                ISelectable selectable = hit.collider.GetComponentInParent<ISelectable>();
                if (selectable != null)
                {
                    if (currentHovered != selectable)
                    {
                        ClearHover();
                        currentHovered = selectable;
                        currentHovered.OnHoverEnter();
                        OnObjectHovered?.Invoke(currentHovered);
                    }
                    return;
                }
            }

            ClearHover();
        }

        private void HandleClickSelection()
        {
            if (Input.GetMouseButtonDown(0))
            {
                if (Input.GetKey(KeyCode.LeftAlt)) return;

                if (mainCam == null) mainCam = UnityEngine.Camera.main;
                if (mainCam == null) return;

                Ray ray = mainCam.ScreenPointToRay(Input.mousePosition);
                if (Physics.Raycast(ray, out RaycastHit hit, maxRaycastDistance, selectableLayers))
                {
                    ISelectable selectable = hit.collider.GetComponentInParent<ISelectable>();
                    if (selectable != null)
                    {
                        SelectObject(selectable);
                        return;
                    }
                }

                DeselectCurrent();
            }
        }

        public void SelectObject(ISelectable selectable)
        {
            if (currentSelectable == selectable && selectable != null)
            {
                return;
            }

            DeselectCurrent();

            currentSelectable = selectable;
            currentSelectedObject = selectable as MonoBehaviour;

            if (currentSelectable != null)
            {
                currentSelectable.OnSelect();
                Debug.Log($"<color=#38BDF8>[SelectionManager]</color> Selected: <b>{currentSelectable.DisplayName}</b> (Type: {currentSelectable.Type}, ID: {currentSelectable.SelectableId})");
                OnObjectSelected?.Invoke(currentSelectable);

                if (autoFocusCameraOnSelect && BuildSphereCameraController.Instance != null)
                {
                    BuildSphereCameraController.Instance.FocusOnRoom(currentSelectable.GetFocusPoint());
                }
            }
        }

        public void DeselectCurrent()
        {
            if (currentSelectable != null)
            {
                currentSelectable.OnDeselect();
                currentSelectable = null;
                currentSelectedObject = null;
                OnObjectDeselected?.Invoke();
            }
        }

        private void ClearHover()
        {
            if (currentHovered != null)
            {
                currentHovered.OnHoverExit();
                currentHovered = null;
            }
        }

        public void SelectRoomById(string roomId)
        {
            Rooms.RoomController[] rooms = FindObjectsByType<Rooms.RoomController>(FindObjectsSortMode.None);
            foreach (var room in rooms)
            {
                if (room.RoomId.Equals(roomId, StringComparison.OrdinalIgnoreCase))
                {
                    SelectObject(room);
                    if (BuildSphereCameraController.Instance != null)
                    {
                        BuildSphereCameraController.Instance.FocusOnRoom(room.GetFocusPoint());
                    }
                    return;
                }
            }
            Debug.LogWarning($"[SelectionManager] Room with ID {roomId} not found.");
        }
    }
}