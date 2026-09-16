import React, { useState } from 'react';
import { useBimStore } from '../../store/bimStore';
import { useUiStore } from '../../store/uiStore';
import { Layers, Folder, Box, ChevronRight, ChevronDown, Search, Filter, Sliders, CheckSquare, Edit3, Trash2 } from 'lucide-react';

export const BimObjectHierarchyInspector = () => {
  const { elements, removeElement } = useBimStore();
  const { selectedElementIds, selectElement } = useUiStore();
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('ALL');
  const [expandedNodes, setExpandedNodes] = useState({ project: true, building: true, l1: true, l2: true, structure: true, arch: true, mep: true });

  const elementList = Object.values(elements);

  const toggleNode = (node) => {
    setExpandedNodes(prev => ({ ...prev, [node]: !prev[node] }));
  };

  const filtered = elementList.filter(el => {
    const matchesSearch = el.id.toLowerCase().includes(search.toLowerCase()) || el.type.toLowerCase().includes(search.toLowerCase());
    const matchesType = filterType === 'ALL' || el.type.toUpperCase() === filterType;
    return matchesSearch && matchesType;
  });

  const selectedElement = selectedElementIds[0] ? elements[selectedElementIds[0]] : null;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', height: 'calc(100vh - 210px)', gap: '1rem', background: '#070b16', borderRadius: '12px', overflow: 'hidden' }}>
      
      {/* LEFT: IFC TREE STRUCTURE */}
      <div style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '10px', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ padding: '0.8rem 1rem', borderBottom: '1px solid #334155', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Layers size={16} color="#38bdf8" /> IFC 4.3 Spatial Breakdown Structure
          </div>
          <div style={{ display: 'flex', gap: '0.4rem' }}>
            <input 
              type="text" 
              placeholder="Search entities by ID or type..." 
              value={search} 
              onChange={e => setSearch(e.target.value)}
              style={{ flex: 1, background: '#1e293b', border: '1px solid #334155', color: '#f8fafc', padding: '4px 8px', borderRadius: '6px', fontSize: '0.75rem', outline: 'none' }}
            />
            <select 
              value={filterType} 
              onChange={e => setFilterType(e.target.value)}
              style={{ background: '#1e293b', border: '1px solid #334155', color: '#38bdf8', padding: '4px 6px', borderRadius: '6px', fontSize: '0.72rem', outline: 'none' }}
            >
              <option value="ALL">All Types</option>
              <option value="WALL">IfcWall</option>
              <option value="COLUMN">IfcColumn</option>
              <option value="BEAM">IfcBeam</option>
              <option value="SLAB">IfcSlab</option>
              <option value="CURTAIN_WALL">IfcCurtainWall</option>
              <option value="MEP_DUCT">IfcFlowSegment</option>
            </select>
          </div>
        </div>

        {/* Tree Nodes */}
        <div style={{ flex: 1, padding: '0.75rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          
          {/* IfcProject */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#38bdf8', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer' }} onClick={() => toggleNode('project')}>
            {expandedNodes.project ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            <Folder size={14} /> IfcProject [BuildSphere AI v3.0]
          </div>

          {expandedNodes.project && (
            <div style={{ paddingLeft: '1.2rem', display: 'flex', flexDirection: 'column', gap: '3px' }}>
              
              {/* IfcSite */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#94a3b8', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer' }} onClick={() => toggleNode('building')}>
                {expandedNodes.building ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
                <Folder size={13} /> IfcSite & Building Complex
              </div>

              {expandedNodes.building && (
                <div style={{ paddingLeft: '1.2rem', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                  {filtered.map(el => {
                    const isSelected = selectedElementIds.includes(el.id);
                    return (
                      <div 
                        key={el.id}
                        onClick={() => selectElement(el.id)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '4px 8px',
                          borderRadius: '5px',
                          background: isSelected ? '#0284c7' : 'transparent',
                          color: isSelected ? 'white' : '#cbd5e1',
                          fontSize: '0.74rem',
                          cursor: 'pointer',
                          transition: 'all 0.1s'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Box size={12} color={isSelected ? 'white' : '#38bdf8'} />
                          <span>Ifc{el.type.toUpperCase()} ({el.id.substring(0, 6)})</span>
                        </div>
                        <span style={{ fontSize: '0.65rem', color: isSelected ? '#e0f2fe' : '#64748b' }}>
                          {(el.elevation || 0)}m
                        </span>
                      </div>
                    );
                  })}
                  {filtered.length === 0 && (
                    <div style={{ padding: '1rem', color: '#64748b', fontSize: '0.75rem', textAlign: 'center' }}>No matching IFC entities found</div>
                  )}
                </div>
              )}

            </div>
          )}

        </div>
      </div>

      {/* RIGHT: PROPERTY DATA SHEET & PSET MATRIX */}
      <div style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '10px', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {selectedElement ? (
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflowY: 'auto', padding: '1.25rem', gap: '1rem' }}>
            
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #334155', paddingBottom: '0.75rem' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#f8fafc', fontWeight: 700 }}>
                  IFC Entity: Ifc{selectedElement.type.toUpperCase()}
                </h3>
                <span style={{ fontSize: '0.78rem', color: '#38bdf8', fontFamily: 'monospace' }}>
                  GUID: {selectedElement.id}
                </span>
              </div>
              <button 
                onClick={() => removeElement(selectedElement.id)}
                style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid #ef4444', color: '#f87171', padding: '5px 10px', borderRadius: '6px', fontSize: '0.75rem', cursor: 'pointer' }}
              >
                Delete Entity
              </button>
            </div>

            {/* Pset_BuildingElementProxyCommon */}
            <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '1rem' }}>
              <div style={{ color: '#38bdf8', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
                📋 Pset_CommonParameters (ISO 16739)
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem', fontSize: '0.78rem' }}>
                <div><span style={{ color: '#94a3b8' }}>LoadBearing:</span> <b style={{ color: '#10b981' }}>TRUE</b></div>
                <div><span style={{ color: '#94a3b8' }}>IsExternal:</span> <b style={{ color: '#f8fafc' }}>TRUE</b></div>
                <div><span style={{ color: '#94a3b8' }}>FireRating:</span> <b style={{ color: '#f59e0b' }}>2 Hours (FR-120)</b></div>
                <div><span style={{ color: '#94a3b8' }}>ThermalTransmittance (U-Value):</span> <b style={{ color: '#38bdf8' }}>0.24 W/(m²·K)</b></div>
                <div><span style={{ color: '#94a3b8' }}>AcousticRating:</span> <b style={{ color: '#f8fafc' }}>STC 52 dB</b></div>
                <div><span style={{ color: '#94a3b8' }}>MaterialGrade:</span> <b style={{ color: '#f8fafc' }}>{selectedElement.material || 'M40 Concrete'}</b></div>
              </div>
            </div>

            {/* Geometric Placement Matrix */}
            <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '1rem' }}>
              <div style={{ color: '#10b981', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
                📐 IfcLocalPlacement & Dimensions
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem', fontSize: '0.78rem' }}>
                {selectedElement.position && (
                  <>
                    <div><span style={{ color: '#94a3b8' }}>Coord X:</span> <b>{selectedElement.position.x.toFixed(2)} m</b></div>
                    <div><span style={{ color: '#94a3b8' }}>Coord Y (Elev):</span> <b>{selectedElement.position.y.toFixed(2)} m</b></div>
                    <div><span style={{ color: '#94a3b8' }}>Coord Z:</span> <b>{selectedElement.position.z.toFixed(2)} m</b></div>
                  </>
                )}
                {selectedElement.width && <div><span style={{ color: '#94a3b8' }}>Width:</span> <b>{selectedElement.width} m</b></div>}
                {selectedElement.height && <div><span style={{ color: '#94a3b8' }}>Height:</span> <b>{selectedElement.height} m</b></div>}
                {selectedElement.thickness && <div><span style={{ color: '#94a3b8' }}>Thickness:</span> <b>{selectedElement.thickness} m</b></div>}
              </div>
            </div>

            {/* 5D Carbon & Cost Lifecycle */}
            <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '1rem' }}>
              <div style={{ color: '#f59e0b', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.5rem' }}>
                💰 5D Quantity, Cost & CO₂ Lifecycle Assessment
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem', fontSize: '0.78rem' }}>
                <div><span style={{ color: '#94a3b8' }}>Gross Volume:</span> <b style={{ color: '#f8fafc' }}>2.45 m³</b></div>
                <div><span style={{ color: '#94a3b8' }}>Formwork Area:</span> <b style={{ color: '#f8fafc' }}>18.2 m²</b></div>
                <div><span style={{ color: '#94a3b8' }}>Embodied Carbon (A1-A3):</span> <b style={{ color: '#f59e0b' }}>588 kg CO₂e</b></div>
                <div><span style={{ color: '#94a3b8' }}>Supply & Install Rate:</span> <b style={{ color: '#10b981' }}>$440 USD</b></div>
              </div>
            </div>

          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#64748b', gap: '0.5rem' }}>
            <Sliders size={32} color="#334155" />
            <p style={{ fontSize: '0.85rem' }}>Select an IFC entity from the tree hierarchy to view its property sets.</p>
          </div>
        )}
      </div>

    </div>
  );
};
