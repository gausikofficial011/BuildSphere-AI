import React from 'react';
import { useUiStore } from "../../../store/uiStore";
import { Edges } from '@react-three/drei';

export const Switchgear = ({ element }) => {
  const { position = { x: 0, y: 0, z: 0 }, width = 1.0, length = 3.2, height = 2.1 } = element;
  const { selectedElementIds, selectElement } = useUiStore();
  const isSelected = selectedElementIds.includes(element.id);

  return (
    <group 
      position={[position.x, (element.elevation || 0) + height / 2, position.z]}
      onClick={(e) => { e.stopPropagation(); selectElement(element.id); }}
    >
      <mesh castShadow receiveShadow>
        <boxGeometry args={[width, height, length]} />
        <meshStandardMaterial color={isSelected ? '#38bdf8' : '#334155'} metalness={0.8} roughness={0.2} />
        <Edges scale={1} threshold={15} color={isSelected ? '#0284c7' : '#0f172a'} />
      </mesh>
      {/* Breaker Warning Label */}
      <mesh position={[width / 2 + 0.01, height / 4, 0]}>
        <boxGeometry args={[0.02, 0.3, 0.6]} />
        <meshStandardMaterial color="#eab308" />
      </mesh>
    </group>
  );
};
