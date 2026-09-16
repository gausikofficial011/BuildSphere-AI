/**
 * Abstract Geometry Engine for BuildSphere AI.
 * Handles pure mathematical representation and calculation independent of Three.js or the DOM.
 */

export class Point3D {
  constructor(x = 0, y = 0, z = 0) {
    this.x = x;
    this.y = y;
    this.z = z;
  }
  
  clone() { return new Point3D(this.x, this.y, this.z); }
  
  distanceTo(other) {
    return Math.sqrt(
      Math.pow(this.x - other.x, 2) + 
      Math.pow(this.y - other.y, 2) + 
      Math.pow(this.z - other.z, 2)
    );
  }
}

export class Line2D {
  constructor(start, end) {
    this.start = start; // {x, z} (assuming y is up in 3D, we do 2D math on x/z plane)
    this.end = end;
  }
  
  length() {
    return Math.sqrt(Math.pow(this.start.x - this.end.x, 2) + Math.pow(this.start.z - this.end.z, 2));
  }
  
  midpoint() {
    return {
      x: (this.start.x + this.end.x) / 2,
      z: (this.start.z + this.end.z) / 2
    };
  }

  // Returns {x, z} if intersects, or null
  intersect(otherLine) {
    const p0_x = this.start.x; const p0_y = this.start.z;
    const p1_x = this.end.x; const p1_y = this.end.z;
    const p2_x = otherLine.start.x; const p2_y = otherLine.start.z;
    const p3_x = otherLine.end.x; const p3_y = otherLine.end.z;

    const s1_x = p1_x - p0_x; const s1_y = p1_y - p0_y;
    const s2_x = p3_x - p2_x; const s2_y = p3_y - p2_y;

    const s = (-s1_y * (p0_x - p2_x) + s1_x * (p0_y - p2_y)) / (-s2_x * s1_y + s1_x * s2_y);
    const t = ( s2_x * (p0_y - p2_y) - s2_y * (p0_x - p2_x)) / (-s2_x * s1_y + s1_x * s2_y);

    if (s >= 0 && s <= 1 && t >= 0 && t <= 1) {
      // Collision detected
      return {
        x: p0_x + (t * s1_x),
        z: p0_y + (t * s1_y)
      };
    }
    return null; // No collision
  }
}

export const distance2D = (p1, p2) => {
  return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.z - p2.z, 2));
};

export const calculateWallArea = (wall) => {
  if (!wall.start || !wall.end) return 0;
  const l = distance2D(wall.start, wall.end);
  return l * (wall.height || 3);
};
