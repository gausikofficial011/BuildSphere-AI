import React, { useState, useEffect, useCallback } from 'react';
import { FolderOpen, Upload, Trash2, ExternalLink, RefreshCw, Plus, Loader2, FileText, Filter, Download } from 'lucide-react';

const API = ''; // Vite proxy: /api/* -> http://localhost:8000/*

const CATEGORY_COLORS = {
  'Drawings':           { color: '#3b82f6', bg: 'rgba(59,130,246,0.1)', icon: '📐' },
  'Contracts':          { color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)', icon: '📜' },
  'Specifications':     { color: '#06b6d4', bg: 'rgba(6,182,212,0.1)',  icon: '📋' },
  'Inspection Reports': { color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', icon: '🔍' },
  'BOQ':               { color: '#10b981', bg: 'rgba(16,185,129,0.1)',  icon: '💰' },
  'Certificates':       { color: '#ec4899', bg: 'rgba(236,72,153,0.1)', icon: '🏆' },
  'Meeting Minutes':    { color: '#64748b', bg: 'rgba(100,116,139,0.1)', icon: '📝' },
  'Reports':            { color: '#6366f1', bg: 'rgba(99,102,241,0.1)', icon: '📊' },
  'General':            { color: '#94a3b8', bg: 'rgba(148,163,184,0.1)', icon: '📄' },
};

export function DocumentCenter({ portalRole = 'Project Manager', projectId = 1 }) {
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [filterCat, setFilterCat] = useState('');
  const [categories, setCategories] = useState(Object.keys(CATEGORY_COLORS));
  const [notification, setNotification] = useState(null);

  const [form, setForm] = useState({
    title: '',
    category: 'Drawings',
    file_url: '',
    file_type: 'pdf',
    uploaded_by: '',
    uploaded_by_role: portalRole,
    version: '1.0',
    description: '',
    project_id: projectId,
  });

  const showMsg = (msg, type = 'success') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3500);
  };

  const fetchDocs = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ project_id: projectId });
      if (filterCat) params.append('category', filterCat);
      const res = await fetch(`${API}/api/documents/?${params}`);
      if (res.ok) setDocs(await res.json());
    } catch { } finally { setLoading(false); }
  }, [projectId, filterCat]);

  useEffect(() => { fetchDocs(); }, [fetchDocs]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    try {
      const res = await fetch(`${API}/api/documents/`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, uploaded_by_role: portalRole, project_id: projectId }),
      });
      if (res.ok) {
        const doc = await res.json();
        setDocs(prev => [doc, ...prev]);
        setShowForm(false);
        setForm({ title: '', category: 'Drawings', file_url: '', file_type: 'pdf', uploaded_by: '', uploaded_by_role: portalRole, version: '1.0', description: '', project_id: projectId });
        showMsg(`✅ Document "${doc.title}" uploaded successfully`);
      }
    } catch { showMsg('Failed to upload document', 'error'); }
  };

  const deleteDoc = async (id) => {
    if (!window.confirm('Remove this document?')) return;
    try {
      await fetch(`${API}/api/documents/${id}`, { method: 'DELETE' });
      setDocs(prev => prev.filter(d => d.id !== id));
      showMsg('Document removed');
    } catch { showMsg('Delete failed', 'error'); }
  };

  const groupedDocs = docs.reduce((acc, doc) => {
    const cat = doc.category || 'General';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(doc);
    return acc;
  }, {});

  const displayDocs = filterCat ? { [filterCat]: docs } : groupedDocs;

  return (
    <div style={{ fontFamily: 'Inter, system-ui, sans-serif', color: '#1e293b' }}>
      {notification && (
        <div style={{ position: 'fixed', bottom: '1.5rem', right: '1.5rem', zIndex: 9999, background: notification.type === 'error' ? '#dc2626' : '#059669', color: 'white', padding: '0.85rem 1.5rem', borderRadius: '12px', fontWeight: 600, fontSize: '0.9rem', boxShadow: '0 8px 25px rgba(0,0,0,0.2)' }}>
          {notification.msg}
        </div>
      )}

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '1.35rem', fontWeight: 800, color: '#0f172a' }}>Document Center</h2>
          <p style={{ margin: '0.25rem 0 0', color: '#64748b', fontSize: '0.85rem' }}>Drawings · Contracts · Specifications · Reports · {portalRole}</p>
        </div>
        <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
          <select value={filterCat} onChange={e => setFilterCat(e.target.value)} style={{ padding: '0.5rem 0.75rem', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.82rem', cursor: 'pointer', color: '#475569' }}>
            <option value="">All Categories</option>
            {categories.map(c => <option key={c} value={c}>{(CATEGORY_COLORS[c]?.icon || '📄')} {c}</option>)}
          </select>
          <button onClick={fetchDocs} style={{ padding: '0.5rem', borderRadius: '8px', border: '1px solid #e2e8f0', background: 'white', cursor: 'pointer' }}>
            <RefreshCw size={16} color={loading ? '#6366f1' : '#64748b'} />
          </button>
          <button onClick={() => setShowForm(!showForm)} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'linear-gradient(135deg,#6366f1,#4f46e5)', color: 'white', padding: '0.55rem 1.1rem', borderRadius: '10px', border: 'none', fontWeight: 700, fontSize: '0.875rem', cursor: 'pointer', boxShadow: '0 4px 12px rgba(99,102,241,0.35)' }}>
            <Upload size={16} /> Upload Document
          </button>
        </div>
      </div>

      {/* Stats row */}
      <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
        {Object.entries(groupedDocs).map(([cat, catDocs]) => {
          const cfg = CATEGORY_COLORS[cat] || CATEGORY_COLORS['General'];
          return (
            <button key={cat} onClick={() => setFilterCat(filterCat === cat ? '' : cat)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.4rem 0.9rem', borderRadius: '20px', border: `1px solid ${filterCat === cat ? cfg.color : '#e2e8f0'}`, background: filterCat === cat ? cfg.bg : 'white', color: filterCat === cat ? cfg.color : '#64748b', fontWeight: 600, fontSize: '0.78rem', cursor: 'pointer' }}>
              {cfg.icon} {cat} <span style={{ background: cfg.color, color: 'white', borderRadius: '10px', padding: '0 6px', fontSize: '0.7rem', fontWeight: 700 }}>{catDocs.length}</span>
            </button>
          );
        })}
      </div>

      {/* Upload Form */}
      {showForm && (
        <div style={{ background: '#f8fafc', borderRadius: '14px', border: '1px solid #e2e8f0', padding: '1.5rem', marginBottom: '1.5rem' }}>
          <h3 style={{ margin: '0 0 1rem', fontSize: '1rem', fontWeight: 700 }}>Upload New Document</h3>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div style={{ gridColumn: '1/-1' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '0.4rem' }}>Document Title *</label>
                <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="e.g. Foundation Level 2 Structural Drawing Rev 03" required style={{ width: '100%', padding: '0.65rem 0.875rem', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '0.875rem', outline: 'none', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '0.4rem' }}>Category</label>
                <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} style={{ width: '100%', padding: '0.65rem 0.875rem', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '0.875rem', cursor: 'pointer' }}>
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '0.4rem' }}>Version</label>
                <input value={form.version} onChange={e => setForm(f => ({ ...f, version: e.target.value }))} placeholder="e.g. 1.0, Rev-3, Final" style={{ width: '100%', padding: '0.65rem 0.875rem', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '0.875rem', outline: 'none', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '0.4rem' }}>File Type</label>
                <select value={form.file_type} onChange={e => setForm(f => ({ ...f, file_type: e.target.value }))} style={{ width: '100%', padding: '0.65rem 0.875rem', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '0.875rem', cursor: 'pointer' }}>
                  {['pdf','dwg','xlsx','docx','pptx','jpg','png','zip'].map(t => <option key={t} value={t}>.{t.toUpperCase()}</option>)}
                </select>
              </div>
              <div style={{ gridColumn: '1/-1' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '0.4rem' }}>File URL / Google Drive Link</label>
                <input value={form.file_url} onChange={e => setForm(f => ({ ...f, file_url: e.target.value }))} placeholder="https://drive.google.com/file/d/... or https://docs.google.com/..." style={{ width: '100%', padding: '0.65rem 0.875rem', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '0.875rem', outline: 'none', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '0.4rem' }}>Uploaded By</label>
                <input value={form.uploaded_by} onChange={e => setForm(f => ({ ...f, uploaded_by: e.target.value }))} placeholder="Your name" style={{ width: '100%', padding: '0.65rem 0.875rem', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '0.875rem', outline: 'none', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '0.4rem' }}>Description (optional)</label>
                <input value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Brief document purpose or revision notes" style={{ width: '100%', padding: '0.65rem 0.875rem', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '0.875rem', outline: 'none', boxSizing: 'border-box' }} />
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
              <button type="button" onClick={() => setShowForm(false)} style={{ padding: '0.6rem 1.25rem', borderRadius: '8px', border: '1px solid #e2e8f0', background: 'white', color: '#64748b', cursor: 'pointer', fontWeight: 600, fontSize: '0.875rem' }}>Cancel</button>
              <button type="submit" style={{ padding: '0.6rem 1.5rem', borderRadius: '8px', border: 'none', background: 'linear-gradient(135deg,#6366f1,#4f46e5)', color: 'white', cursor: 'pointer', fontWeight: 700, fontSize: '0.875rem' }}>Upload Document</button>
            </div>
          </form>
        </div>
      )}

      {/* Document List */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
          <Loader2 size={32} style={{ margin: '0 auto 1rem', display: 'block', color: '#6366f1' }} />
          <p style={{ margin: 0 }}>Loading documents...</p>
        </div>
      ) : docs.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem 2rem', border: '2px dashed #e2e8f0', borderRadius: '14px', background: '#f8fafc' }}>
          <FolderOpen size={40} color="#cbd5e1" style={{ margin: '0 auto 1rem', display: 'block' }} />
          <h4 style={{ margin: '0 0 0.5rem', color: '#475569' }}>No Documents Uploaded</h4>
          <p style={{ margin: '0 0 1.5rem', color: '#94a3b8', fontSize: '0.9rem' }}>Upload drawings, contracts, specifications, and reports for this project.</p>
          <button onClick={() => setShowForm(true)} style={{ background: 'linear-gradient(135deg,#6366f1,#4f46e5)', color: 'white', padding: '0.6rem 1.5rem', borderRadius: '10px', border: 'none', fontWeight: 700, cursor: 'pointer' }}>Upload First Document</button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {Object.entries(displayDocs).map(([cat, catDocs]) => {
            if (!catDocs || catDocs.length === 0) return null;
            const cfg = CATEGORY_COLORS[cat] || CATEGORY_COLORS['General'];
            return (
              <div key={cat}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.75rem' }}>
                  <span style={{ fontSize: '1.1rem' }}>{cfg.icon}</span>
                  <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700, color: cfg.color }}>{cat}</h3>
                  <span style={{ background: cfg.bg, color: cfg.color, padding: '0.15rem 0.5rem', borderRadius: '10px', fontSize: '0.72rem', fontWeight: 700 }}>{catDocs.length}</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px,1fr))', gap: '0.75rem' }}>
                  {catDocs.map(doc => (
                    <div key={doc.id} style={{ background: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '1rem', transition: 'box-shadow 0.15s' }} onMouseOver={e => e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)'} onMouseOut={e => e.currentTarget.style.boxShadow = 'none'}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1, minWidth: 0 }}>
                          <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: cfg.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <FileText size={18} color={cfg.color} />
                          </div>
                          <div style={{ minWidth: 0 }}>
                            <p style={{ margin: 0, fontWeight: 700, fontSize: '0.875rem', color: '#0f172a', lineHeight: 1.3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{doc.title}</p>
                            <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>v{doc.version} · .{doc.file_type?.toUpperCase()}</span>
                          </div>
                        </div>
                        <button onClick={() => deleteDoc(doc.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', padding: '0.25rem', flexShrink: 0, marginLeft: '0.5rem' }}>
                          <Trash2 size={14} />
                        </button>
                      </div>
                      {doc.description && <p style={{ margin: '0.4rem 0 0.6rem', fontSize: '0.77rem', color: '#64748b', lineHeight: 1.4 }}>{doc.description}</p>}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
                        <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>{doc.uploaded_by && `By ${doc.uploaded_by}`}</span>
                        {doc.file_url ? (
                          <a href={doc.file_url} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', padding: '0.3rem 0.7rem', background: cfg.bg, color: cfg.color, borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700, textDecoration: 'none', border: `1px solid ${cfg.color}40` }}>
                            <ExternalLink size={12} /> Open
                          </a>
                        ) : <span style={{ fontSize: '0.72rem', color: '#cbd5e1' }}>No URL</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
