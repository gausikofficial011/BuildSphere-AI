import React from 'react';
import { useUiStore } from "../../../store/uiStore";
import { Edges } from '@react-three/drei';

export const Balcony = ({ element }) => {
  const { position = { x: 0, y: 0, z: 0 }, width = 4.0, projection = 2.0, thickness = 0.25, railingHeight = 1.1 } = element;
  const { selectedElementIds, selectElement } = useUiStore();
  const isSelected = selectedElementIds.includes(element.id);

  return (
    <group 
      position={[position.x, (element.elevation || 3.5), position.z]}
      onClick={(e) => { e.stopPropagation(); selectElement(element.id); }}
    >
      {/* Balcony Slab Base */}
      <mesh position={[0, -thickness / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[width, thickness, projection]} />
        <meshStandardMaterial color={isSelected ? '#38bdf8' : '#94a3b8'} roughness={0.7} />
        <Edges scale={1} threshold={15} color={isSelected ? '#0284c7' : '#334155'} />
      </mesh>

      {/* Front Glass / Steel Railing */}
      <mesh position={[0, railingHeight / 2, projection / 2 - 0.05]}>
        <boxGeometry args={[width, railingHeight, 0.08]} />
        <meshStandardMaterial color={isSelected ? '#38bdf8' : '#bae6fd'} transparent opacity={0.6} metalness={0.7} />
        <Edges scale={1} threshold={15} color="#0284c7" />
      </mesh>

      {/* Left Railing */}
      <mesh position={[-width / 2 + 0.05, railingHeight / 2, 0]}>
        <boxGeometry args={[0.08, railingHeight, projection]} />
        <meshStandardMaterial color={isSelected ? '#38bdf8' : '#bae6fd'} transparent opacity={0.6} metalness={0.7} />
        <Edges scale={1} threshold={15} color="#0284c7" />
      </mesh>

      {/* Right Railing */}
      <mesh position={[width / 2 - 0.05, railingHeight / 2, 0]}>
        <boxGeometry args={[0.08, railingHeight, projection]} />
        <meshStandardMaterial color={isSelected ? '#38bdf8' : '#bae6fd'} transparent opacity={0.6} metalness={0.7} />
        <Edges scale={1} threshold={15} color="#0284c7" />
      </mesh>
    </group>
  );
};
