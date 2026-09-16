import React, { useState } from 'react';
import {
  Activity,
  AlertTriangle,
  Bot,
  Box,
  Building,
  CheckCircle2,
  FileText,
  Hammer,
  Layers,
  Settings,
  ShieldAlert,
  ShieldCheck,
  TrendingUp,
  Waves,
  Wind,
  Zap
} from 'lucide-react';
import CyberPortalLayout from '../components/CyberPortalLayout';
import {
  StrWorkspaceModule, StrModelingModule, LoadAnalysisModule, ConcreteDesignModule,
  SteelDesignModule, FoundationDesignModule, ColumnDesignModule, BeamDesignModule,
  SlabDesignModule, WallDesignModule, StairDesignModule, RoofDesignModule, 
  ConnectionDesignModule, ReinforcementModule, StrBIMModule, StrClashModule,
  StrSimulationModule, SeismicModule, WindModule, VibrationModule, HealthMonitorModule,
  StrMaterialModule, StrBOQModule, StrConstSupportModule, StrInspectionModule,
  StrQualityModule, StrSafetyModule, StrDigitalTwinModule, StrGISModule,
  StrDocsModule, StrReportsModule, StrCollabModule, StrApprovalModule, StrAIMLModule
} from '../components/StructuralModules';

export default function StructuralEngineer() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const navGroups = [
    {
      title: 'ANALYSIS & DESIGN',
      color: 'pink',
      items: [
        { id: 'workspace', label: 'Structural FEM Workspace', icon: Box },
        { id: 'loads', label: 'Dead/Live/Wind Load Cases', icon: Zap },
        { id: 'concrete', label: 'RCC Concrete Design (IS 456)', icon: Hammer },
        { id: 'steel', label: 'Structural Steel Design (IS 800)', icon: Building },
        { id: 'rebar', label: 'Rebar BBS & Detailing', icon: Layers },
        { id: 'seismic', label: 'Seismic Zone V Response Spectrum', icon: Waves },
        { id: 'wind', label: 'Wind Tunnel & CFD Aerodynamics', icon: Wind },
        { id: 'shm', label: 'Structural Health Monitoring (SHM)', icon: Activity },
        { id: 'reports', label: 'Calculation Reports & GFC', icon: FileText },
        { id: 'settings', label: 'Settings', icon: Settings },
      ]
    },
    {
      title: 'INTELLIGENCE & AI',
      color: 'cyan',
      items: [
        { id: 'ai', label: 'AI Structural Copilot', icon: Bot, badge: 'NEW' },
        { id: 'clash', label: 'Rebar Congestion & Clashes', icon: AlertTriangle },
        { id: 'inspection', label: 'Site Non-Destructive Tests (NDT)', icon: CheckCircle2 },
        { id: 'approval', label: 'Design Approval & Signoffs', icon: ShieldCheck },
      ]
    }
  ];

  const kpiCards = [
    { title: 'Structural Safety Factor', value: '1.50 Min', trend: 'IS 456:2000 Compliant', icon: ShieldCheck, color: 'pink' },
    { title: 'Total Steel Weight', value: '4,280 MT', trend: '↑ 12.4% vs last month', icon: Building, color: 'cyan' },
    { title: 'Finite Element Nodes', value: '148,920', trend: 'High-Fidelity Mesh', icon: Box, color: 'purple' },
    { title: 'Seismic Base Shear', value: '14.2 MN', trend: 'Ductile Detailing (IS 13920)', icon: Waves, color: 'magenta' },
  ];

  const telemetryCards = [
    { title: 'Max Drift Ratio', value: 'H / 480', subDenom: 'Allowable H/250', trend: 'Safe Sway Limit', icon: Wind, color: 'cyan' },
    { title: 'Max Column Stress', value: '0.62 fck', trend: 'Within P-M Boundary', icon: Hammer, color: 'purple' },
    { title: 'Rebar Steel Index', value: '88 kg/m³', trend: 'Optimized BBS', icon: Layers, color: 'magenta' },
    { title: 'Vibration Natural Freq', value: '1.42 Hz', trend: 'Human Comfort OK', icon: Activity, color: 'teal' },
    { title: 'Shear Wall Thickness', value: '350 mm M50', trend: 'Core Stability Verified', icon: Building, color: 'cyan' },
    { title: 'Deflection Max', value: '14.2 mm', subDenom: 'L/350 Limit', trend: 'Passed Code', icon: Box, color: 'teal' },
    { title: 'Clash Flags', value: '0 High / 4 Minor', trend: 'Rebar Clear', icon: AlertTriangle, color: 'magenta' },
    { title: 'AI FEM Solver', value: '0.8s Solved', trend: 'GPU Accelerated', icon: Bot, color: 'magenta' },
  ];

  const platformOverview = {
    title: 'Finite Element Model Load Combinations',
    subtitle: 'Limit state design load case envelope',
    totalCount: '48',
    totalLabel: 'LOAD CASES',
    items: [
      { name: '1.5 (Dead Load + Live Load)', count: '16 Cases', percent: '33.3%', color: 'green' },
      { name: '1.2 (DL + LL ± Seismic X/Y)', count: '12 Cases', percent: '25.0%', color: 'yellow' },
      { name: '1.5 (DL ± Wind Pressure 0°/90°)', count: '10 Cases', percent: '20.8%', color: 'purple' },
      { name: '0.9 DL ± 1.5 Seismic (Overturning)', count: '6 Cases', percent: '12.5%', color: 'cyan' },
      { name: 'Serviceability Deflection Checks', count: '4 Cases', percent: '8.4%', color: 'pink' },
    ]
  };

  const statusList = {
    title: 'Critical Member Utilization Ratio (UR)',
    viewAllTab: 'workspace',
    items: [
      { name: 'Core Shear Wall SW-01 (Basement 2)', status: 'UR 0.82 (Safe)', badgeClass: 'active' },
      { name: 'Transfer Girder TG-04 (Level 4)', status: 'UR 0.78 (Safe)', badgeClass: 'active' },
      { name: 'Edge Column C-12 (Ground Floor)', status: 'UR 0.88 (Optimal)', badgeClass: 'deploying' },
      { name: 'Long-Span Post-Tensioned Slab S-02', status: 'UR 0.65 (Safe)', badgeClass: 'active' },
      { name: 'Steel Truss Roof Outrigger Node N-42', status: 'UR 0.74 (Safe)', badgeClass: 'training' },
    ]
  };

  const recentActivities = {
    title: 'Structural Design Dispatch',
    viewAllTab: 'workspace',
    items: [
      { icon: Box, text: "Non-Linear Time History (NLTH) Earthquake Analysis completed", time: '10:15 AM', color: 'purple' },
      { icon: Hammer, text: 'Bar Bending Schedule (BBS) Rev 3 released for Foundation Raft', time: '09:42 AM', color: 'cyan' },
      { icon: Bot, text: 'AI Genetic Optimizer reduced rebar consumption by 8.4 MT', time: '09:30 AM', color: 'green' },
      { icon: ShieldCheck, text: 'Peer Review Structural Integrity Certificate stamped', time: '08:55 AM', color: 'blue' },
      { icon: Activity, text: 'SHM Strain gauge baseline zeroed on Tower A Level 12', time: '08:30 AM', color: 'red' },
    ]
  };

  const scoreGauge = {
    title: 'Structural Integrity & Safety Score',
    score: '99',
    scoreMax: '/100',
    scoreLabel: 'SAFETY SCORE',
    statusText: 'Faultless',
    viewAllTab: 'shm',
    breakdown: [
      { name: 'Overdesign Margin (UR < 0.90)', num: '1,420 Elements', color: 'green' },
      { name: 'High Utilization (0.90 < UR < 0.95)', num: '12 Elements', color: 'yellow' },
      { name: 'Recheck Advisory', num: '0 Elements', color: 'purple' },
      { name: 'Overstressed (UR > 1.0)', num: '0 Elements', color: 'red' },
    ],
    footerText: 'Design Basis: IS 456 / IS 1893:2016 / IS 13920',
    safeText: '🛡 Certified Structural Safety'
  };

  return (
    <CyberPortalLayout
      portalName="Structural Engineer"
      portalSubtitle="STRUCTURAL ENGINEERING & SEISMIC DESIGN PORTAL"
      userName="Elena Rostova"
      userRole="Lead Structural Design Engineer"
      userAvatar="https://i.pravatar.cc/150?img=49"
      navGroups={navGroups}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      copilotTitle="AI Structural Copilot"
      copilotDesc="Ask me anything about FEM analysis, rebar BBS, seismic loads & IS codes"
      copilotTabId="ai"
      kpiCards={kpiCards}
      telemetryCards={telemetryCards}
      platformOverview={platformOverview}
      statusList={statusList}
      recentActivities={recentActivities}
      scoreGauge={scoreGauge}
    >
      {activeTab === 'workspace' && <StrWorkspaceModule />}
      {activeTab === 'loads' && <LoadAnalysisModule />}
      {activeTab === 'concrete' && <ConcreteDesignModule />}
      {activeTab === 'steel' && <SteelDesignModule />}
      {activeTab === 'rebar' && <ReinforcementModule />}
      {activeTab === 'seismic' && <SeismicModule />}
      {activeTab === 'wind' && <WindModule />}
      {activeTab === 'shm' && <HealthMonitorModule />}
      {activeTab === 'reports' && <StrReportsModule />}
      {activeTab === 'settings' && <StrDocsModule />}
      {activeTab === 'ai' && <StrAIMLModule />}
      {activeTab === 'clash' && <StrClashModule />}
      {activeTab === 'inspection' && <StrInspectionModule />}
      {activeTab === 'approval' && <StrApprovalModule />}
    </CyberPortalLayout>
  );
}
