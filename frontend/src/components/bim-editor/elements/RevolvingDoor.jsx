import React from 'react';
import { useUiStore } from "../../../store/uiStore";
import { Edges } from '@react-three/drei';

export const RevolvingDoor = ({ element }) => {
  const { position = { x: 0, y: 0, z: 0 }, radius = 1.4, height = 2.6 } = element;
  const { selectedElementIds, selectElement } = useUiStore();
  const isSelected = selectedElementIds.includes(element.id);

  return (
    <group 
      position={[position.x, (element.elevation || 0), position.z]}
      onClick={(e) => { e.stopPropagation(); selectElement(element.id); }}
    >
      {/* Curved Glass Enclosure */}
      <mesh position={[0, height / 2, 0]}>
        <cylinderGeometry args={[radius, radius, height, 24, 1, true]} />
        <meshStandardMaterial color={isSelected ? '#38bdf8' : '#7dd3fc'} transparent opacity={0.4} metalness={0.9} />
      </mesh>

      {/* Top Header Canopy */}
      <mesh position={[0, height + 0.1, 0]}>
        <cylinderGeometry args={[radius + 0.1, radius + 0.1, 0.2, 24]} />
        <meshStandardMaterial color="#1e293b" metalness={0.8} />
      </mesh>

      {/* Rotating Glass Wings */}
      <mesh position={[0, height / 2, 0]}>
        <boxGeometry args={[radius * 1.9, height * 0.95, 0.04]} />
        <meshStandardMaterial color="#bae6fd" transparent opacity={0.65} metalness={0.9} />
      </mesh>
      <mesh position={[0, height / 2, 0]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[radius * 1.9, height * 0.95, 0.04]} />
        <meshStandardMaterial color="#bae6fd" transparent opacity={0.65} metalness={0.9} />
      </mesh>
    </group>
  );
};
