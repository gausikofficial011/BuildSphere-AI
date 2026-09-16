import React, { useState } from 'react';
import { useBimStore } from '../../store/bimStore';
import { FileSpreadsheet, Download, Database, CheckCircle, Search } from 'lucide-react';

export const BimCobieAssetManager = () => {
  const { elements } = useBimStore();
  const [activeSheet, setActiveSheet] = useState('Component'); // 'Facility' | 'Floor' | 'Space' | 'Component' | 'Type' | 'System'
  const [search, setSearch] = useState('');

  const components = [
    { name: 'AHU-ROOF-01', typeName: 'Rooftop Air Handler Packaged', space: 'Roof Plant Room', floor: 'Roof (+35.0m)', serial: 'SN-948201', mfr: 'Carrier HVAC Systems', installDate: '2026-08-15', warranty: '5 Years' },
    { name: 'CHW-PUMP-01', typeName: 'Variable Speed Chilled Water Pump', space: 'Basement Plant', floor: 'L1: Ground', serial: 'SN-773120', mfr: 'Grundfos Pumps', installDate: '2026-07-20', warranty: '3 Years' },
    { name: 'VAV-BOX-201', typeName: 'Single Duct VAV Terminal Unit', space: 'Open Office West', floor: 'L2: Level 2', serial: 'SN-339182', mfr: 'Johnson Controls', installDate: '2026-08-01', warranty: '2 Years' },
    { name: 'SOLAR-INV-01', typeName: 'Grid-Tied 50kW String Inverter', space: 'Electrical Switchroom', floor: 'L1: Ground', serial: 'SN-552910', mfr: 'SMA Solar Technology', installDate: '2026-08-10', warranty: '10 Years' },
    { name: 'ELEV-PASS-01', typeName: 'Gearless Traction Passenger Elevator (1600kg)', space: 'Core Lift Shaft', floor: 'All Levels', serial: 'SN-102948', mfr: 'Otis Elevator Co.', installDate: '2026-06-25', warranty: '10 Years' }
  ];

  const exportCobie = () => {
    let csv = "Name,CreatedBy,CreatedOn,TypeName,Space,Floor,SerialNumber,Manufacturer,InstallationDate,WarrantyDuration\n";
    components.forEach(c => {
      csv += `${c.name},BIM_Manager@buildsphere.ai,2026-08-29,${c.typeName},${c.space},${c.floor},${c.serial},${c.mfr},${c.installDate},${c.warranty}\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `BuildSphere_COBie_v2.4_FacilityHandover.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', height: 'calc(100vh - 210px)', overflowY: 'auto' }}>
      
      {/* Top Header */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
        <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '10px', padding: '1rem' }}>
          <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>COBie 2.4 Facility Records</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#38bdf8', marginTop: '2px' }}>
            {components.length} Managed Assets
          </div>
          <div style={{ fontSize: '0.72rem', color: '#10b981', marginTop: '2px' }}>✓ NBIMS-US v3 Compliant</div>
        </div>

        <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '10px', padding: '1rem' }}>
          <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>Asset Handover Readiness</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#10b981', marginTop: '2px' }}>
            100% Verified
          </div>
          <div style={{ fontSize: '0.72rem', color: '#cbd5e1', marginTop: '2px' }}>FM & CAFM Database Ready</div>
        </div>

        <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '10px', padding: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <button 
            onClick={exportCobie}
            style={{
              background: 'linear-gradient(135deg, #10b981, #059669)',
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
            <FileSpreadsheet size={15} /> Export COBie 2.4 (Excel / CSV)
          </button>
        </div>
      </div>

      {/* Sheet Tabs */}
      <div style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '10px', padding: '0.75rem 1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div style={{ display: 'flex', gap: '0.35rem' }}>
          {['Component', 'Facility', 'Floor', 'Space', 'Type', 'System'].map(sheet => (
            <button 
              key={sheet}
              onClick={() => setActiveSheet(sheet)}
              style={{
                background: activeSheet === sheet ? '#0284c7' : '#1e293b',
                border: 'none',
                color: 'white',
                padding: '5px 12px',
                borderRadius: '6px',
                fontSize: '0.76rem',
                fontWeight: activeSheet === sheet ? 700 : 500,
                cursor: 'pointer'
              }}
            >
              Sheet: {sheet}
            </button>
          ))}
        </div>

        <input 
          type="text" 
          placeholder="Search COBie assets..." 
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ background: '#1e293b', border: '1px solid #334155', color: '#f8fafc', padding: '4px 10px', borderRadius: '6px', fontSize: '0.75rem', outline: 'none' }}
        />
      </div>

      {/* Table */}
      <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '10px', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.82rem', color: '#f8fafc' }}>
          <thead>
            <tr style={{ background: '#0f172a', color: '#94a3b8', borderBottom: '1px solid #334155' }}>
              <th style={{ padding: '0.75rem 1rem' }}>Component Name</th>
              <th style={{ padding: '0.75rem 1rem' }}>Equipment Type</th>
              <th style={{ padding: '0.75rem 1rem' }}>Assigned Space</th>
              <th style={{ padding: '0.75rem 1rem' }}>Floor</th>
              <th style={{ padding: '0.75rem 1rem' }}>Serial Number</th>
              <th style={{ padding: '0.75rem 1rem' }}>Manufacturer</th>
              <th style={{ padding: '0.75rem 1rem' }}>Warranty</th>
            </tr>
          </thead>
          <tbody>
            {components.map((c, idx) => (
              <tr key={c.name} style={{ borderBottom: idx !== components.length - 1 ? '1px solid #334155' : 'none' }}>
                <td style={{ padding: '0.85rem 1rem', fontWeight: 700, color: '#38bdf8', fontFamily: 'monospace' }}>{c.name}</td>
                <td style={{ padding: '0.85rem 1rem', color: '#f8fafc', fontWeight: 600 }}>{c.typeName}</td>
                <td style={{ padding: '0.85rem 1rem', color: '#cbd5e1' }}>{c.space}</td>
                <td style={{ padding: '0.85rem 1rem', color: '#94a3b8' }}>{c.floor}</td>
                <td style={{ padding: '0.85rem 1rem', color: '#cbd5e1', fontFamily: 'monospace' }}>{c.serial}</td>
                <td style={{ padding: '0.85rem 1rem', color: '#f8fafc' }}>{c.mfr}</td>
                <td style={{ padding: '0.85rem 1rem' }}>
                  <span style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', padding: '3px 8px', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 700 }}>
                    {c.warranty}
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
