import React from 'react';
import { useUiStore } from "../../../store/uiStore";
import { Edges, Html } from '@react-three/drei';

export const RoomZone = ({ element }) => {
  const { position = { x: 0, y: 0, z: 0 }, width = 6.0, length = 6.0, height = 3.0, roomName = "Executive Suite", roomType = "Office" } = element;
  const { selectedElementIds, selectElement } = useUiStore();
  const isSelected = selectedElementIds.includes(element.id);

  const area = (width * length).toFixed(1);

  return (
    <group 
      position={[position.x, (element.elevation || 0) + height / 2, position.z]}
      onClick={(e) => { e.stopPropagation(); selectElement(element.id); }}
    >
      {/* 3D Zone Bounding Box */}
      <mesh>
        <boxGeometry args={[width, height, length]} />
        <meshStandardMaterial 
          color={isSelected ? '#38bdf8' : '#6366f1'} 
          transparent={true} 
          opacity={0.15} 
          roughness={0.1}
        />
        <Edges scale={1} threshold={15} color={isSelected ? '#38bdf8' : '#818cf8'} />
      </mesh>

      {/* Floating 3D Badge */}
      <Html position={[0, height / 2 + 0.2, 0]} center>
        <div style={{
          background: isSelected ? 'rgba(2, 132, 199, 0.95)' : 'rgba(15, 23, 42, 0.85)',
          color: 'white',
          padding: '4px 10px',
          borderRadius: '8px',
          border: '1px solid rgba(56, 189, 248, 0.4)',
          fontSize: '11px',
          fontWeight: 700,
          whiteSpace: 'nowrap',
          boxShadow: '0 2px 10px rgba(0,0,0,0.5)',
          textAlign: 'center',
          backdropFilter: 'blur(4px)',
          pointerEvents: 'none'
        }}>
          <div>{roomName}</div>
          <div style={{ fontSize: '9px', color: '#93c5fd', fontWeight: 500 }}>{area} m² • {roomType}</div>
        </div>
      </Html>
    </group>
  );
};
