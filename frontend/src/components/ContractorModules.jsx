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

export function ContractorModuleHeader({ title, description, actionText = "Action" }) {
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

export function ContractorTabs({ tabs, activeTab, onChange }) {
  return (
    <div style={{ display: 'flex', gap: '2rem', borderBottom: '1px solid #334155', marginBottom: '1.5rem', overflowX: 'auto', paddingBottom: '1px' }}>
      {tabs.map(t => (
        <button 
          key={t}
          onClick={() => onChange(t)}
          style={{ 
            padding: '0.75rem 0', 
            background: 'none', border: 'none', 
            borderBottom: activeTab === t ? '2px solid #3b82f6' : '2px solid transparent',
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

function ContractorSubModulePlaceholder({ title }) {
  return <PremiumPlaceholder title={title} />;
}

export function ContractorCopilotInterface() {
  const [msgs, setMsgs] = useState([
    { role: 'assistant', text: 'Good Morning, Ramesh! I am your AI Construction Copilot. Heavy rain is expected tomorrow, which will impact concreting works and excavation. I recommend rescheduling the foundation pour and shifting the MEP crew to indoor ducting work. Should I update the Look-Ahead plan and notify the supervisors?' }
  ]);
  const [inp, setInp] = useState('');

  const handleSend = () => {
    if(!inp.trim()) return;
    setMsgs([...msgs, { role: 'user', text: inp }]);
    setInp('');
    setTimeout(() => {
      setMsgs(prev => [...prev, { role: 'assistant', text: 'Done. The 2-Week Look-Ahead plan has been updated. Concreting is shifted to Thursday. MEP teams have received automated SMS notifications with their revised task lists. Also, I noticed low inventory on safety harnesses, I will auto-draft a PR.' }]);
    }, 1000);
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 250px)', backgroundColor: 'rgba(15, 23, 42, 0.7)', backdropFilter: 'blur(16px)', borderRadius: '0.75rem', border: '1px solid rgba(255, 255, 255, 0.1)', overflow: 'hidden' }}>
      <div style={{ padding: '1.5rem', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', backgroundColor: 'rgba(0, 0, 0, 0.2)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{ width: '40px', height: '40px', borderRadius: '0.5rem', backgroundColor: 'rgba(59, 130, 246, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#93c5fd' }}>
          <Bot size={24} />
        </div>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', margin: 0, color: '#ffffff' }}>AI Construction Copilot</h2>
          <p style={{ color: '#94a3b8', margin: 0, fontSize: '0.875rem' }}>Your intelligent site operations and productivity assistant</p>
        </div>
      </div>
      
      <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', display: 'flex', gap: '0.5rem', overflowX: 'auto', backgroundColor: 'rgba(0, 0, 0, 0.1)' }}>
        {['Daily progress summary', 'Delay risk analysis', 'Material status', 'Workforce report', 'Safety report', 'Look-ahead plan'].map(chip => (
          <button key={chip} onClick={() => setInp(chip)} style={{ padding: '0.5rem 1rem', borderRadius: '9999px', border: '1px solid rgba(255, 255, 255, 0.1)', backgroundColor: 'rgba(255, 255, 255, 0.05)', color: '#cbd5e1', fontSize: '0.75rem', cursor: 'pointer', whiteSpace: 'nowrap' }}>
            {chip}
          </button>
        ))}
      </div>
      
      <div style={{ flex: 1, padding: '1.5rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {msgs.map((m, i) => (
          <div key={i} style={{ display: 'flex', gap: '1rem', alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start', maxWidth: '80%' }}>
            {m.role === 'assistant' && (
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', flexShrink: 0 }}>
                <Bot size={16} />
              </div>
            )}
            <div style={{ padding: '1rem', backgroundColor: m.role === 'user' ? '#3b82f6' : 'rgba(255, 255, 255, 0.05)', color: '#ffffff', borderRadius: '1rem', borderTopLeftRadius: m.role === 'assistant' ? 0 : '1rem', borderTopRightRadius: m.role === 'user' ? 0 : '1rem', border: m.role === 'user' ? 'none' : '1px solid rgba(255, 255, 255, 0.1)', fontSize: '0.875rem', lineHeight: '1.5' }}>
              {m.text}
            </div>
          </div>
        ))}
      </div>

      <div style={{ padding: '1.5rem', backgroundColor: 'rgba(0, 0, 0, 0.2)', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
        <div style={{ display: 'flex', gap: '1rem', position: 'relative' }}>
          <input 
            type="text" 
            placeholder="Type your question or instruction..." 
            value={inp}
            onChange={e => setInp(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            style={{ flex: 1, padding: '1rem 1.5rem', backgroundColor: 'rgba(0, 0, 0, 0.4)', border: '1px solid rgba(255, 255, 255, 0.15)', color: '#ffffff', borderRadius: '9999px', fontSize: '0.875rem', outline: 'none' }}
          />
          <button 
            onClick={handleSend}
            style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#3b82f6', color: 'white', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.2s' }}
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}

// Rapid stubs for all 50+ requested Contractor modules
export function ProjectExecutionModule() {
  const [activeTab, setActiveTab] = useState("Project Milestones");
  return (
    <div>
      <ContractorModuleHeader title="Project Execution Dashboard" description="Milestones and packages" />
      <ContractorTabs tabs={['Project Milestones', 'Current Phase', 'Package Completion', 'Daily Targets']} activeTab={activeTab} onChange={setActiveTab} />
      <ContractorSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function WorkPackagesModule() {
  const [activeTab, setActiveTab] = useState("Civil Works");
  return (
    <div>
      <ContractorModuleHeader title="Construction Work Packages" description="Discipline-wise execution" />
      <ContractorTabs tabs={['Civil Works', 'Structural Works', 'MEP Installation', 'Finishing Works']} activeTab={activeTab} onChange={setActiveTab} />
      <ContractorSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function DailyOperationsModule() {
  const [activeTab, setActiveTab] = useState("Daily Work Log");
  return (
    <div>
      <ContractorModuleHeader title="Daily Site Operations" description="Daily logs and conditions" />
      <ContractorTabs tabs={['Daily Work Log', 'Supervisor Notes', 'Weather Conditions', 'Shift Reports']} activeTab={activeTab} onChange={setActiveTab} />
      <ContractorSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function WorkforceManagementModule() {
  const [activeTab, setActiveTab] = useState("Employee Database");
  return (
    <div>
      <ContractorModuleHeader title="Workforce Management" description="Crews and planning" />
      <ContractorTabs tabs={['Employee Database', 'Crew Formation', 'Shift Planning', 'Overtime Management']} activeTab={activeTab} onChange={setActiveTab} />
      <ContractorSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function LabourAttendanceModule() {
  const [activeTab, setActiveTab] = useState("Face Recognition Attendance");
  return (
    <div>
      <ContractorModuleHeader title="Labour Attendance" description="Biometric and GPS tracking" />
      <ContractorTabs tabs={['Face Recognition Attendance', 'QR Attendance', 'GPS Attendance', 'RFID Attendance']} activeTab={activeTab} onChange={setActiveTab} />
      <ContractorSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function CrewAllocationModule() {
  const [activeTab, setActiveTab] = useState("Crew Assignment");
  return (
    <div>
      <ContractorModuleHeader title="Crew Allocation" description="Assignment and tracking" />
      <ContractorTabs tabs={['Crew Assignment', 'Productivity Tracking', 'Crew Utilization', 'Crew Performance']} activeTab={activeTab} onChange={setActiveTab} />
      <ContractorSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function ProductivityModule() {
  const [activeTab, setActiveTab] = useState("Labour Productivity");
  return (
    <div>
      <ContractorModuleHeader title="Productivity Dashboard" description="Output and efficiency" />
      <ContractorTabs tabs={['Labour Productivity', 'Equipment Productivity', 'Daily Output', 'Work Efficiency']} activeTab={activeTab} onChange={setActiveTab} />
      <ContractorSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function EquipmentManagementModule() {
  const [activeTab, setActiveTab] = useState("Equipment Allocation");
  return (
    <div>
      <ContractorModuleHeader title="Equipment Management" description="Health and allocation" />
      <ContractorTabs tabs={['Equipment Register', 'Equipment Allocation', 'Equipment Health', 'Fuel Usage']} activeTab={activeTab} onChange={setActiveTab} />
      <ContractorSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function HeavyMachineryModule() {
  const [activeTab, setActiveTab] = useState("Cranes");
  return (
    <div>
      <ContractorModuleHeader title="Heavy Machinery Tracking" description="Fleet monitoring" />
      <ContractorTabs tabs={['Cranes', 'Excavators', 'Bulldozers', 'Concrete Pumps']} activeTab={activeTab} onChange={setActiveTab} />
      <ContractorSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function MaterialManagementModule() {
  const [activeTab, setActiveTab] = useState("Material Inventory");
  return (
    <div>
      <ContractorModuleHeader title="Material Management" description="Stock and wastage" />
      <ContractorTabs tabs={['Material Inventory', 'Material Requests', 'Stock Monitoring', 'Wastage Tracking']} activeTab={activeTab} onChange={setActiveTab} />
      <ContractorSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function SubcontractorModule() {
  const [activeTab, setActiveTab] = useState("Performance Dashboard");
  return (
    <div>
      <ContractorModuleHeader title="Subcontractor Management" description="Performance and compliance" />
      <ContractorTabs tabs={['Subcontractor Register', 'Performance Dashboard', 'Billing Status', 'Safety Compliance']} activeTab={activeTab} onChange={setActiveTab} />
      <ContractorSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function WorkOrderModule() {
  const [activeTab, setActiveTab] = useState("Work Orders");
  return (
    <div>
      <ContractorModuleHeader title="Work Order Management" description="Task execution" />
      <ContractorTabs tabs={['Work Orders', 'Assignment', 'Completion', 'Approval']} activeTab={activeTab} onChange={setActiveTab} />
      <ContractorSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function TaskAssignmentModule() {
  const [activeTab, setActiveTab] = useState("Supervisor Tasks");
  return (
    <div>
      <ContractorModuleHeader title="Task Assignment Center" description="Priority and dependencies" />
      <ContractorTabs tabs={['Supervisor Tasks', 'Daily Activities', 'Priority Tasks', 'Task Dependencies']} activeTab={activeTab} onChange={setActiveTab} />
      <ContractorSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function DprModule() {
  const [activeTab, setActiveTab] = useState("DPR Generation");
  return (
    <div>
      <ContractorModuleHeader title="Daily Progress Reports" description="DPR generation and charts" />
      <ContractorTabs tabs={['DPR Generation', 'AI Auto Report', 'Progress Photos', 'Progress Charts']} activeTab={activeTab} onChange={setActiveTab} />
      <ContractorSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function SiteDiaryModule() {
  const [activeTab, setActiveTab] = useState("Daily Notes");
  return (
    <div>
      <ContractorModuleHeader title="Site Diary" description="Daily events and logs" />
      <ContractorTabs tabs={['Daily Notes', 'Visitor Log', 'Site Events', 'Delays']} activeTab={activeTab} onChange={setActiveTab} />
      <ContractorSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function ConstructionScheduleModule() {
  const [activeTab, setActiveTab] = useState("Gantt Charts");
  return (
    <div>
      <ContractorModuleHeader title="Construction Schedule" description="Gantt and milestones" />
      <ContractorTabs tabs={['Primavera Integration', 'MS Project Integration', 'Gantt Charts', 'Milestones']} activeTab={activeTab} onChange={setActiveTab} />
      <ContractorSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function LookAheadModule() {
  const [activeTab, setActiveTab] = useState("2 Week Look Ahead");
  return (
    <div>
      <ContractorModuleHeader title="Look-Ahead Planning" description="Short-term scheduling" />
      <ContractorTabs tabs={['2 Week Look Ahead', '4 Week Look Ahead', '6 Week Look Ahead']} activeTab={activeTab} onChange={setActiveTab} />
      <ContractorSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function DelayAnalysisModule() {
  const [activeTab, setActiveTab] = useState("Delay Reasons");
  return (
    <div>
      <ContractorModuleHeader title="Delay Analysis" description="Impact and recovery" />
      <ContractorTabs tabs={['Delay Reasons', 'Delay Impact', 'Recovery Plans', 'AI Delay Prediction']} activeTab={activeTab} onChange={setActiveTab} />
      <ContractorSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function CpmModule() {
  const [activeTab, setActiveTab] = useState("Critical Activities");
  return (
    <div>
      <ContractorModuleHeader title="Critical Path Monitoring" description="Float and risks" />
      <ContractorTabs tabs={['Critical Activities', 'Float Analysis', 'Schedule Risks']} activeTab={activeTab} onChange={setActiveTab} />
      <ContractorSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function BimConstructionModule() {
  const [activeTab, setActiveTab] = useState("Live 3D BIM");
  return (
    <div>
      <ContractorModuleHeader title="BIM Construction Viewer" description="Live 3D model overlays" />
      <ContractorTabs tabs={['Live 3D BIM', 'Section View', 'Object Inspection', 'Construction Overlay']} activeTab={activeTab} onChange={setActiveTab} />
      <ContractorSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function FourDSimulationModule() {
  const [activeTab, setActiveTab] = useState("Construction Animation");
  return (
    <div>
      <ContractorModuleHeader title="4D Construction Simulation" description="Timeline and sequencing" />
      <ContractorTabs tabs={['Construction Animation', 'Timeline Playback', 'Progress Simulation', 'Sequencing']} activeTab={activeTab} onChange={setActiveTab} />
      <ContractorSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function TwinMonitoringModule() {
  const [activeTab, setActiveTab] = useState("Live Site Model");
  return (
    <div>
      <ContractorModuleHeader title="Digital Twin Site Monitoring" description="Live site model" />
      <ContractorTabs tabs={['Live Site Model', 'Equipment Status', 'Sensor Data', 'Progress Overlay']} activeTab={activeTab} onChange={setActiveTab} />
      <ContractorSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function DroneMonitoringModule() {
  const [activeTab, setActiveTab] = useState("Orthomosaic Maps");
  return (
    <div>
      <ContractorModuleHeader title="Drone Progress Monitoring" description="Maps and volume calculation" />
      <ContractorTabs tabs={['Orthomosaic Maps', 'Progress Images', 'Volume Calculations', 'AI Site Comparison']} activeTab={activeTab} onChange={setActiveTab} />
      <ContractorSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function IotMonitoringModule() {
  const [activeTab, setActiveTab] = useState("Smart Sensors");
  return (
    <div>
      <ContractorModuleHeader title="IoT Construction Monitoring" description="Sensors and telemetry" />
      <ContractorTabs tabs={['Smart Sensors', 'Concrete Maturity Sensors', 'Environmental Sensors', 'Equipment Telemetry']} activeTab={activeTab} onChange={setActiveTab} />
      <ContractorSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function SafetyManagementModule() {
  const [activeTab, setActiveTab] = useState("Safety KPIs");
  return (
    <div>
      <ContractorModuleHeader title="Safety Management" description="KPIs and audits" />
      <ContractorTabs tabs={['Safety KPIs', 'Toolbox Talks', 'Safety Audits', 'Incident Reports']} activeTab={activeTab} onChange={setActiveTab} />
      <ContractorSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function PpeComplianceModule() {
  const [activeTab, setActiveTab] = useState("Helmet Detection");
  return (
    <div>
      <ContractorModuleHeader title="PPE Compliance Center" description="AI detection" />
      <ContractorTabs tabs={['Helmet Detection', 'Vest Detection', 'Safety Shoe Detection', 'Harness Detection']} activeTab={activeTab} onChange={setActiveTab} />
      <ContractorSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function PtwModule() {
  const [activeTab, setActiveTab] = useState("Hot Work");
  return (
    <div>
      <ContractorModuleHeader title="Permit-to-Work System" description="Safety permits" />
      <ContractorTabs tabs={['Hot Work', 'Excavation', 'Electrical', 'Confined Space']} activeTab={activeTab} onChange={setActiveTab} />
      <ContractorSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function IncidentManagementModule() {
  const [activeTab, setActiveTab] = useState("Near Miss");
  return (
    <div>
      <ContractorModuleHeader title="Incident Management" description="Root cause and actions" />
      <ContractorTabs tabs={['Near Miss', 'Accident Reports', 'Root Cause Analysis', 'Corrective Actions']} activeTab={activeTab} onChange={setActiveTab} />
      <ContractorSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function QaModule() {
  const [activeTab, setActiveTab] = useState("QA Plans");
  return (
    <div>
      <ContractorModuleHeader title="Quality Assurance (QA)" description="Plans and audits" />
      <ContractorTabs tabs={['QA Plans', 'Inspection Checklists', 'Quality Audits']} activeTab={activeTab} onChange={setActiveTab} />
      <ContractorSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function QcModule() {
  const [activeTab, setActiveTab] = useState("Concrete Tests");
  return (
    <div>
      <ContractorModuleHeader title="Quality Control (QC)" description="Testing and inspection" />
      <ContractorTabs tabs={['Concrete Tests', 'Steel Inspection', 'Welding Inspection', 'Material Testing']} activeTab={activeTab} onChange={setActiveTab} />
      <ContractorSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function InspectionModule() {
  const [activeTab, setActiveTab] = useState("Site Inspections");
  return (
    <div>
      <ContractorModuleHeader title="Inspection Management" description="Site inspections" />
      <ContractorTabs tabs={['Site Inspections', 'Client Inspections', 'Consultant Inspections', 'AI Inspection Reports']} activeTab={activeTab} onChange={setActiveTab} />
      <ContractorSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function PunchListModule() { return <IssueTracker portalRole="General Contractor Lead" projectId={1} defaultCategory="Snag" />; }
export function SnagModule() { return <IssueTracker portalRole="General Contractor Lead" projectId={1} defaultCategory="Snag" />; }
export function RfiManagementModule() { return <IssueTracker portalRole="General Contractor Lead" projectId={1} defaultCategory="RFI" />; }
export function NcrModule() { return <IssueTracker portalRole="General Contractor Lead" projectId={1} defaultCategory="NCR" />; }
export function DocumentCenterModule() { return <DocumentCenter portalRole="General Contractor Lead" projectId={1} />; }
export function DrawingManagementModule() { return <DocumentCenter portalRole="General Contractor Lead" projectId={1} />; }
export function ChangeOrderModule() { return <IssueTracker portalRole="General Contractor Lead" projectId={1} defaultCategory="Change Order" />; }
export function VariationTrackingModule() {
  const [activeTab, setActiveTab] = useState("Approved Variations");
  return (
    <div>
      <ContractorModuleHeader title="Variation Tracking" description="Approved and pending variations" />
      <ContractorTabs tabs={['Approved Variations', 'Pending Variations', 'Variation Costs']} activeTab={activeTab} onChange={setActiveTab} />
      <ContractorSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function BillingModule() {
  const [activeTab, setActiveTab] = useState("RA Bills");
  return (
    <div>
      <ContractorModuleHeader title="Billing & RA Bill Progress" description="Payment certificates" />
      <ContractorTabs tabs={['RA Bills', 'Payment Certificates', 'Client Approvals']} activeTab={activeTab} onChange={setActiveTab} />
      <ContractorSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function ClaimsModule() {
  const [activeTab, setActiveTab] = useState("Delay Claims");
  return (
    <div>
      <ContractorModuleHeader title="Claims Management" description="Delay and EOT claims" />
      <ContractorTabs tabs={['Delay Claims', 'Cost Claims', 'EOT Claims', 'Supporting Documents']} activeTab={activeTab} onChange={setActiveTab} />
      <ContractorSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function CostAwarenessModule() {
  const [activeTab, setActiveTab] = useState("Daily Cost");
  return (
    <div>
      <ContractorModuleHeader title="Cost Awareness Dashboard" description="Daily cost tracking" />
      <ContractorTabs tabs={['Labour Cost', 'Material Cost', 'Equipment Cost', 'Daily Cost']} activeTab={activeTab} onChange={setActiveTab} />
      <ContractorSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function ContractorProcurementModule() {
  const [activeTab, setActiveTab] = useState("Material Deliveries");
  return (
    <div>
      <ContractorModuleHeader title="Procurement Status" description="Deliveries and critical materials" />
      <ContractorTabs tabs={['Purchase Orders', 'Material Deliveries', 'Pending Items', 'Critical Materials']} activeTab={activeTab} onChange={setActiveTab} />
      <ContractorSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function ReportsModule() { return <GoogleDocsReportGenerator portalRole="General Contractor Lead" defaultProject="Skyline Towers - Phase 1" />; }

export function AiMlCenterModule() {
  const [t, setT] = useState('AI Construction Copilot');
  return (
    <div>
      <ContractorModuleHeader title="AI & ML Center" description="Site Intelligence" />
      <ContractorTabs tabs={['AI Construction Copilot', 'Construction AI', 'Safety AI', 'Productivity AI', 'Quality AI', 'BIM AI']} activeTab={t} onChange={setT} />
      {t === 'AI Construction Copilot' ? <ContractorCopilotInterface /> : <ContractorSubModulePlaceholder title={t} />}
    </div>
  );
}
