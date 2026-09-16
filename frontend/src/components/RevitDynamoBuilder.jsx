import React, { useState, useEffect } from 'react';
import { 
  Box, Layers, Play, Save, Download, Cpu, Sparkles, RefreshCw, 
  Settings, Grid, Plus, Trash2, CheckCircle, ArrowRight, Eye, Code, FileCode
} from 'lucide-react';

export function RevitDynamoBuilder() {
  const [activeMode, setActiveMode] = useState('REVIT_MANUAL'); // 'REVIT_MANUAL' | 'DYNAMO_SCRIPT'
  const [selectedFamily, setSelectedFamily] = useState('Structural Column (ISMB 400)');
  const [elementLength, setElementLength] = useState('6.0');
  const [elementWidth, setElementWidth] = useState('0.4');
  const [elementHeight, setElementHeight] = useState('4.0');
  const [elementMaterial, setElementMaterial] = useState('M40 Grade Concrete');
  const [revitPhase, setRevitPhase] = useState('Phase 2 - Superstructure');

  // Built elements list
  const [elements, setElements] = useState([
    { id: 'RVT-101', family: 'Structural Column (ISMB 400)', params: 'Length: 6.0m | Width: 0.4m | Height: 4.0m', material: 'M40 Grade Concrete', phase: 'Phase 2 - Superstructure', status: 'Modeled (Revit)' },
    { id: 'RVT-102', family: 'Concrete Shear Wall (300mm)', params: 'Length: 12.0m | Thickness: 0.3m | Height: 3.5m', material: 'M50 High-Strength Concrete', phase: 'Phase 1 - Substructure', status: 'Modeled (Revit)' },
    { id: 'RVT-103', family: 'Curtain Wall Glazing', params: 'Height: 3.5m | Mullion Width: 0.05m', material: 'Low-E Double Glazed Glass', phase: 'Phase 3 - Facade', status: 'Parametric (Dynamo)' },
    { id: 'RVT-104', family: 'Rebar Cage (Y25@150)', params: 'Bar Dia: 25mm | Pitch: 150mm c/c', material: 'Fe550D TMT Steel', phase: 'Phase 1 - Substructure', status: 'Parametric (Dynamo)' }
  ]);

  // Edit element modal state
  const [editingElement, setEditingElement] = useState(null);

  // Fetch initial elements from backend REST API
  useEffect(() => {
    fetch('/api/twin/elements')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setElements(data);
        }
      })
      .catch(err => console.warn('Using local element store fallback:', err));
  }, []);

  // Dynamo visual nodes state
  const [dynamoScript, setDynamoScript] = useState('STRUCTURAL_GRID');
  const [isExecutingScript, setIsExecutingScript] = useState(false);
  const [executionLog, setExecutionLog] = useState([
    'Dynamo Core v3.2 initialized.',
    'Revit 2026 API Connection Established [Active Document: Skyline_Tower_Master.rvt].',
    'Ready for visual parametric script execution.'
  ]);

  // Dynamo pre-built templates
  const dynamoTemplates = {
    STRUCTURAL_GRID: {
      name: 'Automated Structural Grid Generator',
      nodes: [
        { id: 'N1', type: 'INPUT', title: 'Grid.XSpacing', val: '8.0m (5 Bays)' },
        { id: 'N2', type: 'INPUT', title: 'Grid.YSpacing', val: '6.0m (4 Bays)' },
        { id: 'N3', type: 'PROCESS', title: 'Point.ByCoordinates', val: 'Matrix Generation' },
        { id: 'N4', type: 'REVIT', title: 'Revit.Column.ByLine', val: 'Family: ISMB 400' },
        { id: 'N5', type: 'OUTPUT', title: 'BimModel.Commit', val: '20 Structural Columns' }
      ]
    },
    REBAR_LAYOUT: {
      name: 'Parametric Rebar Cage Generator',
      nodes: [
        { id: 'N1', type: 'INPUT', title: 'Rebar.BarDiameter', val: '25mm Fe550D' },
        { id: 'N2', type: 'INPUT', title: 'Rebar.Spacing', val: '150mm Pitch' },
        { id: 'N3', type: 'PROCESS', title: 'Structure.RebarCage', val: '3D Stirrup Calculation' },
        { id: 'N4', type: 'REVIT', title: 'Revit.Element.AttachRebar', val: 'Host: Column RVT-101' },
        { id: 'N5', type: 'OUTPUT', title: 'BimModel.Commit', val: 'Rebar Cage Generated' }
      ]
    },
    FACADE_PANELIZER: {
      name: 'Curtain Wall Facade Panelizer',
      nodes: [
        { id: 'N1', type: 'INPUT', title: 'Facade.SurfaceUV', val: 'Grid 12x40 Panels' },
        { id: 'N2', type: 'INPUT', title: 'Glass.ThermalCoeff', val: 'U-Value 1.1 W/m²K' },
        { id: 'N3', type: 'PROCESS', title: 'Geometry.PanelizeSurface', val: 'Voronoi Structural Pattern' },
        { id: 'N4', type: 'REVIT', title: 'Revit.CurtainPanel.ByPoints', val: 'Family: Low-E Glass' },
        { id: 'N5', type: 'OUTPUT', title: 'BimModel.Commit', val: '480 Glazing Panels' }
      ]
    }
  };

  const handleAddManualElement = (e) => {
    e.preventDefault();
    const newEl = {
      id: `RVT-${Math.floor(100 + Math.random() * 900)}`,
      family: selectedFamily,
      params: `Length: ${elementLength}m | Width: ${elementWidth}m | Height: ${elementHeight}m`,
      material: elementMaterial,
      phase: revitPhase,
      status: 'Modeled (Revit Manual)'
    };
    setElements([newEl, ...elements]);
    setExecutionLog(prev => [`[REVIT BUILD] Manually placed ${selectedFamily} [ID: ${newEl.id}] into ${revitPhase}`, ...prev]);

    // Push to backend REST API
    fetch('/api/twin/elements', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newEl)
    }).catch(err => console.warn('Backend sync failed:', err));
  };

  const handleUpdateElement = (e) => {
    e.preventDefault();
    if (!editingElement) return;
    setElements(prev => prev.map(el => el.id === editingElement.id ? editingElement : el));
    setExecutionLog(prev => [`[REVIT EDIT] Updated element ${editingElement.id} parameters.`, ...prev]);

    // Send PUT request to backend REST API
    fetch(`/api/twin/elements/${editingElement.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editingElement)
    }).catch(err => console.warn('Backend update failed:', err));

    setEditingElement(null);
  };

  const handleDeleteElement = (id) => {
    setElements(prev => prev.filter(el => el.id !== id));
    setExecutionLog(prev => [`[REVIT DELETE] Deleted element [ID: ${id}] from model.`, ...prev]);

    // Send DELETE request to backend REST API
    fetch(`/api/twin/elements/${id}`, { method: 'DELETE' })
      .catch(err => console.warn('Backend delete failed:', err));
  };

  const handleExecuteDynamo = () => {
    setIsExecutingScript(true);
    const template = dynamoTemplates[dynamoScript];
    setExecutionLog(prev => [`[DYNAMO EXEC] Starting node execution for script: "${template.name}"...`, ...prev]);
    
    setTimeout(() => {
      setIsExecutingScript(false);
      const generatedEl = {
        id: `DYN-${Math.floor(100 + Math.random() * 900)}`,
        family: `Dynamo Parametric (${template.name})`,
        params: template.nodes[4].val,
        material: 'Auto-Calculated Structural Grade',
        phase: 'Phase 2 - Superstructure',
        status: 'Generated (Dynamo Script)'
      };
      setElements(prev => [generatedEl, ...prev]);
      setExecutionLog(prev => [
        `[DYNAMO SUCCESS] Script execution completed in 0.42s. Created 3D Revit element set [ID: ${generatedEl.id}].`,
        ...prev
      ]);
    }, 1200);
  };

  const handleExportRevitModel = (format) => {
    const dataStr = JSON.stringify({ project: "BuildSphere SkyTower", format, elements }, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `BuildSphere_Construction_Model.${format.toLowerCase()}`;
    link.click();
    setExecutionLog(prev => [`[MODEL EXPORT] Exported ${elements.length} elements to ${format} package.`, ...prev]);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', color: '#f8fafc', gap: '1.25rem' }}>
      
      {/* HEADER CONTROL BAR */}
      <div style={{ backgroundColor: 'rgba(15, 23, 42, 0.8)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255, 255, 255, 0.1)', padding: '1rem 1.5rem', borderRadius: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 700, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Cpu size={22} color="#6366f1" /> Revit & Dynamo Manual Construction Builder
          </h2>
          <p style={{ margin: '0.2rem 0 0 0', color: '#94a3b8', fontSize: '0.85rem' }}>
            Author 3D Revit construction elements manually or run visual Dynamo parametric scripts in real time.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {/* Mode Switcher */}
          <div style={{ backgroundColor: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '10px', padding: '0.25rem', display: 'flex', gap: '0.25rem' }}>
            <button 
              onClick={() => setActiveMode('REVIT_MANUAL')}
              style={{ padding: '0.45rem 0.85rem', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600, backgroundColor: activeMode === 'REVIT_MANUAL' ? '#6366f1' : 'transparent', color: activeMode === 'REVIT_MANUAL' ? '#ffffff' : '#94a3b8', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
            >
              <Box size={14} /> Revit Manual Builder
            </button>
            <button 
              onClick={() => setActiveMode('DYNAMO_SCRIPT')}
              style={{ padding: '0.45rem 0.85rem', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600, backgroundColor: activeMode === 'DYNAMO_SCRIPT' ? '#38bdf8' : 'transparent', color: activeMode === 'DYNAMO_SCRIPT' ? '#0f172a' : '#94a3b8', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
            >
              <Code size={14} /> Dynamo Script Engine
            </button>
          </div>

          {/* Model Exports */}
          <button 
            onClick={() => handleExportRevitModel('RVT')}
            style={{ padding: '0.45rem 0.85rem', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '10px', color: '#e2e8f0', cursor: 'pointer', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
          >
            <Download size={14} /> Export .RVT
          </button>

          <button 
            onClick={() => handleExportRevitModel('IFC4')}
            style={{ padding: '0.45rem 0.85rem', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '10px', color: '#e2e8f0', cursor: 'pointer', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
          >
            <FileCode size={14} /> Export IFC4
          </button>
        </div>
      </div>

      {/* MAIN WORKSPACE split: Left Controls / Right 3D Viewport & Logs */}
      <div style={{ display: 'grid', gridTemplateColumns: '360px 1fr', gap: '1.25rem', flex: 1, minHeight: '520px' }}>
        
        {/* LEFT PANEL: Revit Manual Form OR Dynamo Node Script Config */}
        <div style={{ backgroundColor: 'rgba(15, 23, 42, 0.7)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '16px', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          {activeMode === 'REVIT_MANUAL' ? (
            <form onSubmit={handleAddManualElement} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)', paddingBottom: '0.75rem' }}>
                <h4 style={{ margin: 0, color: '#6366f1', fontSize: '1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Box size={16} /> Revit Family Component Palette
                </h4>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Select component family & parameters to construct manually</span>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: '#cbd5e1', marginBottom: '0.35rem', fontWeight: 600 }}>Revit Component Family</label>
                <select 
                  value={selectedFamily}
                  onChange={e => setSelectedFamily(e.target.value)}
                  style={{ width: '100%', padding: '0.55rem', backgroundColor: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', color: '#ffffff', fontSize: '0.85rem', outline: 'none' }}
                >
                  <option value="Structural Column (ISMB 400)">Structural Column (ISMB 400)</option>
                  <option value="Concrete Shear Wall (300mm)">Concrete Shear Wall (300mm)</option>
                  <option value="Framing Beam (UB 600)">Framing Beam (UB 600)</option>
                  <option value="Reinforced Concrete Slab (200mm)">Reinforced Concrete Slab (200mm)</option>
                  <option value="Curtain Wall Glazing">Curtain Wall Glazing Panel</option>
                  <option value="HVAC Duct (600x400)">HVAC Galvanized Duct (600x400)</option>
                  <option value="Rebar Cage (Y25@150)">Rebar Cage (Y25@150 Pitch)</option>
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.7rem', color: '#cbd5e1', marginBottom: '0.25rem' }}>Length (m)</label>
                  <input 
                    type="text" 
                    value={elementLength} 
                    onChange={e => setElementLength(e.target.value)}
                    style={{ width: '100%', padding: '0.45rem', backgroundColor: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '6px', color: '#ffffff', fontSize: '0.8rem', outline: 'none' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.7rem', color: '#cbd5e1', marginBottom: '0.25rem' }}>Width (m)</label>
                  <input 
                    type="text" 
                    value={elementWidth} 
                    onChange={e => setElementWidth(e.target.value)}
                    style={{ width: '100%', padding: '0.45rem', backgroundColor: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '6px', color: '#ffffff', fontSize: '0.8rem', outline: 'none' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.7rem', color: '#cbd5e1', marginBottom: '0.25rem' }}>Height (m)</label>
                  <input 
                    type="text" 
                    value={elementHeight} 
                    onChange={e => setElementHeight(e.target.value)}
                    style={{ width: '100%', padding: '0.45rem', backgroundColor: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '6px', color: '#ffffff', fontSize: '0.8rem', outline: 'none' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: '#cbd5e1', marginBottom: '0.35rem', fontWeight: 600 }}>Material Specification</label>
                <select 
                  value={elementMaterial}
                  onChange={e => setElementMaterial(e.target.value)}
                  style={{ width: '100%', padding: '0.55rem', backgroundColor: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', color: '#ffffff', fontSize: '0.85rem', outline: 'none' }}
                >
                  <option value="M40 Grade Concrete">M40 Grade Concrete</option>
                  <option value="M50 High-Strength Concrete">M50 High-Strength Concrete</option>
                  <option value="Structural Steel S355JR">Structural Steel S355JR</option>
                  <option value="Low-E Double Glazed Glass">Low-E Double Glazed Glass</option>
                  <option value="Fe550D TMT Rebar Steel">Fe550D TMT Rebar Steel</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: '#cbd5e1', marginBottom: '0.35rem', fontWeight: 600 }}>Construction Phase</label>
                <select 
                  value={revitPhase}
                  onChange={e => setRevitPhase(e.target.value)}
                  style={{ width: '100%', padding: '0.55rem', backgroundColor: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', color: '#ffffff', fontSize: '0.85rem', outline: 'none' }}
                >
                  <option value="Phase 1 - Substructure">Phase 1 - Substructure</option>
                  <option value="Phase 2 - Superstructure">Phase 2 - Superstructure</option>
                  <option value="Phase 3 - Facade & Envelope">Phase 3 - Facade & Envelope</option>
                  <option value="Phase 4 - MEP Infrastructure">Phase 4 - MEP Infrastructure</option>
                </select>
              </div>

              <button 
                type="submit"
                style={{ marginTop: '0.5rem', width: '100%', padding: '0.75rem', backgroundColor: '#6366f1', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 700, cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', boxShadow: '0 4px 15px rgba(99,102,241,0.4)' }}
              >
                <Plus size={16} /> Place Element into 3D Construction Model
              </button>
            </form>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)', paddingBottom: '0.75rem' }}>
                <h4 style={{ margin: 0, color: '#38bdf8', fontSize: '1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Code size={16} /> Dynamo Parametric Script Workspace
                </h4>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Select visual node script to run parametric generation</span>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: '#cbd5e1', marginBottom: '0.35rem', fontWeight: 600 }}>Pre-Built Dynamo Script Template</label>
                <select 
                  value={dynamoScript}
                  onChange={e => setDynamoScript(e.target.value)}
                  style={{ width: '100%', padding: '0.55rem', backgroundColor: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', color: '#ffffff', fontSize: '0.85rem', outline: 'none' }}
                >
                  <option value="STRUCTURAL_GRID">Automated Structural Grid Generator</option>
                  <option value="REBAR_LAYOUT">Parametric Rebar Cage Generator</option>
                  <option value="FACADE_PANELIZER">Curtain Wall Facade Panelizer</option>
                </select>
              </div>

              {/* Node Wiring Canvas Preview */}
              <div style={{ backgroundColor: 'rgba(0,0,0,0.5)', border: '1px solid rgba(56, 189, 248, 0.3)', borderRadius: '12px', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ fontSize: '0.75rem', color: '#38bdf8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Dynamo Visual Node Graph
                </div>

                {dynamoTemplates[dynamoScript].nodes.map((node, i) => (
                  <div key={node.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ 
                      padding: '0.4rem 0.65rem', borderRadius: '6px', fontSize: '0.725rem', fontWeight: 700, flex: 1,
                      backgroundColor: node.type === 'INPUT' ? 'rgba(16, 185, 129, 0.2)' : (node.type === 'PROCESS' ? 'rgba(99, 102, 241, 0.2)' : 'rgba(56, 189, 248, 0.2)'),
                      color: node.type === 'INPUT' ? '#34d399' : (node.type === 'PROCESS' ? '#a5b4fc' : '#38bdf8'),
                      border: `1px solid ${node.type === 'INPUT' ? 'rgba(16, 185, 129, 0.3)' : (node.type === 'PROCESS' ? 'rgba(99, 102, 241, 0.3)' : 'rgba(56, 189, 248, 0.3)')}`
                    }}>
                      {node.title}: <span style={{ color: '#ffffff' }}>{node.val}</span>
                    </div>
                    {i < dynamoTemplates[dynamoScript].nodes.length - 1 && <ArrowRight size={12} color="#64748b" />}
                  </div>
                ))}
              </div>

              <button 
                onClick={handleExecuteDynamo}
                disabled={isExecutingScript}
                style={{ width: '100%', padding: '0.75rem', backgroundColor: isExecutingScript ? '#475569' : '#0284c7', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 700, cursor: isExecutingScript ? 'wait' : 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', boxShadow: '0 4px 15px rgba(2,132,199,0.4)' }}
              >
                {isExecutingScript ? <RefreshCw size={16} className="spin" /> : <Play size={16} />} 
                {isExecutingScript ? 'Executing Dynamo Nodes...' : 'Run Dynamo Parametric Script'}
              </button>
            </div>
          )}

        </div>

        {/* RIGHT PANEL: 3D Model Construction Canvas & Data Table */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          {/* 3D WebGL Model Canvas Simulator */}
          <div style={{ backgroundColor: 'rgba(15, 23, 42, 0.7)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '16px', padding: '1.25rem', height: '240px', position: 'relative', overflow: 'hidden', display: 'flex', flexContent: 'center', alignItems: 'center', justifyContent: 'center', background: 'radial-gradient(circle at center, rgba(30, 27, 75, 0.8) 0%, rgba(15, 23, 42, 0.95) 100%)' }}>
            <div style={{ position: 'absolute', top: 12, left: 16, fontSize: '0.75rem', fontWeight: 700, color: '#818cf8', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Grid size={14} /> 3D WebGL Revit Viewport (Interactive Grid)
            </div>

            {/* Simulated 3D Elements Wireframe */}
            <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-end', height: '140px', paddingBottom: '10px' }}>
              {elements.slice(0, 5).map((el, idx) => (
                <div key={el.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ 
                    width: '36px', 
                    height: `${80 + (idx % 3) * 25}px`, 
                    background: idx % 2 === 0 ? 'linear-gradient(180deg, #6366f1, #312e81)' : 'linear-gradient(180deg, #38bdf8, #0369a1)',
                    borderRadius: '4px',
                    border: '1px solid rgba(255,255,255,0.3)',
                    boxShadow: '0 8px 20px rgba(0,0,0,0.5)',
                    transition: 'all 0.3s ease'
                  }}></div>
                  <span style={{ fontSize: '0.65rem', color: '#cbd5e1', fontWeight: 600 }}>{el.id}</span>
                </div>
              ))}
            </div>

            <div style={{ position: 'absolute', bottom: 12, right: 16, fontSize: '0.7rem', color: '#94a3b8' }}>
              Active Elements: <strong style={{ color: '#ffffff' }}>{elements.length}</strong> | Revit LOD: <strong>LOD 400</strong>
            </div>
          </div>

          {/* Elements Construction Data Table */}
          <div style={{ backgroundColor: 'rgba(15, 23, 42, 0.7)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '16px', padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Layers size={16} color="#818cf8" /> Construction Model Elements ({elements.length})
              </h4>
              <span style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 600 }}>✓ Synced with Revit/Dynamo Engine</span>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)', color: '#94a3b8', textTransform: 'uppercase', fontSize: '0.7rem' }}>
                    <th style={{ padding: '0.5rem' }}>ID</th>
                    <th style={{ padding: '0.5rem' }}>Revit Family / Component</th>
                    <th style={{ padding: '0.5rem' }}>Parametric Specs</th>
                    <th style={{ padding: '0.5rem' }}>Phase</th>
                    <th style={{ padding: '0.5rem' }}>Source Mode</th>
                    <th style={{ padding: '0.5rem' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {elements.map(el => (
                    <tr key={el.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                      <td style={{ padding: '0.55rem 0.5rem', fontWeight: 700, color: '#818cf8' }}>{el.id}</td>
                      <td style={{ padding: '0.55rem 0.5rem', color: '#ffffff', fontWeight: 600 }}>{el.family}</td>
                      <td style={{ padding: '0.55rem 0.5rem', color: '#cbd5e1' }}>{el.params}</td>
                      <td style={{ padding: '0.55rem 0.5rem', color: '#94a3b8' }}>{el.phase}</td>
                      <td style={{ padding: '0.55rem 0.5rem' }}>
                        <span style={{ 
                          padding: '0.15rem 0.5rem', borderRadius: '9999px', fontSize: '0.65rem', fontWeight: 700,
                          backgroundColor: el.status.includes('Dynamo') ? 'rgba(56, 189, 248, 0.15)' : 'rgba(99, 102, 241, 0.15)',
                          color: el.status.includes('Dynamo') ? '#38bdf8' : '#a5b4fc',
                          border: `1px solid ${el.status.includes('Dynamo') ? 'rgba(56, 189, 248, 0.3)' : 'rgba(99, 102, 241, 0.3)'}`
                        }}>
                          {el.status}
                        </span>
                      </td>
                      <td style={{ padding: '0.55rem 0.5rem' }}>
                        <div style={{ display: 'flex', gap: '0.35rem' }}>
                          <button 
                            onClick={() => setEditingElement({ ...el })}
                            style={{ padding: '0.2rem 0.5rem', backgroundColor: 'rgba(99, 102, 241, 0.2)', border: '1px solid rgba(99, 102, 241, 0.4)', borderRadius: '4px', color: '#a5b4fc', fontSize: '0.7rem', cursor: 'pointer', fontWeight: 600 }}
                          >
                            Edit
                          </button>
                          <button 
                            onClick={() => handleDeleteElement(el.id)}
                            style={{ padding: '0.2rem 0.5rem', backgroundColor: 'rgba(239, 68, 68, 0.2)', border: '1px solid rgba(239, 68, 68, 0.4)', borderRadius: '4px', color: '#ef4444', fontSize: '0.7rem', cursor: 'pointer', fontWeight: 600 }}
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

            {/* Execution Console Logs */}
            <div style={{ backgroundColor: 'rgba(0,0,0,0.6)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', padding: '0.75rem', fontSize: '0.725rem', fontFamily: 'monospace', color: '#94a3b8', maxHeight: '90px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
              {executionLog.map((log, idx) => (
                <div key={idx} style={{ color: log.includes('SUCCESS') || log.includes('BUILD') ? '#34d399' : (log.includes('EXEC') ? '#38bdf8' : '#94a3b8') }}>
                  {log}
                </div>
              ))}
            </div>

          </div>

        </div>

      </div>

      {/* EDIT ELEMENT MODAL */}
      {editingElement && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '1rem' }}>
          <form onSubmit={handleUpdateElement} style={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '16px', padding: '1.75rem', width: '100%', maxWidth: '500px', color: '#ffffff', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 700, color: '#818cf8', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Settings size={18} /> Edit Revit Element Parameters [{editingElement.id}]
            </h3>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', color: '#cbd5e1', marginBottom: '0.35rem', fontWeight: 600 }}>Revit Component Family</label>
              <input 
                type="text" 
                value={editingElement.family} 
                onChange={e => setEditingElement({ ...editingElement, family: e.target.value })}
                style={{ width: '100%', padding: '0.55rem', backgroundColor: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', color: '#ffffff', fontSize: '0.85rem', outline: 'none' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', color: '#cbd5e1', marginBottom: '0.35rem', fontWeight: 600 }}>Parametric Specifications</label>
              <input 
                type="text" 
                value={editingElement.params} 
                onChange={e => setEditingElement({ ...editingElement, params: e.target.value })}
                style={{ width: '100%', padding: '0.55rem', backgroundColor: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', color: '#ffffff', fontSize: '0.85rem', outline: 'none' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', color: '#cbd5e1', marginBottom: '0.35rem', fontWeight: 600 }}>Construction Phase</label>
              <input 
                type="text" 
                value={editingElement.phase} 
                onChange={e => setEditingElement({ ...editingElement, phase: e.target.value })}
                style={{ width: '100%', padding: '0.55rem', backgroundColor: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', color: '#ffffff', fontSize: '0.85rem', outline: 'none' }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
              <button 
                type="button" 
                onClick={() => setEditingElement(null)}
                style={{ padding: '0.5rem 1rem', backgroundColor: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '8px', color: '#ffffff', cursor: 'pointer', fontWeight: 600 }}
              >
                Cancel
              </button>
              <button 
                type="submit"
                style={{ padding: '0.5rem 1.25rem', backgroundColor: '#6366f1', border: 'none', borderRadius: '8px', color: '#ffffff', cursor: 'pointer', fontWeight: 700 }}
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}
