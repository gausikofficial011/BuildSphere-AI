import React, { useState } from 'react';
import { PremiumPlaceholder } from './SharedUI';
import {
  Bot, Plus, Send
} from 'lucide-react';
import { GoogleDocsReportGenerator } from './GoogleDocsReportGenerator';
import { TaskManager } from './TaskManager';
import { IssueTracker } from './IssueTracker';
import { DailyLogForm } from './DailyLogForm';
import { DocumentCenter } from './DocumentCenter';
import { NotificationsPanel } from './NotificationsPanel';
import { ProjectKPIDashboard } from './ProjectKPIDashboard';
import { ARVRBuildingViewer } from './ARVRBuildingViewer';

export function ClientModuleHeader({ title, description, actionText = "Action" }) {
  return (
    <div className="page-header" style={{ marginBottom: '2rem' }}>
      <div className="page-title">
        <h1 style={{ fontSize: '2rem', margin: '0 0 0.25rem 0', color: '#ffffff' }}>{title}</h1>
        <p style={{ fontSize: '1rem', margin: 0, color: '#94a3b8' }}>{description}</p>
      </div>
      <div className="header-actions">
        <button className="export-btn">
          <Plus size={16} /> {actionText}
        </button>
      </div>
    </div>
  );
}

export function ClientTabs({ tabs, activeTab, onChange }) {
  return (
    <div style={{ display: 'flex', gap: '2rem', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', marginBottom: '1.5rem', overflowX: 'auto', paddingBottom: '1px' }}>
      {tabs.map(t => (
        <button 
          key={t}
          onClick={() => onChange(t)}
          style={{ 
            padding: '0.75rem 0', 
            background: 'none', border: 'none', 
            borderBottom: activeTab === t ? '2px solid #8b5cf6' : '2px solid transparent',
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

function ClientSubModulePlaceholder({ title }) {
  return <PremiumPlaceholder title={title} />;
}

export function ClientCopilotInterface() {
  const [msgs, setMsgs] = useState([
    { role: 'assistant', text: 'Good morning, Mr. Kumar. Overall project progress is at 68.45%. You have 12 open approvals requiring your attention, including a design change for the facade. How can I assist you with your portfolio today?' }
  ]);
  const [inp, setInp] = useState('');

  const handleSend = () => {
    if(!inp.trim()) return;
    setMsgs([...msgs, { role: 'user', text: inp }]);
    setInp('');
    setTimeout(() => {
      setMsgs(prev => [...prev, { role: 'assistant', text: 'I have analyzed the request. The projected completion date remains Dec 18, 2024. The recent material delays have been mitigated by the contractor accelerating the MEP rough-in schedule.' }]);
    }, 1000);
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 250px)', backgroundColor: 'rgba(255, 255, 255, 0.02)', borderRadius: '0.75rem', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
      <div style={{ padding: '1.5rem', borderBottom: '1px solid #e2e8f0', backgroundColor: 'rgba(255, 255, 255, 0.05)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{ width: '40px', height: '40px', borderRadius: '0.5rem', backgroundColor: 'rgba(139, 92, 246, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8b5cf6' }}>
          <Bot size={24} />
        </div>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', margin: 0, color: '#ffffff' }}>AI Executive Copilot</h2>
          <p style={{ color: '#64748b', margin: 0, fontSize: '0.875rem' }}>Your strategic decision-making assistant for portfolio oversight</p>
        </div>
      </div>
      
      <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid #e2e8f0', display: 'flex', gap: '0.5rem', overflowX: 'auto', backgroundColor: 'rgba(255, 255, 255, 0.02)' }}>
        {['Executive summary', 'Budget status', 'Project risks', 'Approve changes', 'Generate report', 'Asset readiness'].map(chip => (
          <button key={chip} onClick={() => setInp(chip)} style={{ padding: '0.5rem 1rem', borderRadius: '9999px', border: '1px solid #e2e8f0', backgroundColor: 'rgba(255, 255, 255, 0.05)', color: '#cbd5e1', fontSize: '0.75rem', cursor: 'pointer', whiteSpace: 'nowrap' }}>
            {chip}
          </button>
        ))}
      </div>
      
      <div style={{ flex: 1, padding: '1.5rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.5rem', backgroundColor: 'rgba(255, 255, 255, 0.05)' }}>
        {msgs.map((m, i) => (
          <div key={i} style={{ display: 'flex', gap: '1rem', alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start', maxWidth: '80%' }}>
            {m.role === 'assistant' && (
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#8b5cf6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', flexShrink: 0 }}>
                <Bot size={16} />
              </div>
            )}
            <div style={{ padding: '1rem', backgroundColor: m.role === 'user' ? '#8b5cf6' : 'rgba(255, 255, 255, 0.02)', color: m.role === 'user' ? 'white' : '#e2e8f0', borderRadius: '1rem', borderTopLeftRadius: m.role === 'assistant' ? 0 : '1rem', borderTopRightRadius: m.role === 'user' ? 0 : '1rem', border: m.role === 'user' ? 'none' : '1px solid #e2e8f0', fontSize: '0.875rem', lineHeight: '1.5', boxShadow: m.role === 'assistant' ? '0 1px 2px rgba(0,0,0,0.05)' : 'none' }}>
              {m.text}
            </div>
          </div>
        ))}
      </div>

      <div style={{ padding: '1.5rem', backgroundColor: 'rgba(255, 255, 255, 0.02)', borderTop: '1px solid #e2e8f0' }}>
        <div style={{ display: 'flex', gap: '1rem', position: 'relative' }}>
          <input 
            type="text" 
            placeholder="Type your question or instruction..." 
            value={inp}
            onChange={e => setInp(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            style={{ flex: 1, padding: '1rem 1.5rem', backgroundColor: 'rgba(255, 255, 255, 0.05)', border: '1px solid #cbd5e1', color: '#ffffff', borderRadius: '9999px', fontSize: '0.875rem', outline: 'none' }}
          />
          <button 
            onClick={handleSend}
            style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#8b5cf6', color: 'white', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.2s' }}
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}

// Rapid stubs for Client modules
export function ClientProjectsModule() {
  const [activeTab, setActiveTab] = useState("Active Projects");
  return (
    <div>
      <ClientModuleHeader title="My Projects" description="Active and upcoming developments" />
      <ClientTabs tabs={['Active Projects', 'Completed Projects', 'Upcoming Projects']} activeTab={activeTab} onChange={setActiveTab} />
      <ClientSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function ClientPortfolioModule() {
  const [activeTab, setActiveTab] = useState("Portfolio KPIs");
  return (
    <div>
      <ClientModuleHeader title="Project Portfolio" description="Portfolio-level metrics" />
      <ClientTabs tabs={['Portfolio KPIs', 'Portfolio Cost', 'Portfolio Risk', 'Portfolio Revenue']} activeTab={activeTab} onChange={setActiveTab} />
      <ClientSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function ClientBimModule() {
  const [activeTab, setActiveTab] = useState("AR/VR Building View");
  return (
    <div>
      <ClientModuleHeader title="3D / BIM & AR/VR Viewer" description="Live 3D, AR pass-through, and VR stereoscopic building model review" />
      <ClientTabs tabs={['AR/VR Building View', 'Interactive 3D Model', 'Live BIM', 'Asset Information']} activeTab={activeTab} onChange={setActiveTab} />
      {activeTab === 'AR/VR Building View' || activeTab === 'Interactive 3D Model' ? (
        <ARVRBuildingViewer portalRole="Client Executive & Investor" projectName="Skyline Towers - Phase 1" />
      ) : (
        <ClientSubModulePlaceholder title={activeTab} />
      )}
    </div>
  );
}
export function ClientTwinModule() {
  const [activeTab, setActiveTab] = useState("Live Building Status");
  return (
    <div>
      <ClientModuleHeader title="Digital Twin Viewer" description="Operational facility status" />
      <ClientTabs tabs={['Live Building Status', 'Sensor Dashboard', 'Equipment Health']} activeTab={activeTab} onChange={setActiveTab} />
      <ClientSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function ClientDroneModule() {
  const [activeTab, setActiveTab] = useState("Drone Progress Viewer");
  return (
    <div>
      <ClientModuleHeader title="Drone & Site Cameras" description="Visual progress updates" />
      <ClientTabs tabs={['Drone Progress Viewer', 'Live Site Cameras', 'Time-Lapse Comparison']} activeTab={activeTab} onChange={setActiveTab} />
      <ClientSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function ClientTimelineModule() {
  const [activeTab, setActiveTab] = useState("Construction Timeline");
  return (
    <div>
      <ClientModuleHeader title="Timeline & Milestones" description="Schedule tracking" />
      <ClientTabs tabs={['Construction Timeline', 'Milestones Dashboard', 'Progress Analytics']} activeTab={activeTab} onChange={setActiveTab} />
      <ClientSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function ClientFinanceModule() {
  const [activeTab, setActiveTab] = useState("Budget Overview");
  return (
    <div>
      <ClientModuleHeader title="Financial Dashboard" description="Budgets, costs, and invoices" />
      <ClientTabs tabs={['Budget Overview', 'Cost vs Budget', 'Payment Dashboard', 'Invoice Center']} activeTab={activeTab} onChange={setActiveTab} />
      <ClientSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function ClientApprovalModule() {
  const [activeTab, setActiveTab] = useState("Approval Center");
  return (
    <div>
      <ClientModuleHeader title="Contract & Approvals" description="Executive sign-offs" />
      <ClientTabs tabs={['Approval Center', 'Contract Dashboard', 'RFI Review Center']} activeTab={activeTab} onChange={setActiveTab} />
      <ClientSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function ClientQaModule() {
  const [activeTab, setActiveTab] = useState("Quality Dashboard");
  return (
    <div>
      <ClientModuleHeader title="Quality & Safety" description="Compliance and risks" />
      <ClientTabs tabs={['Quality Dashboard', 'Safety Dashboard', 'Risk Dashboard']} activeTab={activeTab} onChange={setActiveTab} />
      <ClientSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function ClientEsgModule() {
  const [activeTab, setActiveTab] = useState("ESG Dashboard");
  return (
    <div>
      <ClientModuleHeader title="ESG & Sustainability" description="Green building metrics" />
      <ClientTabs tabs={['ESG Dashboard', 'Sustainability Dashboard', 'Carbon Dashboard']} activeTab={activeTab} onChange={setActiveTab} />
      <ClientSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function ClientAssetModule() {
  const [activeTab, setActiveTab] = useState("Installed Assets");
  return (
    <div>
      <ClientModuleHeader title="Asset Management" description="Installed assets and systems" />
      <ClientTabs tabs={['Installed Assets', 'Smart Building Preview', 'Warranty Dashboard']} activeTab={activeTab} onChange={setActiveTab} />
      <ClientSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function ClientHandoverModule() {
  const [activeTab, setActiveTab] = useState("Facility Readiness");
  return (
    <div>
      <ClientModuleHeader title="Handover Center" description="Project turnover and readiness" />
      <ClientTabs tabs={['Facility Readiness', 'Defect Liability Management', 'Snag Dashboard', 'Punch List']} activeTab={activeTab} onChange={setActiveTab} />
      <ClientSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function ClientReportsModule() { return <GoogleDocsReportGenerator portalRole="Client Executive & Investor" defaultProject="Skyline Towers - Phase 1" />; }
export function ClientDocsModule() {
  const [activeTab, setActiveTab] = useState("Drawings");
  return (
    <div>
      <ClientModuleHeader title="Documents Center" description="Drawings and contracts" />
      <ClientTabs tabs={['Drawings', 'Contracts', 'Reports', 'Certificates']} activeTab={activeTab} onChange={setActiveTab} />
      <ClientSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function ClientMeetingsModule() {
  const [activeTab, setActiveTab] = useState("Meeting Calendar");
  return (
    <div>
      <ClientModuleHeader title="Meetings & Minutes" description="Stakeholder coordination" />
      <ClientTabs tabs={['Meeting Calendar', 'MOM', 'Action Items']} activeTab={activeTab} onChange={setActiveTab} />
      <ClientSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function ClientCollabModule() {
  const [activeTab, setActiveTab] = useState("Chat");
  return (
    <div>
      <ClientModuleHeader title="Communication Hub" description="Chat and updates" />
      <ClientTabs tabs={['Chat', 'Client Requests', 'Feedback']} activeTab={activeTab} onChange={setActiveTab} />
      <ClientSubModulePlaceholder title={activeTab} />
    </div>
  );
}

export function ClientAiCenterModule() {
  const [t, setT] = useState('AI Executive Copilot');
  return (
    <div>
      <ClientModuleHeader title="AI & ML Center" description="Executive Intelligence" />
      <ClientTabs tabs={['AI Executive Copilot', 'Financial AI', 'Construction AI', 'BIM AI', 'ESG AI']} activeTab={t} onChange={setT} />
      {t === 'AI Executive Copilot' ? <ClientCopilotInterface /> : <ClientSubModulePlaceholder title={t} />}
    </div>
  );
}
