import React, { useState } from 'react';
import {
  Activity,
  AlertCircle,
  Bot,
  Building2,
  Camera,
  CheckCircle2,
  FileSignature,
  FileText,
  HardHat,
  Layers,
  Scan,
  Settings,
  ShieldAlert,
  ShieldCheck,
  TrendingUp,
  Wrench
} from 'lucide-react';
import CyberPortalLayout from '../components/CyberPortalLayout';
import {
  InspAssignedModule, InspCalendarModule, InspSiteModule, InspChecklistsModule,
  InspBimModule, InspDigitalTwinModule, InspDroneModule, InspAiVisualModule,
  InspMaterialModule, InspEquipModule, InspSafetyModule, InspNcrModule,
  InspDefectModule, InspPunchModule, InspCapaModule, InspReportsModule,
  InspDocsModule, InspApprovalsModule, InspAiCenterModule
} from '../components/InspectorModules';

export default function InspectorDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const navGroups = [
    {
      title: 'SITE AUDITS & QA/QC',
      color: 'pink',
      items: [
        { id: 'assigned', label: 'Assigned Field Inspections', icon: ClipboardListIcon },
        { id: 'checklists', label: 'Digital QA/QC Checklists', icon: CheckCircle2 },
        { id: 'site', label: 'Live Field Inspection Mode (GPS)', icon: Scan },
        { id: 'materials', label: 'Material Sampling & Lab Tests', icon: Layers },
        { id: 'safety', label: 'HSE Safety & Scaffolding Audits', icon: HardHat },
        { id: 'punch', label: 'Snags, Defects & Punch Lists', icon: Wrench },
        { id: 'reports', label: 'Official Inspection Certificates', icon: FileText },
        { id: 'settings', label: 'Settings', icon: Settings },
      ]
    },
    {
      title: 'DEFECTS & AI VISION',
      color: 'cyan',
      items: [
        { id: 'ai', label: 'AI Visual Defect Copilot', icon: Bot, badge: 'NEW' },
        { id: 'aivision', label: 'Computer Vision Crack & Spall Detection', icon: Camera },
        { id: 'ncr', label: 'Non-Conformance Reports (NCR)', icon: ShieldAlert },
        { id: 'capa', label: 'Corrective Action Plan (CAPA)', icon: ShieldCheck },
      ]
    }
  ];

  function ClipboardListIcon(props) {
    return <FileSignature {...props} />;
  }

  const kpiCards = [
    { title: 'Total Site Inspections', value: '142 Audits', trend: '↑ 18.5% vs last month', icon: CheckCircle2, color: 'pink' },
    { title: 'Pass Rate on First Visit', value: '94.2%', trend: 'High Trade Quality', icon: ShieldCheck, color: 'cyan' },
    { title: 'Open Non-Conformances', value: '3 Minor NCRs', trend: 'Zero Structural Critical', icon: ShieldAlert, color: 'purple' },
    { title: 'Digital QA Checklists', value: '100% Mobile', trend: 'Geo-Tagged & Timestamped', icon: Camera, color: 'magenta' },
  ];

  const telemetryCards = [
    { title: 'Today\'s Inspections', value: '8 Scheduled', trend: '4 Completed (100% Pass)', icon: CheckCircle2, color: 'cyan' },
    { title: 'Concrete Cube Tests', value: '48 Batches', trend: 'Avg 42.4 MPa (M40 Spec)', icon: Layers, color: 'purple' },
    { title: 'AI Crack Scans Done', value: '120 Photos', trend: '0.05mm Micro-Crack Res', icon: Camera, color: 'magenta' },
    { title: 'Rebar Cover Audits', value: '50mm Clear', trend: 'Cover Meter Verified', icon: Scan, color: 'teal' },
    { title: 'WIR Turnaround Time', value: '2.4 Hours', trend: 'Instant Mobile Signoff', icon: FileSignature, color: 'cyan' },
    { title: 'Closed Punch Items', value: '18 Closed', trend: 'This Week', icon: Wrench, color: 'teal' },
    { title: 'Safety Stop Notices', value: '0 Active', trend: 'Zero HSE Violations', icon: HardHat, color: 'magenta' },
    { title: 'AI Vision Accuracy', value: '99.4%', trend: 'Deep Neural Net Defect', icon: Bot, color: 'magenta' },
  ];

  const platformOverview = {
    title: 'Discipline-Wise Inspection Breakdown',
    subtitle: 'QA/QC inspections performed across engineering trades',
    totalCount: '142',
    totalLabel: 'INSPECTIONS',
    items: [
      { name: 'Civil & RCC Structural Framing', count: '58 Audits', percent: '40.8%', color: 'green' },
      { name: 'MEP Electrical, HVAC & Plumbing', count: '42 Audits', percent: '29.6%', color: 'yellow' },
      { name: 'Finishing, Screed & Waterproofing', count: '24 Audits', percent: '16.9%', color: 'purple' },
      { name: 'HSE Scaffolding & Fall Arrest', count: '12 Audits', percent: '8.5%', color: 'cyan' },
      { name: 'External Infrastructure & Drainage', count: '6 Audits', percent: '4.2%', color: 'pink' },
    ]
  };

  const statusList = {
    title: 'Field Work Inspection Requests (WIR)',
    viewAllTab: 'assigned',
    items: [
      { name: 'WIR-482: Level 18 Shear Wall Rebar & Spacers', status: 'Passed (Green)', badgeClass: 'active' },
      { name: 'WIR-483: Basement 2 Chiller Water Pipe Hydro Test', status: 'Passed (12 bar)', badgeClass: 'active' },
      { name: 'WIR-484: Podium Deck Waterproofing Membrane Pond Test', status: 'In Progress (48h)', badgeClass: 'training' },
      { name: 'WIR-485: Fire Pump House Diesel Engine Start Test', status: 'Passed (100%)', badgeClass: 'deploying' },
      { name: 'WIR-486: Facade DGU Bracket Pull-Out Torque Test', status: 'Testing (5.2 kN)', badgeClass: 'testing' },
    ]
  };

  const recentActivities = {
    title: 'QA/QC Field Inspection Stream',
    viewAllTab: 'assigned',
    items: [
      { icon: CheckCircle2, text: "Level 18 floor slab pre-pour inspection approved on mobile tablet", time: '10:15 AM', color: 'purple' },
      { icon: Camera, text: 'AI Computer Vision scanned 45m² concrete surface: zero honeycombing detected', time: '09:42 AM', color: 'cyan' },
      { icon: Bot, text: 'AI Inspector Copilot flagged missing thermal insulation on chilled water valve', time: '09:30 AM', color: 'green' },
      { icon: ShieldCheck, text: 'Core compressive strength Schmidt Hammer rebound test verified at 44.8 MPa', time: '08:55 AM', color: 'blue' },
      { icon: FileSignature, text: 'Field Inspection Certificate digitally signed and dispatched to Project Mgr', time: '08:30 AM', color: 'red' },
    ]
  };

  const scoreGauge = {
    title: 'Site Quality & QA/QC Rating',
    score: '98',
    scoreMax: '/100',
    scoreLabel: 'QA/QC SCORE',
    statusText: 'Six-Sigma',
    viewAllTab: 'reports',
    breakdown: [
      { name: 'Inspections Passed 1st Visit', num: '134 Audits', color: 'green' },
      { name: 'Minor Punch List Items', num: '8 Audits', color: 'yellow' },
      { name: 'Open Non-Conformances', num: '0 Audits', color: 'purple' },
      { name: 'Work Rejections', num: '0 Audits', color: 'red' },
    ],
    footerText: 'Inspection Standard: ISO 9001:2015 / IS 456 / NBC QA Protocol',
    safeText: '🛡 100% Quality Conformance'
  };

  return (
    <CyberPortalLayout
      portalName="QA/QC Inspector"
      portalSubtitle="FIELD INSPECTION, QA/QC & AUDIT PORTAL"
      userName="Robert Sterling"
      userRole="Lead Senior QA/QC Field Inspector"
      userAvatar="https://i.pravatar.cc/150?img=54"
      navGroups={navGroups}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      copilotTitle="AI Visual Defect Copilot"
      copilotDesc="Ask me anything about concrete slump standards, NDT testing & field checklists"
      copilotTabId="ai"
      kpiCards={kpiCards}
      telemetryCards={telemetryCards}
      platformOverview={platformOverview}
      statusList={statusList}
      recentActivities={recentActivities}
      scoreGauge={scoreGauge}
    >
      {activeTab === 'assigned' && <InspAssignedModule />}
      {activeTab === 'checklists' && <InspChecklistsModule />}
      {activeTab === 'site' && <InspSiteModule />}
      {activeTab === 'materials' && <InspMaterialModule />}
      {activeTab === 'safety' && <InspSafetyModule />}
      {activeTab === 'punch' && <InspPunchModule />}
      {activeTab === 'reports' && <InspReportsModule />}
      {activeTab === 'settings' && <InspDocsModule />}
      {activeTab === 'ai' && <InspAiCenterModule />}
      {activeTab === 'aivision' && <InspAiVisualModule />}
      {activeTab === 'ncr' && <InspNcrModule />}
      {activeTab === 'capa' && <InspCapaModule />}
    </CyberPortalLayout>
  );
}
