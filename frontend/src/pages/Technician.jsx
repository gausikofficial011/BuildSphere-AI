import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Wrench,
  Users,
  HardHat,
  Zap,
  Activity,
  CheckCircle2,
  AlertTriangle,
  Cpu,
  Layers,
  Settings,
  Plus,
  ArrowUpRight,
  Search,
  Filter,
  Clock,
  ShieldCheck,
  MapPin,
  Sparkles,
  Radio,
  FileText,
  CheckSquare,
  Trash2,
  Edit3,
  ExternalLink,
  Shield,
  Bot,
  Truck,
  FileSignature
} from 'lucide-react';
import CyberPortalLayout from '../components/CyberPortalLayout';
import './Technician.css';

// Initial pre-configured employee-to-portal assignments
const INITIAL_EMPLOYEES = [
  {
    id: 'TECH-101',
    name: 'Rajesh Kumar',
    trade: 'HVAC & Chiller Specialist',
    assignedPortal: '/mepengineer',
    portalName: 'MEP Engineer Portal',
    portalBadge: 'mep',
    location: 'Central Plant — Chiller Room 2',
    activeTicket: 'WO-842: Compressor bearing overhaul & vibration scan',
    status: 'Active (On-Duty)',
    statusClass: 'active',
    shift: 'Day Shift (08:00 - 17:00)',
    clearance: 'Level 3 - MEP Plant'
  },
  {
    id: 'TECH-102',
    name: 'Amit Patel',
    trade: 'IoT Telemetry & Sensors',
    assignedPortal: '/digitaltwinengineer',
    portalName: 'Digital Twin Telemetry',
    portalBadge: 'digitaltwin',
    location: 'Tower A — Level 24 Shear Wall Strain Gauge',
    activeTicket: 'WO-845: Structural load accelerometer re-calibration',
    status: 'Dispatched',
    statusClass: 'dispatched',
    shift: 'Day Shift (08:00 - 17:00)',
    clearance: 'Level 4 - Structural'
  },
  {
    id: 'TECH-103',
    name: 'Sunita Rao',
    trade: 'Structural & Concrete Testing',
    assignedPortal: '/siteengineer',
    portalName: 'Site Engineer Operations',
    portalBadge: 'site',
    location: 'Podium 3 — Core Pour Zone',
    activeTicket: 'WO-848: Concrete slump & Schmidt rebound hammer test',
    status: 'Active (On-Duty)',
    statusClass: 'active',
    shift: 'Day Shift (08:00 - 17:00)',
    clearance: 'Level 2 - Site Wide'
  },
  {
    id: 'TECH-104',
    name: 'David Miller',
    trade: 'Sensor Mesh & LoRaWAN Tech',
    assignedPortal: '/iotengineer',
    portalName: 'IoT Sensor Mesh Hub',
    portalBadge: 'iot',
    location: 'Basement 2 — Groundwater Pressure Well',
    activeTicket: 'WO-851: Hydrostatic sensor battery & gateway check',
    status: 'Standby',
    statusClass: 'standby',
    shift: 'Rotating Shift',
    clearance: 'Level 2 - Substructure'
  },
  {
    id: 'TECH-105',
    name: 'Farhan Khan',
    trade: 'BIM Clash & Field Coordination',
    assignedPortal: '/bimmanager',
    portalName: 'BIM Manager Portal',
    portalBadge: 'bim',
    location: 'Tower B — Level 12 Ceiling Plenum',
    activeTicket: 'WO-853: Fire sprinkler duct clash alignment check',
    status: 'Active (On-Duty)',
    statusClass: 'active',
    shift: 'Day Shift (08:00 - 17:00)',
    clearance: 'Level 3 - Architectural'
  },
  {
    id: 'TECH-106',
    name: 'Ananya Sen',
    trade: 'High-Voltage Switchgear & Substation',
    assignedPortal: '/technician',
    portalName: 'Technician Maintenance Hub',
    portalBadge: 'tech',
    location: 'Substation Alpha — 33kV Transformers',
    activeTicket: 'WO-856: SF6 gas pressure & infrared thermography',
    status: 'Active (On-Duty)',
    statusClass: 'active',
    shift: 'Night / Standby',
    clearance: 'Level 4 - High Voltage'
  }
];

