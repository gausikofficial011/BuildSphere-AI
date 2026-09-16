import React, { useState } from 'react';
import { 
  ArrowUp, ArrowDown, ArrowRight, LayoutTemplate, Activity, MoreHorizontal, 
  Settings2, BarChart2, Search, Filter, Plus, Trash2, CheckCircle, 
  X, Sparkles 
} from 'lucide-react';

export function StatCard({ title, value, trend, icon, color, trendType = "positive" }) {
  return (
    <div className={`stat-card color-${color} ${color}`}>
      <div className="stat-icon">{icon}</div>
      <div className="stat-details">
        <h5>{title}</h5>
        <h3>{value}</h3>
        {trend && (
          <span className={`trend ${trendType}`}>
             {trendType === 'positive' && <ArrowUp size={12} />}
             {trendType === 'negative' && <ArrowDown size={12} />}
             {trendType === 'neutral' && <span style={{marginRight: '0.2rem'}}>•</span>}
             {trend}
          </span>
        )}
      </div>
    </div>
  );
}

export function Card({ title, subtitle, action, children }) {
  return (
    <div className="dashboard-card">
      <div className="dashboard-header">
        <div>
          <h4>{title}</h4>
          {subtitle && <p>{subtitle}</p>}
        </div>
        {action && <button className="card-action">{action} <ArrowRight size={12}/></button>}
      </div>
      <div className="card-body">
        {children}
      </div>
    </div>
  );
}

export function OverviewItem({ icon, label, value, sub }) {
  return (
    <div className="overview-item">
      <div className="o-icon">{icon}</div>
      <div className="o-text">
        <span className="o-label">{label}</span>
        <strong className="o-val">{value}</strong>
        {sub && <span className="o-sub">{sub}</span>}
      </div>
    </div>
  );
}

export function HealthItem({ icon, name, value, status }) {
  return (
    <div className="health-item">
      <div className="h-icon">{icon}</div>
      <div className="h-name">{name}</div>
      <div className="h-val">{value}</div>
      <div className={`h-status ${status.toLowerCase()}`}><span className="dot"></span> {status}</div>
    </div>
  );
}

export function OrgItem({ rank, name, sub, val, color }) {
  return (
    <div className="org-item">
      <div className="o-rank">{rank}</div>
      <div className="o-avatar" style={{backgroundColor: color}}>{name.charAt(0)}</div>
      <div className="o-details">
        <h6>{name}</h6>
        <span>{sub}</span>
      </div>
      <div className="o-val">{val}</div>
    </div>
  );
}

export function ActivityItem({ icon, text, time, color }) {
  return (
    <div className="activity-item">
      <div className="a-icon" style={{color: color, backgroundColor: `${color}15`}}>{icon}</div>
      <div className="a-text">
        <p>{text}</p>
        <span>{time}</span>
      </div>
    </div>
  );
}

import { getDomainDatasetsForTitle } from './portalDataGenerator';

