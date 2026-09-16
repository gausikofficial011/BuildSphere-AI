import React from 'react';
import { useUiStore } from "../../../store/uiStore";
import { Edges } from '@react-three/drei';

export const RaisedFloor = ({ element }) => {
  const { position = { x: 0, y: 0, z: 0 }, width = 8.0, length = 8.0, pedestalHeight = 0.3 } = element;
  const { selectedElementIds, selectElement } = useUiStore();
  const isSelected = selectedElementIds.includes(element.id);

  return (
    <group 
      position={[position.x, (element.elevation || 0), position.z]}
      onClick={(e) => { e.stopPropagation(); selectElement(element.id); }}
    >
      <mesh position={[0, pedestalHeight, 0]} receiveShadow>
        <boxGeometry args={[width, 0.05, length]} />
        <meshStandardMaterial color={isSelected ? '#38bdf8' : '#e2e8f0'} roughness={0.5} metalness={0.2} />
        <Edges scale={1} threshold={15} color={isSelected ? '#0284c7' : '#94a3b8'} />
      </mesh>
    </group>
  );
};
