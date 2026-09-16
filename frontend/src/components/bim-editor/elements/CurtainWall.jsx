import React, { useMemo } from 'react';
import { distance2D } from "../../../engine/geometry";
import { useUiStore } from "../../../store/uiStore";
import { Edges } from '@react-three/drei';

export const CurtainWall = ({ element }) => {
  const { start, end, height = 3.5, thickness = 0.15, mullionSpacing = 1.5 } = element;
  const { selectedElementIds, selectElement } = useUiStore();
  const isSelected = selectedElementIds.includes(element.id);

  const { position, rotation, length, mullions } = useMemo(() => {
    if (!start || !end) return { position: [0, 0, 0], rotation: [0, 0, 0], length: 0, mullions: [] };
    
    const len = distance2D(start, end);
    const midpoint = {
      x: (start.x + end.x) / 2,
      z: (start.z + end.z) / 2
    };
    const angle = Math.atan2(end.z - start.z, end.x - start.x);

    const count = Math.max(1, Math.floor(len / mullionSpacing));
    const step = len / count;
    const m = [];
    for (let i = 0; i <= count; i++) {
      m.push(-len / 2 + i * step);
    }

    return {
      position: [midpoint.x, (element.elevation || 0) + height / 2, midpoint.z],
      rotation: [0, -angle, 0],
      length: len,
      mullions: m
    };
  }, [start, end, height, mullionSpacing, element.elevation]);

  if (length === 0) return null;

  return (
    <group
      position={position}
      rotation={rotation}
      onClick={(e) => { e.stopPropagation(); selectElement(element.id); }}
    >
      {/* Glazing Surface */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[length, height, thickness * 0.4]} />
        <meshStandardMaterial 
          color={isSelected ? '#38bdf8' : '#7dd3fc'} 
          roughness={0.05} 
          metalness={0.9} 
          transparent={true} 
          opacity={0.55} 
        />
        <Edges scale={1} threshold={15} color={isSelected ? '#0284c7' : '#0369a1'} />
      </mesh>

      {/* Structural Mullions */}
      {mullions.map((mx, idx) => (
        <mesh key={idx} position={[mx, 0, 0]}>
          <boxGeometry args={[0.08, height, thickness]} />
          <meshStandardMaterial color={isSelected ? '#38bdf8' : '#1e293b'} metalness={0.8} roughness={0.3} />
        </mesh>
      ))}

      {/* Top & Bottom Transoms */}
      <mesh position={[0, height / 2 - 0.05, 0]}>
        <boxGeometry args={[length, 0.1, thickness]} />
        <meshStandardMaterial color={isSelected ? '#38bdf8' : '#1e293b'} metalness={0.8} />
      </mesh>
      <mesh position={[0, -height / 2 + 0.05, 0]}>
        <boxGeometry args={[length, 0.1, thickness]} />
        <meshStandardMaterial color={isSelected ? '#38bdf8' : '#1e293b'} metalness={0.8} />
      </mesh>
    </group>
  );
};
