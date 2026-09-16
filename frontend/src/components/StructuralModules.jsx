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

export function StructuralModuleHeader({ title, description, actionText = "Action" }) {
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

export function StructuralTabs({ tabs, activeTab, onChange }) {
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

function StructuralSubModulePlaceholder({ title }) {
  return <PremiumPlaceholder title={title} />;
}

export function StructuralCopilotInterface() {
  const [msgs, setMsgs] = useState([
    { role: 'assistant', text: 'Good Morning, Arun! I am your AI Structural Copilot. I can run load combinations, check code compliance, optimize steel weights, or analyze seismic drifts. What would you like to do today?' }
  ]);
  const [inp, setInp] = useState('');

  const handleSend = () => {
    if(!inp.trim()) return;
    setMsgs([...msgs, { role: 'user', text: inp }]);
    setInp('');
    setTimeout(() => {
      setMsgs(prev => [...prev, { role: 'assistant', text: 'I have analyzed the load combinations for the primary core wall. The maximum drift under Seismic Load Case EqX is 0.012, which is within the safe limits of the local building code. I recommend optimizing the boundary element reinforcement to save approximately 4.2 tons of steel.' }]);
    }, 1000);
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 250px)', backgroundColor: 'rgba(15, 23, 42, 0.7)', backdropFilter: 'blur(16px)', borderRadius: '0.75rem', border: '1px solid rgba(255, 255, 255, 0.1)', overflow: 'hidden' }}>
      <div style={{ padding: '1.5rem', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', backgroundColor: 'rgba(0, 0, 0, 0.2)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{ width: '40px', height: '40px', borderRadius: '0.5rem', backgroundColor: 'rgba(79, 70, 229, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#818cf8' }}>
          <Bot size={24} />
        </div>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', margin: 0, color: '#ffffff' }}>AI Structural Copilot</h2>
          <p style={{ color: '#94a3b8', margin: 0, fontSize: '0.875rem' }}>Your intelligent structural engineering assistant</p>
        </div>
      </div>
      
      <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', display: 'flex', gap: '0.5rem', overflowX: 'auto', backgroundColor: 'rgba(0, 0, 0, 0.1)' }}>
        {['Analyze Beam Deflection', 'Generate Load Combos', 'Check Column Buckling', 'Optimize Rebar', 'Run Seismic Check'].map(chip => (
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
            placeholder="Ask your structural engineering copilot..." 
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

// Stubs for Structural modules
export function StrWorkspaceModule() {
  const [t, setT] = useState('Active Projects');
  return <div><StructuralModuleHeader title="Structural Workspace" description="Your central design command." /><StructuralTabs tabs={['Active Projects', 'Structural Models', 'Engineering Tasks', 'Smart Workspace']} activeTab={t} onChange={setT} /><StructuralSubModulePlaceholder title={t} /></div>;
}
import { RevitDynamoBuilder } from './RevitDynamoBuilder';
import { DigitalTwinEngine } from './DigitalTwinEngine';

export function StrModelingModule() {
  const [t, setT] = useState('Revit & Dynamo Builder');
  return (
    <div>
      <StructuralModuleHeader title="Structural Modeling & Revit Builder" description="Create, modify, and run Dynamo rebar scripts on 3D structures." />
      <StructuralTabs tabs={['Revit & Dynamo Builder', 'Columns & Beams', 'Slabs & Foundations', 'Walls & Cores', 'Trusses']} activeTab={t} onChange={setT} />
      {t === 'Revit & Dynamo Builder' ? <RevitDynamoBuilder /> : <StructuralSubModulePlaceholder title={t} />}
    </div>
  );
}
export function LoadAnalysisModule() {
  const [t, setT] = useState('Load Combinations');
  return <div><StructuralModuleHeader title="Load Analysis Center" description="Manage dead, live, wind, and seismic loads." /><StructuralTabs tabs={['Dead/Live Loads', 'Wind Loads', 'Seismic Loads', 'Load Combinations', 'Load Envelopes']} activeTab={t} onChange={setT} /><StructuralSubModulePlaceholder title={t} /></div>;
}
export function ConcreteDesignModule() {
  const [t, setT] = useState('RCC Design');
  return <div><StructuralModuleHeader title="Concrete Design Center" description="Design RCC elements." /><StructuralTabs tabs={['RCC Design', 'Slab Reinforcement', 'Beam Reinforcement', 'Punching Shear', 'Crack Width Check']} activeTab={t} onChange={setT} /><StructuralSubModulePlaceholder title={t} /></div>;
}
export function SteelDesignModule() {
  const [t, setT] = useState('Steel Frames');
  return <div><StructuralModuleHeader title="Steel Structure Design" description="Design steel sections and connections." /><StructuralTabs tabs={['Steel Frames', 'Steel Beams', 'Steel Columns', 'Optimization', 'Base Plates']} activeTab={t} onChange={setT} /><StructuralSubModulePlaceholder title={t} /></div>;
}
export function FoundationDesignModule() {
  const [t, setT] = useState('Mat Foundation');
  return <div><StructuralModuleHeader title="Foundation Design" description="Design footing and raft systems." /><StructuralTabs tabs={['Isolated Footings', 'Combined Footings', 'Raft Foundation', 'Pile Caps', 'Settlement Analysis']} activeTab={t} onChange={setT} /><StructuralSubModulePlaceholder title={t} /></div>;
}
export function ColumnDesignModule() {
  const [t, setT] = useState('RCC Columns');
  return <div><StructuralModuleHeader title="Column Design" description="Vertical load bearing elements." /><StructuralTabs tabs={['RCC Columns', 'Steel Columns', 'Composite Columns', 'Buckling Check', 'Rebar Optimization']} activeTab={t} onChange={setT} /><StructuralSubModulePlaceholder title={t} /></div>;
}
export function BeamDesignModule() {
  const [t, setT] = useState('Deflection Analysis');
  return <div><StructuralModuleHeader title="Beam Design" description="Horizontal load bearing elements." /><StructuralTabs tabs={['RCC Beams', 'Steel Beams', 'Composite Beams', 'Deflection Analysis', 'Rebar Design']} activeTab={t} onChange={setT} /><StructuralSubModulePlaceholder title={t} /></div>;
}
export function SlabDesignModule() {
  const [t, setT] = useState('Flat Slab');
  return <div><StructuralModuleHeader title="Slab Design" description="Floor and roof systems." /><StructuralTabs tabs={['One Way Slab', 'Two Way Slab', 'Flat Slab', 'Waffle Slab', 'Punching Shear']} activeTab={t} onChange={setT} /><StructuralSubModulePlaceholder title={t} /></div>;
}
export function WallDesignModule() {
  const [t, setT] = useState('Shear Wall Design');
  return <div><StructuralModuleHeader title="Wall & Shear Wall Design" description="Vertical elements and lateral stability." /><StructuralTabs tabs={['RCC Walls', 'Core Walls', 'Shear Wall Design', 'Drift Analysis', 'Retaining Walls']} activeTab={t} onChange={setT} /><StructuralSubModulePlaceholder title={t} /></div>;
}

export function StrAIMLModule() {
  const [t, setT] = useState('AI Structural Copilot');
  return (
    <div>
      <StructuralModuleHeader title="AI & ML Center" description="Advanced engineering and predictive models." />
      <StructuralTabs tabs={['AI Structural Copilot', 'AI Optimization', 'Seismic AI', 'Failure Prediction', 'Material AI']} activeTab={t} onChange={setT} />
      {t === 'AI Structural Copilot' ? <StructuralCopilotInterface /> : <StructuralSubModulePlaceholder title={t} />}
    </div>
  );
}

// Rapid stubs for the rest of the sidebar
export function StairDesignModule() { return <StructuralSubModulePlaceholder title="Stair Design" />; }
export function RoofDesignModule() { return <StructuralSubModulePlaceholder title="Roof Structure Design" />; }
export function ConnectionDesignModule() { return <StructuralSubModulePlaceholder title="Connection Design" />; }
export function ReinforcementModule() { return <StructuralSubModulePlaceholder title="Reinforcement Management" />; }
export function StrBIMModule() { return <StructuralSubModulePlaceholder title="Structural BIM Center" />; }
export function StrClashModule() { return <StructuralSubModulePlaceholder title="Structural Clash Detection" />; }
export function StrSimulationModule() { return <StructuralSubModulePlaceholder title="Structural Simulation" />; }
export function SeismicModule() { return <StructuralSubModulePlaceholder title="Seismic Analysis" />; }
export function WindModule() { return <StructuralSubModulePlaceholder title="Wind Analysis" />; }
export function VibrationModule() { return <StructuralSubModulePlaceholder title="Vibration Analysis" />; }
export function HealthMonitorModule() { 
  return (
    <div>
      <StructuralModuleHeader title="Structural Health Monitoring & IoT Telemetry" description="Live strain gauge telemetry and structural vibration monitoring." />
      <DigitalTwinEngine />
    </div>
  );
}
export function StrMaterialModule() { return <StructuralSubModulePlaceholder title="Material Engineering" />; }
export function StrBOQModule() { return <StructuralSubModulePlaceholder title="Quantity & BOQ" />; }
export function StrConstSupportModule() { return <StructuralSubModulePlaceholder title="Construction Support" />; }
export function StrInspectionModule() { return <StructuralSubModulePlaceholder title="Inspection Center" />; }
export function StrQualityModule() { return <StructuralSubModulePlaceholder title="Quality Assurance" />; }
export function StrSafetyModule() { return <StructuralSubModulePlaceholder title="Safety Engineering" />; }
export function StrDigitalTwinModule() { 
  return (
    <div>
      <StructuralModuleHeader title="Structural Digital Twin Integration" description="Bi-directional sensor sync with Revit/Dynamo structural models." />
      <DigitalTwinEngine />
    </div>
  );
}
export function StrGISModule() { return <StructuralSubModulePlaceholder title="GIS Integration" />; }
export function StrDocsModule() { return <StructuralSubModulePlaceholder title="Document Center" />; }
export function StrReportsModule() { return <GoogleDocsReportGenerator portalRole="Structural Engineer" defaultProject="Skyline Towers - Phase 1" />; }
export function StrCollabModule() { return <StructuralSubModulePlaceholder title="Collaboration Center" />; }
export function StrApprovalModule() { return <StructuralSubModulePlaceholder title="Approval Workflow" />; }
