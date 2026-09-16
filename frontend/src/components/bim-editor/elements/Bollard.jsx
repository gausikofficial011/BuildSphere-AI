import React from 'react';
import { useUiStore } from "../../../store/uiStore";

export const Bollard = ({ element }) => {
  const { position = { x: 0, y: 0, z: 0 }, height = 0.9, radius = 0.1 } = element;
  const { selectedElementIds, selectElement } = useUiStore();
  const isSelected = selectedElementIds.includes(element.id);

  return (
    <group 
      position={[position.x, (element.elevation || 0), position.z]}
      onClick={(e) => { e.stopPropagation(); selectElement(element.id); }}
    >
      <mesh position={[0, height / 2, 0]} castShadow>
        <cylinderGeometry args={[radius, radius, height, 16]} />
        <meshStandardMaterial color={isSelected ? '#38bdf8' : '#e2e8f0'} metalness={0.9} roughness={0.1} />
      </mesh>
      {/* Reflective Band */}
      <mesh position={[0, height * 0.8, 0]}>
        <cylinderGeometry args={[radius + 0.005, radius + 0.005, 0.1, 16]} />
        <meshStandardMaterial color="#f59e0b" />
      </mesh>
    </group>
  );
};
