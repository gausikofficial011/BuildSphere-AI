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

export function PEModuleHeader({ title, description, actionText = "Action" }) {
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

export function PETabs({ tabs, activeTab, onChange }) {
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

function PESubModulePlaceholder({ title }) {
  return <PremiumPlaceholder title={title} />;
}

export function PECopilotInterface() {
  const [msgs, setMsgs] = useState([
    { role: 'assistant', text: 'Hello, Rahul! I am your AI Planning Copilot. I can generate WBS structures, optimize your critical path, run Monte Carlo simulations for schedule risk, and recommend delay recovery plans. How can I optimize the Skyline Towers schedule today?' }
  ]);
  const [inp, setInp] = useState('');

  const handleSend = () => {
    if(!inp.trim()) return;
    setMsgs([...msgs, { role: 'user', text: inp }]);
    setInp('');
    setTimeout(() => {
      setMsgs(prev => [...prev, { role: 'assistant', text: 'Running delay analysis on the structural sequence... I predict a 12-day delay on the 10th floor pour due to upcoming weather conditions. I recommend fast-tracking the formwork installation and allocating an extra crew starting next week to maintain the baseline finish date. Should I update the master schedule?' }]);
    }, 1000);
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 250px)', backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
      <div style={{ padding: '1.5rem', borderBottom: '1px solid #e2e8f0', backgroundColor: 'rgba(255, 255, 255, 0.05)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{ width: '40px', height: '40px', borderRadius: '0.5rem', backgroundColor: '#e0e7ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4f46e5' }}>
          <Bot size={24} />
        </div>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', margin: 0, color: '#ffffff' }}>AI Planning Copilot</h2>
          <p style={{ color: '#64748b', margin: 0, fontSize: '0.875rem' }}>Your dedicated AI assistant for Schedule Intelligence</p>
        </div>
      </div>
      
      <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid #e2e8f0', display: 'flex', gap: '0.5rem', overflowX: 'auto' }}>
        {['Analyze critical path', 'Run Monte Carlo simulation', 'Suggest recovery plan', 'Generate look-ahead report', 'Optimize resource leveling'].map(chip => (
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
            placeholder="Ask your planning copilot..." 
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

/* PLANNING WORKSPACE */
export function MasterScheduleModule() {
  const [t, setT] = useState('Enterprise Master Schedule');
  return <div><PEModuleHeader title="Master Project Schedule" description="The core timeline and activity hierarchy." /><PETabs tabs={['Enterprise Master Schedule', 'Multi-Project Planning', 'Activity Hierarchy', 'WBS', 'Milestones', 'Dependencies', 'Calendars', 'Activity Codes', 'Constraints', 'Baseline Comparison']} activeTab={t} onChange={setT} /><PESubModulePlaceholder title={t} /></div>;
}

export function WBSManagementModule() {
  const [t, setT] = useState('Unlimited WBS Levels');
  return <div><PEModuleHeader title="Work Breakdown Structure (WBS)" description="Detailed structural breakdown of project deliverables." /><PETabs tabs={['Unlimited WBS Levels', 'Drag & Drop', 'Activity Templates', 'Work Packages', 'Deliverables', 'Cost Codes', 'Resource Assignment', 'Progress Tracking']} activeTab={t} onChange={setT} /><PESubModulePlaceholder title={t} /></div>;
}

export function GanttPlanningModule() {
  const [t, setT] = useState('Interactive Gantt');
  return <div><PEModuleHeader title="Gantt Planning Center" description="Visual schedule manipulation and baseline overlays." /><PETabs tabs={['Interactive Gantt', 'Drag Activities', 'Zoom Levels', 'Baseline Overlay', 'Resource View', 'Dependency Lines', 'Milestones', 'Critical Path', 'Float Visualization']} activeTab={t} onChange={setT} /><PESubModulePlaceholder title={t} /></div>;
}

export function CriticalPathModule() {
  const [t, setT] = useState('CPM Network');
  return <div><PEModuleHeader title="Critical Path Management" description="Float analysis and longest path optimization." /><PETabs tabs={['CPM Network', 'Critical Activities', 'Near Critical Activities', 'Total Float', 'Free Float', 'Longest Path', 'Float Analysis', 'AI Critical Path Optimization']} activeTab={t} onChange={setT} /><PESubModulePlaceholder title={t} /></div>;
}

export function LookAheadModule() {
  const [t, setT] = useState('1 Week');
  return <div><PEModuleHeader title="Look Ahead Planning" description="Short-term execution planning and tracking." /><PETabs tabs={['1 Week', '2 Week', '3 Week', '6 Week', 'Monthly', 'Quarterly']} activeTab={t} onChange={setT} /><PESubModulePlaceholder title={t} /></div>;
}

export function BaselineModule() {
  const [t, setT] = useState('Original Baseline');
  return <div><PEModuleHeader title="Baseline Management" description="Manage and compare approved schedule baselines." /><PETabs tabs={['Original Baseline', 'Revised Baseline', 'Baseline Comparison', 'Baseline Approval', 'Baseline History']} activeTab={t} onChange={setT} /><PESubModulePlaceholder title={t} /></div>;
}

export function ProgressMonitoringModule() {
  const [t, setT] = useState('Daily Progress');
  return <div><PEModuleHeader title="Progress Monitoring" description="Track physical and financial progress vs baseline." /><PETabs tabs={['Daily Progress', 'Weekly Progress', 'Monthly Progress', 'Earned Value', 'S-Curve', 'Progress Photos', 'Drone Progress', 'Progress Validation']} activeTab={t} onChange={setT} /><PESubModulePlaceholder title={t} /></div>;
}

export function DelayAnalysisModule() {
  const [t, setT] = useState('Delay Register');
  return <div><PEModuleHeader title="Delay Analysis Center" description="Root cause analysis and recovery planning." /><PETabs tabs={['Delay Register', 'Root Cause Analysis', 'Delay Heatmap', 'Delay Forecast', 'Recovery Planning', 'Delay Responsibility', 'Extension of Time Analysis']} activeTab={t} onChange={setT} /><PESubModulePlaceholder title={t} /></div>;
}

/* RESOURCE PLANNING */
export function PEResourcePlanningModule() {
  const [t, setT] = useState('Resource Calendar');
  return <div><PEModuleHeader title="Resource Planning" description="Allocate engineers, workers, and machinery." /><PETabs tabs={['Resource Calendar', 'Resource Histogram', 'Resource Forecast', 'Resource Availability', 'AI Allocation']} activeTab={t} onChange={setT} /><PESubModulePlaceholder title={t} /></div>;
}

export function ResourceLevelingModule() {
  const [t, setT] = useState('Auto Leveling');
  return <div><PEModuleHeader title="Resource Leveling" description="Balance resource demand across the schedule." /><PETabs tabs={['Auto Leveling', 'Manual Leveling', 'AI Optimization', 'Conflict Detection', 'Resource Balance']} activeTab={t} onChange={setT} /><PESubModulePlaceholder title={t} /></div>;
}

export function LaborPlanningModule() {
  const [t, setT] = useState('Labor Forecast');
  return <div><PEModuleHeader title="Labor Planning" description="Crew optimization and productivity tracking." /><PETabs tabs={['Labor Forecast', 'Crew Planning', 'Shift Planning', 'Productivity Tracking', 'Attendance Forecast']} activeTab={t} onChange={setT} /><PESubModulePlaceholder title={t} /></div>;
}

export function EquipmentPlanningModule() {
  const [t, setT] = useState('Equipment Allocation');
  return <div><PEModuleHeader title="Equipment Planning" description="Crane positioning and machinery scheduling." /><PETabs tabs={['Equipment Allocation', 'Crane Planning', 'Machinery Utilization', 'Fuel Forecast', 'Maintenance Schedule']} activeTab={t} onChange={setT} /><PESubModulePlaceholder title={t} /></div>;
}

export function MaterialPlanningModule() {
  const [t, setT] = useState('Material Forecast');
  return <div><PEModuleHeader title="Material Planning" description="Inventory and delivery tracking." /><PETabs tabs={['Material Forecast', 'Procurement Schedule', 'Delivery Forecast', 'Inventory Levels', 'AI Material Planning']} activeTab={t} onChange={setT} /><PESubModulePlaceholder title={t} /></div>;
}

export function ProcurementScheduleModule() {
  const [t, setT] = useState('Purchase Timeline');
  return <div><PEModuleHeader title="Procurement Schedule" description="Align purchasing timelines with master schedule." /><PETabs tabs={['Purchase Timeline', 'Delivery Timeline', 'Vendor Timeline', 'Material Availability', 'Procurement Risks']} activeTab={t} onChange={setT} /><PESubModulePlaceholder title={t} /></div>;
}

/* BIM & SIMULATION */
export function ConstructionSequenceModule() {
  const [t, setT] = useState('Foundation Sequence');
  return <div><PEModuleHeader title="Construction Sequence Planning" description="Methodology and phasing of construction." /><PETabs tabs={['Foundation Sequence', 'Structural Sequence', 'MEP Sequence', 'Finishing Sequence', 'Commissioning Sequence']} activeTab={t} onChange={setT} /><PESubModulePlaceholder title={t} /></div>;
}

export function BIM4DModule() {
  const [t, setT] = useState('BIM Playback');
  return <div><PEModuleHeader title="4D BIM Simulation" description="Visual time-based modeling of the schedule." /><PETabs tabs={['BIM Playback', 'Construction Animation', 'Time Slider', 'Schedule Comparison', 'Clash Timeline', 'Resource Animation']} activeTab={t} onChange={setT} /><PESubModulePlaceholder title={t} /></div>;
}

export function SiteLogisticsModule() {
  const [t, setT] = useState('Crane Position');
  return <div><PEModuleHeader title="Site Logistics Planning" description="Spatial planning for temporary facilities and storage." /><PETabs tabs={['Crane Position', 'Material Storage', 'Temporary Roads', 'Site Offices', 'Safety Zones', 'Traffic Flow']} activeTab={t} onChange={setT} /><PESubModulePlaceholder title={t} /></div>;
}

/* ANALYTICS & CONTROL */
export function ProductivityAnalyticsModule() {
  const [t, setT] = useState('Crew Productivity');
  return <div><PEModuleHeader title="Productivity Analytics" description="Output rates and efficiency metrics." /><PETabs tabs={['Crew Productivity', 'Equipment Productivity', 'Activity Productivity', 'Daily Output', 'Weekly Output', 'AI Productivity Insights']} activeTab={t} onChange={setT} /><PESubModulePlaceholder title={t} /></div>;
}

export function ForecastingCenterModule() {
  const [t, setT] = useState('Completion Forecast');
  return <div><PEModuleHeader title="Forecasting Center" description="Predictive estimates for time and cost." /><PETabs tabs={['Completion Forecast', 'Delay Forecast', 'Cost Forecast', 'Resource Forecast', 'Material Forecast', 'Cash Flow Forecast']} activeTab={t} onChange={setT} /><PESubModulePlaceholder title={t} /></div>;
}

export function EVMModule() {
  const [t, setT] = useState('Planned Value (PV)');
  return <div><PEModuleHeader title="Earned Value Management" description="Standardized performance measurement (SPI/CPI)." /><PETabs tabs={['Planned Value (PV)', 'Earned Value (EV)', 'Actual Cost (AC)', 'CPI', 'SPI', 'BAC', 'EAC', 'ETC', 'VAC']} activeTab={t} onChange={setT} /><PESubModulePlaceholder title={t} /></div>;
}

export function ScheduleRiskModule() {
  const [t, setT] = useState('Risk Register');
  return <div><PEModuleHeader title="Schedule Risk Analysis" description="Probabilistic schedule risk modeling." /><PETabs tabs={['Risk Register', 'Monte Carlo Results', 'Probability Analysis', 'Risk Heatmap', 'Recovery Options']} activeTab={t} onChange={setT} /><PESubModulePlaceholder title={t} /></div>;
}

export function ConstraintModule() {
  const [t, setT] = useState('Design Constraints');
  return <div><PEModuleHeader title="Constraint Management" description="Manage external dependencies and blockers." /><PETabs tabs={['Design Constraints', 'Resource Constraints', 'Procurement Constraints', 'Client Constraints', 'Approval Constraints', 'Environmental Constraints']} activeTab={t} onChange={setT} /><PESubModulePlaceholder title={t} /></div>;
}

export function ChangeImpactModule() {
  const [t, setT] = useState('Schedule Impact');
  return <div><PEModuleHeader title="Change Impact Analysis" description="Evaluate the effect of scope variations." /><PETabs tabs={['Schedule Impact', 'Cost Impact', 'Resource Impact', 'Critical Path Impact']} activeTab={t} onChange={setT} /><PESubModulePlaceholder title={t} /></div>;
}

export function WeatherPlanningModule() {
  const [t, setT] = useState('Weather Forecast');
  return <div><PEModuleHeader title="Weather Planning" description="Integrate weather delays into the schedule." /><PETabs tabs={['Weather Forecast', 'Rain Delay Prediction', 'Heat Index', 'Wind Alerts', 'AI Weather Scheduling']} activeTab={t} onChange={setT} /><PESubModulePlaceholder title={t} /></div>;
}

export function PEReportsModule() {
  return <GoogleDocsReportGenerator portalRole="Planning Engineer" defaultProject="Skyline Towers - Phase 1" />;
}

export function PEAIMLCenterModule() {
  const [t, setT] = useState('AI Planning Copilot');
  return (
    <div>
      <PEModuleHeader title="AI & ML Center" description="Advanced predictive models and AI assistants." />
      <PETabs tabs={['AI Planning Copilot', 'AI Schedule Generator', 'AI Activity Sequencer', 'AI WBS Generator', 'AI Milestone Planner', 'AI Resource Planner', 'AI Look Ahead Planner', 'Forecast AI', 'BIM Planning AI', 'Productivity AI', 'Risk AI', 'Procurement AI', 'Machine Learning Models', 'Predictive Models', 'Optimization Models', 'Time Series Models', 'Simulation Models', 'Computer Vision Models', 'NLP Models']} activeTab={t} onChange={setT} />
      {t === 'AI Planning Copilot' ? <PECopilotInterface /> : <PESubModulePlaceholder title={t} />}
    </div>
  );
}

// Stubs for remaining typical components just so they render when clicked in the sidebar
export function PEDocumentModule() { return <PESubModulePlaceholder title="Document Center" />; }
export function PECollaborationModule() { return <PESubModulePlaceholder title="Collaboration Center" />; }
export function PEApprovalModule() { return <PESubModulePlaceholder title="Approval Workflow" />; }
export function PESettingsModule() { return <PESubModulePlaceholder title="Planning Settings" />; }
