import React, { useState } from 'react';
import {
  Activity,
  Bot,
  Box,
  Building,
  Camera,
  CheckCircle2,
  Eye,
  FileText,
  Layers,
  Palette,
  PenTool,
  Settings,
  ShieldCheck,
  Sun,
  TrendingUp,
  Users
} from 'lucide-react';
import CyberPortalLayout from '../components/CyberPortalLayout';
import {
  DesignWorkspaceModule, Modeler3DModule, BIMDesignModule, FloorPlanModule, SpacePlanModule,
  ConceptDesignModule, MaterialLibraryModule, FacadeModule, InteriorModule, RenderStudioModule,
  CodeComplianceModule, ArchSustainabilityModule, ClashDetectionModule, DrawingMgmtModule,
  ArchAIMLModule, SitePlanModule, ParametricModule, FurnitureModule, LandscapeModule,
  ExteriorVisModule, LightingSimModule, SunPathModule, WindFlowModule, ThermalModule,
  EnergyModule, AccessComplianceModule, DesignReviewModule, DesignCollabModule,
  DocsCenterModule, VersionControlModule, ClientPresModule, VRARModule, TwinPreviewModule,
  GISViewerModule, ArchReportsModule, ArchApprovalModule, ArchNotifModule, ArchSettingsModule
} from '../components/ArchitectModules';

