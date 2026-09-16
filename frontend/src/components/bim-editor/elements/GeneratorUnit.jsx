import React from 'react';
import { useUiStore } from "../../../store/uiStore";
import { Edges } from '@react-three/drei';

export const GeneratorUnit = ({ element }) => {
  const { position = { x: 0, y: 0, z: 0 }, width = 2.4, length = 4.8, height = 2.2 } = element;
  const { selectedElementIds, selectElement } = useUiStore();
  const isSelected = selectedElementIds.includes(element.id);

  return (
    <group 
      position={[position.x, (element.elevation || 0) + height / 2, position.z]}
      onClick={(e) => { e.stopPropagation(); selectElement(element.id); }}
    >
      {/* Soundproof Generator Enclosure */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[width, height, length]} />
        <meshStandardMaterial color={isSelected ? '#38bdf8' : '#15803d'} metalness={0.7} roughness={0.3} />
        <Edges scale={1} threshold={15} color={isSelected ? '#0284c7' : '#052e16'} />
      </mesh>

      {/* Exhaust Silencer */}
      <mesh position={[0, height / 2 + 0.3, -length / 3]}>
        <cylinderGeometry args={[0.2, 0.2, 0.6, 16]} />
        <meshStandardMaterial color="#334155" metalness={0.9} />
      </mesh>
    </group>
  );
};
