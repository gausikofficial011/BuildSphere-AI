import React, { useState } from 'react';
import { Layers, RefreshCw, Eye, Sparkles, Download, Sliders, Activity } from 'lucide-react';

export const BimPointCloudViewer = () => {
  const [pointDensity, setPointDensity] = useState(1.5); // Millions
  const [deviationColorMode, setDeviationColorMode] = useState(true);
  const [extractedFeatures, setExtractedFeatures] = useState([
    { id: 'EXT-01', type: 'Exterior Facade Wall (Concrete)', confidence: '99.2%', deviation: '±4.2 mm', status: 'Converted to BIM' },
    { id: 'EXT-02', type: 'Primary Steel Column Line C', confidence: '98.5%', deviation: '±2.1 mm', status: 'Converted to BIM' },
    { id: 'EXT-03', type: 'Chilled Water Pipe Routing Ø200', confidence: '96.8%', deviation: '±8.5 mm', status: 'As-Built Deviation Flagged' },
    { id: 'EXT-04', type: 'HVAC Duct Overhead Level 3', confidence: '97.4%', deviation: '±3.1 mm', status: 'Converted to BIM' }
  ]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', height: 'calc(100vh - 210px)', overflowY: 'auto' }}>
      
      {/* Top Point Cloud Info */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
        <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '10px', padding: '1rem' }}>
          <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>Registered LiDAR Point Cloud</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#38bdf8', marginTop: '2px' }}>
            14.2M Points
          </div>
          <div style={{ fontSize: '0.72rem', color: '#10b981', marginTop: '2px' }}>✓ Leica BLK360 / FARO E57</div>
        </div>

        <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '10px', padding: '1rem' }}>
          <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>As-Built vs BIM Tolerance</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#10b981', marginTop: '2px' }}>
            ±4.8 mm Avg
          </div>
          <div style={{ fontSize: '0.72rem', color: '#cbd5e1', marginTop: '2px' }}>99.1% Within Allowable Specs</div>
        </div>

        <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '10px', padding: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <button 
            style={{
              background: 'linear-gradient(135deg, #a855f7, #6366f1)',
              border: 'none',
              color: 'white',
              padding: '10px 18px',
              borderRadius: '8px',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Sparkles size={15} /> AI Scan-to-BIM Auto-Extract
          </button>
        </div>
      </div>

      {/* Point Cloud Visualizer Simulation */}
      <div style={{
        background: '#070b16',
        border: '1px solid rgba(56, 189, 248, 0.2)',
        borderRadius: '12px',
        padding: '2rem',
        minHeight: '260px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Animated Cyber Grid / Point Field */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', maxWidth: '650px', justifyContent: 'center', opacity: 0.75 }}>
          {Array.from({ length: 60 }).map((_, i) => (
            <div 
              key={i} 
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: i % 7 === 0 ? '#ef4444' : i % 3 === 0 ? '#38bdf8' : '#10b981',
                boxShadow: `0 0 6px ${i % 7 === 0 ? '#ef4444' : i % 3 === 0 ? '#38bdf8' : '#10b981'}`
              }}
            />
          ))}
        </div>

        <div style={{ marginTop: '1.5rem', textAlign: 'center', zIndex: 5 }}>
          <div style={{ color: '#f8fafc', fontWeight: 700, fontSize: '1rem' }}>
            Active Scan-to-BIM Deviation Heatmap
          </div>
          <p style={{ color: '#94a3b8', fontSize: '0.8rem', maxWidth: '480px', margin: '6px auto 0 auto' }}>
            <span style={{ color: '#10b981' }}>● Green: Accurate (&lt;5mm)</span> &nbsp;|&nbsp; 
            <span style={{ color: '#38bdf8' }}>● Blue: Minor (5-10mm)</span> &nbsp;|&nbsp; 
            <span style={{ color: '#ef4444' }}>● Red: Variance (&gt;15mm)</span>
          </p>
        </div>
      </div>

      {/* Extracted Features */}
      <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '10px', overflow: 'hidden' }}>
        <div style={{ padding: '0.85rem 1.25rem', borderBottom: '1px solid #334155', fontWeight: 700, fontSize: '0.9rem', color: '#f8fafc' }}>
          🤖 AI Extracted Parametric BIM Geometries
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.82rem', color: '#f8fafc' }}>
          <thead>
            <tr style={{ background: '#0f172a', color: '#94a3b8', borderBottom: '1px solid #334155' }}>
              <th style={{ padding: '0.75rem 1rem' }}>Feature ID</th>
              <th style={{ padding: '0.75rem 1rem' }}>Recognized Element</th>
              <th style={{ padding: '0.75rem 1rem' }}>AI Confidence</th>
              <th style={{ padding: '0.75rem 1rem' }}>As-Built Deviation</th>
              <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Sync Status</th>
            </tr>
          </thead>
          <tbody>
            {extractedFeatures.map((f, idx) => (
              <tr key={f.id} style={{ borderBottom: idx !== extractedFeatures.length - 1 ? '1px solid #334155' : 'none' }}>
                <td style={{ padding: '0.85rem 1rem', fontWeight: 700, color: '#38bdf8', fontFamily: 'monospace' }}>{f.id}</td>
                <td style={{ padding: '0.85rem 1rem', color: '#f8fafc', fontWeight: 600 }}>{f.type}</td>
                <td style={{ padding: '0.85rem 1rem', color: '#10b981', fontWeight: 700 }}>{f.confidence}</td>
                <td style={{ padding: '0.85rem 1rem', color: f.deviation.includes('8.5') ? '#f59e0b' : '#38bdf8', fontWeight: 600 }}>{f.deviation}</td>
                <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                  <span style={{
                    background: f.status.includes('BIM') ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                    color: f.status.includes('BIM') ? '#34d399' : '#fbbf24',
                    padding: '3px 8px', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 700
                  }}>
                    {f.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
};
