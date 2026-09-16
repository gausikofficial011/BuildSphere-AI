import React, { useMemo } from 'react';
import { distance2D } from "../../../engine/geometry";
import { useUiStore } from "../../../store/uiStore";
import { Edges } from '@react-three/drei';

export const CableTray = ({ element }) => {
  const { start, end, position, width = 0.4, height = 0.1, length = 6.0 } = element;
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
        meshPos: [midpoint.x, (element.elevation || 3.2), midpoint.z],
        meshRot: [0, -angle, 0],
        meshLen: len
      };
    }

    const pos = position || { x: 0, y: element.elevation || 3.2, z: 0 };
    return {
      meshPos: [pos.x, pos.y, pos.z],
      meshRot: [0, 0, 0],
      meshLen: length
    };
  }, [start, end, position, length, element.elevation]);

  return (
    <mesh
      position={meshPos}
      rotation={meshRot}
      castShadow
      receiveShadow
      onClick={(e) => { e.stopPropagation(); selectElement(element.id); }}
    >
      <boxGeometry args={[meshLen, height, width]} />
      <meshStandardMaterial color={isSelected ? '#38bdf8' : '#eab308'} metalness={0.7} roughness={0.3} />
      <Edges scale={1} threshold={15} color="#ca8a04" />
    </mesh>
  );
};
