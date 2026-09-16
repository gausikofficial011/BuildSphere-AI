import React, { useState, useEffect, useCallback } from 'react';
import { Unity, useUnityContext } from 'react-unity-webgl';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Box, Sky, ContactShadows, Html } from '@react-three/drei';
import { Box as BoxIcon, X, Maximize2, Minimize2, Layers, Compass, Sun, Eye, Activity, Wifi, AlertTriangle, Hammer, Hexagon, Zap, Thermometer, Users, RotateCcw } from 'lucide-react';
import unityService, { UnityActionTypes, VisualizationModes } from '../services/unityIntegrationService';
import './Global3DViewer.css';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    console.error("ThreeJS Error:", error, errorInfo);
    this.setState({ errorInfo });
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '2rem', color: '#f8fafc', backgroundColor: '#ef4444', height: '100%' }}>
          <h2>Something went wrong in 3D Viewer.</h2>
          <details style={{ whiteSpace: 'pre-wrap' }}>
            {this.state.error && this.state.error.toString()}
            <br />
            {this.state.errorInfo && this.state.errorInfo.componentStack}
          </details>
        </div>
      );
    }
    return this.props.children;
  }
}

const DigitalTwinSensors = ({ showTwin, sensors }) => {
  if (!showTwin || !sensors) return null;

  return (
    <>
      <Html position={[-0.8, 5.5, -0.8]} center zIndexRange={[100, 0]}>
        <div className="iot-card hvac">
          <div className="iot-header"><Activity size={12}/> HVAC Node</div>
          <div className="iot-val">{sensors.hvac.temp}°C</div>
          <div className="iot-status">{sensors.hvac.status}</div>
        </div>
      </Html>
      <Html position={[0.8, 3.5, 0.8]} center zIndexRange={[100, 0]}>
        <div className="iot-card structural">
          <div className="iot-header"><Wifi size={12}/> Structural</div>
          <div className="iot-val">{sensors.structural.stress} MPa</div>
          <div className="iot-status">{sensors.structural.status}</div>
        </div>
      </Html>
      <Html position={[0, 1.5, 0]} center zIndexRange={[100, 0]}>
        <div className="iot-card energy">
          <div className="iot-header"><Activity size={12}/> Energy Load</div>
          <div className="iot-val">{sensors.energy.load} kW</div>
          <div className="iot-status">{sensors.energy.status}</div>
        </div>
      </Html>
    </>
  );
};

const TOOLS = {
  concrete: { color: '#94a3b8', label: 'Concrete Foundation', args: [2, 0.5, 2] },
  steel: { color: '#475569', label: 'Steel Column', args: [0.5, 3, 0.5] },
  brick: { color: '#b91c1c', label: 'Brick Wall', args: [2, 2, 0.2] },
  glass: { color: '#bae6fd', label: 'Glass Panel', args: [2, 2, 0.1], transparent: true, opacity: 0.5 },
};

const CustomBlocks = ({ blocks, onMeshClick }) => {
  return (
    <group>
      {blocks.map((block, i) => (
        <Box 
          key={i} 
          position={block.position} 
          args={block.args} 
          castShadow 
          receiveShadow
          onClick={(e) => {
            e.stopPropagation();
            if (onMeshClick) onMeshClick(e, 'Custom ' + block.type);
          }}
        >
          <meshStandardMaterial 
            color={block.color} 
            transparent={block.transparent || false} 
            opacity={block.opacity || 1} 
            roughness={0.8}
          />
        </Box>
      ))}
    </group>
  );
};

