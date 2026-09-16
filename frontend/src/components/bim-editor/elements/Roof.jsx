import React from 'react';
import { useUiStore } from '../../../store/uiStore';
import { Edges } from '@react-three/drei';

export const Roof = ({ element }) => {
  const { position = { x: 0, y: 3.5, z: 0 }, width = 12, length = 12, height = 1.5, type = 'flat', material = 'Metal' } = element;
  const { selectedElementIds, selectElement } = useUiStore();
  const isSelected = selectedElementIds.includes(element.id);

  const matColor = material === 'Terracotta' ? '#b91c1c' : material === 'Slate' ? '#1e293b' : '#475569';
  const displayColor = isSelected ? '#38bdf8' : matColor;

  return (
    <group 
      position={[position.x, position.y || 3.5, position.z]}
      onClick={(e) => { e.stopPropagation(); selectElement(element.id); }}
    >
      {type === 'pitched' ? (
        <mesh castShadow receiveShadow position={[0, height / 2, 0]} rotation={[0, Math.PI / 4, 0]}>
          <coneGeometry args={[Math.max(width, length) * 0.7, height, 4]} />
          <meshStandardMaterial color={displayColor} roughness={0.7} />
          <Edges scale={1} threshold={15} color={isSelected ? '#0284c7' : '#0f172a'} />
        </mesh>
      ) : (
        <mesh castShadow receiveShadow position={[0, 0.15, 0]}>
          <boxGeometry args={[width, 0.3, length]} />
          <meshStandardMaterial color={displayColor} roughness={0.6} />
          <Edges scale={1} threshold={15} color={isSelected ? '#0284c7' : '#334155'} />
        </mesh>
      )}
    </group>
  );
};
