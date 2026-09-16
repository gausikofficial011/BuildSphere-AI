import React, { useState } from 'react';
import { useBimStore } from '../../store/bimStore';
import { Scissors, Download, ZoomIn, ZoomOut, Layers, Eye, RefreshCw } from 'lucide-react';

export const BimSectionElevationViewer = () => {
  const { elements } = useBimStore();
  const [sectionPlane, setSectionPlane] = useState('X-X'); // 'X-X' Longitudinal | 'Y-Y' Transverse | 'NORTH_ELEV' | 'SOUTH_ELEV'
  const [cutPosition, setCutPosition] = useState(0); // offset in meters
  const [zoom, setZoom] = useState(1.0);

  const elementList = Object.values(elements);

  const scale = 18 * zoom;
  const cx = 400;
  const cy = 450;

  const toPxX = (x) => cx + x * scale;
  const toPxY = (y) => cy - y * scale; // Y is elevation upwards

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 210px)', background: '#070b16', borderRadius: '12px', border: '1px solid rgba(56, 189, 248, 0.2)', overflow: 'hidden' }}>
      
      {/* Control Bar */}
      <div style={{ padding: '0.6rem 1rem', background: '#0f172a', borderBottom: '1px solid #334155', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600 }}>SECTION / ELEVATION CUT:</span>
          <select 
            value={sectionPlane} 
            onChange={(e) => setSectionPlane(e.target.value)}
            style={{ background: '#1e293b', color: '#38bdf8', border: '1px solid #334155', padding: '4px 10px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 700, outline: 'none' }}
          >
            <option value="X-X">Section A-A (Longitudinal Cut)</option>
            <option value="Y-Y">Section B-B (Transverse Cut)</option>
            <option value="NORTH_ELEV">North Architectural Elevation</option>
            <option value="SOUTH_ELEV">South Architectural Elevation</option>
          </select>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Cut Offset:</span>
            <input 
              type="range" min="-10" max="10" step="1" 
              value={cutPosition} 
              onChange={e => setCutPosition(parseFloat(e.target.value))}
              style={{ width: '80px', accentColor: '#38bdf8', cursor: 'pointer' }}
            />
            <span style={{ fontSize: '0.75rem', color: '#38bdf8', fontFamily: 'monospace' }}>{cutPosition}m</span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <button onClick={() => setZoom(z => Math.max(0.5, z - 0.2))} style={{ background: '#1e293b', border: '1px solid #334155', color: '#e2e8f0', padding: '4px 7px', borderRadius: '5px', cursor: 'pointer' }}><ZoomOut size={13} /></button>
          <span style={{ fontSize: '0.75rem', color: '#38bdf8', minWidth: '40px', textAlign: 'center' }}>{(zoom * 100).toFixed(0)}%</span>
          <button onClick={() => setZoom(z => Math.min(2.5, z + 0.2))} style={{ background: '#1e293b', border: '1px solid #334155', color: '#e2e8f0', padding: '4px 7px', borderRadius: '5px', cursor: 'pointer' }}><ZoomIn size={13} /></button>
        </div>
      </div>

      {/* SVG Canvas */}
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden', background: '#090d1a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg width="100%" height="100%" viewBox="0 0 800 600" style={{ width: '100%', height: '100%' }}>
          <rect width="100%" height="100%" fill="#070b16" />

          {/* Ground Line */}
          <line x1="20" y1={toPxY(0)} x2="780" y2={toPxY(0)} stroke="#64748b" strokeWidth="2" />
          <text x="30" y={toPxY(0) + 16} fill="#64748b" fontSize="10" fontWeight="bold">GROUND LEVEL ±0.00m</text>

          {/* Story Level Datums */}
          {[0, 3.5, 7.0, 10.5, 14.0, 35.0].map((elev, idx) => (
            <g key={idx}>
              <line x1="80" y1={toPxY(elev)} x2="740" y2={toPxY(elev)} stroke="#334155" strokeDasharray="6,4" strokeWidth="0.8" />
              <polygon points={`70,${toPxY(elev)} 60,${toPxY(elev) - 5} 60,${toPxY(elev) + 5}`} fill="#0284c7" />
              <text x="50" y={toPxY(elev) + 3} fill="#38bdf8" fontSize="9" fontWeight="bold" textAnchor="end">
                {idx === 0 ? 'L1: 0.0m' : idx === 1 ? 'L2: +3.5m' : idx === 2 ? 'L3: +7.0m' : idx === 3 ? 'L4: +10.5m' : idx === 4 ? 'L5: +14.0m' : 'Roof: +35.0m'}
              </text>
            </g>
          ))}

          {/* Render Elements in Section */}
          {elementList.map(el => {
            const elev = el.elevation || el.position?.y || 0;
            const h = el.height || el.totalHeight || 3.5;
            const px = toPxX(el.position?.x || el.start?.x || 0);
            const py = toPxY(elev);
            const w = (el.width || el.length || 8) * scale;
            const hPx = h * scale;

            if (el.type === 'column') {
              return (
                <rect 
                  key={el.id} 
                  x={px - 8} 
                  y={py - hPx} 
                  width={16} 
                  height={hPx} 
                  fill="#f59e0b" 
                  stroke="#d97706" 
                  strokeWidth="1.5" 
                />
              );
            }

            if (el.type === 'slab' || el.type === 'foundation') {
              return (
                <rect 
                  key={el.id} 
                  x={px - w / 2} 
                  y={py} 
                  width={w} 
                  height={(el.thickness || el.depth || 0.3) * scale} 
                  fill="#475569" 
                  stroke="#334155" 
                  strokeWidth="1" 
                />
              );
            }

            if (el.type === 'curtain_wall' || el.type === 'wall') {
              return (
                <rect 
                  key={el.id} 
                  x={px - w / 2} 
                  y={py - hPx} 
                  width={w} 
                  height={hPx} 
                  fill={el.type === 'curtain_wall' ? 'rgba(56, 189, 248, 0.25)' : '#334155'} 
                  stroke={el.type === 'curtain_wall' ? '#38bdf8' : '#64748b'} 
                  strokeWidth="1.5" 
                />
              );
            }

            if (el.type === 'elevator_core') {
              return (
                <rect 
                  key={el.id} 
                  x={px - (el.width || 3.5) * scale / 2} 
                  y={py - (el.totalHeight || 35) * scale} 
                  width={(el.width || 3.5) * scale} 
                  height={(el.totalHeight || 35) * scale} 
                  fill="#1e293b" 
                  stroke="#0284c7" 
                  strokeWidth="2" 
                />
              );
            }

            return null;
          })}
        </svg>
      </div>

    </div>
  );
};
