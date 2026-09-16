import React, { useState } from 'react';
import { PremiumPlaceholder } from './SharedUI';
import {
  Bot, Plus, Send, Layers, ShieldCheck, DollarSign, Activity, FileSpreadsheet,
  Scissors, Search, Sliders, Calendar, Award, Sparkles, FolderOpen
} from 'lucide-react';
import { GoogleDocsReportGenerator } from './GoogleDocsReportGenerator';
import { TaskManager } from './TaskManager';
import { IssueTracker } from './IssueTracker';
import { DailyLogForm } from './DailyLogForm';
import { DocumentCenter } from './DocumentCenter';
import { NotificationsPanel } from './NotificationsPanel';
import { ProjectKPIDashboard } from './ProjectKPIDashboard';
import { ThreeDViewer } from './ThreeDViewer';
import { BimEditor3D } from './bim-editor/BimEditor3D';
import { RevitDynamoBuilder } from './RevitDynamoBuilder';
import { DigitalTwinEngine } from './DigitalTwinEngine';
import Ai2DTo3DStudio from './Ai2DTo3DStudio';

// Rich Sub-modules
import { BimFloorPlan2DViewer } from './bim-modules/BimFloorPlan2DViewer';
import { BimObjectHierarchyInspector } from './bim-modules/BimObjectHierarchyInspector';
import { BimSectionElevationViewer } from './bim-modules/BimSectionElevationViewer';
import { BimClashMatrixCenter } from './bim-modules/BimClashMatrixCenter';
import { BimQuantityTakeoffEngine } from './bim-modules/BimQuantityTakeoffEngine';
import { Bim4DConstructionSimulator } from './bim-modules/Bim4DConstructionSimulator';
import { BimQualityScorecard } from './bim-modules/BimQualityScorecard';
import { BimCobieAssetManager } from './bim-modules/BimCobieAssetManager';
import { BimPointCloudViewer } from './bim-modules/BimPointCloudViewer';

export function BimModuleHeader({ title, description, actionText = "Action" }) {
  return (
    <div className="page-header" style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div className="page-title">
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, margin: '0 0 0.15rem 0', color: '#ffffff', letterSpacing: '-0.02em' }}>{title}</h1>
        <p style={{ fontSize: '0.85rem', margin: 0, color: '#94a3b8' }}>{description}</p>
      </div>
      <div className="header-actions">
        <button className="export-btn" style={{ padding: '6px 14px', fontSize: '0.8rem' }}>
          <Plus size={15} /> {actionText}
        </button>
      </div>
    </div>
  );
}

export function BimTabs({ tabs, activeTab, onChange }) {
  return (
    <div style={{ display: 'flex', gap: '1.25rem', borderBottom: '1px solid rgba(56, 189, 248, 0.15)', marginBottom: '1rem', overflowX: 'auto', paddingBottom: '1px' }}>
      {tabs.map(t => (
        <button 
          key={t}
          onClick={() => onChange(t)}
          style={{ 
            padding: '0.5rem 0', 
            background: 'none', border: 'none', 
            borderBottom: activeTab === t ? '2px solid #38bdf8' : '2px solid transparent',
            color: activeTab === t ? '#38bdf8' : '#94a3b8',
            fontWeight: activeTab === t ? 700 : 500,
            fontSize: '0.82rem', cursor: 'pointer', whiteSpace: 'nowrap',
            transition: 'all 0.15s ease'
          }}
        >
          {t}
        </button>
      ))}
    </div>
  );
}

function BimSubModulePlaceholder({ title }) {
  return <PremiumPlaceholder title={title} />;
}

