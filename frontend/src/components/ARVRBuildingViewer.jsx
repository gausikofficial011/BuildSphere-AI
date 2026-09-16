import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, Edges, Text, Float } from '@react-three/drei';
import * as THREE from 'three';
import {
  Box, Eye, Layers, Sun, Moon, Maximize2, Minimize2, RefreshCw,
  Sparkles, Camera, Compass, ShieldCheck, Activity, Zap, Play,
  Pause, ChevronRight, X, Info, Gauge, AlertTriangle, Video, Glasses
} from 'lucide-react';
import { soundFx } from '../utils/soundManager';

// =========================================================================
// 1. PROCEDURAL 3D BUILDING GENERATOR & ELEMENT MESHES
// =========================================================================

function BuildingMeshElement({ element, isSelected, onSelect, xRay, isGhost, activeDiscipline }) {
  const [hovered, setHovered] = useState(false);
  const meshRef = useRef();

  const isVisible = activeDiscipline === 'all' || element.discipline === activeDiscipline;
  if (!isVisible) return null;

  let baseColor = element.color;
  let opacity = element.opacity || 1.0;

  if (isGhost) opacity = 0.15;
  if (xRay && element.type === 'facade') opacity = 0.25;
  if (isSelected) baseColor = '#22d3ee';
  else if (hovered) baseColor = '#f43f5e';

  return (
    <mesh
      ref={meshRef}
      position={element.position}
      scale={element.scale}
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true); }}
      onPointerOut={(e) => { e.stopPropagation(); setHovered(false); }}
      onClick={(e) => {
        e.stopPropagation();
        soundFx.playClick();
        onSelect(element);
      }}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial
        color={baseColor}
        transparent={opacity < 1}
        opacity={opacity}
        roughness={element.roughness || 0.3}
        metalness={element.metalness || 0.4}
        wireframe={xRay && element.type !== 'facade'}
      />
      <Edges
        threshold={15}
        color={isSelected ? '#06b6d4' : hovered ? '#ec4899' : '#0f172a'}
      />
    </mesh>
  );
}

// AR Reticle Ground Anchor
function ARFloorReticle({ position = [0, -0.05, 0] }) {
  const ringRef = useRef();
  useFrame((state) => {
    if (ringRef.current) {
      ringRef.current.rotation.z += 0.01;
    }
  });

  return (
    <group position={position} rotation={[-Math.PI / 2, 0, 0]}>
      <mesh ref={ringRef}>
        <ringGeometry args={[7.5, 8.0, 32]} />
        <meshBasicMaterial color="#06b6d4" transparent opacity={0.6} side={THREE.DoubleSide} />
      </mesh>
      <mesh>
        <circleGeometry args={[7.4, 32]} />
        <meshBasicMaterial color="#22d3ee" transparent opacity={0.08} side={THREE.DoubleSide} />
      </mesh>
      <gridHelper args={[24, 24, '#ec4899', '#3b82f6']} rotation={[Math.PI / 2, 0, 0]} />
    </group>
  );
}

// IoT Telemetry Pulsing Ring
function IoTSensorNode({ position, label, status, value }) {
  const pulseRef = useRef();
  useFrame((state) => {
    if (pulseRef.current) {
      const s = 1 + Math.sin(state.clock.elapsedTime * 4) * 0.25;
      pulseRef.current.scale.set(s, s, s);
    }
  });

  return (
    <group position={position}>
      <mesh ref={pulseRef}>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshBasicMaterial color="#10b981" transparent opacity={0.5} />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.18, 16, 16]} />
        <meshStandardMaterial color="#06b6d4" emissive="#06b6d4" emissiveIntensity={0.8} />
      </mesh>
    </group>
  );
}