const Building = ({ showStructure, showMEP, showTwin, sensors, onMeshClick, buildMode }) => {
  const stress = sensors?.structural?.stress || 0;
  const isHighStress = stress > 15;
  const hasAnomaly = sensors?.ai_forecast?.anomaly_detected;
  
  const coreColor = (showTwin && (isHighStress || hasAnomaly)) ? "#ef4444" : (showStructure ? "#f59e0b" : "#3b82f6");

  return (
    <group position={[0, -1.5, 0]}>
      {/* Base */}
      <Box args={[4, 1, 4]} position={[0, 0.5, 0]} castShadow receiveShadow onClick={(e) => { e.stopPropagation(); onMeshClick(e, 'Foundation Pad'); }}>
        <meshStandardMaterial color="#cbd5e1" />
      </Box>
      
      {/* Core Structure */}
      <Box args={[1.5, 6, 1.5]} position={[-0.8, 4, -0.8]} castShadow receiveShadow onClick={(e) => { e.stopPropagation(); onMeshClick(e, 'Primary Core Structure'); }}>
        <meshStandardMaterial color={coreColor} roughness={0.1} metalness={0.8} transparent opacity={showStructure ? 0.7 : 1} />
      </Box>
      
      {/* Secondary Tower */}
      <Box args={[1.2, 4, 1.2]} position={[0.8, 3, 0.8]} castShadow receiveShadow onClick={(e) => { e.stopPropagation(); onMeshClick(e, 'Secondary Tower'); }}>
        <meshStandardMaterial color={showStructure ? "#10b981" : "#0ea5e9"} roughness={0.2} metalness={0.6} transparent opacity={showStructure ? 0.7 : 1} />
      </Box>

      {/* MEP Ducts */}
      {showMEP && (
        <group>
          <Box args={[0.2, 6.2, 0.2]} position={[-0.2, 4.1, -0.2]} onClick={(e) => { e.stopPropagation(); onMeshClick(e, 'HVAC Main Duct A'); }}>
            <meshStandardMaterial color="#ef4444" metalness={0.9} roughness={0.1} />
          </Box>
          <Box args={[0.2, 4.2, 0.2]} position={[0.2, 3.1, 0.2]} onClick={(e) => { e.stopPropagation(); onMeshClick(e, 'HVAC Secondary Duct B'); }}>
            <meshStandardMaterial color="#ef4444" metalness={0.9} roughness={0.1} />
          </Box>
        </group>
      )}

      {/* Digital Twin Sensors Overlay */}
      <DigitalTwinSensors showTwin={showTwin} sensors={sensors} />

      {/* Ground/Plaza */}
      <Box args={[8, 0.2, 8]} position={[0, -0.1, 0]} receiveShadow onClick={(e) => { e.stopPropagation(); onMeshClick(e, 'Plaza Ground Level'); }}>
        <meshStandardMaterial color="#94a3b8" />
      </Box>
    </group>
  );
};

