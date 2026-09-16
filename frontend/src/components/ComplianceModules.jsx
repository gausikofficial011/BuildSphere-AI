import React, { useState } from 'react';
import { PremiumPlaceholder } from './SharedUI';
import {
  Bot, Send, ShieldCheck, Plus
} from 'lucide-react';
import { GoogleDocsReportGenerator } from './GoogleDocsReportGenerator';
import { TaskManager } from './TaskManager';
import { IssueTracker } from './IssueTracker';
import { DailyLogForm } from './DailyLogForm';
import { DocumentCenter } from './DocumentCenter';
import { NotificationsPanel } from './NotificationsPanel';
import { ProjectKPIDashboard } from './ProjectKPIDashboard';

export function ComplianceModuleHeader({ title, description, actionText = "Action" }) {
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

export function ComplianceTabs({ tabs, activeTab, onChange }) {
  return (
    <div style={{ display: 'flex', gap: '1.5rem', borderBottom: '1px solid #1e293b', marginBottom: '1rem', overflowX: 'auto', paddingBottom: '1px' }}>
      {tabs.map(t => (
        <button 
          key={t}
          onClick={() => onChange(t)}
          style={{ 
            padding: '0.5rem 0', 
            background: 'none', border: 'none', 
            borderBottom: activeTab === t ? '2px solid #3b82f6' : '2px solid transparent',
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

function ComplianceSubModulePlaceholder({ title }) {
  return <PremiumPlaceholder title={title} />;
}

export function ComplianceCopilotInterface() {
  const [msgs, setMsgs] = useState([
    { role: 'assistant', text: 'Regulatory intelligence initialized. I have detected 2 permits expiring within 30 days and 1 minor discrepancy in the latest MEP BIM compliance check. How can I assist you with compliance management today?' }
  ]);
  const [inp, setInp] = useState('');

  const handleSend = () => {
    if(!inp.trim()) return;
    setMsgs([...msgs, { role: 'user', text: inp }]);
    setInp('');
    setTimeout(() => {
      setMsgs(prev => [...prev, { role: 'assistant', text: 'I am verifying the NBC 2024 amendments regarding fire safety for high-rise residential blocks. I will draft a compliance checklist based on the new regulations for the upcoming audit.' }]);
    }, 1000);
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 250px)', backgroundColor: '#0a0f1e', borderRadius: '0.5rem', border: '1px solid #1e293b', overflow: 'hidden' }}>
      <div style={{ padding: '1rem', borderBottom: '1px solid #1e293b', backgroundColor: '#070b19', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{ width: '36px', height: '36px', borderRadius: '0.4rem', backgroundColor: 'rgba(59, 130, 246, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#60a5fa' }}>
          <Bot size={20} />
        </div>
        <div>
          <h2 style={{ fontSize: '1rem', fontWeight: 'bold', margin: 0, color: '#ffffff' }}>AI Compliance Copilot</h2>
          <p style={{ color: '#94a3b8', margin: 0, fontSize: '0.7rem' }}>Regulatory oversight and legal intelligence</p>
        </div>
      </div>
      
      <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid #1e293b', display: 'flex', gap: '0.5rem', overflowX: 'auto', backgroundColor: '#050814' }}>
        {['Check building code', 'Draft audit report', 'Summarize environmental norms', 'Review drone findings', 'Verify PPE compliance'].map(chip => (
          <button key={chip} onClick={() => setInp(chip)} style={{ padding: '0.4rem 0.75rem', borderRadius: '9999px', border: '1px solid #1e293b', backgroundColor: '#0a0f1e', color: '#cbd5e1', fontSize: '0.65rem', cursor: 'pointer', whiteSpace: 'nowrap' }}>
            {chip}
          </button>
        ))}
      </div>
      
      <div style={{ flex: 1, padding: '1rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem', backgroundColor: '#0a0f1e' }}>
        {msgs.map((m, i) => (
          <div key={i} style={{ display: 'flex', gap: '0.75rem', alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start', maxWidth: '80%' }}>
            {m.role === 'assistant' && (
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', flexShrink: 0 }}>
                <Bot size={14} />
              </div>
            )}
            <div style={{ padding: '0.75rem', backgroundColor: m.role === 'user' ? '#3b82f6' : '#070b19', color: '#ffffff', borderRadius: '0.5rem', borderTopLeftRadius: m.role === 'assistant' ? 0 : '0.5rem', borderTopRightRadius: m.role === 'user' ? 0 : '0.5rem', border: m.role === 'user' ? 'none' : '1px solid #1e293b', fontSize: '0.75rem', lineHeight: '1.4' }}>
              {m.text}
            </div>
          </div>
        ))}
      </div>

      <div style={{ padding: '1rem', backgroundColor: '#070b19', borderTop: '1px solid #1e293b' }}>
        <div style={{ display: 'flex', gap: '0.75rem', position: 'relative' }}>
          <input 
            type="text" 
            placeholder="Ask about regulations, audits, or legal compliance..." 
            value={inp}
            onChange={e => setInp(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            style={{ flex: 1, padding: '0.75rem 1rem', backgroundColor: '#0a0f1e', border: '1px solid #1e293b', color: '#ffffff', borderRadius: '9999px', fontSize: '0.75rem', outline: 'none' }}
          />
          <button 
            onClick={handleSend}
            style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#3b82f6', color: 'white', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.2s' }}
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

// Rapid stubs for Compliance modules
export function ComplianceOverviewModule() {
  const [activeTab, setActiveTab] = useState("Multi-Project Compliance");
  return (
    <div>
      <ComplianceModuleHeader title="Compliance Overview" description="Enterprise regulatory health" />
      <ComplianceTabs tabs={['Multi-Project Compliance', 'Live Compliance Alerts', 'Executive Compliance KPIs']} activeTab={activeTab} onChange={setActiveTab} />
      <ComplianceSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function ComplianceApprovalsModule() {
  const [activeTab, setActiveTab] = useState("Planning Approval");
  return (
    <div>
      <ComplianceModuleHeader title="Regulatory Approvals" description="Government approval tracking" />
      <ComplianceTabs tabs={['Planning Approval', 'Environmental Clearance', 'Fire NOC', 'Occupancy Certificate']} activeTab={activeTab} onChange={setActiveTab} />
      <ComplianceSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function CompliancePermitsModule() {
  const [activeTab, setActiveTab] = useState("Building Permits");
  return (
    <div>
      <ComplianceModuleHeader title="Permits & Licenses" description="Active and expiring permits" />
      <ComplianceTabs tabs={['Building Permits', 'Excavation Permits', 'License Management', 'Vendor Licenses']} activeTab={activeTab} onChange={setActiveTab} />
      <ComplianceSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function ComplianceInspectionsModule() {
  const [activeTab, setActiveTab] = useState("Government Inspection Calendar");
  return (
    <div>
      <ComplianceModuleHeader title="Inspections & Audits" description="Audit scheduling and tracking" />
      <ComplianceTabs tabs={['Government Inspection Calendar', 'Internal Audit', 'External Audit', 'ISO Compliance Center']} activeTab={activeTab} onChange={setActiveTab} />
      <ComplianceSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function ComplianceEnvironmentModule() {
  const [activeTab, setActiveTab] = useState("Pollution Monitoring");
  return (
    <div>
      <ComplianceModuleHeader title="Environment Compliance" description="Ecological monitoring" />
      <ComplianceTabs tabs={['Pollution Monitoring', 'Waste Management', 'Water Compliance', 'Air Quality Compliance']} activeTab={activeTab} onChange={setActiveTab} />
      <ComplianceSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function ComplianceLabourModule() {
  const [activeTab, setActiveTab] = useState("Worker Welfare Dashboard");
  return (
    <div>
      <ComplianceModuleHeader title="Labour Law Compliance" description="Workforce regulations" />
      <ComplianceTabs tabs={['Working Hours', 'Wages', 'Insurance', 'Worker Welfare Dashboard']} activeTab={activeTab} onChange={setActiveTab} />
      <ComplianceSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function ComplianceSafetyModule() {
  const [activeTab, setActiveTab] = useState("Building Code Compliance");
  return (
    <div>
      <ComplianceModuleHeader title="Safety & Code Compliance" description="Building and fire safety" />
      <ComplianceTabs tabs={['Building Code Compliance', 'Fire Safety Compliance', 'Structural Code Compliance', 'Accessibility Compliance']} activeTab={activeTab} onChange={setActiveTab} />
      <ComplianceSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function ComplianceEsgModule() {
  const [activeTab, setActiveTab] = useState("ESG Reporting");
  return (
    <div>
      <ComplianceModuleHeader title="ESG & Sustainability" description="Green building standards" />
      <ComplianceTabs tabs={['ESG Reporting', 'Sustainability Dashboard', 'Carbon Emission Dashboard']} activeTab={activeTab} onChange={setActiveTab} />
      <ComplianceSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function ComplianceDocsModule() {
  const [activeTab, setActiveTab] = useState("Government Documents");
  return (
    <div>
      <ComplianceModuleHeader title="Document Center" description="Regulatory records" />
      <ComplianceTabs tabs={['Government Documents', 'Digital Signature Center', 'Material Certification']} activeTab={activeTab} onChange={setActiveTab} />
      <ComplianceSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function ComplianceNcrModule() {
  const [activeTab, setActiveTab] = useState("Non-Conformance (NCR)");
  return (
    <div>
      <ComplianceModuleHeader title="NCR & CAPA" description="Corrective actions" />
      <ComplianceTabs tabs={['Non-Conformance (NCR)', 'CAPA Management', 'Incident Investigation']} activeTab={activeTab} onChange={setActiveTab} />
      <ComplianceSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function ComplianceReportsModule() { return <GoogleDocsReportGenerator portalRole="Regulatory & Compliance Lead" defaultProject="Skyline Towers - Phase 1" />; }
export function ComplianceRiskModule() {
  const [activeTab, setActiveTab] = useState("Regulatory Risk");
  return (
    <div>
      <ComplianceModuleHeader title="Risk & Legal Compliance" description="Legal oversight" />
      <ComplianceTabs tabs={['Regulatory Risk', 'Contract Risk', 'Litigation Monitoring']} activeTab={activeTab} onChange={setActiveTab} />
      <ComplianceSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function ComplianceGisDroneModule() {
  const [activeTab, setActiveTab] = useState("Drone Compliance Review");
  return (
    <div>
      <ComplianceModuleHeader title="GIS & Drone Monitoring" description="Spatial compliance" />
      <ComplianceTabs tabs={['Drone Compliance Review', 'GIS Regulatory Dashboard', 'Boundary Monitoring']} activeTab={activeTab} onChange={setActiveTab} />
      <ComplianceSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function ComplianceBimModule() {
  const [activeTab, setActiveTab] = useState("BIM Compliance Review");
  return (
    <div>
      <ComplianceModuleHeader title="BIM Compliance Review" description="Model verification" />
      <ComplianceTabs tabs={['BIM Compliance Review', 'Digital Twin Compliance', 'Space Standards']} activeTab={activeTab} onChange={setActiveTab} />
      <ComplianceSubModulePlaceholder title={activeTab} />
    </div>
  );
}

export function ComplianceAiCenterModule() {
  const [t, setT] = useState('AI Compliance Copilot');
  return (
    <div>
      <ComplianceModuleHeader title="AI Compliance Intelligence" description="Regulatory AI models" />
      <ComplianceTabs tabs={['AI Compliance Copilot', 'Building Code AI', 'Environmental AI', 'Audit AI', 'Document AI']} activeTab={t} onChange={setT} />
      {t === 'AI Compliance Copilot' ? <ComplianceCopilotInterface /> : <ComplianceSubModulePlaceholder title={t} />}
    </div>
  );
}
