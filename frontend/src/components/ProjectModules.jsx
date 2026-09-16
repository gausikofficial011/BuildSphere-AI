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
import { ARVRBuildingViewer } from './ARVRBuildingViewer';

export function PMModuleHeader({ title, description, actionText = "Action" }) {
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

export function PMTabs({ tabs, activeTab, onChange }) {
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

function PMSubModulePlaceholder({ title }) {
  return <PremiumPlaceholder title={title} />;
}

export function PMCopilotInterface() {
  const [msgs, setMsgs] = useState([
    { role: 'assistant', text: 'Hello, Amit! I am your AI Project Copilot. I can summarize daily progress, predict delays, optimize schedules, forecast budgets, and generate client-ready reports. How can I assist you with Skyline Towers today?' }
  ]);
  const [inp, setInp] = useState('');

  const handleSend = () => {
    if(!inp.trim()) return;
    setMsgs([...msgs, { role: 'user', text: inp }]);
    setInp('');
    setTimeout(() => {
      setMsgs(prev => [...prev, { role: 'assistant', text: 'Analyzing project data... I have detected a high risk of delay in Steel Delivery due to vendor constraints. I recommend reallocating resources to the MEP Rough-in phase to maintain the overall critical path. Would you like me to draft an approval request?' }]);
    }, 1000);
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 250px)', backgroundColor: 'rgba(15, 23, 42, 0.7)', backdropFilter: 'blur(16px)', borderRadius: '0.75rem', border: '1px solid rgba(255, 255, 255, 0.1)', overflow: 'hidden' }}>
      <div style={{ padding: '1.5rem', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', backgroundColor: 'rgba(0, 0, 0, 0.2)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{ width: '40px', height: '40px', borderRadius: '0.5rem', backgroundColor: 'rgba(79, 70, 229, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#818cf8' }}>
          <Bot size={24} />
        </div>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', margin: 0, color: '#ffffff' }}>AI Project Copilot</h2>
          <p style={{ color: '#94a3b8', margin: 0, fontSize: '0.875rem' }}>Your dedicated AI assistant for Project Management</p>
        </div>
      </div>
      
      <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', display: 'flex', gap: '0.5rem', overflowX: 'auto', backgroundColor: 'rgba(0, 0, 0, 0.1)' }}>
        {['Summarize today\'s progress', 'Predict project delays', 'Optimize resource allocation', 'Forecast cash flow', 'Generate client report'].map(chip => (
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
            placeholder="Ask your project copilot..." 
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

// 1. Workspace
export function WorkspaceModule() {
  const [t, setT] = useState('Project Dashboard');
  return <div><PMModuleHeader title="Project Workspace" description="Central hub for project information and WBS." /><PMTabs tabs={['Project Dashboard', 'Project Information', 'Project Calendar', 'Project Timeline', 'Work Breakdown Structure (WBS)', 'Milestones', 'Deliverables', 'Dependencies', 'Critical Path', 'Project Notes']} activeTab={t} onChange={setT} /><PMSubModulePlaceholder title={t} /></div>;
}

// 2. Task Management
export function TaskManagementModule() {
  const [t, setT] = useState('Kanban Board');
  return <div><PMModuleHeader title="Task Management" description="Track and assign all project tasks." /><PMTabs tabs={['Kanban Board', 'Scrum Board', 'Gantt Tasks', 'Task Assignment', 'Priority Levels', 'Due Dates', 'Task Dependencies', 'Recurring Tasks', 'Task Checklists', 'Task Comments', 'File Attachments', 'Time Tracking', 'Task History', 'AI Task Suggestions']} activeTab={t} onChange={setT} /><PMSubModulePlaceholder title={t} /></div>;
}

// 3. Team Management
export function TeamManagementModule() {
  const [t, setT] = useState('Team Directory');
  return <div><PMModuleHeader title="Team Management" description="Manage site workers, engineers, and supervisors." /><PMTabs tabs={['Team Directory', 'Team Availability', 'Attendance', 'Shift Planning', 'Productivity Score', 'Workload Distribution', 'Skills Matrix', 'Certifications', 'Daily Reports']} activeTab={t} onChange={setT} /><PMSubModulePlaceholder title={t} /></div>;
}

// 4. Resource Management
export function ResourceManagementModule() {
  const [t, setT] = useState('Equipment');
  return <div><PMModuleHeader title="Resource Management" description="Allocate and monitor project resources." /><PMTabs tabs={['Equipment', 'Materials', 'Labor', 'Machinery', 'Vehicles', 'Tools', 'Availability', 'Utilization', 'Downtime', 'Maintenance']} activeTab={t} onChange={setT} /><PMSubModulePlaceholder title={t} /></div>;
}

// 5. Schedule (4D)
export function ScheduleManagementModule() {
  const [t, setT] = useState('Interactive Gantt Chart');
  return <div><PMModuleHeader title="Schedule Management (4D)" description="Time-based project modeling and delays." /><PMTabs tabs={['Interactive Gantt Chart', 'Critical Path', 'Resource Calendar', 'Delay Tracking', 'Baseline Comparison', 'Timeline Playback', 'Construction Simulation', 'Milestone Tracking', 'Float Analysis', 'AI Schedule Optimization']} activeTab={t} onChange={setT} /><PMSubModulePlaceholder title={t} /></div>;
}

// 6. Cost (5D)
export function CostMonitoringModule() {
  const [t, setT] = useState('Budget Dashboard');
  return <div><PMModuleHeader title="Cost Monitoring (5D)" description="Budget, BOQ, and real-time cost tracking." /><PMTabs tabs={['Budget Dashboard', 'Cost Tracking', 'BOQ Progress', 'Material Costs', 'Labor Costs', 'Equipment Costs', 'Cash Flow', 'Cost Variance', 'Forecast Costs', 'Payment Status', 'AI Cost Optimization']} activeTab={t} onChange={setT} /><PMSubModulePlaceholder title={t} /></div>;
}

// 7. BIM Coordination
export function BIMCoordinationModule() {
  const [t, setT] = useState('AR/VR Building View');
  return (
    <div>
      <PMModuleHeader title="Federated 3D BIM & AR/VR Coordination" description="3D model viewing, AR on-site pass-through, VR walkthroughs, and clash detection." />
      <PMTabs tabs={['AR/VR Building View', 'BIM Model Viewer', 'Clash Detection', 'Model Comparison', 'Version Control', 'IFC Validation', 'Coordination Issues', 'Quantity Extraction', 'AI BIM Review']} activeTab={t} onChange={setT} />
      {t === 'AR/VR Building View' || t === 'BIM Model Viewer' ? (
        <ARVRBuildingViewer portalRole="Project Delivery & Construction Manager" projectName="Skyline Towers - EPC Phase" />
      ) : (
        <PMSubModulePlaceholder title={t} />
      )}
    </div>
  );
}

// 8. Design Coordination
export function DesignCoordinationModule() {
  const [t, setT] = useState('Drawing Management');
  return <div><PMModuleHeader title="Design Coordination" description="Drawings, revisions, and markups." /><PMTabs tabs={['Drawing Management', 'Design Revisions', 'Approval Workflow', 'Markups', 'Comments', 'Design Change History', 'AI Design Review']} activeTab={t} onChange={setT} /><PMSubModulePlaceholder title={t} /></div>;
}

// 9. Construction Progress
export function ConstructionProgressModule() {
  const [t, setT] = useState('Daily Progress');
  return <div><PMModuleHeader title="Construction Progress" description="Track physical site progress via drones and photos." /><PMTabs tabs={['Daily Progress', 'Weekly Progress', 'Monthly Progress', 'Site Photos', 'Drone Reports', 'Progress Timeline', 'Earned Value', 'AI Progress Analysis']} activeTab={t} onChange={setT} /><PMSubModulePlaceholder title={t} /></div>;
}

// 10. Risk Management
export function RiskManagementModule() {
  const [t, setT] = useState('Risk Register');
  return <div><PMModuleHeader title="Risk Management" description="Identify and mitigate project risks." /><PMTabs tabs={['Risk Register', 'Risk Matrix', 'Risk Heat Map', 'Mitigation Plans', 'Risk Trends', 'AI Risk Prediction']} activeTab={t} onChange={setT} /><PMSubModulePlaceholder title={t} /></div>;
}

// 11. Issue Management
export function IssueManagementModule() {
  const [t, setT] = useState('Issue Register');
  return <div><PMModuleHeader title="Issue Management" description="Track and resolve project issues and punch lists." /><PMTabs tabs={['Issue Register', 'Issue Tracking', 'Defect Tracking', 'Punch List', 'Issue Assignments', 'Resolution Tracking']} activeTab={t} onChange={setT} /><PMSubModulePlaceholder title={t} /></div>;
}

// 12. Change Management
export function ChangeManagementModule() {
  const [t, setT] = useState('Change Requests');
  return <div><PMModuleHeader title="Change Management" description="Manage scope changes and variation orders." /><PMTabs tabs={['Change Requests', 'Variation Orders', 'Budget Impact', 'Schedule Impact', 'Approval Workflow', 'Change History']} activeTab={t} onChange={setT} /><PMSubModulePlaceholder title={t} /></div>;
}

// 13. Quality Management
export function QualityManagementModule() {
  const [t, setT] = useState('Inspection Reports');
  return <div><PMModuleHeader title="Quality Management" description="QA/QC checklists and inspections." /><PMTabs tabs={['Inspection Reports', 'Quality Checklists', 'NCR Management', 'Quality Audits', 'Material Testing', 'AI Quality Analytics']} activeTab={t} onChange={setT} /><PMSubModulePlaceholder title={t} /></div>;
}

// 14. Safety Management
export function SafetyManagementModule() {
  const [t, setT] = useState('Safety Dashboard');
  return <div><PMModuleHeader title="Safety Management" description="Monitor site safety, PPE compliance, and incidents." /><PMTabs tabs={['Safety Dashboard', 'PPE Compliance', 'Incident Reports', 'Toolbox Talks', 'Safety Audits', 'Hazard Register', 'AI Safety Monitoring']} activeTab={t} onChange={setT} /><PMSubModulePlaceholder title={t} /></div>;
}

// 15. Client Communication
export function ClientCommunicationModule() {
  const [t, setT] = useState('Client Meetings');
  return <div><PMModuleHeader title="Client Communication" description="Share updates and get approvals from the client." /><PMTabs tabs={['Client Meetings', 'RFIs', 'Approvals', 'Reports', 'Project Updates', 'AI Executive Summary']} activeTab={t} onChange={setT} /><PMSubModulePlaceholder title={t} /></div>;
}

// 16. Contractor Management
export function ContractorManagementModule() {
  const [t, setT] = useState('Contractor Performance');
  return <div><PMModuleHeader title="Contractor Management" description="Monitor sub-contractors on this specific project." /><PMTabs tabs={['Contractor Performance', 'Work Progress', 'Payments', 'Contracts', 'Attendance', 'Safety Score']} activeTab={t} onChange={setT} /><PMSubModulePlaceholder title={t} /></div>;
}

// 17. Vendor Coordination
export function VendorCoordinationModule() {
  const [t, setT] = useState('Vendor Deliveries');
  return <div><PMModuleHeader title="Vendor Coordination" description="Track material deliveries and vendor performance." /><PMTabs tabs={['Vendor Deliveries', 'Material Tracking', 'Purchase Orders', 'Vendor Performance', 'Delivery Delays']} activeTab={t} onChange={setT} /><PMSubModulePlaceholder title={t} /></div>;
}

// 18. Procurement Tracking
export function ProcurementTrackingModule() {
  const [t, setT] = useState('Purchase Requests');
  return <div><PMModuleHeader title="Procurement Tracking" description="Manage material requests and inventory." /><PMTabs tabs={['Purchase Requests', 'Purchase Orders', 'RFQs', 'Material Requests', 'Inventory Status', 'AI Procurement Insights']} activeTab={t} onChange={setT} /><PMSubModulePlaceholder title={t} /></div>;
}

// 19. Documents Center
export function DocumentsCenterModule() {
  const [t, setT] = useState('Drawings');
  return <div><PMModuleHeader title="Documents Center" description="Central repository for all project files." /><PMTabs tabs={['Drawings', 'Contracts', 'BOQ', 'RFIs', 'Submittals', 'Specifications', 'Reports', 'Photos', 'Videos', 'Meeting Minutes']} activeTab={t} onChange={setT} /><PMSubModulePlaceholder title={t} /></div>;
}

// 20. Meetings Center
export function MeetingsCenterModule() {
  const [t, setT] = useState('Calendar');
  return <div><PMModuleHeader title="Meetings Center" description="Schedule and track project meetings." /><PMTabs tabs={['Calendar', 'Meeting Notes', 'Action Items', 'Decisions', 'Attendance', 'AI Meeting Summary']} activeTab={t} onChange={setT} /><PMSubModulePlaceholder title={t} /></div>;
}

// 21. AI & ML Center
export function AIMLCenterModule() {
  const [t, setT] = useState('AI Project Copilot');
  return (
    <div>
      <PMModuleHeader title="AI & ML Center" description="Project-specific predictive AI models." />
      <PMTabs tabs={['AI Project Copilot', 'AI Project Health Analyzer', 'AI Delay Predictor', 'AI Critical Path Analyzer', 'AI Resource Optimizer', 'AI Schedule Optimizer', 'AI Cost Optimizer', 'AI Drone Analysis', 'Machine Learning Models', 'Predictive Models', 'Computer Vision Models', 'NLP Models', 'Recommendation Models', 'Risk & Anomaly Detection']} activeTab={t} onChange={setT} />
      {t === 'AI Project Copilot' ? <PMCopilotInterface /> : <PMSubModulePlaceholder title={t} />}
    </div>
  );
}

// 22. Reports & Analytics
export function ReportsAnalyticsModule() {
  return <GoogleDocsReportGenerator portalRole="Project Manager" defaultProject="Skyline Towers - Phase 1" />;
}

// 23. Digital Twin Monitoring
export function DigitalTwinMonitoringModule() {
  const [t, setT] = useState('Live Sensors');
  return <div><PMModuleHeader title="Digital Twin Monitoring" description="Monitor the live physical counterpart of the project." /><PMTabs tabs={['Live Sensors', 'Asset Health', 'Site Conditions', 'Twin Simulation']} activeTab={t} onChange={setT} /><PMSubModulePlaceholder title={t} /></div>;
}

// 24. GIS Project View
export function GISProjectViewModule() {
  const [t, setT] = useState('Project Map');
  return <div><PMModuleHeader title="GIS Project View" description="Geospatial mapping and topography of the site." /><PMTabs tabs={['Project Map', 'Terrain Data', 'Logistics Routes', 'Boundary Survey']} activeTab={t} onChange={setT} /><PMSubModulePlaceholder title={t} /></div>;
}

// 25. IoT Monitoring
export function IoTMonitoringModule() {
  const [t, setT] = useState('Equipment Sensors');
  return <div><PMModuleHeader title="IoT Monitoring" description="Connected devices and equipment sensors on site." /><PMTabs tabs={['Equipment Sensors', 'Environmental Sensors', 'Worker Wearables', 'Alerts']} activeTab={t} onChange={setT} /><PMSubModulePlaceholder title={t} /></div>;
}

// 26. Settings & Others
export function ProjectSettingsModule() {
  return <div><PMModuleHeader title="Project Settings" description="Configure project-specific workflows and preferences." /><PMSubModulePlaceholder title="Settings" /></div>;
}
