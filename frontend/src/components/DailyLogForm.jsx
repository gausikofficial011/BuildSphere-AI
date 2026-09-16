import React, { useState, useEffect, useCallback } from 'react';
import { ClipboardList, Sun, Cloud, CloudRain, Wind, Plus, Loader2, RefreshCw, Users, Calendar, MapPin, ChevronDown } from 'lucide-react';

const API = ''; // Vite proxy: /api/* -> http://localhost:8000/*

const WEATHER_OPTIONS = [
  { value: 'Clear', icon: '☀️', label: 'Clear' },
  { value: 'Partly Cloudy', icon: '⛅', label: 'Partly Cloudy' },
  { value: 'Cloudy', icon: '☁️', label: 'Cloudy' },
  { value: 'Rainy', icon: '🌧️', label: 'Rainy' },
  { value: 'Heavy Rain', icon: '⛈️', label: 'Heavy Rain' },
  { value: 'Windy', icon: '💨', label: 'Windy' },
  { value: 'Hot & Humid', icon: '🌡️', label: 'Hot & Humid' },
];

export function DailyLogForm({ portalRole = 'Site Engineer', projectId = 1 }) {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [expandedLogId, setExpandedLogId] = useState(null);
  const [notification, setNotification] = useState(null);

  const today = new Date().toISOString().split('T')[0];

  const [form, setForm] = useState({
    log_date: today,
    zone: '',
    weather: 'Clear',
    workforce_engineers: '',
    workforce_supervisors: '',
    workforce_skilled: '',
    workforce_unskilled: '',
    workforce_operators: '',
    activities: '',
    materials_received: '',
    issues_noted: '',
    submitted_by: '',
    submitted_role: portalRole,
    project_id: projectId,
  });

  const showMsg = (msg, type = 'success') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3500);
  };

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/daily-logs/?project_id=${projectId}`);
      if (res.ok) setLogs(await res.json());
    } catch { } finally { setLoading(false); }
  }, [projectId]);

  useEffect(() => { fetchLogs(); }, [fetchLogs]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.log_date) return;
    setSubmitting(true);
    try {
      const payload = {
        ...form,
        workforce_engineers: parseInt(form.workforce_engineers) || 0,
        workforce_supervisors: parseInt(form.workforce_supervisors) || 0,
        workforce_skilled: parseInt(form.workforce_skilled) || 0,
        workforce_unskilled: parseInt(form.workforce_unskilled) || 0,
        workforce_operators: parseInt(form.workforce_operators) || 0,
        project_id: projectId,
        submitted_role: portalRole,
      };
      const res = await fetch(`${API}/api/daily-logs/`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        const log = await res.json();
        setLogs(prev => [log, ...prev]);
        setShowForm(false);
        setForm({ log_date: today, zone: '', weather: 'Clear', workforce_engineers: '', workforce_supervisors: '', workforce_skilled: '', workforce_unskilled: '', workforce_operators: '', activities: '', materials_received: '', issues_noted: '', submitted_by: '', submitted_role: portalRole, project_id: projectId });
        showMsg(`✅ Daily site log submitted for ${log.log_date} — ${log.zone || 'Site'}`);
      }
    } catch { showMsg('Failed to submit log. Ensure server is running.', 'error'); } finally { setSubmitting(false); }
  };

  const totalWorkforce = (log) =>
    (log.workforce_engineers || 0) + (log.workforce_supervisors || 0) +
    (log.workforce_skilled || 0) + (log.workforce_unskilled || 0) + (log.workforce_operators || 0);

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
          <h2 style={{ margin: 0, fontSize: '1.35rem', fontWeight: 800, color: '#0f172a' }}>Daily Site Log</h2>
          <p style={{ margin: '0.25rem 0 0', color: '#64748b', fontSize: '0.85rem' }}>Site diary · progress reporting · workforce tracking · {portalRole}</p>
        </div>
        <div style={{ display: 'flex', gap: '0.6rem' }}>
          <button onClick={fetchLogs} style={{ padding: '0.5rem', borderRadius: '8px', border: '1px solid #e2e8f0', background: 'white', cursor: 'pointer' }}>
            <RefreshCw size={16} color={loading ? '#6366f1' : '#64748b'} />
          </button>
          <button onClick={() => setShowForm(!showForm)} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'linear-gradient(135deg,#10b981,#059669)', color: 'white', padding: '0.55rem 1.1rem', borderRadius: '10px', border: 'none', fontWeight: 700, fontSize: '0.875rem', cursor: 'pointer', boxShadow: '0 4px 12px rgba(16,185,129,0.35)' }}>
            <Plus size={16} /> Submit Daily Log
          </button>
        </div>
      </div>

      {/* Summary Strip */}
      {logs.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '0.75rem', marginBottom: '1.5rem' }}>
          <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', borderTop: '3px solid #3b82f6', padding: '1rem', textAlign: 'center' }}>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#3b82f6' }}>{logs.length}</div>
            <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>Total Logs</div>
          </div>
          <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', borderTop: '3px solid #10b981', padding: '1rem', textAlign: 'center' }}>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#10b981' }}>{totalWorkforce(logs[0])}</div>
            <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>Today's Workforce</div>
          </div>
          <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', borderTop: '3px solid #f59e0b', padding: '1rem', textAlign: 'center' }}>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#f59e0b' }}>{Math.round(logs.reduce((acc, l) => acc + totalWorkforce(l), 0) / logs.length)}</div>
            <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>Avg Workforce</div>
          </div>
        </div>
      )}

      {/* Submission Form */}
      {showForm && (
        <div style={{ background: '#f8fafc', borderRadius: '14px', border: '1px solid #e2e8f0', padding: '1.5rem', marginBottom: '1.5rem' }}>
          <h3 style={{ margin: '0 0 1.25rem', fontSize: '1rem', fontWeight: 700, color: '#0f172a' }}>📋 Submit Daily Site Log</h3>
          <form onSubmit={handleSubmit}>
            {/* Date, Zone, Weather */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '0.4rem' }}>Log Date *</label>
                <input type="date" value={form.log_date} onChange={e => setForm(f => ({ ...f, log_date: e.target.value }))} required style={{ width: '100%', padding: '0.65rem 0.875rem', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '0.875rem', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '0.4rem' }}>Zone / Area</label>
                <input value={form.zone} onChange={e => setForm(f => ({ ...f, zone: e.target.value }))} placeholder="e.g. Zone B, Block 3, Floor 8" style={{ width: '100%', padding: '0.65rem 0.875rem', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '0.875rem', outline: 'none', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '0.4rem' }}>Weather</label>
                <select value={form.weather} onChange={e => setForm(f => ({ ...f, weather: e.target.value }))} style={{ width: '100%', padding: '0.65rem 0.875rem', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '0.875rem', cursor: 'pointer' }}>
                  {WEATHER_OPTIONS.map(w => <option key={w.value} value={w.value}>{w.icon} {w.label}</option>)}
                </select>
              </div>
            </div>

            {/* Workforce */}
            <div style={{ background: 'white', borderRadius: '10px', border: '1px solid #e2e8f0', padding: '1rem', marginBottom: '1rem' }}>
              <h4 style={{ margin: '0 0 0.75rem', fontSize: '0.875rem', fontWeight: 700, color: '#374151', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Users size={15} /> Workforce Count</h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: '0.75rem' }}>
                {[['workforce_engineers','Engineers'],['workforce_supervisors','Supervisors'],['workforce_skilled','Skilled Workers'],['workforce_unskilled','Unskilled'],['workforce_operators','Operators']].map(([field, label]) => (
                  <div key={field}>
                    <label style={{ fontSize: '0.72rem', fontWeight: 600, color: '#64748b', display: 'block', marginBottom: '0.3rem' }}>{label}</label>
                    <input type="number" min="0" value={form[field]} onChange={e => setForm(f => ({ ...f, [field]: e.target.value }))} placeholder="0" style={{ width: '100%', padding: '0.55rem 0.65rem', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '0.875rem', outline: 'none', boxSizing: 'border-box', textAlign: 'center' }} />
                  </div>
                ))}
              </div>
            </div>

            {/* Activities, Materials, Issues */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '0.4rem' }}>Work Activities Performed *</label>
                <textarea value={form.activities} onChange={e => setForm(f => ({ ...f, activities: e.target.value }))} rows={4} placeholder="Describe all construction activities carried out today — concrete pours, formwork, rebar, MEP, finishing, etc." style={{ width: '100%', padding: '0.65rem 0.875rem', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '0.875rem', outline: 'none', resize: 'vertical', fontFamily: 'inherit', boxSizing: 'border-box' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '0.4rem' }}>Materials Received</label>
                  <textarea value={form.materials_received} onChange={e => setForm(f => ({ ...f, materials_received: e.target.value }))} rows={2} placeholder="e.g. 45 tons TMT rebar (ASTM A615), 200 bags OPC cement..." style={{ width: '100%', padding: '0.65rem 0.875rem', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '0.875rem', outline: 'none', resize: 'vertical', fontFamily: 'inherit', boxSizing: 'border-box' }} />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '0.4rem' }}>Issues / Delays Noted</label>
                  <textarea value={form.issues_noted} onChange={e => setForm(f => ({ ...f, issues_noted: e.target.value }))} rows={2} placeholder="Any delays, obstructions, quality concerns, or safety incidents..." style={{ width: '100%', padding: '0.65rem 0.875rem', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '0.875rem', outline: 'none', resize: 'vertical', fontFamily: 'inherit', boxSizing: 'border-box' }} />
                </div>
              </div>
            </div>

            {/* Submitted By */}
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '0.4rem' }}>Submitted By</label>
              <input value={form.submitted_by} onChange={e => setForm(f => ({ ...f, submitted_by: e.target.value }))} placeholder="Your full name" style={{ width: '100%', padding: '0.65rem 0.875rem', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '0.875rem', outline: 'none', boxSizing: 'border-box' }} />
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
              <button type="button" onClick={() => setShowForm(false)} style={{ padding: '0.6rem 1.25rem', borderRadius: '8px', border: '1px solid #e2e8f0', background: 'white', color: '#64748b', cursor: 'pointer', fontWeight: 600, fontSize: '0.875rem' }}>Cancel</button>
              <button type="submit" disabled={submitting} style={{ padding: '0.6rem 1.5rem', borderRadius: '8px', border: 'none', background: submitting ? '#94a3b8' : 'linear-gradient(135deg,#10b981,#059669)', color: 'white', cursor: submitting ? 'not-allowed' : 'pointer', fontWeight: 700, fontSize: '0.875rem' }}>
                {submitting ? 'Submitting...' : 'Submit Site Log'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Log History */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
          <Loader2 size={32} style={{ margin: '0 auto 1rem', display: 'block', color: '#6366f1' }} />
          <p style={{ margin: 0 }}>Loading site logs...</p>
        </div>
      ) : logs.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem 2rem', border: '2px dashed #e2e8f0', borderRadius: '14px', background: '#f8fafc' }}>
          <ClipboardList size={40} color="#cbd5e1" style={{ margin: '0 auto 1rem', display: 'block' }} />
          <h4 style={{ margin: '0 0 0.5rem', color: '#475569' }}>No Daily Logs Yet</h4>
          <p style={{ margin: '0 0 1.5rem', color: '#94a3b8', fontSize: '0.9rem' }}>Submit your first daily site log to track progress, workforce and activities.</p>
          <button onClick={() => setShowForm(true)} style={{ background: 'linear-gradient(135deg,#10b981,#059669)', color: 'white', padding: '0.6rem 1.5rem', borderRadius: '10px', border: 'none', fontWeight: 700, cursor: 'pointer' }}>Submit First Log</button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
          {logs.map(log => {
            const wf = totalWorkforce(log);
            const isExpanded = expandedLogId === log.id;
            const weatherIcon = WEATHER_OPTIONS.find(w => w.value === log.weather)?.icon || '🌤️';
            return (
              <div key={log.id} style={{ background: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', borderLeft: '4px solid #10b981', overflow: 'hidden' }}>
                <div style={{ padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer' }} onClick={() => setExpandedLogId(isExpanded ? null : log.id)}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.95rem', color: '#0f172a' }}>📅 {log.log_date}</span>
                      {log.zone && <span style={{ fontSize: '0.78rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.2rem' }}><MapPin size={11} />{log.zone}</span>}
                      <span style={{ fontSize: '0.78rem' }}>{weatherIcon} {log.weather}</span>
                      <span style={{ fontSize: '0.78rem', color: '#059669', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.2rem' }}><Users size={11} />{wf} on site</span>
                    </div>
                    {log.submitted_by && <p style={{ margin: '0.25rem 0 0', fontSize: '0.75rem', color: '#94a3b8' }}>Submitted by: {log.submitted_by} · {log.submitted_role}</p>}
                  </div>
                  <ChevronDown size={16} color="#94a3b8" style={{ transform: isExpanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', flexShrink: 0 }} />
                </div>
                {isExpanded && (
                  <div style={{ padding: '0 1.25rem 1.25rem', borderTop: '1px solid #f1f5f9' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: '0.5rem', marginTop: '0.75rem', marginBottom: '1rem' }}>
                      {[['Engineers', log.workforce_engineers],['Supervisors', log.workforce_supervisors],['Skilled', log.workforce_skilled],['Unskilled', log.workforce_unskilled],['Operators', log.workforce_operators]].map(([label, val]) => (
                        <div key={label} style={{ background: '#f8fafc', borderRadius: '8px', padding: '0.5rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>
                          <div style={{ fontWeight: 800, fontSize: '1.1rem', color: '#0f172a' }}>{val}</div>
                          <div style={{ fontSize: '0.7rem', color: '#64748b' }}>{label}</div>
                        </div>
                      ))}
                    </div>
                    {log.activities && <><div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#374151', marginBottom: '0.3rem' }}>Activities:</div><p style={{ margin: '0 0 0.75rem', fontSize: '0.83rem', color: '#475569', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>{log.activities}</p></>}
                    {log.materials_received && <><div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#374151', marginBottom: '0.3rem' }}>Materials Received:</div><p style={{ margin: '0 0 0.75rem', fontSize: '0.83rem', color: '#475569', lineHeight: 1.6 }}>{log.materials_received}</p></>}
                    {log.issues_noted && <><div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#ef4444', marginBottom: '0.3rem' }}>⚠️ Issues / Delays:</div><p style={{ margin: 0, fontSize: '0.83rem', color: '#991b1b', lineHeight: 1.6, background: '#fef2f2', padding: '0.6rem 0.875rem', borderRadius: '8px', border: '1px solid #fecaca' }}>{log.issues_noted}</p></>}
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
