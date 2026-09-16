import React from 'react';
import { useUiStore } from '../../../store/uiStore';
import { Edges } from '@react-three/drei';

export const Column = ({ element }) => {
  const { position = { x: 0, y: 0, z: 0 }, width = 0.4, depth = 0.4, height = 3.5, material = 'Concrete', profile = 'square' } = element;
  const { selectedElementIds, selectElement } = useUiStore();
  const isSelected = selectedElementIds.includes(element.id);

  const matColor = material === 'Steel' ? '#334155' : material === 'Timber' ? '#b45309' : '#94a3b8';
  const displayColor = isSelected ? '#38bdf8' : matColor;

  return (
    <group 
      position={[position.x, (position.y || 0) + height / 2, position.z]}
      onClick={(e) => { e.stopPropagation(); selectElement(element.id); }}
    >
      {profile === 'round' ? (
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[width / 2, width / 2, height, 24]} />
          <meshStandardMaterial color={displayColor} roughness={0.5} metalness={material === 'Steel' ? 0.8 : 0.1} />
        </mesh>
      ) : (
        <mesh castShadow receiveShadow>
          <boxGeometry args={[width, height, depth]} />
          <meshStandardMaterial color={displayColor} roughness={0.6} metalness={material === 'Steel' ? 0.8 : 0.1} />
          <Edges scale={1} threshold={15} color={isSelected ? '#0284c7' : '#64748b'} />
        </mesh>
      )}
    </group>
  );
};