export function BimCopilotInterface() {
  const [msgs, setMsgs] = useState([
    { role: 'assistant', text: 'Good Morning, Arun! I am your AI BIM Copilot. I can assist you with clash detection, federated model updates, LOD tracking, or generating COBie data. How can I help you today?' }
  ]);
  const [inp, setInp] = useState('');

  const handleSend = () => {
    if(!inp.trim()) return;
    setMsgs([...msgs, { role: 'user', text: inp }]);
    setInp('');
    setTimeout(() => {
      setMsgs(prev => [...prev, { role: 'assistant', text: 'I have analyzed the recent model update (v3.2). There are 12 new hard clashes between the HVAC ductwork (Level 4) and the Structural steel framing. I have automatically grouped them and assigned them to the MEP coordinator for review. Would you like me to generate a Navisworks viewpoint report?' }]);
    }, 1000);
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 210px)', backgroundColor: '#0f172a', borderRadius: '0.75rem', border: '1px solid rgba(56, 189, 248, 0.2)', overflow: 'hidden' }}>
      <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid #334155', backgroundColor: '#1e293b', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{ width: '40px', height: '40px', borderRadius: '0.5rem', backgroundColor: 'rgba(56, 189, 248, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#38bdf8' }}>
          <Bot size={24} />
        </div>
        <div>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 'bold', margin: 0, color: '#ffffff' }}>AI BIM Copilot</h2>
          <p style={{ color: '#94a3b8', margin: 0, fontSize: '0.8rem' }}>Your intelligent model coordinator</p>
        </div>
      </div>
      
      <div style={{ padding: '0.75rem 1.5rem', borderBottom: '1px solid #334155', display: 'flex', gap: '0.5rem', overflowX: 'auto', background: '#0b1120' }}>
        {['Run Clash Detection', 'Check Model Quality', 'Generate BOQ', 'Compare Models', 'Check LOD 350'].map(chip => (
          <button key={chip} onClick={() => setInp(chip)} style={{ padding: '0.4rem 0.8rem', borderRadius: '9999px', border: '1px solid #334155', backgroundColor: '#1e293b', color: '#e2e8f0', fontSize: '0.74rem', cursor: 'pointer', whiteSpace: 'nowrap' }}>
            {chip}
          </button>
        ))}
      </div>
      
      <div style={{ flex: 1, padding: '1.25rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem', backgroundColor: '#070b16' }}>
        {msgs.map((m, i) => (
          <div key={i} style={{ display: 'flex', gap: '0.75rem', alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start', maxWidth: '80%' }}>
            {m.role === 'assistant' && (
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', flexShrink: 0 }}>
                <Bot size={16} />
              </div>
            )}
            <div style={{ padding: '0.85rem 1rem', backgroundColor: m.role === 'user' ? '#0284c7' : '#1e293b', color: '#ffffff', borderRadius: '0.75rem', border: '1px solid rgba(56, 189, 248, 0.2)', fontSize: '0.82rem', lineHeight: '1.5' }}>
              {m.text}
            </div>
          </div>
        ))}
      </div>

      <div style={{ padding: '1rem 1.25rem', backgroundColor: '#0f172a', borderTop: '1px solid #334155' }}>
        <div style={{ display: 'flex', gap: '0.75rem', position: 'relative' }}>
          <input 
            type="text" 
            placeholder="Ask your BIM copilot anything about clashes, LOD, parameters, or BOQ..." 
            value={inp}
            onChange={e => setInp(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            style={{ flex: 1, padding: '0.75rem 1.25rem', backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '9999px', fontSize: '0.82rem', color: '#ffffff', outline: 'none' }}
          />
          <button 
            onClick={handleSend}
            style={{ width: '42px', height: '42px', borderRadius: '50%', backgroundColor: '#0284c7', color: 'white', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}

// Viewer Module with all 7 Interactive Sub-tabs
export function ViewerModule() {
  const [t, setT] = useState('AI 2D-to-3D Studio');
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <BimModuleHeader title="Multi-Discipline Model Viewer & AI BIM Studio" description="Explore federated 3D models, convert 2D floor plans into 3D structures, and inspect BIM elements." />
      <BimTabs tabs={['AI 2D-to-3D Studio', 'BIM Editor', 'Revit & Dynamo Builder', '3D Viewer', '2D Drawings', 'Object Inspector', 'Section Views']} activeTab={t} onChange={setT} />
      {t === 'AI 2D-to-3D Studio' ? <Ai2DTo3DStudio /> :
       t === 'BIM Editor' ? <BimEditor3D /> : 
       t === 'Revit & Dynamo Builder' ? <RevitDynamoBuilder /> : 
       t === '3D Viewer' ? <ThreeDViewer /> : 
       t === '2D Drawings' ? <BimFloorPlan2DViewer /> : 
       t === 'Object Inspector' ? <BimObjectHierarchyInspector /> : 
       t === 'Section Views' ? <BimSectionElevationViewer /> : 
       <BimSubModulePlaceholder title={t} />}
    </div>
  );
}

// Live Clash Detection Module
export function ClashModule() {
  const [t, setT] = useState('Live Clash Dashboard');
  return (
    <div>
      <BimModuleHeader title="Clash Detection & Coordination Center" description="Identify, inspect, and resolve geometric collisions across Architecture, Structure, and MEP." />
      <BimTabs tabs={['Live Clash Dashboard', 'Architecture vs Structure', 'MEP vs Structure', 'Resolution Workflow']} activeTab={t} onChange={setT} />
      <BimClashMatrixCenter />
    </div>
  );
}

// Quality & Standards Module
export function QualityModule() {
  const [t, setT] = useState('Model Validation');
  return (
    <div>
      <BimModuleHeader title="BIM Quality Control & ISO 19650" description="Automated geometric, spatial, and parameter rule validation." />
      <BimTabs tabs={['Model Validation', 'Geometry Validation', 'Parameter Validation', 'BIM Scorecard']} activeTab={t} onChange={setT} />
      <BimQualityScorecard />
    </div>
  );
}

// 5D Quantity Takeoff Module
export function QuantityTakeoffModule() {
  const [t, setT] = useState('Automated BOQ');
  return (
    <div>
      <BimModuleHeader title="5D Quantity Takeoff (QTO) & Cost Estimation" description="Real-time extraction of material volumes, component counts, unit rates, and embodied carbon." />
      <BimTabs tabs={['Automated BOQ', 'Trade Breakdown', 'Carbon Footprint (LCA)', 'Export Schedule']} activeTab={t} onChange={setT} />
      <BimQuantityTakeoffEngine />
    </div>
  );
}

// 4D Construction Phasing Module
export function Construction4DModule() {
  const [t, setT] = useState('Timeline Simulation');
  return (
    <div>
      <BimModuleHeader title="4D Construction Simulation & Phasing" description="Connect WBS construction schedules to BIM elements with interactive timeline playback." />
      <BimTabs tabs={['Timeline Simulation', 'Gantt Chart View', 'Trade Logistics', 'Milestone Milestones']} activeTab={t} onChange={setT} />
      <Bim4DConstructionSimulator />
    </div>
  );
}

// COBie Asset Management Module
export function CobieModule() {
  const [t, setT] = useState('COBie Records');
  return (
    <div>
      <BimModuleHeader title="COBie Asset Management Center" description="Manage building facility handover records and equipment schedules (NBIMS-US v3)." />
      <BimTabs tabs={['COBie Records', 'Component Sheet', 'Facility Sheet', 'FM Export']} activeTab={t} onChange={setT} />
      <BimCobieAssetManager />
    </div>
  );
}

// Point Cloud Module
export function PointCloudModule() {
  const [t, setT] = useState('LiDAR Scan-to-BIM');
  return (
    <div>
      <BimModuleHeader title="Point Cloud & LiDAR Processing" description="Process 3D laser scans, calculate as-built variances, and auto-extract parametric BIM elements." />
      <BimTabs tabs={['LiDAR Scan-to-BIM', 'Deviation Heatmap', 'Extracted Features', 'E57 / LAS Import']} activeTab={t} onChange={setT} />
      <BimPointCloudViewer />
    </div>
  );
}

// AI & ML Module
export function BimAIMLModule() {
  const [t, setT] = useState('AI BIM Copilot');
  return (
    <div>
      <BimModuleHeader title="AI & ML Engineering Center" description="Natural language engineering copilot and automated design optimization." />
      <BimTabs tabs={['AI BIM Copilot', 'Clash Prediction AI', 'Auto-Resolution', 'Model Optimizer', 'Quantity Predictor']} activeTab={t} onChange={setT} />
      {t === 'AI BIM Copilot' ? <BimCopilotInterface /> : <BimSubModulePlaceholder title={t} />}
    </div>
  );
}

// Command Center & CDE
export function BimCommandModule() {
  const [t, setT] = useState('Project Health');
  return <div><BimModuleHeader title="BIM Command Center" description="Central executive hub for BIM operations." /><BimTabs tabs={['Project Health', 'Team Activity', 'Live Coordination', 'KPIs']} activeTab={t} onChange={setT} /><ProjectKPIDashboard /></div>;
}
export function CdeModule() {
  const [t, setT] = useState('Document Repository');
  return <div><BimModuleHeader title="Common Data Environment (CDE)" description="Manage all project documentation, drawings, and federated models (ISO 19650)." /><BimTabs tabs={['Document Repository', 'BIM File Management', 'Version History', 'Approvals']} activeTab={t} onChange={setT} /><DocumentCenter /></div>;
}
export function FederatedModule() {
  const [t, setT] = useState('Live Federation');
  return <div><BimModuleHeader title="Federated BIM Models" description="Multi-disciplinary model federation across disciplines." /><BimTabs tabs={['Live Federation', 'Linked Models', 'Model Comparison', 'Navisworks Export']} activeTab={t} onChange={setT} /><ThreeDViewer /></div>;
}
export function BimCoordinationModule() {
  const [t, setT] = useState('Coordination Matrix');
  return <div><BimModuleHeader title="BIM Coordination Center" description="Manage inter-disciplinary coordination and issue resolution." /><BimTabs tabs={['Coordination Matrix', 'Meetings', 'Issue Tracking', 'Approvals']} activeTab={t} onChange={setT} /><IssueTracker /></div>;
}

export function BimStandardsModule() { return <BimQualityScorecard />; }
export function DocumentsModule() { return <DocumentCenter />; }
export function RfiModule() { return <IssueTracker />; }
export function DigitalTwinModule() { 
  const [t, setT] = useState('Digital Twin Telemetry');
  return (
    <div>
      <BimModuleHeader title="Digital Twin Integration" description="Bi-directional sensor sync and physical-to-virtual model tracking." />
      <BimTabs tabs={['Digital Twin Telemetry', 'IoT Sensor Network', 'As-Built Variance', 'Thermal Stress Heatmaps']} activeTab={t} onChange={setT} />
      {t === 'Digital Twin Telemetry' ? <DigitalTwinEngine /> : <BimSubModulePlaceholder title={t} />}
    </div>
  );
}
export function ReportsModule() { return <GoogleDocsReportGenerator portalRole="BIM Manager" defaultProject="Skyline Towers - Phase 1" />; }
export function SettingsModule() { return <BimSubModulePlaceholder title="Settings" />; }

export function IfcModule() {
  const [importedModels, setImportedModels] = useState([
    { id: 'IFC-01', name: 'Skyline_Tower_Architecture_v4.ifc', size: '42.8 MB', schema: 'IFC4 (ISO 16739-1)', entities: 14280, walls: 342, slabs: 48, columns: 216, status: 'Validated' },
    { id: 'IFC-02', name: 'Structural_Core_Phase2.ifc', size: '28.4 MB', schema: 'IFC2x3 Coordination View', entities: 9140, walls: 180, slabs: 24, columns: 312, status: 'Validated' },
    { id: 'IFC-03', name: 'MEP_HVAC_Plumbing_Distribution.ifc', size: '64.1 MB', schema: 'IFC4 Design Transfer', entities: 22400, walls: 0, slabs: 0, columns: 0, status: 'Validated' }
  ]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', color: '#f8fafc' }}>
      <BimModuleHeader title="IFC 4.3 OpenBIM Management Center" description="Import, validate, parse, and edit open standard IFC models (ISO 16739)." />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
        <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '10px', padding: '1rem' }}>
          <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Total IFC Models</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#38bdf8', marginTop: '4px' }}>{importedModels.length} Active</div>
          <div style={{ fontSize: '0.75rem', color: '#10b981', marginTop: '4px' }}>✓ 100% ISO 16739 Compliant</div>
        </div>
        <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '10px', padding: '1rem' }}>
          <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Parsed 3D Elements</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#a855f7', marginTop: '4px' }}>45,820</div>
          <div style={{ fontSize: '0.75rem', color: '#cbd5e1', marginTop: '4px' }}>Walls, Slabs, Columns & MEP</div>
        </div>
        <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '10px', padding: '1rem' }}>
          <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Current Schema</div>
          <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#10b981', marginTop: '8px' }}>IFC4.3 / IFC2x3</div>
          <div style={{ fontSize: '0.75rem', color: '#38bdf8', marginTop: '4px' }}>buildingSMART Certified</div>
        </div>
      </div>

      <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '12px', overflow: 'hidden' }}>
        <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid #334155', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontWeight: 700, fontSize: '1rem' }}>Active Federated IFC Models</span>
          <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Click an action to view or edit</span>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ background: '#0f172a', color: '#94a3b8', borderBottom: '1px solid #334155' }}>
                <th style={{ padding: '0.75rem 1.25rem' }}>Model File</th>
                <th style={{ padding: '0.75rem 1.25rem' }}>File Size</th>
                <th style={{ padding: '0.75rem 1.25rem' }}>Schema</th>
                <th style={{ padding: '0.75rem 1.25rem' }}>Entities</th>
                <th style={{ padding: '0.75rem 1.25rem' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {importedModels.map((m, idx) => (
                <tr key={m.id} style={{ borderBottom: idx !== importedModels.length - 1 ? '1px solid #334155' : 'none' }}>
                  <td style={{ padding: '1rem 1.25rem', fontWeight: 600, color: '#f8fafc' }}>
                    📦 {m.name}
                  </td>
                  <td style={{ padding: '1rem 1.25rem', color: '#94a3b8' }}>{m.size}</td>
                  <td style={{ padding: '1rem 1.25rem', color: '#38bdf8' }}>{m.schema}</td>
                  <td style={{ padding: '1rem 1.25rem', color: '#cbd5e1' }}>{m.entities.toLocaleString()}</td>
                  <td style={{ padding: '1rem 1.25rem' }}>
                    <span style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#10b981', padding: '4px 10px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 700 }}>
                      ✓ {m.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export function GisModule() { return <BimPointCloudViewer />; }
export function VersionControlModule() { return <DocumentCenter />; }
export function ApiModule() { return <BimSubModulePlaceholder title="API & Integrations" />; }
