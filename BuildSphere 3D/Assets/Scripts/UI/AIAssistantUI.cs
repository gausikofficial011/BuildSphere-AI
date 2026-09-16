using UnityEngine;
using UnityEngine.UI;
using TMPro;
using BuildSphere.AI;

namespace BuildSphere.UI
{
    [DisallowMultipleComponent]
    public class AIAssistantUI : MonoBehaviour
    {
        [Header("UI References")]
        [SerializeField] private TMP_InputField chatInputField;
        [SerializeField] private Button sendButton;
        [SerializeField] private TextMeshProUGUI responseText;
        [SerializeField] private GameObject responseBubble;

        [Header("Quick Action Chips")]
        [SerializeField] private Button chipEnergy;
        [SerializeField] private Button chipFloor2;
        [SerializeField] private Button chipAlerts;
        [SerializeField] private Button chipReset;

        private void Start()
        {
            if (sendButton != null) sendButton.onClick.AddListener(OnSendClicked);
            if (chatInputField != null) chatInputField.onSubmit.AddListener((val) => OnSendClicked());

            if (chipEnergy != null) chipEnergy.onClick.AddListener(() => ExecutePrompt("Show rooms with high energy consumption"));
            if (chipFloor2 != null) chipFloor2.onClick.AddListener(() => ExecutePrompt("Show me Floor 2"));
            if (chipAlerts != null) chipAlerts.onClick.AddListener(() => ExecutePrompt("Highlight temperature alerts and warnings"));
            if (chipReset != null) chipReset.onClick.AddListener(() => ExecutePrompt("Reset camera and model"));

            if (responseBubble != null) responseBubble.SetActive(false);
        }

        private void OnSendClicked()
        {
            if (chatInputField == null || string.IsNullOrWhiteSpace(chatInputField.text)) return;
            string prompt = chatInputField.text;
            chatInputField.text = "";
            ExecutePrompt(prompt);
        }

        public void ExecutePrompt(string prompt)
        {
            if (AIActionManager.Instance != null)
            {
                string reply = AIActionManager.Instance.ProcessAndExecutePrompt(prompt);
                ShowResponse(reply);
            }
        }

        private void ShowResponse(string response)
        {
            if (responseBubble != null) responseBubble.SetActive(true);
            if (responseText != null) responseText.text = $"🤖 <b>AI Assistant</b>: {response}";
        }
    }
}