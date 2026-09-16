import React, { useState, useEffect, useCallback } from 'react';
import { Plus, CheckCircle2, Clock, AlertCircle, X, ChevronDown, Filter, RefreshCw, Loader2, Trash2, Edit3, Save, User, Calendar, MapPin, Flag } from 'lucide-react';

const API = ''; // Vite proxy: /api/* -> http://localhost:8000/*

const PRIORITY_CONFIG = {
  low:      { color: '#10b981', bg: 'rgba(16,185,129,0.15)', label: 'Low' },
  medium:   { color: '#f59e0b', bg: 'rgba(245,158,11,0.15)',  label: 'Medium' },
  high:     { color: '#ef4444', bg: 'rgba(239,68,68,0.15)',   label: 'High' },
  critical: { color: '#dc2626', bg: 'rgba(220,38,38,0.25)',   label: 'Critical' },
};

const STATUS_CONFIG = {
  todo:        { color: '#94a3b8', bg: 'rgba(148,163,184,0.15)', label: 'To Do',       icon: '○' },
  in_progress: { color: '#3b82f6', bg: 'rgba(59,130,246,0.15)',  label: 'In Progress', icon: '◑' },
  done:        { color: '#10b981', bg: 'rgba(16,185,129,0.15)',  label: 'Done',        icon: '●' },
  blocked:     { color: '#ef4444', bg: 'rgba(239,68,68,0.15)',   label: 'Blocked',     icon: '✕' },
};

function Badge({ config, value }) {
  const cfg = config[value] || { color: '#94a3b8', bg: 'rgba(148,163,184,0.1)', label: value };
  return (
    <span style={{ fontSize: '0.72rem', fontWeight: 700, color: cfg.color, background: cfg.bg, padding: '0.2rem 0.55rem', borderRadius: '12px', border: `1px solid ${cfg.color}40`, whiteSpace: 'nowrap' }}>
      {cfg.icon && `${cfg.icon} `}{cfg.label}
    </span>
  );
}

