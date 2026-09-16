import React, { useState } from 'react';
import {
  Activity, AlertTriangle, Bot, Box, CheckCircle2, ChevronDown, Clock, Compass, Cpu, Database, Filter, Layers, Leaf, Map, MoreVertical, Plus, RefreshCcw, Search, Send, Server, Shield, Wifi, Zap
} from 'lucide-react';
import { PremiumPlaceholder } from './SharedUI';

export function ModuleHeader({ title, description, actionText = "Create New" }) {
  return (
    <div className="module-header-container" style={{ marginBottom: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: '0 0 0.25rem 0', color: '#ffffff' }}>{title}</h2>
          <p style={{ color: '#94a3b8', margin: 0, fontSize: '0.875rem' }}>{description}</p>
        </div>
        <button style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'linear-gradient(135deg, #ec4899 0%, #d946ef 100%)', color: 'white', padding: '0.5rem 1.1rem', borderRadius: '4px', border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: '0.85rem', boxShadow: '0 0 15px rgba(236, 72, 153, 0.4)' }}>
          <Plus size={16} /> {actionText}
        </button>
      </div>
      <div style={{ display: 'flex', gap: '1rem' }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <Search size={16} color="#ec4899" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
          <input type="text" placeholder={`Search ${title.toLowerCase()}...`} style={{ width: '100%', padding: '0.625rem 1rem 0.625rem 2.5rem', backgroundColor: 'rgba(9, 8, 26, 0.8)', border: '1px solid rgba(236, 72, 153, 0.3)', borderRadius: '4px', color: '#ffffff', fontSize: '0.875rem', outline: 'none' }} />
        </div>
        <button style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.625rem 1rem', backgroundColor: 'rgba(9, 8, 26, 0.8)', border: '1px solid rgba(6, 182, 212, 0.3)', borderRadius: '4px', cursor: 'pointer', color: '#22d3ee', fontSize: '0.875rem', fontWeight: 600 }}>
          <Filter size={16} /> Filter
        </button>
      </div>
    </div>
  );
}

export function Tabs({ tabs, activeTab, onChange }) {
  return (
    <div style={{ display: 'flex', gap: '2rem', borderBottom: '1px solid rgba(236, 72, 153, 0.2)', marginBottom: '1.5rem', overflowX: 'auto' }}>
      {tabs.map(t => (
        <button 
          key={t}
          onClick={() => onChange(t)}
          style={{ 
            padding: '0.75rem 0', 
            background: 'none', border: 'none', 
            borderBottom: activeTab === t ? '2px solid #ec4899' : '2px solid transparent',
            color: activeTab === t ? '#ffffff' : '#94a3b8',
            fontWeight: activeTab === t ? 700 : 500,
            fontSize: '0.875rem', cursor: 'pointer', whiteSpace: 'nowrap'
          }}
        >
          {t}
        </button>
      ))}
    </div>
  )
}

