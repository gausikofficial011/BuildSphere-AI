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
import { CivilThreeDViewer } from './CivilThreeDViewer';

export function CivilModuleHeader({ title, description, actionText = "Action" }) {
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

export function CivilTabs({ tabs, activeTab, onChange }) {
  return (
    <div style={{ display: 'flex', gap: '2rem', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', marginBottom: '1.5rem', overflowX: 'auto', paddingBottom: '1px' }}>
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

function CivilSubModulePlaceholder({ title }) {
  return <PremiumPlaceholder title={title} />;
}

export function CivilCopilotInterface() {
  const [msgs, setMsgs] = useState([
    { role: 'assistant', text: 'Good Morning, Arun! I am your AI Civil Copilot. I can analyze earthwork volumes, recommend foundation types, or validate drainage networks. What would you like to analyze today?' }
  ]);
  const [inp, setInp] = useState('');

  const handleSend = () => {
    if(!inp.trim()) return;
    setMsgs([...msgs, { role: 'user', text: inp }]);
    setInp('');
    setTimeout(() => {
      setMsgs(prev => [...prev, { role: 'assistant', text: 'I have analyzed the cut/fill data for Zone A. We have a net cut of 26,690 m³. I recommend diverting 12,000 m³ of this material to the backfilling operations in Zone C, which is currently experiencing a shortage, thereby optimizing haul routes and reducing external material costs.' }]);
    }, 1000);
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 250px)', backgroundColor: 'rgba(15, 23, 42, 0.7)', backdropFilter: 'blur(16px)', borderRadius: '0.75rem', border: '1px solid rgba(255, 255, 255, 0.1)', overflow: 'hidden' }}>
      <div style={{ padding: '1.5rem', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', backgroundColor: 'rgba(0, 0, 0, 0.2)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{ width: '40px', height: '40px', borderRadius: '0.5rem', backgroundColor: 'rgba(79, 70, 229, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#818cf8' }}>
          <Bot size={24} />
        </div>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', margin: 0, color: '#ffffff' }}>AI Civil Copilot</h2>
          <p style={{ color: '#94a3b8', margin: 0, fontSize: '0.875rem' }}>Your intelligent heavy civil engineering assistant</p>
        </div>
      </div>
      
      <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', display: 'flex', gap: '0.5rem', overflowX: 'auto', backgroundColor: 'rgba(0, 0, 0, 0.1)' }}>
        {['Analyze Earthwork Volume', 'Check Utility Clash', 'Predict Concrete Strength', 'Optimize Site Grading', 'Analyze Soil Bearing'].map(chip => (
          <button key={chip} onClick={() => setInp(chip)} style={{ padding: '0.5rem 1rem', borderRadius: '9999px', border: '1px solid rgba(255, 255, 255, 0.1)', backgroundColor: 'rgba(255, 255, 255, 0.05)', color: '#cbd5e1', fontSize: '0.75rem', cursor: 'pointer', whiteSpace: 'nowrap' }}>
            {chip}
          </button>
        ))}
      </div>
      
      <div style={{ flex: 1, padding: '1.5rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {msgs.map((m, i) => (
          <div key={i} style={{ display: 'flex', gap: '1rem', alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start', maxWidth: '80%' }}>
            {m.role === 'assistant' && (
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#4f46e5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', flexShrink: 0 }}>
                <Bot size={16} />
              </div>
            )}
            <div style={{ padding: '1rem', backgroundColor: m.role === 'user' ? '#4f46e5' : 'rgba(255, 255, 255, 0.05)', color: '#ffffff', borderRadius: '1rem', borderTopLeftRadius: m.role === 'assistant' ? 0 : '1rem', borderTopRightRadius: m.role === 'user' ? 0 : '1rem', border: m.role === 'user' ? 'none' : '1px solid rgba(255, 255, 255, 0.1)', fontSize: '0.875rem', lineHeight: '1.5' }}>
              {m.text}
            </div>
          </div>
        ))}
      </div>

      <div style={{ padding: '1.5rem', backgroundColor: 'rgba(0, 0, 0, 0.2)', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
        <div style={{ display: 'flex', gap: '1rem', position: 'relative' }}>
          <input 
            type="text" 
            placeholder="Ask your civil engineering copilot..." 
            value={inp}
            onChange={e => setInp(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            style={{ flex: 1, padding: '1rem 1.5rem', backgroundColor: 'rgba(0, 0, 0, 0.4)', border: '1px solid rgba(255, 255, 255, 0.15)', color: '#ffffff', borderRadius: '9999px', fontSize: '0.875rem', outline: 'none' }}
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

// Stubs for Civil modules
export function CivilWorkspaceModule() {
  const [t, setT] = useState('Active Projects');
  return <div><CivilModuleHeader title="Civil Engineering Workspace" description="Your central command." /><CivilTabs tabs={['Active Projects', 'Engineering Tasks', 'Project Calendar', 'Engineering Notes', 'Field Assignments']} activeTab={t} onChange={setT} /><CivilSubModulePlaceholder title={t} /></div>;
}
export function SiteDevelopmentModule() {
  const [t, setT] = useState('Site Layout');
  return <div><CivilModuleHeader title="Site Development Center" description="Plan and manage overall site boundaries." /><CivilTabs tabs={['Site Layout', 'Plot Planning', 'Access Roads', 'Temporary Facilities', 'Construction Zones']} activeTab={t} onChange={setT} /><CivilSubModulePlaceholder title={t} /></div>;
}
export function EarthworkModule() {
  const [t, setT] = useState('Cut & Fill Analysis');
  return <div><CivilModuleHeader title="Earthwork Management" description="Manage volumes, haul routes, and grading." /><CivilTabs tabs={['Cut & Fill Analysis', 'Earthwork Quantities', 'Excavation Planning', 'Haul Route Planning', 'Volume Calculations']} activeTab={t} onChange={setT} /><CivilSubModulePlaceholder title={t} /></div>;
}
export function FoundationModule() {
  const [t, setT] = useState('Pile Foundations');
  return <div><CivilModuleHeader title="Foundation Engineering" description="Design and monitor sub-structures." /><CivilTabs tabs={['Footings', 'Raft Foundations', 'Pile Foundations', 'Pile Caps', 'Grade Beams', 'Settlement Monitoring']} activeTab={t} onChange={setT} /><CivilSubModulePlaceholder title={t} /></div>;
}
export function ConcreteModule() {
  const [t, setT] = useState('Concrete Mix Designs');
  return <div><CivilModuleHeader title="Concrete Engineering" description="Manage concrete pours, testing, and mix designs." /><CivilTabs tabs={['Concrete Mix Designs', 'Pour Scheduling', 'Slump Tests', 'Cube Tests', 'Reinforcement Verification']} activeTab={t} onChange={setT} /><CivilSubModulePlaceholder title={t} /></div>;
}
export function RoadModule() {
  const [t, setT] = useState('Pavement Layers');
  return <div><CivilModuleHeader title="Road & Pavement Design" description="Design internal/external road networks." /><CivilTabs tabs={['Internal Roads', 'External Roads', 'Pavement Layers', 'Asphalt Monitoring', 'Road Profiles']} activeTab={t} onChange={setT} /><CivilSubModulePlaceholder title={t} /></div>;
}
export function DrainageModule() {
  const [t, setT] = useState('Stormwater Flow');
  return <div><CivilModuleHeader title="Drainage & Stormwater" description="Manage surface water and flood risks." /><CivilTabs tabs={['Drainage Network', 'Stormwater Flow', 'Culverts', 'Catch Basins', 'Pipe Networks']} activeTab={t} onChange={setT} /><CivilSubModulePlaceholder title={t} /></div>;
}
export function UtilityModule() {
  const [t, setT] = useState('Utility Clash Detection');
  return <div><CivilModuleHeader title="Utility Coordination" description="Coordinate all underground services." /><CivilTabs tabs={['Underground Utilities', 'Electrical Ducts', 'Telecom Ducts', 'Utility Clash Detection']} activeTab={t} onChange={setT} /><CivilSubModulePlaceholder title={t} /></div>;
}
export function TopographyModule() {
  const [t, setT] = useState('Survey Points');
  return <div><CivilModuleHeader title="Topography & Survey" description="Manage geospatial site data." /><CivilTabs tabs={['Survey Points', 'Total Station Data', 'Drone Survey', 'Point Cloud', 'Contour Maps']} activeTab={t} onChange={setT} /><CivilSubModulePlaceholder title={t} /></div>;
}
export function GeotechModule() {
  const [t, setT] = useState('Soil Reports');
  return <div><CivilModuleHeader title="Geotechnical Analysis" description="Soil investigation and bearing capacity." /><CivilTabs tabs={['Soil Layers', 'Bearing Capacity', 'Settlement', 'Soil Investigation', 'Borehole Logs']} activeTab={t} onChange={setT} /><CivilSubModulePlaceholder title={t} /></div>;
}
export function QuantityModule() {
  const [t, setT] = useState('Earthwork Quantities');
  return <div><CivilModuleHeader title="Quantity Verification" description="Track material quantities vs BOQ." /><CivilTabs tabs={['Earthwork Quantities', 'Concrete Quantities', 'Reinforcement Quantities', 'Pipe Quantities', 'Material Reconciliation']} activeTab={t} onChange={setT} /><CivilSubModulePlaceholder title={t} /></div>;
}
export function CivilAIMLModule() {
  const [t, setT] = useState('AI Civil Copilot');
  return (
    <div>
      <CivilModuleHeader title="AI & ML Center" description="Advanced engineering and predictive models." />
      <CivilTabs tabs={['AI Civil Copilot', 'AI Earthwork Optimizer', 'AI Foundation Designer', 'AI Concrete Advisor', 'AI Quantity Verification']} activeTab={t} onChange={setT} />
      {t === 'AI Civil Copilot' ? <CivilCopilotInterface /> : <CivilSubModulePlaceholder title={t} />}
    </div>
  );
}

// Rapid stubs for the rest of the sidebar
export function WaterSupplyModule() { return <CivilSubModulePlaceholder title="Water Supply Network" />; }
export function SewerageModule() { return <CivilSubModulePlaceholder title="Sewerage Network" />; }
export function ConstructionMonitorModule() { return <CivilSubModulePlaceholder title="Construction Monitoring" />; }
export function MaterialEngModule() { return <CivilSubModulePlaceholder title="Material Engineering" />; }
export function EquipmentCoordModule() { return <CivilSubModulePlaceholder title="Equipment Coordination" />; }
export function BIMCivilModule() {
  const [t, setT] = useState('Topography & Roads');
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <CivilModuleHeader title="BIM Civil Viewer" description="Explore Civil 3D federated infrastructure models." />
      <CivilTabs tabs={['Topography & Roads', 'Underground Utilities', 'Grading Optimization']} activeTab={t} onChange={setT} />
      {t === 'Topography & Roads' || t === 'Underground Utilities' ? <CivilThreeDViewer /> : <CivilSubModulePlaceholder title={t} />}
    </div>
  );
}
export function GISIntModule() { return <CivilSubModulePlaceholder title="GIS Integration" />; }
export function CivilQualityModule() { return <CivilSubModulePlaceholder title="Quality Control" />; }
export function CivilSafetyModule() { return <CivilSubModulePlaceholder title="Safety Management" />; }
export function CivilEnvModule() { return <CivilSubModulePlaceholder title="Environmental Management" />; }
export function CivilDocsModule() { return <CivilSubModulePlaceholder title="Drawing & Documentation" />; }
export function CivilReportsModule() { return <GoogleDocsReportGenerator portalRole="Civil Engineer" defaultProject="Skyline Towers - Phase 1" />; }
export function CivilCollabModule() { return <CivilSubModulePlaceholder title="Collaboration Center" />; }
export function CivilApprovalModule() { return <CivilSubModulePlaceholder title="Approval Workflow" />; }
