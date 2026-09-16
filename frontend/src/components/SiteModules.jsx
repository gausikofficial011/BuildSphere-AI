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

export function SEModuleHeader({ title, description, actionText = "Action" }) {
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

export function SETabs({ tabs, activeTab, onChange }) {
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

function SESubModulePlaceholder({ title }) {
  return <PremiumPlaceholder title={title} />;
}

export function SECopilotInterface() {
  const [msgs, setMsgs] = useState([
    { role: 'assistant', text: 'Hello, Rohit! I am your AI Site Copilot. I can generate daily progress reports from your photos, detect safety violations, forecast material shortages, and answer questions about project drawings. What can I help you with on the site today?' }
  ]);
  const [inp, setInp] = useState('');

  const handleSend = () => {
    if(!inp.trim()) return;
    setMsgs([...msgs, { role: 'user', text: inp }]);
    setInp('');
    setTimeout(() => {
      setMsgs(prev => [...prev, { role: 'assistant', text: 'Processing field data... I analyzed your recent site photos and detected that 2 workers in Zone B are missing high-visibility vests. I have logged a near-miss safety incident and sent a notification to the Zone B supervisor. Would you like me to draft the daily safety report now?' }]);
    }, 1000);
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 250px)', backgroundColor: 'rgba(15, 23, 42, 0.7)', backdropFilter: 'blur(16px)', borderRadius: '0.75rem', border: '1px solid rgba(255, 255, 255, 0.1)', overflow: 'hidden' }}>
      <div style={{ padding: '1.5rem', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', backgroundColor: 'rgba(0, 0, 0, 0.2)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{ width: '40px', height: '40px', borderRadius: '0.5rem', backgroundColor: 'rgba(79, 70, 229, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#818cf8' }}>
          <Bot size={24} />
        </div>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', margin: 0, color: '#ffffff' }}>AI Site Copilot</h2>
          <p style={{ color: '#94a3b8', margin: 0, fontSize: '0.875rem' }}>Your real-time field execution companion</p>
        </div>
      </div>
      
      <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', display: 'flex', gap: '0.5rem', overflowX: 'auto', backgroundColor: 'rgba(0, 0, 0, 0.1)' }}>
        {['Generate Daily Report', 'Analyze safety in photos', 'Check drawing RFI status', 'Forecast cement usage', 'Verify work completion'].map(chip => (
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
            placeholder="Ask your site copilot..." 
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

/* SITE OPERATIONS */
export function DailySiteOperationsModule() {
  const [t, setT] = useState('Daily Site Diary');
  return <div><SEModuleHeader title="Daily Site Operations" description="Manage day-to-day site execution activities." /><SETabs tabs={['Daily Site Diary', 'Shift Planning', 'Morning Briefing', 'Toolbox Talks', 'Daily Target', 'Daily Progress Entry', 'End of Day Report', 'Site Activity Timeline']} activeTab={t} onChange={setT} /><SESubModulePlaceholder title={t} /></div>;
}

export function WorkExecutionModule() {
  const [t, setT] = useState('Activity Tracking');
  return <div><SEModuleHeader title="Work Execution Center" description="Track physical work completion by zones and trades." /><SETabs tabs={['Activity Tracking', 'Zone-wise Progress', 'Floor-wise Progress', 'Trade-wise Progress', 'Work Packages', 'Crew Assignments', 'Live Status Board', 'Work Completion Verification']} activeTab={t} onChange={setT} /><SESubModulePlaceholder title={t} /></div>;
}

export function TaskAssignmentModule() {
  const [t, setT] = useState('Assign Tasks');
  return <div><SEModuleHeader title="Task Assignment" description="Assign and monitor field tasks for supervisors." /><SETabs tabs={['Assign Tasks', 'Task Priority', 'Deadlines', 'Task Checklist', 'Progress Update', 'Comments', 'Attachments']} activeTab={t} onChange={setT} /><SESubModulePlaceholder title={t} /></div>;
}

export function CrewAttendanceModule() {
  const [t, setT] = useState('QR Attendance');
  return <div><SEModuleHeader title="Crew & Attendance Management" description="Manage labor attendance, shifts, and productivity." /><SETabs tabs={['Engineers', 'Workers', 'QR Attendance', 'Face Recognition Attendance', 'Shift Allocation', 'Crew Productivity', 'Overtime Tracking', 'Leave Status']} activeTab={t} onChange={setT} /><SESubModulePlaceholder title={t} /></div>;
}

export function MaterialManagementModule() {
  const [t, setT] = useState('Material Receipts');
  return <div><SEModuleHeader title="Material Management" description="Track material deliveries and consumption on site." /><SETabs tabs={['Material Requests', 'Material Receipts', 'Inventory', 'Consumption', 'Material Tracking', 'Low Stock Alerts', 'Waste Tracking']} activeTab={t} onChange={setT} /><SESubModulePlaceholder title={t} /></div>;
}

export function EquipmentManagementModule() {
  const [t, setT] = useState('Equipment Status');
  return <div><SEModuleHeader title="Equipment Management" description="Monitor machinery usage and breakdowns." /><SETabs tabs={['Equipment Status', 'Equipment Allocation', 'Fuel Monitoring', 'Maintenance Schedule', 'Breakdown Reports', 'Equipment Utilization']} activeTab={t} onChange={setT} /><SESubModulePlaceholder title={t} /></div>;
}

export function InspectionCenterModule() {
  const [t, setT] = useState('Civil Inspection');
  return <div><SEModuleHeader title="Inspection Center" description="Conduct structural, MEP, and material inspections." /><SETabs tabs={['Civil Inspection', 'Structural Inspection', 'MEP Inspection', 'Material Inspection', 'Safety Inspection', 'Equipment Inspection', 'AI Inspection Summary']} activeTab={t} onChange={setT} /><SESubModulePlaceholder title={t} /></div>;
}

export function QualityControlModule() {
  const [t, setT] = useState('QA/QC Checklist');
  return <div><SEModuleHeader title="Quality Control" description="Manage quality tests and non-conformance reports (NCR)." /><SETabs tabs={['QA/QC Checklist', 'Concrete Tests', 'Slump Test', 'Cube Test', 'Rebar Inspection', 'Finishing Inspection', 'NCR Management', 'Quality Analytics']} activeTab={t} onChange={setT} /><SESubModulePlaceholder title={t} /></div>;
}

export function SafetyManagementModule() {
  const [t, setT] = useState('PPE Compliance');
  return <div><SEModuleHeader title="Safety Management" description="Ensure site safety and monitor incidents." /><SETabs tabs={['PPE Compliance', 'Safety Checklist', 'Hazard Register', 'Near Miss Reports', 'Incident Reports', 'Emergency Contacts', 'AI Safety Monitoring']} activeTab={t} onChange={setT} /><SESubModulePlaceholder title={t} /></div>;
}

export function IssueDefectModule() {
  const [t, setT] = useState('Defect Register');
  return <div><SEModuleHeader title="Issue & Defect Tracking" description="Log and resolve site issues and defects." /><SETabs tabs={['Defect Register', 'Snag List', 'Resolution Tracking', 'Photo Evidence']} activeTab={t} onChange={setT} /><SESubModulePlaceholder title={t} /></div>;
}

export function RFIManagementModule() {
  const [t, setT] = useState('Raise RFI');
  return <div><SEModuleHeader title="RFI Management" description="Request for Information tracking." /><SETabs tabs={['Raise RFI', 'Track RFIs', 'Response Status', 'Attach Drawings', 'Priority Levels']} activeTab={t} onChange={setT} /><SESubModulePlaceholder title={t} /></div>;
}

export function PunchListModule() {
  const [t, setT] = useState('Punch Items');
  return <div><SEModuleHeader title="Punch List" description="Track outstanding items before handover." /><SETabs tabs={['Punch Items', 'Resolution Tracking', 'Photo Evidence', 'Sign-offs']} activeTab={t} onChange={setT} /><SESubModulePlaceholder title={t} /></div>;
}

export function ConstructionChecklistModule() {
  const [t, setT] = useState('Structural Checklist');
  return <div><SEModuleHeader title="Construction Checklist" description="Standardized checklists for construction phases." /><SETabs tabs={['Foundation Checklist', 'Structural Checklist', 'MEP Checklist', 'Finishing Checklist', 'Handover Checklist', 'Custom Checklists']} activeTab={t} onChange={setT} /><SESubModulePlaceholder title={t} /></div>;
}

/* MONITORING */
export function SiteProgressModule() {
  const [t, setT] = useState('Actual Progress');
  return <div><SEModuleHeader title="Site Progress Tracking" description="Visual tracking of physical completion." /><SETabs tabs={['Planned Progress', 'Actual Progress', 'Progress Photos', 'Progress Videos', 'Progress Timeline', 'Productivity Trends', 'AI Progress Validation']} activeTab={t} onChange={setT} /><SESubModulePlaceholder title={t} /></div>;
}

export function DroneMonitoringModule() {
  const [t, setT] = useState('Drone Images');
  return <div><SEModuleHeader title="Drone Site Monitoring" description="Aerial surveys and volume measurements." /><SETabs tabs={['Drone Images', 'Drone Videos', 'Site Comparison', 'Progress Detection', 'Volume Measurement', 'AI Site Analysis']} activeTab={t} onChange={setT} /><SESubModulePlaceholder title={t} /></div>;
}

export function WeatherMonitoringModule() {
  const [t, setT] = useState('Rain Forecast');
  return <div><SEModuleHeader title="Weather Monitoring" description="Track site weather conditions and impact." /><SETabs tabs={['Temperature', 'Rain Forecast', 'Wind Speed', 'Heat Index', 'AI Weather Alerts', 'Weather Impact Analysis']} activeTab={t} onChange={setT} /><SESubModulePlaceholder title={t} /></div>;
}

/* DOCUMENTS & REPORTS */
export function DocumentsCenterModule() {
  const [t, setT] = useState('All Documents');
  return (
    <div>
      <SEModuleHeader title="Documents Center & BIM Viewer" description="Access site drawings, models, and docs." />
      <SETabs tabs={['All Documents', '2D Drawings', 'Method Statements', 'Safety Documents']} activeTab={t} onChange={setT} />
      <DocumentCenter portalRole="Site Engineer" projectId={1} />
    </div>
  );
}

export function PhotoVideoModule() {
  const [t, setT] = useState('Daily Photos');
  return <div><SEModuleHeader title="Photo & Video Reports" description="Visual evidence of site progress." /><SETabs tabs={['Daily Photos', 'Before/After Photos', 'Video Documentation', 'AI Image Analysis', 'Progress Timeline']} activeTab={t} onChange={setT} /><SESubModulePlaceholder title={t} /></div>;
}

export function DailyReportsModule() {
  return <GoogleDocsReportGenerator portalRole="Site Engineer" defaultProject="Skyline Towers - Phase 1" />;
}

export function SEReportsModule() {
  return <GoogleDocsReportGenerator portalRole="Site Engineer" defaultProject="Skyline Towers - Phase 1" />;
}

/* AI & ML CENTER */
export function SEAIMLCenterModule() {
  const [t, setT] = useState('AI Site Copilot');
  return (
    <div>
      <SEModuleHeader title="AI & ML Center" description="Advanced predictive models and field AI assistants." />
      <SETabs tabs={['AI Site Copilot', 'AI Daily Report Generator', 'AI Progress Analyzer', 'Safety AI', 'Quality AI', 'Material AI', 'Equipment AI', 'BIM AI', 'Weather AI', 'Predictive Models', 'Computer Vision Models', 'Time Series Models', 'Recommendation Models', 'NLP Models']} activeTab={t} onChange={setT} />
      {t === 'AI Site Copilot' ? <SECopilotInterface /> : <SESubModulePlaceholder title={t} />}
    </div>
  );
}

export function SiteLogisticsModule() { return <SESubModulePlaceholder title="Site Logistics" />; }
export function SENotificationsModule() { return <NotificationsPanel />; }
export function ApprovalRequestsModule() {
  return <TaskManager portalRole="Site Engineer" projectId={1} />;
}
export function TeamCommunicationModule() {
  return <IssueTracker portalRole="Site Engineer" projectId={1} />;
}
export function OfflineSyncModule() { return <SESubModulePlaceholder title="Offline Sync" />; }
export function MobileSiteModeModule() { return <SESubModulePlaceholder title="Mobile Site Mode" />; }
export function SESettingsModule() { return <SESubModulePlaceholder title="Settings" />; }
