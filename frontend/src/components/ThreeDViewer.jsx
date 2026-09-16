import React, { useState, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, Edges, Html } from '@react-three/drei';
import { Info, Maximize2, RefreshCw } from 'lucide-react';

const BuildingElement = ({ position, scale, color, type, onSelect }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <mesh
      position={position}
      scale={scale}
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true); }}
      onPointerOut={(e) => { e.stopPropagation(); setHovered(false); }}
      onClick={(e) => { e.stopPropagation(); onSelect({ type, position, scale }); }}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial 
        color={hovered ? '#fbbf24' : color} 
        transparent 
        opacity={type === 'slab' ? 0.9 : 1}
        roughness={0.2}
        metalness={0.8}
      />
      <Edges scale={1} threshold={15} color={hovered ? 'black' : '#1e293b'} />
    </mesh>
  );
};

const ParametricBuilding = ({ onSelectElement }) => {
  // Generate a procedural building (simulating Dynamo logic)
  const elements = useMemo(() => {
    const items = [];
    const floors = 8;
    const colsX = 4;
    const colsZ = 4;
    const floorHeight = 3;
    const colSpacing = 4;

    // Slabs
    for (let f = 0; f < floors; f++) {
      items.push({
        id: `slab-${f}`,
        type: 'slab',
        pos: [0, f * floorHeight, 0],
        scale: [colsX * colSpacing + 1, 0.4, colsZ * colSpacing + 1],
        color: '#e2e8f0',
      });
      
      // Core
      items.push({
        id: `core-${f}`,
        type: 'core',
        pos: [0, f * floorHeight + floorHeight / 2, 0],
        scale: [3, floorHeight, 3],
        color: '#94a3b8',
      });

      // Columns
      if (f < floors - 1) {
        for (let x = 0; x <= colsX; x++) {
          for (let z = 0; z <= colsZ; z++) {
            // Skip middle columns for open core
            if (x > 0 && x < colsX && z > 0 && z < colsZ) continue;
            
            items.push({
              id: `col-${f}-${x}-${z}`,
              type: 'column',
              pos: [
                (x - colsX / 2) * colSpacing,
                f * floorHeight + floorHeight / 2,
                (z - colsZ / 2) * colSpacing
              ],
              scale: [0.6, floorHeight, 0.6],
              color: '#3b82f6',
            });
          }
        }
      }
    }
    return items;
  }, []);

  return (
    <group position={[0, -2, 0]}>
      {elements.map((el) => (
        <BuildingElement 
          key={el.id} 
          position={el.pos} 
          scale={el.scale} 
          color={el.color}
          type={el.type}
          onSelect={() => onSelectElement({ id: el.id, ...el })}
        />
      ))}
    </group>
  );
};

export function ThreeDViewer() {
  const [selected, setSelected] = useState(null);

  return (
    <div style={{ position: 'relative', width: '100%', height: '600px', backgroundColor: '#0f172a', borderRadius: '0.75rem', overflow: 'hidden', border: '1px solid #334155' }}>
      
      {/* 3D Canvas */}
      <Canvas camera={{ position: [25, 20, 25], fov: 40 }}>
        <color attach="background" args={['#0f172a']} />
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 20, 10]} intensity={1} castShadow />
        <hemisphereLight intensity={0.6} groundColor="#0f172a" color="#38bdf8" /><directionalLight position={[-15, 20, -15]} intensity={0.5} />
        
        <ParametricBuilding onSelectElement={setSelected} />
        
        <ContactShadows position={[0, -2.5, 0]} opacity={0.5} scale={50} blur={2} far={10} />
        <OrbitControls makeDefault autoRotate autoRotateSpeed={0.5} maxPolarAngle={Math.PI / 2 - 0.05} />
      </Canvas>

      {/* Viewer UI Overlay */}
      <div style={{ position: 'absolute', top: '1rem', left: '1rem', display: 'flex', gap: '0.5rem' }}>
        <button className="bim-viewer-dark-tool active" style={{ backgroundColor: 'rgba(15, 23, 42, 0.8)', border: '1px solid #334155', color: 'white', padding: '0.5rem 1rem', borderRadius: '0.5rem', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', backdropFilter: 'blur(8px)' }}>
          <RefreshCw size={14} /> Reload .glb
        </button>
      </div>

      <div style={{ position: 'absolute', bottom: '1rem', right: '1rem', display: 'flex', gap: '0.5rem' }}>
        <button style={{ backgroundColor: 'rgba(15, 23, 42, 0.8)', border: '1px solid #334155', color: 'white', padding: '0.5rem', borderRadius: '0.5rem', cursor: 'pointer', backdropFilter: 'blur(8px)' }}>
          <Maximize2 size={16} />
        </button>
      </div>

      {/* BIM Properties Panel */}
      {selected && (
        <div style={{ position: 'absolute', top: '1rem', right: '1rem', width: '250px', backgroundColor: 'rgba(15, 23, 42, 0.85)', backdropFilter: 'blur(12px)', border: '1px solid #334155', borderRadius: '0.5rem', color: 'white', padding: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: '1px solid #334155', paddingBottom: '0.5rem', marginBottom: '0.5rem' }}>
            <Info size={16} color="#3b82f6" />
            <h4 style={{ margin: 0, fontSize: '0.875rem' }}>BIM Properties</h4>
          </div>
          <div style={{ fontSize: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#94a3b8' }}>ID:</span> <span>{selected.id}</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#94a3b8' }}>Type:</span> <span style={{ textTransform: 'capitalize' }}>{selected.type}</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#94a3b8' }}>Material:</span> <span>{selected.type === 'column' ? 'Steel' : 'Concrete'}</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#94a3b8' }}>Volume:</span> <span>{(selected.scale[0] * selected.scale[1] * selected.scale[2]).toFixed(2)} mÂ³</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#94a3b8' }}>Status:</span> <span style={{ color: '#10b981' }}>Approved</span></div>
          </div>
          <button 
            onClick={() => setSelected(null)}
            style={{ width: '100%', marginTop: '1rem', padding: '0.5rem', backgroundColor: '#334155', border: 'none', color: 'white', borderRadius: '0.25rem', fontSize: '0.75rem', cursor: 'pointer' }}
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
}