export const ViewerContent = ({ isEmbedded = false }) => {
  const [showStructure, setShowStructure] = useState(false);
  const [showMEP, setShowMEP] = useState(false);
  const [showTwin, setShowTwin] = useState(false);
  const [buildMode, setBuildMode] = useState(false);
  const [activeTool, setActiveTool] = useState('concrete');
  const [customBlocks, setCustomBlocks] = useState([]);
  const [unityMode, setUnityMode] = useState(false);
  const [activeUnityMode, setActiveUnityMode] = useState('Normal');
  const [selectedFloor, setSelectedFloor] = useState(0);

  const [sensors, setSensors] = useState({
    hvac: { temp: 22.4, status: 'Optimal' },
    structural: { stress: 14.2, status: 'Normal' },
    energy: { load: 450, status: 'High' },
    ai_forecast: { anomaly_detected: false, message: "" }
  });
  const [alertMsg, setAlertMsg] = useState("");

  const { unityProvider, sendMessage, isLoaded, loadingProgression } = useUnityContext({
    loaderUrl: "/unity-build/Build.loader.js",
    dataUrl: "/unity-build/Build.data",
    frameworkUrl: "/unity-build/Build.framework.js",
    codeUrl: "/unity-build/Build.wasm",
  });

  // Setup bidirectional WebGL event handler on window
  useEffect(() => {
    window.dispatchReactUnityEvent = (eventName, payloadJson) => {
      console.log(`[React <- Unity] ${eventName}:`, payloadJson);
      try {
        const payload = JSON.parse(payloadJson);
        if (eventName === 'ON_ROOM_SELECTED') {
          setAlertMsg(`Unity 3D Selected: ${payload.name || payload.id}`);
          setTimeout(() => setAlertMsg(""), 4000);
        }
        unityService.handleUnityEvent(eventName, payload);
      } catch (err) {
        console.warn("Could not parse Unity payload as JSON", payloadJson);
      }
    };

    return () => {
      window.dispatchReactUnityEvent = null;
    };
  }, []);

  // Sync telemetry to Unity
  useEffect(() => {
    if (isLoaded && showTwin) {
      const payload = {
        hvacTemp: sensors.hvac.temp,
        hvacStatus: sensors.hvac.status,
        structuralStress: sensors.structural.stress,
        structuralStatus: sensors.structural.status,
        energyLoad: sensors.energy.load,
        energyStatus: sensors.energy.status,
        aiAnomalyDetected: sensors.ai_forecast.anomaly_detected,
        aiMessage: sensors.ai_forecast.message
      };
      try {
        sendMessage("BuildSphereBridge", "ExecuteAICommandFromWeb", JSON.stringify(payload));
      } catch (e) {
        console.log("Unity bridge sync waiting for scene start...");
      }
    }
  }, [sensors, isLoaded, showTwin, sendMessage]);

  useEffect(() => {
    if (!showTwin) return;
    
    // Connect to actual WebSocket backend for live telemetry
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const ws = new WebSocket(`${protocol}//${window.location.host}/api/twin/ws/iot-telemetry`);
    
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setSensors(data);
      } catch (err) {
        console.error("Error parsing websocket message", err);
      }
    };
    
    ws.onclose = () => console.log("WebSocket disconnected");

    return () => ws.close();
  }, [showTwin]);

  const handleUnityFloorSelect = (floorNum) => {
    setSelectedFloor(floorNum);
    if (isLoaded) {
      if (floorNum === 0) {
        sendMessage("BuildSphereBridge", "ExecuteAICommandFromWeb", "show all floors");
      } else {
        sendMessage("BuildSphereBridge", "ExecuteAICommandFromWeb", `show me floor ${floorNum}`);
      }
    }
  };

  const handleUnityModeChange = (mode) => {
    setActiveUnityMode(mode);
    if (isLoaded) {
      sendMessage("BuildSphereBridge", "SetVisualizationModeFromWeb", mode);
    }
  };

  const handleMeshClick = (e, part) => {
    if (buildMode) {
      const toolDef = TOOLS[activeTool];
      const normal = e.face ? e.face.normal : {x:0, y:1, z:0};
      const snap = (val) => Math.round(val * 2) / 2;
      
      let offsetX = normal.x > 0 ? (toolDef.args[0] / 2) : (normal.x < 0 ? -(toolDef.args[0] / 2) : 0);
      let offsetY = normal.y > 0 ? (toolDef.args[1] / 2) : (normal.y < 0 ? -(toolDef.args[1] / 2) : 0);
      let offsetZ = normal.z > 0 ? (toolDef.args[2] / 2) : (normal.z < 0 ? -(toolDef.args[2] / 2) : 0);

      const newPos = [
        snap(e.point.x + offsetX),
        Math.max(0, e.point.y + offsetY),
        snap(e.point.z + offsetZ)
      ];

      setCustomBlocks(prev => [...prev, {
        position: newPos,
        type: activeTool,
        args: toolDef.args,
        color: toolDef.color,
        transparent: toolDef.transparent,
        opacity: toolDef.opacity
      }]);
    } else {
      setAlertMsg(`Interactive Control: ${part} selected.`);
      setTimeout(() => setAlertMsg(""), 3000);
    }
  };

  return (
    <div className="viewer-content" style={isEmbedded ? { height: '100%', borderRadius: '12px', border: '1px solid #334155', position: 'relative' } : { position: 'relative' }}>
      
      {/* Interaction Alert Overlay */}
      {alertMsg && (
        <div style={{ position: 'absolute', top: 20, left: '50%', transform: 'translateX(-50%)', background: '#3b82f6', color: 'white', padding: '8px 16px', borderRadius: '8px', zIndex: 100, fontWeight: 'bold', boxShadow: '0 4px 12px rgba(0,0,0,0.5)' }}>
          {alertMsg}
        </div>
      )}

      {/* AI Predictive Alert Overlay */}
      {showTwin && sensors?.ai_forecast?.anomaly_detected && (
        <div style={{ position: 'absolute', top: alertMsg ? 70 : 20, left: '50%', transform: 'translateX(-50%)', background: '#ef4444', color: 'white', padding: '12px 24px', borderRadius: '8px', zIndex: 100, fontWeight: 'bold', boxShadow: '0 4px 12px rgba(239,68,68,0.5)', display: 'flex', alignItems: 'center', gap: '0.5rem', animation: 'pulse 1s infinite' }}>
          <AlertTriangle size={20} />
          {sensors.ai_forecast.message}
        </div>
      )}
      
      <div className="viewer-toolbar">
        <button 
          className={`toolbar-btn ${showStructure ? 'active' : ''}`}
          onClick={() => setShowStructure(!showStructure)}
          title="Toggle Structure View"
        >
          <Layers size={16} />
          <span>Structure</span>
        </button>
        <button 
          className={`toolbar-btn ${showMEP ? 'active' : ''}`}
          onClick={() => setShowMEP(!showMEP)}
          title="Toggle MEP View"
        >
          <Compass size={16} />
          <span>MEP</span>
        </button>
        <button 
          className={`toolbar-btn ${showTwin ? 'active' : ''}`}
          onClick={() => setShowTwin(!showTwin)}
          title="Toggle Digital Twin Sensors"
        >
          <Wifi size={16} />
          <span>Digital Twin</span>
        </button>
        <div className="toolbar-divider"></div>
        <button 
          className={`toolbar-btn ${buildMode ? 'active' : ''}`}
          style={buildMode ? { backgroundColor: '#10b981', color: 'white' } : {}}
          onClick={() => setBuildMode(!buildMode)}
          title="Toggle Build Mode"
        >
          <Hammer size={16} />
          <span>Build Mode</span>
        </button>
        <div className="toolbar-divider"></div>
        <button 
          className={`toolbar-btn ${unityMode ? 'active' : ''}`}
          onClick={() => setUnityMode(!unityMode)}
          title="Switch to Unity Graphics Engine"
          style={unityMode ? { backgroundColor: '#8b5cf6', color: 'white' } : { color: '#8b5cf6' }}
        >
          <BoxIcon size={16} />
          <span>Unity Engine</span>
        </button>

        {unityMode && (
          <>
            <div className="toolbar-divider"></div>
            <button 
              className={`toolbar-btn ${activeUnityMode === 'Energy' ? 'active' : ''}`}
              onClick={() => handleUnityModeChange('Energy')}
              title="Energy Heatmap Mode"
            >
              <Zap size={14} />
              <span>Energy</span>
            </button>
            <button 
              className={`toolbar-btn ${activeUnityMode === 'Occupancy' ? 'active' : ''}`}
              onClick={() => handleUnityModeChange('Occupancy')}
              title="Occupancy Mode"
            >
              <Users size={14} />
              <span>Occupancy</span>
            </button>
            <button 
              className={`toolbar-btn ${activeUnityMode === 'Temperature' ? 'active' : ''}`}
              onClick={() => handleUnityModeChange('Temperature')}
              title="Temperature Mode"
            >
              <Thermometer size={14} />
              <span>Temp</span>
            </button>
            <button 
              className="toolbar-btn"
              onClick={() => {
                if (isLoaded) sendMessage("BuildSphereBridge", "ExecuteAICommandFromWeb", "reset model");
              }}
              title="Reset 3D Model & Camera"
            >
              <RotateCcw size={14} />
            </button>
          </>
        )}
      </div>

      {/* Unity Floor Switcher Floating Bar */}
      {unityMode && (
        <div style={{ position: 'absolute', bottom: 20, left: '50%', transform: 'translateX(-50%)', background: 'rgba(15, 23, 42, 0.9)', padding: '6px 12px', borderRadius: '24px', zIndex: 100, border: '1px solid #6366f1', display: 'flex', gap: '8px', backdropFilter: 'blur(8px)' }}>
          <button onClick={() => handleUnityFloorSelect(0)} style={{ background: selectedFloor === 0 ? '#6366f1' : '#1e293b', color: 'white', border: 'none', padding: '4px 10px', borderRadius: '16px', fontSize: '11px', cursor: 'pointer' }}>All Floors</button>
          <button onClick={() => handleUnityFloorSelect(1)} style={{ background: selectedFloor === 1 ? '#6366f1' : '#1e293b', color: 'white', border: 'none', padding: '4px 10px', borderRadius: '16px', fontSize: '11px', cursor: 'pointer' }}>Floor 1</button>
          <button onClick={() => handleUnityFloorSelect(2)} style={{ background: selectedFloor === 2 ? '#6366f1' : '#1e293b', color: 'white', border: 'none', padding: '4px 10px', borderRadius: '16px', fontSize: '11px', cursor: 'pointer' }}>Floor 2</button>
          <button onClick={() => handleUnityFloorSelect(3)} style={{ background: selectedFloor === 3 ? '#6366f1' : '#1e293b', color: 'white', border: 'none', padding: '4px 10px', borderRadius: '16px', fontSize: '11px', cursor: 'pointer' }}>Floor 3</button>
          <button onClick={() => { if (isLoaded) sendMessage("BuildSphereBridge", "ExecuteAICommandFromWeb", "explode building"); }} style={{ background: '#334155', color: '#38bdf8', border: 'none', padding: '4px 10px', borderRadius: '16px', fontSize: '11px', cursor: 'pointer' }}>💥 Explode</button>
        </div>
      )}

      {buildMode && (
        <div style={{ position: 'absolute', top: 60, right: 20, background: 'rgba(15, 23, 42, 0.9)', padding: '12px', borderRadius: '8px', zIndex: 100, border: '1px solid #3b82f6', color: 'white', display: 'flex', flexDirection: 'column', gap: '8px', backdropFilter: 'blur(4px)' }}>
          <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#94a3b8', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Hexagon size={12}/> CONSTRUCTION TOOLS
          </div>
          {Object.entries(TOOLS).map(([key, tool]) => (
            <button
              key={key}
              onClick={() => setActiveTool(key)}
              style={{
                display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px',
                background: activeTool === key ? '#3b82f6' : '#1e293b',
                border: 'none', borderRadius: '6px', color: 'white', cursor: 'pointer',
                textAlign: 'left', fontSize: '12px', transition: 'all 0.2s'
              }}
            >
              <div style={{ width: '12px', height: '12px', backgroundColor: tool.color, borderRadius: '2px', border: '1px solid rgba(255,255,255,0.2)' }}></div>
              {tool.label}
            </button>
          ))}
          <div style={{ marginTop: '8px', fontSize: '10px', color: '#cbd5e1', fontStyle: 'italic', maxWidth: '140px' }}>
            Click on any surface in the 3D view to place this material.
          </div>
        </div>
      )}

      <div className="canvas-container">
        {unityMode ? (
          <div style={{ width: '100%', height: '100%', position: 'relative', backgroundColor: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {!isLoaded && (
              <div style={{ position: 'absolute', color: 'white', textAlign: 'center' }}>
                <p>Loading Unity Engine... {Math.round(loadingProgression * 100)}%</p>
                <p style={{ fontSize: '0.8rem', color: '#94a3b8', maxWidth: '300px', marginTop: '1rem' }}>
                  Ensure you have placed your Unity WebGL build inside <code>frontend/public/unity-build/</code>.
                </p>
              </div>
            )}
            <Unity unityProvider={unityProvider} style={{ width: '100%', height: '100%', visibility: isLoaded ? 'visible' : 'hidden' }} />
          </div>
        ) : (
          <ErrorBoundary>
            <Canvas shadows camera={{ position: [5, 5, 8], fov: 50 }}>
              <ambientLight intensity={0.5} />
              <directionalLight castShadow position={[5, 10, 5]} intensity={1.5} shadow-mapSize={[1024, 1024]} />
              <Sky sunPosition={[5, 10, 5]} />
              <Building showStructure={showStructure} showMEP={showMEP} showTwin={showTwin} sensors={sensors} onMeshClick={handleMeshClick} buildMode={buildMode} />
              <CustomBlocks blocks={customBlocks} onMeshClick={handleMeshClick} />
              {buildMode && <gridHelper args={[20, 20, '#334155', '#1e293b']} position={[0, -1.6, 0]} />}
              <ContactShadows position={[0, -1.6, 0]} opacity={0.4} scale={20} blur={2} far={4} />
              <OrbitControls makeDefault minPolarAngle={0} maxPolarAngle={Math.PI / 2 + 0.1} />
            </Canvas>
          </ErrorBoundary>
        )}
      </div>
    </div>
  );
};

export default function Global3DViewer() {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  if (!isOpen) {
    return (
      <button 
        className="floating-3d-btn"
        onClick={() => setIsOpen(true)}
        title="Open 3D Building Model"
      >
        <BoxIcon size={24} />
      </button>
    );
  }

  return (
    <div className={`global-3d-viewer-container ${isExpanded ? 'expanded' : ''}`}>
      <div className="viewer-header">
        <div className="viewer-title">
          <BoxIcon size={18} />
          <span>3D BIM & Digital Twin Viewer</span>
        </div>
        <div className="viewer-actions">
          <button onClick={() => setIsExpanded(!isExpanded)} title={isExpanded ? "Minimize" : "Maximize"}>
            {isExpanded ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
          </button>
          <button onClick={() => setIsOpen(false)} title="Close">
            <X size={18} />
          </button>
        </div>
      </div>
      <ViewerContent />
    </div>
  );
}
