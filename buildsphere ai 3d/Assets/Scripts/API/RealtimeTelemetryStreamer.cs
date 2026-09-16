using System;
using System.Collections;
using UnityEngine;
using BuildSphere.Data;
using BuildSphere.Rooms;

namespace BuildSphere.API
{
    [DisallowMultipleComponent]
    public class RealtimeTelemetryStreamer : MonoBehaviour
    {
        public static RealtimeTelemetryStreamer Instance { get; private set; }

        [Header("Stream Settings")]
        [SerializeField] private bool enableLiveSimulation = true;
        [SerializeField] private float updateIntervalSeconds = 2.5f;

        [Header("Telemetry Drift Limits")]
        [SerializeField] private float tempDriftMagnitude = 0.3f;
        [SerializeField] private float energyDriftMagnitude = 0.2f;

        private Coroutine streamCoroutine;

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
            if (enableLiveSimulation)
            {
                StartStreaming();
            }
        }

        public void StartStreaming()
        {
            if (streamCoroutine != null) StopCoroutine(streamCoroutine);
            streamCoroutine = StartCoroutine(LiveTelemetryRoutine());
        }

        public void StopStreaming()
        {
            if (streamCoroutine != null)
            {
                StopCoroutine(streamCoroutine);
                streamCoroutine = null;
            }
        }

        private IEnumerator LiveTelemetryRoutine()
        {
            WaitForSeconds wait = new WaitForSeconds(updateIntervalSeconds);
            System.Random rand = new System.Random();

            while (true)
            {
                yield return wait;

                if (DigitalTwinDataManager.Instance != null && DigitalTwinDataManager.Instance.CurrentBuildingData != null)
                {
                    var buildingData = DigitalTwinDataManager.Instance.CurrentBuildingData;

                    foreach (var floor in buildingData.floors)
                    {
                        foreach (var room in floor.rooms)
                        {
                            float tempDelta = ((float)rand.NextDouble() * 2f - 1f) * tempDriftMagnitude;
                            float energyDelta = ((float)rand.NextDouble() * 2f - 1f) * energyDriftMagnitude;

                            float newTemp = Mathf.Clamp(room.temperature + tempDelta, 18.0f, 32.0f);
                            float newEnergy = Mathf.Clamp(room.energyConsumption + energyDelta, 0.5f, 15.0f);

                            string newStatus = room.status;
                            if (newTemp > 26.5f && room.status != "Critical")
                            {
                                newStatus = "Warning";
                            }
                            else if (newTemp <= 25.0f && room.status == "Warning")
                            {
                                newStatus = "Normal";
                            }

                            DigitalTwinDataManager.Instance.UpdateRoomTelemetry(room.roomId, room.occupancy, newTemp, newEnergy, newStatus);
                        }
                    }
                }
            }
        }
    }
}
