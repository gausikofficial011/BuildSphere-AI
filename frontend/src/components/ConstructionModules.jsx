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

export function CMModuleHeader({ title, description, actionText = "Action" }) {
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

export function CMTabs({ tabs, activeTab, onChange }) {
  return (
    <div style={{ display: 'flex', gap: '2rem', borderBottom: '1px solid #e2e8f0', marginBottom: '1.5rem', overflowX: 'auto', paddingBottom: '1px' }}>
      {tabs.map(t => (
        <button 
          key={t}
          onClick={() => onChange(t)}
          style={{ 
            padding: '0.75rem 0', 
            background: 'none', border: 'none', 
            borderBottom: activeTab === t ? '2px solid #6366f1' : '2px solid transparent',
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

function CMSubModulePlaceholder({ title }) {
  return <PremiumPlaceholder title={title} />;
}

export function CMCopilotInterface() {
  const [msgs, setMsgs] = useState([
    { role: 'assistant', text: 'Good Morning, Arun! I am your AI Construction Copilot. I can analyze multi-zone progress, forecast cost overruns, recommend schedule recovery plans, and evaluate contractor performance. What executive insights do you need today?' }
  ]);
  const [inp, setInp] = useState('');

  const handleSend = () => {
    if(!inp.trim()) return;
    setMsgs([...msgs, { role: 'user', text: inp }]);
    setInp('');
    setTimeout(() => {
      setMsgs(prev => [...prev, { role: 'assistant', text: 'Based on the latest 4D schedule and 5D cost data, the delay in Zone B slab concrete is projected to push the milestone back by 4 days, incurring an estimated cost variance of ₹ 1.2 Cr. I recommend reallocating the finishing crew from Zone A to recover 2 days. Shall I draft the recovery plan?' }]);
    }, 1000);
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 250px)', backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
      <div style={{ padding: '1.5rem', borderBottom: '1px solid #e2e8f0', backgroundColor: 'rgba(255, 255, 255, 0.05)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{ width: '40px', height: '40px', borderRadius: '0.5rem', backgroundColor: '#e0e7ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6366f1' }}>
          <Bot size={24} />
        </div>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', margin: 0, color: '#ffffff' }}>AI Construction Copilot</h2>
          <p style={{ color: '#64748b', margin: 0, fontSize: '0.875rem' }}>Enterprise-level construction command center</p>
        </div>
      </div>
      
      <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid #e2e8f0', display: 'flex', gap: '0.5rem', overflowX: 'auto' }}>
        {['Analyze Zone B delay impact', 'Forecast Q3 cash flow', 'Evaluate contractor safety scores', 'Generate Board Report', 'Optimize resource allocation'].map(chip => (
          <button key={chip} onClick={() => setInp(chip)} style={{ padding: '0.5rem 1rem', borderRadius: '9999px', border: '1px solid #e2e8f0', backgroundColor: 'white', color: '#cbd5e1', fontSize: '0.75rem', cursor: 'pointer', whiteSpace: 'nowrap' }}>
            {chip}
          </button>
        ))}
      </div>
      
      <div style={{ flex: 1, padding: '1.5rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.5rem', backgroundColor: 'rgba(255, 255, 255, 0.05)' }}>
        {msgs.map((m, i) => (
          <div key={i} style={{ display: 'flex', gap: '1rem', alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start', maxWidth: '80%' }}>
            {m.role === 'assistant' && (
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', flexShrink: 0 }}>
                <Bot size={16} />
              </div>
            )}
            <div style={{ padding: '1rem', backgroundColor: m.role === 'user' ? '#6366f1' : 'white', color: m.role === 'user' ? 'white' : '#ffffff', borderRadius: '1rem', borderTopLeftRadius: m.role === 'assistant' ? 0 : '1rem', borderTopRightRadius: m.role === 'user' ? 0 : '1rem', boxShadow: '0 1px 2px rgba(0,0,0,0.05)', border: m.role === 'user' ? 'none' : '1px solid #e2e8f0', fontSize: '0.875rem', lineHeight: '1.5' }}>
              {m.text}
            </div>
          </div>
        ))}
      </div>

      <div style={{ padding: '1.5rem', backgroundColor: 'white', borderTop: '1px solid #e2e8f0' }}>
        <div style={{ display: 'flex', gap: '1rem', position: 'relative' }}>
          <input 
            type="text" 
            placeholder="Ask your command center copilot..." 
            value={inp}
            onChange={e => setInp(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            style={{ flex: 1, padding: '1rem 1.5rem', backgroundColor: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: '9999px', fontSize: '0.875rem', outline: 'none' }}
          />
          <button 
            onClick={handleSend}
            style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#6366f1', color: 'white', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.2s' }}
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}

// 40+ Modules
export function CommandCenterModule() {
  const [t, setT] = useState('Live Project Overview');
  return <div><CMModuleHeader title="Construction Command Center" description="Executive oversight of all construction zones." /><CMTabs tabs={['Live Project Overview', 'Multi-Site Monitoring', 'Zone-wise Progress', 'Floor-wise Progress', 'Building-wise Progress', 'Construction Heat Map', 'Live Activity Feed']} activeTab={t} onChange={setT} /><CMSubModulePlaceholder title={t} /></div>;
}
export function MultiZoneModule() {
  const [t, setT] = useState('Zone Dashboard');
  return <div><CMModuleHeader title="Multi-Zone Site Monitoring" description="Detailed progress breakdown by zone." /><CMTabs tabs={['Zone Dashboard', 'Building Dashboard', 'Floor Dashboard', 'Work Package Dashboard', 'Live Zone Status', 'Progress Heatmaps']} activeTab={t} onChange={setT} /><CMSubModulePlaceholder title={t} /></div>;
}
export function ProgressControlModule() {
  const [t, setT] = useState('S-Curve');
  return <div><CMModuleHeader title="Project Progress Control" description="Track physical progress against baselines." /><CMTabs tabs={['Daily Progress', 'Weekly Progress', 'Monthly Progress', 'S-Curve', 'Earned Value', 'Milestone Tracking', 'AI Progress Validation']} activeTab={t} onChange={setT} /><CMSubModulePlaceholder title={t} /></div>;
}
export function CMWorkforceModule() {
  const [t, setT] = useState('Workforce Tasks');
  return (
    <div>
      <CMModuleHeader title="Workforce Management" description="Enterprise workforce tracking." />
      <CMTabs tabs={['Workforce Tasks', 'Daily Attendance Log', 'Crew Allocation', 'Productivity Analysis']} activeTab={t} onChange={setT} />
      {t === 'Workforce Tasks' && <TaskManager portalRole="Construction Manager" projectId={1} />}
      {t === 'Daily Attendance Log' && <DailyLogForm portalRole="Construction Manager" projectId={1} />}
      {t !== 'Workforce Tasks' && t !== 'Daily Attendance Log' && <CMSubModulePlaceholder title={t} />}
    </div>
  );
}
export function ContractorModule() {
  const [t, setT] = useState('Contractor Dashboard');
  return <div><CMModuleHeader title="Contractor Management" description="Monitor principal contractors and performance." /><CMTabs tabs={['Contractor Dashboard', 'Contracts', 'Performance Score', 'Payment Status', 'Work Packages', 'Safety Compliance', 'AI Contractor Ranking']} activeTab={t} onChange={setT} /><CMSubModulePlaceholder title={t} /></div>;
}
export function SubcontractorModule() {
  const [t, setT] = useState('Trade Packages');
  return <div><CMModuleHeader title="Subcontractor Management" description="Manage specialized trade subcontractors." /><CMTabs tabs={['Trade Packages', 'Electrical', 'Plumbing', 'HVAC', 'Civil', 'Finishing', 'Progress & Quality Monitoring']} activeTab={t} onChange={setT} /><CMSubModulePlaceholder title={t} /></div>;
}
export function CMDailyOpsModule() {
  const [t, setT] = useState('Site Diary');
  return (
    <div>
      <CMModuleHeader title="Daily Operations Center" description="Aggregate daily site logs and diaries." actionText="Submit Site Log" />
      <CMTabs tabs={['Site Diary', 'Project KPIs', 'Activity Timeline', 'Equipment Logs', 'AI Daily Summary']} activeTab={t} onChange={setT} />
      {t === 'Site Diary' && <DailyLogForm portalRole="Construction Manager" projectId={1} />}
      {t === 'Project KPIs' && <ProjectKPIDashboard projectId={1} />}
      {t !== 'Site Diary' && t !== 'Project KPIs' && <CMSubModulePlaceholder title={t} />}
    </div>
  );
}
export function Scheduling4DModule() {
  const [t, setT] = useState('4D BIM Playback');
  return <div><CMModuleHeader title="Construction Scheduling (4D)" description="Master scheduling and sequence simulation." /><CMTabs tabs={['Interactive Gantt', '4D BIM Playback', 'Construction Sequence', 'Delay Analysis', 'Critical Path', 'Look Ahead Planning']} activeTab={t} onChange={setT} /><CMSubModulePlaceholder title={t} /></div>;
}
export function Cost5DModule() {
  const [t, setT] = useState('Budget Dashboard');
  return <div><CMModuleHeader title="Cost Monitoring (5D)" description="Real-time financial tracking and forecasting." /><CMTabs tabs={['Budget Dashboard', 'Cost Tracking', 'BOQ Monitoring', 'Material Costs', 'Labor Costs', 'Equipment Costs', 'Cash Flow Forecast']} activeTab={t} onChange={setT} /><CMSubModulePlaceholder title={t} /></div>;
}
export function CMResourceModule() {
  const [t, setT] = useState('Equipment');
  return <div><CMModuleHeader title="Resource Management" description="Enterprise resource allocation." /><CMTabs tabs={['Human Resources', 'Equipment', 'Materials', 'Vehicles', 'Tools', 'Warehouses']} activeTab={t} onChange={setT} /><CMSubModulePlaceholder title={t} /></div>;
}
export function EquipmentFleetModule() {
  const [t, setT] = useState('Fleet Tracking');
  return <div><CMModuleHeader title="Equipment Fleet Management" description="Track heavy machinery and utilization." /><CMTabs tabs={['Fleet Tracking', 'GPS Tracking', 'Maintenance', 'Fuel Monitoring', 'Utilization', 'Breakdown Reports']} activeTab={t} onChange={setT} /><CMSubModulePlaceholder title={t} /></div>;
}
export function CMMaterialModule() {
  const [t, setT] = useState('Material Inventory');
  return <div><CMModuleHeader title="Material Management" description="Track bulk materials and warehouse inventory." /><CMTabs tabs={['Material Inventory', 'Material Requests', 'Delivery Tracking', 'Warehouse Management', 'Consumption', 'Stock Forecast']} activeTab={t} onChange={setT} /><CMSubModulePlaceholder title={t} /></div>;
}
export function ProcurementModule() {
  const [t, setT] = useState('Purchase Orders');
  return <div><CMModuleHeader title="Procurement Coordination" description="Align procurement with construction schedule." /><CMTabs tabs={['Purchase Orders', 'Vendor Deliveries', 'RFQs', 'Material Forecast', 'Procurement Schedule', 'AI Procurement Insights']} activeTab={t} onChange={setT} /><CMSubModulePlaceholder title={t} /></div>;
}
import { RevitDynamoBuilder } from './RevitDynamoBuilder';
import { DigitalTwinEngine } from './DigitalTwinEngine';

export function CMBIMViewerModule() {
  const [t, setT] = useState('Revit & Dynamo Builder');
  return (
    <div>
      <CMModuleHeader title="BIM Construction Viewer & Revit Builder" description="Author 3D Revit construction elements manually and inspect site models." />
      <CMTabs tabs={['Revit & Dynamo Builder', 'BIM Viewer', 'Construction View', 'Clash Review', 'Model Comparison', 'As-Built Verification']} activeTab={t} onChange={setT} />
      {t === 'Revit & Dynamo Builder' ? <RevitDynamoBuilder /> : <CMSubModulePlaceholder title={t} />}
    </div>
  );
}
export function DigitalTwinModule() {
  const [t, setT] = useState('Digital Twin Telemetry');
  return (
    <div>
      <CMModuleHeader title="Digital Twin Monitoring & IoT Engine" description="Real-time sensor telemetry and physical-to-virtual model tracking." />
      <CMTabs tabs={['Digital Twin Telemetry', 'Live Building Status', 'Sensor Dashboard', 'Equipment Health', 'Energy Consumption']} activeTab={t} onChange={setT} />
      {t === 'Digital Twin Telemetry' ? <DigitalTwinEngine /> : <CMSubModulePlaceholder title={t} />}
    </div>
  );
}
export function CMSiteLogisticsModule() {
  const [t, setT] = useState('Crane Locations');
  return <div><CMModuleHeader title="Site Logistics Center" description="Manage physical site layout and logistics." /><CMTabs tabs={['Crane Locations', 'Material Storage', 'Temporary Roads', 'Vehicle Tracking', 'Site Access', 'Delivery Scheduling']} activeTab={t} onChange={setT} /><CMSubModulePlaceholder title={t} /></div>;
}

export function CMInspectionModule() {
  const [t, setT] = useState('Inspection Issues');
  return (
    <div>
      <CMModuleHeader title="Inspection Management" description="Quality inspections, NCRs and punch lists." />
      <CMTabs tabs={['Inspection Issues', 'NCR Register', 'Tasks', 'Documents']} activeTab={t} onChange={setT} />
      {t === 'Inspection Issues' && <IssueTracker portalRole="Construction Manager" projectId={1} defaultCategory="NCR" />}
      {t === 'NCR Register' && <IssueTracker portalRole="Construction Manager" projectId={1} defaultCategory="NCR" />}
      {t === 'Tasks' && <TaskManager portalRole="Construction Manager" projectId={1} />}
      {t === 'Documents' && <DocumentCenter portalRole="Construction Manager" projectId={1} />}
    </div>
  );
}
export function CMQualityModule() {
  const [t, setT] = useState('Snag List');
  return (
    <div>
      <CMModuleHeader title="Quality Assurance Center" description="Track quality defects, snags and corrective actions." />
      <CMTabs tabs={['Snag List', 'Quality Tasks', 'Documents']} activeTab={t} onChange={setT} />
      {t === 'Snag List' && <IssueTracker portalRole="Construction Manager" projectId={1} defaultCategory="Snag" />}
      {t === 'Quality Tasks' && <TaskManager portalRole="Construction Manager" projectId={1} />}
      {t === 'Documents' && <DocumentCenter portalRole="Construction Manager" projectId={1} />}
    </div>
  );
}
export function CMSafetyModule() {
  const [t, setT] = useState('Safety Issues');
  return (
    <div>
      <CMModuleHeader title="Safety Command Center" description="Track safety incidents, risks and compliance." />
      <CMTabs tabs={['Safety Issues', 'Risk Register', 'Safety Tasks', 'Documents']} activeTab={t} onChange={setT} />
      {t === 'Safety Issues' && <IssueTracker portalRole="Construction Manager" projectId={1} defaultCategory="Risk" />}
      {t === 'Risk Register' && <IssueTracker portalRole="Construction Manager" projectId={1} defaultCategory="Risk" />}
      {t === 'Safety Tasks' && <TaskManager portalRole="Construction Manager" projectId={1} />}
      {t === 'Documents' && <DocumentCenter portalRole="Construction Manager" projectId={1} />}
    </div>
  );
}
export function CMRiskModule() {
  return <IssueTracker portalRole="Construction Manager" projectId={1} defaultCategory="Risk" />;
}
export function CMIssueModule() {
  const [t, setT] = useState('All Issues');
  return (
    <div>
      <CMModuleHeader title="Issue & Defect Management" description="Central issue register across all categories." />
      <CMTabs tabs={['All Issues', 'RFIs', 'NCRs', 'Snags', 'Defects']} activeTab={t} onChange={setT} />
      {t === 'All Issues' && <IssueTracker portalRole="Construction Manager" projectId={1} />}
      {t === 'RFIs' && <IssueTracker portalRole="Construction Manager" projectId={1} defaultCategory="RFI" />}
      {t === 'NCRs' && <IssueTracker portalRole="Construction Manager" projectId={1} defaultCategory="NCR" />}
      {t === 'Snags' && <IssueTracker portalRole="Construction Manager" projectId={1} defaultCategory="Snag" />}
      {t === 'Defects' && <IssueTracker portalRole="Construction Manager" projectId={1} defaultCategory="Defect" />}
    </div>
  );
}
export function CMChangeOrderModule() {
  return <IssueTracker portalRole="Construction Manager" projectId={1} defaultCategory="Change Order" />;
}
export function CMRFIModule() {
  return <IssueTracker portalRole="Construction Manager" projectId={1} defaultCategory="RFI" />;
}
export function CMClientCoordModule() {
  const [t, setT] = useState('Client Issues');
  return (
    <div>
      <CMModuleHeader title="Client Coordination" description="Track client RFIs, change orders and action items." />
      <CMTabs tabs={['Client Issues', 'Action Items', 'Documents']} activeTab={t} onChange={setT} />
      {t === 'Client Issues' && <IssueTracker portalRole="Construction Manager" projectId={1} defaultCategory="RFI" />}
      {t === 'Action Items' && <TaskManager portalRole="Construction Manager" projectId={1} />}
      {t === 'Documents' && <DocumentCenter portalRole="Construction Manager" projectId={1} />}
    </div>
  );
}
export function CMVendorCoordModule() {
  const [t, setT] = useState('Vendor Issues');
  return (
    <div>
      <CMModuleHeader title="Vendor Coordination" description="Track vendor delivery issues and NCRs." />
      <CMTabs tabs={['Vendor Issues', 'Tasks', 'Documents']} activeTab={t} onChange={setT} />
      {t === 'Vendor Issues' && <IssueTracker portalRole="Construction Manager" projectId={1} defaultCategory="NCR" />}
      {t === 'Tasks' && <TaskManager portalRole="Construction Manager" projectId={1} />}
      {t === 'Documents' && <DocumentCenter portalRole="Construction Manager" projectId={1} />}
    </div>
  );
}
export function CMWeatherModule() { return <CMSubModulePlaceholder title="Weather Intelligence" />; }
export function CMDroneModule() { return <CMSubModulePlaceholder title="Drone Monitoring Center" />; }
export function CMIoTModule() { return <CMSubModulePlaceholder title="IoT Monitoring" />; }
export function CMDocumentModule() {
  return <DocumentCenter portalRole="Construction Manager" projectId={1} />;
}
export function CMMeetingModule() {
  const [t, setT] = useState('Meeting Tasks');
  return (
    <div>
      <CMModuleHeader title="Meeting & Collaboration" description="Track meeting action items and decisions." />
      <CMTabs tabs={['Meeting Tasks', 'Meeting Documents', 'Issues Raised']} activeTab={t} onChange={setT} />
      {t === 'Meeting Tasks' && <TaskManager portalRole="Construction Manager" projectId={1} />}
      {t === 'Meeting Documents' && <DocumentCenter portalRole="Construction Manager" projectId={1} />}
      {t === 'Issues Raised' && <IssueTracker portalRole="Construction Manager" projectId={1} />}
    </div>
  );
}
export function CMReportsModule() { return <GoogleDocsReportGenerator portalRole="Construction Manager" defaultProject="Skyline Towers - Phase 1" />; }

export function CMAIMLCenterModule() {
  const [t, setT] = useState('AI Construction Copilot');
  return (
    <div>
      <CMModuleHeader title="AI & ML Center" description="Enterprise AI models and predictive analytics." />
      <CMTabs tabs={['AI Construction Copilot', 'AI Construction Health Analyzer', 'Scheduling AI', 'Cost AI', 'Workforce AI', 'Equipment AI', 'Material AI', 'BIM AI', 'Safety AI', 'Quality AI', 'Digital Twin AI', 'Predictive Models', 'Computer Vision Models', 'Optimization Models', 'Time Series Models', 'Recommendation Models', 'NLP Models']} activeTab={t} onChange={setT} />
      {t === 'AI Construction Copilot' ? <CMCopilotInterface /> : <CMSubModulePlaceholder title={t} />}
    </div>
  );
}

export function CMNotificationsModule() { return <NotificationsPanel />; }
export function CMApprovalsModule() { return <CMSubModulePlaceholder title="Approvals Center" />; }
export function CMOfflineModule() { return <CMSubModulePlaceholder title="Offline Operations" />; }
export function CMMobileModule() { return <CMSubModulePlaceholder title="Mobile Construction Center" />; }
export function CMAPIModule() { return <CMSubModulePlaceholder title="API & Integrations" />; }
export function CMSettingsModule() { return <CMSubModulePlaceholder title="Dashboard Settings" />; }
