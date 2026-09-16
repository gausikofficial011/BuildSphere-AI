import { distance2D } from './geometry';

/**
 * Snaps a given point to the grid if snapping is enabled.
 */
export const snapToGrid = (point, gridSize = 1, enabled = true) => {
  if (!enabled) return point;
  return {
    x: Math.round(point.x / gridSize) * gridSize,
    y: point.y,
    z: Math.round(point.z / gridSize) * gridSize
  };
};

/**
 * Snaps a given point to existing elements (like wall endpoints or midpoints)
 * 
 * @param {Object} point - The current mouse position {x,y,z}
 * @param {Array} elements - Array of BIM elements (from store)
 * @param {Number} threshold - Snapping distance threshold
 */
export const snapToElements = (point, elements, threshold = 0.5) => {
  let closestSnap = null;
  let minDistance = threshold;

  // For this vertical slice, we just snap to wall endpoints
  elements.filter(e => e.type === 'wall').forEach(wall => {
    if(!wall.start || !wall.end) return;
    
    const dStart = distance2D(point, wall.start);
    if (dStart < minDistance) {
      minDistance = dStart;
      closestSnap = { ...wall.start, y: point.y };
    }

    const dEnd = distance2D(point, wall.end);
    if (dEnd < minDistance) {
      minDistance = dEnd;
      closestSnap = { ...wall.end, y: point.y };
    }
  });

  return closestSnap || point;
};
