import React from 'react';
import { useUiStore } from "../../../store/uiStore";

export const WaterFeature = ({ element }) => {
  const { position = { x: 0, y: 0, z: 0 }, width = 6.0, length = 10.0, depth = 0.6 } = element;
  const { selectedElementIds, selectElement } = useUiStore();
  const isSelected = selectedElementIds.includes(element.id);

  return (
    <group 
      position={[position.x, (element.elevation || 0), position.z]}
      onClick={(e) => { e.stopPropagation(); selectElement(element.id); }}
    >
      {/* Pool Basin */}
      <mesh position={[0, -depth / 2, 0]}>
        <boxGeometry args={[width + 0.4, depth, length + 0.4]} />
        <meshStandardMaterial color="#334155" />
      </mesh>
      {/* Translucent Water Volume */}
      <mesh position={[0, -0.05, 0]}>
        <boxGeometry args={[width, depth * 0.9, length]} />
        <meshStandardMaterial color={isSelected ? '#38bdf8' : '#0ea5e9'} transparent opacity={0.7} roughness={0.1} metalness={0.8} />
      </mesh>
    </group>
  );
};
