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

export function MepModuleHeader({ title, description, actionText = "Action" }) {
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

export function MepTabs({ tabs, activeTab, onChange }) {
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

function MepSubModulePlaceholder({ title }) {
  return <PremiumPlaceholder title={title} />;
}

export function MepCopilotInterface() {
  const [msgs, setMsgs] = useState([
    { role: 'assistant', text: 'Good Morning, Arun! I am your AI MEP Copilot. I can assist you with HVAC sizing, duct routing, electrical load calculations, plumbing coordination, or energy optimization. How can I help you today?' }
  ]);
  const [inp, setInp] = useState('');

  const handleSend = () => {
    if(!inp.trim()) return;
    setMsgs([...msgs, { role: 'user', text: inp }]);
    setInp('');
    setTimeout(() => {
      setMsgs(prev => [...prev, { role: 'assistant', text: 'Based on the updated cooling load calculations for the North Wing, I recommend adjusting the AHU-04 capacity from 25 TR to 30 TR to account for the increased solar gain. I have also verified the duct routing; there is a minor clash with a cable tray on Level 4 that I have automatically resolved.' }]);
    }, 1000);
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 250px)', backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
      <div style={{ padding: '1.5rem', borderBottom: '1px solid #e2e8f0', backgroundColor: 'rgba(255, 255, 255, 0.05)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{ width: '40px', height: '40px', borderRadius: '0.5rem', backgroundColor: '#e0e7ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4f46e5' }}>
          <Bot size={24} />
        </div>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', margin: 0, color: '#ffffff' }}>AI MEP Copilot</h2>
          <p style={{ color: '#64748b', margin: 0, fontSize: '0.875rem' }}>Your intelligent building-services assistant</p>
        </div>
      </div>
      
      <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid #e2e8f0', display: 'flex', gap: '0.5rem', overflowX: 'auto' }}>
        {['Calculate Cooling Load', 'Optimize Duct Routing', 'Check Electrical Load', 'Analyze Pressure Drop', 'Generate BOQ'].map(chip => (
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
            placeholder="Ask your MEP copilot..." 
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

// Stubs for MEP modules
export function MepWorkspaceModule() {
  const [t, setT] = useState('Active Projects');
  return <div><MepModuleHeader title="MEP Engineering Workspace" description="Your central MEP command." /><MepTabs tabs={['Active Projects', 'MEP Tasks', 'Engineering Calendar', 'Recent Models']} activeTab={t} onChange={setT} /><MepSubModulePlaceholder title={t} /></div>;
}
export function HvacModule() {
  const [t, setT] = useState('Mechanical Equipment');
  return <div><MepModuleHeader title="Mechanical (HVAC) Center" description="Design heating, ventilation, and air conditioning." /><MepTabs tabs={['Mechanical Equipment', 'Duct Design', 'Cooling Load', 'Thermal Comfort']} activeTab={t} onChange={setT} /><MepSubModulePlaceholder title={t} /></div>;
}
export function ElectricalModule() {
  const [t, setT] = useState('Power Distribution');
  return <div><MepModuleHeader title="Electrical Design Center" description="Manage HT, LT, and power systems." /><MepTabs tabs={['Power Distribution', 'HT/LT Systems', 'Lighting Design', 'Single Line Diagram']} activeTab={t} onChange={setT} /><MepSubModulePlaceholder title={t} /></div>;
}
export function PlumbingModule() {
  const [t, setT] = useState('Pipe Sizing');
  return <div><MepModuleHeader title="Plumbing Design Center" description="Manage water supply and drainage." /><MepTabs tabs={['Pipe Sizing', 'Pump Rooms', 'Drainage', 'Pressure Analysis']} activeTab={t} onChange={setT} /><MepSubModulePlaceholder title={t} /></div>;
}
export function FireModule() {
  const [t, setT] = useState('Sprinklers');
  return <div><MepModuleHeader title="Fire Protection Design" description="Design sprinklers and fire suppression." /><MepTabs tabs={['Sprinklers', 'Fire Pumps', 'Alarm System', 'Evacuation']} activeTab={t} onChange={setT} /><MepSubModulePlaceholder title={t} /></div>;
}
export function ElvModule() {
  const [t, setT] = useState('Structured Cabling');
  return <div><MepModuleHeader title="ELV & Communication Systems" description="Manage low voltage and data systems." /><MepTabs tabs={['Structured Cabling', 'CCTV', 'Access Control', 'Data Center']} activeTab={t} onChange={setT} /><MepSubModulePlaceholder title={t} /></div>;
}
export function BmsModule() {
  const [t, setT] = useState('HVAC Automation');
  return <div><MepModuleHeader title="BMS & Automation" description="Building management systems." /><MepTabs tabs={['HVAC Automation', 'Energy Monitoring', 'Smart Controls']} activeTab={t} onChange={setT} /><MepSubModulePlaceholder title={t} /></div>;
}

export function MepAIMLModule() {
  const [t, setT] = useState('AI MEP Copilot');
  return (
    <div>
      <MepModuleHeader title="AI & ML Center" description="Advanced engineering and predictive models." />
      <MepTabs tabs={['AI MEP Copilot', 'AI HVAC Designer', 'Electrical AI', 'Failure Prediction', 'Optimization Models']} activeTab={t} onChange={setT} />
      {t === 'AI MEP Copilot' ? <MepCopilotInterface /> : <MepSubModulePlaceholder title={t} />}
    </div>
  );
}

// Rapid stubs for the rest
export function RenewableModule() { return <MepSubModulePlaceholder title="Renewable Energy Systems" />; }
export function EnergyModule() { return <MepSubModulePlaceholder title="Energy Management" />; }
export function EquipmentModule() { return <MepSubModulePlaceholder title="Equipment & Assets" />; }
export function LoadCalcModule() { return <MepSubModulePlaceholder title="Load Calculation Center" />; }
export function MepBimModule() { return <MepSubModulePlaceholder title="MEP BIM & Coordination" />; }
export function ClashModule() { return <MepSubModulePlaceholder title="MEP Clash Detection" />; }
export function SimulationModule() { return <MepSubModulePlaceholder title="Simulation & Analysis" />; }
export function CommissioningModule() { return <MepSubModulePlaceholder title="Commissioning Center" />; }
export function ReportsModule() { return <GoogleDocsReportGenerator portalRole="MEP Engineer" defaultProject="Skyline Towers - Phase 1" />; }
