import React, { useState } from 'react';
import {
  Activity,
  AlertCircle,
  Bot,
  Box,
  Building2,
  Camera,
  CheckCircle2,
  DollarSign,
  FileText,
  Layers,
  Settings,
  ShieldCheck,
  TrendingUp,
  Users,
  Wallet
} from 'lucide-react';
import CyberPortalLayout from '../components/CyberPortalLayout';
import {
  ViewerProjectsModule, ViewerBimModule, ViewerTwinModule, ViewerDroneModule,
  ViewerTimelineModule, ViewerProgressModule, ViewerFinanceModule, ViewerQualityModule,
  ViewerSafetyModule, ViewerEsgModule, ViewerDocsModule, ViewerReportsModule,
  ViewerIssuesModule, ViewerMeetingsModule, ViewerSearchModule, ViewerAiCenterModule
} from '../components/ProjectViewerModules';

export default function ProjectViewerDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const navGroups = [
    {
      title: 'EXECUTIVE READ-ONLY VIEWS',
      color: 'pink',
      items: [
        { id: 'projects', label: 'All Projects Portfolio', icon: Building2 },
        { id: 'bim', label: '3D BIM Model Explorer', icon: Box },
        { id: 'twin', label: 'Live Digital Twin View', icon: Activity },
        { id: 'drone', label: '4K Drone Aerial Progress', icon: Camera },
        { id: 'timeline', label: 'Master Schedule & Milestones', icon: TrendingUp },
        { id: 'finance', label: 'Financials & Spend Overview', icon: DollarSign },
        { id: 'reports', label: 'Executive Board Reports', icon: FileText },
        { id: 'settings', label: 'Settings', icon: Settings },
      ]
    },
    {
      title: 'INTELLIGENCE & AI',
      color: 'cyan',
      items: [
        { id: 'ai', label: 'AI Executive Briefing Copilot', icon: Bot, badge: 'NEW' },
        { id: 'quality', label: 'Quality & HSE Scorecards', icon: ShieldCheck },
        { id: 'esg', label: 'ESG & Sustainability Metrics', icon: Layers },
        { id: 'docs', label: 'Approved Documents Library', icon: FileText },
      ]
    }
  ];

  const kpiCards = [
    { title: 'Portfolio Projects', value: '4 Active', trend: 'Total Value ₹ 450 Cr', icon: Building2, color: 'pink' },
    { title: 'Aggregate Physical Progress', value: '68.5%', trend: 'Ahead of Baseline (+14d)', icon: TrendingUp, color: 'cyan' },
    { title: 'Total Budget Spent', value: '₹ 48.62 Cr', trend: '₹ 19.53 Cr Contingency Safe', icon: DollarSign, color: 'purple' },
    { title: 'Executive Quality Score', value: '98.5%', trend: 'GRIHA 5-Star Certified', icon: ShieldCheck, color: 'magenta' },
  ];

  const telemetryCards = [
    { title: 'Executive Milestones', value: '18 of 22 Met', trend: 'On Schedule', icon: TrendingUp, color: 'cyan' },
    { title: 'Drone Survey Flights', value: '32 Scans', trend: '4K Photogrammetry', icon: Camera, color: 'purple' },
    { title: 'Live Connected Twins', value: '4 Twins', trend: 'Real-time Telemetry', icon: Activity, color: 'magenta' },
    { title: 'Contractor Workforces', value: '485 Crew', trend: '100% Safety Inducted', icon: Users, color: 'teal' },
    { title: 'Cost Performance Index', value: 'CPI 1.04', trend: 'Under Budget', icon: DollarSign, color: 'cyan' },
    { title: 'Safety Zero-LTI Hours', value: '380,000 hrs', trend: 'Zero Accidents', icon: ShieldCheck, color: 'teal' },
    { title: 'Approved As-Builts', value: '1,420 Sheets', trend: 'GFC & As-Built', icon: FileText, color: 'magenta' },
    { title: 'AI Completion Est.', value: 'Nov 2024', trend: '98.2% Probability', icon: Bot, color: 'magenta' },
  ];

  const platformOverview = {
    title: 'Enterprise Real Estate Portfolio',
    subtitle: 'High-level multi-project execution status',
    totalCount: '4',
    totalLabel: 'PROJECTS',
    items: [
      { name: 'Skyline Pinnacle Towers', count: '78% Done', percent: '78.0%', color: 'green' },
      { name: 'Horizon Business Park IT SEZ', count: '65% Done', percent: '65.0%', color: 'yellow' },
      { name: 'Greenfield Luxury Eco-Villas', count: '54% Done', percent: '54.0%', color: 'purple' },
      { name: 'Civic Urban Transit Terminal', count: '42% Done', percent: '42.0%', color: 'cyan' },
      { name: 'Phase 2 Expansion Land Acquisition', count: 'Pre-Con', percent: '10.0%', color: 'pink' },
    ]
  };

  const statusList = {
    title: 'Major Milestone Execution Status',
    viewAllTab: 'timeline',
    items: [
      { name: 'Skyline Tower A: Superstructure Topping Out', status: 'Ahead of Schedule', badgeClass: 'active' },
      { name: 'Horizon IT Park: High-Performance Facade Glazing', status: 'In Progress (82%)', badgeClass: 'active' },
      { name: 'Greenfield Villas: Underground Utility Infrastructure', status: 'Completed', badgeClass: 'deploying' },
      { name: 'Civic Terminal: Structural Steel Canopy Truss', status: 'Erecting', badgeClass: 'training' },
      { name: 'Quarterly Executive Stakeholder Audit', status: 'Published', badgeClass: 'active' },
    ]
  };

  const recentActivities = {
    title: 'Executive Project Feed',
    viewAllTab: 'projects',
    items: [
      { icon: Camera, text: "4K Drone Orthomosaic updated for all 4 project sectors", time: '10:15 AM', color: 'purple' },
      { icon: DollarSign, text: 'Quarterly cost audit certified: ₹ 1.45 Cr under budget allocation', time: '09:42 AM', color: 'cyan' },
      { icon: Bot, text: 'AI Executive Copilot generated board summary and risk matrix', time: '09:30 AM', color: 'green' },
      { icon: ShieldCheck, text: 'GRIHA 5-Star green building environmental compliance certified', time: '08:55 AM', color: 'blue' },
      { icon: Box, text: 'Multi-discipline federated 3D BIM coordination verified', time: '08:30 AM', color: 'red' },
    ]
  };

  const scoreGauge = {
    title: 'Executive Portfolio Health Score',
    score: '98',
    scoreMax: '/100',
    scoreLabel: 'PORTFOLIO SCORE',
    statusText: 'Optimal',
    viewAllTab: 'timeline',
    breakdown: [
      { name: 'On-Track Milestones', num: '18 Milestones', color: 'green' },
      { name: 'Under Close Monitoring', num: '4 Milestones', color: 'yellow' },
      { name: 'Schedule Warnings', num: '0 Milestones', color: 'purple' },
      { name: 'Budget Distress', num: '0 Milestones', color: 'red' },
    ],
    footerText: 'Access: Executive Read-Only / Stakeholder Dashboard',
    safeText: '🛡 All Projects Operating in Safe Zone'
  };

  return (
    <CyberPortalLayout
      portalName="Project Viewer"
      portalSubtitle="EXECUTIVE PROJECT VIEWER & STAKEHOLDER PORTAL"
      userName="Victoria Sterling"
      userRole="Executive Board Stakeholder"
      userAvatar="https://i.pravatar.cc/150?img=47"
      navGroups={navGroups}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      copilotTitle="AI Executive Briefing Copilot"
      copilotDesc="Ask me anything about portfolio progress, drone footage & budget summaries"
      copilotTabId="ai"
      kpiCards={kpiCards}
      telemetryCards={telemetryCards}
      platformOverview={platformOverview}
      statusList={statusList}
      recentActivities={recentActivities}
      scoreGauge={scoreGauge}
    >
      {activeTab === 'projects' && <ViewerProjectsModule />}
      {activeTab === 'bim' && <ViewerBimModule />}
      {activeTab === 'twin' && <ViewerTwinModule />}
      {activeTab === 'drone' && <ViewerDroneModule />}
      {activeTab === 'timeline' && <ViewerTimelineModule />}
      {activeTab === 'finance' && <ViewerFinanceModule />}
      {activeTab === 'reports' && <ViewerReportsModule />}
      {activeTab === 'settings' && <ViewerDocsModule />}
      {activeTab === 'ai' && <ViewerAiCenterModule />}
      {activeTab === 'quality' && <ViewerQualityModule />}
      {activeTab === 'esg' && <ViewerEsgModule />}
      {activeTab === 'docs' && <ViewerDocsModule />}
    </CyberPortalLayout>
  );
}
