import { create } from 'zustand';
import { useBimStore } from './bimStore';

/**
 * Implements a Command Pattern for Undo/Redo.
 * Every action pushing to history should pass the 'previous' and 'next' BIM states.
 */
export const useHistoryStore = create((set, get) => ({
  past: [],
  future: [],

  // Record a change. Takes the ENTIRE elements and relationships snapshot for now.
  // In a real production system, this would store delta commands (Command Pattern).
  recordState: (prevState) => set((state) => {
    return {
      past: [...state.past, prevState],
      future: [] // Clear future on new action
    };
  }),

  undo: () => set((state) => {
    if (state.past.length === 0) return state;
    
    const previous = state.past[state.past.length - 1];
    const newPast = state.past.slice(0, state.past.length - 1);
    
    // Capture current state to put in future
    const currentBimState = {
      elements: useBimStore.getState().elements,
      relationships: useBimStore.getState().relationships
    };

    // Apply the past state
    useBimStore.getState().setBimState(previous);

    return {
      past: newPast,
      future: [currentBimState, ...state.future]
    };
  }),

  redo: () => set((state) => {
    if (state.future.length === 0) return state;

    const next = state.future[0];
    const newFuture = state.future.slice(1);

    // Capture current state to put in past
    const currentBimState = {
      elements: useBimStore.getState().elements,
      relationships: useBimStore.getState().relationships
    };

    // Apply the next state
    useBimStore.getState().setBimState(next);

    return {
      past: [...state.past, currentBimState],
      future: newFuture
    };
  }),
  
  clearHistory: () => set({ past: [], future: [] })
}));
