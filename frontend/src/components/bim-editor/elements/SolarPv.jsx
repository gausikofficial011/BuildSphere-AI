import React from 'react';
import { useUiStore } from "../../../store/uiStore";
import { Edges } from '@react-three/drei';

export const SolarPv = ({ element }) => {
  const { position = { x: 0, y: 0, z: 0 }, width = 3.2, length = 1.8, tiltAngle = 18 } = element;
  const { selectedElementIds, selectElement } = useUiStore();
  const isSelected = selectedElementIds.includes(element.id);

  const rad = (tiltAngle * Math.PI) / 180;

  return (
    <group
      position={[position.x, (element.elevation || 3.5) + 0.5, position.z]}
      rotation={[rad, 0, 0]}
      onClick={(e) => { e.stopPropagation(); selectElement(element.id); }}
    >
      {/* PV Glass Panel */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[width, 0.06, length]} />
        <meshStandardMaterial 
          color={isSelected ? '#38bdf8' : '#0f172a'} 
          roughness={0.1} 
          metalness={0.9} 
        />
        <Edges scale={1} threshold={15} color={isSelected ? '#0284c7' : '#38bdf8'} />
      </mesh>

      {/* Mounting Stanchions */}
      <mesh position={[-width / 2 + 0.2, -0.3, 0]}>
        <cylinderGeometry args={[0.03, 0.03, 0.6, 8]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.8} />
      </mesh>
      <mesh position={[width / 2 - 0.2, -0.3, 0]}>
        <cylinderGeometry args={[0.03, 0.03, 0.6, 8]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.8} />
      </mesh>
    </group>
  );
};
