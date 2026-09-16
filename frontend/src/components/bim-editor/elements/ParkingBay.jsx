import React from 'react';
import { useUiStore } from "../../../store/uiStore";
import { Edges } from '@react-three/drei';

export const ParkingBay = ({ element }) => {
  const { position = { x: 0, y: 0, z: 0 }, width = 2.6, length = 5.2, isEv = false } = element;
  const { selectedElementIds, selectElement } = useUiStore();
  const isSelected = selectedElementIds.includes(element.id);

  return (
    <group 
      position={[position.x, (element.elevation || 0) + 0.01, position.z]}
      onClick={(e) => { e.stopPropagation(); selectElement(element.id); }}
    >
      {/* Asphalt / Marking Pad */}
      <mesh receiveShadow>
        <boxGeometry args={[width, 0.02, length]} />
        <meshStandardMaterial color={isSelected ? '#38bdf8' : isEv ? '#065f46' : '#1e293b'} roughness={0.9} />
        <Edges scale={1} threshold={15} color={isEv ? '#34d399' : '#f8fafc'} />
      </mesh>
    </group>
  );
};
