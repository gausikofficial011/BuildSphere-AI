/**
 * BuildSphere Unity Digital Twin Integration Service
 * 
 * Establishes standard bi-directional contract between React Frontend
 * and Unity 3D Engine (WebGL / Bridge).
 */

export const UnityActionTypes = {
  OPEN_BUILDING: "OPEN_BUILDING",
  SELECT_FLOOR: "SELECT_FLOOR",
  SELECT_ROOM: "SELECT_ROOM",
  FOCUS_ROOM: "FOCUS_ROOM",
  RESET_CAMERA: "RESET_CAMERA",
  SET_VISUALIZATION_MODE: "SET_VISUALIZATION_MODE",
  GET_ROOM_DATA: "GET_ROOM_DATA",
  TRIGGER_AI_PROMPT: "TRIGGER_AI_PROMPT"
};

export const VisualizationModes = {
  NORMAL: "Normal",
  CONSTRUCTION: "ConstructionStatus",
  ENERGY: "Energy",
  OCCUPANCY: "Occupancy",
  TEMPERATURE: "Temperature",
  ALERTS: "Alerts",
  MAINTENANCE: "Maintenance",
  INSPECTION: "StructuralInspection"
};

class UnityIntegrationService {
  constructor() {
    this.eventListeners = new Map();
    this.isBridgeReady = false;
  }

  /**
   * Register a listener for events sent from Unity to React
   */
  subscribe(eventType, callback) {
    if (!this.eventListeners.has(eventType)) {
      this.eventListeners.set(eventType, new Set());
    }
    this.eventListeners.get(eventType).add(callback);

    return () => {
      const listeners = this.eventListeners.get(eventType);
      if (listeners) {
        listeners.delete(callback);
      }
    };
  }

  /**
   * Internal dispatcher invoked when Unity posts a message to window
   */
  handleUnityEvent(eventName, payload) {
    const listeners = this.eventListeners.get(eventName);
    if (listeners) {
      listeners.forEach((callback) => {
        try {
          callback(payload);
        } catch (err) {
          console.error(`[UnityIntegrationService] Error handling event ${eventName}:`, err);
        }
      });
    }
  }

  /**
   * Helper to dispatch room selection command to Unity
   */
  createSelectRoomCommand(roomId) {
    return {
      type: UnityActionTypes.SELECT_ROOM,
      roomId: roomId
    };
  }

  /**
   * Helper to dispatch floor isolation command to Unity
   */
  createSelectFloorCommand(floorNumber, isolate = true) {
    return {
      type: UnityActionTypes.SELECT_FLOOR,
      floorNumber: floorNumber,
      isolate: isolate
    };
  }

  /**
   * Helper to change visualization mode in Unity
   */
  createSetModeCommand(mode) {
    return {
      type: UnityActionTypes.SET_VISUALIZATION_MODE,
      mode: mode
    };
  }

  /**
   * Helper to execute natural language AI query in 3D scene
   */
  createAIPromptCommand(prompt) {
    return {
      type: UnityActionTypes.TRIGGER_AI_PROMPT,
      prompt: prompt
    };
  }
}

export const unityService = new UnityIntegrationService();
export default unityService;
