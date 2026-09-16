import React, { useState, useEffect } from 'react';
import {
  Database,
  Search,
  Filter,
  Plus,
  Trash2,
  Edit3,
  Download,
  Upload,
  RefreshCw,
  Eye,
  Check,
  X,
  FileJson,
  Layers,
  ChevronRight,
  Sparkles,
  Tag,
  AlertTriangle,
  FolderPlus
} from 'lucide-react';

export default function DatasetStudio({ defaultDiscipline = 'All', onDataChange = () => {} }) {
  const [datasets, setDatasets] = useState([]);
  const [selectedDatasetId, setSelectedDatasetId] = useState(null);
  const [selectedDatasetData, setSelectedDatasetData] = useState(null);
  const [selectedElement, setSelectedElement] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDiscipline, setFilterDiscipline] = useState(defaultDiscipline);
  const [isLoading, setIsLoading] = useState(false);
  const [toastMsg, setToastMsg] = useState(null);

  // Modal States
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newDatasetName, setNewDatasetName] = useState('');
  const [newDatasetDiscipline, setNewDatasetDiscipline] = useState('BIM & Architecture');
  const [newDatasetDescription, setNewDatasetDescription] = useState('');
  const [newDatasetRole, setNewDatasetRole] = useState('BimManager');

  // Element Edit Modal
  const [isEditElementOpen, setIsEditElementOpen] = useState(false);
  const [editingParamKey, setEditingParamKey] = useState('');
  const [editingParamValue, setEditingParamValue] = useState('');

  // Toast Trigger
  const triggerToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  // 1. Fetch Datasets List
  const fetchDatasets = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/datasets/');
      if (res.ok) {
        const data = await res.json();
        setDatasets(data.datasets || []);
        if (data.datasets && data.datasets.length > 0 && !selectedDatasetId) {
          loadDatasetDetails(data.datasets[0].dataset_id);
        }
      }
    } catch (err) {
      console.error('Error fetching datasets:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // 2. Fetch Single Dataset Details
  const loadDatasetDetails = async (datasetId) => {
    setIsLoading(true);
    setSelectedDatasetId(datasetId);
    try {
      const res = await fetch(`/api/datasets/${datasetId}`);
      if (res.ok) {
        const data = await res.json();
        setSelectedDatasetData(data);
        if (data.elements && data.elements.length > 0) {
          setSelectedElement(data.elements[0]);
        } else {
          setSelectedElement(null);
        }
      }
    } catch (err) {
      console.error('Error loading dataset details:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDatasets();
  }, []);

  // 3. Create / Intake New Dataset
  const handleCreateDataset = async (e) => {
    e.preventDefault();
    if (!newDatasetName.trim()) return;

    const payload = {
      name: newDatasetName,
      discipline: newDatasetDiscipline,
      portal_role: newDatasetRole,
      description: newDatasetDescription || 'Custom enterprise dataset intaken via BuildSphere AI Studio.',
      elements: [
        {
          element_id: `EL_${Date.now().toString().slice(-4)}`,
          category: 'Sample Category',
          family: 'Standard Type',
          type: 'Generic 100mm',
          level: 'Level 1',
          parameters: {
            Status: 'ACTIVE',
            QualityScore: '98.5%',
            CreatedBy: 'User'
          }
        }
      ],
      relationships: []
    };

    try {
      const res = await fetch('/api/datasets/intake', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        const data = await res.json();
        triggerToast(`Success: Dataset "${newDatasetName}" intaken and created!`);
        setIsCreateModalOpen(false);
        setNewDatasetName('');
        setNewDatasetDescription('');
        await fetchDatasets();
        loadDatasetDetails(data.dataset_id);
      }
    } catch (err) {
      console.error('Error creating dataset:', err);
    }
  };

  // 4. Delete Entire Dataset
  const handleDeleteDataset = async (datasetId) => {
    if (!window.confirm(`Are you sure you want to delete dataset ${datasetId}?`)) return;

    try {
      const res = await fetch(`/api/datasets/${datasetId}`, { method: 'DELETE' });
      if (res.ok) {
        triggerToast(`Dataset ${datasetId} deleted.`);
        setSelectedDatasetData(null);
        setSelectedElement(null);
        await fetchDatasets();
      }
    } catch (err) {
      console.error('Error deleting dataset:', err);
    }
  };

  // 5. Delete a Single Element
  const handleDeleteElement = async (elementId) => {
    if (!selectedDatasetId) return;

    try {
      const res = await fetch(`/api/datasets/${selectedDatasetId}/elements/${elementId}`, { method: 'DELETE' });
      if (res.ok) {
        triggerToast(`Element ${elementId} removed.`);
        loadDatasetDetails(selectedDatasetId);
      }
    } catch (err) {
      console.error('Error deleting element:', err);
    }
  };

  // 6. Update Element Parameter
  const handleSaveElementParam = async (e) => {
    e.preventDefault();
    if (!selectedDatasetId || !selectedElement || !editingParamKey.trim()) return;

    const updatedParams = {
      ...(selectedElement.parameters || {}),
      [editingParamKey]: editingParamValue
    };

    try {
      const res = await fetch(`/api/datasets/${selectedDatasetId}/elements/${selectedElement.element_id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ parameters: updatedParams })
      });
      if (res.ok) {
        triggerToast(`Parameter "${editingParamKey}" updated to "${editingParamValue}".`);
        setIsEditElementOpen(false);
        setEditingParamKey('');
        setEditingParamValue('');
        loadDatasetDetails(selectedDatasetId);
      }
    } catch (err) {
      console.error('Error updating element:', err);
    }
  };

  // 7. Export Dataset to JSON
  const handleExportJSON = () => {
    if (!selectedDatasetData) return;
    const blob = new Blob([JSON.stringify(selectedDatasetData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedDatasetData.dataset_id || 'dataset'}_export.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    triggerToast('Dataset JSON downloaded successfully.');
  };

  // Filtered Datasets List
  const filteredDatasets = datasets.filter(ds => {
    const matchesSearch = ds.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          ds.discipline.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDisc = filterDiscipline === 'All' || ds.discipline === filterDiscipline;
    return matchesSearch && matchesDisc;
  });

  const disciplinesList = [
    'All',
    'BIM & Architecture',
    'Structural & Civil',
    'Mechanical, Electrical & Plumbing',
    'Digital Twin & IoT',
    'Commercial & Quantity Surveying',
    'Planning & Project Controls',
    'GIS & Spatial Intelligence',
    'Procurement & Supply Chain',
    'Quality & Safety Compliance',
    'Facility Management & Operations'
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '1.25rem', color: '#f8fafc', position: 'relative' }}>
      
      {/* Toast Banner */}
      {toastMsg && (
        <div style={{ position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 3000, backgroundColor: '#1e1b4b', border: '1px solid #ec4899', color: '#ffffff', padding: '0.85rem 1.4rem', borderRadius: '8px', boxShadow: '0 8px 30px rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Sparkles size={18} color="#22d3ee" />
          <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>{toastMsg}</span>
        </div>
      )}

      {/* Top Header & Intake Action Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', background: 'rgba(9, 8, 26, 0.88)', padding: '1.25rem 1.5rem', borderRadius: '8px', border: '1px solid rgba(236, 72, 153, 0.3)', backdropFilter: 'blur(16px)' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 900, margin: '0 0 0.25rem 0', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <Database size={22} color="#ec4899" /> Enterprise Dataset Management Studio
          </h2>
          <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.82rem' }}>
            Intake, inspect, parameterize, edit, and manage multi-domain datasets across all 25 role portals.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button
            onClick={fetchDatasets}
            style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.15)', color: '#cbd5e1', padding: '0.45rem 0.85rem', borderRadius: '4px', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 700 }}
          >
            <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} /> Refresh
          </button>
          
          <button
            onClick={() => setIsCreateModalOpen(true)}
            style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', background: 'linear-gradient(135deg, #ec4899 0%, #d946ef 100%)', border: 'none', color: '#ffffff', padding: '0.45rem 1.1rem', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 800, boxShadow: '0 0 15px rgba(236, 72, 153, 0.4)' }}
          >
            <Plus size={15} /> Intake New Dataset
          </button>
        </div>
      </div>

      {/* Main Studio Two-Column Grid (Left: Datasets Catalog, Right: Elements & Parameters Inspector) */}
      <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: '1.25rem', flex: 1, minHeight: '520px' }}>
        
        {/* Left Column: Datasets Catalog */}
        <div style={{ background: 'rgba(9, 8, 26, 0.88)', border: '1px solid rgba(6, 182, 212, 0.3)', borderRadius: '8px', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.85rem', backdropFilter: 'blur(16px)' }}>
          {/* Search & Filter */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', background: 'rgba(0, 0, 0, 0.4)', border: '1px solid rgba(255, 255, 255, 0.12)', borderRadius: '4px', padding: '0.35rem 0.75rem' }}>
              <Search size={14} color="#ec4899" />
              <input
                type="text"
                placeholder="Search datasets..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{ background: 'none', border: 'none', color: '#ffffff', outline: 'none', fontSize: '0.8rem', width: '100%' }}
              />
            </div>

            <select
              value={filterDiscipline}
              onChange={e => setFilterDiscipline(e.target.value)}
              style={{ background: 'rgba(0, 0, 0, 0.4)', border: '1px solid rgba(255, 255, 255, 0.12)', color: '#22d3ee', padding: '0.35rem 0.65rem', borderRadius: '4px', fontSize: '0.75rem', outline: 'none', fontWeight: 700, cursor: 'pointer' }}
            >
              {disciplinesList.map((d, i) => (
                <option key={i} value={d}>{d}</option>
              ))}
            </select>
          </div>

          <span style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Active Datasets ({filteredDatasets.length})
          </span>

          {/* Dataset Cards List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', overflowY: 'auto', flex: 1, maxHeight: '420px' }}>
            {filteredDatasets.map(ds => (
              <div
                key={ds.dataset_id}
                onClick={() => loadDatasetDetails(ds.dataset_id)}
                style={{
                  padding: '0.75rem 0.85rem',
                  borderRadius: '6px',
                  background: selectedDatasetId === ds.dataset_id ? 'rgba(236, 72, 153, 0.18)' : 'rgba(255, 255, 255, 0.02)',
                  border: selectedDatasetId === ds.dataset_id ? '1.5px solid #ec4899' : '1px solid rgba(255, 255, 255, 0.06)',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.25rem',
                  transition: 'all 0.2s ease',
                  boxShadow: selectedDatasetId === ds.dataset_id ? '0 0 15px rgba(236, 72, 153, 0.2)' : 'none'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <strong style={{ fontSize: '0.82rem', color: '#ffffff' }}>{ds.name}</strong>
                  <span style={{ fontSize: '0.62rem', background: 'rgba(6, 182, 212, 0.2)', color: '#22d3ee', padding: '0.1rem 0.35rem', borderRadius: '3px', fontWeight: 700 }}>
                    {ds.version}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.7rem', color: '#94a3b8' }}>
                  <span>{ds.discipline}</span>
                  <span style={{ color: '#34d399', fontWeight: 700 }}>{ds.elements_count} items</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Dataset Details & Elements Data Grid */}
        <div style={{ background: 'rgba(9, 8, 26, 0.88)', border: '1px solid rgba(236, 72, 153, 0.3)', borderRadius: '8px', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem', backdropFilter: 'blur(16px)' }}>
          {selectedDatasetData ? (
            <>
              {/* Dataset Header Bar */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '0.85rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0, color: '#ffffff' }}>
                      {selectedDatasetData.name}
                    </h3>
                    <span style={{ fontSize: '0.68rem', color: '#22d3ee', background: 'rgba(6, 182, 212, 0.15)', border: '1px solid rgba(6, 182, 212, 0.3)', padding: '0.15rem 0.45rem', borderRadius: '4px', fontWeight: 700 }}>
                      {selectedDatasetData.discipline}
                    </span>
                  </div>
                  <p style={{ margin: '0.25rem 0 0 0', color: '#94a3b8', fontSize: '0.76rem' }}>
                    {selectedDatasetData.description || 'Enterprise dataset loaded.'}
                  </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <button
                    onClick={handleExportJSON}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.15)', color: '#ffffff', padding: '0.4rem 0.75rem', borderRadius: '4px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 700 }}
                  >
                    <Download size={13} /> Export JSON
                  </button>
                  <button
                    onClick={() => handleDeleteDataset(selectedDatasetData.dataset_id)}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', background: 'rgba(244, 63, 94, 0.15)', border: '1px solid #f43f5e', color: '#f43f5e', padding: '0.4rem 0.75rem', borderRadius: '4px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 700 }}
                  >
                    <Trash2 size={13} /> Delete Dataset
                  </button>
                </div>
              </div>

              {/* Elements Table */}
              <div style={{ overflowX: 'auto', border: '1px solid rgba(255, 255, 255, 0.06)', borderRadius: '6px', maxHeight: '250px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead style={{ background: 'rgba(14, 12, 38, 0.95)', borderBottom: '1px solid rgba(6, 182, 212, 0.3)' }}>
                    <tr>
                      <th style={{ padding: '0.65rem 0.85rem', color: '#22d3ee', fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase' }}>Element ID</th>
                      <th style={{ padding: '0.65rem 0.85rem', color: '#22d3ee', fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase' }}>Category</th>
                      <th style={{ padding: '0.65rem 0.85rem', color: '#22d3ee', fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase' }}>Family / Type</th>
                      <th style={{ padding: '0.65rem 0.85rem', color: '#22d3ee', fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase' }}>Level</th>
                      <th style={{ padding: '0.65rem 0.85rem', color: '#22d3ee', fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedDatasetData.elements?.map((el, idx) => (
                      <tr
                        key={idx}
                        onClick={() => setSelectedElement(el)}
                        style={{
                          background: selectedElement?.element_id === el.element_id ? 'rgba(236, 72, 153, 0.12)' : 'rgba(255, 255, 255, 0.01)',
                          borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
                          cursor: 'pointer'
                        }}
                      >
                        <td style={{ padding: '0.6rem 0.85rem', color: '#ffffff', fontSize: '0.8rem', fontWeight: 700 }}>{el.element_id}</td>
                        <td style={{ padding: '0.6rem 0.85rem', color: '#e2e8f0', fontSize: '0.78rem' }}>{el.category}</td>
                        <td style={{ padding: '0.6rem 0.85rem', color: '#94a3b8', fontSize: '0.76rem' }}>{el.family} ({el.type})</td>
                        <td style={{ padding: '0.6rem 0.85rem', color: '#22d3ee', fontSize: '0.76rem' }}>{el.level || 'L1'}</td>
                        <td style={{ padding: '0.6rem 0.85rem', textAlign: 'right' }}>
                          <button
                            onClick={(e) => { e.stopPropagation(); handleDeleteElement(el.element_id); }}
                            style={{ background: 'none', border: 'none', color: '#f43f5e', cursor: 'pointer' }}
                            title="Delete Element"
                          >
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Selected Element Parameters Inspector */}
              {selectedElement && (
                <div style={{ background: 'rgba(14, 12, 38, 0.7)', border: '1px solid rgba(6, 182, 212, 0.25)', borderRadius: '6px', padding: '0.85rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.78rem', color: '#22d3ee', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      ⚙️ Parameters & Attributes for [{selectedElement.element_id}]
                    </span>
                    <button
                      onClick={() => setIsEditElementOpen(true)}
                      style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', background: 'rgba(236, 72, 153, 0.15)', border: '1px solid #ec4899', color: '#ffffff', padding: '0.25rem 0.65rem', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer' }}
                    >
                      <Edit3 size={12} /> Add / Edit Parameter
                    </button>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '0.6rem' }}>
                    {selectedElement.parameters && Object.keys(selectedElement.parameters).length > 0 ? (
                      Object.entries(selectedElement.parameters).map(([k, v], pI) => (
                        <div key={pI} style={{ background: 'rgba(0, 0, 0, 0.3)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '4px', padding: '0.4rem 0.6rem', display: 'flex', flexDirection: 'column' }}>
                          <span style={{ fontSize: '0.64rem', color: '#94a3b8' }}>{k}</span>
                          <strong style={{ fontSize: '0.78rem', color: '#ffffff' }}>{String(v)}</strong>
                        </div>
                      ))
                    ) : (
                      <span style={{ fontSize: '0.75rem', color: '#64748b' }}>No custom parameters defined. Click "Add / Edit Parameter" above.</span>
                    )}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#64748b', fontSize: '0.9rem' }}>
              Select a dataset from the left catalog to inspect or manage records.
            </div>
          )}
        </div>

      </div>

      {/* =========================================================================
         MODAL 1: INTAKE NEW DATASET
         ========================================================================= */}
      {isCreateModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(4, 3, 13, 0.85)', backdropFilter: 'blur(20px)', zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ width: '520px', background: 'rgba(9, 8, 26, 0.98)', border: '1.5px solid #ec4899', borderRadius: '10px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', boxShadow: '0 0 40px rgba(236, 72, 153, 0.4)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(236, 72, 153, 0.3)', paddingBottom: '0.65rem' }}>
              <strong style={{ fontSize: '1.1rem', color: '#ffffff' }}>Intake & Register New Dataset</strong>
              <button onClick={() => setIsCreateModalOpen(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}><X size={18} /></button>
            </div>

            <form onSubmit={handleCreateDataset} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div>
                <label style={{ fontSize: '0.74rem', color: '#94a3b8', display: 'block', marginBottom: '0.25rem' }}>Dataset Name</label>
                <input
                  type="text"
                  placeholder="e.g. Master Structural Foundation Matrix"
                  value={newDatasetName}
                  onChange={e => setNewDatasetName(e.target.value)}
                  required
                  style={{ width: '100%', padding: '0.5rem 0.75rem', background: 'rgba(0, 0, 0, 0.5)', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: '4px', color: '#ffffff', fontSize: '0.85rem', outline: 'none' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ fontSize: '0.74rem', color: '#94a3b8', display: 'block', marginBottom: '0.25rem' }}>Discipline</label>
                  <select
                    value={newDatasetDiscipline}
                    onChange={e => setNewDatasetDiscipline(e.target.value)}
                    style={{ width: '100%', padding: '0.5rem 0.75rem', background: 'rgba(0, 0, 0, 0.5)', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: '4px', color: '#22d3ee', fontSize: '0.8rem', outline: 'none' }}
                  >
                    {disciplinesList.filter(d => d !== 'All').map((d, i) => (
                      <option key={i} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.74rem', color: '#94a3b8', display: 'block', marginBottom: '0.25rem' }}>Primary Portal Role</label>
                  <select
                    value={newDatasetRole}
                    onChange={e => setNewDatasetRole(e.target.value)}
                    style={{ width: '100%', padding: '0.5rem 0.75rem', background: 'rgba(0, 0, 0, 0.5)', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: '4px', color: '#22d3ee', fontSize: '0.8rem', outline: 'none' }}
                  >
                    <option value="BimManager">BIM Manager</option>
                    <option value="StructuralEngineer">Structural Engineer</option>
                    <option value="CivilEngineer">Civil Engineer</option>
                    <option value="MepEngineer">MEP Engineer</option>
                    <option value="DigitalTwinEngineer">Digital Twin Engineer</option>
                    <option value="CostEngineer">Cost Engineer</option>
                    <option value="PlanningEngineer">Planning Engineer</option>
                    <option value="GisEngineer">GIS Engineer</option>
                    <option value="ProcurementManager">Procurement Manager</option>
                    <option value="InspectorDashboard">QA/QC Inspector</option>
                    <option value="ClientDashboard">Client / Owner</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.74rem', color: '#94a3b8', display: 'block', marginBottom: '0.25rem' }}>Description</label>
                <textarea
                  rows={3}
                  placeholder="Describe dataset scope, LOD, and source..."
                  value={newDatasetDescription}
                  onChange={e => setNewDatasetDescription(e.target.value)}
                  style={{ width: '100%', padding: '0.5rem 0.75rem', background: 'rgba(0, 0, 0, 0.5)', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: '4px', color: '#ffffff', fontSize: '0.82rem', outline: 'none' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.65rem', marginTop: '0.5rem' }}>
                <button type="button" onClick={() => setIsCreateModalOpen(false)} style={{ padding: '0.45rem 1rem', background: 'none', border: '1px solid rgba(255, 255, 255, 0.2)', color: '#cbd5e1', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' }}>
                  Cancel
                </button>
                <button type="submit" style={{ padding: '0.45rem 1.25rem', background: 'linear-gradient(135deg, #ec4899 0%, #d946ef 100%)', border: 'none', color: '#ffffff', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 800 }}>
                  Intake & Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
         MODAL 2: EDIT ELEMENT PARAMETER
         ========================================================================= */}
      {isEditElementOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(4, 3, 13, 0.85)', backdropFilter: 'blur(20px)', zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ width: '420px', background: 'rgba(9, 8, 26, 0.98)', border: '1.5px solid #22d3ee', borderRadius: '10px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', boxShadow: '0 0 40px rgba(6, 182, 212, 0.4)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(6, 182, 212, 0.3)', paddingBottom: '0.65rem' }}>
              <strong style={{ fontSize: '1rem', color: '#ffffff' }}>Add / Edit Parameter for {selectedElement?.element_id}</strong>
              <button onClick={() => setIsEditElementOpen(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}><X size={18} /></button>
            </div>

            <form onSubmit={handleSaveElementParam} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div>
                <label style={{ fontSize: '0.74rem', color: '#94a3b8', display: 'block', marginBottom: '0.25rem' }}>Parameter Key / Name</label>
                <input
                  type="text"
                  placeholder="e.g. ConcreteGrade, ClearCover, Airflow_CFM"
                  value={editingParamKey}
                  onChange={e => setEditingParamKey(e.target.value)}
                  required
                  style={{ width: '100%', padding: '0.5rem 0.75rem', background: 'rgba(0, 0, 0, 0.5)', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: '4px', color: '#ffffff', fontSize: '0.85rem', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.74rem', color: '#94a3b8', display: 'block', marginBottom: '0.25rem' }}>Parameter Value</label>
                <input
                  type="text"
                  placeholder="e.g. M40, 40mm, 6500 CFM, 98.4%"
                  value={editingParamValue}
                  onChange={e => setEditingParamValue(e.target.value)}
                  required
                  style={{ width: '100%', padding: '0.5rem 0.75rem', background: 'rgba(0, 0, 0, 0.5)', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: '4px', color: '#ffffff', fontSize: '0.85rem', outline: 'none' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.65rem', marginTop: '0.5rem' }}>
                <button type="button" onClick={() => setIsEditElementOpen(false)} style={{ padding: '0.45rem 1rem', background: 'none', border: '1px solid rgba(255, 255, 255, 0.2)', color: '#cbd5e1', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' }}>
                  Cancel
                </button>
                <button type="submit" style={{ padding: '0.45rem 1.25rem', background: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)', border: 'none', color: '#ffffff', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 800 }}>
                  Save Parameter
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
