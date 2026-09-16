import React, { useMemo } from 'react';
import { distance2D } from "../../../engine/geometry";
import { useUiStore } from "../../../store/uiStore";
import { Edges } from '@react-three/drei';

export const Wall = ({ element }) => {
  const { start, end, height = 3.0, thickness = 0.25, material = 'Concrete' } = element;
  const { selectedElementIds, selectElement } = useUiStore();
  const isSelected = selectedElementIds.includes(element.id);

  const { position, rotation, length } = useMemo(() => {
    if (!start || !end) return { position: [0, 0, 0], rotation: [0, 0, 0], length: 0 };
    
    const length = distance2D(start, end);
    const midpoint = {
      x: (start.x + end.x) / 2,
      z: (start.z + end.z) / 2
    };
    
    const angle = Math.atan2(end.z - start.z, end.x - start.x);

    return {
      position: [midpoint.x, (element.elevation || 0) + height / 2, midpoint.z],
      rotation: [0, -angle, 0],
      length
    };
  }, [start, end, height, thickness, element.elevation]);

  if (length === 0) return null;

  const matColor = material === 'Brick' ? '#b91c1c' : material === 'Glass' ? '#bae6fd' : material === 'Wood' ? '#b45309' : '#cbd5e1';
  const isGlass = material === 'Glass';

  return (
    <mesh
      position={position}
      rotation={rotation}
      castShadow
      receiveShadow
      onClick={(e) => { e.stopPropagation(); selectElement(element.id); }}
    >
      <boxGeometry args={[length, height, thickness]} />
      <meshStandardMaterial 
        color={isSelected ? '#38bdf8' : matColor} 
        roughness={isGlass ? 0.1 : 0.7} 
        transparent={isGlass}
        opacity={isGlass ? 0.5 : 1.0}
        metalness={isGlass ? 0.8 : 0.1}
      />
      <Edges scale={1} threshold={15} color={isSelected ? '#0284c7' : '#475569'} />
    </mesh>
  );
};
