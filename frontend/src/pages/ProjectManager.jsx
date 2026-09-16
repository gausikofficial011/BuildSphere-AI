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
  HardHat,
  Layers,
  Settings,
  ShieldCheck,
  TrendingUp,
  Truck,
  Users
} from 'lucide-react';
import CyberPortalLayout from '../components/CyberPortalLayout';
import {
  WorkspaceModule, TaskManagementModule, TeamManagementModule, ResourceManagementModule,
  ScheduleManagementModule, CostMonitoringModule, BIMCoordinationModule, DesignCoordinationModule,
  ConstructionProgressModule, RiskManagementModule, IssueManagementModule, ChangeManagementModule,
  QualityManagementModule, SafetyManagementModule, ClientCommunicationModule, ContractorManagementModule,
  VendorCoordinationModule, ProcurementTrackingModule, DocumentsCenterModule, MeetingsCenterModule,
  AIMLCenterModule, ReportsAnalyticsModule, DigitalTwinMonitoringModule, GISProjectViewModule,
  IoTMonitoringModule, ProjectSettingsModule
} from '../components/ProjectModules';

export default function ProjectManager() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const navGroups = [
    {
      title: 'PROJECT DELIVERY & OPS',
      color: 'pink',
      items: [
        { id: 'workspace', label: 'Project Command Hub', icon: Building },
        { id: 'tasks', label: 'Work Breakdown & Milestones (WBS)', icon: Layers },
        { id: 'schedule', label: 'Master CPM Schedule (Primavera)', icon: Clock },
        { id: 'progress', label: 'Site Execution & Physical S-Curve', icon: TrendingUp },
        { id: 'cost', label: 'Project Budget & Cost EVM', icon: DollarSign },
        { id: 'team', label: 'Multi-Discipline Engineering Team', icon: Users },
        { id: 'contractors', label: 'Contractor & Trade Coordination', icon: HardHat },
        { id: 'bim', label: 'Federated 3D BIM & Clashes', icon: Box },
        { id: 'reports', label: 'Project Status & Executive Reports', icon: FileText },
        { id: 'settings', label: 'Settings', icon: Settings },
      ]
    },
    {
      title: 'RISK, QUALITY & AI',
      color: 'cyan',
      items: [
        { id: 'ai', label: 'AI Project Manager Copilot', icon: Bot, badge: 'NEW' },
        { id: 'risks', label: 'Project Risk Matrix & Mitigation', icon: AlertCircle },
        { id: 'quality', label: 'QA/QC Inspections & Non-Conformance', icon: CheckCircle2 },
        { id: 'safety', label: 'HSE Safety & Environmental Audits', icon: ShieldCheck },
        { id: 'twin', label: 'Digital Twin Live Telemetry', icon: Activity },
      ]
    }
  ];

  const kpiCards = [
    { title: 'Project Physical Progress', value: '68.4%', trend: 'Ahead of Baseline (+12d)', icon: TrendingUp, color: 'pink' },
    { title: 'Earned Value (BCWP)', value: '₹ 38.0 Cr', trend: 'Actual Cost ₹ 39.0 Cr', icon: DollarSign, color: 'cyan' },
    { title: 'Active Milestones', value: '18 Completed', trend: '100% Critical Path Safe', icon: CheckCircle2, color: 'purple' },
    { title: 'Site Workforce Deployed', value: '485 Workers', trend: '16 Contractor Crews', icon: Users, color: 'magenta' },
  ];

  const telemetryCards = [
    { title: 'Schedule Perf Index (SPI)', value: 'SPI 1.04', trend: 'Accelerated Schedule', icon: Clock, color: 'cyan' },
    { title: 'Cost Perf Index (CPI)', value: 'CPI 0.98', trend: 'Near-Perfect Budget Match', icon: DollarSign, color: 'purple' },
    { title: 'Open Risk Items', value: '2 Low Risk', trend: 'Mitigation Active', icon: AlertCircle, color: 'magenta' },
    { title: 'Material Supply Health', value: '98.6%', trend: 'Zero Supply Bottlenecks', icon: Truck, color: 'teal' },
    { title: 'Approved GFC Drawings', value: '420 Sheets', trend: 'Arch/Struct/MEP Ready', icon: FileText, color: 'cyan' },
    { title: 'HSE Safe Work Hours', value: '380,000 hrs', trend: 'Zero LTI Incidents', icon: ShieldCheck, color: 'teal' },
    { title: 'Daily Progress Reports', value: '100% On-Time', trend: 'Geo-Tagged DPRs', icon: Building, color: 'magenta' },
    { title: 'AI Completion Forecast', value: 'Nov 15, 2024', trend: '98.5% Confidence', icon: Bot, color: 'magenta' },
  ];

  const platformOverview = {
    title: 'Project Engineering Breakdown',
    subtitle: 'Cross-functional engineering disciplines execution status',
    totalCount: '100',
    totalLabel: '% WORK',
    items: [
      { name: 'Substructure & Deep Foundation', count: 'Completed', percent: '100%', color: 'green' },
      { name: 'Superstructure RCC Frames & Slabs', count: 'In Progress', percent: '84%', color: 'yellow' },
      { name: 'Unitized Facade & Glazing', count: 'In Progress', percent: '62%', color: 'purple' },
      { name: 'MEP Plant Room & Riser Networks', count: 'In Progress', percent: '54%', color: 'cyan' },
      { name: 'Internal Architectural Finishes', count: 'Starting', percent: '28%', color: 'pink' },
    ]
  };

  const statusList = {
    title: 'Critical Path Milestones & Deliverables',
    viewAllTab: 'schedule',
    items: [
      { name: 'Tower A Level 30 Concrete Pour', status: 'Completed (Ahead)', badgeClass: 'active' },
      { name: 'HVAC Chiller Plant Rigging & Piping', status: 'In Progress (88%)', badgeClass: 'active' },
      { name: 'Substation 11kV CEIG Inspection', status: 'Approved', badgeClass: 'deploying' },
      { name: 'Exterior Facade Unitized Panel Delivery', status: 'On Track (ETA 2d)', badgeClass: 'training' },
      { name: 'Lift Core Elevator Installation (Otis)', status: 'Mobilizing', badgeClass: 'inactive' },
    ]
  };

  const recentActivities = {
    title: 'Project Manager Executive Feed',
    viewAllTab: 'workspace',
    items: [
      { icon: TrendingUp, text: "Master Primavera P6 baseline updated: milestone M-14 achieved 3 days early", time: '10:15 AM', color: 'purple' },
      { icon: DollarSign, text: 'Contractor RA Bill #12 verified against certified measurement books', time: '09:42 AM', color: 'cyan' },
      { icon: Bot, text: 'AI Project Manager Copilot balanced concrete pouring schedules to dodge rain forecast', time: '09:30 AM', color: 'green' },
      { icon: ShieldCheck, text: 'Client executive milestone review passed with 100% stakeholder signoff', time: '08:55 AM', color: 'blue' },
      { icon: HardHat, text: 'Weekly multi-contractor coordination meeting concluded with zero unresolved RFIs', time: '08:30 AM', color: 'red' },
    ]
  };

  const scoreGauge = {
    title: 'Project Health & Delivery Index',
    score: '98',
    scoreMax: '/100',
    scoreLabel: 'PROJECT HEALTH',
    statusText: 'Outstanding',
    viewAllTab: 'reports',
    breakdown: [
      { name: 'Critical Path Activities On Track', num: '42 Tasks', color: 'green' },
      { name: 'Minor Float Float Consumed', num: '4 Tasks', color: 'yellow' },
      { name: 'Schedule Warnings', num: '0 Tasks', color: 'purple' },
      { name: 'Critical Slippage', num: '0 Tasks', color: 'red' },
    ],
    footerText: 'Delivery Methodology: PMI PMBOK / Agile Hybrid Framework',
    safeText: '🛡 100% Project Delivery Conformance'
  };

  return (
    <CyberPortalLayout
      portalName="Project Manager"
      portalSubtitle="PROJECT MANAGEMENT & MASTER DELIVERY PORTAL"
      userName="Rohit Varma"
      userRole="Senior Project Director (PMP)"
      userAvatar="https://i.pravatar.cc/150?img=12"
      navGroups={navGroups}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      copilotTitle="AI Project Manager Copilot"
      copilotDesc="Ask me anything about Primavera CPM, EVM S-curves, milestone risk & contractor sync"
      copilotTabId="ai"
      kpiCards={kpiCards}
      telemetryCards={telemetryCards}
      platformOverview={platformOverview}
      statusList={statusList}
      recentActivities={recentActivities}
      scoreGauge={scoreGauge}
    >
      {activeTab === 'workspace' && <WorkspaceModule />}
      {activeTab === 'tasks' && <TaskManagementModule />}
      {activeTab === 'schedule' && <ScheduleManagementModule />}
      {activeTab === 'progress' && <ConstructionProgressModule />}
      {activeTab === 'cost' && <CostMonitoringModule />}
      {activeTab === 'team' && <TeamManagementModule />}
      {activeTab === 'contractors' && <ContractorManagementModule />}
      {activeTab === 'bim' && <BIMCoordinationModule />}
      {activeTab === 'reports' && <ReportsAnalyticsModule />}
      {activeTab === 'settings' && <ProjectSettingsModule />}
      {activeTab === 'ai' && <AIMLCenterModule />}
      {activeTab === 'risks' && <RiskManagementModule />}
      {activeTab === 'quality' && <QualityManagementModule />}
      {activeTab === 'safety' && <SafetyManagementModule />}
      {activeTab === 'twin' && <DigitalTwinMonitoringModule />}
    </CyberPortalLayout>
  );
}