export function TaskManager({ portalRole = 'Construction Manager', projectId = 1, userEmail = '' }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [filterStatus, setFilterStatus] = useState('');
  const [filterPriority, setFilterPriority] = useState('');
  const [editingTask, setEditingTask] = useState(null);
  const [notification, setNotification] = useState(null);

  const [form, setForm] = useState({
    title: '', description: '', priority: 'medium',
    zone: '', due_date: '', assignee_email: '',
  });

  const showMsg = (msg, type = 'success') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3500);
  };

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ project_id: projectId });
      if (filterStatus) params.append('status', filterStatus);
      if (filterPriority) params.append('priority', filterPriority);
      const res = await fetch(`${API}/api/tasks/?${params}`);
      if (res.ok) setTasks(await res.json());
    } catch {
      // Keep existing tasks on error
    } finally {
      setLoading(false);
    }
  }, [projectId, filterStatus, filterPriority]);

  useEffect(() => { fetchTasks(); }, [fetchTasks]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    try {
      const res = await fetch(`${API}/api/tasks/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, project_id: projectId, author_role: portalRole }),
      });
      if (res.ok) {
        const task = await res.json();
        setTasks(prev => [task, ...prev]);
        setForm({ title: '', description: '', priority: 'medium', zone: '', due_date: '', assignee_email: '' });
        setShowForm(false);
        showMsg(`✅ Task "${task.title}" created successfully`);
      }
    } catch { showMsg('Failed to create task. Please try again.', 'error'); }
  };

  const updateStatus = async (taskId, newStatus) => {
    try {
      const res = await fetch(`${API}/api/tasks/${taskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        const updated = await res.json();
        setTasks(prev => prev.map(t => t.id === taskId ? updated : t));
        showMsg(`Task moved to ${STATUS_CONFIG[newStatus]?.label}`);
      }
    } catch { showMsg('Failed to update task', 'error'); }
  };

  const deleteTask = async (taskId) => {
    if (!window.confirm('Delete this task?')) return;
    try {
      await fetch(`${API}/api/tasks/${taskId}`, { method: 'DELETE' });
      setTasks(prev => prev.filter(t => t.id !== taskId));
      showMsg('Task deleted');
    } catch { showMsg('Failed to delete task', 'error'); }
  };

  const statCounts = {
    todo: tasks.filter(t => t.status === 'todo').length,
    in_progress: tasks.filter(t => t.status === 'in_progress').length,
    done: tasks.filter(t => t.status === 'done').length,
    blocked: tasks.filter(t => t.status === 'blocked').length,
  };

  return (
    <div style={{ fontFamily: 'Inter, system-ui, sans-serif', color: '#1e293b' }}>
      {/* Notification */}
      {notification && (
        <div style={{ position: 'fixed', bottom: '1.5rem', right: '1.5rem', zIndex: 9999, background: notification.type === 'error' ? '#dc2626' : '#059669', color: 'white', padding: '0.85rem 1.5rem', borderRadius: '12px', fontWeight: 600, fontSize: '0.9rem', boxShadow: '0 8px 25px rgba(0,0,0,0.2)' }}>
          {notification.msg}
        </div>
      )}

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '1.35rem', fontWeight: 800, color: '#0f172a' }}>Task Manager</h2>
          <p style={{ margin: '0.25rem 0 0', color: '#64748b', fontSize: '0.85rem' }}>Active work items · {portalRole}</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          {/* Filters */}
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={{ padding: '0.5rem 0.75rem', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.82rem', color: '#475569', cursor: 'pointer' }}>
            <option value="">All Statuses</option>
            {Object.entries(STATUS_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
          </select>
          <select value={filterPriority} onChange={e => setFilterPriority(e.target.value)} style={{ padding: '0.5rem 0.75rem', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.82rem', color: '#475569', cursor: 'pointer' }}>
            <option value="">All Priorities</option>
            {Object.entries(PRIORITY_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
          </select>
          <button onClick={fetchTasks} style={{ padding: '0.5rem', borderRadius: '8px', border: '1px solid #e2e8f0', background: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <RefreshCw size={16} color={loading ? '#3b82f6' : '#64748b'} className={loading ? 'animate-spin' : ''} />
          </button>
          <button onClick={() => setShowForm(!showForm)} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'linear-gradient(135deg, #6366f1, #4f46e5)', color: 'white', padding: '0.55rem 1.1rem', borderRadius: '10px', border: 'none', fontWeight: 700, fontSize: '0.875rem', cursor: 'pointer', boxShadow: '0 4px 12px rgba(99,102,241,0.4)' }}>
            <Plus size={16} /> New Task
          </button>
        </div>
      </div>

      {/* KPI row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '0.75rem', marginBottom: '1.5rem' }}>
        {Object.entries(statCounts).map(([status, count]) => {
          const cfg = STATUS_CONFIG[status];
          return (
            <div key={status} onClick={() => setFilterStatus(filterStatus === status ? '' : status)} style={{ background: filterStatus === status ? cfg.bg : 'white', border: `1px solid ${filterStatus === status ? cfg.color : '#e2e8f0'}`, borderRadius: '12px', padding: '1rem', cursor: 'pointer', transition: 'all 0.2s', textAlign: 'center' }}>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: cfg.color }}>{count}</div>
              <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600, marginTop: '0.2rem' }}>{cfg.label}</div>
            </div>
          );
        })}
      </div>

      {/* Create Form */}
      {showForm && (
        <div style={{ background: '#f8fafc', borderRadius: '14px', border: '1px solid #e2e8f0', padding: '1.5rem', marginBottom: '1.5rem' }}>
          <h3 style={{ margin: '0 0 1rem', fontSize: '1rem', fontWeight: 700, color: '#0f172a' }}>Create New Task</h3>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div style={{ gridColumn: '1/-1' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '0.4rem' }}>Task Title *</label>
                <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="e.g. Inspect Zone B shear wall reinforcement" required style={{ width: '100%', padding: '0.65rem 0.875rem', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '0.875rem', outline: 'none', boxSizing: 'border-box' }} onFocus={e => e.target.style.borderColor = '#6366f1'} onBlur={e => e.target.style.borderColor = '#d1d5db'} />
              </div>
              <div style={{ gridColumn: '1/-1' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '0.4rem' }}>Description</label>
                <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={2} placeholder="Add task details, specifications, or acceptance criteria..." style={{ width: '100%', padding: '0.65rem 0.875rem', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '0.875rem', outline: 'none', resize: 'vertical', fontFamily: 'inherit', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '0.4rem' }}>Priority</label>
                <select value={form.priority} onChange={e => setForm(f => ({ ...f, priority: e.target.value }))} style={{ width: '100%', padding: '0.65rem 0.875rem', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '0.875rem', cursor: 'pointer' }}>
                  {Object.entries(PRIORITY_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '0.4rem' }}>Zone / Location</label>
                <input value={form.zone} onChange={e => setForm(f => ({ ...f, zone: e.target.value }))} placeholder="e.g. Zone B, Floor 12, Grid C-5" style={{ width: '100%', padding: '0.65rem 0.875rem', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '0.875rem', outline: 'none', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '0.4rem' }}>Due Date</label>
                <input type="date" value={form.due_date} onChange={e => setForm(f => ({ ...f, due_date: e.target.value }))} style={{ width: '100%', padding: '0.65rem 0.875rem', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '0.875rem', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '0.4rem' }}>Assignee Email</label>
                <input value={form.assignee_email} onChange={e => setForm(f => ({ ...f, assignee_email: e.target.value }))} placeholder="engineer@company.com" style={{ width: '100%', padding: '0.65rem 0.875rem', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '0.875rem', outline: 'none', boxSizing: 'border-box' }} />
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
              <button type="button" onClick={() => setShowForm(false)} style={{ padding: '0.6rem 1.25rem', borderRadius: '8px', border: '1px solid #e2e8f0', background: 'white', color: '#64748b', cursor: 'pointer', fontWeight: 600, fontSize: '0.875rem' }}>Cancel</button>
              <button type="submit" style={{ padding: '0.6rem 1.5rem', borderRadius: '8px', border: 'none', background: 'linear-gradient(135deg,#6366f1,#4f46e5)', color: 'white', cursor: 'pointer', fontWeight: 700, fontSize: '0.875rem' }}>Create Task</button>
            </div>
          </form>
        </div>
      )}

      {/* Tasks List */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
          <Loader2 size={32} className="animate-spin" style={{ margin: '0 auto 1rem', color: '#6366f1', display: 'block' }} />
          <p style={{ margin: 0 }}>Loading tasks from server...</p>
        </div>
      ) : tasks.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem 2rem', border: '2px dashed #e2e8f0', borderRadius: '14px', background: '#f8fafc' }}>
          <CheckCircle2 size={40} color="#cbd5e1" style={{ margin: '0 auto 1rem', display: 'block' }} />
          <h4 style={{ margin: '0 0 0.5rem', color: '#475569', fontSize: '1.1rem' }}>No Tasks Yet</h4>
          <p style={{ margin: '0 0 1.5rem', color: '#94a3b8', fontSize: '0.9rem' }}>Click "New Task" to create your first work item for {portalRole}.</p>
          <button onClick={() => setShowForm(true)} style={{ background: 'linear-gradient(135deg,#6366f1,#4f46e5)', color: 'white', padding: '0.6rem 1.5rem', borderRadius: '10px', border: 'none', fontWeight: 700, cursor: 'pointer' }}>
            + Create First Task
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {tasks.map(task => {
            const priCfg = PRIORITY_CONFIG[task.priority] || PRIORITY_CONFIG.medium;
            const staCfg = STATUS_CONFIG[task.status] || STATUS_CONFIG.todo;
            return (
              <div key={task.id} style={{ background: 'white', borderRadius: '12px', border: `1px solid #e2e8f0`, borderLeft: `4px solid ${priCfg.color}`, padding: '1rem 1.25rem', display: 'flex', alignItems: 'flex-start', gap: '1rem', transition: 'box-shadow 0.15s' }} onMouseOver={e => e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)'} onMouseOut={e => e.currentTarget.style.boxShadow = 'none'}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap', marginBottom: '0.35rem' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.95rem', color: '#0f172a' }}>{task.title}</span>
                    <Badge config={STATUS_CONFIG} value={task.status} />
                    <Badge config={PRIORITY_CONFIG} value={task.priority} />
                  </div>
                  {task.description && <p style={{ margin: '0 0 0.5rem', fontSize: '0.83rem', color: '#64748b', lineHeight: 1.5 }}>{task.description}</p>}
                  <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    {task.zone && <span style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '0.25rem' }}><MapPin size={12} />{task.zone}</span>}
                    {task.due_date && <span style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Calendar size={12} />{task.due_date}</span>}
                    {task.assignee_email && <span style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '0.25rem' }}><User size={12} />{task.assignee_email}</span>}
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', alignItems: 'flex-end', flexShrink: 0 }}>
                  <select value={task.status} onChange={e => updateStatus(task.id, e.target.value)} style={{ padding: '0.35rem 0.6rem', borderRadius: '6px', border: '1px solid #e2e8f0', fontSize: '0.78rem', cursor: 'pointer', color: staCfg.color, background: staCfg.bg, fontWeight: 600 }}>
                    {Object.entries(STATUS_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                  </select>
                  <button onClick={() => deleteTask(task.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', padding: '0.25rem', borderRadius: '4px', display: 'flex', alignItems: 'center' }}>
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
