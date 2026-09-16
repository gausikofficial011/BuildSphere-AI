import React, { useMemo } from 'react';
import { distance2D } from "../../../engine/geometry";
import { useUiStore } from "../../../store/uiStore";

export const Railing = ({ element }) => {
  const { start, end, height = 1.1, balusterSpacing = 0.8, material = 'Steel' } = element;
  const { selectedElementIds, selectElement } = useUiStore();
  const isSelected = selectedElementIds.includes(element.id);

  const { position, rotation, length, posts } = useMemo(() => {
    if (!start || !end) return { position: [0, 0, 0], rotation: [0, 0, 0], length: 0, posts: [] };

    const len = distance2D(start, end);
    const midpoint = {
      x: (start.x + end.x) / 2,
      z: (start.z + end.z) / 2
    };
    const angle = Math.atan2(end.z - start.z, end.x - start.x);

    const count = Math.max(1, Math.floor(len / balusterSpacing));
    const step = len / count;
    const p = [];
    for (let i = 0; i <= count; i++) {
      p.push(-len / 2 + i * step);
    }

    return {
      position: [midpoint.x, (element.elevation || 0) + height / 2, midpoint.z],
      rotation: [0, -angle, 0],
      length: len,
      posts: p
    };
  }, [start, end, height, balusterSpacing, element.elevation]);

  if (length === 0) return null;

  return (
    <group
      position={position}
      rotation={rotation}
      onClick={(e) => { e.stopPropagation(); selectElement(element.id); }}
    >
      {/* Top Handrail */}
      <mesh position={[0, height / 2 - 0.03, 0]}>
        <cylinderGeometry args={[0.04, 0.04, length, 12]} rotation={[0, 0, Math.PI / 2]} />
        <meshStandardMaterial color={isSelected ? '#38bdf8' : '#f59e0b'} metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Mid Safety Rail */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.02, 0.02, length, 8]} rotation={[0, 0, Math.PI / 2]} />
        <meshStandardMaterial color={isSelected ? '#38bdf8' : '#94a3b8'} metalness={0.7} />
      </mesh>

      {/* Vertical Posts */}
      {posts.map((px, idx) => (
        <mesh key={idx} position={[px, 0, 0]}>
          <cylinderGeometry args={[0.03, 0.03, height, 8]} />
          <meshStandardMaterial color={isSelected ? '#38bdf8' : '#475569'} metalness={0.8} />
        </mesh>
      ))}
    </group>
  );
};
