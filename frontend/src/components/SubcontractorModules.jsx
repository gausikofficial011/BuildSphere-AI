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

export function SubcontractorModuleHeader({ title, description, actionText = "Action" }) {
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

export function SubcontractorTabs({ tabs, activeTab, onChange }) {
  return (
    <div style={{ display: 'flex', gap: '2rem', borderBottom: '1px solid #1f2937', marginBottom: '1.5rem', overflowX: 'auto', paddingBottom: '1px' }}>
      {tabs.map(t => (
        <button 
          key={t}
          onClick={() => onChange(t)}
          style={{ 
            padding: '0.75rem 0', 
            background: 'none', border: 'none', 
            borderBottom: activeTab === t ? '2px solid #6366f1' : '2px solid transparent',
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

function SubcontractorSubModulePlaceholder({ title }) {
  return <PremiumPlaceholder title={title} />;
}

export function SubcontractorCopilotInterface() {
  const [msgs, setMsgs] = useState([
    { role: 'assistant', text: 'Welcome back to the ABC Steel Works dashboard. You have 3 pending inspections for the Level 5 structural columns. The main contractor has approved RA Bill #12. How can I assist you with today\'s work packages?' }
  ]);
  const [inp, setInp] = useState('');

  const handleSend = () => {
    if(!inp.trim()) return;
    setMsgs([...msgs, { role: 'user', text: inp }]);
    setInp('');
    setTimeout(() => {
      setMsgs(prev => [...prev, { role: 'assistant', text: 'I have logged the request. I will generate a draft for RA Bill #13 covering the latest completed work package and notify the main contractor\'s Quantity Surveyor.' }]);
    }, 1000);
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 250px)', backgroundColor: 'rgba(0, 0, 0, 0.4)', borderRadius: '0.75rem', border: '1px solid #1f2937', overflow: 'hidden' }}>
      <div style={{ padding: '1.5rem', borderBottom: '1px solid #1f2937', backgroundColor: 'rgba(0, 0, 0, 0.2)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{ width: '40px', height: '40px', borderRadius: '0.5rem', backgroundColor: 'rgba(99, 102, 241, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#a5b4fc' }}>
          <Bot size={24} />
        </div>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', margin: 0, color: '#ffffff' }}>AI Subcontractor Copilot</h2>
          <p style={{ color: '#94a3b8', margin: 0, fontSize: '0.875rem' }}>Your intelligent assistant for site execution and billing</p>
        </div>
      </div>
      
      <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid #1f2937', display: 'flex', gap: '0.5rem', overflowX: 'auto', backgroundColor: 'rgba(0, 0, 0, 0.6)' }}>
        {['Daily progress summary', 'Material requirement', 'Raise RFI', 'Work package status', 'Payment status', 'Safety report'].map(chip => (
          <button key={chip} onClick={() => setInp(chip)} style={{ padding: '0.5rem 1rem', borderRadius: '9999px', border: '1px solid #1f2937', backgroundColor: 'rgba(0, 0, 0, 0.2)', color: '#cbd5e1', fontSize: '0.75rem', cursor: 'pointer', whiteSpace: 'nowrap' }}>
            {chip}
          </button>
        ))}
      </div>
      
      <div style={{ flex: 1, padding: '1.5rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.5rem', backgroundColor: 'rgba(0, 0, 0, 0.4)' }}>
        {msgs.map((m, i) => (
          <div key={i} style={{ display: 'flex', gap: '1rem', alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start', maxWidth: '80%' }}>
            {m.role === 'assistant' && (
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', flexShrink: 0 }}>
                <Bot size={16} />
              </div>
            )}
            <div style={{ padding: '1rem', backgroundColor: m.role === 'user' ? '#6366f1' : 'rgba(0, 0, 0, 0.2)', color: '#ffffff', borderRadius: '1rem', borderTopLeftRadius: m.role === 'assistant' ? 0 : '1rem', borderTopRightRadius: m.role === 'user' ? 0 : '1rem', border: m.role === 'user' ? 'none' : '1px solid #1f2937', fontSize: '0.875rem', lineHeight: '1.5' }}>
              {m.text}
            </div>
          </div>
        ))}
      </div>

      <div style={{ padding: '1.5rem', backgroundColor: 'rgba(0, 0, 0, 0.2)', borderTop: '1px solid #1f2937' }}>
        <div style={{ display: 'flex', gap: '1rem', position: 'relative' }}>
          <input 
            type="text" 
            placeholder="Type your question or instruction..." 
            value={inp}
            onChange={e => setInp(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            style={{ flex: 1, padding: '1rem 1.5rem', backgroundColor: 'rgba(0, 0, 0, 0.4)', border: '1px solid #1f2937', color: '#ffffff', borderRadius: '9999px', fontSize: '0.875rem', outline: 'none' }}
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

// Rapid stubs for Subcontractor modules
export function SubcontractorProjectsModule() {
  const [activeTab, setActiveTab] = useState("Assigned Projects");
  return (
    <div>
      <SubcontractorModuleHeader title="My Assigned Projects" description="Projects and milestones" />
      <SubcontractorTabs tabs={['Assigned Projects', 'Package Details', 'Project Timeline', 'Project Milestones']} activeTab={activeTab} onChange={setActiveTab} />
      <SubcontractorSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function SubcontractorWorkPackagesModule() {
  const [activeTab, setActiveTab] = useState("Structural Works");
  return (
    <div>
      <SubcontractorModuleHeader title="My Work Packages" description="Trade-specific execution" />
      <SubcontractorTabs tabs={['Structural Works', 'Masonry', 'MEP Installation', 'Interior Works']} activeTab={activeTab} onChange={setActiveTab} />
      <SubcontractorSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function SubcontractorDailyWorkModule() {
  const [activeTab, setActiveTab] = useState("Daily Target");
  return (
    <div>
      <SubcontractorModuleHeader title="Daily Work Dashboard" description="Daily targets and output" />
      <SubcontractorTabs tabs={['Daily Target', 'Completed Quantity', 'Daily Productivity', 'Site Photos']} activeTab={activeTab} onChange={setActiveTab} />
      <SubcontractorSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function SubcontractorWorkforceModule() {
  const [activeTab, setActiveTab] = useState("Labour Register");
  return (
    <div>
      <SubcontractorModuleHeader title="Workforce Management" description="Crews and shifts" />
      <SubcontractorTabs tabs={['Labour Register', 'Crew Formation', 'Shift Planning', 'Overtime Tracking']} activeTab={activeTab} onChange={setActiveTab} />
      <SubcontractorSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function SubcontractorAttendanceModule() {
  const [activeTab, setActiveTab] = useState("Face Recognition");
  return (
    <div>
      <SubcontractorModuleHeader title="Attendance Management" description="Time tracking" />
      <SubcontractorTabs tabs={['Face Recognition', 'QR Code', 'GPS Attendance', 'Labour Productivity']} activeTab={activeTab} onChange={setActiveTab} />
      <SubcontractorSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function SubcontractorTaskModule() {
  const [activeTab, setActiveTab] = useState("Assigned Tasks");
  return (
    <div>
      <SubcontractorModuleHeader title="Task Assignment" description="Priorities and status" />
      <SubcontractorTabs tabs={['Assigned Tasks', 'Priority', 'Progress Tracking', 'Look-Ahead Planning']} activeTab={activeTab} onChange={setActiveTab} />
      <SubcontractorSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function SubcontractorMaterialModule() {
  const [activeTab, setActiveTab] = useState("Material Requests");
  return (
    <div>
      <SubcontractorModuleHeader title="Material Management" description="Requisitions and ETA" />
      <SubcontractorTabs tabs={['Material Requests', 'Approval Status', 'Delivery Tracking', 'Material Consumption']} activeTab={activeTab} onChange={setActiveTab} />
      <SubcontractorSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function SubcontractorEquipmentModule() {
  const [activeTab, setActiveTab] = useState("Equipment Requests");
  return (
    <div>
      <SubcontractorModuleHeader title="Equipment & Tools" description="Requests and inventory" />
      <SubcontractorTabs tabs={['Equipment Requests', 'Tool Management', 'Tool Inventory', 'Work Order Management']} activeTab={activeTab} onChange={setActiveTab} />
      <SubcontractorSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function SubcontractorDocsModule() {
  const [activeTab, setActiveTab] = useState("Drawing Viewer");
  return (
    <div>
      <SubcontractorModuleHeader title="Documents & BIM" description="Drawings and 3D models" />
      <SubcontractorTabs tabs={['Drawing Viewer', 'BIM Model Viewer', '3D Construction Viewer', 'Digital Twin Viewer']} activeTab={activeTab} onChange={setActiveTab} />
      <SubcontractorSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function SubcontractorSiteDiaryModule() {
  const [activeTab, setActiveTab] = useState("Work Summary");
  return (
    <div>
      <SubcontractorModuleHeader title="Daily Site Diary" description="Logs and photos" />
      <SubcontractorTabs tabs={['Work Summary', 'Photo Documentation', 'Drone Progress Viewer']} activeTab={activeTab} onChange={setActiveTab} />
      <SubcontractorSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function SubcontractorQaModule() {
  const [activeTab, setActiveTab] = useState("Inspection Requests");
  return (
    <div>
      <SubcontractorModuleHeader title="Quality & Inspections" description="QA/QC and checklists" />
      <SubcontractorTabs tabs={['Inspection Requests', 'QA/QC Center', 'Punch List', 'Snag Management']} activeTab={activeTab} onChange={setActiveTab} />
      <SubcontractorSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function SubcontractorRfiNcrModule() {
  const [activeTab, setActiveTab] = useState("RFI Management");
  return (
    <div>
      <SubcontractorModuleHeader title="RFI & NCR Management" description="Clarifications and non-conformance" />
      <SubcontractorTabs tabs={['NCR Management', 'RFI Management', 'Permit-to-Work']} activeTab={activeTab} onChange={setActiveTab} />
      <SubcontractorSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function SubcontractorSafetyModule() {
  const [activeTab, setActiveTab] = useState("PPE Compliance");
  return (
    <div>
      <SubcontractorModuleHeader title="Safety Management" description="Compliance and audits" />
      <SubcontractorTabs tabs={['Safety Audits', 'Incident Reports', 'Toolbox Talks', 'PPE Compliance']} activeTab={activeTab} onChange={setActiveTab} />
      <SubcontractorSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function SubcontractorBillingModule() {
  const [activeTab, setActiveTab] = useState("Running Account Bills");
  return (
    <div>
      <SubcontractorModuleHeader title="Billing Center" description="RA Bills and variations" />
      <SubcontractorTabs tabs={['Running Account Bills', 'Payment Status', 'Variation Requests', 'Change Requests']} activeTab={activeTab} onChange={setActiveTab} />
      <SubcontractorSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function SubcontractorResourceModule() {
  const [activeTab, setActiveTab] = useState("Time Sheet Management");
  return (
    <div>
      <SubcontractorModuleHeader title="Resource Planning" description="Time sheets and forecasts" />
      <SubcontractorTabs tabs={['Time Sheet Management', 'Resource Planning', 'Inventory Requests']} activeTab={activeTab} onChange={setActiveTab} />
      <SubcontractorSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function SubcontractorCollabModule() {
  const [activeTab, setActiveTab] = useState("Chat");
  return (
    <div>
      <SubcontractorModuleHeader title="Collaboration Center" description="Chats and meetings" />
      <SubcontractorTabs tabs={['Chat', 'Video Meetings', 'Document Sharing']} activeTab={activeTab} onChange={setActiveTab} />
      <SubcontractorSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function SubcontractorReportsModule() { return <GoogleDocsReportGenerator portalRole="Subcontractor Team Lead" defaultProject="Skyline Towers - Phase 1" />; }

export function SubcontractorAiCenterModule() {
  const [t, setT] = useState('AI Subcontractor Copilot');
  return (
    <div>
      <SubcontractorModuleHeader title="AI & ML Center" description="Subcontractor Intelligence" />
      <SubcontractorTabs tabs={['AI Subcontractor Copilot', 'Construction AI', 'Billing AI', 'Safety AI', 'Quality AI']} activeTab={t} onChange={setT} />
      {t === 'AI Subcontractor Copilot' ? <SubcontractorCopilotInterface /> : <SubcontractorSubModulePlaceholder title={t} />}
    </div>
  );
}
