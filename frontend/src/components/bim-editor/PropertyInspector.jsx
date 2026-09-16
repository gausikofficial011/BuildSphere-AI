import React from 'react';
import { useBimStore } from '../../store/bimStore';
import { useUiStore } from '../../store/uiStore';
import { useHistoryStore } from '../../store/historyStore';
import { 
  Box, Trash2, Copy, Sparkles, Layers, DollarSign, 
  Activity, ShieldCheck, Check, Info, Sliders, Ruler,
  Sun, Wind, Compass, Zap, Trees, Flame, SlidersHorizontal, HardHat
} from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

export const PropertyInspector = () => {
  const { elements, updateElement, removeElement, addElement, relationships } = useBimStore();
  const { selectedElementIds, selectElement } = useUiStore();
  const { recordState } = useHistoryStore();

  if (selectedElementIds.length === 0) {
    return (
      <div style={{
        width: '320px',
        backgroundColor: 'rgba(15, 23, 42, 0.95)',
        borderLeft: '1px solid rgba(56, 189, 248, 0.2)',
        color: '#94a3b8',
        padding: '1.25rem',
        fontSize: '0.875rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        gap: '0.75rem',
        backdropFilter: 'blur(12px)',
        overflowY: 'auto'
      }}>
        <div style={{
          width: '52px',
          height: '52px',
          borderRadius: '50%',
          backgroundColor: 'rgba(56, 189, 248, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#38bdf8',
          border: '1px solid rgba(56, 189, 248, 0.3)'
        }}>
          <Sliders size={22} />
        </div>
        <div style={{ fontWeight: 700, color: '#f8fafc', fontSize: '0.95rem' }}>BIM Element Inspector</div>
        <p style={{ fontSize: '0.78rem', color: '#64748b', maxWidth: '240px', lineHeight: 1.4 }}>
          Click any 3D element in the viewport to inspect and customize its geometric, structural, MEP, and cost parameters.
        </p>

        <div style={{
          marginTop: '0.5rem',
          padding: '0.75rem',
          backgroundColor: 'rgba(30, 41, 59, 0.6)',
          borderRadius: '8px',
          border: '1px solid #334155',
          fontSize: '0.72rem',
          textAlign: 'left',
          width: '100%'
        }}>
          <div style={{ color: '#38bdf8', fontWeight: 600, marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Ruler size={12} /> COMPLETE HOTKEY MAP
          </div>
          <div style={{ color: '#cbd5e1', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px' }}>
            <span><b>W</b> : Wall</span>
            <span><b>B</b> : Beam</span>
            <span><b>C</b> : Column</span>
            <span><b>S</b> : Slab</span>
            <span><b>T</b> : Stairs</span>
            <span><b>F</b> : Facade</span>
            <span><b>D</b> : Door</span>
            <span><b>G</b> : Window</span>
            <span><b>R</b> : Roof</span>
            <span><b>M</b> : MEP Duct</span>
            <span><b>P</b> : Solar PV</span>
            <span><b>L</b> : Lighting</span>
            <span><b>Esc</b> : Select</span>
          </div>
        </div>
      </div>
    );
  }

  const selectedId = selectedElementIds[0];
  const el = elements[selectedId];

  if (!el) return null;

  const handleChange = (field, value) => {
    recordState({ elements, relationships });
    updateElement(selectedId, { [field]: isNaN(Number(value)) || value === '' ? value : parseFloat(value) });
  };

  const handleDelete = () => {
    recordState({ elements, relationships });
    removeElement(selectedId);
    selectElement(null);
  };

  const handleDuplicate = () => {
    recordState({ elements, relationships });
    const newId = uuidv4();
    const cloned = { ...el, id: newId };
    if (cloned.position) {
      cloned.position = { ...cloned.position, x: cloned.position.x + 1.0, z: cloned.position.z + 1.0 };
    }
    if (cloned.start && cloned.end) {
      cloned.start = { ...cloned.start, x: cloned.start.x + 1.0 };
      cloned.end = { ...cloned.end, x: cloned.end.x + 1.0 };
    }
    addElement(cloned);
    selectElement(newId);
  };

  // Metric estimations
  const length = el.start && el.end 
    ? Math.sqrt(Math.pow(el.end.x - el.start.x, 2) + Math.pow(el.end.z - el.start.z, 2))
    : el.length || el.width || el.span || 1;
  const height = el.height || el.depth || el.totalHeight || 3.0;
  const thickness = el.thickness || el.width || el.depth || 0.25;
  const volume = (length * height * thickness).toFixed(2);
  const estCost = (volume * 180).toFixed(0);

  return (
    <div style={{
      width: '320px',
      backgroundColor: 'rgba(15, 23, 42, 0.95)',
      borderLeft: '1px solid rgba(56, 189, 248, 0.25)',
      color: '#f8fafc',
      display: 'flex',
      flexDirection: 'column',
      backdropFilter: 'blur(12px)',
      overflowY: 'auto'
    }}>
      {/* Header */}
      <div style={{
        padding: '1rem 1.25rem',
        borderBottom: '1px solid rgba(56, 189, 248, 0.2)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: 'linear-gradient(90deg, rgba(56,189,248,0.1), transparent)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Box size={18} color="#38bdf8" />
          <span style={{ fontWeight: 700, fontSize: '0.95rem', textTransform: 'capitalize' }}>
            {el.type.replace(/_/g, ' ')} Properties
          </span>
        </div>
        <div style={{ display: 'flex', gap: '0.25rem' }}>
          <button 
            onClick={handleDuplicate}
            title="Duplicate Element"
            style={{ background: '#1e293b', border: '1px solid #334155', color: '#38bdf8', padding: '6px', borderRadius: '6px', cursor: 'pointer' }}
          >
            <Copy size={14} />
          </button>
          <button 
            onClick={handleDelete}
            title="Delete Element"
            style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.4)', color: '#ef4444', padding: '6px', borderRadius: '6px', cursor: 'pointer' }}
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
        
        {/* Identification */}
        <div style={{ background: '#1e293b', padding: '0.75rem', borderRadius: '8px', border: '1px solid #334155' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
            <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Element ID</span>
            <span style={{ fontSize: '0.75rem', color: '#38bdf8', fontFamily: 'monospace' }}>{el.id.substring(0, 8)}...</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>BIM Classification</span>
            <span style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 600, textTransform: 'uppercase' }}>IFC_{el.type.toUpperCase()}</span>
          </div>
        </div>

        {/* DIMENSIONS */}
        <div>
          <label style={{ display:'block', fontSize:'0.75rem', color:'#94a3b8', marginBottom:'0.25rem' }}>Primary Dimension (m)</label>
          <input 
            type="number" step="0.1"
            value={el.height || el.width || el.depth || el.length || 3.0} 
            onChange={(e) => handleChange(el.height ? 'height' : el.width ? 'width' : 'length', e.target.value)}
            style={{ width: '100%', padding: '0.55rem', backgroundColor: '#0f172a', border: '1px solid #334155', color: '#f8fafc', borderRadius: '6px', fontSize: '0.85rem' }}
          />
        </div>

        <div>
          <label style={{ display:'block', fontSize:'0.75rem', color:'#94a3b8', marginBottom:'0.25rem' }}>Elevation Level (m)</label>
          <input 
            type="number" step="0.5"
            value={el.elevation || 0} 
            onChange={(e) => handleChange('elevation', e.target.value)}
            style={{ width: '100%', padding: '0.55rem', backgroundColor: '#0f172a', border: '1px solid #334155', color: '#f8fafc', borderRadius: '6px', fontSize: '0.85rem' }}
          />
        </div>

        <div>
          <label style={{ display:'block', fontSize:'0.75rem', color:'#94a3b8', marginBottom:'0.25rem' }}>Material & Specification</label>
          <select 
            value={el.material || 'Reinforced Concrete'} 
            onChange={(e) => handleChange('material', e.target.value)}
            style={{ width: '100%', padding: '0.55rem', backgroundColor: '#0f172a', border: '1px solid #334155', color: '#f8fafc', borderRadius: '6px', fontSize: '0.85rem' }}
          >
            <option value="Reinforced Concrete">Reinforced Concrete (M40 / C30/37)</option>
            <option value="Structural Steel">Structural Steel (ASTM A992 / S355)</option>
            <option value="Clay Brick">Solid Clay Brick Masonry (230mm)</option>
            <option value="Curtain Glazing">Low-E Double Insulated Glazing (Argon)</option>
            <option value="Engineered Timber">Engineered Timber / CLT</option>
            <option value="Aluminum Composite">Anodized Aluminum Composite Panel</option>
          </select>
        </div>

        {/* 5D Metric Summary */}
        <div style={{
          marginTop: '0.25rem',
          padding: '0.9rem',
          backgroundColor: 'rgba(56, 189, 248, 0.05)',
          border: '1px solid rgba(56, 189, 248, 0.25)',
          borderRadius: '8px',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.45rem'
        }}>
          <div style={{ fontSize: '0.75rem', color: '#38bdf8', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Activity size={14} /> 5D TAKEOFF & ANALYTICS
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem' }}>
            <span style={{ color: '#94a3b8' }}>Net Volume:</span>
            <span style={{ color: '#f8fafc', fontWeight: 600 }}>{volume} m³</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem' }}>
            <span style={{ color: '#94a3b8' }}>Est. Cost:</span>
            <span style={{ color: '#10b981', fontWeight: 700 }}>${estCost}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem' }}>
            <span style={{ color: '#94a3b8' }}>Embodied Carbon:</span>
            <span style={{ color: '#f59e0b', fontWeight: 600 }}>{(volume * 240).toFixed(0)} kg CO₂e</span>
          </div>
        </div>

      </div>
    </div>
  );
};
