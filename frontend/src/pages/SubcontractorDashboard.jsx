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
  ShieldCheck,
  TrendingUp,
  Truck,
  Users,
  Wallet,
  Wrench
} from 'lucide-react';
import CyberPortalLayout from '../components/CyberPortalLayout';
import {
  SubcontractorProjectsModule, SubcontractorWorkPackagesModule, SubcontractorDailyWorkModule,
  SubcontractorWorkforceModule, SubcontractorAttendanceModule, SubcontractorTaskModule,
  SubcontractorMaterialModule, SubcontractorEquipmentModule, SubcontractorDocsModule,
  SubcontractorSiteDiaryModule, SubcontractorQaModule, SubcontractorRfiNcrModule,
  SubcontractorSafetyModule, SubcontractorBillingModule, SubcontractorResourceModule,
  SubcontractorCollabModule, SubcontractorReportsModule, SubcontractorAiCenterModule
} from '../components/SubcontractorModules';

export default function SubcontractorDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const navGroups = [
    {
      title: 'TRADE PACKAGE OPERATIONS',
      color: 'pink',
      items: [
        { id: 'projects', label: 'Subcontract Projects Overview', icon: Building2 },
        { id: 'packages', label: 'Assigned Work Packages (WPs)', icon: Layers },
        { id: 'daily', label: 'Daily Trade Tasks & Crew Logs', icon: Wrench },
        { id: 'workforce', label: 'Trade Labor Attendance & Badging', icon: Users },
        { id: 'materials', label: 'Material Indents & Issue Slips', icon: Package },
        { id: 'billing', label: 'Subcontract RA Invoices & Retention', icon: Receipt },
        { id: 'reports', label: 'Trade Performance Reports', icon: FileText },
        { id: 'settings', label: 'Settings', icon: Settings },
      ]
    },
    {
      title: 'QA/QC, SAFETY & AI',
      color: 'cyan',
      items: [
        { id: 'ai', label: 'AI Subcontractor Copilot', icon: Bot, badge: 'NEW' },
        { id: 'safety', label: 'Subcontractor Safety & Toolboxes', icon: ShieldCheck },
        { id: 'qa', label: 'Inspection Requests (WIR) & Snags', icon: CheckCircle2 },
        { id: 'rfi', label: 'RFI & Technical Clarifications', icon: FileSignature },
      ]
    }
  ];

  const kpiCards = [
    { title: 'Subcontract Package Value', value: '₹ 18.50 Cr', trend: 'Fixed Price + VOs', icon: Wallet, color: 'pink' },
    { title: 'Certified RA Invoices', value: '₹ 9.80 Cr', trend: '53.0% Certified to Date', icon: Receipt, color: 'cyan' },
    { title: 'Trade Work Progress', value: '59.8%', trend: 'Ahead of Target (58.5%)', icon: TrendingUp, color: 'purple' },
    { title: 'Daily Deployed Manpower', value: '142 Workers', trend: '100% Safety Induction Done', icon: Users, color: 'magenta' },
  ];

  const telemetryCards = [
    { title: 'Certified RA Bill #06', value: '₹ 1.45 Cr', subDenom: 'Approved', trend: 'Passed QC', icon: Receipt, color: 'cyan' },
    { title: 'Active Work Orders', value: '8 WOs', trend: 'Civil & HVAC Trade', icon: Layers, color: 'purple' },
    { title: 'Work Inspection Requests', value: '24 WIRs', trend: '100% Passed', icon: CheckCircle2, color: 'magenta' },
    { title: 'Retention Held (5%)', value: '₹ 49 Lakhs', trend: 'DLP Release Pending', icon: Wallet, color: 'teal' },
    { title: 'Toolbox Talks Today', value: '3 Sessions', trend: '142 Workers Attended', icon: ShieldCheck, color: 'cyan' },
    { title: 'Material Requisitions', value: '6 PRs', trend: 'RMC & Rebar Indented', icon: Package, color: 'teal' },
    { title: 'Snags Pending Fix', value: '3 Minor', trend: 'Target Close: 24 hrs', icon: Wrench, color: 'magenta' },
    { title: 'AI Productivity Index', value: '1.06 SPI', trend: 'Optimal Crew Efficiency', icon: Bot, color: 'magenta' },
  ];

  const platformOverview = {
    title: 'Trade Package Milestones Status',
    subtitle: 'Assigned trade deliverables progress',
    totalCount: '8',
    totalLabel: 'PACKAGES',
    items: [
      { name: 'Basement Structural RCC Framing', count: 'Completed', percent: '100%', color: 'green' },
      { name: 'Tower A Level 10-18 Post-Tensioning', count: 'In Progress', percent: '84%', color: 'yellow' },
      { name: 'Core Wall Shuttering & Pours', count: 'In Progress', percent: '72%', color: 'purple' },
      { name: 'Underground Chilled Water Risers', count: 'In Progress', percent: '48%', color: 'cyan' },
      { name: 'External Stormwater Finishes', count: 'Pending', percent: '12%', color: 'pink' },
    ]
  };

  const statusList = {
    title: 'Work Inspection Requests (WIR) Status',
    viewAllTab: 'qa',
    items: [
      { name: 'WIR-2024-412: Level 14 Beam Rebar & Spacers', status: 'Approved (Green)', badgeClass: 'active' },
      { name: 'WIR-2024-413: Core Wall Formwork Alignment', status: 'Approved (Green)', badgeClass: 'active' },
      { name: 'WIR-2024-414: Post-Tensioning Duct Profile', status: 'Inspecting', badgeClass: 'training' },
      { name: 'WIR-2024-415: Chilled Water Pipe Hydro Test', status: 'Passed (12 bar)', badgeClass: 'deploying' },
      { name: 'WIR-2024-416: Staircase 2 Precast Placement', status: 'Submitted', badgeClass: 'inactive' },
    ]
  };

  const recentActivities = {
    title: 'Subcontract Site Diary Stream',
    viewAllTab: 'daily',
    items: [
      { icon: Wrench, text: "Level 14 post-tensioned tendon profiling approved by Consultant RE", time: '10:15 AM', color: 'purple' },
      { icon: Receipt, text: 'RA Bill #06 certified by General Contractor: Net ₹ 1.45 Cr approved', time: '09:42 AM', color: 'cyan' },
      { icon: Bot, text: 'AI Trade Copilot predicted 2.4-day acceleration by shifting 12 carpenters to Tower B', time: '09:30 AM', color: 'green' },
      { icon: ShieldCheck, text: 'Daily HSE safety briefing on Scaffolding Anchorages completed', time: '08:55 AM', color: 'blue' },
      { icon: Package, text: '35 MT Rebar delivery received and stacked at South Laydown Area', time: '08:30 AM', color: 'red' },
    ]
  };

  const scoreGauge = {
    title: 'Subcontractor Quality & Safety Score',
    score: '98',
    scoreMax: '/100',
    scoreLabel: 'TRADE QUALITY',
    statusText: 'Tier-1 Rated',
    viewAllTab: 'qa',
    breakdown: [
      { name: 'WIR Approvals On First Inspection', num: '124 WIRs', color: 'green' },
      { name: 'Zero Rework Re-inspections', num: '2 WIRs', color: 'yellow' },
      { name: 'Safety Deviations', num: '0 Violations', color: 'purple' },
      { name: 'Delayed Deliverables', num: '0 Packages', color: 'red' },
    ],
    footerText: 'Subcontract Performance: Grade A+ (Preferred Partner)',
    safeText: '🛡 Zero Non-Conformance Reports (NCR)'
  };

  return (
    <CyberPortalLayout
      portalName="Subcontractor"
      portalSubtitle="TRADE SUBCONTRACTOR & EXECUTION PORTAL"
      userName="Karan Singhania"
      userRole="Trade Subcontractor Project Lead"
      userAvatar="https://i.pravatar.cc/150?img=65"
      navGroups={navGroups}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      copilotTitle="AI Subcontractor Copilot"
      copilotDesc="Ask me anything about daily WIRs, RA invoices, manpower & trade schedules"
      copilotTabId="ai"
      kpiCards={kpiCards}
      telemetryCards={telemetryCards}
      platformOverview={platformOverview}
      statusList={statusList}
      recentActivities={recentActivities}
      scoreGauge={scoreGauge}
    >
      {activeTab === 'projects' && <SubcontractorProjectsModule />}
      {activeTab === 'packages' && <SubcontractorWorkPackagesModule />}
      {activeTab === 'daily' && <SubcontractorDailyWorkModule />}
      {activeTab === 'workforce' && <SubcontractorWorkforceModule />}
      {activeTab === 'materials' && <SubcontractorMaterialModule />}
      {activeTab === 'billing' && <SubcontractorBillingModule />}
      {activeTab === 'reports' && <SubcontractorReportsModule />}
      {activeTab === 'settings' && <SubcontractorAiCenterModule />}
      {activeTab === 'ai' && <SubcontractorAiCenterModule />}
      {activeTab === 'safety' && <SubcontractorSafetyModule />}
      {activeTab === 'qa' && <SubcontractorQaModule />}
      {activeTab === 'rfi' && <SubcontractorRfiNcrModule />}
    </CyberPortalLayout>
  );
}
