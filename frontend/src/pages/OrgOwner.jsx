import React, { useState } from 'react';
import {
  Activity,
  AlertTriangle,
  Bot,
  Box,
  Brain,
  Briefcase,
  Building2,
  CheckCircle2,
  DollarSign,
  FileSignature,
  FileText,
  Globe,
  HardHat,
  Layers,
  Settings,
  ShieldCheck,
  TrendingUp,
  Users,
  Wallet,
  Zap
} from 'lucide-react';
import CyberPortalLayout from '../components/CyberPortalLayout';
import {
  OrgProfileModule, BusinessAnalyticsModule, PortfolioModule, ProjectManagementModule,
  DepartmentModule, EmployeeModule, WorkforceModule, OrgRolesModule, ClientModule,
  ContractorModule, VendorModule, ProcurementModule, OrgFinanceModule, ResourceModule,
  AssetModule, EquipmentModule, OrgBIMModule, OrgDigitalTwinModule, OrgGISModule,
  OrgIoTModule, OrgAIMLModule, ReportsModule, OrgRiskModule, OrgComplianceModule,
  OrgSustainabilityModule, OrgSecurityModule, OrgAPIModule, OrgSettingsModule, OrgCopilotInterface
} from '../components/OrgModules';

export default function OrgOwner() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const navGroups = [
    {
      title: 'ENTERPRISE GOVERNANCE',
      color: 'pink',
      items: [
        { id: 'portfolio', label: 'Global Projects Portfolio', icon: Building2 },
        { id: 'analytics', label: 'Executive Business Analytics', icon: TrendingUp },
        { id: 'finance', label: 'Enterprise Financials & EBITDA', icon: DollarSign },
        { id: 'departments', label: 'Departments & Workforce Hub', icon: Users },
        { id: 'clients', label: 'Client Accounts & Contracts', icon: Briefcase },
        { id: 'procurement', label: 'Enterprise Supply Chain & SCM', icon: Wallet },
        { id: 'bimtwin', label: 'Global 3D BIM & Digital Twins', icon: Box },
        { id: 'reports', label: 'C-Suite Executive Reports', icon: FileText },
        { id: 'settings', label: 'Settings', icon: Settings },
      ]
    },
    {
      title: 'STRATEGIC INTELLIGENCE',
      color: 'cyan',
      items: [
        { id: 'ai', label: 'AI Enterprise Copilot', icon: Bot, badge: 'NEW' },
        { id: 'risk', label: 'Enterprise Risk & Governance', icon: AlertTriangle },
        { id: 'esg', label: 'Global ESG & Carbon Neutrality', icon: ShieldCheck },
        { id: 'security', label: 'Cybersecurity & IAM RBAC', icon: Activity },
      ]
    }
  ];

  const kpiCards = [
    { title: 'Enterprise Revenue (ARR)', value: '₹ 845.0 Cr', trend: '↑ 24.8% YoY Growth', icon: DollarSign, color: 'pink' },
    { title: 'Global Active Projects', value: '48 Mega Sites', trend: '4 Countries / 12 Cities', icon: Building2, color: 'cyan' },
    { title: 'Average Project Margin', value: '18.4% EBITDA', trend: '↑ 2.2% vs baseline', icon: TrendingUp, color: 'purple' },
    { title: 'Enterprise Workforce', value: '4,280 Employees', trend: '98.6% Retention Rate', icon: Users, color: 'magenta' },
  ];

  const telemetryCards = [
    { title: 'Portfolio Projects', value: '48 Sites', trend: '88% On Schedule', icon: Building2, color: 'cyan' },
    { title: 'EBITDA Profitability', value: '₹ 155.4 Cr', trend: 'Healthy Cash Flow', icon: DollarSign, color: 'purple' },
    { title: 'Active Client Contracts', value: '34 Clients', trend: '100% Retained', icon: Briefcase, color: 'magenta' },
    { title: 'Vendor Spend Managed', value: '₹ 340.0 Cr', trend: 'ISO 9001 Audited', icon: Wallet, color: 'teal' },
    { title: 'Connected Digital Twins', value: '48 Twins', trend: 'Real-Time Telemetry', icon: Box, color: 'cyan' },
    { title: 'Enterprise ESG Index', value: 'GRIHA 5-Star', trend: 'Net Zero by 2030', icon: ShieldCheck, color: 'teal' },
    { title: 'Open Executive Approvals', value: '3 Pending', trend: 'Fast-Track Active', icon: FileSignature, color: 'magenta' },
    { title: 'AI Portfolio Forecast', value: '99.2% Acc', trend: 'Predictive ROI Engine', icon: Bot, color: 'magenta' },
  ];

  const platformOverview = {
    title: 'Global Portfolio Health Distribution',
    subtitle: 'High-level real estate & infrastructure projects status',
    totalCount: '48',
    totalLabel: 'PROJECTS',
    items: [
      { name: 'Commercial High-Rise & IT Parks', count: '22 Sites', percent: '45.8%', color: 'green' },
      { name: 'Luxury Residential & Townships', count: '14 Sites', percent: '29.2%', color: 'yellow' },
      { name: 'Metro Rail & Highway Infrastructure', count: '7 Sites', percent: '14.6%', color: 'purple' },
      { name: 'Industrial Logistics & Data Centers', count: '5 Sites', percent: '10.4%', color: 'cyan' },
    ]
  };

  const statusList = {
    title: 'Strategic Enterprise Milestones',
    viewAllTab: 'portfolio',
    items: [
      { name: 'Mumbai Metro Phase 3 Underground Terminal', status: 'Ahead of Target', badgeClass: 'active' },
      { name: 'Bengaluru Tech Park SEZ (2.4M sq ft)', status: 'On Track (82%)', badgeClass: 'active' },
      { name: 'Dubai Marina Luxury Tower (65 Floors)', status: 'Topping Out', badgeClass: 'deploying' },
      { name: 'Hyderabad Hyperscale Green Data Center', status: 'Commissioning', badgeClass: 'active' },
      { name: 'Delhi Smart Highway Greenfield Corridor', status: 'Paving Phase', badgeClass: 'training' },
    ]
  };

  const recentActivities = {
    title: 'C-Suite Executive Activity Feed',
    viewAllTab: 'portfolio',
    items: [
      { icon: DollarSign, text: "Annual Financial Audit certified: ₹ 845 Cr revenue milestone achieved", time: '10:15 AM', color: 'purple' },
      { icon: Building2, text: 'New ₹ 320 Cr EPC contract secured for Hyderabad Green Data Center', time: '09:42 AM', color: 'cyan' },
      { icon: Bot, text: 'AI Enterprise Copilot delivered predictive margin analysis for Board Meeting', time: '09:30 AM', color: 'green' },
      { icon: ShieldCheck, text: 'Global ESG Carbon Neutrality Certificate awarded by Green Building Council', time: '08:55 AM', color: 'blue' },
      { icon: Briefcase, text: 'Quarterly investor distribution approved: 18.4% return on invested capital', time: '08:30 AM', color: 'red' },
    ]
  };

  const scoreGauge = {
    title: 'Enterprise Business & Governance Score',
    score: '99',
    scoreMax: '/100',
    scoreLabel: 'ENTERPRISE HEALTH',
    statusText: 'World-Class',
    viewAllTab: 'analytics',
    breakdown: [
      { name: 'Profitable Active Sites', num: '46 Projects', color: 'green' },
      { name: 'Break-Even Delivery Sites', num: '2 Projects', color: 'yellow' },
      { name: 'Financial Distress', num: '0 Projects', color: 'purple' },
      { name: 'Regulatory Violations', num: '0 Projects', color: 'red' },
    ],
    footerText: 'Enterprise Standard: ISO 9001 / ISO 14001 / ISO 27001 / RERA',
    safeText: '🛡 100% Enterprise Solvency'
  };

  return (
    <CyberPortalLayout
      portalName="Organization Owner"
      portalSubtitle="ENTERPRISE OWNER & C-SUITE GOVERNANCE PORTAL"
      userName="Vikramaditya Singhania"
      userRole="Chairman & Chief Executive Officer"
      userAvatar="https://i.pravatar.cc/150?img=60"
      navGroups={navGroups}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      copilotTitle="AI Enterprise Copilot"
      copilotDesc="Ask me anything about enterprise financials, global portfolio ROI & risk"
      copilotTabId="ai"
      kpiCards={kpiCards}
      telemetryCards={telemetryCards}
      platformOverview={platformOverview}
      statusList={statusList}
      recentActivities={recentActivities}
      scoreGauge={scoreGauge}
    >
      {activeTab === 'portfolio' && <PortfolioModule />}
      {activeTab === 'analytics' && <BusinessAnalyticsModule />}
      {activeTab === 'finance' && <OrgFinanceModule />}
      {activeTab === 'departments' && <DepartmentModule />}
      {activeTab === 'clients' && <ClientModule />}
      {activeTab === 'procurement' && <ProcurementModule />}
      {activeTab === 'bimtwin' && <OrgBIMModule />}
      {activeTab === 'reports' && <ReportsModule />}
      {activeTab === 'settings' && <OrgSettingsModule />}
      {activeTab === 'ai' && <OrgAIMLModule />}
      {activeTab === 'risk' && <OrgRiskModule />}
      {activeTab === 'esg' && <OrgSustainabilityModule />}
      {activeTab === 'security' && <OrgSecurityModule />}
    </CyberPortalLayout>
  );
}
