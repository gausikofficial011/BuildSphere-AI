import React from 'react';
import { useUiStore } from "../../../store/uiStore";
import { Edges } from '@react-three/drei';

export const Footing = ({ element }) => {
  const { position = { x: 0, y: 0, z: 0 }, width = 2.4, length = 2.4, thickness = 0.8 } = element;
  const { selectedElementIds, selectElement } = useUiStore();
  const isSelected = selectedElementIds.includes(element.id);

  return (
    <group
      position={[position.x, (element.elevation || 0) - thickness / 2, position.z]}
      onClick={(e) => { e.stopPropagation(); selectElement(element.id); }}
    >
      <mesh castShadow receiveShadow>
        <boxGeometry args={[width, thickness, length]} />
        <meshStandardMaterial color={isSelected ? '#38bdf8' : '#334155'} roughness={0.9} />
        <Edges scale={1} threshold={15} color={isSelected ? '#0284c7' : '#0f172a'} />
      </mesh>
    </group>
  );
};