export default function Architect() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const navGroups = [
    {
      title: 'DESIGN & MODELING',
      color: 'pink',
      items: [
        { id: 'workspace', label: 'Design Studio Workspace', icon: PenTool },
        { id: 'modeler', label: '3D Architectural Modeler', icon: Box },
        { id: 'floorplan', label: 'Floor Plans & Layouts', icon: Layers },
        { id: 'facade', label: 'Facade & Envelope Design', icon: Building },
        { id: 'interior', label: 'Interior & Space Planning', icon: Palette },
        { id: 'render', label: 'Photoreal Render Studio', icon: Camera },
        { id: 'sunpath', label: 'Solar & Daylight Analysis', icon: Sun },
        { id: 'drawings', label: 'Construction Drawings (GFC)', icon: FileText },
        { id: 'settings', label: 'Settings', icon: Settings },
      ]
    },
    {
      title: 'COMPLIANCE & AI',
      color: 'cyan',
      items: [
        { id: 'ai', label: 'AI Design Copilot', icon: Bot, badge: 'NEW' },
        { id: 'compliance', label: 'NBC & Building Bye-Laws', icon: ShieldCheck },
        { id: 'sustainability', label: 'Green Building (LEED/GRIHA)', icon: Activity },
        { id: 'clash', label: 'Arch vs Structural Clashes', icon: Layers },
        { id: 'collab', label: 'Multi-Discipline Review', icon: Users },
        { id: 'reports', label: 'Architectural Reports', icon: FileText },
      ]
    }
  ];

  const kpiCards = [
    { title: 'Active Design Projects', value: '18 Projects', trend: '↑ 14.5% vs last month', icon: Building, color: 'pink' },
    { title: 'Approved GFC Sheets', value: '420 Drawings', trend: '↑ 24.2% vs last month', icon: FileText, color: 'cyan' },
    { title: 'Code Compliance Score', value: '98.6%', trend: 'NBC 2024 Verified', icon: ShieldCheck, color: 'purple' },
    { title: 'Photoreal Renders', value: '1,420 Frames', trend: '4K Ultra-HD Ready', icon: Camera, color: 'magenta' },
  ];

  const telemetryCards = [
    { title: 'Design Iterations', value: '45 Revs', trend: '↑ 12.4% this week', icon: PenTool, color: 'cyan' },
    { title: 'Clash Resolution', value: '24 Resolved', trend: '0 High Severity', icon: Layers, color: 'purple' },
    { title: 'Daylight Autonomy', value: '78.4%', trend: 'LEED Gold Level', icon: Sun, color: 'magenta' },
    { title: 'Space Efficiency', value: '88.2%', trend: 'Optimized Carpet Area', icon: Box, color: 'teal' },
    { title: 'Facade Solar Heat', value: '↓ 32.4%', trend: 'Low-E Glazing', icon: Building, color: 'cyan' },
    { title: 'VR Client Tours', value: '14 Sessions', trend: '100% Client Signoff', icon: Eye, color: 'teal' },
    { title: 'Parametric Scripts', value: '64 Active', trend: 'Grasshopper / Python', icon: Bot, color: 'magenta' },
    { title: 'AI Concept Speed', value: '4.2s / layout', trend: 'GenAI Enabled', icon: Bot, color: 'magenta' },
  ];

  const platformOverview = {
    title: 'Design Stage Breakdown',
    subtitle: 'Project portfolio lifecycle distribution',
    totalCount: '18',
    totalLabel: 'PROJECTS',
    items: [
      { name: 'Concept & Schematic', count: '4 Projects', percent: '22.2%', color: 'green' },
      { name: 'Design Development (DD)', count: '6 Projects', percent: '33.3%', color: 'yellow' },
      { name: 'Statutory Approval (Municipal)', count: '3 Projects', percent: '16.7%', color: 'purple' },
      { name: 'Good For Construction (GFC)', count: '4 Projects', percent: '22.2%', color: 'cyan' },
      { name: 'As-Built Documentation', count: '1 Project', percent: '5.6%', color: 'pink' },
    ]
  };

  const statusList = {
    title: 'Municipal & Statutory Approvals',
    viewAllTab: 'compliance',
    items: [
      { name: 'Skyline Pinnacle - Fire NOC Clearance', status: 'Approved', badgeClass: 'active' },
      { name: 'Horizon Business Park - FAR & Height Clearance', status: 'In Review', badgeClass: 'training' },
      { name: 'Greenfield Villas - Environmental Impact Clearance', status: 'Submitted', badgeClass: 'deploying' },
      { name: 'Civic Center - Accessibility Barrier-Free Audit', status: 'Compliant', badgeClass: 'active' },
      { name: 'Metro Interchange - Structural Arch Peer Review', status: 'Pending', badgeClass: 'inactive' },
    ]
  };

  const recentActivities = {
    title: 'Architectural Design Log',
    viewAllTab: 'workspace',
    items: [
      { icon: PenTool, text: "GFC Floor Plan Level 14-22 approved by Principal Architect", time: '10:15 AM', color: 'purple' },
      { icon: Camera, text: 'Exterior 4K Dusk Aerial Render completed for Client Deck', time: '09:42 AM', color: 'cyan' },
      { icon: Bot, text: 'AI Design Copilot generated 4 parametric facade variations', time: '09:30 AM', color: 'green' },
      { icon: ShieldCheck, text: 'NBC Staircase egress width verification passed', time: '08:55 AM', color: 'blue' },
      { icon: Layers, text: 'Structural column shift adjusted in Arch Revit model', time: '08:30 AM', color: 'red' },
    ]
  };

  const scoreGauge = {
    title: 'Architectural Code & Design Index',
    score: '97',
    scoreMax: '/100',
    scoreLabel: 'DESIGN INDEX',
    statusText: 'World-Class',
    viewAllTab: 'sustainability',
    breakdown: [
      { name: 'GRIHA 5-Star Green Ready', num: '14 Projs', color: 'green' },
      { name: 'BIM LOD 350 Synchronized', num: '3 Projs', color: 'yellow' },
      { name: 'Minor Layout Revision', num: '1 Proj', color: 'purple' },
      { name: 'Non-Compliance Penalty', num: '0 Projs', color: 'red' },
    ],
    footerText: 'Design Standards: NBC 2024 / GRIHA / LEED v4.1',
    safeText: '🛡 Code Compliance Certified'
  };

  return (
    <CyberPortalLayout
      portalName="Architect"
      portalSubtitle="ARCHITECTURAL DESIGN & PLANNING PORTAL"
      userName="Sarah Jenkins"
      userRole="Chief Architect & Urban Planner"
      userAvatar="https://i.pravatar.cc/150?img=44"
      navGroups={navGroups}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      copilotTitle="AI Design Copilot"
      copilotDesc="Ask me anything about spatial planning, 3D renders & NBC codes"
      copilotTabId="ai"
      kpiCards={kpiCards}
      telemetryCards={telemetryCards}
      platformOverview={platformOverview}
      statusList={statusList}
      recentActivities={recentActivities}
      scoreGauge={scoreGauge}
    >
      {activeTab === 'workspace' && <DesignWorkspaceModule />}
      {activeTab === 'modeler' && <Modeler3DModule />}
      {activeTab === 'floorplan' && <FloorPlanModule />}
      {activeTab === 'facade' && <FacadeModule />}
      {activeTab === 'interior' && <InteriorModule />}
      {activeTab === 'render' && <RenderStudioModule />}
      {activeTab === 'sunpath' && <SunPathModule />}
      {activeTab === 'drawings' && <DrawingMgmtModule />}
      {activeTab === 'settings' && <ArchSettingsModule />}
      {activeTab === 'ai' && <ArchAIMLModule />}
      {activeTab === 'compliance' && <CodeComplianceModule />}
      {activeTab === 'sustainability' && <ArchSustainabilityModule />}
      {activeTab === 'clash' && <ClashDetectionModule />}
      {activeTab === 'collab' && <DesignCollabModule />}
      {activeTab === 'reports' && <ArchReportsModule />}
    </CyberPortalLayout>
  );
}
