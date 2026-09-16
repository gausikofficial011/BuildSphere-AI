import React from 'react';
import { useUiStore } from "../../../store/uiStore";
import { Edges } from '@react-three/drei';

export const ElevatorCore = ({ element }) => {
  const { position = { x: 0, y: 0, z: 0 }, width = 3.0, depth = 3.0, totalHeight = 14.0, wallThickness = 0.3 } = element;
  const { selectedElementIds, selectElement } = useUiStore();
  const isSelected = selectedElementIds.includes(element.id);

  return (
    <group 
      position={[position.x, (element.elevation || 0) + totalHeight / 2, position.z]}
      onClick={(e) => { e.stopPropagation(); selectElement(element.id); }}
    >
      {/* Heavy Shear Wall Core */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[width, totalHeight, depth]} />
        <meshStandardMaterial color={isSelected ? '#38bdf8' : '#475569'} roughness={0.9} />
        <Edges scale={1} threshold={15} color={isSelected ? '#0284c7' : '#0f172a'} />
      </mesh>

      {/* Door Openings Accent */}
      <mesh position={[0, -totalHeight / 2 + 1.2, depth / 2 + 0.05]}>
        <boxGeometry args={[1.4, 2.2, 0.1]} />
        <meshStandardMaterial color="#f59e0b" metalness={0.8} />
      </mesh>
    </group>
  );
};
