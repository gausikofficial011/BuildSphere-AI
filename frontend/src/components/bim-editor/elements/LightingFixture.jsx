import React from 'react';
import { useUiStore } from "../../../store/uiStore";

export const LightingFixture = ({ element }) => {
  const { position = { x: 0, y: 0, z: 0 }, width = 1.2, length = 0.3, fixtureType = 'LED_TROFFER' } = element;
  const { selectedElementIds, selectElement } = useUiStore();
  const isSelected = selectedElementIds.includes(element.id);

  return (
    <group 
      position={[position.x, (element.elevation || 3.0), position.z]}
      onClick={(e) => { e.stopPropagation(); selectElement(element.id); }}
    >
      <mesh castShadow>
        <boxGeometry args={[width, 0.05, length]} />
        <meshStandardMaterial 
          color={isSelected ? '#38bdf8' : '#ffffff'} 
          emissive="#fef08a" 
          emissiveIntensity={0.8} 
        />
      </mesh>
      <pointLight position={[0, -0.2, 0]} intensity={1.5} distance={6} color="#fffbeb" />
    </group>
  );
};
