import React from 'react';
import { useUiStore } from "../../../store/uiStore";

export const BriseSoleil = ({ element }) => {
  const { position = { x: 0, y: 0, z: 0 }, width = 6.0, height = 3.5, blades = 8 } = element;
  const { selectedElementIds, selectElement } = useUiStore();
  const isSelected = selectedElementIds.includes(element.id);

  const bladeSpacing = height / blades;

  return (
    <group 
      position={[position.x, (element.elevation || 0) + height / 2, position.z]}
      onClick={(e) => { e.stopPropagation(); selectElement(element.id); }}
    >
      {/* Louver Blades */}
      {Array.from({ length: blades }).map((_, i) => (
        <mesh 
          key={i} 
          position={[0, -height / 2 + i * bladeSpacing + bladeSpacing / 2, 0.2]}
          rotation={[Math.PI / 6, 0, 0]}
          castShadow
        >
          <boxGeometry args={[width, 0.05, 0.45]} />
          <meshStandardMaterial color={isSelected ? '#38bdf8' : '#64748b'} metalness={0.8} />
        </mesh>
      ))}
    </group>
  );
};
