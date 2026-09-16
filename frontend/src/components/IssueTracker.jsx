import React, { useState, useEffect, useCallback } from 'react';
import { Plus, AlertTriangle, CheckCircle2, Clock, XCircle, Loader2, Trash2, RefreshCw, ChevronDown, Tag, User, MapPin, Edit3 } from 'lucide-react';

const API = ''; // Vite proxy: /api/* -> http://localhost:8000/*

const CATEGORY_CONFIG = {
  'RFI':          { color: '#3b82f6', bg: 'rgba(59,130,246,0.1)',   label: 'RFI',          desc: 'Request for Information' },
  'NCR':          { color: '#ef4444', bg: 'rgba(239,68,68,0.1)',    label: 'NCR',          desc: 'Non-Conformance Report' },
  'Snag':         { color: '#f59e0b', bg: 'rgba(245,158,11,0.1)',   label: 'Snag',         desc: 'Punch List Item' },
  'Risk':         { color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)',   label: 'Risk',         desc: 'Risk Register Entry' },
  'Change Order': { color: '#10b981', bg: 'rgba(16,185,129,0.1)',   label: 'Change Order', desc: 'Contract Variation' },
  'Defect':       { color: '#dc2626', bg: 'rgba(220,38,38,0.1)',    label: 'Defect',       desc: 'Quality Defect Report' },
};

const STATUS_CONFIG = {
  open:       { color: '#ef4444', bg: 'rgba(239,68,68,0.1)',    label: 'Open' },
  in_review:  { color: '#f59e0b', bg: 'rgba(245,158,11,0.1)',   label: 'In Review' },
  resolved:   { color: '#10b981', bg: 'rgba(16,185,129,0.1)',   label: 'Resolved' },
  closed:     { color: '#94a3b8', bg: 'rgba(148,163,184,0.1)',  label: 'Closed' },
};

function Badge({ cfg, label }) {
  return (
    <span style={{ fontSize: '0.72rem', fontWeight: 700, color: cfg.color, background: cfg.bg, padding: '0.2rem 0.55rem', borderRadius: '12px', border: `1px solid ${cfg.color}40` }}>
      {label || cfg.label}
    </span>
  );
}

