import React, { useState } from 'react';
import {
  Activity,
  AlertTriangle,
  Bot,
  Box,
  Building,
  CheckCircle2,
  Compass,
  Cone,
  Droplet,
  FileText,
  Hammer,
  HardHat,
  Layers,
  Map,
  Pickaxe,
  Settings,
  ShieldCheck,
  TrendingUp,
  Truck,
  Users,
  Waves
} from 'lucide-react';
import CyberPortalLayout from '../components/CyberPortalLayout';
import {
  CivilWorkspaceModule, SiteDevelopmentModule, EarthworkModule, FoundationModule, 
  ConcreteModule, RoadModule, DrainageModule, UtilityModule, TopographyModule, 
  GeotechModule, QuantityModule, CivilAIMLModule, WaterSupplyModule, SewerageModule,
  ConstructionMonitorModule, MaterialEngModule, EquipmentCoordModule, BIMCivilModule,
  GISIntModule, CivilQualityModule, CivilSafetyModule, CivilEnvModule, CivilDocsModule,
  CivilReportsModule, CivilCollabModule, CivilApprovalModule
} from '../components/CivilModules';

export default function CivilEngineer() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const navGroups = [
    {
      title: 'CIVIL & INFRASTRUCTURE',
      color: 'pink',
      items: [
        { id: 'workspace', label: 'Civil Works Dashboard', icon: HardHat },
        { id: 'earthwork', label: 'Earthwork & Grading (Cut/Fill)', icon: Pickaxe },
        { id: 'foundation', label: 'Foundation & Piling (Deep/Shallow)', icon: Building },
        { id: 'concrete', label: 'Reinforced Concrete (RCC)', icon: Hammer },
        { id: 'roads', label: 'Roads & Pavement Infrastructure', icon: Truck },
        { id: 'drainage', label: 'Storm Drainage & Culverts', icon: Waves },
        { id: 'utilities', label: 'Wet Utilities & Water Supply', icon: Droplet },
        { id: 'geotech', label: 'Geotechnical Soil Analysis', icon: Compass },
        { id: 'quantities', label: 'BOQ & Quantity Extraction', icon: Layers },
        { id: 'settings', label: 'Settings', icon: Settings },
      ]
    },
    {
      title: 'QUALITY & AI ASSIST',
      color: 'cyan',
      items: [
        { id: 'ai', label: 'AI Civil Copilot', icon: Bot, badge: 'NEW' },
        { id: 'quality', label: 'Concrete Slump & Cube Tests', icon: CheckCircle2 },
        { id: 'safety', label: 'Site HSE & Trench Safety', icon: ShieldCheck },
        { id: 'monitor', label: 'Construction Progress Tracking', icon: TrendingUp },
        { id: 'reports', label: 'Civil Engineering Reports', icon: FileText },
      ]
    }
  ];

  const kpiCards = [
    { title: 'Earthwork Volume', value: '45,280 Cu M', trend: '↑ 14.8% vs last month', icon: Pickaxe, color: 'pink' },
    { title: 'Concrete Poured', value: '8,420 Cu M', trend: '↑ 18.2% vs last month', icon: Hammer, color: 'cyan' },
    { title: 'Road Infrastructure', value: '14.2 Km', trend: 'Grade & Paving Active', icon: Truck, color: 'purple' },
    { title: 'Quality Compliance', value: '99.2%', trend: 'IS 456 / MoRTH Standards', icon: ShieldCheck, color: 'magenta' },
  ];

  const telemetryCards = [
    { title: 'Cut/Fill Balance', value: '+420 Cu M', trend: 'Near-Zero Surplus', icon: Pickaxe, color: 'cyan' },
    { title: 'Piles Cast', value: '184 of 210', trend: '87.6% Completed', icon: Building, color: 'purple' },
    { title: 'Concrete 28-Day MPa', value: '38.4 MPa', subDenom: 'M35 Spec', trend: 'Exceeds Spec', icon: Hammer, color: 'magenta' },
    { title: 'Storm Drainage', value: '4.8 Km laid', trend: '↑ 12.4% this week', icon: Waves, color: 'teal' },
    { title: 'Soil Bearing Cap (SBC)', value: '240 kN/m²', trend: 'Safe Settlement', icon: Compass, color: 'cyan' },
    { title: 'Excavator Fleet', value: '12 Active', trend: 'Telematics Online', icon: Truck, color: 'teal' },
    { title: 'HSE Safety Hours', value: '142,000 hrs', trend: 'Zero LTI Incidents', icon: ShieldCheck, color: 'magenta' },
    { title: 'AI Soil Optimizer', value: 'Active', trend: 'Optimal Compaction', icon: Bot, color: 'magenta' },
  ];

  const platformOverview = {
    title: 'Work Package Execution Status',
    subtitle: 'Civil construction contract packages',
    totalCount: '12',
    totalLabel: 'PACKAGES',
    items: [
      { name: 'Site Clearing & Bulk Earthwork', count: 'Completed', percent: '100%', color: 'green' },
      { name: 'Raft & Piled Foundation', count: 'In Progress', percent: '88%', color: 'yellow' },
      { name: 'Substructure Retaining Walls', count: 'In Progress', percent: '65%', color: 'purple' },
      { name: 'External Drainage & Storm Network', count: 'In Progress', percent: '42%', color: 'cyan' },
      { name: 'Asphalt & Paver Finishing', count: 'Pending', percent: '10%', color: 'pink' },
    ]
  };

  const statusList = {
    title: 'Material Quality & Strength Tests',
    viewAllTab: 'quality',
    items: [
      { name: 'Foundation Raft M40 Concrete (Batch #42)', status: 'Passed (44.2 MPa)', badgeClass: 'active' },
      { name: 'Aggregate Crushing & Impact Test', status: 'Passed (IS 2386)', badgeClass: 'active' },
      { name: 'Compacted Soil Dry Density (Core Cutter)', status: 'Testing (98% MDD)', badgeClass: 'training' },
      { name: 'Fe500D TMT Rebar Tensile & Bend Test', status: 'Approved', badgeClass: 'deploying' },
      { name: 'HDPE Pipe Hydrostatic Pressure Test', status: 'Scheduled', badgeClass: 'inactive' },
    ]
  };

  const recentActivities = {
    title: 'Civil Operations Dispatch',
    viewAllTab: 'workspace',
    items: [
      { icon: Hammer, text: "Continuous pour of 450m³ M40 concrete completed for Tower B raft", time: '10:15 AM', color: 'purple' },
      { icon: Pickaxe, text: 'Cut-to-fill grading leveled in Sub-Sector 4 with GPS dozer', time: '09:42 AM', color: 'cyan' },
      { icon: Bot, text: 'AI Earthwork Copilot calculated optimal haul route saving 18% fuel', time: '09:30 AM', color: 'green' },
      { icon: ShieldCheck, text: 'Trench shoring inspection approved for 6m deep sewer line', time: '08:55 AM', color: 'blue' },
      { icon: Droplet, text: '250mm DI water main pressure test successfully passed', time: '08:30 AM', color: 'red' },
    ]
  };

  const scoreGauge = {
    title: 'Civil QA/QC & Safety Index',
    score: '98',
    scoreMax: '/100',
    scoreLabel: 'QA/QC SCORE',
    statusText: 'Outstanding',
    viewAllTab: 'quality',
    breakdown: [
      { name: 'Lab Strength Tests Passed', num: '142 Tests', color: 'green' },
      { name: 'Field Density Verified', num: '38 Tests', color: 'yellow' },
      { name: 'Minor Slump Deviation', num: '1 Batch', color: 'purple' },
      { name: 'Structural Non-Conformance', num: '0 Batches', color: 'red' },
    ],
    footerText: 'Standards: IS 456:2000 / IS 1786 / IRC:SP:84',
    safeText: '🛡 100% Structural Quality Assurance'
  };

  return (
    <CyberPortalLayout
      portalName="Civil Engineer"
      portalSubtitle="CIVIL INFRASTRUCTURE & SITE EXECUTION PORTAL"
      userName="Rajesh Kumar"
      userRole="Chief Civil & Infrastructure Engineer"
      userAvatar="https://i.pravatar.cc/150?img=52"
      navGroups={navGroups}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      copilotTitle="AI Civil Copilot"
      copilotDesc="Ask me anything about earthwork, concrete mix, foundations & IS codes"
      copilotTabId="ai"
      kpiCards={kpiCards}
      telemetryCards={telemetryCards}
      platformOverview={platformOverview}
      statusList={statusList}
      recentActivities={recentActivities}
      scoreGauge={scoreGauge}
    >
      {activeTab === 'workspace' && <CivilWorkspaceModule />}
      {activeTab === 'earthwork' && <EarthworkModule />}
      {activeTab === 'foundation' && <FoundationModule />}
      {activeTab === 'concrete' && <ConcreteModule />}
      {activeTab === 'roads' && <RoadModule />}
      {activeTab === 'drainage' && <DrainageModule />}
      {activeTab === 'utilities' && <UtilityModule />}
      {activeTab === 'geotech' && <GeotechModule />}
      {activeTab === 'quantities' && <QuantityModule />}
      {activeTab === 'settings' && <CivilDocsModule />}
      {activeTab === 'ai' && <CivilAIMLModule />}
      {activeTab === 'quality' && <CivilQualityModule />}
      {activeTab === 'safety' && <CivilSafetyModule />}
      {activeTab === 'monitor' && <ConstructionMonitorModule />}
      {activeTab === 'reports' && <CivilReportsModule />}
    </CyberPortalLayout>
  );
}
