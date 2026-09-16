using UnityEngine;

namespace BuildSphere.API
{
    [CreateAssetMenu(fileName = "BuildSphereAPIConfig", menuName = "BuildSphere/API Configuration")]
    public class BuildSphereAPIConfig : ScriptableObject
    {
        [Header("Backend Endpoint")]
        [Tooltip("FastAPI Backend Host URL")]
        [SerializeField] private string apiBaseUrl = "http://localhost:8000";

        [Header("Network Settings")]
        [Tooltip("HTTP Timeout in seconds")]
        [SerializeField] private int timeoutSeconds = 5;
        [Tooltip("Automatically fall back to local mock data if backend server is unreachable")]
        [SerializeField] private bool enableOfflineMockFallback = true;
        [Tooltip("Interval in seconds for polling live telemetry")]
        [SerializeField] private float telemetryPollInterval = 3.0f;

        public string ApiBaseUrl => apiBaseUrl.TrimEnd('/');
        public int TimeoutSeconds => timeoutSeconds;
        public bool EnableOfflineMockFallback => enableOfflineMockFallback;
        public float TelemetryPollInterval => telemetryPollInterval;
    }
}
