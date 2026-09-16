import React, { useState } from 'react';
import { useBimStore } from '../../store/bimStore';
import { Download, ZoomIn, ZoomOut, Layers, Eye, RefreshCw, Printer, Compass, Ruler } from 'lucide-react';

export const BimFloorPlan2DViewer = () => {
  const { elements } = useBimStore();
  const [level, setLevel] = useState(0);
  const [zoom, setZoom] = useState(1.0);
  const [showGrid, setShowGrid] = useState(true);
  const [showDims, setShowDims] = useState(true);
  const [showRooms, setShowRooms] = useState(true);

  const elementList = Object.values(elements);
  
  // Filter elements on current floor level
  const floorElements = elementList.filter(el => {
    const elev = el.elevation || el.position?.y || 0;
    return Math.abs(elev - level) < 3.5;
  });

  const exportSvg = () => {
    const svgEl = document.getElementById('bim-floorplan-svg');
    if (!svgEl) return;
    const svgData = new XMLSerializer().serializeToString(svgEl);
    const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `BuildSphere_FloorPlan_L${level}m.svg`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  // Convert model coordinate (-20 to 20m) to SVG pixel (0 to 800px)
  const scale = 22 * zoom;
  const cx = 400;
  const cy = 300;

  const toPxX = (x) => cx + x * scale;
  const toPxY = (z) => cy + z * scale;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 210px)', background: '#070b16', borderRadius: '12px', border: '1px solid rgba(56, 189, 248, 0.2)', overflow: 'hidden' }}>
      {/* 2D Plan Control Bar */}
      <div style={{ padding: '0.6rem 1rem', background: '#0f172a', borderBottom: '1px solid #334155', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600 }}>FLOOR PLAN LEVEL:</span>
          <select 
            value={level} 
            onChange={(e) => setLevel(parseFloat(e.target.value))}
            style={{ background: '#1e293b', color: '#38bdf8', border: '1px solid #334155', padding: '4px 10px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 700, outline: 'none' }}
          >
            <option value="0">Level 1: Ground Plan (0.0m)</option>
            <option value="3.5">Level 2: Typical Floor (+3.5m)</option>
            <option value="7.0">Level 3: Upper Floor (+7.0m)</option>
            <option value="35.0">Roof / Canopy Plan (+35.0m)</option>
          </select>
          <span style={{ fontSize: '0.75rem', color: '#64748b' }}>({floorElements.length} Elements on this Story)</span>
        </div>

        {/* View toggles & Zoom */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <button 
            onClick={() => setShowGrid(!showGrid)} 
            style={{ background: showGrid ? '#0284c7' : '#1e293b', border: '1px solid #334155', color: 'white', padding: '4px 8px', borderRadius: '5px', fontSize: '0.72rem', cursor: 'pointer' }}
          >
            Grid 1-4 / A-D
          </button>
          <button 
            onClick={() => setShowDims(!showDims)} 
            style={{ background: showDims ? '#0284c7' : '#1e293b', border: '1px solid #334155', color: 'white', padding: '4px 8px', borderRadius: '5px', fontSize: '0.72rem', cursor: 'pointer' }}
          >
            Dimensions
          </button>
          <button 
            onClick={() => setShowRooms(!showRooms)} 
            style={{ background: showRooms ? '#0284c7' : '#1e293b', border: '1px solid #334155', color: 'white', padding: '4px 8px', borderRadius: '5px', fontSize: '0.72rem', cursor: 'pointer' }}
          >
            Room Tags
          </button>
          <div style={{ width: '1px', height: '18px', background: '#334155', margin: '0 4px' }} />
          <button onClick={() => setZoom(z => Math.max(0.5, z - 0.2))} style={{ background: '#1e293b', border: '1px solid #334155', color: '#e2e8f0', padding: '4px 7px', borderRadius: '5px', cursor: 'pointer' }}><ZoomOut size={13} /></button>
          <span style={{ fontSize: '0.75rem', color: '#38bdf8', minWidth: '40px', textAlign: 'center' }}>{(zoom * 100).toFixed(0)}%</span>
          <button onClick={() => setZoom(z => Math.min(2.5, z + 0.2))} style={{ background: '#1e293b', border: '1px solid #334155', color: '#e2e8f0', padding: '4px 7px', borderRadius: '5px', cursor: 'pointer' }}><ZoomIn size={13} /></button>
          <button onClick={exportSvg} style={{ background: 'linear-gradient(135deg, #38bdf8, #2563eb)', border: 'none', color: 'white', padding: '4px 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Download size={13} /> Export CAD SVG
          </button>
        </div>
      </div>

      {/* SVG Canvas */}
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden', background: '#090d1a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg 
          id="bim-floorplan-svg"
          width="100%" 
          height="100%" 
          viewBox="0 0 800 600" 
          style={{ width: '100%', height: '100%', cursor: 'crosshair' }}
        >
          <defs>
            <pattern id="cad-subgrid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#1e293b" strokeWidth="0.5" />
            </pattern>
            <pattern id="concrete-hatch" width="8" height="8" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="0.75" fill="#64748b" />
              <circle cx="6" cy="6" r="0.75" fill="#64748b" />
            </pattern>
          </defs>

          {/* Background Grid */}
          <rect width="100%" height="100%" fill="#070b16" />
          <rect width="100%" height="100%" fill="url(#cad-subgrid)" opacity="0.6" />

          {/* Structural Grid Lines (A, B, C, D and 1, 2, 3, 4) */}
          {showGrid && (
            <g opacity="0.45">
              {[-12, -4, 4, 12].map((gx, idx) => (
                <g key={`gx-${idx}`}>
                  <line x1={toPxX(gx)} y1="30" x2={toPxX(gx)} y2="570" stroke="#0284c7" strokeDasharray="6,4" strokeWidth="1" />
                  <circle cx={toPxX(gx)} cy="25" r="11" fill="#0f172a" stroke="#0284c7" strokeWidth="1" />
                  <text x={toPxX(gx)} y="29" fill="#38bdf8" fontSize="10" fontWeight="bold" textAnchor="middle">{String.fromCharCode(65 + idx)}</text>
                </g>
              ))}
              {[-10, -3, 3, 10].map((gz, idx) => (
                <g key={`gz-${idx}`}>
                  <line x1="30" y1={toPxY(gz)} x2="770" y2={toPxY(gz)} stroke="#0284c7" strokeDasharray="6,4" strokeWidth="1" />
                  <circle cx="25" cy={toPxY(gz)} r="11" fill="#0f172a" stroke="#0284c7" strokeWidth="1" />
                  <text x="25" y={toPxY(gz) + 4} fill="#38bdf8" fontSize="10" fontWeight="bold" textAnchor="middle">{idx + 1}</text>
                </g>
              ))}
            </g>
          )}

          {/* Render Slabs */}
          {floorElements.filter(e => e.type === 'slab' || e.type === 'foundation').map(slab => {
            const p = slab.position || { x: 0, z: 0 };
            const w = (slab.width || 8) * scale;
            const l = (slab.length || 8) * scale;
            return (
              <rect
                key={slab.id}
                x={toPxX(p.x) - w / 2}
                y={toPxY(p.z) - l / 2}
                width={w}
                height={l}
                fill="rgba(30, 41, 59, 0.4)"
                stroke="#475569"
                strokeWidth="1.5"
              />
            );
          })}

          {/* Render Room Zones */}
          {showRooms && floorElements.filter(e => e.type === 'room_zone').map(zone => {
            const p = zone.position || { x: 0, z: 0 };
            const w = (zone.width || 6) * scale;
            const l = (zone.length || 6) * scale;
            return (
              <g key={zone.id}>
                <rect
                  x={toPxX(p.x) - w / 2}
                  y={toPxY(p.z) - l / 2}
                  width={w}
                  height={l}
                  fill="rgba(56, 189, 248, 0.08)"
                  stroke="#38bdf8"
                  strokeDasharray="4,4"
                  strokeWidth="1"
                />
                <text x={toPxX(p.x)} y={toPxY(p.z) - 6} fill="#f8fafc" fontSize="11" fontWeight="bold" textAnchor="middle">
                  {zone.roomName || 'Room'}
                </text>
                <text x={toPxX(p.x)} y={toPxY(p.z) + 10} fill="#38bdf8" fontSize="10" textAnchor="middle">
                  {((zone.width || 6) * (zone.length || 6)).toFixed(1)} m²
                </text>
              </g>
            );
          })}

          {/* Render Walls */}
          {floorElements.filter(e => e.type === 'wall' || e.type === 'curtain_wall').map(w => {
            if (!w.start || !w.end) return null;
            const x1 = toPxX(w.start.x);
            const y1 = toPxY(w.start.z);
            const x2 = toPxX(w.end.x);
            const y2 = toPxY(w.end.z);
            const isGlass = w.type === 'curtain_wall';

            return (
              <g key={w.id}>
                <line 
                  x1={x1} y1={y1} x2={x2} y2={y2} 
                  stroke={isGlass ? '#38bdf8' : '#e2e8f0'} 
                  strokeWidth={(w.thickness || 0.25) * scale} 
                  strokeLinecap="square"
                />
                {showDims && (
                  <text 
                    x={(x1 + x2) / 2} 
                    y={(y1 + y2) / 2 - 8} 
                    fill="#94a3b8" 
                    fontSize="9" 
                    fontWeight="600" 
                    textAnchor="middle"
                  >
                    {Math.sqrt(Math.pow(w.end.x - w.start.x, 2) + Math.pow(w.end.z - w.start.z, 2)).toFixed(2)}m
                  </text>
                )}
              </g>
            );
          })}

          {/* Render Columns */}
          {floorElements.filter(e => e.type === 'column').map(col => {
            const p = col.position || { x: 0, z: 0 };
            const s = (col.width || 0.45) * scale;
            return (
              <rect
                key={col.id}
                x={toPxX(p.x) - s / 2}
                y={toPxY(p.z) - s / 2}
                width={s}
                height={s}
                fill="#f59e0b"
                stroke="#d97706"
                strokeWidth="1.5"
              />
            );
          })}

          {/* Render Doors with Swing Arcs */}
          {floorElements.filter(e => e.type === 'door').map(door => {
            const p = door.position || { x: 0, z: 0 };
            const px = toPxX(p.x);
            const py = toPxY(p.z);
            const r = (door.width || 1.0) * scale;
            return (
              <g key={door.id}>
                <line x1={px} y1={py} x2={px + r} y2={py} stroke="#10b981" strokeWidth="2" />
                <path d={`M ${px + r} ${py} A ${r} ${r} 0 0 0 ${px} ${py - r}`} fill="none" stroke="#10b981" strokeWidth="1" strokeDasharray="3,2" />
                <line x1={px} y1={py} x2={px} y2={py - r} stroke="#10b981" strokeWidth="2" />
              </g>
            );
          })}

          {/* Render Windows */}
          {floorElements.filter(e => e.type === 'window').map(win => {
            const p = win.position || { x: 0, z: 0 };
            const px = toPxX(p.x);
            const py = toPxY(p.z);
            const w = (win.width || 1.8) * scale;
            return (
              <g key={win.id}>
                <rect x={px - w / 2} y={py - 4} width={w} height={8} fill="#38bdf8" opacity="0.8" />
                <line x1={px - w / 2} y1={py} x2={px + w / 2} y2={py} stroke="#ffffff" strokeWidth="1.5" />
              </g>
            );
          })}

          {/* Render MEP Ducts & Pipes */}
          {floorElements.filter(e => e.type === 'mep_duct' || e.type === 'pipe').map(mep => {
            if (!mep.start || !mep.end) return null;
            return (
              <line
                key={mep.id}
                x1={toPxX(mep.start.x)}
                y1={toPxY(mep.start.z)}
                x2={toPxX(mep.end.x)}
                y2={toPxY(mep.end.z)}
                stroke={mep.type === 'mep_duct' ? '#06b6d4' : '#3b82f6'}
                strokeWidth={mep.type === 'mep_duct' ? 6 : 3}
                strokeDasharray={mep.type === 'mep_duct' ? "6,3" : "none"}
              />
            );
          })}

          {/* North Arrow & Scale Bar */}
          <g transform="translate(730, 70)">
            <circle cx="0" cy="0" r="22" fill="#0f172a" stroke="#334155" strokeWidth="1.5" />
            <polygon points="0,-16 -6,8 0,4 6,8" fill="#ef4444" />
            <text x="0" y="-18" fill="#f8fafc" fontSize="10" fontWeight="bold" textAnchor="middle">N</text>
          </g>

          <g transform="translate(50, 560)">
            <rect x="0" y="0" width="100" height="5" fill="#38bdf8" />
            <rect x="100" y="0" width="100" height="5" fill="#94a3b8" />
            <text x="0" y="-4" fill="#94a3b8" fontSize="9">0m</text>
            <text x="100" y="-4" fill="#94a3b8" fontSize="9">{(100 / scale).toFixed(1)}m</text>
            <text x="200" y="-4" fill="#94a3b8" fontSize="9">{(200 / scale).toFixed(1)}m</text>
          </g>
        </svg>
      </div>
    </div>
  );
};
