import React, { useState } from 'react';
import {
  Activity,
  AlertTriangle,
  BarChart3,
  Bot,
  Box,
  Building,
  Camera,
  CheckCircle2,
  Clock,
  Eye,
  FileCheck,
  FileText,
  Layers,
  Link,
  Map,
  MessageSquare,
  RotateCcw,
  Settings,
  ShieldCheck,
  TrendingUp,
  Users,
  Wifi
} from 'lucide-react';
import CyberPortalLayout from '../components/CyberPortalLayout';
import {
  BimCommandModule, CdeModule, FederatedModule, BimCoordinationModule, ViewerModule,
  ClashModule, QualityModule, BimAIMLModule, BimStandardsModule, DocumentsModule,
  RfiModule, QuantityTakeoffModule, Construction4DModule, DigitalTwinModule,
  ReportsModule, SettingsModule, IfcModule, CobieModule, PointCloudModule,
  GisModule, VersionControlModule, ApiModule
} from '../components/BimModules';

export default function BimManager() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const navGroups = [
    {
      title: 'MAIN MENU',
      color: 'pink',
      items: [
        { id: 'command', label: 'BIM Command Center', icon: Activity },
        { id: 'cde', label: 'CDE (Common Data Env.)', icon: Box },
        { id: 'federated', label: 'Federated Models', icon: Layers },
        { id: 'coord', label: 'BIM Coordination', icon: Link },
        { id: 'viewer', label: 'Model Viewer', icon: Eye },
        { id: 'clash', label: 'Clash Detection', icon: AlertTriangle },
        { id: 'quality', label: 'Model Quality', icon: CheckCircle2 },
        { id: 'standards', label: 'BIM Standards', icon: ShieldCheck },
        { id: 'docs', label: 'Documents', icon: FileText },
        { id: 'rfi', label: 'RFI & Issues', icon: MessageSquare },
        { id: 'qty', label: 'Quantity Takeoff (5D)', icon: BarChart3 },
        { id: '4d', label: '4D Construction', icon: Clock },
        { id: 'twin', label: 'Digital Twin', icon: Activity },
        { id: 'reports', label: 'Reports & Analytics', icon: TrendingUp },
        { id: 'settings', label: 'Settings', icon: Settings },
      ]
    },
    {
      title: 'TOOLS & UTILITIES',
      color: 'cyan',
      items: [
        { id: 'ai', label: 'AI BIM Copilot', icon: Bot, badge: 'NEW' },
        { id: 'ifc', label: 'IFC Manager', icon: FileCheck },
        { id: 'cobie', label: 'COBie Manager', icon: Box },
        { id: 'point', label: 'Point Cloud Processing', icon: Camera },
        { id: 'gis', label: 'GIS Integration', icon: Map },
        { id: 'vc', label: 'Version Control', icon: RotateCcw },
        { id: 'api', label: 'API & Integrations', icon: Wifi },
      ]
    }
  ];

  const kpiCards = [
    { title: 'Total Projects', value: '12', trend: '↑ 12.4% vs last month', icon: Building, color: 'pink' },
    { title: 'Federated Models', value: '24', trend: '↑ 18.7% vs last month', icon: Box, color: 'cyan' },
    { title: 'Total BIM Objects', value: '2.48 M', trend: '↑ 15.6% vs last month', icon: Layers, color: 'purple' },
    { title: 'Resolved Clashes', value: '1,248', trend: '↑ 18.4% vs last month', icon: CheckCircle2, color: 'magenta' },
  ];

  const telemetryCards = [
    { title: 'Active Projects', value: '12', trend: '↑ 8.4% vs last month', icon: Building, color: 'cyan' },
    { title: 'Open Clashes', value: '156', trend: '↓ 12 vs last month', icon: AlertTriangle, color: 'purple' },
    { title: 'LOD Progress', value: '68%', subDenom: 'LOD 500', trend: '↑ 6.0% vs last month', icon: Activity, color: 'magenta' },
    { title: 'IFC Models', value: '42', trend: '↑ 14.5% vs last month', icon: FileCheck, color: 'teal' },
    { title: 'COBie Records', value: '8.6K', trend: '↑ 8.1% vs last month', icon: Box, color: 'cyan' },
    { title: 'Point Cloud Scans', value: '28', trend: '↑ 11.2% vs last month', icon: Camera, color: 'teal' },
    { title: 'Open RFIs', value: '14', subDenom: 'active', trend: '↓ 4 vs last month', icon: MessageSquare, color: 'magenta' },
    { title: 'AI BIM Score', value: '88/100', trend: '↑ 4.2% vs last month', icon: Bot, color: 'magenta' },
  ];

  const platformOverview = {
    title: 'BIM Discipline Overview',
    subtitle: 'Federated multi-discipline breakdown',
    totalCount: '24',
    totalLabel: 'MODELS',
    items: [
      { name: 'Architecture', count: '5', percent: '20.8%', color: 'green' },
      { name: 'Structure', count: '5', percent: '20.8%', color: 'yellow' },
      { name: 'MEP Systems', count: '6', percent: '25.0%', color: 'purple' },
      { name: 'Civil & Infra', count: '4', percent: '16.7%', color: 'cyan' },
      { name: 'Landscape & Fire', count: '4', percent: '16.7%', color: 'pink' },
    ]
  };

  const statusList = {
    title: 'Clash Detection Matrix',
    viewAllTab: 'clash',
    items: [
      { name: 'Hard Clashes (Arch vs Struct)', status: 'Active (48)', badgeClass: 'training' },
      { name: 'Soft Clashes (MEP Clearance)', status: 'Review (62)', badgeClass: 'testing' },
      { name: 'Clearance Clashes (HVAC Duct)', status: 'Resolving (28)', badgeClass: 'deploying' },
      { name: 'Duplicate Geometries', status: 'Fixed (12)', badgeClass: 'active' },
      { name: 'Tolerance Violations', status: 'Closed (6)', badgeClass: 'inactive' },
    ]
  };

  const recentActivities = {
    title: 'BIM Coordination Activities',
    viewAllTab: 'coord',
    items: [
      { icon: Layers, text: "Federated Model 'Skyline Phase 1 Rev 4' published", time: '10:15 AM', color: 'purple' },
      { icon: AlertTriangle, text: '24 HVAC duct clashes resolved by MEP Engineer', time: '09:42 AM', color: 'cyan' },
      { icon: Bot, text: 'AI Copilot generated automated IFC clash report', time: '09:30 AM', color: 'green' },
      { icon: CheckCircle2, text: 'Structural model LOD 350 validation approved', time: '08:55 AM', color: 'blue' },
      { icon: FileText, text: 'COBie spreadsheet export completed for Facility Mgr', time: '08:30 AM', color: 'red' },
    ]
  };

  const scoreGauge = {
    title: 'BIM Quality & LOD Index',
    score: '94',
    scoreMax: '/100',
    scoreLabel: 'QUALITY INDEX',
    statusText: 'Excellent',
    viewAllTab: 'quality',
    breakdown: [
      { name: 'LOD 350+ Ready', num: '18', color: 'green' },
      { name: 'LOD 300 In Review', num: '5', color: 'yellow' },
      { name: 'Minor Warnings', num: '1', color: 'purple' },
      { name: 'Critical Errors', num: '0', color: 'red' },
    ],
    footerText: 'Last validation: 5 min ago',
    safeText: '🛡 0 Critical Errors'
  };

  return (
    <CyberPortalLayout
      portalName="BIM Manager"
      portalSubtitle="BIM MANAGEMENT & COORDINATION PORTAL"
      userName="Arun Kumar"
      userRole="BIM Manager"
      userAvatar="https://i.pravatar.cc/150?img=11"
      navGroups={navGroups}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      copilotTitle="AI BIM Copilot"
      copilotDesc="Ask me anything about BIM coordination & clash detection"
      copilotTabId="ai"
      kpiCards={kpiCards}
      telemetryCards={telemetryCards}
      platformOverview={platformOverview}
      statusList={statusList}
      recentActivities={recentActivities}
      scoreGauge={scoreGauge}
    >
      {activeTab === 'command' && <BimCommandModule />}
      {activeTab === 'cde' && <CdeModule />}
      {activeTab === 'federated' && <FederatedModule />}
      {activeTab === 'coord' && <BimCoordinationModule />}
      {activeTab === 'viewer' && <ViewerModule />}
      {activeTab === 'clash' && <ClashModule />}
      {activeTab === 'quality' && <QualityModule />}
      {activeTab === 'standards' && <BimStandardsModule />}
      {activeTab === 'docs' && <DocumentsModule />}
      {activeTab === 'rfi' && <RfiModule />}
      {activeTab === 'qty' && <QuantityTakeoffModule />}
      {activeTab === '4d' && <Construction4DModule />}
      {activeTab === 'twin' && <DigitalTwinModule />}
      {activeTab === 'reports' && <ReportsModule />}
      {activeTab === 'settings' && <SettingsModule />}
      {activeTab === 'ai' && <BimAIMLModule />}
      {activeTab === 'ifc' && <IfcModule />}
      {activeTab === 'cobie' && <CobieModule />}
      {activeTab === 'point' && <PointCloudModule />}
      {activeTab === 'gis' && <GisModule />}
      {activeTab === 'vc' && <VersionControlModule />}
      {activeTab === 'api' && <ApiModule />}
    </CyberPortalLayout>
  );
}
