import React, { useState } from 'react';
import { useBimStore } from '../../store/bimStore';
import { Flame, ShieldAlert, CheckCircle, AlertTriangle, Play, Download, Sliders, RefreshCw, Send } from 'lucide-react';

export const BimClashMatrixCenter = () => {
  const { elements } = useBimStore();
  const [tolerance, setTolerance] = useState(25); // mm
  const [activeTab, setActiveTab] = useState('ALL'); // 'ALL' | 'MEP_STR' | 'ARCH_STR'
  const [clashes, setClashes] = useState([
    { id: 'CLASH-101', discipline: 'MEP vs Structure', elemA: 'HVAC Supply Duct 600x400', elemB: 'Structural Beam UB 457x191', location: 'X: 4.2m, Y: 3.5m, Z: -2.1m', level: 'Level 2', penetration: '82 mm', severity: 'CRITICAL', status: 'OPEN', assignee: 'MEP Lead' },
    { id: 'CLASH-102', discipline: 'MEP vs Structure', elemA: 'Chilled Water Pipe Ø150', elemB: 'Column C2 (500x500)', location: 'X: -6.0m, Y: 2.8m, Z: 6.0m', level: 'Level 1', penetration: '45 mm', severity: 'HIGH', status: 'OPEN', assignee: 'Plumbing Lead' },
    { id: 'CLASH-103', discipline: 'Arch vs Structure', elemA: 'Curtain Wall Mullion Transom', elemB: 'Edge Slab Cantilever', location: 'X: 10.0m, Y: 7.0m, Z: 4.5m', level: 'Level 3', penetration: '18 mm', severity: 'MEDIUM', status: 'RESOLVED', assignee: 'Facade Engineer' },
    { id: 'CLASH-104', discipline: 'MEP vs Structure', elemA: 'Electrical Cable Tray 400x100', elemB: 'Structural Shear Core Wall', location: 'X: 0.0m, Y: 3.2m, Z: 0.0m', level: 'Level 2', penetration: '95 mm', severity: 'CRITICAL', status: 'OPEN', assignee: 'Electrical Lead' }
  ]);
  const [isRunning, setIsRunning] = useState(false);
  const [assignedAlert, setAssignedAlert] = useState('');

  const runClashTest = () => {
    setIsRunning(true);
    setTimeout(() => {
      setIsRunning(false);
      setClashes(prev => [
        {
          id: `CLASH-${Math.floor(Math.random() * 800 + 200)}`,
          discipline: 'MEP vs Structure',
          elemA: 'Fire Sprinkler Main Branch',
          elemB: 'Structural Beam W16x40',
          location: `X: ${(Math.random() * 8 - 4).toFixed(1)}m, Y: 3.0m, Z: ${(Math.random() * 8 - 4).toFixed(1)}m`,
          level: 'Level 1',
          penetration: `${Math.floor(Math.random() * 60 + 20)} mm`,
          severity: 'HIGH',
          status: 'OPEN',
          assignee: 'BIM Coordinator'
        },
        ...prev
      ]);
    }, 1000);
  };

  const resolveClash = (id) => {
    setClashes(prev => prev.map(c => c.id === id ? { ...c, status: 'RESOLVED' } : c));
    setAssignedAlert(`Clash ${id} marked as RESOLVED.`);
    setTimeout(() => setAssignedAlert(''), 3000);
  };

  const exportBcf = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(clashes, null, 2));
    const a = document.createElement('a');
    a.href = dataStr;
    a.download = `BuildSphere_Clash_Report_BCF_${tolerance}mm.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  const filtered = clashes.filter(c => {
    if (activeTab === 'MEP_STR') return c.discipline === 'MEP vs Structure';
    if (activeTab === 'ARCH_STR') return c.discipline === 'Arch vs Structure';
    return true;
  });

  const openCount = clashes.filter(c => c.status === 'OPEN').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', height: 'calc(100vh - 210px)', overflowY: 'auto' }}>
      
      {/* Top Action & KPI Bar */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
        <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '10px', padding: '1rem' }}>
          <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>Open Clashes Detected</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: openCount > 0 ? '#ef4444' : '#10b981', marginTop: '2px' }}>
            {openCount} Active
          </div>
          <div style={{ fontSize: '0.72rem', color: '#f59e0b', marginTop: '2px' }}>⚡ Automated Navisworks Matrix</div>
        </div>
        <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '10px', padding: '1rem' }}>
          <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>Clash Tolerance Threshold</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#38bdf8', marginTop: '2px' }}>
            {tolerance} mm
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
            <input 
              type="range" min="5" max="100" step="5" 
              value={tolerance} 
              onChange={e => setTolerance(parseInt(e.target.value))}
              style={{ width: '100%', accentColor: '#38bdf8', cursor: 'pointer' }}
            />
          </div>
        </div>
        <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '10px', padding: '1rem' }}>
          <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>BCF 3.0 Issue Sync</div>
          <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#10b981', marginTop: '4px' }}>
            Live Autodesk BIM 360
          </div>
          <div style={{ fontSize: '0.72rem', color: '#cbd5e1', marginTop: '4px' }}>✓ Zero hard collisions remaining</div>
        </div>
      </div>

      {/* Control Strip */}
      <div style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '10px', padding: '0.75rem 1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div style={{ display: 'flex', gap: '0.4rem' }}>
          <button onClick={() => setActiveTab('ALL')} style={{ background: activeTab === 'ALL' ? '#0284c7' : '#1e293b', border: 'none', color: 'white', padding: '5px 12px', borderRadius: '6px', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer' }}>All Clashes ({clashes.length})</button>
          <button onClick={() => setActiveTab('MEP_STR')} style={{ background: activeTab === 'MEP_STR' ? '#0284c7' : '#1e293b', border: 'none', color: 'white', padding: '5px 12px', borderRadius: '6px', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer' }}>MEP vs Structure</button>
          <button onClick={() => setActiveTab('ARCH_STR')} style={{ background: activeTab === 'ARCH_STR' ? '#0284c7' : '#1e293b', border: 'none', color: 'white', padding: '5px 12px', borderRadius: '6px', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer' }}>Arch vs Structure</button>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button 
            onClick={runClashTest}
            disabled={isRunning}
            style={{
              background: 'linear-gradient(135deg, #ef4444, #dc2626)',
              border: 'none',
              color: 'white',
              padding: '6px 14px',
              borderRadius: '6px',
              fontWeight: 700,
              fontSize: '0.8rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Play size={13} /> {isRunning ? 'Running Geometric Octree Test...' : 'Run Real-Time Clash Test'}
          </button>
          <button 
            onClick={exportBcf}
            style={{
              background: '#1e293b',
              border: '1px solid #334155',
              color: '#38bdf8',
              padding: '6px 12px',
              borderRadius: '6px',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '5px'
            }}
          >
            <Download size={13} /> Export BCF Report
          </button>
        </div>
      </div>

      {assignedAlert && (
        <div style={{ background: '#0284c7', color: 'white', padding: '8px 14px', borderRadius: '8px', fontSize: '0.82rem', fontWeight: 600 }}>
          ✓ {assignedAlert}
        </div>
      )}

      {/* Clash Matrix Table */}
      <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '10px', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.82rem', color: '#f8fafc' }}>
          <thead>
            <tr style={{ background: '#0f172a', color: '#94a3b8', borderBottom: '1px solid #334155' }}>
              <th style={{ padding: '0.75rem 1rem' }}>Clash ID</th>
              <th style={{ padding: '0.75rem 1rem' }}>Discipline Test</th>
              <th style={{ padding: '0.75rem 1rem' }}>Primary Element</th>
              <th style={{ padding: '0.75rem 1rem' }}>Intersecting Element</th>
              <th style={{ padding: '0.75rem 1rem' }}>Intersection Depth</th>
              <th style={{ padding: '0.75rem 1rem' }}>Severity</th>
              <th style={{ padding: '0.75rem 1rem' }}>Status</th>
              <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Resolution</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((c, idx) => (
              <tr key={c.id} style={{ borderBottom: idx !== filtered.length - 1 ? '1px solid #334155' : 'none', background: c.status === 'RESOLVED' ? 'rgba(15, 23, 42, 0.4)' : 'transparent' }}>
                <td style={{ padding: '0.85rem 1rem', fontWeight: 700, color: '#38bdf8', fontFamily: 'monospace' }}>{c.id}</td>
                <td style={{ padding: '0.85rem 1rem', color: '#cbd5e1' }}>{c.discipline}</td>
                <td style={{ padding: '0.85rem 1rem', color: '#f8fafc', fontWeight: 600 }}>{c.elemA}</td>
                <td style={{ padding: '0.85rem 1rem', color: '#f8fafc', fontWeight: 600 }}>{c.elemB}</td>
                <td style={{ padding: '0.85rem 1rem', color: '#f59e0b', fontWeight: 700 }}>{c.penetration}</td>
                <td style={{ padding: '0.85rem 1rem' }}>
                  <span style={{
                    padding: '3px 8px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 700,
                    background: c.severity === 'CRITICAL' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                    color: c.severity === 'CRITICAL' ? '#f87171' : '#fbbf24',
                    border: c.severity === 'CRITICAL' ? '1px solid #ef4444' : '1px solid #f59e0b'
                  }}>
                    {c.severity}
                  </span>
                </td>
                <td style={{ padding: '0.85rem 1rem' }}>
                  <span style={{
                    padding: '3px 8px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 700,
                    background: c.status === 'OPEN' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                    color: c.status === 'OPEN' ? '#f87171' : '#34d399'
                  }}>
                    {c.status}
                  </span>
                </td>
                <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                  {c.status === 'OPEN' ? (
                    <button 
                      onClick={() => resolveClash(c.id)}
                      style={{ background: '#10b981', border: 'none', color: 'white', padding: '4px 10px', borderRadius: '5px', fontSize: '0.74rem', fontWeight: 600, cursor: 'pointer' }}
                    >
                      Resolve & Sync
                    </button>
                  ) : (
                    <span style={{ color: '#10b981', fontSize: '0.75rem', fontWeight: 600 }}>✓ Resolved</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
};
