import React from 'react';
import { useUiStore } from '../../../store/uiStore';
import { Edges } from '@react-three/drei';

export const Window = ({ element }) => {
  const { position = { x: 0, y: 1.0, z: 0 }, rotation = 0, width = 1.6, height = 1.4, thickness = 0.1 } = element;
  const { selectedElementIds, selectElement } = useUiStore();
  const isSelected = selectedElementIds.includes(element.id);

  return (
    <group 
      position={[position.x, (position.y || 1.0) + height / 2, position.z]}
      rotation={[0, rotation, 0]}
      onClick={(e) => { e.stopPropagation(); selectElement(element.id); }}
    >
      {/* Frame */}
      <mesh castShadow>
        <boxGeometry args={[width, height, thickness]} />
        <meshStandardMaterial color="#0f172a" />
      </mesh>
      {/* Glass Pane */}
      <mesh>
        <boxGeometry args={[width - 0.1, height - 0.1, 0.02]} />
        <meshStandardMaterial color={isSelected ? '#38bdf8' : '#7dd3fc'} transparent opacity={0.4} roughness={0.1} metalness={0.9} />
        <Edges scale={1} threshold={15} color={isSelected ? '#0284c7' : '#38bdf8'} />
      </mesh>
    </group>
  );
};
