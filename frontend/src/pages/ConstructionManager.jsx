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
  CommandCenterModule, MultiZoneModule, ProgressControlModule, CMWorkforceModule,
  ContractorModule, SubcontractorModule, CMDailyOpsModule, Scheduling4DModule,
  Cost5DModule, CMResourceModule, EquipmentFleetModule, CMMaterialModule,
  ProcurementModule, CMBIMViewerModule, DigitalTwinModule, CMSiteLogisticsModule,
  CMInspectionModule, CMQualityModule, CMSafetyModule, CMRiskModule, CMIssueModule,
  CMChangeOrderModule, CMRFIModule, CMClientCoordModule, CMVendorCoordModule,
  CMWeatherModule, CMDroneModule, CMIoTModule, CMDocumentModule, CMMeetingModule,
  CMReportsModule, CMAIMLCenterModule, CMNotificationsModule, CMApprovalsModule,
  CMOfflineModule, CMMobileModule, CMAPIModule, CMSettingsModule
} from '../components/ConstructionModules';

export default function ConstructionManager() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const navGroups = [
    {
      title: 'SITE CONSTRUCTION COMMAND',
      color: 'pink',
      items: [
        { id: 'command', label: 'Construction Command Center', icon: HardHat },
        { id: 'multizone', label: 'Multi-Zone Site Coordination', icon: Building },
        { id: 'progress', label: 'Physical Progress & S-Curves', icon: TrendingUp },
        { id: 'workforce', label: 'Labor Headcount & Subcontractors', icon: Users },
        { id: 'fleet', label: 'Heavy Machinery & Cranes Fleet', icon: Truck },
        { id: 'schedule4d', label: '4D Construction Scheduling', icon: Clock },
        { id: 'cost5d', label: '5D Cost Control & Commitments', icon: DollarSign },
        { id: 'bim', label: 'BIM 3D Construction Viewer', icon: Box },
        { id: 'reports', label: 'Construction Management Reports', icon: FileText },
        { id: 'settings', label: 'Settings', icon: Settings },
      ]
    },
    {
      title: 'QA/QC, SAFETY & AI',
      color: 'cyan',
      items: [
        { id: 'ai', label: 'AI Construction Manager Copilot', icon: Bot, badge: 'NEW' },
        { id: 'safety', label: 'HSE Safety & EHS Zero-Harm', icon: ShieldCheck },
        { id: 'quality', label: 'QA/QC Inspections & Signoffs', icon: CheckCircle2 },
        { id: 'risks', label: 'Site Delays & Risk Mitigation', icon: AlertCircle },
      ]
    }
  ];

  const kpiCards = [
    { title: 'Construction S-Curve Progress', value: '72.0%', trend: 'Ahead of Target (70.5%)', icon: TrendingUp, color: 'pink' },
    { title: 'Total Site Headcount', value: '485 Workers', trend: '100% Shift Attendance', icon: Users, color: 'cyan' },
    { title: 'Earned Value (EV)', value: '₹ 75.0 Cr', trend: 'Actual Cost ₹ 24.8 Cr (MTD)', icon: DollarSign, color: 'purple' },
    { title: 'Safe Work Hours (Zero-LTI)', value: '380,000 hrs', trend: 'Zero Lost Time Incidents', icon: ShieldCheck, color: 'magenta' },
  ];

  const telemetryCards = [
    { title: 'Tower Cranes Active', value: '3 Cranes', trend: '100% Uptime', icon: Truck, color: 'cyan' },
    { title: 'Concrete Poured MTD', value: '4,850 Cu M', subDenom: 'M40/M50', trend: 'Pours on Schedule', icon: Layers, color: 'purple' },
    { title: 'Active Trade Crews', value: '16 Trades', trend: 'Fully Mobilized', icon: Users, color: 'magenta' },
    { title: 'Material Stock Buffer', value: '14 Days', trend: 'Cement & TMT Ready', icon: Truck, color: 'teal' },
    { title: 'Permit to Work (PTW)', value: '24 Active', trend: 'Hot & Height Work Safe', icon: ShieldCheck, color: 'cyan' },
    { title: 'WIR Approvals Today', value: '18 Passed', trend: 'Zero NCRs', icon: CheckCircle2, color: 'teal' },
    { title: 'Lookahead Schedule', value: '+4 Days Ahead', trend: 'Critical Path Protected', icon: Clock, color: 'magenta' },
    { title: 'AI Production Index', value: '1.08 SPI', trend: 'Optimized Flow', icon: Bot, color: 'magenta' },
  ];

  const platformOverview = {
    title: 'Multi-Zone Construction Progress',
    subtitle: 'Sector-wise physical structural progress breakdown',
    totalCount: '100',
    totalLabel: '% PROGRESS',
    items: [
      { name: 'Tower A (Level 1 to 45 Residential)', count: '78% Done', percent: '78.0%', color: 'green' },
      { name: 'Tower B (Level 1 to 35 Commercial IT)', count: '65% Done', percent: '65.0%', color: 'yellow' },
      { name: 'Podium Deck & Retail Promenade', count: '88% Done', percent: '88.0%', color: 'purple' },
      { name: 'Basement 1-3 Car Park & Plant Rooms', count: '94% Done', percent: '94.0%', color: 'cyan' },
      { name: 'External Infrastructure, Roads & Landscape', count: '42% Done', percent: '42.0%', color: 'pink' },
    ]
  };

  const statusList = {
    title: 'Live Site Shifts & Major Operations',
    viewAllTab: 'multizone',
    items: [
      { name: 'Tower A: Level 32 Post-Tensioned Slab Concrete Pour', status: 'In Progress (Pumping)', badgeClass: 'active' },
      { name: 'Tower B: Unitized Curtain Wall Glazing Installation', status: 'Active (Floors 12-16)', badgeClass: 'active' },
      { name: 'Podium 2: Primary Chiller Plant Rigging & Piping', status: 'Rigging Crane', badgeClass: 'deploying' },
      { name: 'Central Substation: 11kV Switchgear Cable Termination', status: 'Testing Phase', badgeClass: 'training' },
      { name: 'External Drainage: 450mm RCC Storm Pipe Trench Laying', status: 'Backfilling', badgeClass: 'active' },
    ]
  };

  const recentActivities = {
    title: 'Construction Management Operations Stream',
    viewAllTab: 'command',
    items: [
      { icon: HardHat, text: "Continuous pour of 320m³ M40 concrete completed for Tower A Level 32 floor plate", time: '10:15 AM', color: 'purple' },
      { icon: ShieldCheck, text: 'Site HSE audit completed by Client EHS Manager: 100% compliance score', time: '09:42 AM', color: 'cyan' },
      { icon: Bot, text: 'AI Construction Copilot balanced batching plant dispatch: eliminated waiting truck queue', time: '09:30 AM', color: 'green' },
      { icon: CheckCircle2, text: 'Consultant Resident Engineer approved GFC structural revisions for Transfer Floor', time: '08:55 AM', color: 'blue' },
      { icon: Truck, text: 'Heavy crane rigging completed safely for 14-ton chiller plant unit in Basement 1', time: '08:30 AM', color: 'red' },
    ]
  };

  const scoreGauge = {
    title: 'Construction Execution & Safety Index',
    score: '99',
    scoreMax: '/100',
    scoreLabel: 'EXECUTION SCORE',
    statusText: 'World-Class',
    viewAllTab: 'safety',
    breakdown: [
      { name: 'Work Zones Ahead of Schedule', num: '4 Zones', color: 'green' },
      { name: 'Work Zones On Target', num: '1 Zone', color: 'yellow' },
      { name: 'Minor Material Hold', num: '0 Zones', color: 'purple' },
      { name: 'HSE Safety Violations', num: '0', color: 'red' },
    ],
    footerText: 'Construction Protocol: Lean Construction / Last Planner / ISO 45001',
    safeText: '🛡 Certified Safe Construction Operations'
  };

  return (
    <CyberPortalLayout
      portalName="Construction Manager"
      portalSubtitle="SITE CONSTRUCTION & MULTI-ZONE OPERATIONS PORTAL"
      userName="Harish Chandra"
      userRole="Senior General Construction Manager"
      userAvatar="https://i.pravatar.cc/150?img=63"
      navGroups={navGroups}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      copilotTitle="AI Construction Manager Copilot"
      copilotDesc="Ask me anything about multi-zone execution, heavy cranes, concrete pours & HSE"
      copilotTabId="ai"
      kpiCards={kpiCards}
      telemetryCards={telemetryCards}
      platformOverview={platformOverview}
      statusList={statusList}
      recentActivities={recentActivities}
      scoreGauge={scoreGauge}
    >
      {activeTab === 'command' && <CommandCenterModule />}
      {activeTab === 'multizone' && <MultiZoneModule />}
      {activeTab === 'progress' && <ProgressControlModule />}
      {activeTab === 'workforce' && <CMWorkforceModule />}
      {activeTab === 'fleet' && <EquipmentFleetModule />}
      {activeTab === 'schedule4d' && <Scheduling4DModule />}
      {activeTab === 'cost5d' && <Cost5DModule />}
      {activeTab === 'bim' && <CMBIMViewerModule />}
      {activeTab === 'reports' && <CMReportsModule />}
      {activeTab === 'settings' && <CMSettingsModule />}
      {activeTab === 'ai' && <CMAIMLCenterModule />}
      {activeTab === 'safety' && <CMSafetyModule />}
      {activeTab === 'quality' && <CMQualityModule />}
      {activeTab === 'risks' && <CMRiskModule />}
    </CyberPortalLayout>
  );
}
