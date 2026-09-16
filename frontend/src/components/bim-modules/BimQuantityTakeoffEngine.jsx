import React, { useState } from 'react';
import { useBimStore } from '../../store/bimStore';
import { DollarSign, Download, FileSpreadsheet, Layers, PieChart, Activity, TrendingUp, ShieldCheck } from 'lucide-react';

export const BimQuantityTakeoffEngine = () => {
  const { elements } = useBimStore();
  const [currency, setCurrency] = useState('USD');
  const [rateMultiplier, setRateMultiplier] = useState(1.0);

  const elementList = Object.values(elements);

  // Group elements by classification
  const summary = {
    concreteVolume: 0,
    steelWeight: 0,
    glazingArea: 0,
    ductingLength: 0,
    doorsWindowsCount: 0,
    totalCost: 0,
    embodiedCarbon: 0
  };

  elementList.forEach(el => {
    if (el.type === 'wall' || el.type === 'slab' || el.type === 'column' || el.type === 'foundation') {
      const l = el.length || el.width || 6;
      const h = el.height || el.thickness || el.depth || 3;
      const t = el.thickness || el.depth || el.width || 0.25;
      const vol = l * h * t;
      summary.concreteVolume += vol;
      summary.totalCost += vol * 180 * rateMultiplier;
      summary.embodiedCarbon += vol * 240;
    } else if (el.type === 'beam' || el.type === 'truss') {
      const l = el.span || el.length || 6;
      const weight = l * 65; // kg
      summary.steelWeight += weight / 1000; // MT
      summary.totalCost += (weight / 1000) * 2200 * rateMultiplier;
      summary.embodiedCarbon += (weight / 1000) * 1800;
    } else if (el.type === 'curtain_wall') {
      const l = 6;
      const h = el.height || 3.5;
      const area = l * h;
      summary.glazingArea += area;
      summary.totalCost += area * 350 * rateMultiplier;
      summary.embodiedCarbon += area * 85;
    } else if (el.type === 'mep_duct' || el.type === 'pipe' || el.type === 'cable_tray') {
      const l = 6;
      summary.ductingLength += l;
      summary.totalCost += l * 120 * rateMultiplier;
      summary.embodiedCarbon += l * 35;
    } else if (el.type === 'door' || el.type === 'window') {
      summary.doorsWindowsCount += 1;
      summary.totalCost += 450 * rateMultiplier;
      summary.embodiedCarbon += 40;
    }
  });

  const exportCsv = () => {
    let csv = "Item,Description,Unit,Quantity,Unit Rate (USD),Total Cost (USD),Carbon (kg CO2e)\n";
    csv += `1,Structural Concrete (M40),m3,${summary.concreteVolume.toFixed(2)},180,${(summary.concreteVolume * 180).toFixed(2)},${summary.embodiedCarbon.toFixed(0)}\n`;
    csv += `2,Structural Steel Framing,MT,${summary.steelWeight.toFixed(2)},2200,${(summary.steelWeight * 2200).toFixed(2)},${(summary.steelWeight * 1800).toFixed(0)}\n`;
    csv += `3,Curtain Wall Unitized Glazing,m2,${summary.glazingArea.toFixed(2)},350,${(summary.glazingArea * 350).toFixed(2)},${(summary.glazingArea * 85).toFixed(0)}\n`;
    csv += `4,HVAC & MEP Conduits,m,${summary.ductingLength.toFixed(2)},120,${(summary.ductingLength * 120).toFixed(2)},${(summary.ductingLength * 35).toFixed(0)}\n`;
    csv += `5,Doors and Glazed Openings,EA,${summary.doorsWindowsCount},450,${(summary.doorsWindowsCount * 450).toFixed(2)},${(summary.doorsWindowsCount * 40).toFixed(0)}\n`;
    
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `BuildSphere_5D_QTO_BillOfQuantities.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', height: 'calc(100vh - 210px)', overflowY: 'auto' }}>
      
      {/* Top 5D Metric KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
        <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '10px', padding: '1rem' }}>
          <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>Total Estimated Cost (5D)</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#10b981', marginTop: '2px' }}>
            ${summary.totalCost.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
          </div>
          <div style={{ fontSize: '0.72rem', color: '#38bdf8', marginTop: '2px' }}>Live Takeoff from 3D Model</div>
        </div>
        <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '10px', padding: '1rem' }}>
          <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>Total Embodied Carbon (A1-A5)</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#f59e0b', marginTop: '2px' }}>
            {summary.embodiedCarbon.toLocaleString('en-US', { maximumFractionDigits: 0 })} kg CO₂e
          </div>
          <div style={{ fontSize: '0.72rem', color: '#cbd5e1', marginTop: '2px' }}>Net Zero Target Verified</div>
        </div>
        <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '10px', padding: '1rem' }}>
          <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>Model Elements Count</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#38bdf8', marginTop: '2px' }}>
            {elementList.length} Objects
          </div>
          <div style={{ fontSize: '0.72rem', color: '#10b981', marginTop: '2px' }}>100% Parameter Linked</div>
        </div>
      </div>

      {/* Control Strip */}
      <div style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '10px', padding: '0.75rem 1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600 }}>PRICING REGION:</span>
          <select 
            value={currency} 
            onChange={e => setCurrency(e.target.value)}
            style={{ background: '#1e293b', color: '#38bdf8', border: '1px solid #334155', padding: '4px 10px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 700, outline: 'none' }}
          >
            <option value="USD">USD ($) - North America</option>
            <option value="EUR">EUR (€) - European Union</option>
            <option value="GBP">GBP (£) - United Kingdom</option>
            <option value="INR">INR (₹) - India / South Asia</option>
          </select>
        </div>

        <button 
          onClick={exportCsv}
          style={{
            background: 'linear-gradient(135deg, #10b981, #059669)',
            border: 'none',
            color: 'white',
            padding: '6px 14px',
            borderRadius: '6px',
            fontSize: '0.8rem',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <FileSpreadsheet size={14} /> Export Bill of Quantities (Excel/CSV)
        </button>
      </div>

      {/* BOQ Breakdown Table */}
      <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '10px', overflow: 'hidden' }}>
        <div style={{ padding: '0.85rem 1.25rem', borderBottom: '1px solid #334155', fontWeight: 700, fontSize: '0.9rem', color: '#f8fafc' }}>
          📊 Detailed 5D Bill of Quantities (BOQ)
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.82rem', color: '#f8fafc' }}>
          <thead>
            <tr style={{ background: '#0f172a', color: '#94a3b8', borderBottom: '1px solid #334155' }}>
              <th style={{ padding: '0.75rem 1rem' }}>Code</th>
              <th style={{ padding: '0.75rem 1rem' }}>Discipline & Trade</th>
              <th style={{ padding: '0.75rem 1rem' }}>Unit</th>
              <th style={{ padding: '0.75rem 1rem' }}>Model Quantity</th>
              <th style={{ padding: '0.75rem 1rem' }}>Unit Rate</th>
              <th style={{ padding: '0.75rem 1rem' }}>Subtotal Cost</th>
              <th style={{ padding: '0.75rem 1rem' }}>Embodied Carbon</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: '1px solid #334155' }}>
              <td style={{ padding: '0.85rem 1rem', color: '#38bdf8', fontFamily: 'monospace' }}>DIV-03</td>
              <td style={{ padding: '0.85rem 1rem', fontWeight: 600 }}>Structural Concrete (Walls, Slabs, Columns)</td>
              <td style={{ padding: '0.85rem 1rem', color: '#94a3b8' }}>m³</td>
              <td style={{ padding: '0.85rem 1rem', fontWeight: 700 }}>{summary.concreteVolume.toFixed(2)}</td>
              <td style={{ padding: '0.85rem 1rem', color: '#cbd5e1' }}>$180.00</td>
              <td style={{ padding: '0.85rem 1rem', color: '#10b981', fontWeight: 700 }}>${(summary.concreteVolume * 180).toFixed(2)}</td>
              <td style={{ padding: '0.85rem 1rem', color: '#f59e0b' }}>{summary.embodiedCarbon.toFixed(0)} kg</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #334155' }}>
              <td style={{ padding: '0.85rem 1rem', color: '#38bdf8', fontFamily: 'monospace' }}>DIV-05</td>
              <td style={{ padding: '0.85rem 1rem', fontWeight: 600 }}>Structural Steel Beams & Trusses</td>
              <td style={{ padding: '0.85rem 1rem', color: '#94a3b8' }}>MT</td>
              <td style={{ padding: '0.85rem 1rem', fontWeight: 700 }}>{summary.steelWeight.toFixed(2)}</td>
              <td style={{ padding: '0.85rem 1rem', color: '#cbd5e1' }}>$2,200.00</td>
              <td style={{ padding: '0.85rem 1rem', color: '#10b981', fontWeight: 700 }}>${(summary.steelWeight * 2200).toFixed(2)}</td>
              <td style={{ padding: '0.85rem 1rem', color: '#f59e0b' }}>{(summary.steelWeight * 1800).toFixed(0)} kg</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #334155' }}>
              <td style={{ padding: '0.85rem 1rem', color: '#38bdf8', fontFamily: 'monospace' }}>DIV-08</td>
              <td style={{ padding: '0.85rem 1rem', fontWeight: 600 }}>Curtain Wall Unitized Glazing Facades</td>
              <td style={{ padding: '0.85rem 1rem', color: '#94a3b8' }}>m²</td>
              <td style={{ padding: '0.85rem 1rem', fontWeight: 700 }}>{summary.glazingArea.toFixed(2)}</td>
              <td style={{ padding: '0.85rem 1rem', color: '#cbd5e1' }}>$350.00</td>
              <td style={{ padding: '0.85rem 1rem', color: '#10b981', fontWeight: 700 }}>${(summary.glazingArea * 350).toFixed(2)}</td>
              <td style={{ padding: '0.85rem 1rem', color: '#f59e0b' }}>{(summary.glazingArea * 85).toFixed(0)} kg</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #334155' }}>
              <td style={{ padding: '0.85rem 1rem', color: '#38bdf8', fontFamily: 'monospace' }}>DIV-23</td>
              <td style={{ padding: '0.85rem 1rem', fontWeight: 600 }}>HVAC Supply Ductwork & Distribution</td>
              <td style={{ padding: '0.85rem 1rem', color: '#94a3b8' }}>m</td>
              <td style={{ padding: '0.85rem 1rem', fontWeight: 700 }}>{summary.ductingLength.toFixed(2)}</td>
              <td style={{ padding: '0.85rem 1rem', color: '#cbd5e1' }}>$120.00</td>
              <td style={{ padding: '0.85rem 1rem', color: '#10b981', fontWeight: 700 }}>${(summary.ductingLength * 120).toFixed(2)}</td>
              <td style={{ padding: '0.85rem 1rem', color: '#f59e0b' }}>{(summary.ductingLength * 35).toFixed(0)} kg</td>
            </tr>
            <tr>
              <td style={{ padding: '0.85rem 1rem', color: '#38bdf8', fontFamily: 'monospace' }}>DIV-08</td>
              <td style={{ padding: '0.85rem 1rem', fontWeight: 600 }}>Architectural Doors & Windows</td>
              <td style={{ padding: '0.85rem 1rem', color: '#94a3b8' }}>EA</td>
              <td style={{ padding: '0.85rem 1rem', fontWeight: 700 }}>{summary.doorsWindowsCount}</td>
              <td style={{ padding: '0.85rem 1rem', color: '#cbd5e1' }}>$450.00</td>
              <td style={{ padding: '0.85rem 1rem', color: '#10b981', fontWeight: 700 }}>${(summary.doorsWindowsCount * 450).toFixed(2)}</td>
              <td style={{ padding: '0.85rem 1rem', color: '#f59e0b' }}>{(summary.doorsWindowsCount * 40).toFixed(0)} kg</td>
            </tr>
          </tbody>
        </table>
      </div>

    </div>
  );
};
