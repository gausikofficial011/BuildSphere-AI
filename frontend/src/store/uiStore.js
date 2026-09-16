import { create } from 'zustand';

export const useUiStore = create((set) => ({
  activeTool: 'SELECT', // SELECT, WALL, DOOR, WINDOW
  selectedElementIds: [],
  gridSize: 1, // 1 meter grid
  snapEnabled: true,
  
  setTool: (tool) => set({ activeTool: tool, selectedElementIds: [] }), // Clear selection on tool change
  
  selectElement: (id) => set((state) => {
    // Single select for now
    if (!id) return { selectedElementIds: [] };
    return { selectedElementIds: [id] };
  }),
  
  toggleSnap: () => set((state) => ({ snapEnabled: !state.snapEnabled })),
  setGridSize: (size) => set({ gridSize: size })
}));
