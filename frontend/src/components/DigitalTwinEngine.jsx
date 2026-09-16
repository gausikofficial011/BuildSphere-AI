import React, { useState, useEffect } from 'react';
import { 
  Activity, Radio, ShieldCheck, AlertTriangle, RefreshCw, Layers, 
  Wifi, Sliders, CheckCircle2, Cpu, ArrowUpRight, BarChart3, Database
} from 'lucide-react';

export function DigitalTwinEngine() {
  const [showProviderModal, setShowProviderModal] = useState(false);
  const [activeProvider, setActiveProvider] = useState('Autodesk Tandem & APS API');
  const [wsConnected, setWsConnected] = useState(false);
  const [syncStatus, setSyncStatus] = useState(true);
  const [lastSynced, setLastSynced] = useState('Just now');
  const [selectedSensorFilter, setSelectedSensorFilter] = useState('All');
  const [editingSensor, setEditingSensor] = useState(null);
  const [showAddSensorModal, setShowAddSensorModal] = useState(false);

  // Real-time telemetry feed
  const [telemetrySensors, setTelemetrySensors] = useState([
    { id: 'IOT-TMP-01', type: 'Concrete Curing Temp', location: 'Level 4 Slab - Pour 2', physicalVal: '34.2 °C', revitVal: '35.0 °C', delta: '-0.8 °C', status: 'Normal', health: 98 },
    { id: 'IOT-STR-04', type: 'Structural Strain Gauge', location: 'Core Wall Structural Column C3', physicalVal: '142 µε', revitVal: '138 µε', delta: '+4 µε', status: 'Normal', health: 99 },
    { id: 'IOT-GPS-09', type: 'Tower Crane 2 Positioning', location: 'North Tower - Zone A', physicalVal: 'X: 142.4, Y: 88.1', revitVal: 'X: 142.5, Y: 88.0', delta: '0.14 m', status: 'Normal', health: 100 },
    { id: 'IOT-VIB-02', type: 'Vibrational Seismic Gauge', location: 'Substructure Retaining Wall W1', physicalVal: '1.2 mm/s', revitVal: '0.8 mm/s', delta: '+0.4 mm/s', status: 'Attention', health: 88 },
    { id: 'IOT-LID-12', type: 'LiDAR As-Built Pointcloud', location: 'Level 6 Structural Grid A-F', physicalVal: 'Tol: 2.4 mm', revitVal: 'BIM Baseline', delta: '2.4 mm', status: 'Normal', health: 97 }
  ]);

  // Fetch initial sensors from backend REST API
  useEffect(() => {
    fetch('/api/twin/sensors')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setTelemetrySensors(data);
        }
      })
      .catch(err => console.warn('Using local sensor store fallback:', err));
  }, []);

  // Connect to Live Backend WebSocket Stream
  useEffect(() => {
    let ws;
    try {
      const wsUrl = window.location.protocol === 'https:' ? `wss://${window.location.host}/api/twin/ws/iot-telemetry` : `ws://${window.location.hostname}:8000/api/twin/ws/iot-telemetry`;
      ws = new WebSocket(wsUrl);
      ws.onopen = () => setWsConnected(true);
      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.hvac && data.structural) {
            setTelemetrySensors(prev => prev.map(s => {
              if (s.id === 'IOT-TMP-01') return { ...s, physicalVal: `${data.hvac.temp} °C`, status: data.hvac.status };
              if (s.id === 'IOT-STR-04') return { ...s, physicalVal: `${data.structural.stress} µε`, status: data.structural.status };
              return s;
            }));
          }
        } catch (err) {
          console.error('WS Parse Error:', err);
        }
      };
      ws.onclose = () => setWsConnected(false);
    } catch (e) {
      console.warn('WebSocket fallback to simulated stream:', e);
    }
    return () => { if (ws) ws.close(); };
  }, []);

  const handleToggleSync = () => {
    setSyncStatus(!syncStatus);
    setLastSynced('Just now');
  };

  const handleRecalibrate = () => {
    setTelemetrySensors(prev => prev.map(s => ({
      ...s,
      health: 100,
      status: 'Normal',
      lastSynced: 'Just now'
    })));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', color: '#f8fafc', gap: '1.25rem' }}>
      
      {/* DIGITAL TWIN HEADER TOOLBAR */}
      <div style={{ backgroundColor: 'rgba(15, 23, 42, 0.8)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255, 255, 255, 0.1)', padding: '1rem 1.5rem', borderRadius: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 700, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Radio size={22} color="#34d399" /> Real-Time Digital Twin Telemetry Engine
          </h2>
          <p style={{ margin: '0.2rem 0 0 0', color: '#94a3b8', fontSize: '0.85rem' }}>
            Bi-directional telemetry sync between physical site IoT sensors and 3D Revit/Dynamo BIM models.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {/* Live Telemetry Status Pill */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.45rem 0.85rem', backgroundColor: syncStatus ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)', border: `1px solid ${syncStatus ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`, borderRadius: '9999px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: syncStatus ? '#34d399' : '#ef4444', display: 'inline-block' }}></span>
            <span style={{ fontSize: '0.775rem', fontWeight: 700, color: syncStatus ? '#34d399' : '#ef4444' }}>
              {syncStatus ? 'BI-DIRECTIONAL SYNC ACTIVE' : 'SYNC PAUSED'}
            </span>
          </div>

          <button 
            onClick={() => setShowProviderModal(true)}
            style={{ padding: '0.45rem 0.85rem', backgroundColor: '#4f46e5', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 600, cursor: 'pointer', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
          >
            <Cpu size={14} /> Connect API Provider ({activeProvider.split(' ')[0]})
          </button>

          <button 
            onClick={handleToggleSync}
            style={{ padding: '0.45rem 0.85rem', backgroundColor: syncStatus ? '#ef4444' : '#10b981', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 600, cursor: 'pointer', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
          >
            <RefreshCw size={14} /> {syncStatus ? 'Pause Sync' : 'Resume Telemetry Sync'}
          </button>

          <button 
            onClick={handleRecalibrate}
            style={{ padding: '0.45rem 0.85rem', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '10px', color: '#e2e8f0', cursor: 'pointer', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
          >
            <Sliders size={14} /> Recalibrate Sensors
          </button>
        </div>
      </div>

      {/* TOP TELEMETRY CARDS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
        
        <div style={{ backgroundColor: 'rgba(15, 23, 42, 0.7)', backdropFilter: 'blur(12px)', padding: '1.15rem 1.25rem', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.1)', boxShadow: '0 8px 20px rgba(0,0,0,0.3)' }}>
          <div style={{ color: '#94a3b8', fontSize: '0.775rem', marginBottom: '0.35rem', display: 'flex', justifyContent: 'space-between', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Active IoT Sensors <Wifi size={16} color="#34d399" />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 'bold', color: '#ffffff' }}>48 Nodes</div>
          <div style={{ fontSize: '0.725rem', color: '#34d399', display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.25rem' }}>
            <CheckCircle2 size={12} /> 100% Signal Strength
          </div>
        </div>

        <div style={{ backgroundColor: 'rgba(15, 23, 42, 0.7)', backdropFilter: 'blur(12px)', padding: '1.15rem 1.25rem', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.1)', boxShadow: '0 8px 20px rgba(0,0,0,0.3)' }}>
          <div style={{ color: '#94a3b8', fontSize: '0.775rem', marginBottom: '0.35rem', display: 'flex', justifyContent: 'space-between', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            As-Built vs BIM Delta <Activity size={16} color="#818cf8" />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 'bold', color: '#818cf8' }}>2.4 mm</div>
          <div style={{ fontSize: '0.725rem', color: '#818cf8', display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.25rem' }}>
            Within Tolerance (±5.0mm)
          </div>
        </div>

        <div style={{ backgroundColor: 'rgba(15, 23, 42, 0.7)', backdropFilter: 'blur(12px)', padding: '1.15rem 1.25rem', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.1)', boxShadow: '0 8px 20px rgba(0,0,0,0.3)' }}>
          <div style={{ color: '#94a3b8', fontSize: '0.775rem', marginBottom: '0.35rem', display: 'flex', justifyContent: 'space-between', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Concrete Curing Temp <BarChart3 size={16} color="#fbbf24" />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 'bold', color: '#fbbf24' }}>34.2 °C</div>
          <div style={{ fontSize: '0.725rem', color: '#fbbf24', display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.25rem' }}>
            Optimal Hydration Rate
          </div>
        </div>

        <div style={{ backgroundColor: 'rgba(15, 23, 42, 0.7)', backdropFilter: 'blur(12px)', padding: '1.15rem 1.25rem', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.1)', boxShadow: '0 8px 20px rgba(0,0,0,0.3)' }}>
          <div style={{ color: '#94a3b8', fontSize: '0.775rem', marginBottom: '0.35rem', display: 'flex', justifyContent: 'space-between', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Structural Health <ShieldCheck size={16} color="#34d399" />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 'bold', color: '#34d399' }}>99.2%</div>
          <div style={{ fontSize: '0.725rem', color: '#34d399', display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.25rem' }}>
            Zero Critical Strain Anomalies
          </div>
        </div>

      </div>

      {/* TELEMETRY DATA TABLE CONTAINER */}
      <div style={{ backgroundColor: 'rgba(15, 23, 42, 0.7)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '16px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '1rem' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.15rem', color: '#ffffff', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Database size={18} color="#34d399" /> Live As-Built vs As-Planned Sensor Telemetry Table
            </h3>
            <p style={{ margin: '0.2rem 0 0 0', color: '#94a3b8', fontSize: '0.85rem' }}>
              Comparing physical site sensor streams against digital Revit/Dynamo model baselines.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button 
              onClick={() => setShowAddSensorModal(true)}
              style={{ padding: '0.4rem 0.75rem', backgroundColor: '#10b981', color: '#ffffff', border: 'none', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
            >
              + Register Sensor Node
            </button>
            <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Filter Type:</span>
            <select 
              value={selectedSensorFilter} 
              onChange={e => setSelectedSensorFilter(e.target.value)}
              style={{ backgroundColor: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.15)', color: '#ffffff', padding: '0.4rem 0.75rem', borderRadius: '8px', fontSize: '0.8rem', outline: 'none' }}
            >
              <option value="All">All Sensors</option>
              <option value="Concrete Curing Temp">Concrete Curing</option>
              <option value="Structural Strain Gauge">Structural Strain</option>
              <option value="Tower Crane 2 Positioning">Equipment GPS</option>
              <option value="LiDAR As-Built Pointcloud">LiDAR Pointcloud</option>
            </select>
          </div>
        </div>

        {/* Telemetry Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)', color: '#94a3b8', fontSize: '0.725rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                <th style={{ padding: '0.75rem 1rem' }}>Sensor Node ID</th>
                <th style={{ padding: '0.75rem 1rem' }}>Telemetry Category</th>
                <th style={{ padding: '0.75rem 1rem' }}>Site Location</th>
                <th style={{ padding: '0.75rem 1rem' }}>Physical Site Stream</th>
                <th style={{ padding: '0.75rem 1rem' }}>Revit BIM Baseline</th>
                <th style={{ padding: '0.75rem 1rem' }}>Measured Delta</th>
                <th style={{ padding: '0.75rem 1rem' }}>Health Status</th>
                <th style={{ padding: '0.75rem 1rem' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {telemetrySensors
                .filter(s => selectedSensorFilter === 'All' || s.type === selectedSensorFilter)
                .map(s => (
                  <tr key={s.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                    <td style={{ padding: '0.75rem 1rem', fontWeight: 700, color: '#34d399' }}>{s.id}</td>
                    <td style={{ padding: '0.75rem 1rem', color: '#ffffff', fontWeight: 600 }}>{s.type}</td>
                    <td style={{ padding: '0.75rem 1rem', color: '#cbd5e1' }}>{s.location}</td>
                    <td style={{ padding: '0.75rem 1rem', fontWeight: 700, color: '#38bdf8' }}>{s.physicalVal}</td>
                    <td style={{ padding: '0.75rem 1rem', color: '#94a3b8' }}>{s.revitVal}</td>
                    <td style={{ padding: '0.75rem 1rem', fontWeight: 700, color: s.delta.includes('+') ? '#fbbf24' : '#34d399' }}>{s.delta}</td>
                    <td style={{ padding: '0.75rem 1rem' }}>
                      <span style={{ 
                        padding: '0.2rem 0.6rem', borderRadius: '9999px', fontSize: '0.675rem', fontWeight: 700, textTransform: 'uppercase',
                        backgroundColor: s.status === 'Normal' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                        color: s.status === 'Normal' ? '#34d399' : '#fbbf24',
                        border: `1px solid ${s.status === 'Normal' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(245, 158, 11, 0.3)'}`
                      }}>
                        {s.status} ({s.health}%)
                      </span>
                    </td>
                    <td style={{ padding: '0.75rem 1rem' }}>
                      <div style={{ display: 'flex', gap: '0.35rem' }}>
                        <button 
                          onClick={() => setEditingSensor({ ...s })}
                          style={{ padding: '0.25rem 0.55rem', backgroundColor: 'rgba(56, 189, 248, 0.2)', border: '1px solid rgba(56, 189, 248, 0.4)', borderRadius: '4px', color: '#38bdf8', fontSize: '0.725rem', cursor: 'pointer', fontWeight: 600 }}
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => {
                            setTelemetrySensors(prev => prev.filter(item => item.id !== s.id));
                            fetch(`/api/twin/sensors/${s.id}`, { method: 'DELETE' }).catch(err => console.warn(err));
                          }}
                          style={{ padding: '0.25rem 0.55rem', backgroundColor: 'rgba(239, 68, 68, 0.2)', border: '1px solid rgba(239, 68, 68, 0.4)', borderRadius: '4px', color: '#ef4444', fontSize: '0.725rem', cursor: 'pointer', fontWeight: 600 }}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

      </div>

      {/* EDIT SENSOR MODAL */}
      {editingSensor && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '1rem' }}>
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              setTelemetrySensors(prev => prev.map(s => s.id === editingSensor.id ? editingSensor : s));
              fetch(`/api/twin/sensors/${editingSensor.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editingSensor)
              }).catch(err => console.warn(err));
              setEditingSensor(null);
            }}
            style={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '16px', padding: '1.75rem', width: '100%', maxWidth: '500px', color: '#ffffff', display: 'flex', flexDirection: 'column', gap: '1rem' }}
          >
            <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 700, color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Sliders size={18} /> Edit & Recalibrate Sensor [{editingSensor.id}]
            </h3>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', color: '#cbd5e1', marginBottom: '0.35rem', fontWeight: 600 }}>Physical Site Stream Value</label>
              <input 
                type="text" 
                value={editingSensor.physicalVal} 
                onChange={e => setEditingSensor({ ...editingSensor, physicalVal: e.target.value })}
                style={{ width: '100%', padding: '0.55rem', backgroundColor: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', color: '#ffffff', fontSize: '0.85rem', outline: 'none' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', color: '#cbd5e1', marginBottom: '0.35rem', fontWeight: 600 }}>Revit BIM Baseline Target</label>
              <input 
                type="text" 
                value={editingSensor.revitVal} 
                onChange={e => setEditingSensor({ ...editingSensor, revitVal: e.target.value })}
                style={{ width: '100%', padding: '0.55rem', backgroundColor: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', color: '#ffffff', fontSize: '0.85rem', outline: 'none' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', color: '#cbd5e1', marginBottom: '0.35rem', fontWeight: 600 }}>Measured Delta / Tolerance</label>
              <input 
                type="text" 
                value={editingSensor.delta} 
                onChange={e => setEditingSensor({ ...editingSensor, delta: e.target.value })}
                style={{ width: '100%', padding: '0.55rem', backgroundColor: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', color: '#ffffff', fontSize: '0.85rem', outline: 'none' }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
              <button 
                type="button" 
                onClick={() => setEditingSensor(null)}
                style={{ padding: '0.5rem 1rem', backgroundColor: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '8px', color: '#ffffff', cursor: 'pointer', fontWeight: 600 }}
              >
                Cancel
              </button>
              <button 
                type="submit"
                style={{ padding: '0.5rem 1.25rem', backgroundColor: '#38bdf8', border: 'none', borderRadius: '8px', color: '#090d16', cursor: 'pointer', fontWeight: 700 }}
              >
                Recalibrate & Save
              </button>
            </div>
          </form>
        </div>
      )}

      {/* REGISTER NEW SENSOR MODAL */}
      {showAddSensorModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '1rem' }}>
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              const form = e.target;
              const newSensor = {
                id: `IOT-SNS-${Math.floor(10 + Math.random() * 90)}`,
                type: form.type.value,
                location: form.location.value,
                physicalVal: form.physicalVal.value,
                revitVal: form.revitVal.value,
                delta: form.delta.value,
                status: 'Normal',
                health: 100
              };
              setTelemetrySensors([newSensor, ...telemetrySensors]);
              fetch('/api/twin/sensors', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newSensor)
              }).catch(err => console.warn(err));
              setShowAddSensorModal(false);
            }}
            style={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '16px', padding: '1.75rem', width: '100%', maxWidth: '500px', color: '#ffffff', display: 'flex', flexDirection: 'column', gap: '1rem' }}
          >
            <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 700, color: '#34d399', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Wifi size={18} /> Register New IoT Site Sensor Node
            </h3>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', color: '#cbd5e1', marginBottom: '0.35rem', fontWeight: 600 }}>Telemetry Category</label>
              <input name="type" type="text" required defaultValue="Concrete Curing Temp" style={{ width: '100%', padding: '0.55rem', backgroundColor: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', color: '#ffffff', fontSize: '0.85rem', outline: 'none' }} />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', color: '#cbd5e1', marginBottom: '0.35rem', fontWeight: 600 }}>Site Location</label>
              <input name="location" type="text" required defaultValue="Level 5 Slab - Pour 1" style={{ width: '100%', padding: '0.55rem', backgroundColor: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', color: '#ffffff', fontSize: '0.85rem', outline: 'none' }} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.7rem', color: '#cbd5e1', marginBottom: '0.25rem' }}>Physical Val</label>
                <input name="physicalVal" type="text" required defaultValue="32.0 °C" style={{ width: '100%', padding: '0.45rem', backgroundColor: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '6px', color: '#ffffff', fontSize: '0.8rem', outline: 'none' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.7rem', color: '#cbd5e1', marginBottom: '0.25rem' }}>Revit Target</label>
                <input name="revitVal" type="text" required defaultValue="32.5 °C" style={{ width: '100%', padding: '0.45rem', backgroundColor: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '6px', color: '#ffffff', fontSize: '0.8rem', outline: 'none' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.7rem', color: '#cbd5e1', marginBottom: '0.25rem' }}>Delta</label>
                <input name="delta" type="text" required defaultValue="-0.5 °C" style={{ width: '100%', padding: '0.45rem', backgroundColor: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '6px', color: '#ffffff', fontSize: '0.8rem', outline: 'none' }} />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
              <button 
                type="button" 
                onClick={() => setShowAddSensorModal(false)}
                style={{ padding: '0.5rem 1rem', backgroundColor: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '8px', color: '#ffffff', cursor: 'pointer', fontWeight: 600 }}
              >
                Cancel
              </button>
              <button 
                type="submit"
                style={{ padding: '0.5rem 1.25rem', backgroundColor: '#10b981', border: 'none', borderRadius: '8px', color: '#ffffff', cursor: 'pointer', fontWeight: 700 }}
              >
                Register Sensor Node
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}
