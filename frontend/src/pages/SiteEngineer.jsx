import React, { useState } from 'react';
import {
  Activity,
  AlertTriangle,
  Bot,
  Building,
  Camera,
  CheckCircle2,
  FileSignature,
  FileText,
  HardHat,
  Layers,
  MapPin,
  Settings,
  ShieldCheck,
  TrendingUp,
  Truck,
  Users
} from 'lucide-react';
import CyberPortalLayout from '../components/CyberPortalLayout';
import {
  DailySiteOperationsModule, WorkExecutionModule, TaskAssignmentModule, CrewAttendanceModule,
  MaterialManagementModule, EquipmentManagementModule, InspectionCenterModule, QualityControlModule,
  SafetyManagementModule, IssueDefectModule, RFIManagementModule, PunchListModule,
  ConstructionChecklistModule, SiteProgressModule, DroneMonitoringModule, WeatherMonitoringModule,
  DocumentsCenterModule, PhotoVideoModule, DailyReportsModule, SEReportsModule,
  SEAIMLCenterModule, SiteLogisticsModule, SENotificationsModule, ApprovalRequestsModule,
  TeamCommunicationModule, OfflineSyncModule, MobileSiteModeModule, SESettingsModule
} from '../components/SiteModules';

export default function SiteEngineer() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const navGroups = [
    {
      title: 'FIELD SITE EXECUTION',
      color: 'pink',
      items: [
        { id: 'operations', label: 'Daily Field Operations Hub', icon: HardHat },
        { id: 'execution', label: 'Work Orders & Daily Shift Tasks', icon: Layers },
        { id: 'attendance', label: 'Crew Biometrics & Headcount', icon: Users },
        { id: 'materials', label: 'Site Material Indents & Stock', icon: Truck },
        { id: 'dpr', label: 'Daily Progress Reports (DPR)', icon: FileText },
        { id: 'checklists', label: 'Field Quality Checklists', icon: CheckCircle2 },
        { id: 'drone', label: 'Site Drone Progress Feeds', icon: Camera },
        { id: 'reports', label: 'Site Performance Reports', icon: FileText },
        { id: 'settings', label: 'Settings', icon: Settings },
      ]
    },
    {
      title: 'QA/QC, SAFETY & AI',
      color: 'cyan',
      items: [
        { id: 'ai', label: 'AI Site Assistant Copilot', icon: Bot, badge: 'NEW' },
        { id: 'safety', label: 'Site HSE Safety & Permits (PTW)', icon: ShieldCheck },
        { id: 'inspection', label: 'Work Inspection Requests (WIR)', icon: FileSignature },
        { id: 'snags', label: 'Snags & Defect Resolution', icon: AlertTriangle },
      ]
    }
  ];

  const kpiCards = [
    { title: 'Today\'s Work Execution', value: '94.2%', trend: '18 Tasks Completed Today', icon: CheckCircle2, color: 'pink' },
    { title: 'Site Headcount Deployed', value: '485 Workers', trend: '100% Shift Attendance', icon: Users, color: 'cyan' },
    { title: 'Concrete Pours Today', value: '280 Cu M', trend: 'Level 14 Slab Completed', icon: Layers, color: 'purple' },
    { title: 'HSE Safety Zero-LTI', value: '142,000 hrs', trend: 'Zero Site Incidents', icon: ShieldCheck, color: 'magenta' },
  ];

  const telemetryCards = [
    { title: 'Tower Crane 1 Lifts', value: '68 Lifts', trend: 'Rebar & Formwork', icon: Truck, color: 'cyan' },
    { title: 'Concrete Slump Check', value: '130 mm', subDenom: 'Target 120-140', trend: 'Passed QC', icon: CheckCircle2, color: 'purple' },
    { title: 'Active Shift Tasks', value: '24 Tasks', trend: 'Tower A & B Cores', icon: Layers, color: 'magenta' },
    { title: 'Open Field Snags', value: '4 Minor', trend: 'Assigned to Trade', icon: AlertTriangle, color: 'teal' },
    { title: 'Approved WIRs Today', value: '12 Approved', trend: 'Consultant Signed', icon: FileSignature, color: 'cyan' },
    { title: 'Site Material Buffer', value: '12 Days', trend: 'Cement & Sand Ready', icon: Truck, color: 'teal' },
    { title: 'Weather Wind Speed', value: '14 km/h', trend: 'Crane Safe (< 45km/h)', icon: Activity, color: 'magenta' },
    { title: 'AI Field Productivity', value: '1.08 SPI', trend: 'Ahead of Target', icon: Bot, color: 'magenta' },
  ];

  const platformOverview = {
    title: 'Daily Site Labor Allocation',
    subtitle: 'Shift manpower breakdown by engineering contractor trade',
    totalCount: '485',
    totalLabel: 'WORKERS',
    items: [
      { name: 'Steel Fixers & Barbending Crew', count: '140 Crew', percent: '28.9%', color: 'green' },
      { name: 'Formwork & Shuttering Carpenters', count: '125 Crew', percent: '25.8%', color: 'yellow' },
      { name: 'Concrete Placement & Masons', count: '95 Crew', percent: '19.6%', color: 'purple' },
      { name: 'MEP Conduits & Plumbing Trays', count: '75 Crew', percent: '15.5%', color: 'cyan' },
      { name: 'HSE Supervisors & Safety Marshals', count: '50 Crew', percent: '10.2%', color: 'pink' },
    ]
  };

  const statusList = {
    title: 'Active Work Shifts & Section Progress',
    viewAllTab: 'operations',
    items: [
      { name: 'Tower A: Level 14 Deck Rebar & Post-Tension Ducting', status: 'Passed Pre-Pour', badgeClass: 'active' },
      { name: 'Tower B: Core Wall Shuttering & Plumb Verification', status: 'In Progress (92%)', badgeClass: 'active' },
      { name: 'Podium 2: Retaining Wall Waterproofing Membrane', status: 'Applying Primer', badgeClass: 'training' },
      { name: 'Basement 1: Fire Sprinkler Main Ring Line Clamping', status: 'Testing (10 bar)', badgeClass: 'deploying' },
      { name: 'North Boundary: Storm Drain Precast Box Culvert Laying', status: 'Excavating', badgeClass: 'testing' },
    ]
  };

  const recentActivities = {
    title: 'Field Site Dispatch Stream',
    viewAllTab: 'dpr',
    items: [
      { icon: HardHat, text: "DPR #142 submitted: Level 14 floor slab concrete pour completed at 04:30 AM", time: '10:15 AM', color: 'purple' },
      { icon: ShieldCheck, text: 'Toolbox safety talk on Fall Protection and Scaffolding Harnesses completed', time: '09:42 AM', color: 'cyan' },
      { icon: Bot, text: 'AI Site Assistant re-routed transit mixer trucks to bypass main gate traffic', time: '09:30 AM', color: 'green' },
      { icon: CheckCircle2, text: 'Cover meter rebar thickness audit cleared for shear wall SW-04', time: '08:55 AM', color: 'blue' },
      { icon: Truck, text: '42 MT Fe500D TMT steel unloaded and stacked with mill test certificate', time: '08:30 AM', color: 'red' },
    ]
  };

  const scoreGauge = {
    title: 'Site Execution & Safety Score',
    score: '99',
    scoreMax: '/100',
    scoreLabel: 'EXECUTION SCORE',
    statusText: 'Optimal Shift',
    viewAllTab: 'safety',
    breakdown: [
      { name: 'WIR Approvals First Visit', num: '124 WIRs', color: 'green' },
      { name: 'Shift Targets Met On-Time', num: '98.4%', color: 'yellow' },
      { name: 'Minor Snags in Progress', num: '4 Items', color: 'purple' },
      { name: 'Safety Stoppages', num: '0', color: 'red' },
    ],
    footerText: 'Site Standard: ISO 45001 / IS 456 Field QA Protocol',
    safeText: '🛡 100% Shift Safety & Quality'
  };

  return (
    <CyberPortalLayout
      portalName="Site Engineer"
      portalSubtitle="SITE EXECUTION, FIELD QA/QC & SHIFT MANAGEMENT PORTAL"
      userName="Manoj Tiwari"
      userRole="Lead Senior Site Engineer"
      userAvatar="https://i.pravatar.cc/150?img=62"
      navGroups={navGroups}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      copilotTitle="AI Site Assistant Copilot"
      copilotDesc="Ask me anything about daily DPRs, rebar covers, slump tests & field checklists"
      copilotTabId="ai"
      kpiCards={kpiCards}
      telemetryCards={telemetryCards}
      platformOverview={platformOverview}
      statusList={statusList}
      recentActivities={recentActivities}
      scoreGauge={scoreGauge}
    >
      {activeTab === 'operations' && <DailySiteOperationsModule />}
      {activeTab === 'execution' && <WorkExecutionModule />}
      {activeTab === 'attendance' && <CrewAttendanceModule />}
      {activeTab === 'materials' && <MaterialManagementModule />}
      {activeTab === 'dpr' && <DailyReportsModule />}
      {activeTab === 'checklists' && <ConstructionChecklistModule />}
      {activeTab === 'drone' && <DroneMonitoringModule />}
      {activeTab === 'reports' && <SEReportsModule />}
      {activeTab === 'settings' && <SESettingsModule />}
      {activeTab === 'ai' && <SEAIMLCenterModule />}
      {activeTab === 'safety' && <SafetyManagementModule />}
      {activeTab === 'inspection' && <InspectionCenterModule />}
      {activeTab === 'snags' && <IssueDefectModule />}
    </CyberPortalLayout>
  );
}
