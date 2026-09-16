using System;
using System.Collections.Generic;
using UnityEngine;
using BuildSphere.Core;
using BuildSphere.Building;
using BuildSphere.Rooms;
using BuildSphere.Interaction;
using BuildSphere.CameraControl;
using BuildSphere.Data;

namespace BuildSphere.AI
{
    [DisallowMultipleComponent]
    public class AIActionManager : MonoBehaviour
    {
        public static AIActionManager Instance { get; private set; }

        public event Action<string> OnAIExecutionCompleted;

        private void Awake()
        {
            if (Instance != null && Instance != this)
            {
                Destroy(gameObject);
                return;
            }
            Instance = this;
        }

        public string ProcessAndExecutePrompt(string naturalLanguagePrompt)
        {
            var data = DigitalTwinDataManager.Instance?.CurrentBuildingData;
            AICommandPayload payload = AICommandParser.ParseNaturalLanguage(naturalLanguagePrompt, data);

            if (payload == null)
            {
                return "I couldn't process an empty command.";
            }

            return ExecutePayload(payload);
        }

        public string ExecutePayload(AICommandPayload payload)
        {
            var building = BuildSphereManager.Instance?.ActiveBuilding;
            if (building == null) return "No active 3D building loaded.";

            switch (payload.action)
            {
                case "isolate_floor":
                    building.IsolateFloor(payload.floorNumber);
                    var floor = building.GetFloor(payload.floorNumber);
                    if (floor != null && BuildSphereCameraController.Instance != null)
                    {
                        BuildSphereCameraController.Instance.FocusOnFloor(floor.transform.position);
                    }
                    string floorMsg = $"Isolating Floor {payload.floorNumber} in 3D viewport.";
                    OnAIExecutionCompleted?.Invoke(floorMsg);
                    return floorMsg;

                case "show_all_floors":
                    building.ShowAllFloors();
                    BuildSphereCameraController.Instance?.ResetView();
                    string allMsg = "Displaying all building floors.";
                    OnAIExecutionCompleted?.Invoke(allMsg);
                    return allMsg;

                case "explode_building":
                    building.ExplodeFloors(3.5f);
                    string expMsg = "Activating exploded vertical digital-twin inspection.";
                    OnAIExecutionCompleted?.Invoke(expMsg);
                    return expMsg;

                case "reset_model":
                    building.ResetBuilding();
                    BuildSphereCameraController.Instance?.ResetView();
                    string resetMsg = "Reset 3D camera and structural model to baseline.";
                    OnAIExecutionCompleted?.Invoke(resetMsg);
                    return resetMsg;

                case "focus_room":
                    if (payload.roomIds.Count > 0)
                    {
                        string targetRoomId = payload.roomIds[0];
                        SelectionManager.Instance?.SelectRoomById(targetRoomId);
                        string focusMsg = $"Located and framed {targetRoomId}.";
                        OnAIExecutionCompleted?.Invoke(focusMsg);
                        return focusMsg;
                    }
                    return "No room specified to focus.";

                case "highlight_rooms":
                    if (payload.roomIds.Count > 0)
                    {
                        building.ShowAllFloors();
                        foreach (var f in building.Floors)
                        {
                            foreach (var r in f.Rooms)
                            {
                                bool match = payload.roomIds.Contains(r.RoomId);
                                r.SetHighlight(match);
                            }
                        }

                        string firstId = payload.roomIds[0];
                        var firstRoom = building.GetComponentsInChildren<RoomController>(true);
                        foreach (var r in firstRoom)
                        {
                            if (r.RoomId == firstId && BuildSphereCameraController.Instance != null)
                            {
                                BuildSphereCameraController.Instance.FocusOnRoom(r.GetFocusPoint());
                                break;
                            }
                        }

                        string hlMsg = $"Highlighted {payload.roomIds.Count} matching room(s) for query [{payload.mode}].";
                        OnAIExecutionCompleted?.Invoke(hlMsg);
                        return hlMsg;
                    }
                    return "No matching rooms found for the given criteria.";

                case "set_mode":
                    if (Enum.TryParse(payload.mode, true, out VisualizationMode vMode))
                    {
                        BuildSphereManager.Instance?.SetVisualizationMode(vMode);
                        string modeMsg = $"Visualization mode switched to {vMode}.";
                        OnAIExecutionCompleted?.Invoke(modeMsg);
                        return modeMsg;
                    }
                    return $"Unknown mode: {payload.mode}";

                case "ai_generate_building":
                    string genMsg = AIModelBuildingEngine.Instance != null
                        ? AIModelBuildingEngine.Instance.GenerateFromPrompt(payload.query)
                        : "AI Model Building Engine not found in scene.";
                    OnAIExecutionCompleted?.Invoke(genMsg);
                    return genMsg;

                case "run_analysis":
                    if (Enum.TryParse(payload.mode, true, out AnalysisMode aMode))
                    {
                        string analysisMsg = AIModelBuildingEngine.Instance != null
                            ? AIModelBuildingEngine.Instance.RunStructuralAnalysis(aMode)
                            : $"Activated {aMode} visualizer.";
                        OnAIExecutionCompleted?.Invoke(analysisMsg);
                        return analysisMsg;
                    }
                    return $"Unknown analysis mode: {payload.mode}";

                case "export_bim":
                    string exportMsg = AIModelBuildingEngine.Instance != null
                        ? AIModelBuildingEngine.Instance.ExportCurrentBIM()
                        : "BIM exporter not initialized.";
                    OnAIExecutionCompleted?.Invoke(exportMsg);
                    return exportMsg;

                default:
                    return $"Analyzing query: '{payload.query}'. Synchronized with BuildSphere digital twin baseline.";
            }
        }
    }
}
