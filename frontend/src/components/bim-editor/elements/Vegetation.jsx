import React from 'react';
import { useUiStore } from "../../../store/uiStore";

export const Vegetation = ({ element }) => {
  const { position = { x: 0, y: 0, z: 0 }, treeType = 'Oak', height = 4.5 } = element;
  const { selectedElementIds, selectElement } = useUiStore();
  const isSelected = selectedElementIds.includes(element.id);

  const trunkH = height * 0.4;
  const foliageH = height * 0.6;

  return (
    <group 
      position={[position.x, (element.elevation || 0), position.z]}
      onClick={(e) => { e.stopPropagation(); selectElement(element.id); }}
    >
      {/* Trunk */}
      <mesh position={[0, trunkH / 2, 0]} castShadow>
        <cylinderGeometry args={[0.15, 0.25, trunkH, 8]} />
        <meshStandardMaterial color={isSelected ? '#38bdf8' : '#78350f'} roughness={0.9} />
      </mesh>

      {/* Foliage Canopy */}
      <mesh position={[0, trunkH + foliageH / 2, 0]} castShadow receiveShadow>
        <dodecahedronGeometry args={[foliageH * 0.7, 1]} />
        <meshStandardMaterial color={isSelected ? '#38bdf8' : '#15803d'} roughness={0.8} />
      </mesh>
    </group>
  );
};
