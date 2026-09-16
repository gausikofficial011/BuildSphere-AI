import React, { useMemo } from 'react';
import { useUiStore } from "../../../store/uiStore";
import { Edges } from '@react-three/drei';

export const Stairs = ({ element }) => {
  const { position = { x: 0, y: 0, z: 0 }, width = 1.4, totalHeight = 3.5, totalLength = 4.5, steps = 14, material = 'Concrete' } = element;
  const { selectedElementIds, selectElement } = useUiStore();
  const isSelected = selectedElementIds.includes(element.id);

  const stepList = useMemo(() => {
    const arr = [];
    const stepH = totalHeight / steps;
    const stepL = totalLength / steps;
    const startX = -totalLength / 2;

    for (let i = 0; i < steps; i++) {
      const x = startX + i * stepL + stepL / 2;
      const y = (i + 1) * stepH / 2;
      const h = (i + 1) * stepH;
      arr.push({ x, y, h, stepL, stepH });
    }
    return arr;
  }, [totalHeight, totalLength, steps]);

  const matColor = material === 'Wood' ? '#b45309' : material === 'Steel' ? '#334155' : '#cbd5e1';

  return (
    <group 
      position={[position.x, position.y + (element.elevation || 0), position.z]}
      onClick={(e) => { e.stopPropagation(); selectElement(element.id); }}
    >
      {stepList.map((st, idx) => (
        <mesh key={idx} position={[st.x, st.y, 0]} castShadow receiveShadow>
          <boxGeometry args={[st.stepL, st.h, width]} />
          <meshStandardMaterial 
            color={isSelected ? '#38bdf8' : matColor} 
            roughness={0.6} 
            metalness={material === 'Steel' ? 0.6 : 0.1}
          />
          <Edges scale={1} threshold={15} color={isSelected ? '#0284c7' : '#475569'} />
        </mesh>
      ))}

      {/* Handrail */}
      <mesh position={[0, totalHeight / 2 + 0.9, width / 2 - 0.05]}>
        <boxGeometry args={[totalLength, 0.08, 0.08]} />
        <meshStandardMaterial color={isSelected ? '#38bdf8' : '#f59e0b'} metalness={0.8} />
      </mesh>
      <mesh position={[0, totalHeight / 2 + 0.9, -width / 2 + 0.05]}>
        <boxGeometry args={[totalLength, 0.08, 0.08]} />
        <meshStandardMaterial color={isSelected ? '#38bdf8' : '#f59e0b'} metalness={0.8} />
      </mesh>
    </group>
  );
};