const AVAILABLE_PORTALS = [
  { path: '/technician', name: 'Technician Maintenance Hub', badge: 'tech' },
  { path: '/mepengineer', name: 'MEP Engineer Portal', badge: 'mep' },
  { path: '/siteengineer', name: 'Site Engineer Operations', badge: 'site' },
  { path: '/digitaltwinengineer', name: 'Digital Twin Telemetry', badge: 'digitaltwin' },
  { path: '/iotengineer', name: 'IoT Sensor Mesh Hub', badge: 'iot' },
  { path: '/bimmanager', name: 'BIM Manager Portal', badge: 'bim' },
  { path: '/constructionmanager', name: 'Construction Manager', badge: 'site' },
  { path: '/contractor', name: 'Contractor Execution Hub', badge: 'mep' }
];

export default function Technician() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('assignments');

  // Employee Assignment State (Persisted in localStorage)
  const [employees, setEmployees] = useState(() => {
    try {
      const saved = localStorage.getItem('buildsphere_tech_employees');
      return saved ? JSON.parse(saved) : INITIAL_EMPLOYEES;
    } catch (e) {
      return INITIAL_EMPLOYEES;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('buildsphere_tech_employees', JSON.stringify(employees));
    } catch (e) {
      console.warn('Could not save employees to localStorage:', e);
    }
  }, [employees]);

  // Search and Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPortal, setFilterPortal] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  // Add / Edit Modal State
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    id: '',
    trade: 'HVAC & Chiller Specialist',
    assignedPortal: '/mepengineer',
    location: 'Central Plant — Mechanical Floor',
    activeTicket: 'WO-New: Scheduled inspection',
    status: 'Active (On-Duty)',
    shift: 'Day Shift (08:00 - 17:00)',
    clearance: 'Level 2 - Site Wide'
  });

  const handleOpenAddModal = () => {
    setEditingEmployee(null);
    setFormData({
      name: '',
      id: `TECH-${Math.floor(100 + Math.random() * 900)}`,
      trade: 'HVAC & Chiller Specialist',
      assignedPortal: '/mepengineer',
      location: 'Tower A — Mechanical Room',
      activeTicket: 'WO-New: Field task inspection',
      status: 'Active (On-Duty)',
      shift: 'Day Shift (08:00 - 17:00)',
      clearance: 'Level 2 - Site Wide'
    });
    setShowAssignModal(true);
  };

  const handleOpenEditModal = (emp) => {
    setEditingEmployee(emp);
    setFormData({ ...emp });
    setShowAssignModal(true);
  };

  const handleSaveEmployee = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    const portalObj = AVAILABLE_PORTALS.find(p => p.path === formData.assignedPortal) || {
      path: formData.assignedPortal,
      name: 'Assigned Portal',
      badge: 'tech'
    };

    const updatedEmp = {
      ...formData,
      portalName: portalObj.name,
      portalBadge: portalObj.badge,
      statusClass: formData.status.toLowerCase().includes('active')
        ? 'active'
        : formData.status.toLowerCase().includes('dispatch')
        ? 'dispatched'
        : 'standby'
    };

    if (editingEmployee) {
      setEmployees(prev => prev.map(item => item.id === editingEmployee.id ? updatedEmp : item));
    } else {
      setEmployees(prev => [updatedEmp, ...prev]);
    }

    setShowAssignModal(false);
  };

  const handleDeleteEmployee = (id) => {
    if (window.confirm('Remove this technician assignment from the portal matrix?')) {
      setEmployees(prev => prev.filter(e => e.id !== id));
    }
  };

  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.trade.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesPortal = filterPortal === 'all' || emp.assignedPortal === filterPortal;
    const matchesStatus = filterStatus === 'all' || emp.status === filterStatus;

    return matchesSearch && matchesPortal && matchesStatus;
  });

  // Navigation Groups for CyberPortalLayout
  const navGroups = [
    {
      title: 'WORKFORCE & FIELD OPERATIONS',
      color: 'cyan',
      items: [
        { id: 'assignments', label: 'Employee Portal Assignments', icon: Users, badge: `${employees.length} ASSIGNED` },
        { id: 'workorders', label: 'Field Work Orders & Tickets', icon: Wrench },
        { id: 'telemetry', label: 'IoT Equipment Telemetry', icon: Activity },
        { id: 'checklists', label: 'Maintenance & LOTO Checklists', icon: CheckSquare },
        { id: 'permits', label: 'Permits to Work (PTW)', icon: ShieldCheck }
      ]
    },
    {
      title: 'INTELLIGENCE & SYSTEM',
      color: 'pink',
      items: [
        { id: 'ai', label: 'AI Maintenance Copilot', icon: Bot, badge: 'AI' },
        { id: 'settings', label: 'Technician Settings', icon: Settings }
      ]
    }
  ];

  const kpiCards = [
    { title: 'Total Assigned Technicians', value: `${employees.length} Crew`, trend: '100% Portal Deployed', icon: Users, color: 'cyan' },
    { title: 'Active Work Orders', value: '18 Open', trend: '4 Critical Priority', icon: Wrench, color: 'pink' },
    { title: 'Mean Time to Repair (MTTR)', value: '38 Min', trend: '14% Faster than SLA', icon: Clock, color: 'purple' },
    { title: 'LOTO Safety Isolation', value: '100% Verified', trend: 'Zero Incident Record', icon: ShieldCheck, color: 'teal' }
  ];

  const telemetryCards = [
    { title: 'Chiller 2 Vibration', value: '1.4 mm/s', trend: 'Normal ISO 10816', icon: Activity, color: 'cyan' },
    { title: 'HVAC Airflow Pressure', value: '280 Pa', trend: 'Duct Level Optimal', icon: Zap, color: 'purple' },
    { title: 'Transformer Temp', value: '54 °C', trend: 'Safe (< 85°C)', icon: Radio, color: 'pink' },
    { title: 'Sensor Mesh Gateways', value: '12 / 12 Online', trend: '99.9% Uptime', icon: Cpu, color: 'teal' }
  ];

  const platformOverview = {
    title: 'Technician Deployment by Trade',
    subtitle: 'Real-time allocation of field specialists across active project zones',
    totalCount: String(employees.length),
    totalLabel: 'TECHNICIANS',
    items: [
      { name: 'HVAC & Refrigeration Mechanics', count: '4 Crew', percent: '28%', color: 'cyan' },
      { name: 'Electrical & Substation Techs', count: '4 Crew', percent: '28%', color: 'pink' },
      { name: 'IoT Telemetry & Sensor Calibration', count: '3 Crew', percent: '22%', color: 'purple' },
      { name: 'Plumbing & Hydraulic Services', count: '3 Crew', percent: '22%', color: 'yellow' }
    ]
  };

  const statusList = {
    title: 'Active Field Maintenance Shifts',
    viewAllTab: 'assignments',
    items: [
      { name: 'Tower A Substation Alpha: 33kV Switchgear Infrared Thermal Inspection', status: 'In Progress (78%)', badgeClass: 'active' },
      { name: 'Basement 1 Plant: Chiller 2 Compressor Bearing Lube & Vibration Check', status: 'Dispatched', badgeClass: 'training' },
      { name: 'Level 14 Core: Strain Gauge Accelerometer Recalibration', status: 'Completed', badgeClass: 'active' }
    ]
  };

  const recentActivities = [
    { text: 'Rajesh Kumar completed HVAC filter replacement for AHU-04', time: '12 mins ago', type: 'resolved' },
    { text: 'Amit Patel recalibrated vibration sensor at Level 24 Shear Wall', time: '34 mins ago', type: 'active' },
    { text: 'David Miller verified groundwater hydrostatic telemetry node B2', time: '1 hr ago', type: 'active' }
  ];

  const scoreGauge = {
    score: 96,
    label: 'SERVICE SLA',
    description: 'Technician ticket response and preventative maintenance adherence is exceptionally high across all towers.',
    metrics: [
      { name: 'First-Time Fix Rate', value: '92.4%' },
      { name: 'Preventative Schedule Compliance', value: '98.5%' }
    ],
    footerText: 'Standard: ISO 55001 Asset Management & NFPA 70E Safety',
    safeText: '🛡 100% Verified LOTO Isolation'
  };

  return (
    <CyberPortalLayout
      portalName="Technician Portal"
      portalSubtitle="FIELD OPERATIONS, PREVENTATIVE MAINTENANCE & EMPLOYEE PORTAL ASSIGNMENT"
      userName="Vikram Verma"
      userRole="Lead Field Services Specialist"
      userAvatar="https://i.pravatar.cc/150?img=11"
      navGroups={navGroups}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      copilotTitle="AI Technician Copilot"
      copilotDesc="Ask about machinery troubleshooting, wiring diagrams, sensor offsets & LOTO permits"
      copilotTabId="ai"
      kpiCards={kpiCards}
      telemetryCards={telemetryCards}
      platformOverview={platformOverview}
      statusList={statusList}
      recentActivities={recentActivities}
      scoreGauge={scoreGauge}
    >
      {/* ── TAB 1: EMPLOYEE PORTAL ASSIGNMENT MODULE (USER REQUESTED CORE) ── */}
      {activeTab === 'assignments' && (
        <div className="technician-module-container">
          {/* Module Header Bar */}
          <div className="tech-module-header">
            <div className="tech-header-left">
              <div className="tech-header-pill">
                <Sparkles size={13} color="#38bdf8" /> WORKFORCE ALLOCATION ENGINE
              </div>
              <h3>Employee & Technician Portal Assignment Hub</h3>
              <p>
                Add, manage, and assign employees to their designated operational portals, work zones, and live maintenance tickets.
              </p>
            </div>
            <button className="tech-add-btn" onClick={handleOpenAddModal}>
              <Plus size={16} />
              <span>Assign / Add Employee to Portal</span>
            </button>
          </div>

          {/* Filter and Search Bar */}
          <div className="tech-search-bar-row">
            <div className="tech-search-input-wrap">
              <Search size={15} color="#38bdf8" />
              <input
                type="text"
                placeholder="Search technician by name, ID, trade, or workstation location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="tech-filter-select-group">
              <select
                className="tech-select-filter"
                value={filterPortal}
                onChange={(e) => setFilterPortal(e.target.value)}
              >
                <option value="all">All Assigned Portals</option>
                {AVAILABLE_PORTALS.map(p => (
                  <option key={p.path} value={p.path}>{p.name}</option>
                ))}
              </select>

              <select
                className="tech-select-filter"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">All Duty Statuses</option>
                <option value="Active (On-Duty)">Active (On-Duty)</option>
                <option value="Dispatched">Dispatched</option>
                <option value="Standby">Standby</option>
              </select>
            </div>
          </div>

          {/* Employee Assignment Roster Table */}
          <div className="tech-roster-table-card">
            <div className="tech-table-responsive">
              <table className="tech-roster-table">
                <thead>
                  <tr>
                    <th>Technician / Employee</th>
                    <th>Specialization / Trade</th>
                    <th>Assigned Portal to Work in</th>
                    <th>Current Job Location</th>
                    <th>Active Work Order</th>
                    <th>Duty Status</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEmployees.map((emp) => (
                    <tr key={emp.id}>
                      <td>
                        <div className="emp-identity-cell">
                          <div className="emp-avatar">{emp.name.charAt(0)}</div>
                          <div className="emp-details-group">
                            <span className="emp-name">{emp.name}</span>
                            <span className="emp-id">{emp.id} • {emp.shift}</span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <strong style={{ color: '#ffffff' }}>{emp.trade}</strong>
                        <div style={{ fontSize: '0.7rem', color: '#64748b' }}>{emp.clearance}</div>
                      </td>
                      <td>
                        <div className={`portal-assigned-badge ${emp.portalBadge}`}>
                          <span>{emp.portalName}</span>
                        </div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                          <MapPin size={13} color="#f59e0b" />
                          <span>{emp.location}</span>
                        </div>
                      </td>
                      <td>
                        <span style={{ fontSize: '0.74rem', color: '#cbd5e1' }}>{emp.activeTicket}</span>
                      </td>
                      <td>
                        <span className={`status-pill-tech ${emp.statusClass}`}>
                          <span className="pulse-dot" style={{ width: 6, height: 6 }} />
                          <span>{emp.status}</span>
                        </span>
                      </td>
                      <td>
                        <div className="tech-action-buttons" style={{ justifyContent: 'flex-end' }}>
                          <button
                            className="btn-launch-portal"
                            onClick={() => navigate(emp.assignedPortal)}
                            title={`Directly launch ${emp.portalName}`}
                          >
                            <span>Launch Portal</span>
                            <ExternalLink size={12} />
                          </button>
                          <button
                            className="btn-reassign-portal"
                            onClick={() => handleOpenEditModal(emp)}
                            title="Edit Assignment"
                          >
                            <Edit3 size={13} />
                          </button>
                          <button
                            className="btn-delete-tech"
                            onClick={() => handleDeleteEmployee(emp.id)}
                            title="Remove Assignment"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredEmployees.length === 0 && (
                    <tr>
                      <td colSpan={7} style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
                        No employee assignments matching the selected filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 2: FIELD WORK ORDERS ── */}
      {activeTab === 'workorders' && (
        <div className="technician-module-container">
          <div className="tech-module-header">
            <div className="tech-header-left">
              <div className="tech-header-pill">
                <Wrench size={13} color="#38bdf8" /> TICKETING & DISPATCH
              </div>
              <h3>Active Equipment Maintenance Work Orders</h3>
              <p>Real-time mechanical, electrical, and sensor breakdown response queue.</p>
            </div>
          </div>

          <div className="tech-workorders-grid">
            <div className="tech-wo-card">
              <div className="tech-wo-top">
                <span className="tech-wo-id">WO-842</span>
                <span className="tech-wo-priority critical">Critical</span>
              </div>
              <h4 className="tech-wo-title">Chiller 2 Compressor Bearing Overhaul</h4>
              <div className="tech-wo-meta">
                <span>Location: Central Plant — Chiller Room 2</span>
                <span>Signal: High vibration detected (3.2 mm/s spike)</span>
              </div>
              <div className="tech-wo-assigned">
                <Users size={13} />
                <span>Assigned: Rajesh Kumar (MEP Station)</span>
              </div>
            </div>

            <div className="tech-wo-card">
              <div className="tech-wo-top">
                <span className="tech-wo-id">WO-845</span>
                <span className="tech-wo-priority high">High Priority</span>
              </div>
              <h4 className="tech-wo-title">Level 24 Shear Wall Sensor Recalibration</h4>
              <div className="tech-wo-meta">
                <span>Location: Tower A Core Wall</span>
                <span>Signal: Drift offset 4.2% on strain gauge #14</span>
              </div>
              <div className="tech-wo-assigned">
                <Users size={13} />
                <span>Assigned: Amit Patel (Digital Twin Station)</span>
              </div>
            </div>

            <div className="tech-wo-card">
              <div className="tech-wo-top">
                <span className="tech-wo-id">WO-856</span>
                <span className="tech-wo-priority high">High Priority</span>
              </div>
              <h4 className="tech-wo-title">Substation Alpha 33kV Thermography Scan</h4>
              <div className="tech-wo-meta">
                <span>Location: Substation Alpha — Yard 1</span>
                <span>Signal: Scheduled bi-weekly thermal infrared inspection</span>
              </div>
              <div className="tech-wo-assigned">
                <Users size={13} />
                <span>Assigned: Ananya Sen (Technician Station)</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 3: IOT TELEMETRY ── */}
      {activeTab === 'telemetry' && (
        <div className="technician-module-container">
          <div className="tech-module-header">
            <div className="tech-header-left">
              <div className="tech-header-pill">
                <Activity size={13} color="#38bdf8" /> SENSOR TELEMETRY STREAM
              </div>
              <h3>Machinery Health & Continuous Sensor Monitoring</h3>
              <p>Real-time telemetry feeds connected to equipment sensors across the site.</p>
            </div>
          </div>

          <div className="tech-workorders-grid">
            <div className="tech-wo-card">
              <span className="tech-wo-id">DEVICE: CHILLER-02</span>
              <h4 className="tech-wo-title">Centrifugal Water Chiller 500 TR</h4>
              <div className="tech-wo-meta">
                <span>Bearing Vibration: <strong>1.4 mm/s (Normal)</strong></span>
                <span>Oil Temp: <strong>52.4 °C</strong></span>
                <span>Refrigerant Pressure: <strong>580 kPa</strong></span>
              </div>
            </div>

            <div className="tech-wo-card">
              <span className="tech-wo-id">DEVICE: GENSET-01</span>
              <h4 className="tech-wo-title">1500 kVA Backup Diesel Generator</h4>
              <div className="tech-wo-meta">
                <span>Fuel Buffer: <strong>92% (4,200 Liters)</strong></span>
                <span>Battery Voltage: <strong>26.8 V</strong></span>
                <span>Coolant Temp: <strong>45 °C (Ready)</strong></span>
              </div>
            </div>

            <div className="tech-wo-card">
              <span className="tech-wo-id">DEVICE: TOWER-CRANE-1</span>
              <h4 className="tech-wo-title">50m Jib Top-Slewing Tower Crane</h4>
              <div className="tech-wo-meta">
                <span>Anemometer Wind: <strong>14.2 km/h (Safe &lt; 45)</strong></span>
                <span>Hoist Motor Temp: <strong>62 °C</strong></span>
                <span>Load Moment Indicator: <strong>68% Safe Limit</strong></span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 4: CHECKLISTS ── */}
      {activeTab === 'checklists' && (
        <div className="technician-module-container">
          <div className="tech-module-header">
            <div className="tech-header-left">
              <div className="tech-header-pill">
                <CheckSquare size={13} color="#38bdf8" /> PREVENTATIVE PROTOCOLS
              </div>
              <h3>Technician Field Maintenance Checklists</h3>
              <p>Lock-Out Tag-Out (LOTO), electrical isolation, and pre-start inspection checks.</p>
            </div>
          </div>

          <div className="tech-roster-table-card" style={{ padding: '1.2rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#ffffff', cursor: 'pointer' }}>
                <input type="checkbox" defaultChecked style={{ width: 16, height: 16 }} />
                <span>Verify electrical circuit isolation with calibrated digital multimeter (Zero Volts confirmed)</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#ffffff', cursor: 'pointer' }}>
                <input type="checkbox" defaultChecked style={{ width: 16, height: 16 }} />
                <span>Apply physical padlock and Red Danger LOTO tag to breaker panel QF-04</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#ffffff', cursor: 'pointer' }}>
                <input type="checkbox" defaultChecked style={{ width: 16, height: 16 }} />
                <span>Inspect hydraulic hoses for micro-abrasions and fluid weepage</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#ffffff', cursor: 'pointer' }}>
                <input type="checkbox" defaultChecked style={{ width: 16, height: 16 }} />
                <span>Check fastener torque values with calibrated digital torque wrench to 120 Nm</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#cbd5e1', cursor: 'pointer' }}>
                <input type="checkbox" style={{ width: 16, height: 16 }} />
                <span>Upload before/after work photographs to BuildSphere DPR repository</span>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL: ASSIGN / ADD EMPLOYEE TO PORTAL ── */}
      {showAssignModal && (
        <div className="tech-modal-backdrop">
          <div className="tech-modal-card">
            <div className="tech-modal-header">
              <h4>
                <Users size={18} color="#38bdf8" />
                <span>{editingEmployee ? 'Edit Employee Portal Assignment' : 'Assign Employee to Operational Portal'}</span>
              </h4>
              <button className="tech-modal-close" onClick={() => setShowAssignModal(false)}>✕</button>
            </div>

            <form onSubmit={handleSaveEmployee}>
              <div className="tech-modal-body">
                <div className="tech-form-grid">
                  <div className="tech-input-group">
                    <label>Employee Name *</label>
                    <input
                      type="text"
                      placeholder="e.g. Rajesh Kumar"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>

                  <div className="tech-input-group">
                    <label>Employee ID *</label>
                    <input
                      type="text"
                      placeholder="e.g. TECH-205"
                      value={formData.id}
                      onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                      required
                    />
                  </div>

                  <div className="tech-input-group">
                    <label>Specialization / Trade</label>
                    <select
                      value={formData.trade}
                      onChange={(e) => setFormData({ ...formData, trade: e.target.value })}
                    >
                      <option value="HVAC & Chiller Specialist">HVAC & Chiller Specialist</option>
                      <option value="High-Voltage Switchgear & Substation">High-Voltage Electrical Substation</option>
                      <option value="IoT Telemetry & Sensors">IoT Telemetry & Sensors</option>
                      <option value="Structural & Concrete Testing">Structural & Concrete Testing</option>
                      <option value="Plumbing & Hydronics">Plumbing & Hydronics</option>
                      <option value="BIM Clash & Field Coordination">BIM Clash & Field Coordination</option>
                      <option value="Heavy Machinery & Cranes">Heavy Machinery & Cranes</option>
                    </select>
                  </div>

                  <div className="tech-input-group">
                    <label>Assigned Portal to Work in *</label>
                    <select
                      value={formData.assignedPortal}
                      onChange={(e) => setFormData({ ...formData, assignedPortal: e.target.value })}
                      required
                    >
                      {AVAILABLE_PORTALS.map(p => (
                        <option key={p.path} value={p.path}>{p.name} ({p.path})</option>
                      ))}
                    </select>
                  </div>

                  <div className="tech-input-group full-width">
                    <label>Job Location / Plant Zone</label>
                    <input
                      type="text"
                      placeholder="e.g. Tower B — Level 14 AHU Room"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    />
                  </div>

                  <div className="tech-input-group full-width">
                    <label>Assigned Work Order / Ticket</label>
                    <input
                      type="text"
                      placeholder="e.g. WO-860: Pump impeller inspection & alignment"
                      value={formData.activeTicket}
                      onChange={(e) => setFormData({ ...formData, activeTicket: e.target.value })}
                    />
                  </div>

                  <div className="tech-input-group">
                    <label>Duty Status</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    >
                      <option value="Active (On-Duty)">Active (On-Duty)</option>
                      <option value="Dispatched">Dispatched</option>
                      <option value="Standby">Standby</option>
                    </select>
                  </div>

                  <div className="tech-input-group">
                    <label>Assigned Shift</label>
                    <select
                      value={formData.shift}
                      onChange={(e) => setFormData({ ...formData, shift: e.target.value })}
                    >
                      <option value="Day Shift (08:00 - 17:00)">Day Shift (08:00 - 17:00)</option>
                      <option value="Evening Shift (16:00 - 00:00)">Evening Shift (16:00 - 00:00)</option>
                      <option value="Night / Standby">Night / Standby</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="tech-modal-footer">
                <button
                  type="button"
                  className="btn-tech-cancel"
                  onClick={() => setShowAssignModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-tech-submit">
                  <CheckCircle2 size={16} />
                  <span>{editingEmployee ? 'Update Assignment' : 'Confirm Assignment'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </CyberPortalLayout>
  );
}
