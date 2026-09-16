import React, { useMemo } from 'react';
import { distance2D } from "../../../engine/geometry";
import { useUiStore } from "../../../store/uiStore";

export const RoadLane = ({ element }) => {
  const { start, end, position, width = 4.0, length = 12.0 } = element;
  const { selectedElementIds, selectElement } = useUiStore();
  const isSelected = selectedElementIds.includes(element.id);

  const { meshPos, meshRot, meshLen } = useMemo(() => {
    if (start && end) {
      const len = distance2D(start, end);
      const midpoint = { x: (start.x + end.x) / 2, z: (start.z + end.z) / 2 };
      const angle = Math.atan2(end.z - start.z, end.x - start.x);
      return {
        meshPos: [midpoint.x, (element.elevation || 0) + 0.01, midpoint.z],
        meshRot: [0, -angle, 0],
        meshLen: len
      };
    }
    const pos = position || { x: 0, y: 0.01, z: 0 };
    return {
      meshPos: [pos.x, pos.y, pos.z],
      meshRot: [0, 0, 0],
      meshLen: length
    };
  }, [start, end, position, length, element.elevation]);

  return (
    <group position={meshPos} rotation={meshRot} onClick={(e) => { e.stopPropagation(); selectElement(element.id); }}>
      {/* Asphalt Surface */}
      <mesh receiveShadow>
        <boxGeometry args={[meshLen, 0.02, width]} />
        <meshStandardMaterial color={isSelected ? '#38bdf8' : '#1e293b'} roughness={0.9} />
      </mesh>
      {/* Road Markings */}
      <mesh position={[0, 0.02, 0]}>
        <boxGeometry args={[meshLen * 0.8, 0.01, 0.15]} />
        <meshStandardMaterial color="#f8fafc" />
      </mesh>
    </group>
  );
};
