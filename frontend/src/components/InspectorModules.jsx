import React, { useState } from 'react';
import { PremiumPlaceholder } from './SharedUI';
import {Bot, Camera, CheckSquare, Send, Plus} from 'lucide-react';
import { GoogleDocsReportGenerator } from './GoogleDocsReportGenerator';
import { TaskManager } from './TaskManager';
import { IssueTracker } from './IssueTracker';
import { DailyLogForm } from './DailyLogForm';
import { DocumentCenter } from './DocumentCenter';
import { NotificationsPanel } from './NotificationsPanel';
import { ProjectKPIDashboard } from './ProjectKPIDashboard';

export function InspectorModuleHeader({ title, description, actionText = "Action" }) {
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

export function InspectorTabs({ tabs, activeTab, onChange }) {
  return (
    <div style={{ display: 'flex', gap: '1.5rem', borderBottom: '1px solid #e2e8f0', marginBottom: '1rem', overflowX: 'auto', paddingBottom: '1px' }}>
      {tabs.map(t => (
        <button 
          key={t}
          onClick={() => onChange(t)}
          style={{ 
            padding: '0.5rem 0', 
            background: 'none', border: 'none', 
            borderBottom: activeTab === t ? '2px solid #2563eb' : '2px solid transparent',
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

function InspectorSubModulePlaceholder({ title }) {
  return <PremiumPlaceholder title={title} />;
}

export function InspectorCopilotInterface() {
  const [msgs, setMsgs] = useState([
    { role: 'assistant', text: 'Quality Intelligence initialized. I noticed a 15% increase in concrete surface defects in Block A. Would you like me to generate a CAPA report or schedule a drone re-inspection for the facade?' }
  ]);
  const [inp, setInp] = useState('');

  const handleSend = () => {
    if(!inp.trim()) return;
    setMsgs([...msgs, { role: 'user', text: inp }]);
    setInp('');
    setTimeout(() => {
      setMsgs(prev => [...prev, { role: 'assistant', text: 'I am analyzing the latest structural test results for Column C4. The cube compressive strength is slightly below the 28-day target. I recommend raising a minor NCR and notifying the structural consultant for review.' }]);
    }, 1000);
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 250px)', backgroundColor: 'white', borderRadius: '0.5rem', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
      <div style={{ padding: '1rem', borderBottom: '1px solid #e2e8f0', backgroundColor: 'rgba(255, 255, 255, 0.05)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{ width: '36px', height: '36px', borderRadius: '0.4rem', backgroundColor: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3b82f6' }}>
          <Bot size={20} />
        </div>
        <div>
          <h2 style={{ fontSize: '1rem', fontWeight: 'bold', margin: 0, color: '#ffffff' }}>AI Inspection Copilot</h2>
          <p style={{ color: '#64748b', margin: 0, fontSize: '0.7rem' }}>Field inspection and defect intelligence</p>
        </div>
      </div>
      
      <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid #e2e8f0', display: 'flex', gap: '0.5rem', overflowX: 'auto', backgroundColor: 'white' }}>
        {['Analyze drone photo', 'Draft NCR for leak', 'Generate MEP checklist', 'Check safety compliance', 'Predict material failure'].map(chip => (
          <button key={chip} onClick={() => setInp(chip)} style={{ padding: '0.4rem 0.75rem', borderRadius: '9999px', border: '1px solid #e2e8f0', backgroundColor: 'rgba(255, 255, 255, 0.05)', color: '#cbd5e1', fontSize: '0.65rem', cursor: 'pointer', whiteSpace: 'nowrap' }}>
            {chip}
          </button>
        ))}
      </div>
      
      <div style={{ flex: 1, padding: '1rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem', backgroundColor: 'white' }}>
        {msgs.map((m, i) => (
          <div key={i} style={{ display: 'flex', gap: '0.75rem', alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start', maxWidth: '80%' }}>
            {m.role === 'assistant' && (
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', flexShrink: 0 }}>
                <Bot size={14} />
              </div>
            )}
            <div style={{ padding: '0.75rem', backgroundColor: m.role === 'user' ? '#2563eb' : 'rgba(255, 255, 255, 0.05)', color: m.role === 'user' ? 'white' : '#e2e8f0', borderRadius: '0.5rem', borderTopLeftRadius: m.role === 'assistant' ? 0 : '0.5rem', borderTopRightRadius: m.role === 'user' ? 0 : '0.5rem', border: m.role === 'user' ? 'none' : '1px solid #e2e8f0', fontSize: '0.75rem', lineHeight: '1.4' }}>
              {m.text}
            </div>
          </div>
        ))}
      </div>

      <div style={{ padding: '1rem', backgroundColor: 'rgba(255, 255, 255, 0.05)', borderTop: '1px solid #e2e8f0' }}>
        <div style={{ display: 'flex', gap: '0.75rem', position: 'relative' }}>
          <input 
            type="text" 
            placeholder="Ask about checklists, defects, testing results..." 
            value={inp}
            onChange={e => setInp(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            style={{ flex: 1, padding: '0.75rem 1rem', backgroundColor: 'white', border: '1px solid #cbd5e1', color: '#ffffff', borderRadius: '9999px', fontSize: '0.75rem', outline: 'none' }}
          />
          <button 
            onClick={handleSend}
            style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#2563eb', color: 'white', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.2s' }}
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

// Rapid stubs for Inspector modules
export function InspAssignedModule() { return <TaskManager portalRole="Site Inspector & QC Lead" projectId={1} />; }
export function InspCalendarModule() {
  const [activeTab, setActiveTab] = useState("Daily Calendar");
  return (
    <div>
      <InspectorModuleHeader title="Inspection Calendar" description="Schedule and timeline" />
      <InspectorTabs tabs={['Daily Calendar', 'Weekly Calendar', 'Monthly Calendar']} activeTab={activeTab} onChange={setActiveTab} />
      <InspectorSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function InspSiteModule() {
  const [activeTab, setActiveTab] = useState("Live Inspection Forms");
  return (
    <div>
      <InspectorModuleHeader title="Site Inspections" description="Field data collection" />
      <InspectorTabs tabs={['Live Inspection Forms', 'Mobile Field Inspection', 'Photo Documentation']} activeTab={activeTab} onChange={setActiveTab} />
      <InspectorSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function InspChecklistsModule() {
  const [activeTab, setActiveTab] = useState("Civil Checklist");
  return (
    <div>
      <InspectorModuleHeader title="Inspection Checklists" description="Digital verification forms" />
      <InspectorTabs tabs={['Civil Checklist', 'Structural Checklist', 'Architectural Checklist', 'MEP Checklist', 'Safety Checklist']} activeTab={activeTab} onChange={setActiveTab} />
      <InspectorSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function InspBimModule() {
  const [activeTab, setActiveTab] = useState("3D BIM Viewer");
  return (
    <div>
      <InspectorModuleHeader title="BIM / 3D Inspection" description="Model verification in the field" />
      <InspectorTabs tabs={['3D BIM Viewer', 'Component Verification', 'Installation Status']} activeTab={activeTab} onChange={setActiveTab} />
      <InspectorSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function InspDigitalTwinModule() {
  const [activeTab, setActiveTab] = useState("Live Sensor Overlay");
  return (
    <div>
      <InspectorModuleHeader title="Digital Twin" description="Live asset validation" />
      <InspectorTabs tabs={['Live Sensor Overlay', 'Equipment Health', 'IoT Sensor Validation']} activeTab={activeTab} onChange={setActiveTab} />
      <InspectorSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function InspDroneModule() {
  const [activeTab, setActiveTab] = useState("Roof Inspection");
  return (
    <div>
      <InspectorModuleHeader title="Drone Inspections" description="Aerial survey and visual capture" />
      <InspectorTabs tabs={['Roof Inspection', 'Façade Inspection', 'AI Comparison']} activeTab={activeTab} onChange={setActiveTab} />
      <InspectorSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function InspAiVisualModule() {
  const [activeTab, setActiveTab] = useState("Crack Detection");
  return (
    <div>
      <InspectorModuleHeader title="AI Visual Inspection" description="Computer vision defect detection" />
      <InspectorTabs tabs={['Crack Detection', 'Surface Defects', 'Corrosion Detection', 'Water Leakage']} activeTab={activeTab} onChange={setActiveTab} />
      <InspectorSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function InspMaterialModule() {
  const [activeTab, setActiveTab] = useState("Concrete");
  return (
    <div>
      <InspectorModuleHeader title="Material Inspection" description="Quality control of supplies" />
      <InspectorTabs tabs={['Concrete', 'Steel', 'Aggregates', 'Laboratory Test Reports']} activeTab={activeTab} onChange={setActiveTab} />
      <InspectorSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function InspEquipModule() {
  const [activeTab, setActiveTab] = useState("Cranes");
  return (
    <div>
      <InspectorModuleHeader title="Equipment Inspection" description="Heavy machinery validation" />
      <InspectorTabs tabs={['Cranes', 'Excavators', 'Generators']} activeTab={activeTab} onChange={setActiveTab} />
      <InspectorSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function InspSafetyModule() {
  const [activeTab, setActiveTab] = useState("PPE Compliance");
  return (
    <div>
      <InspectorModuleHeader title="Safety Inspection" description="HSE verification" />
      <InspectorTabs tabs={['PPE Compliance', 'Permit Verification', 'Work at Height']} activeTab={activeTab} onChange={setActiveTab} />
      <InspectorSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function InspNcrModule() { return <IssueTracker portalRole="Site Inspector & QC Lead" projectId={1} defaultCategory="NCR" />; }
export function InspDefectModule() { return <IssueTracker portalRole="Site Inspector & QC Lead" projectId={1} defaultCategory="Defect" />; }
export function InspPunchModule() { return <IssueTracker portalRole="Site Inspector & QC Lead" projectId={1} defaultCategory="Snag" />; }
export function InspCapaModule() {
  const [activeTab, setActiveTab] = useState("Corrective Action");
  return (
    <div>
      <InspectorModuleHeader title="CAPA Verification" description="Corrective and preventive action" />
      <InspectorTabs tabs={['Corrective Action', 'Root Cause Analysis', 'Effectiveness Review']} activeTab={activeTab} onChange={setActiveTab} />
      <InspectorSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function InspReportsModule() { return <GoogleDocsReportGenerator portalRole="Site Inspector & QC Lead" defaultProject="Skyline Towers - Phase 1" />; }
export function InspDocsModule() { return <DocumentCenter portalRole="Site Inspector & QC Lead" projectId={1} />; }
export function InspApprovalsModule() { return <TaskManager portalRole="Site Inspector & QC Lead" projectId={1} />; }

export function InspAiCenterModule() {
  const [t, setT] = useState('AI Inspection Copilot');
  return (
    <div>
      <InspectorModuleHeader title="AI Inspection Intelligence" description="Advanced AI models for quality assurance" />
      <InspectorTabs tabs={['AI Inspection Copilot', 'Computer Vision AI', 'Safety AI', 'Material AI', 'Predictive Models']} activeTab={t} onChange={setT} />
      {t === 'AI Inspection Copilot' ? <InspectorCopilotInterface /> : <InspectorSubModulePlaceholder title={t} />}
    </div>
  );
}
