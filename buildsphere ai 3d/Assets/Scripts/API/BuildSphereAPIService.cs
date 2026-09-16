using System;
using System.Collections;
using UnityEngine;
using UnityEngine.Networking;
using BuildSphere.Data;

namespace BuildSphere.API
{
    [DisallowMultipleComponent]
    public class BuildSphereAPIService : MonoBehaviour
    {
        public static BuildSphereAPIService Instance { get; private set; }

        [Header("Configuration")]
        [SerializeField] private BuildSphereAPIConfig apiConfig;

        [Header("Connection Health")]
        [SerializeField] private bool isBackendOnline = false;
        [SerializeField] private string lastHealthCheckTime = "";

        public bool IsBackendOnline => isBackendOnline;

        public event Action<bool> OnConnectionStatusChanged;
        public event Action<string> OnTelemetrySummaryReceived;

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
            if (apiConfig == null)
            {
                apiConfig = ScriptableObject.CreateInstance<BuildSphereAPIConfig>();
            }

            StartCoroutine(CheckHealthRoutine());
        }

        public void CheckBackendHealth(Action<bool> callback = null)
        {
            StartCoroutine(CheckHealthRoutine(callback));
        }

        private IEnumerator CheckHealthRoutine(Action<bool> callback = null)
        {
            string url = $"{apiConfig.ApiBaseUrl}/health";
            using (UnityWebRequest req = UnityWebRequest.Get(url))
            {
                req.timeout = apiConfig.TimeoutSeconds;
                yield return req.SendWebRequest();

                bool wasOnline = isBackendOnline;
                if (req.result == UnityWebRequest.Result.Success)
                {
                    isBackendOnline = true;
                    lastHealthCheckTime = DateTime.UtcNow.ToString("HH:mm:ss");
                    Debug.Log($"<color=#10B981>[BuildSphereAPIService]</color> Connected to backend API at <b>{apiConfig.ApiBaseUrl}</b>.");
                }
                else
                {
                    isBackendOnline = false;
                    Debug.LogWarning($"<color=#F59E0B>[BuildSphereAPIService]</color> Backend unreachable ({req.error}). Offline mock fallback active.");
                }

                if (wasOnline != isBackendOnline)
                {
                    OnConnectionStatusChanged?.Invoke(isBackendOnline);
                }

                callback?.Invoke(isBackendOnline);
            }
        }

        public void FetchTelemetrySummary(Action<string> onComplete = null)
        {
            StartCoroutine(GetTelemetrySummaryRoutine(onComplete));
        }

        private IEnumerator GetTelemetrySummaryRoutine(Action<string> onComplete)
        {
            if (!isBackendOnline && apiConfig.EnableOfflineMockFallback)
            {
                string mockSummary = "{\"sensors_online\": 48, \"signal_quality\": \"100%\", \"structural_health\": \"99.2%\"}";
                OnTelemetrySummaryReceived?.Invoke(mockSummary);
                onComplete?.Invoke(mockSummary);
                yield break;
            }

            string url = $"{apiConfig.ApiBaseUrl}/api/twin/telemetry-summary";
            using (UnityWebRequest req = UnityWebRequest.Get(url))
            {
                req.timeout = apiConfig.TimeoutSeconds;
                yield return req.SendWebRequest();

                if (req.result == UnityWebRequest.Result.Success)
                {
                    string json = req.downloadHandler.text;
                    OnTelemetrySummaryReceived?.Invoke(json);
                    onComplete?.Invoke(json);
                }
                else
                {
                    Debug.LogWarning($"[BuildSphereAPIService] Error fetching telemetry: {req.error}");
                    onComplete?.Invoke(null);
                }
            }
        }
    }
}
