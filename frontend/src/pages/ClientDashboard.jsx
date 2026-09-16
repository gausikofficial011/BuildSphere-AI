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
  FileSignature,
  FileText,
  Globe,
  Layers,
  Settings,
  ShieldCheck,
  TrendingUp,
  Users,
  Wallet
} from 'lucide-react';
import CyberPortalLayout from '../components/CyberPortalLayout';
import {
  ClientProjectsModule, ClientPortfolioModule, ClientBimModule,
  ClientTwinModule, ClientDroneModule, ClientTimelineModule,
  ClientFinanceModule, ClientApprovalModule, ClientQaModule,
  ClientEsgModule, ClientAssetModule, ClientHandoverModule,
  ClientReportsModule, ClientDocsModule, ClientMeetingsModule,
  ClientCollabModule, ClientAiCenterModule
} from '../components/ClientModules';

export default function ClientDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const navGroups = [
    {
      title: 'EXECUTIVE PORTFOLIO',
      color: 'pink',
      items: [
        { id: 'projects', label: 'Real Estate Projects Portfolio', icon: Building2 },
        { id: 'bim', label: 'Interactive 3D BIM & VR Walkthrough', icon: Box },
        { id: 'twin', label: 'Live Digital Twin & Energy ROI', icon: Activity },
        { id: 'drone', label: 'Drone Site Aerial Progress (4K)', icon: Camera },
        { id: 'timeline', label: 'Master Milestone Timeline & RAG', icon: TrendingUp },
        { id: 'finance', label: 'Budget, Invoices & Cost Analytics', icon: DollarSign },
        { id: 'approvals', label: 'Executive Approvals & Signoffs', icon: FileSignature },
        { id: 'reports', label: 'Executive Investor Reports', icon: FileText },
        { id: 'settings', label: 'Settings', icon: Settings },
      ]
    },
    {
      title: 'GOVERNANCE & AI',
      color: 'cyan',
      items: [
        { id: 'ai', label: 'AI Client Advisory Copilot', icon: Bot, badge: 'NEW' },
        { id: 'esg', label: 'ESG & Green Building Scorecard', icon: ShieldCheck },
        { id: 'handover', label: 'Asset Handover & Snagging Closeout', icon: CheckCircle2 },
        { id: 'collab', label: 'Stakeholder Meetings & Minutes', icon: Users },
      ]
    }
  ];

  const kpiCards = [
    { title: 'Portfolio Project Value', value: '₹ 450.0 Cr', trend: '4 Mega Projects Active', icon: Wallet, color: 'pink' },
    { title: 'Overall Physical Progress', value: '68.5%', trend: 'Ahead of Schedule (+14 Days)', icon: TrendingUp, color: 'cyan' },
    { title: 'Total Budget Spent', value: '₹ 48.62 Cr', trend: '₹ 19.53 Cr Contingency Safe', icon: DollarSign, color: 'purple' },
    { title: 'Safety & Quality Rating', value: '98.5%', trend: 'GRIHA 5-Star Certified', icon: ShieldCheck, color: 'magenta' },
  ];

  const telemetryCards = [
    { title: 'Approved Milestone IPCs', value: '₹ 48.62 Cr', subDenom: '71.3%', trend: 'Fully Certified', icon: DollarSign, color: 'cyan' },
    { title: 'Critical Path Milestones', value: '18 of 22 Met', trend: 'On Schedule', icon: TrendingUp, color: 'purple' },
    { title: 'Active Construction Sites', value: '4 Sites', trend: '24/7 Monitored', icon: Building2, color: 'magenta' },
    { title: 'Drone Orthomosaics', value: '32 Scans', trend: 'Updated Yesterday', icon: Camera, color: 'teal' },
    { title: 'Executive Approvals', value: '2 Pending', trend: 'Fast-Track Active', icon: FileSignature, color: 'cyan' },
    { title: 'Asset Handover Readiness', value: '74.2%', trend: 'Phase 1 Q4 2024', icon: CheckCircle2, color: 'teal' },
    { title: 'Carbon Offset Savings', value: '420 Tons CO2', trend: 'Solar + Recycled RMC', icon: ShieldCheck, color: 'magenta' },
    { title: 'AI Completion Forecast', value: 'Nov 2024', trend: '98.2% Probability', icon: Bot, color: 'magenta' },
  ];

  const platformOverview = {
    title: 'Client Portfolio Execution Status',
    subtitle: 'High-level real estate assets progress',
    totalCount: '4',
    totalLabel: 'PROJECTS',
    items: [
      { name: 'Skyline Pinnacle Towers (Residential 45 Fl)', count: '78% Done', percent: '78.0%', color: 'green' },
      { name: 'Horizon Business Park (Commercial IT SEZ)', count: '65% Done', percent: '65.0%', color: 'yellow' },
      { name: 'Greenfield Eco-Villas (Luxury Gated Community)', count: '54% Done', percent: '54.0%', color: 'purple' },
      { name: 'Civic Urban Transit Terminal (Public Infra)', count: '42% Done', percent: '42.0%', color: 'cyan' },
      { name: 'Phase 2 Expansion (Pre-Construction)', count: 'Design', percent: '10.0%', color: 'pink' },
    ]
  };

  const statusList = {
    title: 'Key Project Milestones & Approvals',
    viewAllTab: 'approvals',
    items: [
      { name: 'Skyline Tower A: Level 30 Structural Slab Pour', status: 'Passed (Ahead)', badgeClass: 'active' },
      { name: 'Horizon IT Park: High-Performance Glazing Delivery', status: 'On Track', badgeClass: 'active' },
      { name: 'Greenfield Villas: Solar Microgrid Grid-Tie NOC', status: 'Submitted', badgeClass: 'training' },
      { name: 'Executive Signoff: Phase 2 Landscape Masterplan', status: 'Action Required', badgeClass: 'testing' },
      { name: 'Quarterly Project Investor Distribution Report', status: 'Published', badgeClass: 'deploying' },
    ]
  };

  const recentActivities = {
    title: 'Executive Intelligence & Decision Log',
    viewAllTab: 'projects',
    items: [
      { icon: Building2, text: "4K Drone Orthomosaic aerial flight completed for Skyline Towers Phase 1", time: '10:15 AM', color: 'purple' },
      { icon: DollarSign, text: 'Quarterly budget variance review certified: ₹ 1.45 Cr under baseline budget', time: '09:42 AM', color: 'cyan' },
      { icon: Bot, text: 'AI Client Copilot generated executive brief for Board of Directors meeting', time: '09:30 AM', color: 'green' },
      { icon: ShieldCheck, text: 'LEED Gold pre-certification audit successfully cleared for Horizon IT Park', time: '08:55 AM', color: 'blue' },
      { icon: FileSignature, text: 'Architectural interior mock-up signoff completed for VIP Penthouse', time: '08:30 AM', color: 'red' },
    ]
  };

  const scoreGauge = {
    title: 'Portfolio Health & Milestone Score',
    score: '98',
    scoreMax: '/100',
    scoreLabel: 'PORTFOLIO HEALTH',
    statusText: 'Exemplary',
    viewAllTab: 'timeline',
    breakdown: [
      { name: 'Projects Ahead of Target', num: '3 Projects', color: 'green' },
      { name: 'Projects On Target', num: '1 Project', color: 'yellow' },
      { name: 'Schedule Advisory', num: '0 Projects', color: 'purple' },
      { name: 'Cost Overrun Danger', num: '0 Projects', color: 'red' },
    ],
    footerText: 'Governance: RERA / ISO 9001 / GRIHA Green Certified',
    safeText: '🛡 100% Milestone Compliance'
  };

  return (
    <CyberPortalLayout
      portalName="Client & Owner"
      portalSubtitle="EXECUTIVE CLIENT & PROJECT OWNER PORTAL"
      userName="Aaditya Birla"
      userRole="Managing Director & Asset Owner"
      userAvatar="https://i.pravatar.cc/150?img=68"
      navGroups={navGroups}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      copilotTitle="AI Client Advisory Copilot"
      copilotDesc="Ask me anything about project milestones, cash flow ROI & 3D drone progress"
      copilotTabId="ai"
      kpiCards={kpiCards}
      telemetryCards={telemetryCards}
      platformOverview={platformOverview}
      statusList={statusList}
      recentActivities={recentActivities}
      scoreGauge={scoreGauge}
    >
      {activeTab === 'projects' && <ClientProjectsModule />}
      {activeTab === 'bim' && <ClientBimModule />}
      {activeTab === 'twin' && <ClientTwinModule />}
      {activeTab === 'drone' && <ClientDroneModule />}
      {activeTab === 'timeline' && <ClientTimelineModule />}
      {activeTab === 'finance' && <ClientFinanceModule />}
      {activeTab === 'approvals' && <ClientApprovalModule />}
      {activeTab === 'reports' && <ClientReportsModule />}
      {activeTab === 'settings' && <ClientPortfolioModule />}
      {activeTab === 'ai' && <ClientAiCenterModule />}
      {activeTab === 'esg' && <ClientEsgModule />}
      {activeTab === 'handover' && <ClientHandoverModule />}
      {activeTab === 'collab' && <ClientCollabModule />}
    </CyberPortalLayout>
  );
}
