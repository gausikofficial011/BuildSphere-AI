using System;
using System.Collections.Generic;
using UnityEngine;

namespace BuildSphere.Data
{
    [Serializable]
    public class BuildingData
    {
        public string buildingId = "BLD_001";
        public string buildingName = "BuildSphere Innovation Tower";
        public string location = "Main Tech Campus, Zone A";
        public string constructionStatus = "Operational";
        public int totalFloors = 3;
        public List<FloorData> floors = new List<FloorData>();
        public List<AlertData> activeAlerts = new List<AlertData>();
    }

    [Serializable]
    public class FloorData
    {
        public string floorId = "FL_01";
        public string buildingId = "BLD_001";
        public int floorNumber = 1;
        public string floorName = "Ground Level - Engineering & Labs";
        public float elevation = 0.0f;
        public List<RoomData> rooms = new List<RoomData>();
    }

    [Serializable]
    public class RoomData
    {
        public string roomId = "ROOM_101";
        public string floorId = "FL_01";
        public string name = "Robotics & Automation Lab";
        public string category = "Laboratory";
        public float area = 55.0f;
        public int occupancy = 8;
        public int capacity = 15;
        public float temperature = 22.5f;
        public float energyConsumption = 5.4f;
        public string status = "Normal";
        public List<string> activeAlertIds = new List<string>();
    }

    [Serializable]
    public class SensorData
    {
        public string sensorId = "SNS_101_TEMP";
        public string roomId = "ROOM_101";
        public string sensorType = "Temperature";
        public float currentValue = 22.5f;
        public string unit = "°C";
        public string status = "Online";
        public string lastUpdated = "";
    }

    [Serializable]
    public class AlertData
    {
        public string alertId = "ALT_001";
        public string targetId = "ROOM_203";
        public string targetType = "Room";
        public string severity = "Warning";
        public string message = "Server Suite temperature exceeded baseline (25.0°C)";
        public string timestamp = "";
        public bool isAcknowledged = false;
    }

    [Serializable]
    public class AICommandPayload
    {
        public string action = "highlight_rooms";
        public List<string> roomIds = new List<string>();
        public int floorNumber = -1;
        public string mode = "Normal";
        public string query = "";
    }
}