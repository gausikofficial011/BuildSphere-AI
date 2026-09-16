import React from 'react';
import { useUiStore } from "../../../store/uiStore";
import { Edges } from '@react-three/drei';

export const Foundation = ({ element }) => {
  const { position = { x: 0, y: 0, z: 0 }, width = 12.0, length = 12.0, depth = 1.2 } = element;
  const { selectedElementIds, selectElement } = useUiStore();
  const isSelected = selectedElementIds.includes(element.id);

  return (
    <mesh
      position={[position.x, (element.elevation || 0) - depth / 2, position.z]}
      castShadow
      receiveShadow
      onClick={(e) => { e.stopPropagation(); selectElement(element.id); }}
    >
      <boxGeometry args={[width, depth, length]} />
      <meshStandardMaterial 
        color={isSelected ? '#38bdf8' : '#64748b'} 
        roughness={0.9} 
        metalness={0.05} 
      />
      <Edges scale={1} threshold={15} color={isSelected ? '#0284c7' : '#334155'} />
    </mesh>
  );
};
