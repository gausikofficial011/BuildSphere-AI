import React from 'react';
import { useUiStore } from "../../../store/uiStore";
import { Edges } from '@react-three/drei';

export const ServerRack = ({ element }) => {
  const { position = { x: 0, y: 0, z: 0 }, width = 0.8, length = 1.0, height = 2.0 } = element;
  const { selectedElementIds, selectElement } = useUiStore();
  const isSelected = selectedElementIds.includes(element.id);

  return (
    <group 
      position={[position.x, (element.elevation || 0) + height / 2, position.z]}
      onClick={(e) => { e.stopPropagation(); selectElement(element.id); }}
    >
      <mesh castShadow receiveShadow>
        <boxGeometry args={[width, height, length]} />
        <meshStandardMaterial color={isSelected ? '#38bdf8' : '#0f172a'} metalness={0.9} roughness={0.2} />
        <Edges scale={1} threshold={15} color={isSelected ? '#0284c7' : '#0284c7'} />
      </mesh>
      {/* Activity Blinking LED strip */}
      <mesh position={[width / 2 + 0.01, 0, 0]}>
        <boxGeometry args={[0.02, height * 0.8, 0.05]} />
        <meshStandardMaterial color="#38bdf8" emissive="#38bdf8" emissiveIntensity={1.5} />
      </mesh>
    </group>
  );
};