export function IssueTracker({ portalRole = 'Site Engineer', projectId = 1, defaultCategory = '' }) {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [filterCat, setFilterCat] = useState(defaultCategory || '');
  const [filterStatus, setFilterStatus] = useState('');
  const [notification, setNotification] = useState(null);
  const [expandedId, setExpandedId] = useState(null);

  const [form, setForm] = useState({
    title: '', description: '', category: defaultCategory || 'RFI',
    priority: 'medium', zone: '', raised_by: '', raised_by_role: portalRole,
    assigned_to: '', project_id: projectId,
  });

  const showMsg = (msg, type = 'success') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3500);
  };

  const fetchIssues = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ project_id: projectId });
      if (filterCat) params.append('category', filterCat);
      if (filterStatus) params.append('status', filterStatus);
      const res = await fetch(`${API}/api/issues/?${params}`);
      if (res.ok) setIssues(await res.json());
    } catch { } finally { setLoading(false); }
  }, [projectId, filterCat, filterStatus]);

  useEffect(() => { fetchIssues(); }, [fetchIssues]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    try {
      const res = await fetch(`${API}/api/issues/`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, raised_by_role: portalRole, project_id: projectId }),
      });
      if (res.ok) {
        const issue = await res.json();
        setIssues(prev => [issue, ...prev]);
        setForm({ title: '', description: '', category: defaultCategory || 'RFI', priority: 'medium', zone: '', raised_by: '', raised_by_role: portalRole, assigned_to: '', project_id: projectId });
        setShowForm(false);
        showMsg(`✅ ${issue.category} #${issue.id} raised: "${issue.title}"`);
      }
    } catch { showMsg('Failed to raise issue', 'error'); }
  };

  const updateStatus = async (issueId, newStatus) => {
    try {
      const res = await fetch(`${API}/api/issues/${issueId}`, {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        const updated = await res.json();
        setIssues(prev => prev.map(i => i.id === issueId ? updated : i));
        showMsg(`Issue status updated to ${STATUS_CONFIG[newStatus]?.label}`);
      }
    } catch { showMsg('Failed to update', 'error'); }
  };

  const deleteIssue = async (id) => {
    if (!window.confirm('Delete this issue?')) return;
    try {
      await fetch(`${API}/api/issues/${id}`, { method: 'DELETE' });
      setIssues(prev => prev.filter(i => i.id !== id));
      showMsg('Issue deleted');
    } catch { showMsg('Delete failed', 'error'); }
  };

  const stats = {
    total: issues.length,
    open: issues.filter(i => i.status === 'open').length,
    in_review: issues.filter(i => i.status === 'in_review').length,
    resolved: issues.filter(i => i.status === 'resolved').length,
  };

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
          <h2 style={{ margin: 0, fontSize: '1.35rem', fontWeight: 800, color: '#0f172a' }}>Issue & RFI Tracker</h2>
          <p style={{ margin: '0.25rem 0 0', color: '#64748b', fontSize: '0.85rem' }}>RFIs · NCRs · Snags · Risks · Change Orders · {portalRole}</p>
        </div>
        <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <select value={filterCat} onChange={e => setFilterCat(e.target.value)} style={{ padding: '0.5rem 0.75rem', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.82rem', cursor: 'pointer', color: '#475569' }}>
            <option value="">All Types</option>
            {Object.entries(CATEGORY_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
          </select>
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={{ padding: '0.5rem 0.75rem', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.82rem', cursor: 'pointer', color: '#475569' }}>
            <option value="">All Statuses</option>
            {Object.entries(STATUS_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
          </select>
          <button onClick={fetchIssues} style={{ padding: '0.5rem', borderRadius: '8px', border: '1px solid #e2e8f0', background: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
            <RefreshCw size={16} color={loading ? '#6366f1' : '#64748b'} />
          </button>
          <button onClick={() => setShowForm(!showForm)} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'linear-gradient(135deg,#ef4444,#dc2626)', color: 'white', padding: '0.55rem 1.1rem', borderRadius: '10px', border: 'none', fontWeight: 700, fontSize: '0.875rem', cursor: 'pointer', boxShadow: '0 4px 12px rgba(239,68,68,0.35)' }}>
            <Plus size={16} /> Raise Issue
          </button>
        </div>
      </div>

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '0.75rem', marginBottom: '1.5rem' }}>
        {[['total', '#6366f1', 'Total'], ['open', '#ef4444', 'Open'], ['in_review', '#f59e0b', 'In Review'], ['resolved', '#10b981', 'Resolved']].map(([k, col, label]) => (
          <div key={k} style={{ background: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', borderTop: `3px solid ${col}`, padding: '1rem', textAlign: 'center' }}>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: col }}>{stats[k]}</div>
            <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Category Summary */}
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
        {Object.entries(CATEGORY_CONFIG).map(([cat, cfg]) => {
          const count = issues.filter(i => i.category === cat).length;
          return count > 0 ? (
            <button key={cat} onClick={() => setFilterCat(filterCat === cat ? '' : cat)} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.35rem 0.75rem', borderRadius: '20px', border: `1px solid ${filterCat === cat ? cfg.color : '#e2e8f0'}`, background: filterCat === cat ? cfg.bg : 'white', color: cfg.color, fontWeight: 700, fontSize: '0.78rem', cursor: 'pointer' }}>
              {cfg.label} <span style={{ background: cfg.color, color: 'white', borderRadius: '50%', width: '18px', height: '18px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem' }}>{count}</span>
            </button>
          ) : null;
        })}
      </div>

      {/* Form */}
      {showForm && (
        <div style={{ background: '#f8fafc', borderRadius: '14px', border: '1px solid #e2e8f0', padding: '1.5rem', marginBottom: '1.5rem' }}>
          <h3 style={{ margin: '0 0 1rem', fontSize: '1rem', fontWeight: 700 }}>Raise New Issue / RFI</h3>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div style={{ gridColumn: '1/-1' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '0.4rem' }}>Title *</label>
                <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="e.g. Rebar spacing discrepancy in Zone A column" required style={{ width: '100%', padding: '0.65rem 0.875rem', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '0.875rem', outline: 'none', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '0.4rem' }}>Type</label>
                <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} style={{ width: '100%', padding: '0.65rem 0.875rem', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '0.875rem', cursor: 'pointer' }}>
                  {Object.entries(CATEGORY_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.label} — {v.desc}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '0.4rem' }}>Priority</label>
                <select value={form.priority} onChange={e => setForm(f => ({ ...f, priority: e.target.value }))} style={{ width: '100%', padding: '0.65rem 0.875rem', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '0.875rem', cursor: 'pointer' }}>
                  {['low','medium','high','critical'].map(p => <option key={p} value={p}>{p.charAt(0).toUpperCase()+p.slice(1)}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '0.4rem' }}>Zone / Location</label>
                <input value={form.zone} onChange={e => setForm(f => ({ ...f, zone: e.target.value }))} placeholder="Zone B, Floor 4..." style={{ width: '100%', padding: '0.65rem 0.875rem', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '0.875rem', outline: 'none', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '0.4rem' }}>Raised By (Name)</label>
                <input value={form.raised_by} onChange={e => setForm(f => ({ ...f, raised_by: e.target.value }))} placeholder="Your name" style={{ width: '100%', padding: '0.65rem 0.875rem', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '0.875rem', outline: 'none', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '0.4rem' }}>Assign To (Email)</label>
                <input value={form.assigned_to} onChange={e => setForm(f => ({ ...f, assigned_to: e.target.value }))} placeholder="reviewer@company.com" style={{ width: '100%', padding: '0.65rem 0.875rem', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '0.875rem', outline: 'none', boxSizing: 'border-box' }} />
              </div>
              <div style={{ gridColumn: '1/-1' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '0.4rem' }}>Description / Details</label>
                <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={3} placeholder="Describe the issue in detail — include measurements, observations, photos reference..." style={{ width: '100%', padding: '0.65rem 0.875rem', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '0.875rem', outline: 'none', resize: 'vertical', fontFamily: 'inherit', boxSizing: 'border-box' }} />
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
              <button type="button" onClick={() => setShowForm(false)} style={{ padding: '0.6rem 1.25rem', borderRadius: '8px', border: '1px solid #e2e8f0', background: 'white', color: '#64748b', cursor: 'pointer', fontWeight: 600, fontSize: '0.875rem' }}>Cancel</button>
              <button type="submit" style={{ padding: '0.6rem 1.5rem', borderRadius: '8px', border: 'none', background: 'linear-gradient(135deg,#ef4444,#dc2626)', color: 'white', cursor: 'pointer', fontWeight: 700, fontSize: '0.875rem' }}>Raise Issue</button>
            </div>
          </form>
        </div>
      )}

      {/* Issue List */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
          <Loader2 size={32} className="animate-spin" style={{ margin: '0 auto 1rem', color: '#6366f1', display: 'block' }} />
          <p style={{ margin: 0 }}>Loading issues...</p>
        </div>
      ) : issues.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem 2rem', border: '2px dashed #e2e8f0', borderRadius: '14px', background: '#f8fafc' }}>
          <AlertTriangle size={40} color="#cbd5e1" style={{ margin: '0 auto 1rem', display: 'block' }} />
          <h4 style={{ margin: '0 0 0.5rem', color: '#475569' }}>No Issues Raised</h4>
          <p style={{ margin: '0 0 1.5rem', color: '#94a3b8', fontSize: '0.9rem' }}>All clear! Click "Raise Issue" to log an RFI, NCR, Snag, or Risk.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
          {issues.map(issue => {
            const catCfg = CATEGORY_CONFIG[issue.category] || CATEGORY_CONFIG['RFI'];
            const staCfg = STATUS_CONFIG[issue.status] || STATUS_CONFIG.open;
            const isExpanded = expandedId === issue.id;
            return (
              <div key={issue.id} style={{ background: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', borderLeft: `4px solid ${catCfg.color}`, overflow: 'hidden' }}>
                <div style={{ padding: '1rem 1.25rem', display: 'flex', alignItems: 'flex-start', gap: '1rem', cursor: 'pointer' }} onClick={() => setExpandedId(isExpanded ? null : issue.id)}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center', marginBottom: '0.3rem' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.94rem', color: '#0f172a' }}>{issue.title}</span>
                      <Badge cfg={catCfg} />
                      <Badge cfg={staCfg} />
                    </div>
                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                      {issue.zone && <span style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '0.25rem' }}><MapPin size={11} />{issue.zone}</span>}
                      {issue.raised_by && <span style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '0.25rem' }}><User size={11} />Raised by: {issue.raised_by}</span>}
                      <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>#{issue.id} · {new Date(issue.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
                    <select value={issue.status} onClick={e => e.stopPropagation()} onChange={e => updateStatus(issue.id, e.target.value)} style={{ padding: '0.35rem 0.6rem', borderRadius: '6px', border: '1px solid #e2e8f0', fontSize: '0.78rem', cursor: 'pointer', color: staCfg.color, background: staCfg.bg, fontWeight: 600 }}>
                      {Object.entries(STATUS_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                    </select>
                    <button onClick={e => { e.stopPropagation(); deleteIssue(issue.id); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', padding: '0.25rem' }}>
                      <Trash2 size={14} />
                    </button>
                    <ChevronDown size={16} color="#94a3b8" style={{ transform: isExpanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                  </div>
                </div>
                {isExpanded && issue.description && (
                  <div style={{ padding: '0 1.25rem 1rem', borderTop: '1px solid #f1f5f9' }}>
                    <p style={{ margin: '0.75rem 0 0', fontSize: '0.875rem', color: '#475569', lineHeight: 1.6 }}>{issue.description}</p>
                    {issue.assigned_to && <p style={{ margin: '0.5rem 0 0', fontSize: '0.78rem', color: '#94a3b8' }}>Assigned to: {issue.assigned_to}</p>}
                    {issue.resolution && <div style={{ marginTop: '0.75rem', padding: '0.75rem', background: '#f0fdf4', borderRadius: '8px', border: '1px solid #bbf7d0' }}><span style={{ fontSize: '0.78rem', fontWeight: 600, color: '#059669' }}>Resolution: </span><span style={{ fontSize: '0.82rem', color: '#166534' }}>{issue.resolution}</span></div>}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
