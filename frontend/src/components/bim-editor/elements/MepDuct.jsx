import React, { useMemo } from 'react';
import { distance2D } from "../../../engine/geometry";
import { useUiStore } from "../../../store/uiStore";
import { Edges } from '@react-three/drei';

export const MepDuct = ({ element }) => {
  const { start, end, position, width = 0.6, height = 0.4, length = 6.0, system = 'HVAC_SUPPLY' } = element;
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
        meshPos: [midpoint.x, (element.elevation || 3.0), midpoint.z],
        meshRot: [0, -angle, 0],
        meshLen: len
      };
    }

    const pos = position || { x: 0, y: element.elevation || 3.0, z: 0 };
    return {
      meshPos: [pos.x, pos.y, pos.z],
      meshRot: [0, 0, 0],
      meshLen: length
    };
  }, [start, end, position, length, element.elevation]);

  if (meshLen === 0) return null;

  const systemColor = system === 'HVAC_RETURN' ? '#f59e0b' : system === 'PLUMBING' ? '#06b6d4' : '#10b981';

  return (
    <mesh
      position={meshPos}
      rotation={meshRot}
      castShadow
      receiveShadow
      onClick={(e) => { e.stopPropagation(); selectElement(element.id); }}
    >
      <boxGeometry args={[meshLen, height, width]} />
      <meshStandardMaterial 
        color={isSelected ? '#38bdf8' : systemColor} 
        roughness={0.2} 
        metalness={0.8} 
      />
      <Edges scale={1} threshold={15} color={isSelected ? '#0284c7' : '#047857'} />
    </mesh>
  );
};
