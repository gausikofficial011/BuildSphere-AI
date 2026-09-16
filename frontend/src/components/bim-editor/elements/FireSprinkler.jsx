import React from 'react';
import { useUiStore } from "../../../store/uiStore";

export const FireSprinkler = ({ element }) => {
  const { position = { x: 0, y: 0, z: 0 } } = element;
  const { selectedElementIds, selectElement } = useUiStore();
  const isSelected = selectedElementIds.includes(element.id);

  return (
    <group
      position={[position.x, (element.elevation || 3.0), position.z]}
      onClick={(e) => { e.stopPropagation(); selectElement(element.id); }}
    >
      {/* Drop Pipe */}
      <mesh position={[0, 0.15, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 0.3, 8]} />
        <meshStandardMaterial color="#ef4444" metalness={0.8} />
      </mesh>
      {/* Deflector Head */}
      <mesh position={[0, 0, 0]}>
        <coneGeometry args={[0.08, 0.04, 12]} />
        <meshStandardMaterial color={isSelected ? '#38bdf8' : '#f59e0b'} metalness={0.9} />
      </mesh>
    </group>
  );
};
