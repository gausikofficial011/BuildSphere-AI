import React, { useMemo } from 'react';
import { useUiStore } from "../../../store/uiStore";
import { Edges } from '@react-three/drei';

export const Ramp = ({ element }) => {
  const { position = { x: 0, y: 0, z: 0 }, width = 2.0, length = 8.0, height = 1.2, thickness = 0.2 } = element;
  const { selectedElementIds, selectElement } = useUiStore();
  const isSelected = selectedElementIds.includes(element.id);

  const angle = Math.atan2(height, length);

  return (
    <group 
      position={[position.x, (element.elevation || 0), position.z]}
      onClick={(e) => { e.stopPropagation(); selectElement(element.id); }}
    >
      <mesh 
        position={[0, height / 2, 0]} 
        rotation={[angle, 0, 0]} 
        castShadow 
        receiveShadow
      >
        <boxGeometry args={[width, thickness, Math.sqrt(length * length + height * height)]} />
        <meshStandardMaterial color={isSelected ? '#38bdf8' : '#94a3b8'} roughness={0.7} />
        <Edges scale={1} threshold={15} color={isSelected ? '#0284c7' : '#334155'} />
      </mesh>
    </group>
  );
};