// 3D Scene Composition
function BuildingModelScene({
  selectedFloor,
  explodedProgress,
  selectedElement,
  onSelectElement,
  xRay,
  activeDiscipline,
  showARAnchor,
  showIoTSensors,
  sunAngle
}) {
  const floors = 7;
  const floorHeight = 3.2;
  const colsX = 4;
  const colsZ = 4;
  const colSpacing = 4.5;

  const elements = useMemo(() => {
    const list = [];

    for (let f = 0; f < floors; f++) {
      const isFloorActive = selectedFloor === 'all' || selectedFloor === f;
      const yOffset = f * floorHeight + f * explodedProgress * 2.5;

      // 1. Slabs
      list.push({
        id: `SLAB-L0${f + 1}`,
        name: `Level ${f + 1} Post-Tensioned Slab (200mm)`,
        type: 'slab',
        discipline: 'architectural',
        floor: f,
        position: [0, yOffset, 0],
        scale: [colsX * colSpacing + 1.5, 0.35, colsZ * colSpacing + 1.5],
        color: f === 0 ? '#475569' : '#cbd5e1',
        material: 'M40 Design Mix Concrete',
        fireRating: '2 Hours (BS 476)',
        volume: '142.5 mÂ³',
        cost: 'â‚¹ 9.8 Lakh',
        status: 'Constructed & Verified',
        opacity: 0.95
      });

      // 2. Core Shear Walls
      list.push({
        id: `CORE-L0${f + 1}`,
        name: `Level ${f + 1} Elevator & Stair Core Wall`,
        type: 'core',
        discipline: 'structural',
        floor: f,
        position: [0, yOffset + floorHeight / 2, 0],
        scale: [3.2, floorHeight, 3.2],
        color: '#64748b',
        material: 'M50 High-Strength Concrete (IS 456)',
        fireRating: '4 Hours (UL Listed)',
        volume: '38.4 mÂ³',
        cost: 'â‚¹ 4.2 Lakh',
        status: 'Quality Passed Code A',
        opacity: 0.9
      });

      // 3. Reinforced Columns
      for (let x = 0; x <= colsX; x++) {
        for (let z = 0; z <= colsZ; z++) {
          if (x > 0 && x < colsX && z > 0 && z < colsZ) continue; // Skip core void
          list.push({
            id: `COL-L0${f + 1}-${x}${z}`,
            name: `Column C-${x}${z} (600x600mm)`,
            type: 'column',
            discipline: 'structural',
            floor: f,
            position: [
              (x - colsX / 2) * colSpacing,
              yOffset + floorHeight / 2,
              (z - colsZ / 2) * colSpacing
            ],
            scale: [0.65, floorHeight - 0.35, 0.65],
            color: '#3b82f6',
            material: 'M40 Concrete + Fe550D Rebar',
            fireRating: '3 Hours',
            volume: '1.2 mÂ³',
            cost: 'â‚¹ 82,000',
            status: 'Ultrasonic Pulse Velocity Pass'
          });
        }
      }

      // 4. Facade Curtain Wall Panels
      if (f > 0) {
        list.push({
          id: `FACADE-L0${f + 1}-N`,
          name: `North Elevation Unitized DGU Low-E Facade`,
          type: 'facade',
          discipline: 'architectural',
          floor: f,
          position: [0, yOffset + floorHeight / 2, (colsZ / 2) * colSpacing + 0.6],
          scale: [colsX * colSpacing, floorHeight - 0.4, 0.12],
          color: '#38bdf8',
          material: 'Saint-Gobain Low-E DGU (8-12-6mm)',
          fireRating: '1 Hour Spandrel Barrier',
          volume: '2.4 mÂ³',
          cost: 'â‚¹ 3.8 Lakh',
          status: 'Water Tightness Tested',
          opacity: 0.55
        });
      }

      // 5. MEP HVAC Main Ducts
      list.push({
        id: `MEP-DUCT-L0${f + 1}`,
        name: `Primary HVAC Supply Air Duct (1200x500mm)`,
        type: 'mep',
        discipline: 'mep',
        floor: f,
        position: [1.2, yOffset + floorHeight - 0.5, 0],
        scale: [colsX * colSpacing - 2, 0.45, 0.8],
        color: '#f59e0b',
        material: 'Galvanized Steel GI 0.8mm',
        fireRating: 'Class 0 Flame Spread',
        volume: '4.8 mÂ³',
        cost: 'â‚¹ 1.4 Lakh',
        status: 'Pressure Tested 500Pa',
        opacity: 0.85
      });
    }

    return list;
  }, [floors, floorHeight, colsX, colsZ, colSpacing, explodedProgress]);

  // Filter elements by active floor
  const visibleElements = useMemo(() => {
    if (selectedFloor === 'all') return elements;
    return elements.filter((el) => el.floor === selectedFloor);
  }, [elements, selectedFloor]);

  return (
    <group position={[0, -4, 0]}>
      {showARAnchor && <ARFloorReticle position={[0, -0.1, 0]} />}

      {visibleElements.map((el) => (
        <BuildingMeshElement
          key={el.id}
          element={el}
          isSelected={selectedElement?.id === el.id}
          onSelect={onSelectElement}
          xRay={xRay}
          activeDiscipline={activeDiscipline}
        />
      ))}

      {showIoTSensors && (
        <>
          <IoTSensorNode position={[4, 2.5, 4]} label="IAQ Sensor #1" status="Normal" value="480 ppm CO2" />
          <IoTSensorNode position={[-4, 2.5, -4]} label="Vibration Node #4" status="Normal" value="0.7 mm/s RMS" />
          <IoTSensorNode position={[0, 9.2, 0]} label="Chiller Plant Sensor" status="Active" value="6.8 Â°C Temp" />
          <IoTSensorNode position={[4, 15.5, -4]} label="Sky Deck Wind Monitor" status="Active" value="14.2 km/h" />
        </>
      )}

      <ContactShadows position={[0, -0.2, 0]} opacity={0.65} scale={45} blur={2.5} far={12} />
    </group>
  );
}

