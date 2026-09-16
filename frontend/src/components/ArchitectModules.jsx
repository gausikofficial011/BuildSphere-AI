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
import Ai2DTo3DStudio from './Ai2DTo3DStudio';

export function ArchModuleHeader({ title, description, actionText = "Action" }) {
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

export function ArchTabs({ tabs, activeTab, onChange }) {
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

function ArchSubModulePlaceholder({ title }) {
  return <PremiumPlaceholder title={title} />;
}

export function ArchCopilotInterface() {
  const [msgs, setMsgs] = useState([
    { role: 'assistant', text: 'Good Morning, Ananya! I am your AI Architect Copilot. I can generate conceptual floor plans from text, validate your BIM model against NBC 2016 building codes, or suggest sustainable facade materials. What would you like to design today?' }
  ]);
  const [inp, setInp] = useState('');

  const handleSend = () => {
    if(!inp.trim()) return;
    setMsgs([...msgs, { role: 'user', text: inp }]);
    setInp('');
    setTimeout(() => {
      setMsgs(prev => [...prev, { role: 'assistant', text: 'I have analyzed the Skyline Towers floor plan. I recommend increasing the corridor width on Level 4 from 1.5m to 1.8m to comply with the latest accessibility codes. I have also noticed a clash between the architectural ceiling and the MEP HVAC ducting in the lobby area. Would you like me to highlight the clash in the 3D viewer?' }]);
    }, 1000);
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 250px)', backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
      <div style={{ padding: '1.5rem', borderBottom: '1px solid #e2e8f0', backgroundColor: 'rgba(255, 255, 255, 0.05)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{ width: '40px', height: '40px', borderRadius: '0.5rem', backgroundColor: '#e0e7ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4f46e5' }}>
          <Bot size={24} />
        </div>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', margin: 0, color: '#ffffff' }}>AI Architect Copilot</h2>
          <p style={{ color: '#64748b', margin: 0, fontSize: '0.875rem' }}>Your intelligent design and compliance assistant</p>
        </div>
      </div>
      
      <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid #e2e8f0', display: 'flex', gap: '0.5rem', overflowX: 'auto' }}>
        {['Generate 3BHK layout', 'Check Fire Safety Code', 'Suggest facade materials', 'Analyze natural lighting', 'Resolve MEP clashes'].map(chip => (
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
            placeholder="Ask your design copilot..." 
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

// Stubs for the Architect modules
export function DesignWorkspaceModule() {
  const [t, setT] = useState('Personal Design Dashboard');
  return <div><ArchModuleHeader title="Design Workspace" description="Your central architectural hub." /><ArchTabs tabs={['Personal Design Dashboard', 'Active Projects', 'Favorite Projects', 'Recently Edited Models', 'Design Shortcuts']} activeTab={t} onChange={setT} /><ArchSubModulePlaceholder title={t} /></div>;
}
export function Modeler3DModule() {
  const [t, setT] = useState('Wall Tool');
  return <div><ArchModuleHeader title="3D Architectural Modeling" description="Core structural and architectural modeling tools." /><ArchTabs tabs={['Wall Tool', 'Door Tool', 'Window Tool', 'Roof Tool', 'Floor Tool', 'Stair Tool', 'Parametric Families']} activeTab={t} onChange={setT} /><ArchSubModulePlaceholder title={t} /></div>;
}
import { RevitDynamoBuilder } from './RevitDynamoBuilder';

export function BIMDesignModule() {
  const [t, setT] = useState('Revit & Dynamo Builder');
  return (
    <div>
      <ArchModuleHeader title="BIM Design Center & Revit Builder" description="Author 3D architectural elements manually and execute Dynamo visual scripts." />
      <ArchTabs tabs={['Revit & Dynamo Builder', 'BIM Viewer', 'IFC Support', 'Family Library', 'BIM Properties', 'Model Hierarchy', 'BIM Validation']} activeTab={t} onChange={setT} />
      {t === 'Revit & Dynamo Builder' ? <RevitDynamoBuilder /> : <ArchSubModulePlaceholder title={t} />}
    </div>
  );
}
export function FloorPlanModule() {
  const [t, setT] = useState('AI 2D-to-3D Studio');
  return (
    <div>
      <ArchModuleHeader title="Floor Plan Designer & AI 2D-to-3D Studio" description="Draft 2D floor plans, upload blueprints, and auto-extrude into 3D digital twins." />
      <ArchTabs tabs={['AI 2D-to-3D Studio', 'Residential Layouts', 'Commercial Layouts', 'Auto Room Naming', 'Area Calculation']} activeTab={t} onChange={setT} />
      {t === 'AI 2D-to-3D Studio' ? <Ai2DTo3DStudio /> : <ArchSubModulePlaceholder title={t} />}
    </div>
  );
}
export function SpacePlanModule() {
  const [t, setT] = useState('Space Allocation');
  return <div><ArchModuleHeader title="Space Planning" description="Analyze and allocate internal spaces." /><ArchTabs tabs={['Space Allocation', 'Occupancy Analysis', 'Functional Zoning', 'Circulation Analysis', 'Space Optimization']} activeTab={t} onChange={setT} /><ArchSubModulePlaceholder title={t} /></div>;
}
export function ConceptDesignModule() {
  const [t, setT] = useState('Sketch Mode');
  return <div><ArchModuleHeader title="Concept Design" description="Early stage conceptualization and massing." /><ArchTabs tabs={['Sketch Mode', 'Massing Models', 'Design Alternatives', 'Mood Boards', 'AI Design Brainstorm']} activeTab={t} onChange={setT} /><ArchSubModulePlaceholder title={t} /></div>;
}
export function MaterialLibraryModule() {
  const [t, setT] = useState('Concrete');
  return <div><ArchModuleHeader title="Material Library" description="Browse and assign materials and finishes." /><ArchTabs tabs={['Concrete', 'Steel', 'Glass', 'Brick', 'Wood', 'Stone', 'Green Materials', 'Material Properties']} activeTab={t} onChange={setT} /><ArchSubModulePlaceholder title={t} /></div>;
}
export function FacadeModule() {
  const [t, setT] = useState('Curtain Walls');
  return <div><ArchModuleHeader title="Facade Designer" description="Design exterior shells and cladding systems." /><ArchTabs tabs={['Curtain Walls', 'Glass Systems', 'Aluminum Panels', 'Stone Cladding', 'AI Facade Optimization']} activeTab={t} onChange={setT} /><ArchSubModulePlaceholder title={t} /></div>;
}
export function InteriorModule() {
  const [t, setT] = useState('Room Themes');
  return <div><ArchModuleHeader title="Interior Design" description="Design interior spaces and furnishings." /><ArchTabs tabs={['Room Themes', 'Lighting', 'Furniture', 'Colors', 'Textures', 'AI Interior Suggestions']} activeTab={t} onChange={setT} /><ArchSubModulePlaceholder title={t} /></div>;
}
export function RenderStudioModule() {
  const [t, setT] = useState('Real-Time Rendering');
  return <div><ArchModuleHeader title="Rendering Studio" description="Generate high-quality visualizations." /><ArchTabs tabs={['Real-Time Rendering', 'High Quality Rendering', 'Ray Tracing Ready', 'Walkthrough Videos', '360° Panorama']} activeTab={t} onChange={setT} /><ArchSubModulePlaceholder title={t} /></div>;
}
export function CodeComplianceModule() {
  const [t, setT] = useState('NBC Compliance');
  return <div><ArchModuleHeader title="Building Code Compliance" description="Check design against local regulations." /><ArchTabs tabs={['NBC Compliance', 'Fire Safety', 'Accessibility', 'Structural Guidelines', 'Parking Standards']} activeTab={t} onChange={setT} /><ArchSubModulePlaceholder title={t} /></div>;
}
export function ArchSustainabilityModule() {
  const [t, setT] = useState('LEED Analysis');
  return <div><ArchModuleHeader title="Sustainability Center" description="Analyze environmental impact." /><ArchTabs tabs={['LEED Analysis', 'IGBC Analysis', 'Carbon Footprint', 'Water Efficiency', 'Indoor Air Quality']} activeTab={t} onChange={setT} /><ArchSubModulePlaceholder title={t} /></div>;
}
export function ClashDetectionModule() {
  const [t, setT] = useState('Architectural vs Structural');
  return <div><ArchModuleHeader title="Clash Detection" description="Identify multi-disciplinary collisions." /><ArchTabs tabs={['Architectural vs Structural', 'Architectural vs MEP', 'MEP vs Structural', 'AI Clash Resolution', 'Clash Reports']} activeTab={t} onChange={setT} /><ArchSubModulePlaceholder title={t} /></div>;
}
export function DrawingMgmtModule() {
  const [t, setT] = useState('Plans');
  return <div><ArchModuleHeader title="Drawing Management" description="Manage sheets, plans, and details." /><ArchTabs tabs={['Plans', 'Elevations', 'Sections', 'Details', 'Schedules', 'Sheet Management']} activeTab={t} onChange={setT} /><ArchSubModulePlaceholder title={t} /></div>;
}
export function ArchAIMLModule() {
  const [t, setT] = useState('AI Architect Copilot');
  return (
    <div>
      <ArchModuleHeader title="AI & ML Center" description="Advanced AI models for architectural design." />
      <ArchTabs tabs={['AI Architect Copilot', 'AI Concept Designer', 'AI Floor Plan Generator', 'AI Model Validation', 'AI Green Building Advisor', 'AI Renderer', 'AI Building Code Checker']} activeTab={t} onChange={setT} />
      {t === 'AI Architect Copilot' ? <ArchCopilotInterface /> : <ArchSubModulePlaceholder title={t} />}
    </div>
  );
}

// Add remaining stubs rapidly
export function SitePlanModule() { return <ArchSubModulePlaceholder title="Site Planning" />; }
export function ParametricModule() { 
  return (
    <div>
      <ArchModuleHeader title="Parametric Modeling & Dynamo Engine" description="Author parametric visual scripts and Revit elements." />
      <RevitDynamoBuilder />
    </div>
  );
}
export function FurnitureModule() { return <ArchSubModulePlaceholder title="Furniture Library" />; }
export function LandscapeModule() { return <ArchSubModulePlaceholder title="Landscape Design" />; }
export function ExteriorVisModule() { return <ArchSubModulePlaceholder title="Exterior Visualization" />; }
export function LightingSimModule() { return <ArchSubModulePlaceholder title="Lighting Simulation" />; }
export function SunPathModule() { return <ArchSubModulePlaceholder title="Sun Path Analysis" />; }
export function WindFlowModule() { return <ArchSubModulePlaceholder title="Wind Flow Analysis" />; }
export function ThermalModule() { return <ArchSubModulePlaceholder title="Thermal Analysis" />; }
export function EnergyModule() { return <ArchSubModulePlaceholder title="Energy Analysis" />; }
export function AccessComplianceModule() { return <ArchSubModulePlaceholder title="Accessibility Compliance" />; }
export function DesignReviewModule() { return <ArchSubModulePlaceholder title="Design Review" />; }
export function DesignCollabModule() { return <ArchSubModulePlaceholder title="Design Collaboration" />; }
export function DocsCenterModule() { return <ArchSubModulePlaceholder title="Documentation Center" />; }
export function VersionControlModule() { return <ArchSubModulePlaceholder title="Version Control" />; }
export function ClientPresModule() { return <ArchSubModulePlaceholder title="Client Presentation Mode" />; }
export function VRARModule() { return <ArchSubModulePlaceholder title="VR/AR Preview" />; }
export function TwinPreviewModule() { return <ArchSubModulePlaceholder title="Digital Twin Preview" />; }
export function GISViewerModule() { return <ArchSubModulePlaceholder title="GIS Context Viewer" />; }
export function ArchReportsModule() { return <GoogleDocsReportGenerator portalRole="Architect & Design Lead" defaultProject="Skyline Towers - Phase 1" />; }
export function ArchApprovalModule() { return <ArchSubModulePlaceholder title="Approval Workflow" />; }
export function ArchNotifModule() { return <ArchSubModulePlaceholder title="Notifications" />; }
export function ArchSettingsModule() { return <ArchSubModulePlaceholder title="Settings" />; }
