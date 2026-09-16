import React from 'react';
import { useUiStore } from "../../../store/uiStore";

export const SpiralStairs = ({ element }) => {
  const { position = { x: 0, y: 0, z: 0 }, radius = 1.8, totalHeight = 3.5, steps = 18 } = element;
  const { selectedElementIds, selectElement } = useUiStore();
  const isSelected = selectedElementIds.includes(element.id);

  const stepH = totalHeight / steps;
  const anglePerStep = (Math.PI * 1.5) / steps;

  return (
    <group 
      position={[position.x, (element.elevation || 0), position.z]}
      onClick={(e) => { e.stopPropagation(); selectElement(element.id); }}
    >
      {/* Central Column Spine */}
      <mesh position={[0, totalHeight / 2, 0]} castShadow>
        <cylinderGeometry args={[0.15, 0.15, totalHeight, 16]} />
        <meshStandardMaterial color={isSelected ? '#38bdf8' : '#334155'} metalness={0.8} />
      </mesh>

      {/* Treads */}
      {Array.from({ length: steps }).map((_, i) => {
        const theta = i * anglePerStep;
        const y = i * stepH + stepH / 2;
        const treadLength = radius * 0.9;

        return (
          <mesh 
            key={i} 
            position={[Math.cos(theta) * (treadLength / 2), y, Math.sin(theta) * (treadLength / 2)]}
            rotation={[0, -theta, 0]}
            castShadow
          >
            <boxGeometry args={[treadLength, 0.05, 0.35]} />
            <meshStandardMaterial color={isSelected ? '#38bdf8' : '#cbd5e1'} metalness={0.5} roughness={0.4} />
          </mesh>
        );
      })}
    </group>
  );
};
