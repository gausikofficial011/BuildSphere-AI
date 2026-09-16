import React from 'react';
import { useUiStore } from '../../../store/uiStore';
import { Edges } from '@react-three/drei';

export const Door = ({ element }) => {
  const { position = { x: 0, y: 0, z: 0 }, rotation = 0, width = 1.0, height = 2.2, thickness = 0.1, material = 'Wood' } = element;
  const { selectedElementIds, selectElement } = useUiStore();
  const isSelected = selectedElementIds.includes(element.id);

  return (
    <group 
      position={[position.x, (position.y || 0) + height / 2, position.z]}
      rotation={[0, rotation, 0]}
      onClick={(e) => { e.stopPropagation(); selectElement(element.id); }}
    >
      {/* Frame */}
      <mesh castShadow>
        <boxGeometry args={[width + 0.1, height + 0.05, thickness + 0.05]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>
      {/* Leaf */}
      <mesh castShadow position={[0, 0, 0.01]}>
        <boxGeometry args={[width, height, thickness]} />
        <meshStandardMaterial color={isSelected ? '#38bdf8' : material === 'Glass' ? '#bae6fd' : '#b45309'} transparent={material === 'Glass'} opacity={material === 'Glass' ? 0.6 : 1} />
        <Edges scale={1} threshold={15} color={isSelected ? '#0284c7' : '#0f172a'} />
      </mesh>
      {/* Handle */}
      <mesh position={[width * 0.35, 0, thickness / 2 + 0.03]}>
        <sphereGeometry args={[0.035, 12, 12]} />
        <meshStandardMaterial color="#fbbf24" metalness={0.9} roughness={0.2} />
      </mesh>
    </group>
  );
};
