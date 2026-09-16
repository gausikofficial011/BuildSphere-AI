import React from 'react';
import { useUiStore } from "../../../store/uiStore";
import { Edges } from '@react-three/drei';

export const Skylight = ({ element }) => {
  const { position = { x: 0, y: 0, z: 0 }, width = 3.0, length = 3.0, height = 0.4 } = element;
  const { selectedElementIds, selectElement } = useUiStore();
  const isSelected = selectedElementIds.includes(element.id);

  return (
    <group
      position={[position.x, (element.elevation || 3.5) + height / 2, position.z]}
      onClick={(e) => { e.stopPropagation(); selectElement(element.id); }}
    >
      {/* Glazing Dome / Ridge */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[width, height, length]} />
        <meshStandardMaterial 
          color={isSelected ? '#38bdf8' : '#7dd3fc'} 
          roughness={0.05} 
          metalness={0.9} 
          transparent={true} 
          opacity={0.65} 
        />
        <Edges scale={1} threshold={15} color={isSelected ? '#0284c7' : '#0284c7'} />
      </mesh>

      {/* Frame border */}
      <mesh position={[0, -height / 2 + 0.04, 0]}>
        <boxGeometry args={[width + 0.2, 0.08, length + 0.2]} />
        <meshStandardMaterial color="#1e293b" metalness={0.8} />
      </mesh>
    </group>
  );
};
