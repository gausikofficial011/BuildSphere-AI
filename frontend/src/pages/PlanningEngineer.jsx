import React, { useState } from 'react';
import {
  Activity,
  AlertCircle,
  Bot,
  Box,
  Building,
  CheckCircle2,
  Clock,
  DollarSign,
  FileText,
  Layers,
  Settings,
  ShieldCheck,
  TrendingUp,
  Truck,
  Users
} from 'lucide-react';
import CyberPortalLayout from '../components/CyberPortalLayout';
import {
  MasterScheduleModule, WBSManagementModule, GanttPlanningModule, CriticalPathModule,
  LookAheadModule, BaselineModule, ProgressMonitoringModule, DelayAnalysisModule,
  PEResourcePlanningModule, ResourceLevelingModule, LaborPlanningModule, EquipmentPlanningModule,
  MaterialPlanningModule, ProcurementScheduleModule, ConstructionSequenceModule,
  BIM4DModule, SiteLogisticsModule, ProductivityAnalyticsModule, ForecastingCenterModule,
  EVMModule, ScheduleRiskModule, ConstraintModule, ChangeImpactModule, WeatherPlanningModule,
  PEReportsModule, PEAIMLCenterModule, PEDocumentModule, PECollaborationModule,
  PEApprovalModule, PESettingsModule
} from '../components/PlanningModules';

