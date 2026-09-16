import React, { useMemo } from 'react';
import { useUiStore } from "../../../store/uiStore";
import { Edges } from '@react-three/drei';

export const Truss = ({ element }) => {
  const { position = { x: 0, y: 0, z: 0 }, span = 12.0, height = 1.8, thickness = 0.25, panels = 6 } = element;
  const { selectedElementIds, selectElement } = useUiStore();
  const isSelected = selectedElementIds.includes(element.id);

  const panelWidth = span / panels;

  return (
    <group 
      position={[position.x, (element.elevation || 3.5), position.z]}
      onClick={(e) => { e.stopPropagation(); selectElement(element.id); }}
    >
      {/* Top Chord */}
      <mesh position={[0, height / 2, 0]}>
        <boxGeometry args={[span, 0.12, thickness]} />
        <meshStandardMaterial color={isSelected ? '#38bdf8' : '#334155'} metalness={0.8} />
      </mesh>

      {/* Bottom Chord */}
      <mesh position={[0, -height / 2, 0]}>
        <boxGeometry args={[span, 0.12, thickness]} />
        <meshStandardMaterial color={isSelected ? '#38bdf8' : '#334155'} metalness={0.8} />
      </mesh>

      {/* Diagonal Web Members */}
      {Array.from({ length: panels }).map((_, i) => {
        const x = -span / 2 + i * panelWidth + panelWidth / 2;
        const diagLen = Math.sqrt(panelWidth * panelWidth + height * height);
        const angle = Math.atan2(height, panelWidth) * (i % 2 === 0 ? 1 : -1);

        return (
          <mesh key={i} position={[x, 0, 0]} rotation={[0, 0, angle]}>
            <boxGeometry args={[diagLen, 0.08, thickness * 0.8]} />
            <meshStandardMaterial color={isSelected ? '#38bdf8' : '#475569'} metalness={0.8} />
          </mesh>
        );
      })}
    </group>
  );
};
