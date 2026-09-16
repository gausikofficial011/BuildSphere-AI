using System.Collections;
using UnityEngine;
using UnityEngine.EventSystems;

namespace BuildSphere.CameraControl
{
    [DisallowMultipleComponent]
    public class BuildSphereCameraController : MonoBehaviour
    {
        public static BuildSphereCameraController Instance { get; private set; }

        [Header("Target & Orbit Settings")]
        [Tooltip("The central world point the camera orbits around")]
        [SerializeField] private Vector3 targetLookAt = new Vector3(0, 5, 0);
        [SerializeField] private float orbitSensitivity = 3.5f;
        [SerializeField] private float panSensitivity = 0.3f;
        [SerializeField] private float zoomSensitivity = 8.0f;
        [SerializeField] private float smoothSpeed = 10.0f;

        [Header("Distance Limits")]
        [SerializeField] private float currentDistance = 28.0f;
        [SerializeField] private float minDistance = 4.0f;
        [SerializeField] private float maxDistance = 75.0f;

        [Header("Angle Limits")]
        [SerializeField] private float minPitchAngle = 5.0f;
        [SerializeField] private float maxPitchAngle = 85.0f;

        [Header("Keyboard Fly/Pan Settings")]
        [SerializeField] private float keyboardPanSpeed = 12.0f;
        [SerializeField] private bool enableKeyboardControls = true;

        [Header("Default Isometric Reset State")]
        [SerializeField] private Vector3 defaultTarget = new Vector3(0, 5, 0);
        [SerializeField] private float defaultDistance = 28.0f;
        [SerializeField] private float defaultYaw = -40.0f;
        [SerializeField] private float defaultPitch = 30.0f;

        private float currentYaw = -40.0f;
        private float currentPitch = 30.0f;
        private float targetYaw = -40.0f;
        private float targetPitch = 30.0f;
        private float targetDistance = 28.0f;
        private Vector3 currentTargetLookAt;

        private Coroutine activeTransitionCoroutine;
        private bool isTransitioning = false;

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
            currentTargetLookAt = targetLookAt;
            targetYaw = currentYaw = defaultYaw;
            targetPitch = currentPitch = defaultPitch;
            targetDistance = currentDistance = defaultDistance;

            UpdateCameraTransformImmediate();
        }

        private void LateUpdate()
        {
            if (isTransitioning) return;

            HandleMouseInput();
            
            if (enableKeyboardControls)
            {
                HandleKeyboardInput();
            }

            ApplySmoothMovement();
        }

        private void HandleMouseInput()
        {
            if (EventSystem.current != null && EventSystem.current.IsPointerOverGameObject())
            {
                return;
            }

            if (Input.GetMouseButton(1) || (Input.GetKey(KeyCode.LeftAlt) && Input.GetMouseButton(0)))
            {
                float mouseX = Input.GetAxis("Mouse X") * orbitSensitivity;
                float mouseY = Input.GetAxis("Mouse Y") * orbitSensitivity;

                targetYaw += mouseX;
                targetPitch -= mouseY;
                targetPitch = Mathf.Clamp(targetPitch, minPitchAngle, maxPitchAngle);
            }

            if (Input.GetMouseButton(2) || (Input.GetKey(KeyCode.LeftShift) && Input.GetMouseButton(1)))
            {
                float deltaX = -Input.GetAxis("Mouse X") * panSensitivity * (targetDistance * 0.05f);
                float deltaY = -Input.GetAxis("Mouse Y") * panSensitivity * (targetDistance * 0.05f);

                Vector3 right = transform.right;
                Vector3 up = transform.up;

                targetLookAt += right * deltaX + up * deltaY;
                targetLookAt.y = Mathf.Max(0.0f, targetLookAt.y);
            }

            float scroll = Input.GetAxis("Mouse ScrollWheel");
            if (Mathf.Abs(scroll) > 0.001f)
            {
                targetDistance -= scroll * zoomSensitivity * (targetDistance * 0.15f);
                targetDistance = Mathf.Clamp(targetDistance, minDistance, maxDistance);
            }
        }

