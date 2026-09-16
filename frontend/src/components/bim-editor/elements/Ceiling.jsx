import React from 'react';
import { useUiStore } from "../../../store/uiStore";
import { Edges } from '@react-three/drei';

export const Ceiling = ({ element }) => {
  const { position = { x: 0, y: 0, z: 0 }, width = 8.0, length = 8.0, thickness = 0.08, tilePattern = true } = element;
  const { selectedElementIds, selectElement } = useUiStore();
  const isSelected = selectedElementIds.includes(element.id);

  return (
    <mesh
      position={[position.x, (element.elevation || 3.0) + (element.height || 3.0) - thickness / 2, position.z]}
      castShadow
      receiveShadow
      onClick={(e) => { e.stopPropagation(); selectElement(element.id); }}
    >
      <boxGeometry args={[width, thickness, length]} />
      <meshStandardMaterial 
        color={isSelected ? '#38bdf8' : '#f1f5f9'} 
        roughness={0.8} 
        metalness={0.05} 
      />
      <Edges scale={1} threshold={15} color={isSelected ? '#0284c7' : '#94a3b8'} />
    </mesh>
  );
};
