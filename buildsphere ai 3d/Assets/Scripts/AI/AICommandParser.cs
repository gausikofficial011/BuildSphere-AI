using System;
using System.Collections.Generic;
using UnityEngine;
using BuildSphere.Data;
using BuildSphere.Core;

namespace BuildSphere.AI
{
    public static class AICommandParser
    {
        public static AICommandPayload ParseNaturalLanguage(string prompt, BuildingData currentData)
        {
            if (string.IsNullOrWhiteSpace(prompt)) return null;

            string lower = prompt.ToLower().Trim();
            AICommandPayload payload = new AICommandPayload();

            if (lower.Contains("floor 1") || lower.Contains("ground floor") || lower.Contains("first floor"))
            {
                payload.action = "isolate_floor";
                payload.floorNumber = 1;
                return payload;
            }
            if (lower.Contains("floor 2") || lower.Contains("second floor"))
            {
                payload.action = "isolate_floor";
                payload.floorNumber = 2;
                return payload;
            }
            if (lower.Contains("floor 3") || lower.Contains("third floor"))
            {
                payload.action = "isolate_floor";
                payload.floorNumber = 3;
                return payload;
            }
            if (lower.Contains("all floors") || lower.Contains("show all") || lower.Contains("entire building"))
            {
                payload.action = "show_all_floors";
                return payload;
            }

            if (lower.Contains("explode") || lower.Contains("expand floors") || lower.Contains("separate"))
            {
                payload.action = "explode_building";
                return payload;
            }
            if (lower.Contains("reset") || lower.Contains("collapse") || lower.Contains("default view"))
            {
                payload.action = "reset_model";
                return payload;
            }

            string[] roomKeywords = new string[] { "room 101", "room 102", "room 103", "room 104", "room 201", "room 202", "room 203", "room 204", "room 301", "room 302", "room 303", "room 304" };
            foreach (var kw in roomKeywords)
            {
                if (lower.Contains(kw))
                {
                    string idNumber = kw.Replace("room ", "").Trim();
                    payload.action = "focus_room";
                    payload.roomIds.Add($"ROOM_{idNumber}");
                    return payload;
                }
            }

            if (lower.Contains("high energy") || lower.Contains("power consumption") || lower.Contains("energy usage"))
            {
                payload.action = "highlight_rooms";
                payload.mode = "Energy";
                if (currentData != null)
                {
                    foreach (var f in currentData.floors)
                    {
                        foreach (var r in f.rooms)
                        {
                            if (r.energyConsumption > 5.0f)
                            {
                                payload.roomIds.Add(r.roomId);
                            }
                        }
                    }
                }
                return payload;
            }

            if (lower.Contains("high occupancy") || lower.Contains("crowded") || lower.Contains("occupied"))
            {
                payload.action = "highlight_rooms";
                payload.mode = "Occupancy";
                if (currentData != null)
                {
                    foreach (var f in currentData.floors)
                    {
                        foreach (var r in f.rooms)
                        {
                            if (r.occupancy >= 10)
                            {
                                payload.roomIds.Add(r.roomId);
                            }
                        }
                    }
                }
                return payload;
            }

            if (lower.Contains("temperature") || lower.Contains("hot") || lower.Contains("overheating") || lower.Contains("warning") || lower.Contains("alert"))
            {
                payload.action = "highlight_rooms";
                payload.mode = "Temperature";
                if (currentData != null)
                {
                    foreach (var f in currentData.floors)
                    {
                        foreach (var r in f.rooms)
                        {
                            if (r.temperature > 24.0f || r.status == "Warning" || r.status == "Critical")
                            {
                                payload.roomIds.Add(r.roomId);
                            }
                        }
                    }
                }
                return payload;
            }

            if (lower.Contains("energy mode"))
            {
                payload.action = "set_mode";
                payload.mode = "Energy";
                return payload;
            }
            if (lower.Contains("occupancy mode"))
            {
                payload.action = "set_mode";
                payload.mode = "Occupancy";
                return payload;
            }
            if (lower.Contains("temperature mode"))
            {
                payload.action = "set_mode";
                payload.mode = "Temperature";
                return payload;
            }

            // Generative AI Model Building Commands
            if (lower.Contains("generate") || lower.Contains("build") || lower.Contains("create tower") || lower.Contains("construct"))
            {
                payload.action = "ai_generate_building";
                payload.query = prompt;
                return payload;
            }

            // Structural / Daylight / Thermal Analysis
            if (lower.Contains("stress") || lower.Contains("structural load") || lower.Contains("fea"))
            {
                payload.action = "run_analysis";
                payload.mode = "StructuralStress";
                return payload;
            }
            if (lower.Contains("daylight") || lower.Contains("solar illumination") || lower.Contains("sunlight"))
            {
                payload.action = "run_analysis";
                payload.mode = "DaylightIllumination";
                return payload;
            }
            if (lower.Contains("thermal") || lower.Contains("insulation") || lower.Contains("heat gain"))
            {
                payload.action = "run_analysis";
                payload.mode = "ThermalEfficiency";
                return payload;
            }

            // BIM / CAD Export
            if (lower.Contains("export") || lower.Contains("export bim") || lower.Contains("export obj") || lower.Contains("export model"))
            {
                payload.action = "export_bim";
                return payload;
            }

            payload.action = "unknown";
            payload.query = prompt;
            return payload;
        }
    }
}
