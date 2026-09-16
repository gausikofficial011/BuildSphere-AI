import React, { useState } from 'react';
import {
  Activity,
  AlertCircle,
  Bot,
  Building2,
  CheckCircle2,
  Clock,
  DollarSign,
  FileSignature,
  FileText,
  HardHat,
  Layers,
  Package,
  Receipt,
  Settings,
  ShieldAlert,
  ShieldCheck,
  TrendingUp,
  Truck,
  Users,
  Wallet
} from 'lucide-react';
import CyberPortalLayout from '../components/CyberPortalLayout';
import {
  ProjectExecutionModule, WorkPackagesModule, DailyOperationsModule, WorkforceManagementModule,
  LabourAttendanceModule, CrewAllocationModule, ProductivityModule, EquipmentManagementModule,
  HeavyMachineryModule, MaterialManagementModule, SubcontractorModule, WorkOrderModule,
  TaskAssignmentModule, DprModule, SiteDiaryModule, ConstructionScheduleModule, LookAheadModule,
  DelayAnalysisModule, CpmModule, BimConstructionModule, FourDSimulationModule, TwinMonitoringModule,
  DroneMonitoringModule, IotMonitoringModule, SafetyManagementModule, PpeComplianceModule, PtwModule,
  IncidentManagementModule, QaModule, QcModule, InspectionModule, PunchListModule, SnagModule,
  RfiManagementModule, NcrModule, DocumentCenterModule, DrawingManagementModule, ChangeOrderModule,
  VariationTrackingModule, BillingModule, ClaimsModule, CostAwarenessModule, ContractorProcurementModule,
  ReportsModule, AiMlCenterModule
} from '../components/ContractorModules';

