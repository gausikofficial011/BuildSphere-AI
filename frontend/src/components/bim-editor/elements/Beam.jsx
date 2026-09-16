import React, { useMemo } from 'react';
import { distance2D } from "../../../engine/geometry";
import { useUiStore } from "../../../store/uiStore";
import { Edges } from '@react-three/drei';

export const Beam = ({ element, stressMode }) => {
  const { start, end, position, width = 0.3, depth = 0.45, length = 6.0, material = 'Steel' } = element;
  const { selectedElementIds, selectElement } = useUiStore();
  const isSelected = selectedElementIds.includes(element.id);

  const { meshPos, meshRot, meshLen } = useMemo(() => {
    if (start && end) {
      const len = distance2D(start, end);
      const midpoint = {
        x: (start.x + end.x) / 2,
        z: (start.z + end.z) / 2
      };
      const angle = Math.atan2(end.z - start.z, end.x - start.x);
      return {
        meshPos: [midpoint.x, (element.elevation || 3.5), midpoint.z],
        meshRot: [0, -angle, 0],
        meshLen: len
      };
    }

    const pos = position || { x: 0, y: element.elevation || 3.5, z: 0 };
    return {
      meshPos: [pos.x, pos.y, pos.z],
      meshRot: [0, 0, 0],
      meshLen: length
    };
  }, [start, end, position, length, element.elevation]);

  if (meshLen === 0) return null;

  let matColor = material === 'Concrete' ? '#94a3b8' : material === 'Wood' ? '#d97706' : '#475569';
  if (stressMode) {
    matColor = '#22c55e'; // FEA normal load
  }

  return (
    <mesh
      position={meshPos}
      rotation={meshRot}
      castShadow
      receiveShadow
      onClick={(e) => { e.stopPropagation(); selectElement(element.id); }}
    >
      <boxGeometry args={[meshLen, depth, width]} />
      <meshStandardMaterial 
        color={isSelected ? '#38bdf8' : matColor} 
        roughness={0.4} 
        metalness={material === 'Steel' ? 0.7 : 0.1} 
      />
      <Edges scale={1} threshold={15} color={isSelected ? '#0284c7' : '#1e293b'} />
    </mesh>
  );
};
