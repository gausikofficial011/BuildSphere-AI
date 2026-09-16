import React, { useMemo } from 'react';
import { useUiStore } from "../../../store/uiStore";

export const CrossBracing = ({ element }) => {
  const { position = { x: 0, y: 0, z: 0 }, width = 6.0, height = 3.5, pipeRadius = 0.06 } = element;
  const { selectedElementIds, selectElement } = useUiStore();
  const isSelected = selectedElementIds.includes(element.id);

  const diagLen = Math.sqrt(width * width + height * height);
  const angle = Math.atan2(height, width);

  return (
    <group 
      position={[position.x, (element.elevation || 0) + height / 2, position.z]}
      onClick={(e) => { e.stopPropagation(); selectElement(element.id); }}
    >
      {/* Diagonal 1 */}
      <mesh rotation={[0, 0, angle]} castShadow>
        <cylinderGeometry args={[pipeRadius, pipeRadius, diagLen, 12]} />
        <meshStandardMaterial color={isSelected ? '#38bdf8' : '#f59e0b'} metalness={0.8} roughness={0.3} />
      </mesh>
      {/* Diagonal 2 */}
      <mesh rotation={[0, 0, -angle]} castShadow>
        <cylinderGeometry args={[pipeRadius, pipeRadius, diagLen, 12]} />
        <meshStandardMaterial color={isSelected ? '#38bdf8' : '#f59e0b'} metalness={0.8} roughness={0.3} />
      </mesh>
    </group>
  );
};
