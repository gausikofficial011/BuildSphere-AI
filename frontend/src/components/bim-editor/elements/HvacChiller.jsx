import React from 'react';
import { useUiStore } from "../../../store/uiStore";
import { Edges } from '@react-three/drei';

export const HvacChiller = ({ element }) => {
  const { position = { x: 0, y: 0, z: 0 }, width = 3.5, length = 5.0, height = 2.2 } = element;
  const { selectedElementIds, selectElement } = useUiStore();
  const isSelected = selectedElementIds.includes(element.id);

  return (
    <group 
      position={[position.x, (element.elevation || 3.5) + height / 2, position.z]}
      onClick={(e) => { e.stopPropagation(); selectElement(element.id); }}
    >
      {/* Main Chiller Body */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[width, height, length]} />
        <meshStandardMaterial color={isSelected ? '#38bdf8' : '#475569'} metalness={0.7} roughness={0.3} />
        <Edges scale={1} threshold={15} color={isSelected ? '#0284c7' : '#1e293b'} />
      </mesh>

      {/* Fan Cowlings */}
      <mesh position={[0, height / 2 + 0.1, -length / 4]}>
        <cylinderGeometry args={[0.6, 0.6, 0.2, 16]} />
        <meshStandardMaterial color="#334155" metalness={0.9} />
      </mesh>
      <mesh position={[0, height / 2 + 0.1, length / 4]}>
        <cylinderGeometry args={[0.6, 0.6, 0.2, 16]} />
        <meshStandardMaterial color="#334155" metalness={0.9} />
      </mesh>
    </group>
  );
};
