using UnityEngine;
using UnityEngine.InputSystem;
using BuildSphere.Building;
using BuildSphere.Rooms;

namespace BuildSphere.Interaction
{
    [DisallowMultipleComponent]
    public class RuntimeBuildingGizmos : MonoBehaviour
    {
        [Header("Interaction Configuration")]
        [SerializeField] private LayerMask selectableLayers = ~0;
        [SerializeField] private Color selectionGizmoColor = new Color(0.0f, 0.85f, 1.0f, 0.85f);
        [SerializeField] private Color hoverGizmoColor = new Color(1.0f, 0.8f, 0.2f, 0.6f);
        [SerializeField] private bool showWireframeBounds = true;

        private Transform currentHovered;
        private Transform currentSelected;
        private Camera mainCamera;

        public Transform CurrentSelected => currentSelected;

        private void Start()
        {
            mainCamera = Camera.main;
        }

        private void Update()
        {
            if (mainCamera == null) mainCamera = Camera.main;
            if (mainCamera == null) return;

            HandleRaycastHover();
            HandleSelectionClick();
        }

        private void HandleRaycastHover()
        {
            Vector2 mousePos = Mouse.current != null ? Mouse.current.position.ReadValue() : (Vector2)Input.mousePosition;
            Ray ray = mainCamera.ScreenPointToRay(mousePos);

            if (Physics.Raycast(ray, out RaycastHit hit, 500f, selectableLayers))
            {
                if (currentHovered != hit.transform)
                {
                    currentHovered = hit.transform;
                }
            }
            else
            {
                currentHovered = null;
            }
        }

        private void HandleSelectionClick()
        {
            bool clicked = false;
            if (Mouse.current != null)
            {
                clicked = Mouse.current.leftButton.wasPressedThisFrame;
            }
            else
            {
                clicked = Input.GetMouseButtonDown(0);
            }

            if (clicked && currentHovered != null)
            {
                currentSelected = currentHovered;
                Debug.Log($"<color=#38BDF8>[RuntimeBuildingGizmos]</color> Selected element: <b>{currentSelected.name}</b>");
            }
        }

        private void OnDrawGizmos()
        {
            if (!showWireframeBounds) return;

            if (currentSelected != null)
            {
                Gizmos.color = selectionGizmoColor;
                DrawObjectBounds(currentSelected);
            }

            if (currentHovered != null && currentHovered != currentSelected)
            {
                Gizmos.color = hoverGizmoColor;
                DrawObjectBounds(currentHovered);
            }
        }

        private void DrawObjectBounds(Transform target)
        {
            var col = target.GetComponent<Collider>();
            if (col != null)
            {
                Gizmos.matrix = Matrix4x4.identity;
                Gizmos.DrawWireCube(col.bounds.center, col.bounds.size);
            }
            else
            {
                var mf = target.GetComponent<MeshFilter>();
                if (mf != null && mf.sharedMesh != null)
                {
                    Gizmos.matrix = target.localToWorldMatrix;
                    Gizmos.DrawWireCube(mf.sharedMesh.bounds.center, mf.sharedMesh.bounds.size);
                }
            }
        }
    }
}