export function DataTable({ columns, data }) {
  return (
    <div style={{ backgroundColor: 'rgba(9, 8, 26, 0.88)', borderRadius: '6px', border: '1px solid rgba(236, 72, 153, 0.25)', overflow: 'hidden' }}>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead style={{ backgroundColor: 'rgba(14, 12, 38, 0.95)', borderBottom: '1px solid rgba(6, 182, 212, 0.25)' }}>
            <tr>
              {columns.map((c, i) => (
                <th key={i} style={{ padding: '0.75rem 1rem', color: '#22d3ee', fontSize: '0.72rem', fontWeight: 800, letterSpacing: '0.06em', textTransform: 'uppercase' }}>{c.header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, i) => (
              <tr key={i} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
                {columns.map((col, j) => (
                  <td key={j} style={{ padding: '0.75rem 1rem', color: '#e2e8f0', fontSize: '0.85rem' }}>
                    {col.render ? col.render(row[col.accessor], row) : row[col.accessor]}
                  </td>
                ))}
                <td style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>
                  <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ec4899' }}><MoreVertical size={16} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function Badge({ children, type = 'neutral' }) {
  const colors = {
    success: { bg: '#d1fae5', text: '#065f46' },
    warning: { bg: '#fef3c7', text: '#92400e' },
    danger: { bg: '#fee2e2', text: '#991b1b' },
    info: { bg: '#dbeafe', text: '#1e40af' },
    neutral: { bg: '#f3f4f6', text: '#374151' },
    purple: { bg: '#ede9fe', text: '#5b21b6' }
  };
  const c = colors[type] || colors.neutral;
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', padding: '0.125rem 0.625rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 500, backgroundColor: c.bg, color: c.text }}>
      {children}
    </span>
  );
}

function SubModulePlaceholder({ title }) {
  return <PremiumPlaceholder title={title} />;
}

// -----------------------------------------------------------------------------
// MODULE VIEWS
// -----------------------------------------------------------------------------

export function OrganizationsModule() {
  const [tab, setTab] = useState('Overview');
  const tabs = ['Overview', 'Organization Analytics', 'Multi-Tenant Config', 'License Assignment', 'Branding', 'Company Verification', 'Usage Statistics'];
  
  const cols = [
    { header: 'Organization', accessor: 'name', render: (val, row) => <div><strong style={{display: 'block'}}>{val}</strong><span style={{color: '#6b7280', fontSize: '0.75rem'}}>{row.type}</span></div> },
    { header: 'Projects', accessor: 'projects' },
    { header: 'Users', accessor: 'users' },
    { header: 'Storage Used', accessor: 'storage' },
    { header: 'Status', accessor: 'status', render: (val) => <Badge type={val === 'Active' ? 'success' : 'warning'}>{val}</Badge> }
  ];
  const data = [
    { name: 'SkyBuild Constructions', type: 'Contractor', projects: 128, users: 450, storage: '2.45 TB', status: 'Active' },
    { name: 'UrbanInfra Developers', type: 'Developer', projects: 96, users: 320, storage: '1.89 TB', status: 'Active' },
    { name: 'Prime Estates Ltd.', type: 'Real Estate', projects: 74, users: 210, storage: '1.32 TB', status: 'Active' }
  ];

  return (
    <div>
      <ModuleHeader title="Organization Management" description="Create, delete, suspend, and merge organizations." actionText="Create Organization" />
      <Tabs tabs={tabs} activeTab={tab} onChange={setTab} />
      {tab === 'Overview' ? <DataTable columns={cols} data={data} /> : <SubModulePlaceholder title={tab} />}
    </div>
  );
}

export function UsersModule() {
  const [tab, setTab] = useState('User CRUD');
  const tabs = ['User CRUD', 'Face Verification', 'Identity Verification', 'Session Management', 'Device Tracking', 'Skill Management', 'Password Policies'];

  const cols = [
    { header: 'User', accessor: 'name', render: (val, row) => <div><strong style={{display: 'block'}}>{val}</strong><span style={{color: '#6b7280', fontSize: '0.75rem'}}>{row.email}</span></div> },
    { header: 'Department', accessor: 'dept' },
    { header: 'Face Verified', accessor: 'verified', render: (val) => <Badge type={val ? 'success' : 'warning'}>{val ? 'Verified' : 'Pending'}</Badge> },
    { header: 'Last Active', accessor: 'lastActive' },
    { header: 'Status', accessor: 'status', render: (val) => <Badge type={val === 'Online' ? 'success' : 'neutral'}>{val}</Badge> }
  ];
  const data = [
    { name: 'Rahul Sharma', email: 'rahul@skybuild.com', dept: 'Engineering', verified: true, lastActive: '2 mins ago', status: 'Online' },
    { name: 'Priya Patel', email: 'priya@urbaninfra.in', dept: 'Management', verified: false, lastActive: '1 hr ago', status: 'Offline' }
  ];

  return (
    <div>
      <ModuleHeader title="User Management" description="Manage all platform users, face verification, and bulk actions." actionText="Bulk Import" />
      <Tabs tabs={tabs} activeTab={tab} onChange={setTab} />
      {tab === 'User CRUD' ? <DataTable columns={cols} data={data} /> : <SubModulePlaceholder title={tab} />}
    </div>
  );
}

export function RolesModule() {
  const [tab, setTab] = useState('Permission Matrix');
  const tabs = ['Permission Matrix', 'Dynamic Role Builder', 'API Permissions', 'AI Permissions', 'Field-Level Security', 'Approval Workflow'];

  return (
    <div>
      <ModuleHeader title="Roles & Permissions" description="Configure complex RBAC matrices, project permissions, and temporary access." actionText="Create Role" />
      <Tabs tabs={tabs} activeTab={tab} onChange={setTab} />
      <SubModulePlaceholder title={tab} />
    </div>
  );
}

export function SubscriptionsModule() {
  const [tab, setTab] = useState('Subscription Plans');
  const tabs = ['Subscription Plans', 'Billing & Invoices', 'Coupons & Promotions', 'Enterprise Licensing', 'Payment Gateway Config'];

  return (
    <div>
      <ModuleHeader title="Subscription Management" description="Manage plans, recurring billing, and enterprise auto-renewals." actionText="Add Plan" />
      <Tabs tabs={tabs} activeTab={tab} onChange={setTab} />
      <SubModulePlaceholder title={tab} />
    </div>
  );
}

export function FinanceModule() {
  const [tab, setTab] = useState('Revenue Dashboard');
  const tabs = ['Revenue Dashboard', 'Profit Analytics', 'Payment Tracking', 'Outstanding Payments', 'Taxes & GST Reports', 'Marketplace Revenue'];

  return (
    <div>
      <ModuleHeader title="Financial Management" description="Track platform-wide revenue, profit analytics, and GST reports." actionText="Generate Report" />
      <Tabs tabs={tabs} activeTab={tab} onChange={setTab} />
      <SubModulePlaceholder title={tab} />
    </div>
  );
}

export function MonitoringModule() {
  const [tab, setTab] = useState('Live Hardware Metrics');
  const tabs = ['Live Hardware Metrics', 'Database Health', 'AI Servers', 'WebSocket Traffic', 'CDN & Network', 'Queue Status'];

  return (
    <div>
      <ModuleHeader title="Platform Monitoring" description="Real-time live monitoring of CPU, RAM, GPU, Redis, and overall infrastructure." actionText="Export Logs" />
      <Tabs tabs={tabs} activeTab={tab} onChange={setTab} />
      <SubModulePlaceholder title={tab} />
    </div>
  );
}

import DatasetStudio from './DatasetStudio';

export function AIMLModule() {
  const [tab, setTab] = useState('Enterprise Datasets');
  const tabs = ['Enterprise Datasets', 'AI Assistant Models', 'Design & Planning', 'Structural Analysis', 'BIM & MEP Intelligence', 'Digital Twin Analytics', 'Cost & Procurement', 'Safety & Compliance'];

  return (
    <div>
      <ModuleHeader title="AI & ML Control Center" description="Manage specialized AI engines, dataset intake, training pipelines, and risk forecasting." actionText="Deploy Pipeline" />
      <Tabs tabs={tabs} activeTab={tab} onChange={setTab} />
      {tab === 'Enterprise Datasets' ? (
        <DatasetStudio defaultDiscipline="All" />
      ) : (
        <SubModulePlaceholder title={tab} />
      )}
    </div>
  );
}

export function MachineLearningModule() {
  const [tab, setTab] = useState('Dataset Hub');
  const tabs = ['Dataset Hub', 'Predictive Models', 'Classification', 'Regression', 'Computer Vision (YOLO/SAM)', 'OCR & Document', 'NLP Chatbots', 'Anomaly Detection'];

  return (
    <div>
      <ModuleHeader title="Machine Learning Models" description="Core ML architectures, foundation models, dataset registry, and computer vision trackers." actionText="Train Model" />
      <Tabs tabs={tabs} activeTab={tab} onChange={setTab} />
      {tab === 'Dataset Hub' ? (
        <DatasetStudio defaultDiscipline="All" />
      ) : (
        <SubModulePlaceholder title={tab} />
      )}
    </div>
  );
}

export function DatabaseModule() {
  const [tab, setTab] = useState('Enterprise Datasets');
  const tabs = ['Enterprise Datasets', 'Cluster Health', 'MongoDB Atlas', 'PostgreSQL / PostGIS', 'Elasticsearch / Qdrant', 'Redis & InfluxDB', 'Backups & Restore'];

  return (
    <div>
      <ModuleHeader title="Database Center" description="Manage relational, NoSQL, vector databases, and multi-domain construction datasets." actionText="Trigger Backup" />
      <Tabs tabs={tabs} activeTab={tab} onChange={setTab} />
      {tab === 'Enterprise Datasets' ? (
        <DatasetStudio defaultDiscipline="All" />
      ) : (
        <SubModulePlaceholder title={tab} />
      )}
    </div>
  );
}

import { ARVRBuildingViewer } from './ARVRBuildingViewer';

export function Engine3DModule() {
  const [tab, setTab] = useState('AR/VR Building View');
  const tabs = ['AR/VR Building View', 'WebGL Analytics', 'Three.js Status', 'Geometry Optimization', 'Texture Optimization', 'LOD Management', 'Rendering Pipeline'];

  return (
    <div>
      <ModuleHeader title="3D & AR/VR Engine Management" description="Monitor client-side WebGL/WebXR rendering, AR camera anchors, VR stereoscopic modes, and building asset optimization." actionText="Clear Cache" />
      <Tabs tabs={tabs} activeTab={tab} onChange={setTab} />
      {tab === 'AR/VR Building View' ? (
        <ARVRBuildingViewer portalRole="Super Admin Master Controller" projectName="BuildSphere Global Digital Twin" />
      ) : (
        <SubModulePlaceholder title={tab} />
      )}
    </div>
  );
}

export function ARVRBuildingModule() {
  return (
    <div>
      <ModuleHeader title="AR/VR Mode Building View Model" description="Immersive 3D BIM, AR Pass-Through Camera Overlay, and VR Stereoscopic Walkthrough." actionText="Launch WebXR" />
      <ARVRBuildingViewer portalRole="Super Admin Master Controller" projectName="BuildSphere Global Digital Twin" />
    </div>
  );
}

export function APIModule() {
  const [tab, setTab] = useState('API Gateway');
  const tabs = ['API Gateway', 'API Keys', 'Rate Limits', 'Webhooks', 'SDK Management', 'OAuth Clients', 'API Analytics'];

  return (
    <div>
      <ModuleHeader title="API Management" description="Configure external endpoints, integrations, and developer SDKs." actionText="Generate Key" />
      <Tabs tabs={tabs} activeTab={tab} onChange={setTab} />
      <SubModulePlaceholder title={tab} />
    </div>
  );
}

export function SecurityModule() {
  const [tab, setTab] = useState('Threat Detection');
  const tabs = ['Threat Detection', 'MFA & SSO Config', 'Zero Trust Access', 'Audit Logs', 'Intrusion Detection', 'Vulnerability Scanner', 'SIEM Integration'];

  return (
    <div>
      <ModuleHeader title="Security Center" description="Protect the platform with zero-trust protocols, face login tracking, and threat detection." actionText="Run Vulnerability Scan" />
      <Tabs tabs={tabs} activeTab={tab} onChange={setTab} />
      <SubModulePlaceholder title={tab} />
    </div>
  );
}

export function WorkflowModule() {
  const [tab, setTab] = useState('Visual Builder');
  const tabs = ['Visual Builder', 'Event Triggers', 'AI Automation Rules', 'Scheduled Jobs', 'Integration Flows', 'Background Processing'];

  return (
    <div>
      <ModuleHeader title="Workflow Automation" description="Design complex automation flows with AI rules, email triggers, and scheduled jobs." actionText="Create Workflow" />
      <Tabs tabs={tabs} activeTab={tab} onChange={setTab} />
      <SubModulePlaceholder title={tab} />
    </div>
  );
}

// -----------------------------------------------------------------------------
// COPILOT CHAT INTERFACE
// -----------------------------------------------------------------------------
export function CopilotInterface() {
  const [msgs, setMsgs] = useState([
    { role: 'assistant', text: 'Hello, Super Admin! I am the BuildSphere AI Copilot. I can forecast growth, suggest security improvements, explain system alerts, or manage organizations through natural language. What can I do for you today?' }
  ]);
  const [inp, setInp] = useState('');

  const handleSend = () => {
    if(!inp.trim()) return;
    setMsgs([...msgs, { role: 'user', text: inp }]);
    setInp('');
    setTimeout(() => {
      setMsgs(prev => [...prev, { role: 'assistant', text: 'I am processing your command. I have access to platform-wide analytics and can manage subscriptions, forecast resource usage, or alter permissions automatically based on your request.' }]);
    }, 1000);
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 120px)', backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
      <div style={{ padding: '1.5rem', borderBottom: '1px solid #e5e7eb', backgroundColor: '#f9fafb', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{ width: '40px', height: '40px', borderRadius: '0.5rem', backgroundColor: '#e0e7ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6366f1' }}>
          <Bot size={24} />
        </div>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', margin: 0 }}>Super Admin AI Copilot</h2>
          <p style={{ color: '#6b7280', margin: 0, fontSize: '0.875rem' }}>Full Access • Natural Language Platform Manager</p>
        </div>
      </div>
      
      <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid #e5e7eb', display: 'flex', gap: '0.5rem', overflowX: 'auto' }}>
        {['Monitor platform health', 'Forecast resource usage', 'Explain system alerts', 'Suggest security improvements', 'Generate executive report'].map(chip => (
          <button key={chip} onClick={() => setInp(chip)} style={{ padding: '0.5rem 1rem', borderRadius: '9999px', border: '1px solid #e5e7eb', backgroundColor: 'white', color: '#4b5563', fontSize: '0.75rem', cursor: 'pointer', whiteSpace: 'nowrap' }}>
            {chip}
          </button>
        ))}
      </div>
      
      <div style={{ flex: 1, padding: '1.5rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.5rem', backgroundColor: '#f9fafb' }}>
        {msgs.map((m, i) => (
          <div key={i} style={{ display: 'flex', gap: '1rem', alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start', maxWidth: '80%' }}>
            {m.role === 'assistant' && (
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', flexShrink: 0 }}>
                <Bot size={16} />
              </div>
            )}
            <div style={{ padding: '1rem', backgroundColor: m.role === 'user' ? '#6366f1' : 'white', color: m.role === 'user' ? 'white' : 'rgba(0, 0, 0, 0.4)', borderRadius: '1rem', borderTopLeftRadius: m.role === 'assistant' ? 0 : '1rem', borderTopRightRadius: m.role === 'user' ? 0 : '1rem', boxShadow: '0 1px 2px rgba(0,0,0,0.05)', border: m.role === 'user' ? 'none' : '1px solid #e5e7eb', fontSize: '0.875rem', lineHeight: '1.5' }}>
              {m.text}
            </div>
          </div>
        ))}
      </div>

      <div style={{ padding: '1.5rem', backgroundColor: 'white', borderTop: '1px solid #e5e7eb' }}>
        <div style={{ display: 'flex', gap: '1rem', position: 'relative' }}>
          <input 
            type="text" 
            placeholder="Ask me to generate a usage report or check server health..." 
            value={inp}
            onChange={e => setInp(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            style={{ flex: 1, padding: '1rem 1.5rem', backgroundColor: '#f3f4f6', border: '1px solid #e5e7eb', borderRadius: '9999px', fontSize: '0.875rem', outline: 'none' }}
          />
          <button 
            onClick={handleSend}
            style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#6366f1', color: 'white', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.2s' }}
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
