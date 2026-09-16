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

export function ConsultantModuleHeader({ title, description, actionText = "Action" }) {
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

export function ConsultantTabs({ tabs, activeTab, onChange }) {
  return (
    <div style={{ display: 'flex', gap: '1.5rem', borderBottom: '1px solid #1e293b', marginBottom: '1rem', overflowX: 'auto', paddingBottom: '1px' }}>
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

function ConsultantSubModulePlaceholder({ title }) {
  return <PremiumPlaceholder title={title} />;
}

export function ConsultantCopilotInterface() {
  const [msgs, setMsgs] = useState([
    { role: 'assistant', text: 'Engineering review initialized. You have 34 shop drawings pending approval and 9 open NCRs. A critical design clash was detected in the MEP model for Basement Level 2. How should we proceed?' }
  ]);
  const [inp, setInp] = useState('');

  const handleSend = () => {
    if(!inp.trim()) return;
    setMsgs([...msgs, { role: 'user', text: inp }]);
    setInp('');
    setTimeout(() => {
      setMsgs(prev => [...prev, { role: 'assistant', text: 'I have logged the clash resolution requirement. I am generating a technical query (TQ) for the MEP contractor based on the IS codes.' }]);
    }, 1000);
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 250px)', backgroundColor: '#0a0f1e', borderRadius: '0.5rem', border: '1px solid #1e293b', overflow: 'hidden' }}>
      <div style={{ padding: '1rem', borderBottom: '1px solid #1e293b', backgroundColor: '#060b19', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{ width: '36px', height: '36px', borderRadius: '0.4rem', backgroundColor: 'rgba(99, 102, 241, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#818cf8' }}>
          <Bot size={20} />
        </div>
        <div>
          <h2 style={{ fontSize: '1rem', fontWeight: 'bold', margin: 0, color: '#ffffff' }}>AI Consultant Copilot</h2>
          <p style={{ color: '#94a3b8', margin: 0, fontSize: '0.7rem' }}>Technical intelligence and compliance assistant</p>
        </div>
      </div>
      
      <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid #1e293b', display: 'flex', gap: '0.5rem', overflowX: 'auto', backgroundColor: 'rgba(0, 0, 0, 0.6)' }}>
        {['Review BIM clash', 'Summarize NCRs', 'Check code compliance', 'Draft RFI response', 'Site observation report', 'Verify material'].map(chip => (
          <button key={chip} onClick={() => setInp(chip)} style={{ padding: '0.4rem 0.75rem', borderRadius: '9999px', border: '1px solid #1e293b', backgroundColor: '#0a0f1e', color: '#cbd5e1', fontSize: '0.65rem', cursor: 'pointer', whiteSpace: 'nowrap' }}>
            {chip}
          </button>
        ))}
      </div>
      
      <div style={{ flex: 1, padding: '1rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem', backgroundColor: '#0a0f1e' }}>
        {msgs.map((m, i) => (
          <div key={i} style={{ display: 'flex', gap: '0.75rem', alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start', maxWidth: '80%' }}>
            {m.role === 'assistant' && (
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#4f46e5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', flexShrink: 0 }}>
                <Bot size={14} />
              </div>
            )}
            <div style={{ padding: '0.75rem', backgroundColor: m.role === 'user' ? '#4f46e5' : '#060b19', color: '#ffffff', borderRadius: '0.5rem', borderTopLeftRadius: m.role === 'assistant' ? 0 : '0.5rem', borderTopRightRadius: m.role === 'user' ? 0 : '0.5rem', border: m.role === 'user' ? 'none' : '1px solid #1e293b', fontSize: '0.75rem', lineHeight: '1.4' }}>
              {m.text}
            </div>
          </div>
        ))}
      </div>

      <div style={{ padding: '1rem', backgroundColor: '#060b19', borderTop: '1px solid #1e293b' }}>
        <div style={{ display: 'flex', gap: '0.75rem', position: 'relative' }}>
          <input 
            type="text" 
            placeholder="Type your engineering query..." 
            value={inp}
            onChange={e => setInp(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            style={{ flex: 1, padding: '0.75rem 1rem', backgroundColor: '#0a0f1e', border: '1px solid #1e293b', color: '#ffffff', borderRadius: '9999px', fontSize: '0.75rem', outline: 'none' }}
          />
          <button 
            onClick={handleSend}
            style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#4f46e5', color: 'white', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.2s' }}
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

// Rapid stubs for Consultant modules
export function ConsultantProjectsModule() {
  const [activeTab, setActiveTab] = useState("Active Projects");
  return (
    <div>
      <ConsultantModuleHeader title="Assigned Projects" description="Active engagements" />
      <ConsultantTabs tabs={['Active Projects', 'Completed Projects', 'Multi-Project Dashboard', 'Project Health']} activeTab={activeTab} onChange={setActiveTab} />
      <ConsultantSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function ConsultantTechnicalReviewModule() {
  const [activeTab, setActiveTab] = useState("Shop Drawing Review");
  return (
    <div>
      <ConsultantModuleHeader title="Technical Review Center" description="Engineering governance" />
      <ConsultantTabs tabs={['Engineering Calculations', 'Design Compliance', 'Shop Drawing Review', 'Material Submittal']} activeTab={activeTab} onChange={setActiveTab} />
      <ConsultantSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function ConsultantDrawingReviewModule() {
  const [activeTab, setActiveTab] = useState("Structural");
  return (
    <div>
      <ConsultantModuleHeader title="Drawing Review Center" description="Discipline drawings" />
      <ConsultantTabs tabs={['Architectural', 'Structural', 'MEP', 'Revision Tracking']} activeTab={activeTab} onChange={setActiveTab} />
      <ConsultantSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function ConsultantBimReviewModule() {
  const [activeTab, setActiveTab] = useState("3D Viewer");
  return (
    <div>
      <ConsultantModuleHeader title="BIM & Digital Twin Review" description="Model validation" />
      <ConsultantTabs tabs={['3D Viewer', 'Clash Review Dashboard', 'Digital Twin Status']} activeTab={activeTab} onChange={setActiveTab} />
      <ConsultantSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function ConsultantRfiModule() {
  const [activeTab, setActiveTab] = useState("New RFIs");
  return (
    <div>
      <ConsultantModuleHeader title="RFI Management" description="Technical queries" />
      <ConsultantTabs tabs={['New RFIs', 'Technical Query Center', 'Response Tracker']} activeTab={activeTab} onChange={setActiveTab} />
      <ConsultantSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function ConsultantSiteInspectionModule() {
  const [activeTab, setActiveTab] = useState("Site Observation Register");
  return (
    <div>
      <ConsultantModuleHeader title="Site Inspection Center" description="Field observations" />
      <ConsultantTabs tabs={['Site Observation Register', 'Inspection Calendar', 'Daily Site Monitoring', 'Drone Inspection']} activeTab={activeTab} onChange={setActiveTab} />
      <ConsultantSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function ConsultantQaModule() {
  const [activeTab, setActiveTab] = useState("NCR Management");
  return (
    <div>
      <ConsultantModuleHeader title="QA / QC Dashboard" description="Quality assurance" />
      <ConsultantTabs tabs={['Inspection Results', 'Material Tests', 'NCR Management', 'Defect Management']} activeTab={activeTab} onChange={setActiveTab} />
      <ConsultantSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function ConsultantPunchModule() {
  const [activeTab, setActiveTab] = useState("Punch List Management");
  return (
    <div>
      <ConsultantModuleHeader title="Punch & Snag Management" description="Closing out defects" />
      <ConsultantTabs tabs={['Punch List Management', 'Snag Management', 'Open Items']} activeTab={activeTab} onChange={setActiveTab} />
      <ConsultantSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function ConsultantSafetyModule() {
  const [activeTab, setActiveTab] = useState("HSE Dashboard");
  return (
    <div>
      <ConsultantModuleHeader title="Safety Observation Center" description="HSE and risk" />
      <ConsultantTabs tabs={['Unsafe Conditions', 'HSE Dashboard', 'Risk Assessment Center']} activeTab={activeTab} onChange={setActiveTab} />
      <ConsultantSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function ConsultantScheduleModule() {
  const [activeTab, setActiveTab] = useState("Delay Analysis");
  return (
    <div>
      <ConsultantModuleHeader title="Schedule Validation" description="Time impact review" />
      <ConsultantTabs tabs={['Construction Progress Review', 'Delay Analysis', 'Earned Value']} activeTab={activeTab} onChange={setActiveTab} />
      <ConsultantSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function ConsultantCostModule() {
  const [activeTab, setActiveTab] = useState("Variation Review");
  return (
    <div>
      <ConsultantModuleHeader title="Cost & Variation Review" description="Financial validation" />
      <ConsultantTabs tabs={['Quantity Verification', 'Cost Review Dashboard', 'Variation Review', 'Contractor Performance']} activeTab={activeTab} onChange={setActiveTab} />
      <ConsultantSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function ConsultantComplianceModule() {
  const [activeTab, setActiveTab] = useState("Regulatory Review");
  return (
    <div>
      <ConsultantModuleHeader title="Compliance & ESG" description="Regulatory checks" />
      <ConsultantTabs tabs={['Regulatory Review', 'ESG Compliance', 'Carbon Monitoring']} activeTab={activeTab} onChange={setActiveTab} />
      <ConsultantSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function ConsultantReportsModule() { return <GoogleDocsReportGenerator portalRole="Engineering Consultant" defaultProject="Skyline Towers - Phase 1" />; }
export function ConsultantDocsModule() {
  const [activeTab, setActiveTab] = useState("Smart Document Center");
  return (
    <div>
      <ConsultantModuleHeader title="Document Center" description="Drawings and specs" />
      <ConsultantTabs tabs={['Smart Document Center', 'Specifications', 'Calculations']} activeTab={activeTab} onChange={setActiveTab} />
      <ConsultantSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function ConsultantMeetingsModule() {
  const [activeTab, setActiveTab] = useState("MOM Tracking");
  return (
    <div>
      <ConsultantModuleHeader title="Meeting Management" description="Coordination" />
      <ConsultantTabs tabs={['Coordination Meetings', 'MOM Tracking', 'Action Items']} activeTab={activeTab} onChange={setActiveTab} />
      <ConsultantSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function ConsultantCollabModule() {
  const [activeTab, setActiveTab] = useState("Approval Center");
  return (
    <div>
      <ConsultantModuleHeader title="Communication Hub" description="Team comms" />
      <ConsultantTabs tabs={['Approval Center', 'Notifications', 'Internal Comms']} activeTab={activeTab} onChange={setActiveTab} />
      <ConsultantSubModulePlaceholder title={activeTab} />
    </div>
  );
}

export function ConsultantAiCenterModule() {
  const [t, setT] = useState('AI Consultant Copilot');
  return (
    <div>
      <ConsultantModuleHeader title="AI & ML Center" description="Technical Intelligence" />
      <ConsultantTabs tabs={['AI Consultant Copilot', 'Engineering AI', 'BIM AI', 'Quality AI', 'Safety AI']} activeTab={t} onChange={setT} />
      {t === 'AI Consultant Copilot' ? <ConsultantCopilotInterface /> : <ConsultantSubModulePlaceholder title={t} />}
    </div>
  );
}