export default function ContractorManager() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const navGroups = [
    {
      title: 'SITE OPERATIONS & EXECUTION',
      color: 'pink',
      items: [
        { id: 'execution', label: 'General Contractor Dashboard', icon: HardHat },
        { id: 'packages', label: 'Work Packages & Work Orders', icon: Layers },
        { id: 'workforce', label: 'Manpower & Biometric Attendance', icon: Users },
        { id: 'equipment', label: 'Cranes, Batching Plant & Machinery', icon: Truck },
        { id: 'dpr', label: 'Daily Progress Reports (DPR)', icon: FileText },
        { id: 'schedule', label: 'CPM 3-Week Lookahead Schedule', icon: Clock },
        { id: 'subcontracts', label: 'Subcontractor Trade Allocations', icon: Building2 },
        { id: 'billing', label: 'RA Billing & Measurement Books', icon: Receipt },
        { id: 'reports', label: 'Site Production & Cost Reports', icon: FileText },
        { id: 'settings', label: 'Settings', icon: Settings },
      ]
    },
    {
      title: 'HSE SAFETY & AI',
      color: 'cyan',
      items: [
        { id: 'ai', label: 'AI Contractor Copilot', icon: Bot, badge: 'NEW' },
        { id: 'safety', label: 'HSE Safety & Permit to Work (PTW)', icon: ShieldCheck },
        { id: 'quality', label: 'QA/QC Inspection & Snagging', icon: CheckCircle2 },
        { id: 'rfi', label: 'RFI & Technical Submittals', icon: FileSignature },
      ]
    }
  ];

  const kpiCards = [
    { title: 'Physical Progress (S-Curve)', value: '59.8%', trend: 'Ahead of Target (58.0%)', icon: TrendingUp, color: 'pink' },
    { title: 'Active Site Manpower', value: '485 Workers', trend: '100% Biometric Tagged', icon: Users, color: 'cyan' },
    { title: 'Heavy Equipment Uptime', value: '96.4%', trend: 'Tower Cranes & Pumps OK', icon: Truck, color: 'purple' },
    { title: 'Safe Working Man-Hours', value: '380,000 hrs', trend: 'Zero Fatalities / LTIs', icon: ShieldCheck, color: 'magenta' },
  ];

  const telemetryCards = [
    { title: 'Tower Crane Lifts', value: '142 Lifts/day', trend: 'Telemetry Active', icon: Truck, color: 'cyan' },
    { title: 'Concrete Pours Today', value: '280 Cu M', subDenom: 'Level 14 Slab', trend: 'Pumping', icon: Layers, color: 'purple' },
    { title: 'Open Snag Points', value: '18 Snags', subDenom: 'Minor', trend: 'Avg 48h Closeout', icon: CheckCircle2, color: 'magenta' },
    { title: 'Permit to Work (PTW)', value: '24 Active', trend: 'Hot Work & Height Safe', icon: ShieldCheck, color: 'teal' },
    { title: 'Lookahead Variance', value: '+3 Days', trend: 'Critical Path Stable', icon: Clock, color: 'cyan' },
    { title: 'Subcontractor Crews', value: '16 Trades', trend: 'Fully Mobilized', icon: Building2, color: 'teal' },
    { title: 'Material Stock on Site', value: '14 Days Buffer', trend: 'RMC & Rebar Ready', icon: Package, color: 'magenta' },
    { title: 'AI Production Index', value: '1.08 SPI', trend: 'Accelerated Pace', icon: Bot, color: 'magenta' },
  ];

  const platformOverview = {
    title: 'Trade Crew Allocation & Manpower',
    subtitle: 'Daily labor headcount by contractor trade',
    totalCount: '485',
    totalLabel: 'WORKERS',
    items: [
      { name: 'Reinforcement Barbenders & Steel Fixers', count: '140 Crew', percent: '28.9%', color: 'green' },
      { name: 'Formwork & Shuttering Carpenters', count: '125 Crew', percent: '25.8%', color: 'yellow' },
      { name: 'Concrete Masons & Helpers', count: '95 Crew', percent: '19.6%', color: 'purple' },
      { name: 'MEP Electrical & Plumbing Trades', count: '75 Crew', percent: '15.5%', color: 'cyan' },
      { name: 'HSE Safety & Quality Supervisors', count: '50 Crew', percent: '10.2%', color: 'pink' },
    ]
  };

  const statusList = {
    title: 'Work Package Execution Timeline',
    viewAllTab: 'packages',
    items: [
      { name: 'Tower A Core Wall Formwork Clamping', status: 'In Progress (85%)', badgeClass: 'active' },
      { name: 'Level 14 Post-Tensioning Cable Pulling', status: 'Active (Zone 2)', badgeClass: 'active' },
      { name: 'Basement Mechanical Room Chiller Erection', status: 'Rigging Crane', badgeClass: 'deploying' },
      { name: 'South Elevation Scaffolding Inspection', status: 'Green Tagged', badgeClass: 'active' },
      { name: 'External Storm Drain Excavation Trench', status: 'Shoring Active', badgeClass: 'training' },
    ]
  };

  const recentActivities = {
    title: 'Site Contractor Daily Diary',
    viewAllTab: 'dpr',
    items: [
      { icon: HardHat, text: "DPR #142 submitted: Level 14 floor slab concrete pour completed at 04:30 AM", time: '10:15 AM', color: 'purple' },
      { icon: ShieldCheck, text: 'Toolbox talk conducted on High-Rise Wind Safety for 485 site workers', time: '09:42 AM', color: 'cyan' },
      { icon: Bot, text: 'AI Contractor Copilot adjusted crew allocation from Yard to Tower B core', time: '09:30 AM', color: 'green' },
      { icon: CheckCircle2, text: 'Rebar cover block and chair reinforcement pre-pour inspection passed', time: '08:55 AM', color: 'blue' },
      { icon: Truck, text: '18 Transit mixers of M40 RMC received with automated slump logs', time: '08:30 AM', color: 'red' },
    ]
  };

  const scoreGauge = {
    title: 'Site Safety & Execution Quality',
    score: '99',
    scoreMax: '/100',
    scoreLabel: 'SAFETY & QA',
    statusText: 'Zero-LTI',
    viewAllTab: 'safety',
    breakdown: [
      { name: 'Inspections Passed 1st Time', num: '148 WIRs', color: 'green' },
      { name: 'PPE Compliance Rate (AI Cam)', num: '99.4%', color: 'yellow' },
      { name: 'Open Minor Snags', num: '18 Items', color: 'purple' },
      { name: 'Stop Work Notices', num: '0 Notices', color: 'red' },
    ],
    footerText: 'HSE Compliance: ISO 45001 / OHSAS 18001 Verified',
    safeText: '🛡 Certified Safe Construction Site'
  };

  return (
    <CyberPortalLayout
      portalName="General Contractor"
      portalSubtitle="MAIN CONTRACTOR & SITE EXECUTION PORTAL"
      userName="David Miller"
      userRole="Senior Project Director (GC)"
      userAvatar="https://i.pravatar.cc/150?img=53"
      navGroups={navGroups}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      copilotTitle="AI Contractor Copilot"
      copilotDesc="Ask me anything about site productivity, lookahead CPM, DPRs & crane logistics"
      copilotTabId="ai"
      kpiCards={kpiCards}
      telemetryCards={telemetryCards}
      platformOverview={platformOverview}
      statusList={statusList}
      recentActivities={recentActivities}
      scoreGauge={scoreGauge}
    >
      {activeTab === 'execution' && <ProjectExecutionModule />}
      {activeTab === 'packages' && <WorkPackagesModule />}
      {activeTab === 'workforce' && <WorkforceManagementModule />}
      {activeTab === 'equipment' && <EquipmentManagementModule />}
      {activeTab === 'dpr' && <DprModule />}
      {activeTab === 'schedule' && <ConstructionScheduleModule />}
      {activeTab === 'subcontracts' && <SubcontractorModule />}
      {activeTab === 'billing' && <BillingModule />}
      {activeTab === 'reports' && <ReportsModule />}
      {activeTab === 'settings' && <AiMlCenterModule />}
      {activeTab === 'ai' && <AiMlCenterModule />}
      {activeTab === 'safety' && <SafetyManagementModule />}
      {activeTab === 'quality' && <QaModule />}
      {activeTab === 'rfi' && <RfiManagementModule />}
    </CyberPortalLayout>
  );
}
