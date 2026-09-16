import React from 'react';
import { useUiStore } from "../../../store/uiStore";

export const Streetlight = ({ element }) => {
  const { position = { x: 0, y: 0, z: 0 }, poleHeight = 6.0 } = element;
  const { selectedElementIds, selectElement } = useUiStore();
  const isSelected = selectedElementIds.includes(element.id);

  return (
    <group 
      position={[position.x, (element.elevation || 0), position.z]}
      onClick={(e) => { e.stopPropagation(); selectElement(element.id); }}
    >
      {/* Light Pole */}
      <mesh position={[0, poleHeight / 2, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.12, poleHeight, 12]} />
        <meshStandardMaterial color={isSelected ? '#38bdf8' : '#475569'} metalness={0.8} />
      </mesh>
      {/* Luminaire Arm */}
      <mesh position={[0.4, poleHeight - 0.1, 0]} rotation={[0, 0, Math.PI / 4]}>
        <cylinderGeometry args={[0.04, 0.04, 0.8, 8]} />
        <meshStandardMaterial color="#334155" metalness={0.8} />
      </mesh>
      {/* LED Fixture */}
      <mesh position={[0.7, poleHeight + 0.15, 0]}>
        <boxGeometry args={[0.5, 0.1, 0.25]} />
        <meshStandardMaterial color="#ffffff" emissive="#fef08a" emissiveIntensity={1.2} />
      </mesh>
      <pointLight position={[0.7, poleHeight, 0]} intensity={2.0} distance={12} color="#fffbeb" />
    </group>
  );
};