export default function PlanningEngineer() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const navGroups = [
    {
      title: 'SCHEDULE & CPM CONTROLS',
      color: 'pink',
      items: [
        { id: 'master', label: 'Master Schedule & Primavera P6', icon: Clock },
        { id: 'gantt', label: 'Interactive Gantt Chart & WBS', icon: Layers },
        { id: 'cpm', label: 'Critical Path Method (CPM Analysis)', icon: Activity },
        { id: 'lookahead', label: '3-Week & 6-Week Lookahead Planning', icon: TrendingUp },
        { id: 'baseline', label: 'Baseline Revisions & Variance', icon: FileText },
        { id: 'delays', label: 'Delay Analysis & Time Extension (EOT)', icon: AlertCircle },
        { id: 'bim4d', label: '4D BIM Construction Simulation', icon: Box },
        { id: 'reports', label: 'Planning & Milestone Reports', icon: FileText },
        { id: 'settings', label: 'Settings', icon: Settings },
      ]
    },
    {
      title: 'RESOURCE & AI FORECASTING',
      color: 'cyan',
      items: [
        { id: 'ai', label: 'AI Schedule Optimizer Copilot', icon: Bot, badge: 'NEW' },
        { id: 'evm', label: 'Earned Value Management (EVM)', icon: DollarSign },
        { id: 'resources', label: 'Resource Leveling & Histograms', icon: Users },
        { id: 'forecast', label: 'Predictive Completion Forecast', icon: CheckCircle2 },
      ]
    }
  ];

  const kpiCards = [
    { title: 'Schedule Performance (SPI)', value: 'SPI 1.04', trend: 'Ahead of Baseline (+12 Days)', icon: Clock, color: 'pink' },
    { title: 'Planned Value (PV)', value: '₹ 75.0 Cr', trend: 'Earned Value ₹ 68.0 Cr', icon: DollarSign, color: 'cyan' },
    { title: 'Critical Path Tasks', value: '42 Tasks', trend: 'Zero Negative Total Float', icon: Activity, color: 'purple' },
    { title: 'Lookahead Milestone Rate', value: '96.2%', trend: 'Reliability Index (PPC)', icon: CheckCircle2, color: 'magenta' },
  ];

  const telemetryCards = [
    { title: 'Critical Path Float', value: '+6 Days Float', trend: 'No Near-Critical Bottlenecks', icon: Clock, color: 'cyan' },
    { title: 'Tasks Completed', value: '196 of 512', trend: '↑ 14 Tasks this week', icon: CheckCircle2, color: 'purple' },
    { title: 'Percent Planned Done', value: '88.4% PPC', trend: 'Last Planner System', icon: TrendingUp, color: 'magenta' },
    { title: 'Resource Utilization', value: '92.4%', trend: 'Levelled Labor Curve', icon: Users, color: 'teal' },
    { title: '4D BIM Simulation', value: 'Week 24 Ready', trend: 'Synchro / Navisworks Sync', icon: Box, color: 'cyan' },
    { title: 'Weather Risk Buffer', value: '8 Rain Days', trend: 'Monsoon Contingency Factored', icon: ShieldCheck, color: 'teal' },
    { title: 'Time Extension Claims', value: '0 EOT Pending', trend: 'On Original Contract Date', icon: AlertCircle, color: 'magenta' },
    { title: 'AI CPM Auto-Healer', value: 'Active', trend: 'Optimized Activity Log', icon: Bot, color: 'magenta' },
  ];

  const platformOverview = {
    title: 'Schedule Activity Execution Matrix',
    subtitle: 'WBS Level 3 construction schedule status',
    totalCount: '512',
    totalLabel: 'TASKS',
    items: [
      { name: 'Completed & Certified', count: '196 Tasks', percent: '38.3%', color: 'green' },
      { name: 'In Progress (On Schedule)', count: '152 Tasks', percent: '29.7%', color: 'yellow' },
      { name: 'Planned for Lookahead Window', count: '116 Tasks', percent: '22.6%', color: 'purple' },
      { name: 'Future Unscheduled Activities', count: '48 Tasks', percent: '9.4%', color: 'cyan' },
    ]
  };

  const statusList = {
    title: 'Critical Path Near-Term Milestones',
    viewAllTab: 'cpm',
    items: [
      { name: 'Tower A: Level 28-32 Structural Glazing Installation', status: 'On Critical Path (0d Float)', badgeClass: 'active' },
      { name: 'Basement 1: Primary HVAC Chiller Plant Electrical Feed', status: 'Total Float +4d', badgeClass: 'active' },
      { name: 'Central Atrium: Structural Steel Skylight Erection', status: 'Rigging Crane', badgeClass: 'deploying' },
      { name: 'External Infrastructure: Fire Ring Main Hydro Test', status: 'Total Float +8d', badgeClass: 'training' },
      { name: 'Substation: 33kV Grid Synchronization & Energization', status: 'Scheduled', badgeClass: 'inactive' },
    ]
  };

  const recentActivities = {
    title: 'Planning & Controls Activity Feed',
    viewAllTab: 'master',
    items: [
      { icon: Clock, text: "Primavera P6 baseline updated: Month-end EVM data synchronized with site DPRs", time: '10:15 AM', color: 'purple' },
      { icon: Box, text: '4D BIM time-lapse video exported for Level 30 structural slab pour sequence', time: '09:42 AM', color: 'cyan' },
      { icon: Bot, text: 'AI Planning Copilot leveled manpower curves: saved 120 idle man-days in Tower B', time: '09:30 AM', color: 'green' },
      { icon: CheckCircle2, text: '3-Week Lookahead meeting concluded with 94.2% PPC commitment reliability', time: '08:55 AM', color: 'blue' },
      { icon: TrendingUp, text: 'Critical path sensitivity analysis confirms project completion 14 days ahead', time: '08:30 AM', color: 'red' },
    ]
  };

  const scoreGauge = {
    title: 'Schedule Health & Integrity Score',
    score: '98',
    scoreMax: '/100',
    scoreLabel: 'SCHEDULE HEALTH',
    statusText: 'DCMA 14-Point',
    viewAllTab: 'master',
    breakdown: [
      { name: 'Logic Relationships Passed', num: '100%', color: 'green' },
      { name: 'Zero Leads / Lags Validated', num: '100%', color: 'yellow' },
      { name: 'Near-Critical Floating Margin', num: 'Safe (+6d)', color: 'purple' },
      { name: 'High-Risk Schedule Slippages', num: '0 Tasks', color: 'red' },
    ],
    footerText: 'Planning Standard: DCMA 14-Point Assessment / AACE CPM Guidelines',
    safeText: '🛡 Certified Baseline Integrity'
  };

  return (
    <CyberPortalLayout
      portalName="Planning Engineer"
      portalSubtitle="PROJECT PLANNING, PRIMAVERA P6 & CPM CONTROLS PORTAL"
      userName="Meera Nambiar"
      userRole="Lead Planning & Controls Engineer"
      userAvatar="https://i.pravatar.cc/150?img=48"
      navGroups={navGroups}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      copilotTitle="AI Schedule Optimizer Copilot"
      copilotDesc="Ask me anything about Primavera P6 CPM, lookahead PPC, resource leveling & EOT"
      copilotTabId="ai"
      kpiCards={kpiCards}
      telemetryCards={telemetryCards}
      platformOverview={platformOverview}
      statusList={statusList}
      recentActivities={recentActivities}
      scoreGauge={scoreGauge}
    >
      {activeTab === 'master' && <MasterScheduleModule />}
      {activeTab === 'gantt' && <GanttPlanningModule />}
      {activeTab === 'cpm' && <CriticalPathModule />}
      {activeTab === 'lookahead' && <LookAheadModule />}
      {activeTab === 'baseline' && <BaselineModule />}
      {activeTab === 'delays' && <DelayAnalysisModule />}
      {activeTab === 'bim4d' && <BIM4DModule />}
      {activeTab === 'reports' && <PEReportsModule />}
      {activeTab === 'settings' && <PESettingsModule />}
      {activeTab === 'ai' && <PEAIMLCenterModule />}
      {activeTab === 'evm' && <EVMModule />}
      {activeTab === 'resources' && <PEResourcePlanningModule />}
      {activeTab === 'forecast' && <ForecastingCenterModule />}
    </CyberPortalLayout>
  );
}
