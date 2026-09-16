import React, { useState } from 'react';
import {
  Activity, AlertTriangle, Bot, CheckCircle2, ChevronDown, Compass, Filter, Leaf, MoreVertical, Plus, RefreshCcw, Search, Send, Wifi, Zap, Settings, Globe, Building2, CreditCard, Bell, Save, Shield, Layout, Palette
} from 'lucide-react';

export function ModuleHeader({ title, description, actionText = "Create New" }) {
  return (
    <div style={{ marginBottom: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: '0 0 0.25rem 0', color: '#ffffff' }}>{title}</h2>
          <p style={{ color: '#64748b', margin: 0, fontSize: '0.875rem' }}>{description}</p>
        </div>
        <button style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#4f46e5', color: 'white', padding: '0.5rem 1rem', borderRadius: '0.5rem', border: 'none', cursor: 'pointer', fontWeight: 500, fontSize: '0.875rem' }}>
          <Plus size={16} /> {actionText}
        </button>
      </div>
    </div>
  );
}

export function Tabs({ tabs, activeTab, onChange }) {
  return (
    <div style={{ display: 'flex', gap: '2rem', borderBottom: '1px solid #e2e8f0', marginBottom: '1.5rem', overflowX: 'auto', paddingBottom: '1px' }}>
      {tabs.map(t => (
        <button 
          key={t}
          onClick={() => onChange(t)}
          style={{ 
            padding: '0.75rem 0', 
            background: 'none', border: 'none', 
            borderBottom: activeTab === t ? '2px solid #4f46e5' : '2px solid transparent',
            color: activeTab === t ? '#ffffff' : '#94a3b8',
            fontWeight: activeTab === t ? 600 : 500,
            fontSize: '0.875rem', cursor: 'pointer', whiteSpace: 'nowrap'
          }}
        >
          {t}
        </button>
      ))}
    </div>
  )
}

import { PremiumPlaceholder } from './SharedUI';

function SubModulePlaceholder({ title }) {
  return <PremiumPlaceholder title={title} />;
}

export function OrgProfileModule() {
  const [t, setT] = useState('Company Profile');
  return <div><ModuleHeader title="Organization Profile" description="Manage company details and branches." /><Tabs tabs={['Company Profile', 'Branch Offices', 'Departments', 'Licenses', 'Certifications', 'Company Branding', 'Organization Structure', 'Business Units', 'Contact Directory', 'Company Documents']} activeTab={t} onChange={setT} /><SubModulePlaceholder title={t} /></div>;
}

export function BusinessAnalyticsModule() {
  const [t, setT] = useState('Revenue Dashboard');
  return <div><ModuleHeader title="Business Analytics" description="High-level business and financial analytics." /><Tabs tabs={['Revenue Dashboard', 'Profit Dashboard', 'Expense Dashboard', 'Project Profitability', 'Monthly Revenue', 'Annual Revenue', 'Client Growth', 'Market Trends', 'Organization KPIs', 'AI Insights']} activeTab={t} onChange={setT} /><SubModulePlaceholder title={t} /></div>;
}

export function PortfolioModule() {
  const [t, setT] = useState('Portfolio Overview');
  return <div><ModuleHeader title="Portfolio Management" description="Multi-project portfolio oversight." /><Tabs tabs={['Portfolio Overview', 'Multi-Project Dashboard', 'Portfolio Risk Analysis', 'Portfolio Timeline', 'Portfolio Health', 'Cross-Project Analytics', 'Resource Sharing', 'Portfolio Budget']} activeTab={t} onChange={setT} /><SubModulePlaceholder title={t} /></div>;
}

export function ProjectManagementModule() {
  const [t, setT] = useState('Project Dashboard');
  return <div><ModuleHeader title="Project Management" description="Track timelines, delays, and critical paths." /><Tabs tabs={['Project Dashboard', 'Project Creation', 'Milestones', 'Timeline', 'Gantt Charts', 'Resource Allocation', 'Project Health', 'Schedule Monitoring', 'Delay Tracking', 'Critical Path', 'Risk Register']} activeTab={t} onChange={setT} /><SubModulePlaceholder title={t} /></div>;
}

export function DepartmentModule() {
  const [t, setT] = useState('Architecture');
  return <div><ModuleHeader title="Department Management" description="Manage specific functional departments." /><Tabs tabs={['Architecture', 'Civil', 'Structural', 'MEP', 'BIM', 'Quantity Survey', 'Cost', 'Procurement', 'GIS', 'Digital Twin', 'IoT', 'Finance', 'HR', 'Legal']} activeTab={t} onChange={setT} /><SubModulePlaceholder title={t} /></div>;
}

export function EmployeeModule() {
  const [t, setT] = useState('Employee Directory');
  return <div><ModuleHeader title="Employee Management" description="Manage staff records and performance." /><Tabs tabs={['Employee Directory', 'Skill Matrix', 'Certifications', 'Attendance', 'Leave', 'Timesheets', 'Performance Reviews', 'Training Records', 'Productivity Dashboard', 'Workload Management']} activeTab={t} onChange={setT} /><SubModulePlaceholder title={t} /></div>;
}

export function WorkforceModule() {
  const [t, setT] = useState('Workforce Planning');
  return <div><ModuleHeader title="Team & Workforce" description="Labor analytics and crew allocation." /><Tabs tabs={['Workforce Planning', 'Team Assignment', 'Crew Allocation', 'Shift Planning', 'Labor Analytics', 'Productivity Reports', 'Utilization Score']} activeTab={t} onChange={setT} /><SubModulePlaceholder title={t} /></div>;
}

