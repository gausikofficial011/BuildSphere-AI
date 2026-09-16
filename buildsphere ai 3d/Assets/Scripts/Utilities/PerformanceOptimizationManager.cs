using UnityEngine;
using TMPro;

namespace BuildSphere.Utilities
{
    [DisallowMultipleComponent]
    public class PerformanceOptimizationManager : MonoBehaviour
    {
        public static PerformanceOptimizationManager Instance { get; private set; }

        [Header("Frame Rate & VSync")]
        [SerializeField] private int targetFrameRate = 60;
        [SerializeField] private int vSyncCount = 0;

        [Header("Telemetry FPS Display (Optional)")]
        [SerializeField] private TextMeshProUGUI fpsCounterText;
        [SerializeField] private bool showFpsCounter = false;

        private float deltaTime = 0.0f;

        private void Awake()
        {
            if (Instance != null && Instance != this)
            {
                Destroy(gameObject);
                return;
            }
            Instance = this;

            Application.targetFrameRate = targetFrameRate;
            QualitySettings.vSyncCount = vSyncCount;
        }

        private void Update()
        {
            if (showFpsCounter && fpsCounterText != null)
            {
                deltaTime += (Time.unscaledDeltaTime - deltaTime) * 0.1f;
                float fps = 1.0f / deltaTime;
                fpsCounterText.text = $"FPS: {Mathf.Ceil(fps)} | QUALITY: {QualitySettings.names[QualitySettings.GetQualityLevel()]}";
            }
        }

        public void SetQualityLevel(int levelIndex)
        {
            if (levelIndex >= 0 && levelIndex < QualitySettings.names.Length)
            {
                QualitySettings.SetQualityLevel(levelIndex, true);
                Debug.Log($"<color=#38BDF8>[PerformanceOptimizationManager]</color> Quality level set to: <b>{QualitySettings.names[levelIndex]}</b>");
            }
        }
    }
}
