import React, { useState } from 'react';
import { snapToGrid, snapToElements } from '../../engine/snapping';
import { useUiStore } from '../../store/uiStore';
import { useBimStore } from '../../store/bimStore';

export const GridPlane = ({ onPointerMove, onClick }) => {
  const { gridSize, snapEnabled } = useUiStore();
  const { elements } = useBimStore();
  const [cursorPos, setCursorPos] = useState([0,0,0]);

  const handlePointerMove = (e) => {
    if (!e.point) return;
    const rawPoint = { x: e.point.x, y: 0, z: e.point.z };
    
    // Snap logic
    let snappedPoint = rawPoint;
    if (snapEnabled) {
      const gridSnapped = snapToGrid(rawPoint, gridSize, snapEnabled);
      snappedPoint = snapToElements(gridSnapped, Object.values(elements), 1.0);
    }
    
    setCursorPos([snappedPoint.x, 0, snappedPoint.z]);
    if (onPointerMove) onPointerMove(snappedPoint);
  };

  const handleClick = (e) => {
    e.stopPropagation();
    if (onClick) onClick({ x: cursorPos[0], y: 0, z: cursorPos[2] });
  };

  return (
    <group>
      <gridHelper args={[100, 100 / gridSize, '#334155', '#1e293b']} position={[0, -0.01, 0]} />
      
      {/* Invisible plane to catch raycasts */}
      <mesh 
        rotation={[-Math.PI / 2, 0, 0]} 
        position={[0, 0, 0]} 
        onPointerMove={handlePointerMove}
        onClick={handleClick}
        visible={false}
      >
        <planeGeometry args={[100, 100]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>

      {/* Snap Indicator */}
      <mesh position={cursorPos}>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshBasicMaterial color="#3b82f6" />
      </mesh>
    </group>
  );
};