export function OrgRolesModule() {
  const [t, setT] = useState('Dynamic Role Builder');
  return <div><ModuleHeader title="Roles & Permissions" description="Manage org-wide permissions." /><Tabs tabs={['Dynamic Role Builder', 'Permission Matrix', 'Module Permissions', 'API Permissions', 'AI Permissions', 'Project Permissions', 'Organization Permissions', 'Field-Level Security', 'Temporary Access', 'Approval Workflow']} activeTab={t} onChange={setT} /><SubModulePlaceholder title={t} /></div>;
}

export function ClientModule() {
  const [t, setT] = useState('Client Portfolio');
  return <div><ModuleHeader title="Client Management" description="Client relations and contracts." /><Tabs tabs={['Client Portfolio', 'Client Contracts', 'Communication Hub', 'Client Approvals', 'Project Access', 'Client Satisfaction', 'Revenue by Client']} activeTab={t} onChange={setT} /><SubModulePlaceholder title={t} /></div>;
}

export function ContractorModule() {
  const [t, setT] = useState('Contractor Performance');
  return <div><ModuleHeader title="Contractor Management" description="Sub-contractor oversight." /><Tabs tabs={['Contractor Performance', 'Contracts', 'Work Packages', 'Safety Records', 'Payment Tracking', 'AI Contractor Score']} activeTab={t} onChange={setT} /><SubModulePlaceholder title={t} /></div>;
}

export function VendorModule() {
  const [t, setT] = useState('Vendor Directory');
  return <div><ModuleHeader title="Vendor Management" description="Supplier and vendor ratings." /><Tabs tabs={['Vendor Directory', 'Vendor Ratings', 'Purchase Orders', 'Deliveries', 'Procurement Status', 'Vendor AI Ranking']} activeTab={t} onChange={setT} /><SubModulePlaceholder title={t} /></div>;
}

export function ProcurementModule() {
  const [t, setT] = useState('RFQ');
  return <div><ModuleHeader title="Procurement Center" description="Materials and RFQ pipeline." /><Tabs tabs={['RFQ', 'Purchase Requests', 'Purchase Orders', 'Vendor Quotes', 'Inventory Status', 'Material Tracking', 'AI Procurement Optimization']} activeTab={t} onChange={setT} /><SubModulePlaceholder title={t} /></div>;
}

export function OrgFinanceModule() {
  const [t, setT] = useState('Budget');
  return <div><ModuleHeader title="Financial Center" description="Organization budgets and cash flow." /><Tabs tabs={['Budget', 'Cost Tracking', 'Revenue', 'Cash Flow', 'Invoices', 'Payments', 'Profit & Loss', 'Tax Reports', 'Financial Forecasts']} activeTab={t} onChange={setT} /><SubModulePlaceholder title={t} /></div>;
}

export function ResourceModule() {
  const [t, setT] = useState('Human Resources');
  return <div><ModuleHeader title="Resource Management" description="Equipment, materials, and human resources." /><Tabs tabs={['Human Resources', 'Equipment', 'Materials', 'Vehicles', 'Machinery', 'Resource Utilization', 'Resource Availability']} activeTab={t} onChange={setT} /><SubModulePlaceholder title={t} /></div>;
}

export function AssetModule() {
  const [t, setT] = useState('Buildings');
  return <div><ModuleHeader title="Asset Management" description="Facilities and fixed assets." /><Tabs tabs={['Buildings', 'Facilities', 'Machinery', 'Furniture', 'BIM Assets', 'Maintenance History', 'Warranty Tracking']} activeTab={t} onChange={setT} /><SubModulePlaceholder title={t} /></div>;
}

export function EquipmentModule() {
  const [t, setT] = useState('Equipment Inventory');
  return <div><ModuleHeader title="Equipment Management" description="GPS tracking and predictive maintenance." /><Tabs tabs={['Equipment Inventory', 'GPS Tracking', 'Utilization', 'Fuel Usage', 'Maintenance Schedule', 'Predictive Maintenance']} activeTab={t} onChange={setT} /><SubModulePlaceholder title={t} /></div>;
}

export function OrgBIMModule() {
  const [t, setT] = useState('BIM Models');
  return <div><ModuleHeader title="BIM Center" description="Building Information Modeling tools." /><Tabs tabs={['BIM Models', 'IFC Viewer', 'Clash Detection', 'Model Coordination', 'BIM Validation', 'Model Comparison', 'Quantity Extraction', 'AI BIM Assistant']} activeTab={t} onChange={setT} /><SubModulePlaceholder title={t} /></div>;
}

