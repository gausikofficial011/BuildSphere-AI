using System;
using System.Runtime.InteropServices;
using UnityEngine;
using BuildSphere.AI;
using BuildSphere.Interaction;
using BuildSphere.Core;

namespace BuildSphere.Utilities
{
    [DisallowMultipleComponent]
    public class BuildSphereBridge : MonoBehaviour
    {
        public static BuildSphereBridge Instance { get; private set; }

        #if UNITY_WEBGL && !UNITY_EDITOR
        [DllImport("__Internal")]
        private static extern void SendToReact(string eventName, string payloadJson);
        #endif

        private void Awake()
        {
            if (Instance != null && Instance != this)
            {
                Destroy(gameObject);
                return;
            }
            Instance = this;
            DontDestroyOnLoad(gameObject);
        }

        private void Start()
        {
            if (SelectionManager.Instance != null)
            {
                SelectionManager.Instance.OnObjectSelected += HandleRoomSelectedInUnity;
            }
        }

        private void OnDestroy()
        {
            if (SelectionManager.Instance != null)
            {
                SelectionManager.Instance.OnObjectSelected -= HandleRoomSelectedInUnity;
            }
        }

        public void ExecuteAICommandFromWeb(string naturalLanguageOrJson)
        {
            Debug.Log($"[BuildSphereBridge] Received command from Web: {naturalLanguageOrJson}");
            if (AIActionManager.Instance != null)
            {
                AIActionManager.Instance.ProcessAndExecutePrompt(naturalLanguageOrJson);
            }
        }

        public void SelectRoomFromWeb(string roomId)
        {
            Debug.Log($"[BuildSphereBridge] Select room from Web: {roomId}");
            SelectionManager.Instance?.SelectRoomById(roomId);
        }

        public void SetVisualizationModeFromWeb(string modeName)
        {
            if (Enum.TryParse(modeName, true, out VisualizationMode mode))
            {
                BuildSphereManager.Instance?.SetVisualizationMode(mode);
            }
        }

        private void HandleRoomSelectedInUnity(ISelectable selectable)
        {
            string payload = $"{{\"id\":\"{selectable.SelectableId}\", \"name\":\"{selectable.DisplayName}\", \"type\":\"{selectable.Type}\"}}";

            #if UNITY_WEBGL && !UNITY_EDITOR
            try
            {
                SendToReact("ON_ROOM_SELECTED", payload);
            }
            catch (Exception ex)
            {
                Debug.LogWarning($"[BuildSphereBridge] WebGL JS dispatch warning: {ex.Message}");
            }
            #endif

            Debug.Log($"<color=#10B981>[BuildSphereBridge]</color> Broadcasted selection to web: {payload}");
        }
    }
}
