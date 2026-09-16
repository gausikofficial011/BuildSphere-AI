import React, { useState } from 'react';
import {
  Activity,
  AlertTriangle,
  Bot,
  Building,
  CheckCircle2,
  Droplet,
  FileText,
  Flame,
  Layers,
  Power,
  Settings,
  ShieldCheck,
  Sun,
  Thermometer,
  TrendingUp,
  Waves,
  Wifi,
  Wind,
  Wrench,
  Zap
} from 'lucide-react';
import CyberPortalLayout from '../components/CyberPortalLayout';
import {
  MepWorkspaceModule, HvacModule, ElectricalModule, PlumbingModule, FireModule,
  ElvModule, BmsModule, RenewableModule, EnergyModule, EquipmentModule,
  LoadCalcModule, MepBimModule, ClashModule, SimulationModule, CommissioningModule,
  ReportsModule, MepAIMLModule
} from '../components/MepModules';

export default function MepEngineer() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const navGroups = [
    {
      title: 'MEP SYSTEMS & DESIGN',
      color: 'pink',
      items: [
        { id: 'workspace', label: 'MEP Systems Dashboard', icon: Wrench },
        { id: 'hvac', label: 'HVAC Cooling & Duct Routing', icon: Wind },
        { id: 'electrical', label: 'Electrical Power & HT/LT Panels', icon: Zap },
        { id: 'plumbing', label: 'PHE Plumbing & Drainage (WTP/STP)', icon: Droplet },
        { id: 'fire', label: 'Fire Fighting & Sprinklers (NFPA)', icon: Flame },
        { id: 'elv', label: 'ELV, CCTV & Access Control', icon: Wifi },
        { id: 'bms', label: 'BMS Building Management System', icon: Activity },
        { id: 'renewable', label: 'Solar Rooftop & Renewable Microgrid', icon: Sun },
        { id: 'equipment', label: 'Chillers & Heavy Equipment Schedule', icon: Power },
        { id: 'reports', label: 'MEP Reports & BOQ Takeoff', icon: FileText },
        { id: 'settings', label: 'Settings', icon: Settings },
      ]
    },
    {
      title: 'CALCULATIONS & AI',
      color: 'cyan',
      items: [
        { id: 'ai', label: 'AI MEP Copilot', icon: Bot, badge: 'NEW' },
        { id: 'loads', label: 'ASHRAE Heat Load & Psychrometrics', icon: Thermometer },
        { id: 'clash', label: 'MEP Duct & Pipe Clash Detection', icon: AlertTriangle },
        { id: 'commissioning', label: 'Cx Testing & Commissioning (TAB)', icon: CheckCircle2 },
      ]
    }
  ];

  const kpiCards = [
    { title: 'Total Connected Load', value: '3.45 MVA', trend: '↑ 8.4% vs design basis', icon: Zap, color: 'pink' },
    { title: 'Total HVAC Capacity', value: '1,850 TR', trend: 'VRF + Water-Cooled Chillers', icon: Wind, color: 'cyan' },
    { title: 'Water Consumption', value: '420 KLD', trend: '100% STP Water Recycled', icon: Droplet, color: 'purple' },
    { title: 'Energy Efficiency Ratio', value: '0.62 kW/TR', trend: 'ECBC Super-Compliant', icon: ShieldCheck, color: 'magenta' },
  ];

  const telemetryCards = [
    { title: 'Transformer Load', value: '68.4%', trend: 'Balanced 3-Phase', icon: Zap, color: 'cyan' },
    { title: 'Chiller COP', value: '6.45', trend: 'VFD Centrifugal', icon: Wind, color: 'purple' },
    { title: 'Plumbing Residual Head', value: '2.5 bar', trend: 'Hydro-pneumatic Safe', icon: Droplet, color: 'magenta' },
    { title: 'Fire Ring Main Press', value: '8.5 bar', trend: 'NFPA 20 Certified', icon: Flame, color: 'teal' },
    { title: 'Solar PV Generation', value: '480 kWp', trend: 'Net Metering Active', icon: Sun, color: 'cyan' },
    { title: 'BMS DDC Points', value: '3,420 Pts', trend: 'BACnet IP Online', icon: Activity, color: 'teal' },
    { title: 'MEP Clashes Resolved', value: '48 Resolved', trend: '0 Ceiling Violations', icon: AlertTriangle, color: 'magenta' },
    { title: 'AI Heat Load Calc', value: 'Real-time', trend: 'ASHRAE 90.1 Engine', icon: Bot, color: 'magenta' },
  ];

  const platformOverview = {
    title: 'MEP Package Completion Matrix',
    subtitle: 'Services installation progress breakdown',
    totalCount: '120',
    totalLabel: 'SERVICES',
    items: [
      { name: 'HVAC Chilled Water Piping & Ducts', count: '48 Done', percent: '40.0%', color: 'green' },
      { name: 'Electrical Cable Trays & Risers', count: '36 Done', percent: '30.0%', color: 'yellow' },
      { name: 'Plumbing Soil & Waste Stacks', count: '24 Done', percent: '20.0%', color: 'purple' },
      { name: 'Fire Hydrant & Sprinkler Grids', count: '8 Done', percent: '6.7%', color: 'cyan' },
      { name: 'ELV Networking & Fiber Backbone', count: '4 Done', percent: '3.3%', color: 'pink' },
    ]
  };

  const statusList = {
    title: 'Plant Room & Equipment Commissioning',
    viewAllTab: 'commissioning',
    items: [
      { name: 'Primary Chilled Water Pump 1-3 TAB Balancing', status: 'Passed (100%)', badgeClass: 'active' },
      { name: '11kV / 433V 2000kVA Transformer Dielectric Test', status: 'Certified (65kV)', badgeClass: 'active' },
      { name: 'Main Fire Diesel Engine Auto-Start Test', status: 'Verified (8s)', badgeClass: 'deploying' },
      { name: 'Hydro-Pneumatic Booster Pump VFD Test', status: 'Testing', badgeClass: 'training' },
      { name: 'DG Set 1500kVA Synchronization Panel', status: 'Scheduled', badgeClass: 'inactive' },
    ]
  };

  const recentActivities = {
    title: 'MEP Coordination Stream',
    viewAllTab: 'workspace',
    items: [
      { icon: Wind, text: "HVAC CFM air balancing completed for Level 10-18 AHUs", time: '10:15 AM', color: 'purple' },
      { icon: Zap, text: 'Busduct riser insulation resistance test approved by Electrical Inspector', time: '09:42 AM', color: 'cyan' },
      { icon: Bot, text: 'AI HVAC Copilot optimized chilled water setpoint from 6.5°C to 7.2°C', time: '09:30 AM', color: 'green' },
      { icon: Flame, text: 'Fire sprinkler hydro-pressure test passed at 12 kg/cm²', time: '08:55 AM', color: 'blue' },
      { icon: Droplet, text: 'STP MBBR aeration blower commissioned: BOD < 10 mg/L achieved', time: '08:30 AM', color: 'red' },
    ]
  };

  const scoreGauge = {
    title: 'MEP Energy & Commissioning Score',
    score: '96',
    scoreMax: '/100',
    scoreLabel: 'ENERGY SCORE',
    statusText: 'ECBC Super',
    viewAllTab: 'energy',
    breakdown: [
      { name: 'ECBC / ASHRAE 90.1 Pass', num: '112 Circuits', color: 'green' },
      { name: 'Minor Air Balancing Delta', num: '6 AHUs', color: 'yellow' },
      { name: 'Power Quality Harmonic THD < 3%', num: '2 Panels', color: 'purple' },
      { name: 'Critical Equipment Faults', num: '0 Units', color: 'red' },
    ],
    footerText: 'Standards: ASHRAE 62.1 / IS 732 / NBC Part 8',
    safeText: '🛡 All Services Operating Nominally'
  };

  return (
    <CyberPortalLayout
      portalName="MEP Engineer"
      portalSubtitle="MECHANICAL, ELECTRICAL & PLUMBING PORTAL"
      userName="Mohammed Al-Fayed"
      userRole="Lead MEP Systems Coordinator"
      userAvatar="https://i.pravatar.cc/150?img=68"
      navGroups={navGroups}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      copilotTitle="AI MEP Copilot"
      copilotDesc="Ask me anything about HVAC heat loads, single-line diagrams, PHE & fire codes"
      copilotTabId="ai"
      kpiCards={kpiCards}
      telemetryCards={telemetryCards}
      platformOverview={platformOverview}
      statusList={statusList}
      recentActivities={recentActivities}
      scoreGauge={scoreGauge}
    >
      {activeTab === 'workspace' && <MepWorkspaceModule />}
      {activeTab === 'hvac' && <HvacModule />}
      {activeTab === 'electrical' && <ElectricalModule />}
      {activeTab === 'plumbing' && <PlumbingModule />}
      {activeTab === 'fire' && <FireModule />}
      {activeTab === 'elv' && <ElvModule />}
      {activeTab === 'bms' && <BmsModule />}
      {activeTab === 'renewable' && <RenewableModule />}
      {activeTab === 'equipment' && <EquipmentModule />}
      {activeTab === 'reports' && <ReportsModule />}
      {activeTab === 'settings' && <MepBimModule />}
      {activeTab === 'ai' && <MepAIMLModule />}
      {activeTab === 'loads' && <LoadCalcModule />}
      {activeTab === 'clash' && <ClashModule />}
      {activeTab === 'commissioning' && <CommissioningModule />}
    </CyberPortalLayout>
  );
}
