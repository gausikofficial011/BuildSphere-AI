import React from 'react';
import { useUiStore } from '../../../store/uiStore';
import { Edges } from '@react-three/drei';

export const Slab = ({ element }) => {
  const { position = { x: 0, y: 0, z: 0 }, width = 10, length = 10, thickness = 0.25, material = 'Concrete' } = element;
  const { selectedElementIds, selectElement } = useUiStore();
  const isSelected = selectedElementIds.includes(element.id);

  const matColor = material === 'Timber' ? '#78350f' : material === 'Tiles' ? '#cbd5e1' : '#64748b';
  const displayColor = isSelected ? '#38bdf8' : matColor;

  return (
    <group 
      position={[position.x, (position.y || 0) - thickness / 2, position.z]}
      onClick={(e) => { e.stopPropagation(); selectElement(element.id); }}
    >
      <mesh receiveShadow castShadow>
        <boxGeometry args={[width, thickness, length]} />
        <meshStandardMaterial color={displayColor} roughness={0.8} metalness={0.1} />
        <Edges scale={1} threshold={15} color={isSelected ? '#0284c7' : '#334155'} />
      </mesh>
    </group>
  );
};
