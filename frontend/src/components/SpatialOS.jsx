import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, Box, Sphere, Html } from '@react-three/drei';
import { Layers, Globe, Activity, ShieldAlert, CheckCircle, ArrowLeft, Wifi, WifiOff, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import './SpatialOS.css';

const API_BASE = ''; // Vite proxy handles /api -> http://localhost:8000

// ------- 3D Scene Components ------- //

const GlobalView = ({ onSelectRegion }) => (
  <group>
    <Sphere args={[5, 64, 64]} onClick={(e) => { e.stopPropagation(); onSelectRegion(); }}>
      <meshStandardMaterial color="#1e3a8a" wireframe />
    </Sphere>
    {/* Orbit rings */}
    <mesh rotation={[Math.PI / 2, 0, 0]}>
      <torusGeometry args={[6.5, 0.05, 16, 100]} />
      <meshStandardMaterial color="#3b82f6" transparent opacity={0.4} />
    </mesh>
    <Html position={[0, 7, 0]} center>
      <div className="scene-label">ðŸŒ Global Network â€” Click Globe to Zoom In</div>
    </Html>
  </group>
);

// useMemo-stable city block positions
const CITY_BLOCKS = Array.from({ length: 12 }, (_, i) => ({
  id: i,
  x: (Math.sin(i * 1.7) * 7),
  z: (Math.cos(i * 1.3) * 7),
  h: Math.abs(Math.sin(i * 0.9)) * 3 + 1,
}));

const RegionalView = ({ onSelectFacility }) => (
  <group>
    <gridHelper args={[22, 22, '#334155', '#1e293b']} position={[0, -0.5, 0]} />
    {CITY_BLOCKS.map(b => (
      <Box key={b.id} args={[1.2, b.h, 1.2]} position={[b.x, b.h / 2 - 0.5, b.z]}>
        <meshStandardMaterial color="#475569" roughness={0.8} />
      </Box>
    ))}
    {/* Target facility â€” highlighted blue */}
    <Box args={[2.5, 5, 2.5]} position={[0, 2, 0]} onClick={(e) => { e.stopPropagation(); onSelectFacility(); }}>
      <meshStandardMaterial color="#3b82f6" emissive="#1d4ed8" emissiveIntensity={0.3} />
    </Box>
    <Html position={[0, 5.5, 0]} center>
      <div className="scene-label">ðŸ— Facility Alpha â€” Click to Inspect</div>
    </Html>
  </group>
);

const FacilityView = ({ sensorData }) => (
  <group>
    {/* Building shell */}
    <Box args={[4, 8, 4]} position={[0, 4, 0]}>
      <meshStandardMaterial color="#1e293b" transparent opacity={0.6} />
    </Box>
    {/* HVAC core */}
    <Box args={[1.5, 8.2, 1.5]} position={[0, 4, 0]}>
      <meshStandardMaterial color={sensorData?.hvac?.status === 'Optimal' ? '#10b981' : '#ef4444'} emissiveIntensity={0.5} emissive={sensorData?.hvac?.status === 'Optimal' ? '#10b981' : '#ef4444'} />
    </Box>
    <Html position={[3, 7, 0]} center>
      <div className="iot-popup">
        <div className="iot-row">ðŸŒ¡ HVAC: {sensorData?.hvac?.temp ?? '--'}Â°C â€” {sensorData?.hvac?.status ?? 'N/A'}</div>
        <div className="iot-row">âš¡ Load: {sensorData?.energy?.load ?? '--'} kW</div>
        <div className="iot-row">ðŸ”© Stress: {sensorData?.structural?.stress ?? '--'} MPa</div>
      </div>
    </Html>
  </group>
);

// ------- Connection Status Badge ------- //
const ConnectionBadge = ({ status }) => {
  if (status === 'connected') return (
    <div className="conn-badge connected"><Wifi size={12} /> Backend: Live</div>
  );
  if (status === 'offline') return (
    <div className="conn-badge offline"><WifiOff size={12} /> Backend: Offline (Mock)</div>
  );
  return <div className="conn-badge loading"><RefreshCw size={12} className="spin" /> Connecting...</div>;
};

// ------- Main Component ------- //
export default function SpatialOS() {
  const [scaleMode, setScaleMode] = useState('GLOBAL');
  const [apiData, setApiData] = useState(null);
  const [sensorData, setSensorData] = useState(null);
  const [scenarios, setScenarios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [connStatus, setConnStatus] = useState('loading');

  const endpointForMode = useCallback((mode) => {
    if (mode === 'GLOBAL') return '/api/spatial/global/baseline';
    if (mode === 'REGIONAL') return '/api/spatial/regional/baseline';
    if (mode === 'FACILITY') return '/api/spatial/facility/HVAC-MASTER-1';
    return '/api/spatial/global/baseline';
  }, []);

  const fetchBaseline = useCallback(async (mode) => {
    setLoading(true);
    setApiError(null);
    try {
      const res = await fetch(`${API_BASE}${endpointForMode(mode)}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setApiData(data);
      setConnStatus('connected');
      if (mode === 'FACILITY') setSensorData({
        hvac: { temp: data.hvac_temp ?? 22.4, status: data.hvac_status ?? 'Optimal' },
        energy: { load: data.energy_load ?? 450 },
        structural: { stress: data.structural_stress ?? 14.2 },
      });
    } catch (e) {
      setApiError(`Backend offline or error: ${e.message}`);
      setConnStatus('offline');
      // Graceful degradation: show mock data
      setApiData({ note: 'MOCKED_DATA â€” Backend not reachable', mode });
    } finally {
      setLoading(false);
    }
  }, [endpointForMode]);

  useEffect(() => {
    fetchBaseline(scaleMode);
  }, [scaleMode, fetchBaseline]);

  const simulateDisruption = async () => {
    setLoading(true);
    setApiError(null);
    try {
      const res = await fetch(`${API_BASE}/api/spatial/optimization/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ event_id: 'GLOBAL_SUPPLY_SHOCK', current_delay_days: 30, current_cost: 50000 }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setScenarios(data.options ?? []);
    } catch (e) {
      setApiError(`Simulation failed: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  const executeScenario = async (optionId, approved) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/spatial/governance/execute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ option_id: optionId, human_approved: approved }),
      });
      if (res.ok) {
        const result = await res.json();
        alert(`âœ… Execution Successful.\nOption: ${result.option_applied}\nGovernance: ${result.governance}`);
        setScenarios([]);
      } else {
        const err = await res.json();
        alert(`ðŸ”’ Governance Blocked:\n${err.detail}`);
      }
    } catch (e) {
      alert(`Error: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="spatial-os-container">
      <div className="spatial-header">
        <div className="header-left">
          <Link to="/" className="back-link"><ArrowLeft size={16} /> Back</Link>
          <div className="title">BuildSphere <span className="title-accent">Spatial OS</span></div>
        </div>
        <div className="scale-selector">
          {['GLOBAL', 'REGIONAL', 'FACILITY'].map(mode => (
            <button
              key={mode}
              className={scaleMode === mode ? 'active' : ''}
              onClick={() => setScaleMode(mode)}
            >
              {mode === 'GLOBAL' && <Globe size={14} />}
              {mode === 'REGIONAL' && <Layers size={14} />}
              {mode === 'FACILITY' && <Activity size={14} />}
              {mode.charAt(0) + mode.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
        <ConnectionBadge status={connStatus} />
      </div>

      <div className="spatial-canvas-wrapper">
        <Canvas camera={{ position: [0, 8, 18], fov: 45 }} shadows>
          <color attach="background" args={['#0a0f1e']} />
          <ambientLight intensity={0.4} />
          <directionalLight position={[10, 20, 10]} intensity={1.2} castShadow />
          <hemisphereLight intensity={0.6} groundColor="#0a0f1e" color="#38bdf8" /><directionalLight position={[-15, 20, -15]} intensity={0.5} />

          {scaleMode === 'GLOBAL' && <GlobalView onSelectRegion={() => setScaleMode('REGIONAL')} />}
          {scaleMode === 'REGIONAL' && <RegionalView onSelectFacility={() => setScaleMode('FACILITY')} />}
          {scaleMode === 'FACILITY' && <FacilityView sensorData={sensorData} />}

          <OrbitControls makeDefault autoRotate autoRotateSpeed={0.4} minPolarAngle={0.1} maxPolarAngle={Math.PI / 2.1} />
        </Canvas>

        {/* Data Overlay */}
        <div className="data-overlay">
          <h4>Digital Thread â€” <span style={{ color: '#38bdf8' }}>{scaleMode}</span></h4>
          {loading
            ? <div className="loading-dot">Loading<span className="dots" /></div>
            : apiError
            ? <div className="error-text">âš ï¸ {apiError}</div>
            : <pre>{JSON.stringify(apiData, null, 2)}</pre>
          }
        </div>

        {/* Action */}
        <div className="action-overlay">
          <button className="simulate-btn" onClick={simulateDisruption} disabled={loading}>
            <ShieldAlert size={16} />
            {loading ? 'Processing...' : 'Trigger AI Disruption Simulation'}
          </button>
        </div>

        {/* Governance Modal */}
        {scenarios.length > 0 && (
          <div className="governance-modal">
            <h3>ðŸ¤– AI Multi-Objective Recovery Scenarios</h3>
            <p style={{ color: '#94a3b8', marginTop: '0.25rem' }}>
              Select a strategy. All execution requires explicit human approval.
            </p>
            <div className="scenario-list">
              {scenarios.map(s => (
                <div key={s.id} className={`scenario-card ${s.id === 'BASELINE' ? 'baseline' : ''}`}>
                  <h4>{s.name}</h4>
                  <div className="scenario-stat">â± Saves: <strong>{s.time_saved} days</strong></div>
                  <div className="scenario-stat">ðŸ’° Cost Î”: <strong>${s.cost_delta.toLocaleString()}</strong></div>
                  <div className="scenario-stat">âš ï¸ Risk: <strong className={`risk-${s.risk.toLowerCase().replace(/[^a-z]/g, '-')}`}>{s.risk}</strong></div>
                  <div className="scenario-actions">
                    <button className="btn-approve" onClick={() => executeScenario(s.id, true)}>
                      <CheckCircle size={13} /> Approve
                    </button>
                    <button className="btn-reject" onClick={() => executeScenario(s.id, false)}>
                      <ShieldAlert size={13} /> Test Gov Block
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <button className="spatial-close-btn" onClick={() => setScenarios([])}>âœ• Cancel</button>
          </div>
        )}
      </div>
    </div>
  );
}
