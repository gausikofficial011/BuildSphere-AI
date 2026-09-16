import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';

/**
 * The core BIM Data Model acting as the single source of truth.
 * Everything in the 3D scene is driven by this state.
 */
export const useBimStore = create((set, get) => ({
  // Core Data Model
  project: {
    id: 'proj_default',
    name: 'BuildSphere AI Default Project',
  },
  buildings: {
    'bldg_1': { id: 'bldg_1', name: 'Main Building' }
  },
  levels: {
    'lvl_1': { id: 'lvl_1', name: 'Ground Floor', elevation: 0 }
  },
  
  // The normalized store of all BIM elements
  elements: {},

  // Relationships (e.g. Doors hosted by Walls)
  // hostId -> array of hostedElementIds
  relationships: {},

  // Element Actions
  addElement: (element) => set((state) => {
    const el = { ...element, id: element.id || uuidv4(), createdAt: Date.now() };
    return {
      elements: { ...state.elements, [el.id]: el }
    };
  }),

  updateElement: (id, updates) => set((state) => {
    if (!state.elements[id]) return state;
    return {
      elements: {
        ...state.elements,
        [id]: { ...state.elements[id], ...updates, updatedAt: Date.now() }
      }
    };
  }),

  removeElement: (id) => set((state) => {
    const newElements = { ...state.elements };
    delete newElements[id];
    // We should also remove relationships, but keeping it simple for Phase 1
    return { elements: newElements };
  }),

  // Hosting (e.g., attach Door to Wall)
  hostElement: (hostId, childId) => set((state) => {
    const currentHosted = state.relationships[hostId] || [];
    if (currentHosted.includes(childId)) return state;
    return {
      relationships: {
        ...state.relationships,
        [hostId]: [...currentHosted, childId]
      }
    };
  }),

  // State Override (for Load / Undo)
  setBimState: (newState) => set(() => ({
    elements: newState.elements || {},
    relationships: newState.relationships || {},
    levels: newState.levels || get().levels,
    buildings: newState.buildings || get().buildings
  }))
}));
