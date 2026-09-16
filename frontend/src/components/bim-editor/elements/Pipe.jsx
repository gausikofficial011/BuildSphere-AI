import React, { useMemo } from 'react';
import { distance2D } from "../../../engine/geometry";
import { useUiStore } from "../../../store/uiStore";

export const Pipe = ({ element }) => {
  const { start, end, position, radius = 0.08, length = 6.0, systemType = 'DOMESTIC_WATER' } = element;
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
        meshPos: [midpoint.x, (element.elevation || 2.8), midpoint.z],
        meshRot: [0, -angle, Math.PI / 2],
        meshLen: len
      };
    }

    const pos = position || { x: 0, y: element.elevation || 2.8, z: 0 };
    return {
      meshPos: [pos.x, pos.y, pos.z],
      meshRot: [0, 0, Math.PI / 2],
      meshLen: length
    };
  }, [start, end, position, length, element.elevation]);

  const pipeColor = systemType === 'FIRE_PROTECTION' ? '#ef4444' : systemType === 'DRAINAGE' ? '#64748b' : '#0284c7';

  return (
    <mesh
      position={meshPos}
      rotation={meshRot}
      castShadow
      receiveShadow
      onClick={(e) => { e.stopPropagation(); selectElement(element.id); }}
    >
      <cylinderGeometry args={[radius, radius, meshLen, 12]} />
      <meshStandardMaterial color={isSelected ? '#38bdf8' : pipeColor} metalness={0.7} roughness={0.3} />
    </mesh>
  );
};
