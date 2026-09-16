import React, { useState, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, Edges } from '@react-three/drei';
import { Info, Maximize2, RefreshCw, Map } from 'lucide-react';
import * as THREE from 'three';

const CivilElement = ({ position, rotation = [0,0,0], scale, color, type, geometryArgs, materialProps, onSelect, edges = false }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <mesh
      position={position}
      rotation={rotation}
      scale={scale}
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true); }}
      onPointerOut={(e) => { e.stopPropagation(); setHovered(false); }}
      onClick={(e) => { e.stopPropagation(); onSelect({ type, position, scale }); }}
    >
      {type === 'pipe' ? (
        <cylinderGeometry args={geometryArgs} />
      ) : type === 'terrain' ? (
        <planeGeometry args={geometryArgs} />
      ) : (
        <boxGeometry args={geometryArgs} />
      )}
      
      <meshStandardMaterial 
        color={hovered ? '#fbbf24' : color} 
        {...materialProps}
      />
      {edges && <Edges scale={1} threshold={15} color={hovered ? 'black' : '#1e293b'} />}
    </mesh>
  );
};

const ParametricCivilModel = ({ onSelectElement }) => {
  // Generate procedural civil infrastructure (simulating Dynamo for Civil 3D logic)
  const elements = useMemo(() => {
    const items = [];
    
    // 1. Topography / Terrain Mesh (Simulated as a flat plane with some material)
    items.push({
      id: `topo-surface-01`,
      type: 'terrain',
      pos: [0, 0, 0],
      rot: [-Math.PI / 2, 0, 0],
      geom: [40, 40, 64, 64],
      color: '#4ade80',
      material: { wireframe: true, transparent: true, opacity: 0.3 }
    });

    // 2. Road Alignment (Asphalt)
    items.push({
      id: `road-align-01`,
      type: 'road',
      pos: [0, 0.1, 0],
      geom: [6, 0.2, 40],
      color: '#334155',
      material: { roughness: 0.9 }
    });

    // 3. Underground Utilities (Drainage Pipes)
    for (let i = -15; i <= 15; i += 10) {
      items.push({
        id: `pipe-drainage-${i}`,
        type: 'pipe',
        pos: [2, -2, i],
        rot: [Math.PI / 2, 0, 0],
        geom: [0.5, 0.5, 9.5, 16],
        color: '#f97316',
        material: { roughness: 0.3, metalness: 0.5 }
      });
      
      // Manholes
      items.push({
        id: `manhole-${i}`,
        type: 'manhole',
        pos: [2, -1, i + 5],
        geom: [1.2, 2, 1.2],
        color: '#94a3b8',
        material: { roughness: 0.7 }
      });
    }

    return items;
  }, []);

  return (
    <group position={[0, 0, 0]}>
      {elements.map((el) => (
        <CivilElement 
          key={el.id} 
          position={el.pos} 
          rotation={el.rot}
          scale={el.scale || [1,1,1]} 
          color={el.color}
          type={el.type}
          geometryArgs={el.geom}
          materialProps={el.material}
          onSelect={() => onSelectElement({ id: el.id, ...el })}
          edges={el.type !== 'terrain'}
        />
      ))}
    </group>
  );
};

export function CivilThreeDViewer() {
  const [selected, setSelected] = useState(null);

  return (
    <div style={{ position: 'relative', width: '100%', height: '600px', backgroundColor: '#0f172a', borderRadius: '0.75rem', overflow: 'hidden', border: '1px solid #334155' }}>
      
      {/* 3D Canvas */}
      <Canvas camera={{ position: [15, 15, 15], fov: 45 }}>
        <color attach="background" args={['#0f172a']} />
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 20, 10]} intensity={1.2} castShadow />
        <hemisphereLight intensity={0.6} groundColor="#0f172a" color="#38bdf8" /><directionalLight position={[-15, 20, -15]} intensity={0.5} />
        
        <ParametricCivilModel onSelectElement={setSelected} />
        
        <OrbitControls makeDefault autoRotate autoRotateSpeed={0.3} maxPolarAngle={Math.PI / 2 + 0.1} />
      </Canvas>

      {/* Viewer UI Overlay */}
      <div style={{ position: 'absolute', top: '1rem', left: '1rem', display: 'flex', gap: '0.5rem' }}>
        <button className="bim-viewer-dark-tool active" style={{ backgroundColor: 'rgba(15, 23, 42, 0.8)', border: '1px solid #334155', color: 'white', padding: '0.5rem 1rem', borderRadius: '0.5rem', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', backdropFilter: 'blur(8px)' }}>
          <Map size={14} /> Civil 3D Context
        </button>
        <button className="bim-viewer-dark-tool" style={{ backgroundColor: 'rgba(15, 23, 42, 0.8)', border: '1px solid #334155', color: 'white', padding: '0.5rem 1rem', borderRadius: '0.5rem', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', backdropFilter: 'blur(8px)' }}>
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
            <h4 style={{ margin: 0, fontSize: '0.875rem' }}>Civil 3D Properties</h4>
          </div>
          <div style={{ fontSize: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#94a3b8' }}>ID:</span> <span>{selected.id}</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#94a3b8' }}>Type:</span> <span style={{ textTransform: 'capitalize' }}>{selected.type}</span></div>
            
            {selected.type === 'pipe' && (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#94a3b8' }}>Diameter:</span> <span>1000 mm</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#94a3b8' }}>Slope:</span> <span>-1.5%</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#94a3b8' }}>Invert Elev:</span> <span>-2.25 m</span></div>
              </>
            )}

            {selected.type === 'road' && (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#94a3b8' }}>Material:</span> <span>Asphalt</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#94a3b8' }}>Length:</span> <span>40.0 m</span></div>
              </>
            )}
            
            {selected.type === 'terrain' && (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#94a3b8' }}>Surface Area:</span> <span>1600 mÂ²</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#94a3b8' }}>Grid Size:</span> <span>64x64</span></div>
              </>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem', paddingTop: '0.5rem', borderTop: '1px solid #334155' }}>
              <span style={{ color: '#94a3b8' }}>System:</span> 
              <span style={{ color: '#10b981' }}>{selected.type === 'pipe' || selected.type === 'manhole' ? 'Storm Drainage' : 'Site Infrastructure'}</span>
            </div>
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