// =========================================================================
// 2. MAIN COMPONENT: AR/VR BUILDING VIEWER CONTROLLER
// =========================================================================

export function ARVRBuildingViewer({
  portalRole = "Super Admin / Client / Project Manager",
  projectName = "BuildSphere Twin Tower - Phase 1"
}) {
  // Mode selection: '3d' (Orbit), 'ar' (Augmented Reality), 'vr' (Virtual Reality Stereo), 'tour' (Spatial Walkthrough)
  const [viewMode, setViewMode] = useState('3d');
  const [selectedElement, setSelectedElement] = useState(null);
  const [selectedFloor, setSelectedFloor] = useState('all');
  const [activeDiscipline, setActiveDiscipline] = useState('all');
  const [explodedView, setExplodedView] = useState(0);
  const [xRayMode, setXRayMode] = useState(false);
  const [showIoTSensors, setShowIoTSensors] = useState(true);
  const [isAutoRotating, setIsAutoRotating] = useState(true);
  const [timeOfDay, setTimeOfDay] = useState(14); // 14:00 (2 PM)
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [arScale, setArScale] = useState('tabletop'); // 'tabletop' (1:50) or 'real' (1:1)
  const [isAiScanning, setIsAiScanning] = useState(false);
  const [aiScanResults, setAiScanResults] = useState(null);
  const [tourStep, setTourStep] = useState(0);

  const containerRef = useRef();

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  const handleRunAiSpatialScan = () => {
    soundFx.playWarp();
    setIsAiScanning(true);
    setAiScanResults(null);
    setTimeout(() => {
      setIsAiScanning(false);
      soundFx.playSuccess();
      setAiScanResults({
        clashCount: 0,
        energyEfficiency: '94.8% (LEED Platinum)',
        structuralIntegrity: '100% Code Compliant (IS 456 / IS 1893)',
        loadConcentration: 'Optimal Uniform Distribution',
        arTrackingConfidence: '99.4%'
      });
    }, 1200);
  };

  const tourWaypoints = [
    { title: "Grand Entrance Foyer & Atrium", floor: 0, desc: "Double-height ceiling, revolving glass access, smart turnstiles" },
    { title: "Level 2 Commercial Deck", floor: 1, desc: "Open collaboration zones, high-efficiency MEP distribution" },
    { title: "Level 4 Executive Offices", floor: 3, desc: "Acoustic drywall partitions, daylight autonomy 84%" },
    { title: "Level 7 Penthouse Suite", floor: 6, desc: "Panoramic unitized facade, private terrace slab" },
    { title: "Rooftop Solar & Plant Hub", floor: 'all', desc: "500 TR Chiller plants, 150 kWp Solar PV matrix" }
  ];

  const lightColor = useMemo(() => {
    if (timeOfDay < 7 || timeOfDay > 19) return '#1e1b4b'; // Night
    if (timeOfDay >= 7 && timeOfDay <= 9) return '#fdba74'; // Dawn
    if (timeOfDay >= 17 && timeOfDay <= 19) return '#fb923c'; // Dusk
    return '#ffffff'; // Daylight
  }, [timeOfDay]);

  const lightIntensity = useMemo(() => {
    if (timeOfDay < 7 || timeOfDay > 19) return 0.2;
    if (timeOfDay >= 7 && timeOfDay <= 9) return 0.7;
    if (timeOfDay >= 17 && timeOfDay <= 19) return 0.75;
    return 1.2;
  }, [timeOfDay]);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        width: '100%',
        height: isFullscreen ? '100vh' : '740px',
        backgroundColor: '#04030d',
        borderRadius: isFullscreen ? '0' : '12px',
        overflow: 'hidden',
        border: isFullscreen ? 'none' : '1.5px solid rgba(6, 182, 212, 0.3)',
        boxShadow: '0 0 45px rgba(6, 182, 212, 0.25)',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: "'Inter', sans-serif"
      }}
    >
      {/* =========================================================================
         TOP TOOLBAR: MODE SWITCHER & REAL-TIME CONTROLS
         ========================================================================= */}
      <div style={{
        padding: '0.75rem 1.25rem',
        borderBottom: '1px solid rgba(6, 182, 212, 0.2)',
        background: 'rgba(9, 8, 26, 0.95)',
        backdropFilter: 'blur(16px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        zIndex: 20
      }}>
        {/* Left: Project & Model Info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '34px',
            height: '34px',
            borderRadius: '8px',
            background: 'linear-gradient(135deg, #06b6d4, #ec4899)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 12px rgba(6, 182, 212, 0.4)'
          }}>
            <Box size={18} color="#ffffff" />
          </div>
          <div>
            <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>{projectName}</span>
              <span style={{ fontSize: '0.62rem', background: 'rgba(6, 182, 212, 0.15)', color: '#22d3ee', padding: '0.1rem 0.45rem', borderRadius: '4px', border: '1px solid #06b6d4' }}>
                LOD 350 MODEL
              </span>
            </div>
            <div style={{ fontSize: '0.68rem', color: '#94a3b8' }}>
              AR/VR Spatial Digital Twin Engine â€¢ {portalRole}
            </div>
          </div>
        </div>

        {/* Center: Mode Switcher Pills (3D / AR Mode / VR Stereo / Spatial Tour) */}
        <div style={{
          display: 'flex',
          gap: '0.35rem',
          background: 'rgba(0, 0, 0, 0.5)',
          padding: '0.25rem',
          borderRadius: '8px',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <button
            onClick={() => {
              soundFx.playWarp();
              setViewMode('3d');
            }}
            style={{
              padding: '0.4rem 0.85rem',
              borderRadius: '6px',
              border: viewMode === '3d' ? '1px solid #06b6d4' : '1px solid transparent',
              background: viewMode === '3d' ? 'linear-gradient(135deg, rgba(6, 182, 212, 0.25), rgba(59, 130, 246, 0.25))' : 'transparent',
              color: viewMode === '3d' ? '#22d3ee' : '#94a3b8',
              fontSize: '0.74rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            <Box size={14} />
            <span>3D BIM Orbit</span>
          </button>

          <button
            onClick={() => {
              soundFx.playWarp();
              setViewMode('ar');
            }}
            style={{
              padding: '0.4rem 0.85rem',
              borderRadius: '6px',
              border: viewMode === 'ar' ? '1px solid #ec4899' : '1px solid transparent',
              background: viewMode === 'ar' ? 'linear-gradient(135deg, rgba(236, 72, 153, 0.25), rgba(168, 85, 247, 0.25))' : 'transparent',
              color: viewMode === 'ar' ? '#f43f5e' : '#94a3b8',
              fontSize: '0.74rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            <Camera size={14} />
            <span>AR Camera Mode</span>
            <span style={{ fontSize: '0.55rem', background: '#ec4899', color: '#fff', padding: '0.05rem 0.25rem', borderRadius: '3px' }}>LIVE</span>
          </button>

          <button
            onClick={() => {
              soundFx.playWarp();
              setViewMode('vr');
            }}
            style={{
              padding: '0.4rem 0.85rem',
              borderRadius: '6px',
              border: viewMode === 'vr' ? '1px solid #8b5cf6' : '1px solid transparent',
              background: viewMode === 'vr' ? 'linear-gradient(135deg, rgba(139, 92, 246, 0.3), rgba(236, 72, 153, 0.2))' : 'transparent',
              color: viewMode === 'vr' ? '#a855f7' : '#94a3b8',
              fontSize: '0.74rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            <Glasses size={14} />
            <span>VR Stereoscopic</span>
          </button>

          <button
            onClick={() => {
              soundFx.playWarp();
              setViewMode('tour');
            }}
            style={{
              padding: '0.4rem 0.85rem',
              borderRadius: '6px',
              border: viewMode === 'tour' ? '1px solid #10b981' : '1px solid transparent',
              background: viewMode === 'tour' ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.25), rgba(6, 182, 212, 0.25))' : 'transparent',
              color: viewMode === 'tour' ? '#34d399' : '#94a3b8',
              fontSize: '0.74rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            <Compass size={14} />
            <span>Spatial Tour</span>
          </button>
        </div>

        {/* Right: Actions (AI Scan, Reset, Fullscreen) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button
            onClick={handleRunAiSpatialScan}
            disabled={isAiScanning}
            style={{
              background: 'linear-gradient(135deg, #06b6d4 0%, #ec4899 100%)',
              border: 'none',
              borderRadius: '6px',
              color: '#ffffff',
              padding: '0.45rem 0.85rem',
              fontSize: '0.74rem',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              cursor: 'pointer',
              boxShadow: '0 0 12px rgba(6, 182, 212, 0.35)'
            }}
          >
            <Sparkles size={14} />
            <span>{isAiScanning ? 'Scanning Model...' : 'AI Spatial Audit'}</span>
          </button>

          <button
            onClick={toggleFullscreen}
            title="Toggle Fullscreen"
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '6px',
              color: '#ffffff',
              padding: '0.45rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </button>
        </div>
      </div>

      {/* =========================================================================
         SUB-TOOLBAR: DISCIPLINE FILTERS & SPATIAL CONTROLS
         ========================================================================= */}
      <div style={{
        padding: '0.5rem 1.25rem',
        background: 'rgba(10, 8, 30, 0.85)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '0.75rem',
        zIndex: 15
      }}>
        {/* Discipline Filters */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <span style={{ fontSize: '0.68rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', marginRight: '0.25rem' }}>
            Discipline:
          </span>
          {[
            { id: 'all', label: 'All Layers' },
            { id: 'architectural', label: 'Architectural' },
            { id: 'structural', label: 'Structural' },
            { id: 'mep', label: 'MEP Systems' }
          ].map(d => (
            <button
              key={d.id}
              onClick={() => setActiveDiscipline(d.id)}
              style={{
                padding: '0.25rem 0.65rem',
                borderRadius: '4px',
                border: activeDiscipline === d.id ? '1px solid #22d3ee' : '1px solid rgba(255, 255, 255, 0.08)',
                background: activeDiscipline === d.id ? 'rgba(6, 182, 212, 0.2)' : 'rgba(255, 255, 255, 0.03)',
                color: activeDiscipline === d.id ? '#22d3ee' : '#cbd5e1',
                fontSize: '0.7rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              {d.label}
            </button>
          ))}
        </div>

        {/* Floor Level Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <span style={{ fontSize: '0.68rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', marginRight: '0.25rem' }}>
            Floor Level:
          </span>
          {['all', 0, 1, 2, 3, 4, 5, 6].map(f => (
            <button
              key={f}
              onClick={() => setSelectedFloor(f)}
              style={{
                padding: '0.2rem 0.5rem',
                borderRadius: '4px',
                border: selectedFloor === f ? '1px solid #ec4899' : '1px solid rgba(255, 255, 255, 0.06)',
                background: selectedFloor === f ? '#ec4899' : 'rgba(255, 255, 255, 0.03)',
                color: '#ffffff',
                fontSize: '0.68rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              {f === 'all' ? 'All (Tower)' : `L0${f + 1}`}
            </button>
          ))}
        </div>

        {/* Sliders & Toggles (Exploded View, X-Ray, IoT, Sun) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {/* Exploded View */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ fontSize: '0.68rem', color: '#94a3b8' }}>Explode:</span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={explodedView}
              onChange={(e) => setExplodedView(parseFloat(e.target.value))}
              style={{ width: '70px', accentColor: '#ec4899', cursor: 'pointer' }}
            />
          </div>

          {/* Time of Day Sun Slider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            {timeOfDay >= 7 && timeOfDay <= 19 ? <Sun size={13} color="#f59e0b" /> : <Moon size={13} color="#818cf8" />}
            <span style={{ fontSize: '0.68rem', color: '#94a3b8' }}>{timeOfDay}:00</span>
            <input
              type="range"
              min="6"
              max="22"
              step="1"
              value={timeOfDay}
              onChange={(e) => setTimeOfDay(parseInt(e.target.value))}
              style={{ width: '60px', accentColor: '#06b6d4', cursor: 'pointer' }}
            />
          </div>

          {/* X-Ray Toggle */}
          <button
            onClick={() => setXRayMode(!xRayMode)}
            style={{
              padding: '0.25rem 0.55rem',
              borderRadius: '4px',
              border: xRayMode ? '1px solid #a855f7' : '1px solid rgba(255, 255, 255, 0.1)',
              background: xRayMode ? 'rgba(168, 85, 247, 0.25)' : 'transparent',
              color: xRayMode ? '#c084fc' : '#94a3b8',
              fontSize: '0.68rem',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            X-Ray
          </button>

          {/* IoT Telemetry Toggle */}
          <button
            onClick={() => setShowIoTSensors(!showIoTSensors)}
            style={{
              padding: '0.25rem 0.55rem',
              borderRadius: '4px',
              border: showIoTSensors ? '1px solid #10b981' : '1px solid rgba(255, 255, 255, 0.1)',
              background: showIoTSensors ? 'rgba(16, 185, 129, 0.25)' : 'transparent',
              color: showIoTSensors ? '#34d399' : '#94a3b8',
              fontSize: '0.68rem',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            IoT Live
          </button>
        </div>
      </div>

      {/* =========================================================================
         MAIN 3D / AR / VR CANVAS STAGE
         ========================================================================= */}
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
        
        {/* AR BACKGROUND CAMERA SIMULATION GRID (IF AR MODE IS ACTIVE) */}
        {viewMode === 'ar' && (
          <div style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'radial-gradient(circle at center, rgba(6, 182, 212, 0.08) 0%, rgba(3, 7, 18, 0.95) 100%), linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
            backgroundSize: '100% 100%, 30px 30px, 30px 30px',
            pointerEvents: 'none',
            zIndex: 1
          }}>
            {/* AR Crosshairs & Scanning Grid */}
            <div style={{ position: 'absolute', top: '2rem', left: '2rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#ec4899', fontSize: '0.75rem', fontWeight: 800 }}>
                <Activity size={14} className="animate-pulse" />
                <span>AR SURFACE TRACKING ACTIVE [SLMA-6DOF]</span>
              </div>
              <span style={{ fontSize: '0.65rem', color: '#94a3b8' }}>Plane Detection: Ground Floor Anchor Found (Confidence 99.4%)</span>
            </div>

            {/* AR Scale Switcher (Tabletop 1:50 vs Real Scale 1:1) */}
            <div style={{ position: 'absolute', top: '2rem', right: '2rem', display: 'flex', gap: '0.5rem' }}>
              <button
                onClick={() => setArScale('tabletop')}
                style={{
                  padding: '0.35rem 0.75rem',
                  borderRadius: '4px',
                  border: arScale === 'tabletop' ? '1px solid #22d3ee' : '1px solid rgba(255,255,255,0.15)',
                  background: arScale === 'tabletop' ? 'rgba(6, 182, 212, 0.3)' : 'rgba(0,0,0,0.6)',
                  color: '#ffffff',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Tabletop AR (1:50)
              </button>
              <button
                onClick={() => setArScale('real')}
                style={{
                  padding: '0.35rem 0.75rem',
                  borderRadius: '4px',
                  border: arScale === 'real' ? '1px solid #ec4899' : '1px solid rgba(255,255,255,0.15)',
                  background: arScale === 'real' ? 'rgba(236, 72, 153, 0.3)' : 'rgba(0,0,0,0.6)',
                  color: '#ffffff',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                1:1 Real-World Scale
              </button>
            </div>
          </div>
        )}

        {/* VR STEREOSCOPIC SPLIT SCREEN (IF VR MODE IS ACTIVE) */}
        {viewMode === 'vr' ? (
          <div style={{ display: 'flex', width: '100%', height: '100%' }}>
            {/* Left Eye Canvas */}
            <div style={{ flex: 1, borderRight: '2px solid rgba(236, 72, 153, 0.5)', position: 'relative' }}>
              <div style={{ position: 'absolute', top: '10px', left: '10px', color: '#22d3ee', fontSize: '0.7rem', fontWeight: 800, zIndex: 10 }}>
                LEFT EYE (L-FOV 110Â°)
              </div>
              <Canvas camera={{ position: [20, 16, 20], fov: 45 }}>
                <color attach="background" args={['#05040f']} />
                <ambientLight intensity={lightIntensity} color={lightColor} />
                <directionalLight position={[15, 25, 15]} intensity={1.2} castShadow />
                <hemisphereLight intensity={0.6} groundColor="#0f172a" color="#38bdf8" /><directionalLight position={[-15, 20, -15]} intensity={0.5} />
                <BuildingModelScene
                  selectedFloor={selectedFloor}
                  explodedProgress={explodedView}
                  selectedElement={selectedElement}
                  onSelectElement={setSelectedElement}
                  xRay={xRayMode}
                  activeDiscipline={activeDiscipline}
                  showARAnchor={false}
                  showIoTSensors={showIoTSensors}
                  sunAngle={timeOfDay}
                />
                <OrbitControls autoRotate={isAutoRotating} autoRotateSpeed={0.5} />
              </Canvas>
            </div>

            {/* Right Eye Canvas */}
            <div style={{ flex: 1, position: 'relative' }}>
              <div style={{ position: 'absolute', top: '10px', left: '10px', color: '#f43f5e', fontSize: '0.7rem', fontWeight: 800, zIndex: 10 }}>
                RIGHT EYE (R-FOV 110Â°)
              </div>
              <Canvas camera={{ position: [20.4, 16, 20], fov: 45 }}>
                <color attach="background" args={['#05040f']} />
                <ambientLight intensity={lightIntensity} color={lightColor} />
                <directionalLight position={[15, 25, 15]} intensity={1.2} castShadow />
                <hemisphereLight intensity={0.6} groundColor="#0f172a" color="#38bdf8" /><directionalLight position={[-15, 20, -15]} intensity={0.5} />
                <BuildingModelScene
                  selectedFloor={selectedFloor}
                  explodedProgress={explodedView}
                  selectedElement={selectedElement}
                  onSelectElement={setSelectedElement}
                  xRay={xRayMode}
                  activeDiscipline={activeDiscipline}
                  showARAnchor={false}
                  showIoTSensors={showIoTSensors}
                  sunAngle={timeOfDay}
                />
                <OrbitControls autoRotate={isAutoRotating} autoRotateSpeed={0.5} />
              </Canvas>
            </div>
          </div>
        ) : (
          /* STANDARD SINGLE CAMERA CANVAS (FOR 3D, AR, AND TOUR MODES) */
          <Canvas camera={{ position: viewMode === 'tour' ? [0, 2, 12] : arScale === 'real' ? [45, 30, 45] : [26, 18, 26], fov: 42 }}>
            <color attach="background" args={[viewMode === 'ar' ? '#030712' : '#05040f']} />
            <ambientLight intensity={lightIntensity} color={lightColor} />
            <directionalLight position={[15, 25, 15]} intensity={1.2} castShadow />
            <hemisphereLight intensity={0.6} groundColor="#0f172a" color="#38bdf8" /><directionalLight position={[-15, 20, -15]} intensity={0.5} />
            
            <BuildingModelScene
              selectedFloor={selectedFloor}
              explodedProgress={explodedView}
              selectedElement={selectedElement}
              onSelectElement={setSelectedElement}
              xRay={xRayMode}
              activeDiscipline={activeDiscipline}
              showARAnchor={viewMode === 'ar'}
              showIoTSensors={showIoTSensors}
              sunAngle={timeOfDay}
            />

            <OrbitControls
              makeDefault
              autoRotate={isAutoRotating && viewMode !== 'tour'}
              autoRotateSpeed={0.6}
              maxPolarAngle={Math.PI / 2 - 0.02}
            />
          </Canvas>
        )}

        {/* =========================================================================
           FLOATING HUD OVERLAYS (BIM INSPECTOR, TOUR CONTROLLER, AI AUDIT)
           ========================================================================= */}
        
        {/* 1. BIM Element Properties Card */}
        {selectedElement && (
          <div style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            width: '280px',
            background: 'rgba(9, 8, 26, 0.94)',
            backdropFilter: 'blur(20px)',
            border: '1.5px solid #06b6d4',
            borderRadius: '8px',
            padding: '1rem',
            boxShadow: '0 0 25px rgba(6, 182, 212, 0.35)',
            zIndex: 30,
            animation: 'cyberFadeIn 0.2s ease-out'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(6, 182, 212, 0.25)', paddingBottom: '0.5rem', marginBottom: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <Info size={16} color="#22d3ee" />
                <strong style={{ fontSize: '0.82rem', color: '#ffffff' }}>BIM Inspector (LOD 350)</strong>
              </div>
              <button
                onClick={() => setSelectedElement(null)}
                style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
              >
                <X size={16} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', fontSize: '0.74rem' }}>
              <div style={{ fontWeight: 800, color: '#22d3ee', fontSize: '0.82rem' }}>{selectedElement.name}</div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.04)', paddingBottom: '0.2rem' }}>
                <span style={{ color: '#94a3b8' }}>Component ID:</span>
                <span style={{ color: '#ffffff', fontWeight: 700 }}>{selectedElement.id}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.04)', paddingBottom: '0.2rem' }}>
                <span style={{ color: '#94a3b8' }}>Discipline:</span>
                <span style={{ color: '#ec4899', fontWeight: 700, textTransform: 'capitalize' }}>{selectedElement.discipline}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.04)', paddingBottom: '0.2rem' }}>
                <span style={{ color: '#94a3b8' }}>Material Spec:</span>
                <span style={{ color: '#ffffff' }}>{selectedElement.material}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.04)', paddingBottom: '0.2rem' }}>
                <span style={{ color: '#94a3b8' }}>Fire Rating:</span>
                <span style={{ color: '#ffffff' }}>{selectedElement.fireRating}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.04)', paddingBottom: '0.2rem' }}>
                <span style={{ color: '#94a3b8' }}>Volume / Qty:</span>
                <span style={{ color: '#22d3ee', fontWeight: 700 }}>{selectedElement.volume}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.04)', paddingBottom: '0.2rem' }}>
                <span style={{ color: '#94a3b8' }}>Est. Cost:</span>
                <span style={{ color: '#ffffff', fontWeight: 700 }}>{selectedElement.cost}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.2rem' }}>
                <span style={{ color: '#94a3b8' }}>QA/QC Status:</span>
                <span style={{ color: '#10b981', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                  <ShieldCheck size={13} /> {selectedElement.status}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* 2. Tour Mode Walkthrough Guide */}
        {viewMode === 'tour' && (
          <div style={{
            position: 'absolute',
            bottom: '1rem',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(9, 8, 26, 0.95)',
            border: '1.5px solid #10b981',
            borderRadius: '8px',
            padding: '0.85rem 1.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '1.25rem',
            zIndex: 30,
            boxShadow: '0 0 25px rgba(16, 185, 129, 0.3)'
          }}>
            <div>
              <div style={{ fontSize: '0.65rem', color: '#34d399', fontWeight: 800, textTransform: 'uppercase' }}>
                Waypoint {tourStep + 1} of {tourWaypoints.length}
              </div>
              <strong style={{ fontSize: '0.88rem', color: '#ffffff', display: 'block' }}>
                {tourWaypoints[tourStep].title}
              </strong>
              <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                {tourWaypoints[tourStep].desc}
              </span>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                onClick={() => {
                  const prev = (tourStep - 1 + tourWaypoints.length) % tourWaypoints.length;
                  setTourStep(prev);
                  setSelectedFloor(tourWaypoints[prev].floor);
                }}
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  color: '#ffffff',
                  padding: '0.4rem 0.75rem',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '0.75rem',
                  fontWeight: 700
                }}
              >
                Previous
              </button>
              <button
                onClick={() => {
                  const next = (tourStep + 1) % tourWaypoints.length;
                  setTourStep(next);
                  setSelectedFloor(tourWaypoints[next].floor);
                }}
                style={{
                  background: 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)',
                  border: 'none',
                  color: '#ffffff',
                  padding: '0.4rem 0.85rem',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '0.75rem',
                  fontWeight: 800
                }}
              >
                Next Waypoint â†’
              </button>
            </div>
          </div>
        )}

        {/* 3. AI Spatial Scan Results Card */}
        {aiScanResults && (
          <div style={{
            position: 'absolute',
            bottom: '1rem',
            left: '1rem',
            width: '320px',
            background: 'rgba(9, 8, 26, 0.94)',
            border: '1.5px solid #ec4899',
            borderRadius: '8px',
            padding: '1rem',
            zIndex: 30,
            boxShadow: '0 0 25px rgba(236, 72, 153, 0.35)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Sparkles size={16} color="#f43f5e" />
                <strong style={{ fontSize: '0.82rem', color: '#ffffff' }}>AI Spatial Model Audit</strong>
              </div>
              <button onClick={() => setAiScanResults(null)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                <X size={14} />
              </button>
            </div>
            <div style={{ fontSize: '0.72rem', display: 'flex', flexDirection: 'column', gap: '0.35rem', color: '#cbd5e1' }}>
              <div>â€¢ <strong>Clash Detection:</strong> <span style={{ color: '#10b981' }}>0 Hard Clashes Detected</span></div>
              <div>â€¢ <strong>Energy Modeling:</strong> <span style={{ color: '#22d3ee' }}>{aiScanResults.energyEfficiency}</span></div>
              <div>â€¢ <strong>Structural Checks:</strong> <span style={{ color: '#10b981' }}>{aiScanResults.structuralIntegrity}</span></div>
              <div>â€¢ <strong>AR Telemetry:</strong> <span style={{ color: '#f43f5e' }}>{aiScanResults.arTrackingConfidence} Tracking</span></div>
            </div>
          </div>
        )}

        {/* Bottom Left: Rotation Toggle & Telemetry */}
        <div style={{
          position: 'absolute',
          bottom: '1rem',
          left: viewMode === 'tour' || aiScanResults ? 'auto' : '1rem',
          right: viewMode === 'tour' || aiScanResults ? '1rem' : 'auto',
          display: 'flex',
          gap: '0.5rem',
          zIndex: 20
        }}>
          <button
            onClick={() => setIsAutoRotating(!isAutoRotating)}
            style={{
              background: 'rgba(9, 8, 26, 0.85)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              color: isAutoRotating ? '#22d3ee' : '#94a3b8',
              padding: '0.45rem 0.75rem',
              borderRadius: '6px',
              fontSize: '0.74rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              cursor: 'pointer'
            }}
          >
            <RefreshCw size={14} className={isAutoRotating ? 'animate-spin' : ''} />
            <span>{isAutoRotating ? 'Auto Orbit On' : 'Orbit Paused'}</span>
          </button>
        </div>

      </div>
    </div>
  );
}

export default ARVRBuildingViewer;