export function PremiumPlaceholder({ title, description }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);

  const [newItemName, setNewItemName] = useState('');
  const [newItemCategory, setNewItemCategory] = useState('');
  const [newItemValue, setNewItemValue] = useState('');
  const [newItemSpecs, setNewItemSpecs] = useState('');
  const [newItemStatus, setNewItemStatus] = useState('Active');
  
  // Real-world Enterprise states:
  const [selectedIds, setSelectedIds] = useState([]);
  const [toastMsg, setToastMsg] = useState(null);
  const [sortField, setSortField] = useState('name');
  const [sortAsc, setSortAsc] = useState(true);

  const triggerToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const [records, setRecords] = useState(() => getDomainDatasetsForTitle(title, description));

  // Dynamically update dataset whenever tool/tab title changes
  React.useEffect(() => {
    setRecords(getDomainDatasetsForTitle(title, description));
    setSelectedIds([]);
  }, [title]);

  const handleAddRecord = (e) => {
    e.preventDefault();
    if (!newItemName.trim()) return;
    const newEntry = {
      id: Date.now(),
      name: newItemName,
      category: newItemCategory || `${title} Component`,
      progress: Math.floor(Math.random() * 30) + 70,
      status: newItemStatus,
      value: newItemValue || 'Custom Standard',
      specs: newItemSpecs || 'Specification: Standard Verified',
      updated: 'Just now'
    };
    setRecords([newEntry, ...records]);
    setNewItemName('');
    setNewItemCategory('');
    setNewItemValue('');
    setNewItemSpecs('');
    setShowAddModal(false);
    triggerToast(`Success: Element "${newEntry.name}" added to ${title} dataset!`);
  };

  const handleEditRecord = (e) => {
    e.preventDefault();
    if (!editingRecord) return;
    setRecords(records.map(r => r.id === editingRecord.id ? editingRecord : r));
    setShowEditModal(false);
    setEditingRecord(null);
    triggerToast(`Success: Updated "${editingRecord.name}" parameters.`);
  };

  const handleDeleteRecord = (id) => {
    setRecords(records.filter(r => r.id !== id));
    setSelectedIds(selectedIds.filter(i => i !== id));
    triggerToast("Record deleted from active database.");
  };

  const handleBulkDelete = () => {
    setRecords(records.filter(r => !selectedIds.includes(r.id)));
    triggerToast(`Bulk Action: Removed ${selectedIds.length} selected records.`);
    setSelectedIds([]);
  };

  const handleExportCSV = () => {
    const headers = ["ID", "Feature Item", "Category", "Specifications", "Progress", "Status", "Value / Metric"];
    const rows = filteredRecords.map(r => [r.id, `"${r.name}"`, `"${r.category}"`, `"${r.specs || ''}"`, `${r.progress}%`, r.status, `"${r.value}"`]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${title.replace(/\s+/g, '_')}_Dataset.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    triggerToast(`CSV Export complete for ${filteredRecords.length} records.`);
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredRecords.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredRecords.map(r => r.id));
    }
  };

  const toggleSelectRow = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(i => i !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const filteredRecords = records
    .filter(r => {
      const matchesSearch = r.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            r.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            (r.specs && r.specs.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesFilter = filterStatus === 'All' || r.status === filterStatus;
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];
      if (sortField === 'progress') {
        valA = parseFloat(valA);
        valB = parseFloat(valB);
      }
      if (valA < valB) return sortAsc ? -1 : 1;
      if (valA > valB) return sortAsc ? 1 : -1;
      return 0;
    });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', color: '#f8fafc', animation: 'fadeIn 0.3s ease', gap: '1.5rem', position: 'relative' }}>
      
      {/* Toast Notification Banner */}
      {toastMsg && (
        <div style={{ position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 2000, backgroundColor: '#1e1b4b', border: '1px solid #6366f1', color: '#ffffff', padding: '0.85rem 1.5rem', borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', gap: '0.75rem', animation: 'fadeIn 0.3s ease' }}>
          <Sparkles size={18} color="#818cf8" />
          <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>{toastMsg}</span>
        </div>
      )}

      {/* Top Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
        <div style={{ backgroundColor: 'rgba(16, 21, 45, 0.7)', backdropFilter: 'blur(12px)', padding: '1.25rem 1.5rem', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.1)', boxShadow: '0 8px 20px rgba(0,0,0,0.3)' }}>
          <div style={{ color: '#94a3b8', fontSize: '0.8rem', marginBottom: '0.4rem', display: 'flex', justifyContent: 'space-between', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Total Records <Activity size={16} color="#818cf8" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#ffffff' }}>{records.length}</div>
          <div style={{ fontSize: '0.75rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.25rem' }}>
            <ArrowUp size={12}/> Live Database Feed
          </div>
        </div>

        <div style={{ backgroundColor: 'rgba(16, 21, 45, 0.7)', backdropFilter: 'blur(12px)', padding: '1.25rem 1.5rem', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.1)', boxShadow: '0 8px 20px rgba(0,0,0,0.3)' }}>
          <div style={{ color: '#94a3b8', fontSize: '0.8rem', marginBottom: '0.4rem', display: 'flex', justifyContent: 'space-between', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Active Operations <CheckCircle size={16} color="#34d399" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#34d399' }}>{records.filter(r => r.status === 'Active' || r.status === 'In Progress').length}</div>
          <div style={{ fontSize: '0.75rem', color: '#34d399', display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.25rem' }}>
            Optimal Efficiency
          </div>
        </div>

        <div style={{ backgroundColor: 'rgba(16, 21, 45, 0.7)', backdropFilter: 'blur(12px)', padding: '1.25rem 1.5rem', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.1)', boxShadow: '0 8px 20px rgba(0,0,0,0.3)' }}>
          <div style={{ color: '#94a3b8', fontSize: '0.8rem', marginBottom: '0.4rem', display: 'flex', justifyContent: 'space-between', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            AI Health Score <Sparkles size={16} color="#fbbf24" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#fbbf24' }}>98.4%</div>
          <div style={{ fontSize: '0.75rem', color: '#fbbf24', display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.25rem' }}>
            AI Real-Time Verified
          </div>
        </div>
      </div>

      {/* Main Interactive Data Table Container */}
      <div style={{ backgroundColor: 'rgba(16, 21, 45, 0.65)', backdropFilter: 'blur(20px)', borderRadius: '20px', border: '1px solid rgba(255, 255, 255, 0.1)', padding: '1.75rem', boxShadow: '0 12px 35px rgba(0, 0, 0, 0.4)', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        
        {/* Table Toolbar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', paddingBottom: '1rem', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <div>
            <h3 style={{ fontSize: '1.3rem', color: '#ffffff', margin: '0 0 0.25rem 0', display: 'flex', alignItems: 'center', gap: '0.6rem', fontWeight: 700 }}>
              <LayoutTemplate size={20} color="#818cf8"/> {title} Enterprise Data Management
            </h3>
            <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.875rem' }}>{description || 'Real-time feature controls, batch actions, CSV exports, and record management.'}</p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            {/* Search Input */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'rgba(0, 0, 0, 0.3)', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: '9999px', padding: '0.45rem 1rem' }}>
              <Search size={14} color="#94a3b8" />
              <input 
                type="text" 
                placeholder={`Search ${title}...`} 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{ background: 'none', border: 'none', color: '#ffffff', outline: 'none', fontSize: '0.85rem', width: '160px' }}
              />
            </div>

            {/* Status Filter */}
            <select 
              value={filterStatus} 
              onChange={e => setFilterStatus(e.target.value)}
              style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)', border: '1px solid rgba(255, 255, 255, 0.15)', color: '#ffffff', padding: '0.45rem 0.85rem', borderRadius: '10px', fontSize: '0.85rem', outline: 'none', cursor: 'pointer' }}
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="Under Review">Under Review</option>
            </select>

            {/* Export CSV Button */}
            <button 
              onClick={handleExportCSV}
              style={{ padding: '0.45rem 0.85rem', backgroundColor: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: '10px', color: '#cbd5e1', cursor: 'pointer', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
            >
              Export CSV
            </button>

            {/* Add Record Button */}
            <button 
              onClick={() => setShowAddModal(true)}
              className="export-btn"
              style={{ padding: '0.45rem 1rem', fontSize: '0.85rem' }}
            >
              <Plus size={14} /> Add Record
            </button>
          </div>
        </div>

        {/* Batch Selection Action Bar */}
        {selectedIds.length > 0 && (
          <div style={{ backgroundColor: 'rgba(99, 102, 241, 0.15)', border: '1px solid #6366f1', padding: '0.65rem 1.25rem', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', animation: 'fadeIn 0.2s ease' }}>
            <span style={{ fontSize: '0.85rem', color: '#a5b4fc', fontWeight: 600 }}>
              {selectedIds.length} {selectedIds.length === 1 ? 'record' : 'records'} selected
            </span>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button onClick={handleBulkDelete} style={{ backgroundColor: '#ef4444', color: 'white', border: 'none', padding: '0.35rem 0.85rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600 }}>
                Delete Selected ({selectedIds.length})
              </button>
            </div>
          </div>
        )}

        {/* Data Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)', color: '#94a3b8', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                <th style={{ padding: '0.85rem 1rem', width: '40px' }}>
                  <input 
                    type="checkbox" 
                    checked={selectedIds.length > 0 && selectedIds.length === filteredRecords.length}
                    onChange={toggleSelectAll}
                    style={{ cursor: 'pointer', accentColor: '#6366f1' }}
                  />
                </th>
                <th style={{ padding: '0.85rem 1rem', cursor: 'pointer' }} onClick={() => handleSort('name')}>
                  Feature Item {sortField === 'name' ? (sortAsc ? '▲' : '▼') : ''}
                </th>
                <th style={{ padding: '0.85rem 1rem', cursor: 'pointer' }} onClick={() => handleSort('category')}>
                  Category {sortField === 'category' ? (sortAsc ? '▲' : '▼') : ''}
                </th>
                <th style={{ padding: '0.85rem 1rem' }}>
                  Specifications & Parameters
                </th>
                <th style={{ padding: '0.85rem 1rem', cursor: 'pointer' }} onClick={() => handleSort('progress')}>
                  Progress / Health {sortField === 'progress' ? (sortAsc ? '▲' : '▼') : ''}
                </th>
                <th style={{ padding: '0.85rem 1rem', cursor: 'pointer' }} onClick={() => handleSort('status')}>
                  Status {sortField === 'status' ? (sortAsc ? '▲' : '▼') : ''}
                </th>
                <th style={{ padding: '0.85rem 1rem' }}>
                  Value / Metrics
                </th>
                <th style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>
                    No records found matching "{searchQuery}".
                  </td>
                </tr>
              ) : (
                filteredRecords.map(r => (
                  <tr key={r.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)', backgroundColor: selectedIds.includes(r.id) ? 'rgba(99, 102, 241, 0.1)' : 'transparent', transition: 'background 0.2s' }}>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <input 
                        type="checkbox" 
                        checked={selectedIds.includes(r.id)}
                        onChange={() => toggleSelectRow(r.id)}
                        style={{ cursor: 'pointer', accentColor: '#6366f1' }}
                      />
                    </td>
                    <td style={{ padding: '0.85rem 1rem', fontWeight: 600, color: '#ffffff' }}>{r.name}</td>
                    <td style={{ padding: '0.85rem 1rem', color: '#cbd5e1' }}>{r.category}</td>
                    <td style={{ padding: '0.85rem 1rem', color: '#22d3ee', fontSize: '0.78rem', maxWidth: '280px' }}>
                      {r.specs || 'Standard Parameter Set'}
                    </td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ flex: 1, height: '6px', backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                          <div style={{ width: `${r.progress}%`, height: '100%', background: 'linear-gradient(90deg, #6366f1, #38bdf8)', borderRadius: '3px' }}></div>
                        </div>
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#e2e8f0', width: '32px' }}>{r.progress}%</span>
                      </div>
                    </td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <span style={{
                        padding: '0.2rem 0.65rem', borderRadius: '9999px', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase',
                        backgroundColor: r.status === 'Active' ? 'rgba(16, 185, 129, 0.15)' : (r.status === 'Completed' ? 'rgba(59, 130, 246, 0.15)' : 'rgba(245, 158, 11, 0.15)'),
                        color: r.status === 'Active' ? '#34d399' : (r.status === 'Completed' ? '#60a5fa' : '#fbbf24'),
                        border: `1px solid ${r.status === 'Active' ? 'rgba(16, 185, 129, 0.3)' : (r.status === 'Completed' ? 'rgba(59, 130, 246, 0.3)' : 'rgba(245, 158, 11, 0.3)')}`
                      }}>
                        {r.status}
                      </span>
                    </td>
                    <td style={{ padding: '0.85rem 1rem', fontWeight: 600, color: '#e2e8f0' }}>{r.value}</td>
                    <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.4rem' }}>
                        <button 
                          onClick={() => { setEditingRecord({ ...r }); setShowEditModal(true); }}
                          style={{ background: 'none', border: 'none', color: '#38bdf8', cursor: 'pointer', padding: '0.25rem' }}
                          title="Edit Parameters"
                        >
                          <Settings2 size={15} />
                        </button>
                        <button 
                          onClick={() => handleDeleteRecord(r.id)}
                          style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer', padding: '0.25rem' }}
                          title="Delete Record"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer Pagination Status */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem', borderTop: '1px solid rgba(255, 255, 255, 0.08)', color: '#94a3b8', fontSize: '0.8rem' }}>
          <span>Showing 1 to {filteredRecords.length} of {records.length} enterprise records</span>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button style={{ padding: '0.3rem 0.75rem', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#cbd5e1', borderRadius: '6px', fontSize: '0.75rem', cursor: 'pointer' }}>Previous</button>
            <button style={{ padding: '0.3rem 0.75rem', backgroundColor: '#6366f1', border: 'none', color: '#ffffff', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600 }}>1</button>
            <button style={{ padding: '0.3rem 0.75rem', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#cbd5e1', borderRadius: '6px', fontSize: '0.75rem', cursor: 'pointer' }}>Next</button>
          </div>
        </div>

      </div>

      {/* Add Record Modal */}
      {showAddModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0, 0, 0, 0.75)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, animation: 'fadeIn 0.2s ease' }}>
          <div style={{ backgroundColor: '#0f172a', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: '20px', padding: '2rem', width: '480px', boxShadow: '0 20px 50px rgba(0,0,0,0.6)', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem' }}>
              <h3 style={{ margin: 0, color: '#ffffff', fontSize: '1.2rem', fontWeight: 700 }}>Add New {title} Record</h3>
              <button onClick={() => setShowAddModal(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}><X size={20} /></button>
            </div>

            <form onSubmit={handleAddRecord} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#cbd5e1', marginBottom: '0.35rem', fontWeight: 600 }}>Item Name / Title</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Double Glazed Acoustic Curtain Wall..." 
                  value={newItemName}
                  onChange={e => setNewItemName(e.target.value)}
                  style={{ width: '100%', padding: '0.65rem', backgroundColor: 'rgba(0, 0, 0, 0.3)', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: '8px', color: '#ffffff', outline: 'none', fontSize: '0.875rem' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#cbd5e1', marginBottom: '0.35rem', fontWeight: 600 }}>Category</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Exterior Shell" 
                    value={newItemCategory}
                    onChange={e => setNewItemCategory(e.target.value)}
                    style={{ width: '100%', padding: '0.65rem', backgroundColor: 'rgba(0, 0, 0, 0.3)', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: '8px', color: '#ffffff', outline: 'none', fontSize: '0.875rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#cbd5e1', marginBottom: '0.35rem', fontWeight: 600 }}>Dimension / Value</label>
                  <input 
                    type="text" 
                    placeholder="e.g. 3.8m Height / 500 TR" 
                    value={newItemValue}
                    onChange={e => setNewItemValue(e.target.value)}
                    style={{ width: '100%', padding: '0.65rem', backgroundColor: 'rgba(0, 0, 0, 0.3)', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: '8px', color: '#ffffff', outline: 'none', fontSize: '0.875rem' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#cbd5e1', marginBottom: '0.35rem', fontWeight: 600 }}>Specifications & Parameters</label>
                <input 
                  type="text" 
                  placeholder="e.g. U-Value: 1.4 W/m²K, STC: 48dB, Fire: 2-Hr" 
                  value={newItemSpecs}
                  onChange={e => setNewItemSpecs(e.target.value)}
                  style={{ width: '100%', padding: '0.65rem', backgroundColor: 'rgba(0, 0, 0, 0.3)', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: '8px', color: '#ffffff', outline: 'none', fontSize: '0.875rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#cbd5e1', marginBottom: '0.35rem', fontWeight: 600 }}>Status</label>
                <select 
                  value={newItemStatus}
                  onChange={e => setNewItemStatus(e.target.value)}
                  style={{ width: '100%', padding: '0.65rem', backgroundColor: 'rgba(0, 0, 0, 0.3)', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: '8px', color: '#ffffff', outline: 'none', fontSize: '0.875rem' }}
                >
                  <option value="Active">Active</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                  <option value="Under Review">Under Review</option>
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
                <button type="button" onClick={() => setShowAddModal(false)} style={{ padding: '0.6rem 1.2rem', backgroundColor: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: '8px', color: '#cbd5e1', cursor: 'pointer', fontSize: '0.85rem' }}>Cancel</button>
                <button type="submit" className="export-btn" style={{ padding: '0.6rem 1.2rem', fontSize: '0.85rem' }}>Save Element</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Record Modal */}
      {showEditModal && editingRecord && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0, 0, 0, 0.75)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, animation: 'fadeIn 0.2s ease' }}>
          <div style={{ backgroundColor: '#0f172a', border: '1px solid #38bdf8', borderRadius: '20px', padding: '2rem', width: '480px', boxShadow: '0 20px 50px rgba(56, 189, 248, 0.3)', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem' }}>
              <h3 style={{ margin: 0, color: '#ffffff', fontSize: '1.2rem', fontWeight: 700 }}>Edit Parameters: {editingRecord.name}</h3>
              <button onClick={() => setShowEditModal(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}><X size={20} /></button>
            </div>

            <form onSubmit={handleEditRecord} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#cbd5e1', marginBottom: '0.35rem', fontWeight: 600 }}>Item Name / Title</label>
                <input 
                  type="text" 
                  required
                  value={editingRecord.name}
                  onChange={e => setEditingRecord({ ...editingRecord, name: e.target.value })}
                  style={{ width: '100%', padding: '0.65rem', backgroundColor: 'rgba(0, 0, 0, 0.3)', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: '8px', color: '#ffffff', outline: 'none', fontSize: '0.875rem' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#cbd5e1', marginBottom: '0.35rem', fontWeight: 600 }}>Category</label>
                  <input 
                    type="text" 
                    value={editingRecord.category}
                    onChange={e => setEditingRecord({ ...editingRecord, category: e.target.value })}
                    style={{ width: '100%', padding: '0.65rem', backgroundColor: 'rgba(0, 0, 0, 0.3)', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: '8px', color: '#ffffff', outline: 'none', fontSize: '0.875rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#cbd5e1', marginBottom: '0.35rem', fontWeight: 600 }}>Dimension / Value</label>
                  <input 
                    type="text" 
                    value={editingRecord.value}
                    onChange={e => setEditingRecord({ ...editingRecord, value: e.target.value })}
                    style={{ width: '100%', padding: '0.65rem', backgroundColor: 'rgba(0, 0, 0, 0.3)', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: '8px', color: '#ffffff', outline: 'none', fontSize: '0.875rem' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#cbd5e1', marginBottom: '0.35rem', fontWeight: 600 }}>Specifications & Parameters</label>
                <input 
                  type="text" 
                  value={editingRecord.specs || ''}
                  onChange={e => setEditingRecord({ ...editingRecord, specs: e.target.value })}
                  style={{ width: '100%', padding: '0.65rem', backgroundColor: 'rgba(0, 0, 0, 0.3)', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: '8px', color: '#ffffff', outline: 'none', fontSize: '0.875rem' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#cbd5e1', marginBottom: '0.35rem', fontWeight: 600 }}>Progress (%)</label>
                  <input 
                    type="number" 
                    min="0"
                    max="100"
                    value={editingRecord.progress}
                    onChange={e => setEditingRecord({ ...editingRecord, progress: Number(e.target.value) })}
                    style={{ width: '100%', padding: '0.65rem', backgroundColor: 'rgba(0, 0, 0, 0.3)', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: '8px', color: '#ffffff', outline: 'none', fontSize: '0.875rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#cbd5e1', marginBottom: '0.35rem', fontWeight: 600 }}>Status</label>
                  <select 
                    value={editingRecord.status}
                    onChange={e => setEditingRecord({ ...editingRecord, status: e.target.value })}
                    style={{ width: '100%', padding: '0.65rem', backgroundColor: 'rgba(0, 0, 0, 0.3)', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: '8px', color: '#ffffff', outline: 'none', fontSize: '0.875rem' }}
                  >
                    <option value="Active">Active</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                    <option value="Under Review">Under Review</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
                <button type="button" onClick={() => setShowEditModal(false)} style={{ padding: '0.6rem 1.2rem', backgroundColor: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: '8px', color: '#cbd5e1', cursor: 'pointer', fontSize: '0.85rem' }}>Cancel</button>
                <button type="submit" className="export-btn" style={{ padding: '0.6rem 1.2rem', fontSize: '0.85rem' }}>Update Element</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
