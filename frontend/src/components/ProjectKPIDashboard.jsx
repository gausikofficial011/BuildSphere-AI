import React, { useState, useEffect, useCallback } from 'react';
import { TrendingUp, TrendingDown, DollarSign, Activity, AlertTriangle, CheckCircle2, RefreshCw, Loader2, BarChart2 } from 'lucide-react';
import { LineChart, Line, AreaChart, Area, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from 'recharts';

const API = ''; // Vite proxy: /api/* -> http://localhost:8000/*

const S_CURVE_SEED = [
  { month: 'Jan', planned: 8, actual: 7 },
  { month: 'Feb', planned: 18, actual: 16 },
  { month: 'Mar', planned: 32, actual: 28 },
  { month: 'Apr', planned: 48, actual: 42 },
  { month: 'May', planned: 65, actual: 58 },
  { month: 'Jun', planned: 78, actual: 71 },
  { month: 'Jul', planned: 88, actual: 82 },
];

export function ProjectKPIDashboard({ projectId = 1 }) {
  const [project, setProject] = useState(null);
  const [taskStats, setTaskStats] = useState(null);
  const [issueStats, setIssueStats] = useState(null);
  const [logSummary, setLogSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [projRes, taskRes, issueRes, logRes] = await Promise.all([
        fetch(`${API}/projects/${projectId}`),
        fetch(`${API}/api/tasks/stats/summary?project_id=${projectId}`),
        fetch(`${API}/api/issues/stats/summary?project_id=${projectId}`),
        fetch(`${API}/api/daily-logs/summary?project_id=${projectId}`),
      ]);
      if (projRes.ok) setProject(await projRes.json());
      if (taskRes.ok) setTaskStats(await taskRes.json());
      if (issueRes.ok) setIssueStats(await issueRes.json());
      if (logRes.ok) setLogSummary(await logRes.json());
      setLastUpdated(new Date());
    } catch { } finally { setLoading(false); }
  }, [projectId]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const healthColor = (score) => {
    if (score >= 85) return '#10b981';
    if (score >= 70) return '#f59e0b';
    return '#ef4444';
  };

  if (!project && loading) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem', color: '#94a3b8' }}>
        <Loader2 size={36} style={{ margin: '0 auto 1rem', display: 'block', color: '#6366f1' }} />
        <p>Loading live project KPIs...</p>
      </div>
    );
  }

  if (!project) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem 2rem', border: '2px dashed #e2e8f0', borderRadius: '14px', background: '#f8fafc' }}>
        <BarChart2 size={40} color="#cbd5e1" style={{ margin: '0 auto 1rem', display: 'block' }} />
        <h4 style={{ margin: '0 0 0.5rem', color: '#475569' }}>No Project Data</h4>
        <p style={{ margin: '0 0 1.5rem', color: '#94a3b8', fontSize: '0.9rem' }}>Ensure the backend server is running to load live project metrics.</p>
        <button onClick={fetchAll} style={{ background: 'linear-gradient(135deg,#6366f1,#4f46e5)', color: 'white', padding: '0.6rem 1.5rem', borderRadius: '10px', border: 'none', fontWeight: 700, cursor: 'pointer' }}>Retry</button>
      </div>
    );
  }

  const health = project.health_score || 90;
  const progress = project.progress_percentage || 0;

  return (
    <div style={{ fontFamily: 'Inter, system-ui, sans-serif', color: '#1e293b' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '1.35rem', fontWeight: 800, color: '#0f172a' }}>{project.name}</h2>
          <p style={{ margin: '0.25rem 0 0', color: '#64748b', fontSize: '0.85rem' }}>
            Live project KPIs · {lastUpdated ? `Updated ${lastUpdated.toLocaleTimeString()}` : 'Loading...'}
          </p>
        </div>
        <button onClick={fetchAll} disabled={loading} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid #e2e8f0', background: 'white', color: '#475569', cursor: 'pointer', fontSize: '0.82rem', fontWeight: 600 }}>
          <RefreshCw size={14} color={loading ? '#6366f1' : '#64748b'} /> Refresh
        </button>
      </div>

      {/* Project Progress Bar */}
      <div style={{ background: 'white', borderRadius: '14px', border: '1px solid #e2e8f0', padding: '1.25rem 1.5rem', marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
          <span style={{ fontWeight: 700, fontSize: '0.95rem', color: '#0f172a' }}>Overall Project Progress</span>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <span style={{ fontWeight: 800, fontSize: '1.5rem', color: '#6366f1' }}>{progress.toFixed(1)}%</span>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: healthColor(health) }}>Health: {health.toFixed(0)}/100</div>
              <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>{health >= 85 ? '🟢 On Track' : health >= 70 ? '🟡 Caution' : '🔴 At Risk'}</div>
            </div>
          </div>
        </div>
        <div style={{ background: '#f1f5f9', borderRadius: '99px', height: '12px', overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${progress}%`, background: `linear-gradient(90deg, #6366f1, #4f46e5)`, borderRadius: '99px', transition: 'width 0.8s ease' }} />
        </div>
      </div>

      {/* Primary KPI Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '0.75rem', marginBottom: '1.25rem' }}>
        {[
          { label: 'Budget Total', value: `₹${project.budget_total?.toFixed(1)} Cr`, icon: DollarSign, color: '#3b82f6', sub: 'Project Contract Value' },
          { label: 'Budget Spent', value: `₹${project.budget_used?.toFixed(2)} Cr`, icon: TrendingUp, color: '#f59e0b', sub: `${((project.budget_used / project.budget_total) * 100).toFixed(1)}% utilized` },
          { label: 'Cost Variance', value: `₹${Math.abs(project.cost_variance || 0).toFixed(2)} Cr`, icon: project.cost_variance >= 0 ? TrendingUp : TrendingDown, color: project.cost_variance >= 0 ? '#10b981' : '#ef4444', sub: project.cost_variance >= 0 ? '↑ Under budget' : '↓ Over budget' },
          { label: 'SPI', value: project.spi?.toFixed(2), icon: Activity, color: project.spi >= 1 ? '#10b981' : '#ef4444', sub: 'Schedule Performance' },
          { label: 'CPI', value: project.cpi?.toFixed(2), icon: Activity, color: project.cpi >= 1 ? '#10b981' : '#ef4444', sub: 'Cost Performance' },
        ].map(kpi => {
          const Icon = kpi.icon;
          return (
            <div key={kpi.label} style={{ background: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', borderTop: `3px solid ${kpi.color}`, padding: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: `${kpi.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon size={16} color={kpi.color} />
                </div>
                <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>{kpi.label}</span>
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: kpi.color }}>{kpi.value}</div>
              <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '0.2rem' }}>{kpi.sub}</div>
            </div>
          );
        })}
      </div>

      {/* Task + Issue + Workforce Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem', marginBottom: '1.25rem' }}>
        {/* Tasks */}
        <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '1.25rem' }}>
          <h3 style={{ margin: '0 0 1rem', fontSize: '0.9rem', fontWeight: 700, color: '#374151' }}>Tasks Overview</h3>
          {taskStats ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {[['To Do', taskStats.todo, '#94a3b8'], ['In Progress', taskStats.in_progress, '#3b82f6'], ['Done', taskStats.done, '#10b981'], ['Blocked', taskStats.blocked, '#ef4444']].map(([label, val, col]) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.8rem', color: '#64748b' }}>{label}</span>
                  <span style={{ fontWeight: 700, color: col, fontSize: '0.9rem' }}>{val || 0}</span>
                </div>
              ))}
              <div style={{ paddingTop: '0.5rem', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.78rem', fontWeight: 600, color: '#374151' }}>Completion</span>
                <span style={{ fontWeight: 800, color: '#6366f1' }}>{taskStats.completion_rate}%</span>
              </div>
            </div>
          ) : <p style={{ margin: 0, fontSize: '0.82rem', color: '#94a3b8' }}>No tasks yet</p>}
        </div>

        {/* Issues */}
        <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '1.25rem' }}>
          <h3 style={{ margin: '0 0 1rem', fontSize: '0.9rem', fontWeight: 700, color: '#374151' }}>Issues & RFIs</h3>
          {issueStats ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {[['Open', issueStats.open, '#ef4444'], ['In Review', issueStats.in_review, '#f59e0b'], ['Resolved', issueStats.resolved, '#10b981']].map(([label, val, col]) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.8rem', color: '#64748b' }}>{label}</span>
                  <span style={{ fontWeight: 700, color: col, fontSize: '0.9rem' }}>{val || 0}</span>
                </div>
              ))}
              <div style={{ paddingTop: '0.5rem', borderTop: '1px solid #f1f5f9' }}>
                {issueStats.by_category && Object.entries(issueStats.by_category).map(([cat, count]) => count > 0 ? (
                  <div key={cat} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.3rem' }}>
                    <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>{cat}</span>
                    <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b' }}>{count}</span>
                  </div>
                ) : null)}
              </div>
            </div>
          ) : <p style={{ margin: 0, fontSize: '0.82rem', color: '#94a3b8' }}>No issues raised yet</p>}
        </div>

        {/* Daily Logs */}
        <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '1.25rem' }}>
          <h3 style={{ margin: '0 0 1rem', fontSize: '0.9rem', fontWeight: 700, color: '#374151' }}>Site Workforce</h3>
          {logSummary && logSummary.total_logs > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Total Logs</span>
                <span style={{ fontWeight: 700, color: '#3b82f6' }}>{logSummary.total_logs}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Avg Workforce</span>
                <span style={{ fontWeight: 700, color: '#10b981' }}>{logSummary.avg_workforce}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Peak Workforce</span>
                <span style={{ fontWeight: 700, color: '#f59e0b' }}>{logSummary.max_workforce}</span>
              </div>
              {logSummary.recent_log && (
                <div style={{ marginTop: '0.5rem', padding: '0.6rem', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#374151', marginBottom: '0.2rem' }}>Latest Log</div>
                  <div style={{ fontSize: '0.72rem', color: '#64748b' }}>{logSummary.recent_log.date} · {logSummary.recent_log.zone}</div>
                  <div style={{ fontSize: '0.72rem', color: '#10b981', fontWeight: 600 }}>{logSummary.recent_log.total_workforce} on site</div>
                </div>
              )}
            </div>
          ) : <p style={{ margin: 0, fontSize: '0.82rem', color: '#94a3b8' }}>No daily logs submitted yet</p>}
        </div>
      </div>

      {/* S-Curve Chart */}
      <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '1.25rem' }}>
        <h3 style={{ margin: '0 0 1rem', fontSize: '0.9rem', fontWeight: 700, color: '#374151' }}>S-Curve Progress Analysis</h3>
        <ResponsiveContainer width="100%" height={180}>
          <AreaChart data={S_CURVE_SEED}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} />
            <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} domain={[0, 100]} tickFormatter={v => `${v}%`} />
            <Tooltip formatter={(v) => `${v}%`} contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.8rem' }} />
            <Area type="monotone" dataKey="planned" stroke="#94a3b8" fill="rgba(148,163,184,0.15)" strokeWidth={2} strokeDasharray="4 4" name="Planned" />
            <Area type="monotone" dataKey="actual" stroke="#6366f1" fill="rgba(99,102,241,0.12)" strokeWidth={2.5} name="Actual" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