        private void HandleKeyboardInput()
        {
            float horizontal = Input.GetAxisRaw("Horizontal");
            float vertical = Input.GetAxisRaw("Vertical");

            if (Mathf.Abs(horizontal) > 0.01f || Mathf.Abs(vertical) > 0.01f)
            {
                Vector3 forward = transform.forward;
                forward.y = 0;
                forward.Normalize();

                Vector3 right = transform.right;
                right.y = 0;
                right.Normalize();

                Vector3 moveDir = (forward * vertical + right * horizontal).normalized;
                targetLookAt += moveDir * keyboardPanSpeed * Time.deltaTime;
            }

            if (Input.GetKey(KeyCode.E))
            {
                targetLookAt += Vector3.up * keyboardPanSpeed * Time.deltaTime;
            }
            else if (Input.GetKey(KeyCode.Q))
            {
                targetLookAt -= Vector3.up * keyboardPanSpeed * Time.deltaTime;
                targetLookAt.y = Mathf.Max(0f, targetLookAt.y);
            }

            if (Input.GetKeyDown(KeyCode.Home) || Input.GetKeyDown(KeyCode.R))
            {
                ResetView();
            }
        }

        private void ApplySmoothMovement()
        {
            currentYaw = Mathf.Lerp(currentYaw, targetYaw, Time.deltaTime * smoothSpeed);
            currentPitch = Mathf.Lerp(currentPitch, targetPitch, Time.deltaTime * smoothSpeed);
            currentDistance = Mathf.Lerp(currentDistance, targetDistance, Time.deltaTime * smoothSpeed);
            currentTargetLookAt = Vector3.Lerp(currentTargetLookAt, targetLookAt, Time.deltaTime * smoothSpeed);

            Quaternion rotation = Quaternion.Euler(currentPitch, currentYaw, 0);
            Vector3 offset = rotation * new Vector3(0, 0, -currentDistance);

            transform.position = currentTargetLookAt + offset;
            transform.LookAt(currentTargetLookAt);
        }

        private void UpdateCameraTransformImmediate()
        {
            Quaternion rotation = Quaternion.Euler(currentPitch, currentYaw, 0);
            Vector3 offset = rotation * new Vector3(0, 0, -currentDistance);

            transform.position = currentTargetLookAt + offset;
            transform.LookAt(currentTargetLookAt);
        }

        public void FocusOnTarget(Vector3 worldPosition, float distance = 12.0f, float pitch = 30.0f, float yaw = -45.0f, float duration = 1.0f)
        {
            if (activeTransitionCoroutine != null)
            {
                StopCoroutine(activeTransitionCoroutine);
            }
            activeTransitionCoroutine = StartCoroutine(AnimateCameraTransition(worldPosition, distance, pitch, yaw, duration));
        }

        public void FocusOnBuilding(Vector3 center, float boundsSize = 25.0f)
        {
            float targetDist = boundsSize * 1.3f;
            FocusOnTarget(center, targetDist, 28.0f, -40.0f, 1.2f);
        }

        public void FocusOnFloor(Vector3 floorCenter, float floorWidth = 18.0f)
        {
            float targetDist = floorWidth * 1.1f;
            FocusOnTarget(floorCenter, targetDist, 35.0f, -30.0f, 1.0f);
        }

        public void FocusOnRoom(Vector3 roomCenter, float roomSize = 8.0f)
        {
            float targetDist = Mathf.Max(minDistance, roomSize * 1.5f);
            FocusOnTarget(roomCenter + Vector3.up * 0.5f, targetDist, 40.0f, -45.0f, 0.8f);
        }

        public void ResetView()
        {
            FocusOnTarget(defaultTarget, defaultDistance, defaultPitch, defaultYaw, 1.0f);
        }

        private IEnumerator AnimateCameraTransition(Vector3 targetPos, float targetDist, float targetP, float targetY, float duration)
        {
            isTransitioning = true;

            Vector3 startPos = currentTargetLookAt;
            float startDist = currentDistance;
            float startPitch = currentPitch;
            float startYaw = currentYaw;

            float shortestYaw = Mathf.LerpAngle(startYaw, targetY, 1.0f);

            float elapsed = 0f;
            while (elapsed < duration)
            {
                elapsed += Time.deltaTime;
                float t = Mathf.SmoothStep(0f, 1f, elapsed / duration);

                currentTargetLookAt = Vector3.Lerp(startPos, targetPos, t);
                currentDistance = Mathf.Lerp(startDist, targetDist, t);
                currentPitch = Mathf.Lerp(startPitch, targetP, t);
                currentYaw = Mathf.LerpAngle(startYaw, shortestYaw, t);

                Quaternion rotation = Quaternion.Euler(currentPitch, currentYaw, 0);
                Vector3 offset = rotation * new Vector3(0, 0, -currentDistance);

                transform.position = currentTargetLookAt + offset;
                transform.LookAt(currentTargetLookAt);

                yield return null;
            }

            targetLookAt = targetPos;
            targetDistance = targetDist;
            targetPitch = targetP;
            targetYaw = shortestYaw;

            isTransitioning = false;
            activeTransitionCoroutine = null;
        }
    }
}