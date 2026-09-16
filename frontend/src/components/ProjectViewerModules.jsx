import React, { useState } from 'react';
import { PremiumPlaceholder } from './SharedUI';
import {Bot, Download, Send, Plus} from 'lucide-react';
import { GoogleDocsReportGenerator } from './GoogleDocsReportGenerator';
import { TaskManager } from './TaskManager';
import { IssueTracker } from './IssueTracker';
import { DailyLogForm } from './DailyLogForm';
import { DocumentCenter } from './DocumentCenter';
import { NotificationsPanel } from './NotificationsPanel';
import { ProjectKPIDashboard } from './ProjectKPIDashboard';

export function ViewerModuleHeader({ title, description, actionText = "Action" }) {
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

export function ViewerTabs({ tabs, activeTab, onChange }) {
  return (
    <div style={{ display: 'flex', gap: '1.5rem', borderBottom: '1px solid #1f1b3b', marginBottom: '1rem', overflowX: 'auto', paddingBottom: '1px' }}>
      {tabs.map(t => (
        <button 
          key={t}
          onClick={() => onChange(t)}
          style={{ 
            padding: '0.5rem 0', 
            background: 'none', border: 'none', 
            borderBottom: activeTab === t ? '2px solid #6366f1' : '2px solid transparent',
            color: activeTab === t ? '#ffffff' : '#94a3b8',
            fontWeight: activeTab === t ? 600 : 500,
            fontSize: '0.75rem', cursor: 'pointer', whiteSpace: 'nowrap'
          }}
        >
          {t}
        </button>
      ))}
    </div>
  )
}

function ViewerSubModulePlaceholder({ title }) {
  return <PremiumPlaceholder title={title} />;
}

export function ViewerCopilotInterface() {
  const [msgs, setMsgs] = useState([
    { role: 'assistant', text: 'Executive briefing initialized. Skyline Towers is currently at 68.45% completion, maintaining a positive schedule performance index of 0.92. What portfolio insights would you like to explore?' }
  ]);
  const [inp, setInp] = useState('');

  const handleSend = () => {
    if(!inp.trim()) return;
    setMsgs([...msgs, { role: 'user', text: inp }]);
    setInp('');
    setTimeout(() => {
      setMsgs(prev => [...prev, { role: 'assistant', text: 'According to the latest financial snapshot, the remaining budget of ₹ 19.53 Cr is sufficient to cover forecasted costs, assuming material price escalation remains below 2%.' }]);
    }, 1000);
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 250px)', backgroundColor: '#13112a', borderRadius: '0.5rem', border: '1px solid #1f1b3b', overflow: 'hidden' }}>
      <div style={{ padding: '1rem', borderBottom: '1px solid #1f1b3b', backgroundColor: '#0d0c22', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{ width: '36px', height: '36px', borderRadius: '0.4rem', backgroundColor: 'rgba(99, 102, 241, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#818cf8' }}>
          <Bot size={20} />
        </div>
        <div>
          <h2 style={{ fontSize: '1rem', fontWeight: 'bold', margin: 0, color: '#ffffff' }}>AI Project Assistant</h2>
          <p style={{ color: '#94a3b8', margin: 0, fontSize: '0.7rem' }}>Read-only executive analytics and summarization</p>
        </div>
      </div>
      
      <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid #1f1b3b', display: 'flex', gap: '0.5rem', overflowX: 'auto', backgroundColor: '#09091b' }}>
        {['Executive summary', 'Explain budget variance', 'Predict project delay', 'Summarize meeting minutes', 'Asset health report'].map(chip => (
          <button key={chip} onClick={() => setInp(chip)} style={{ padding: '0.4rem 0.75rem', borderRadius: '9999px', border: '1px solid #1f1b3b', backgroundColor: '#13112a', color: '#cbd5e1', fontSize: '0.65rem', cursor: 'pointer', whiteSpace: 'nowrap' }}>
            {chip}
          </button>
        ))}
      </div>
      
      <div style={{ flex: 1, padding: '1rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem', backgroundColor: '#09091b' }}>
        {msgs.map((m, i) => (
          <div key={i} style={{ display: 'flex', gap: '0.75rem', alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start', maxWidth: '80%' }}>
            {m.role === 'assistant' && (
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', flexShrink: 0 }}>
                <Bot size={14} />
              </div>
            )}
            <div style={{ padding: '0.75rem', backgroundColor: m.role === 'user' ? '#6366f1' : '#13112a', color: '#ffffff', borderRadius: '0.5rem', borderTopLeftRadius: m.role === 'assistant' ? 0 : '0.5rem', borderTopRightRadius: m.role === 'user' ? 0 : '0.5rem', border: m.role === 'user' ? 'none' : '1px solid #1f1b3b', fontSize: '0.75rem', lineHeight: '1.4' }}>
              {m.text}
            </div>
          </div>
        ))}
      </div>

      <div style={{ padding: '1rem', backgroundColor: '#0d0c22', borderTop: '1px solid #1f1b3b' }}>
        <div style={{ display: 'flex', gap: '0.75rem', position: 'relative' }}>
          <input 
            type="text" 
            placeholder="Ask a question about the project..." 
            value={inp}
            onChange={e => setInp(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            style={{ flex: 1, padding: '0.75rem 1rem', backgroundColor: '#13112a', border: '1px solid #1f1b3b', color: '#ffffff', borderRadius: '9999px', fontSize: '0.75rem', outline: 'none' }}
          />
          <button 
            onClick={handleSend}
            style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#6366f1', color: 'white', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.2s' }}
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

// Rapid stubs for Project Viewer modules
export function ViewerProjectsModule() {
  const [activeTab, setActiveTab] = useState("Assigned Projects");
  return (
    <div>
      <ViewerModuleHeader title="My Projects" description="Read-only portfolio access" />
      <ViewerTabs tabs={['Assigned Projects', 'Favorites', 'Recently Viewed', 'Archived Projects']} activeTab={activeTab} onChange={setActiveTab} />
      <ViewerSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function ViewerBimModule() {
  const [activeTab, setActiveTab] = useState("Interactive 3D Building");
  return (
    <div>
      <ViewerModuleHeader title="3D / BIM Viewer" description="Explore the federated model" />
      <ViewerTabs tabs={['Interactive 3D Building', 'Model Layers', 'Object Information', 'Clash Summary']} activeTab={activeTab} onChange={setActiveTab} />
      <ViewerSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function ViewerTwinModule() {
  const [activeTab, setActiveTab] = useState("Live Building");
  return (
    <div>
      <ViewerModuleHeader title="Digital Twin" description="Live building operations" />
      <ViewerTabs tabs={['Live Building', 'Sensor Data', 'Energy Dashboard', 'Water Dashboard']} activeTab={activeTab} onChange={setActiveTab} />
      <ViewerSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function ViewerDroneModule() {
  const [activeTab, setActiveTab] = useState("Weekly Drone Images");
  return (
    <div>
      <ViewerModuleHeader title="Drone & GIS" description="Visual site updates" />
      <ViewerTabs tabs={['Weekly Drone Images', 'Time-Lapse', 'Orthomosaic Maps', 'GIS Map Viewer']} activeTab={activeTab} onChange={setActiveTab} />
      <ViewerSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function ViewerTimelineModule() {
  const [activeTab, setActiveTab] = useState("Read-Only Gantt Chart");
  return (
    <div>
      <ViewerModuleHeader title="Project Timeline" description="Schedule oversight" />
      <ViewerTabs tabs={['Read-Only Gantt Chart', 'Milestones', 'Critical Path', 'Planned vs Actual']} activeTab={activeTab} onChange={setActiveTab} />
      <ViewerSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function ViewerProgressModule() {
  const [activeTab, setActiveTab] = useState("Weekly Progress");
  return (
    <div>
      <ViewerModuleHeader title="Progress Dashboard" description="Construction tracking" />
      <ViewerTabs tabs={['Daily Progress', 'Weekly Progress', 'Work Package Status', 'AI Forecast']} activeTab={activeTab} onChange={setActiveTab} />
      <ViewerSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function ViewerFinanceModule() {
  const [activeTab, setActiveTab] = useState("Budget Summary");
  return (
    <div>
      <ViewerModuleHeader title="Financial Snapshot" description="Budget and cost tracking" />
      <ViewerTabs tabs={['Budget Summary', 'Cost Performance', 'Budget Variance', 'Cost Trend']} activeTab={activeTab} onChange={setActiveTab} />
      <ViewerSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function ViewerQualityModule() {
  const [activeTab, setActiveTab] = useState("QA Status");
  return (
    <div>
      <ViewerModuleHeader title="Quality Dashboard" description="QA/QC metrics" />
      <ViewerTabs tabs={['QA Status', 'Inspection Results', 'Defect Count']} activeTab={activeTab} onChange={setActiveTab} />
      <ViewerSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function ViewerSafetyModule() {
  const [activeTab, setActiveTab] = useState("Safety KPIs");
  return (
    <div>
      <ViewerModuleHeader title="Safety Dashboard" description="HSE oversight" />
      <ViewerTabs tabs={['Safety KPIs', 'Incidents', 'PPE Compliance']} activeTab={activeTab} onChange={setActiveTab} />
      <ViewerSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function ViewerEsgModule() {
  const [activeTab, setActiveTab] = useState("ESG Rating");
  return (
    <div>
      <ViewerModuleHeader title="ESG & Sustainability" description="Green building metrics" />
      <ViewerTabs tabs={['ESG Rating', 'Carbon Dashboard', 'Energy Usage', 'Waste Management']} activeTab={activeTab} onChange={setActiveTab} />
      <ViewerSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function ViewerDocsModule() {
  const [activeTab, setActiveTab] = useState("Drawings");
  return (
    <div>
      <ViewerModuleHeader title="Documentation Center" description="Read-only document access" />
      <ViewerTabs tabs={['Drawings', 'Contracts', 'Specifications', 'Certificates']} activeTab={activeTab} onChange={setActiveTab} />
      <ViewerSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function ViewerReportsModule() { return <GoogleDocsReportGenerator portalRole="Executive Stakeholder Viewer" defaultProject="Skyline Towers - Phase 1" />; }
export function ViewerIssuesModule() {
  const [activeTab, setActiveTab] = useState("Risk Dashboard");
  return (
    <div>
      <ViewerModuleHeader title="Issue & Risk Dashboard" description="Project constraints" />
      <ViewerTabs tabs={['Risk Dashboard', 'Open RFIs', 'NCRs', 'Snags']} activeTab={activeTab} onChange={setActiveTab} />
      <ViewerSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function ViewerMeetingsModule() {
  const [activeTab, setActiveTab] = useState("MOM");
  return (
    <div>
      <ViewerModuleHeader title="Meeting Minutes" description="Stakeholder alignment" />
      <ViewerTabs tabs={['MOM', 'Decisions', 'Attendance']} activeTab={activeTab} onChange={setActiveTab} />
      <ViewerSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function ViewerSearchModule() {
  const [activeTab, setActiveTab] = useState("Search Projects");
  return (
    <div>
      <ViewerModuleHeader title="Search Center" description="Global project search" />
      <ViewerTabs tabs={['Search Projects', 'Search Documents', 'Search Assets']} activeTab={activeTab} onChange={setActiveTab} />
      <ViewerSubModulePlaceholder title={activeTab} />
    </div>
  );
}

export function ViewerAiCenterModule() {
  const [t, setT] = useState('AI Project Assistant');
  return (
    <div>
      <ViewerModuleHeader title="AI & ML Center" description="Executive Intelligence" />
      <ViewerTabs tabs={['AI Project Assistant', 'Executive AI', 'Financial AI', 'ESG AI', 'Predictive Models']} activeTab={t} onChange={setT} />
      {t === 'AI Project Assistant' ? <ViewerCopilotInterface /> : <ViewerSubModulePlaceholder title={t} />}
    </div>
  );
}