export function OrgDigitalTwinModule() {
  const [t, setT] = useState('Twin Dashboard');
  
  const renderContent = () => {
    if (t === 'Twin Dashboard') {
      return (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
          {/* Top Row: 3D Twin & Key Metrics */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
            
            {/* 3D Model Viewer Mock */}
            <div style={{ backgroundColor: '#ffffff', borderRadius: '1rem', border: '1px solid #334155', overflow: 'hidden', position: 'relative', height: '500px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}>
              <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(10px)', position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10 }}>
                <h3 style={{ margin: 0, fontSize: '1rem', color: 'white', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Compass size={16} color="#38bdf8" /> Real-time 3D Digital Twin</h3>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Gateway Business Tower</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem', color: '#10b981', backgroundColor: 'rgba(16, 185, 129, 0.1)', padding: '0.25rem 0.75rem', borderRadius: '999px', border: '1px solid rgba(16,185,129,0.2)' }}>
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10b981', boxShadow: '0 0 8px #10b981' }}></div> Live Sync
                  </span>
                </div>
              </div>
              
              <div style={{ width: '100%', height: '100%', backgroundImage: 'url("https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200&auto=format&fit=crop")', backgroundSize: 'cover', backgroundPosition: 'center', filter: 'brightness(0.6) sepia(1) hue-rotate(180deg) saturate(1.5)', position: 'relative' }}>
                
                {/* Holographic Overlays */}
                <div style={{ position: 'absolute', top: '30%', left: '40%', width: '120px', height: '2px', backgroundColor: '#38bdf8', transform: 'rotate(-15deg)', boxShadow: '0 0 10px #38bdf8' }}></div>
                <div style={{ position: 'absolute', top: '25%', left: '50%', backgroundColor: 'rgba(15,23,42,0.9)', border: '1px solid #38bdf8', padding: '0.5rem', borderRadius: '0.25rem', color: 'white', fontSize: '0.65rem' }}>
                  <div style={{ color: '#38bdf8', fontWeight: 'bold' }}>HVAC Core 01</div>
                  <div>Temp: 22°C</div>
                  <div>Flow: 450 CFM</div>
                </div>

                <div style={{ position: 'absolute', bottom: '20%', right: '30%', width: '100px', height: '2px', backgroundColor: '#f59e0b', transform: 'rotate(10deg)', boxShadow: '0 0 10px #f59e0b' }}></div>
                <div style={{ position: 'absolute', bottom: '22%', right: '15%', backgroundColor: 'rgba(15,23,42,0.9)', border: '1px solid #f59e0b', padding: '0.5rem', borderRadius: '0.25rem', color: 'white', fontSize: '0.65rem' }}>
                  <div style={{ color: '#f59e0b', fontWeight: 'bold' }}>Elevator Bank B</div>
                  <div>Status: Maintenance Req</div>
                  <div>Vibration: High</div>
                </div>

                <div style={{ position: 'absolute', bottom: '1.5rem', left: '1.5rem', backgroundColor: 'rgba(15,23,42,0.8)', backdropFilter: 'blur(12px)', padding: '1rem', borderRadius: '0.75rem', border: '1px solid rgba(255,255,255,0.1)', color: 'white', width: '250px' }}>
                  <div style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '0.75rem', letterSpacing: '1px' }}>Global Sensor Status</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem' }}><div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Activity size={14} color="#38bdf8" /> Structural</div> <span style={{ color: '#10b981', fontWeight: 600 }}>Normal</span></div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem' }}><div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Zap size={14} color="#f59e0b" /> Electrical Load</div> <span style={{ color: '#f59e0b', fontWeight: 600 }}>85% (High)</span></div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem' }}><div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Wifi size={14} color="#10b981" /> IoT Network</div> <span style={{ color: '#10b981', fontWeight: 600 }}>100% Uptime</span></div>
                  </div>
                </div>

                {/* Camera Controls */}
                <div style={{ position: 'absolute', right: '1.5rem', bottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <button style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'rgba(15,23,42,0.8)', border: '1px solid rgba(255,255,255,0.2)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><Plus size={16} /></button>
                  <button style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'rgba(15,23,42,0.8)', border: '1px solid rgba(255,255,255,0.2)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><div style={{ width: '12px', height: '2px', backgroundColor: 'white' }}></div></button>
                  <button style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'rgba(15,23,42,0.8)', border: '1px solid rgba(255,255,255,0.2)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', marginTop: '0.5rem' }}><RefreshCcw size={14} /></button>
                </div>
              </div>
            </div>

            {/* Right Panel: Alerts & Health */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ backgroundColor: 'white', borderRadius: '1rem', border: '1px solid #e2e8f0', padding: '1.5rem', flex: 1 }}>
                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                   <h3 style={{ margin: 0, fontSize: '1rem', color: '#ffffff' }}>System Alerts</h3>
                   <span style={{ fontSize: '0.75rem', color: '#ef4444', backgroundColor: '#fee2e2', padding: '0.15rem 0.5rem', borderRadius: '999px', fontWeight: 600 }}>2 Critical</span>
                 </div>
                 
                 <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                   <div style={{ padding: '1rem', backgroundColor: '#fffbeb', border: '1px solid #fef3c7', borderRadius: '0.5rem', borderLeft: '3px solid #f59e0b' }}>
                     <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                       <AlertTriangle size={16} color="#f59e0b" style={{ marginTop: '0.1rem' }} />
                       <div>
                         <h6 style={{ margin: '0 0 0.25rem 0', fontSize: '0.875rem', color: '#92400e' }}>High Power Consumption</h6>
                         <p style={{ margin: 0, fontSize: '0.75rem', color: '#b45309' }}>Floor 12 server room exceeding baseline by 18%.</p>
                       </div>
                     </div>
                   </div>
                   
                   <div style={{ padding: '1rem', backgroundColor: '#fef2f2', border: '1px solid #fee2e2', borderRadius: '0.5rem', borderLeft: '3px solid #ef4444' }}>
                     <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                       <AlertTriangle size={16} color="#ef4444" style={{ marginTop: '0.1rem' }} />
                       <div>
                         <h6 style={{ margin: '0 0 0.25rem 0', fontSize: '0.875rem', color: '#991b1b' }}>Vibration Anomaly Detected</h6>
                         <p style={{ margin: 0, fontSize: '0.75rem', color: '#b91c1c' }}>Elevator motor Bank B showing irregular patterns.</p>
                       </div>
                     </div>
                   </div>
                   
                   <div style={{ padding: '1rem', backgroundColor: 'rgba(255, 255, 255, 0.05)', border: '1px solid #e2e8f0', borderRadius: '0.5rem', borderLeft: '3px solid #64748b' }}>
                     <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                       <CheckCircle2 size={16} color="#64748b" style={{ marginTop: '0.1rem' }} />
                       <div>
                         <h6 style={{ margin: '0 0 0.25rem 0', fontSize: '0.875rem', color: '#334155' }}>HVAC Maintenance Scheduled</h6>
                         <p style={{ margin: 0, fontSize: '0.75rem', color: '#64748b' }}>Routine maintenance for central chiller starts in 2 days.</p>
                       </div>
                     </div>
                   </div>
                 </div>
              </div>
              
              <div style={{ backgroundColor: 'white', borderRadius: '1rem', border: '1px solid #e2e8f0', padding: '1.5rem' }}>
                <h3 style={{ margin: '0 0 1.5rem 0', fontSize: '1rem', color: '#ffffff' }}>Overall Health Score</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                  <div style={{ position: 'relative', width: '120px', height: '120px' }}>
                    <svg viewBox="0 0 36 36" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
                      <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#e2e8f0" strokeWidth="3" />
                      <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#10b981" strokeWidth="3" strokeDasharray="92, 100" />
                    </svg>
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                      <h2 style={{ margin: 0, fontSize: '1.75rem', fontWeight: 800, color: '#ffffff' }}>92<span style={{ fontSize: '1rem' }}>%</span></h2>
                      <span style={{ fontSize: '0.65rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px' }}>Optimal</span>
                    </div>
                  </div>
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem' }}><span style={{ color: '#64748b' }}>Structural</span> <strong>98%</strong></div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem' }}><span style={{ color: '#64748b' }}>Mechanical</span> <strong>85%</strong></div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem' }}><span style={{ color: '#64748b' }}>Electrical</span> <strong>90%</strong></div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem' }}><span style={{ color: '#64748b' }}>Environmental</span> <strong>95%</strong></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Row: Analytics & AI */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div style={{ backgroundColor: 'white', borderRadius: '1rem', border: '1px solid #e2e8f0', padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3 style={{ margin: 0, fontSize: '1rem', color: '#ffffff' }}>Energy Consumption vs AI Baseline</h3>
                <span style={{ fontSize: '0.75rem', color: '#64748b', border: '1px solid #e2e8f0', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>Last 7 Days <ChevronDown size={12} style={{ display: 'inline', marginLeft: '0.25rem' }}/></span>
              </div>
              <div style={{ height: '220px', width: '100%', position: 'relative' }}>
                {/* Simulated Chart via CSS */}
                <div style={{ position: 'absolute', bottom: '20px', left: '40px', right: 0, top: 0, borderLeft: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', padding: '0 1rem' }}>
                  <div style={{ width: '8%', height: '60%', backgroundColor: '#38bdf8', opacity: 0.8, borderTopLeftRadius: '2px', borderTopRightRadius: '2px' }}></div>
                  <div style={{ width: '8%', height: '65%', backgroundColor: '#38bdf8', opacity: 0.8, borderTopLeftRadius: '2px', borderTopRightRadius: '2px' }}></div>
                  <div style={{ width: '8%', height: '55%', backgroundColor: '#38bdf8', opacity: 0.8, borderTopLeftRadius: '2px', borderTopRightRadius: '2px' }}></div>
                  <div style={{ width: '8%', height: '80%', backgroundColor: '#f59e0b', opacity: 0.8, borderTopLeftRadius: '2px', borderTopRightRadius: '2px' }}></div>
                  <div style={{ width: '8%', height: '70%', backgroundColor: '#38bdf8', opacity: 0.8, borderTopLeftRadius: '2px', borderTopRightRadius: '2px' }}></div>
                  <div style={{ width: '8%', height: '60%', backgroundColor: '#38bdf8', opacity: 0.8, borderTopLeftRadius: '2px', borderTopRightRadius: '2px' }}></div>
                  <div style={{ width: '8%', height: '40%', backgroundColor: '#38bdf8', opacity: 0.8, borderTopLeftRadius: '2px', borderTopRightRadius: '2px' }}></div>
                  
                  {/* AI Baseline Trendline */}
                  <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} preserveAspectRatio="none">
                    <path d="M 20,100 L 100,80 L 180,120 L 260,110 L 340,90 L 420,110 L 500,140" fill="none" stroke="#4f46e5" strokeWidth="2" strokeDasharray="5,5" />
                  </svg>
                </div>
                <div style={{ position: 'absolute', bottom: 0, left: '40px', right: 0, display: 'flex', justifyContent: 'space-between', padding: '0 1rem', fontSize: '0.65rem', color: '#94a3b8' }}>
                  <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', marginTop: '1rem', fontSize: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><div style={{ width: '10px', height: '10px', backgroundColor: '#38bdf8', borderRadius: '2px' }}></div> Actual Usage</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><div style={{ width: '10px', height: '2px', backgroundColor: '#4f46e5', border: '1px dashed #4f46e5' }}></div> AI Predicted Baseline</div>
              </div>
            </div>

            <div style={{ backgroundColor: 'white', borderRadius: '1rem', border: '1px solid #e2e8f0', padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3 style={{ margin: 0, fontSize: '1rem', color: '#ffffff' }}>AI Predictive Maintenance</h3>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', padding: '1rem', border: '1px solid #e2e8f0', borderRadius: '0.5rem', backgroundColor: 'rgba(255, 255, 255, 0.05)' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '0.5rem', backgroundColor: '#e0e7ff', color: '#4f46e5', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Bot size={20} />
                  </div>
                  <div>
                    <h6 style={{ margin: '0 0 0.25rem 0', fontSize: '0.875rem', color: '#ffffff' }}>Chiller Plant #2 Failure Probability</h6>
                    <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.75rem', color: '#64748b', lineHeight: 1.5 }}>Machine learning models indicate a 78% probability of bearing failure within the next 14 days based on recent acoustic and vibration anomalies.</p>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button style={{ padding: '0.25rem 0.75rem', backgroundColor: '#4f46e5', color: 'white', border: 'none', borderRadius: '4px', fontSize: '0.7rem', cursor: 'pointer' }}>Schedule Technician</button>
                      <button style={{ padding: '0.25rem 0.75rem', backgroundColor: 'transparent', color: '#64748b', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '0.7rem', cursor: 'pointer' }}>View Sensor Data</button>
                    </div>
                  </div>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', padding: '1rem', border: '1px solid #e2e8f0', borderRadius: '0.5rem', backgroundColor: 'rgba(255, 255, 255, 0.05)' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '0.5rem', backgroundColor: '#dcfce7', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Leaf size={20} />
                  </div>
                  <div>
                    <h6 style={{ margin: '0 0 0.25rem 0', fontSize: '0.875rem', color: '#ffffff' }}>HVAC Optimization Suggestion</h6>
                    <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.75rem', color: '#64748b', lineHeight: 1.5 }}>Adjusting the VAV box setpoints on floors 15-20 during off-peak hours could save an estimated 12% in daily energy consumption.</p>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button style={{ padding: '0.25rem 0.75rem', backgroundColor: '#16a34a', color: 'white', border: 'none', borderRadius: '4px', fontSize: '0.7rem', cursor: 'pointer' }}>Apply AI Settings</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
    return <SubModulePlaceholder title={t} />;
  };

  return (
    <div>
      <ModuleHeader title="Digital Twin Center" description="Live sensor mapping and simulation." />
      <Tabs tabs={['Twin Dashboard', 'Live Sensors', 'Asset Monitoring', 'Maintenance', 'Health Score', 'Twin Analytics', 'Twin Simulation']} activeTab={t} onChange={setT} />
      {renderContent()}
    </div>
  );
}

export function OrgGISModule() {
  const [t, setT] = useState('Satellite Maps');
  return <div><ModuleHeader title="GIS Center" description="Geospatial route planning and topography." /><Tabs tabs={['Satellite Maps', 'Terrain', 'Utility Networks', 'Project Boundaries', 'Site Selection', 'Route Planning', 'Geospatial Analytics']} activeTab={t} onChange={setT} /><SubModulePlaceholder title={t} /></div>;
}

export function OrgIoTModule() {
  const [t, setT] = useState('Connected Devices');
  return <div><ModuleHeader title="IoT Center" description="Live equipment alerts and monitoring." /><Tabs tabs={['Connected Devices', 'Sensors', 'Live Monitoring', 'Alerts', 'Equipment Status', 'Environmental Monitoring', 'Predictive Analytics']} activeTab={t} onChange={setT} /><SubModulePlaceholder title={t} /></div>;
}

export function OrgAIMLModule() {
  const [t, setT] = useState('Executive AI');
  return <div><ModuleHeader title="AI & ML Center" description="Extensive AI toolset for optimization." /><Tabs tabs={['Executive AI', 'Project AI', 'Financial AI', 'Procurement AI', 'BIM AI', 'Design AI', 'Workforce AI', 'Sustainability AI', 'Machine Learning Models', 'Computer Vision Models', 'NLP Models', 'Recommendation Models', 'Risk & Anomaly Detection']} activeTab={t} onChange={setT} /><SubModulePlaceholder title={t} /></div>;
}

export function ReportsModule() {
  const [t, setT] = useState('Executive Dashboard');
  return <div><ModuleHeader title="Reports & Analytics" description="Custom report building and KPIs." /><Tabs tabs={['Executive Dashboard', 'Organization KPIs', 'Department Reports', 'Financial Reports', 'Project Reports', 'Workforce Reports', 'AI Insights', 'Custom Report Builder']} activeTab={t} onChange={setT} /><SubModulePlaceholder title={t} /></div>;
}

export function OrgRiskModule() {
  const [t, setT] = useState('Risk Register');
  return <div><ModuleHeader title="Risk Management" description="Detect anomalies and threats." /><Tabs tabs={['Risk Register', 'Financial Fraud Detection', 'Budget Anomaly Detection', 'Procurement Risk Detection', 'Cybersecurity Threat Detection', 'Equipment Failure Anomaly', 'Project Risk Prediction', 'Compliance Risk Detection']} activeTab={t} onChange={setT} /><SubModulePlaceholder title={t} /></div>;
}

export function OrgComplianceModule() {
  const [t, setT] = useState('Building Code Validation');
  return <div><ModuleHeader title="Compliance Center" description="Regulatory verification." /><Tabs tabs={['Building Code Validation', 'Fire Compliance', 'Structural Compliance', 'Environmental Compliance', 'Regulation Verification']} activeTab={t} onChange={setT} /><SubModulePlaceholder title={t} /></div>;
}

export function OrgSustainabilityModule() {
  const [t, setT] = useState('Carbon Footprint');
  return <div><ModuleHeader title="Sustainability Dashboard" description="ESG reporting and carbon analytics." /><Tabs tabs={['Carbon Footprint', 'Water Usage', 'Energy Efficiency', 'Waste Recycled', 'AI Carbon Analyzer', 'AI Energy Optimizer', 'AI Green Material Recommendation', 'AI ESG Dashboard', 'AI Sustainability Scoring']} activeTab={t} onChange={setT} /><SubModulePlaceholder title={t} /></div>;
}

export function OrgSecurityModule() {
  const [t, setT] = useState('SSO');
  return <div><ModuleHeader title="Security Center" description="Device management and SSO." /><Tabs tabs={['SSO', 'MFA', 'User Access Control', 'Device Management', 'Login History', 'Organization Audit Logs', 'Security Policies', 'Threat Monitoring']} activeTab={t} onChange={setT} /><SubModulePlaceholder title={t} /></div>;
}

export function OrgAPIModule() {
  const [t, setT] = useState('ERP Integration');
  return <div><ModuleHeader title="API & Integration Center" description="Integrations with third-party software." /><Tabs tabs={['ERP Integration', 'CRM Integration', 'Accounting Software', 'BIM Integrations', 'GIS Services', 'IoT Platforms', 'REST APIs', 'Webhooks', 'OAuth Clients']} activeTab={t} onChange={setT} /><SubModulePlaceholder title={t} /></div>;
}

export function OrgSettingsModule() {
  const [activeTab, setActiveTab] = useState('General');

  const settingsTabs = [
    { id: 'General', icon: <Building2 size={16} /> },
    { id: 'Preferences', icon: <Globe size={16} /> },
    { id: 'Notifications', icon: <Bell size={16} /> },
    { id: 'Billing', icon: <CreditCard size={16} /> }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', color: '#ffffff' }}>
      {/* Header */}
      <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 'bold', margin: '0 0 0.25rem 0', color: 'rgba(255, 255, 255, 0.02)' }}>Organization Settings</h2>
          <p style={{ color: '#94a3b8', margin: 0, fontSize: '0.9rem' }}>Global preferences and configurations.</p>
        </div>
        <button style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#4f46e5', color: 'white', padding: '0.6rem 1.2rem', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '0.875rem', transition: 'background-color 0.2s', boxShadow: '0 4px 6px -1px rgba(79, 70, 229, 0.3)' }}>
          <Save size={16} /> Save Changes
        </button>
      </div>

      {/* Main Content Layout */}
      <div style={{ display: 'flex', gap: '2rem', flex: 1, minHeight: '600px' }}>
        {/* Sidebar Nav */}
        <div style={{ width: '240px', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {settingsTabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.75rem',
                padding: '0.75rem 1rem', borderRadius: '8px', border: 'none',
                backgroundColor: activeTab === tab.id ? 'rgba(79, 70, 229, 0.15)' : 'transparent',
                color: activeTab === tab.id ? '#818cf8' : '#94a3b8',
                fontWeight: activeTab === tab.id ? 600 : 500,
                fontSize: '0.9rem', cursor: 'pointer', textAlign: 'left',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => { if (activeTab !== tab.id) { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = 'rgba(255, 255, 255, 0.1)'; } }}
              onMouseLeave={(e) => { if (activeTab !== tab.id) { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#94a3b8'; } }}
            >
              {tab.icon}
              {tab.id}
            </button>
          ))}
        </div>

        {/* Form Container */}
        <div style={{ flex: 1, backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #1e293b', padding: '2rem', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)' }}>
          
          {activeTab === 'General' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', animation: 'fadeIn 0.3s ease' }}>
              <h3 style={{ fontSize: '1.25rem', color: '#f1f5f9', margin: '0 0 1rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Building2 size={20} color="#818cf8"/> General Information</h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontSize: '0.85rem', color: '#cbd5e1', fontWeight: 500 }}>Organization Name</label>
                  <input type="text" defaultValue="Apex Constructions Ltd." style={{ padding: '0.75rem', backgroundColor: '#e2e8f0', border: '1px solid #334155', borderRadius: '6px', color: '#ffffff', fontSize: '0.9rem', outline: 'none' }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontSize: '0.85rem', color: '#cbd5e1', fontWeight: 500 }}>Legal Entity Type</label>
                  <select style={{ padding: '0.75rem', backgroundColor: '#e2e8f0', border: '1px solid #334155', borderRadius: '6px', color: '#ffffff', fontSize: '0.9rem', outline: 'none' }}>
                    <option>LLC (Limited Liability Company)</option>
                    <option>Corporation (Inc.)</option>
                    <option>Partnership</option>
                  </select>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontSize: '0.85rem', color: '#cbd5e1', fontWeight: 500 }}>Headquarters Location</label>
                  <input type="text" defaultValue="Mumbai, India" style={{ padding: '0.75rem', backgroundColor: '#e2e8f0', border: '1px solid #334155', borderRadius: '6px', color: '#ffffff', fontSize: '0.9rem', outline: 'none' }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontSize: '0.85rem', color: '#cbd5e1', fontWeight: 500 }}>Support Email</label>
                  <input type="email" defaultValue="admin@apexconstructions.com" style={{ padding: '0.75rem', backgroundColor: '#e2e8f0', border: '1px solid #334155', borderRadius: '6px', color: '#ffffff', fontSize: '0.9rem', outline: 'none' }} />
                </div>
              </div>

              <hr style={{ borderTop: '1px solid #1e293b', borderBottom: 'none', margin: '1rem 0' }} />
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#e2e8f0', padding: '1rem 1.5rem', borderRadius: '8px', border: '1px solid rgba(79,70,229,0.3)' }}>
                <div>
                  <h4 style={{ margin: '0 0 0.25rem 0', color: '#f1f5f9', fontSize: '1rem' }}>Organization Domain</h4>
                  <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.85rem' }}>Employees can automatically join using this email domain.</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{ backgroundColor: '#ffffff', padding: '0.4rem 0.8rem', borderRadius: '4px', fontSize: '0.9rem', color: '#a5b4fc', border: '1px solid #334155' }}>@apexconstructions.com</span>
                  <button style={{ padding: '0.4rem 0.8rem', backgroundColor: '#334155', color: '#ffffff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.85rem' }}>Edit</button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'Preferences' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', animation: 'fadeIn 0.3s ease' }}>
              <h3 style={{ fontSize: '1.25rem', color: '#f1f5f9', margin: '0 0 1rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Globe size={20} color="#818cf8"/> Regional Preferences</h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontSize: '0.85rem', color: '#cbd5e1', fontWeight: 500 }}>Default Timezone</label>
                  <select style={{ padding: '0.75rem', backgroundColor: '#e2e8f0', border: '1px solid #334155', borderRadius: '6px', color: '#ffffff', fontSize: '0.9rem', outline: 'none' }}>
                    <option>Asia/Kolkata (IST)</option>
                    <option>America/New_York (EST)</option>
                    <option>Europe/London (GMT)</option>
                  </select>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontSize: '0.85rem', color: '#cbd5e1', fontWeight: 500 }}>Date Format</label>
                  <select style={{ padding: '0.75rem', backgroundColor: '#e2e8f0', border: '1px solid #334155', borderRadius: '6px', color: '#ffffff', fontSize: '0.9rem', outline: 'none' }}>
                    <option>DD/MM/YYYY</option>
                    <option>MM/DD/YYYY</option>
                    <option>YYYY-MM-DD</option>
                  </select>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontSize: '0.85rem', color: '#cbd5e1', fontWeight: 500 }}>Measurement Units</label>
                  <select style={{ padding: '0.75rem', backgroundColor: '#e2e8f0', border: '1px solid #334155', borderRadius: '6px', color: '#ffffff', fontSize: '0.9rem', outline: 'none' }}>
                    <option>Metric (m, kg, °C)</option>
                    <option>Imperial (ft, lb, °F)</option>
                  </select>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontSize: '0.85rem', color: '#cbd5e1', fontWeight: 500 }}>Primary Currency</label>
                  <select style={{ padding: '0.75rem', backgroundColor: '#e2e8f0', border: '1px solid #334155', borderRadius: '6px', color: '#ffffff', fontSize: '0.9rem', outline: 'none' }}>
                    <option>INR (₹)</option>
                    <option>USD ($)</option>
                    <option>EUR (€)</option>
                  </select>
                </div>
              </div>

              <hr style={{ borderTop: '1px solid #1e293b', borderBottom: 'none', margin: '1rem 0' }} />
              <h3 style={{ fontSize: '1.25rem', color: '#f1f5f9', margin: '0 0 1rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Palette size={20} color="#818cf8"/> Interface & Theme</h3>
              
              <div style={{ display: 'flex', gap: '1rem' }}>
                 <div style={{ flex: 1, padding: '1rem', backgroundColor: '#e2e8f0', border: '2px solid #4f46e5', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#ffffff', display: 'flex', justifyContent: 'center', alignItems: 'center', border: '1px solid #334155' }}>🌙</div>
                    <div>
                      <h4 style={{ margin: 0, color: '#ffffff' }}>Dark Mode</h4>
                      <span style={{ fontSize: '0.8rem', color: '#818cf8' }}>Active</span>
                    </div>
                 </div>
                 <div style={{ flex: 1, padding: '1rem', backgroundColor: '#ffffff', border: '1px solid #334155', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '1rem', opacity: 0.7 }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'rgba(255, 255, 255, 0.05)', display: 'flex', justifyContent: 'center', alignItems: 'center', border: '1px solid #e2e8f0', color: '#000' }}>☀️</div>
                    <div>
                      <h4 style={{ margin: 0, color: '#94a3b8' }}>Light Mode</h4>
                      <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Inactive</span>
                    </div>
                 </div>
              </div>
            </div>
          )}

          {activeTab === 'Notifications' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', animation: 'fadeIn 0.3s ease' }}>
              <h3 style={{ fontSize: '1.25rem', color: '#f1f5f9', margin: '0 0 1rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Bell size={20} color="#818cf8"/> Global Notification Policies</h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {[
                  { title: 'Critical Safety Alerts', desc: 'Force SMS & Push notifications for all users on site.', active: true },
                  { title: 'Daily Digest Emails', desc: 'Send daily summary of tasks and RFIs to all managers.', active: true },
                  { title: 'Budget Overrun Warnings', desc: 'Notify executives when project costs exceed 90%.', active: false },
                  { title: 'New Employee Join Requests', desc: 'Alert organization admins when a new user signs up with company domain.', active: true },
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', backgroundColor: '#e2e8f0', borderRadius: '8px', border: '1px solid #334155' }}>
                    <div>
                      <h4 style={{ margin: '0 0 0.25rem 0', color: '#ffffff', fontSize: '0.95rem' }}>{item.title}</h4>
                      <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.85rem' }}>{item.desc}</p>
                    </div>
                    {/* Toggle Switch */}
                    <div style={{ width: '44px', height: '24px', backgroundColor: item.active ? '#4f46e5' : '#334155', borderRadius: '12px', position: 'relative', cursor: 'pointer', transition: 'background-color 0.2s' }}>
                      <div style={{ width: '20px', height: '20px', backgroundColor: 'rgba(255, 255, 255, 0.02)', borderRadius: '50%', position: 'absolute', top: '2px', left: item.active ? '22px' : '2px', transition: 'left 0.2s cubic-bezier(0.4, 0.0, 0.2, 1)', boxShadow: '0 1px 3px rgba(0,0,0,0.3)' }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'Billing' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', animation: 'fadeIn 0.3s ease' }}>
              <h3 style={{ fontSize: '1.25rem', color: '#f1f5f9', margin: '0 0 1rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Shield size={20} color="#818cf8"/> Current Plan</h3>
              
              <div style={{ background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.1) 0%, rgba(15, 23, 42, 0) 100%)', border: '1px solid rgba(79, 70, 229, 0.3)', borderRadius: '12px', padding: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <h2 style={{ fontSize: '1.75rem', color: 'rgba(255, 255, 255, 0.02)', margin: 0 }}>Enterprise Edition</h2>
                    <span style={{ backgroundColor: '#10b981', color: '#064e3b', fontSize: '0.75rem', fontWeight: 'bold', padding: '0.2rem 0.5rem', borderRadius: '12px' }}>Active</span>
                  </div>
                  <p style={{ color: '#94a3b8', margin: '0 0 1rem 0' }}>Unlimited projects, up to 5,000 active users.</p>
                  <p style={{ color: '#cbd5e1', fontSize: '0.9rem', margin: 0 }}>Next billing date: <strong>Sep 1, 2026</strong> ($4,500.00/mo)</p>
                </div>
                <button style={{ padding: '0.75rem 1.5rem', backgroundColor: 'transparent', color: '#a5b4fc', border: '1px solid #6366f1', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>Manage Subscription</button>
              </div>

              <h3 style={{ fontSize: '1.25rem', color: '#f1f5f9', margin: '1rem 0 0 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><CreditCard size={20} color="#818cf8"/> Payment Methods</h3>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.5rem', backgroundColor: '#e2e8f0', borderRadius: '8px', border: '1px solid #334155' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ width: '48px', height: '32px', backgroundColor: '#ffffff', borderRadius: '4px', border: '1px solid #475569', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#ffffff', fontWeight: 'bold', fontSize: '0.8rem', fontStyle: 'italic' }}>VISA</div>
                  <div>
                    <h4 style={{ margin: '0 0 0.25rem 0', color: '#ffffff', fontSize: '1rem' }}>Visa ending in 4242</h4>
                    <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.85rem' }}>Expires 12/2028</p>
                  </div>
                </div>
                <button style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '0.9rem' }}>Edit</button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export function OrgCopilotInterface() {
  const [msgs, setMsgs] = useState([
    { role: 'assistant', text: 'Hello, Rohit! I am the AI Executive Copilot. I can summarize portfolio health, forecast cash flow, recommend vendor improvements, or generate board presentations. How can I assist you today?' }
  ]);
  const [inp, setInp] = useState('');

  const handleSend = () => {
    if(!inp.trim()) return;
    setMsgs([...msgs, { role: 'user', text: inp }]);
    setInp('');
    setTimeout(() => {
      setMsgs(prev => [...prev, { role: 'assistant', text: 'I am analyzing your organization data. I have detected potential delays in the Gateway Business Tower project and suggest reallocating 12 resources to mitigate the risk.' }]);
    }, 1000);
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 120px)', backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
      <div style={{ padding: '1.5rem', borderBottom: '1px solid #e2e8f0', backgroundColor: 'rgba(255, 255, 255, 0.05)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{ width: '40px', height: '40px', borderRadius: '0.5rem', backgroundColor: '#e0e7ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4f46e5' }}>
          <Bot size={24} />
        </div>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', margin: 0, color: '#ffffff' }}>AI Executive Copilot</h2>
          <p style={{ color: '#64748b', margin: 0, fontSize: '0.875rem' }}>Strategic Business Insights & Forecasting</p>
        </div>
      </div>
      
      <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid #e2e8f0', display: 'flex', gap: '0.5rem', overflowX: 'auto' }}>
        {['Summarize portfolio health', 'Forecast cash flow', 'Recommend resource allocation', 'Generate executive report'].map(chip => (
          <button key={chip} onClick={() => setInp(chip)} style={{ padding: '0.5rem 1rem', borderRadius: '9999px', border: '1px solid #e2e8f0', backgroundColor: 'white', color: '#cbd5e1', fontSize: '0.75rem', cursor: 'pointer', whiteSpace: 'nowrap' }}>
            {chip}
          </button>
        ))}
      </div>
      
      <div style={{ flex: 1, padding: '1.5rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.5rem', backgroundColor: 'rgba(255, 255, 255, 0.05)' }}>
        {msgs.map((m, i) => (
          <div key={i} style={{ display: 'flex', gap: '1rem', alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start', maxWidth: '80%' }}>
            {m.role === 'assistant' && (
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#4f46e5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', flexShrink: 0 }}>
                <Bot size={16} />
              </div>
            )}
            <div style={{ padding: '1rem', backgroundColor: m.role === 'user' ? '#4f46e5' : 'white', color: m.role === 'user' ? 'white' : '#ffffff', borderRadius: '1rem', borderTopLeftRadius: m.role === 'assistant' ? 0 : '1rem', borderTopRightRadius: m.role === 'user' ? 0 : '1rem', boxShadow: '0 1px 2px rgba(0,0,0,0.05)', border: m.role === 'user' ? 'none' : '1px solid #e2e8f0', fontSize: '0.875rem', lineHeight: '1.5' }}>
              {m.text}
            </div>
          </div>
        ))}
      </div>

      <div style={{ padding: '1.5rem', backgroundColor: 'white', borderTop: '1px solid #e2e8f0' }}>
        <div style={{ display: 'flex', gap: '1rem', position: 'relative' }}>
          <input 
            type="text" 
            placeholder="Ask your executive copilot..." 
            value={inp}
            onChange={e => setInp(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            style={{ flex: 1, padding: '1rem 1.5rem', backgroundColor: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: '9999px', fontSize: '0.875rem', outline: 'none' }}
          />
          <button 
            onClick={handleSend}
            style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#4f46e5', color: 'white', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.2s' }}
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
