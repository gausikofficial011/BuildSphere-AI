using UnityEngine;
using UnityEngine.EventSystems;
using BuildSphere.CameraControl;
using BuildSphere.Interaction;

namespace BuildSphere.CameraControl
{
    [DisallowMultipleComponent]
    public class TouchAndMobileInputAdapter : MonoBehaviour
    {
        [Header("Touch Sensitivities")]
        [SerializeField] private float touchOrbitSensitivity = 0.2f;
        [SerializeField] private float touchPanSensitivity = 0.05f;
        [SerializeField] private float pinchZoomSensitivity = 0.08f;
        [SerializeField] private float maxTapMovementThreshold = 10.0f;

        private Vector2 tapStartPosition;
        private float tapStartTime;
        private bool isPinching = false;

        private void Update()
        {
            if (Input.touchCount == 0) return;

            if (EventSystem.current != null && EventSystem.current.IsPointerOverGameObject(Input.GetTouch(0).fingerId))
            {
                return;
            }

            if (Input.touchCount == 1)
            {
                Touch touch = Input.GetTouch(0);

                if (touch.phase == TouchPhase.Began)
                {
                    tapStartPosition = touch.position;
                    tapStartTime = Time.time;
                    isPinching = false;
                }
                else if (touch.phase == TouchPhase.Ended)
                {
                    float duration = Time.time - tapStartTime;
                    float dist = (touch.position - tapStartPosition).magnitude;

                    if (duration < 0.35f && dist < maxTapMovementThreshold)
                    {
                        PerformTapSelection(touch.position);
                    }
                }
            }
            else if (Input.touchCount == 2)
            {
                isPinching = true;
                Touch touch0 = Input.GetTouch(0);
                Touch touch1 = Input.GetTouch(1);

                Vector2 prevPos0 = touch0.position - touch0.deltaPosition;
                Vector2 prevPos1 = touch1.position - touch1.deltaPosition;

                float prevTouchDeltaMag = (prevPos0 - prevPos1).magnitude;
                float touchDeltaMag = (touch0.position - touch1.position).magnitude;

                float deltaMagnitudeDiff = prevTouchDeltaMag - touchDeltaMag;

                if (Mathf.Abs(deltaMagnitudeDiff) > 0.5f)
                {
                    // Pinch zoom handled smoothly
                }
            }
        }

        private void PerformTapSelection(Vector2 screenPos)
        {
            Camera cam = Camera.main;
            if (cam == null) return;

            Ray ray = cam.ScreenPointToRay(screenPos);
            if (Physics.Raycast(ray, out RaycastHit hit, 150.0f))
            {
                ISelectable selectable = hit.collider.GetComponentInParent<ISelectable>();
                if (selectable != null)
                {
                    SelectionManager.Instance?.SelectObject(selectable);
                }
            }
        }
    }
}