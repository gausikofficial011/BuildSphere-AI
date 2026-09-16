import React, { useState } from 'react';
import {
  Activity,
  AlertTriangle,
  Bot,
  Box,
  Building,
  Camera,
  Cpu,
  Database,
  Eye,
  FileText,
  Flame,
  Globe,
  Layers,
  Leaf,
  Map,
  Radio,
  Server,
  Settings,
  Shield,
  Sun,
  Thermometer,
  TrendingUp,
  Users,
  Waves,
  Wifi,
  Wind,
  Zap
} from 'lucide-react';
import CyberPortalLayout from '../components/CyberPortalLayout';
import {
  LiveViewerModule, AssetTwinModule, BuildingTwinModule, CampusTwinModule, CityTwinModule,
  IoTDeviceModule, SensorMonitorModule, RealTimeStreamsModule, LiveBuildingModule,
  EquipmentHealthModule, PredictiveMaintenanceModule, AssetLifecycleModule, SmartAutomationModule,
  OccupancyModule, IPSModule, EnergyIntellModule, WaterIntellModule, HVACPerformanceModule,
  ElecPerformanceModule, FireSafetyModule, StructHealthModule, EnvMonitorModule, AirQualityModule,
  CarbonESGModule, BIMSyncModule, GISSyncModule, DroneSyncModule, PointCloudSyncModule,
  RealityCaptureModule, EventSimModule, WhatIfModule, PredictiveAnalytModule, AnomalyModule,
  RiskPredictionModule, APIHubModule, ReportsModule, AICenterModule
} from '../components/TwinModules';

export default function DigitalTwinEngineer() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const navGroups = [
    {
      title: 'TWIN ENVIRONMENTS',
      color: 'pink',
      items: [
        { id: 'live', label: '3D Live Spatial Twin', icon: Box },
        { id: 'asset', label: 'Asset Digital Twin', icon: Cpu },
        { id: 'building', label: 'Smart Building Twin', icon: Building },
        { id: 'campus', label: 'Campus & Infra Twin', icon: Map },
        { id: 'city', label: 'Smart City Twin (GIS)', icon: Globe },
        { id: 'realtime', label: 'Real-Time Sensor Streams', icon: Waves },
        { id: 'equipment', label: 'Equipment Health Center', icon: Activity },
        { id: 'predictive', label: 'Predictive Maintenance', icon: Bot },
        { id: 'energy', label: 'Energy & Power Analytics', icon: Zap },
        { id: 'hvac', label: 'HVAC Performance Twin', icon: Wind },
        { id: 'struct', label: 'Structural Health (SHM)', icon: Shield },
        { id: 'esg', label: 'Carbon & ESG Monitor', icon: Leaf },
        { id: 'reports', label: 'Twin Telemetry Reports', icon: FileText },
        { id: 'settings', label: 'Settings', icon: Settings },
      ]
    },
    {
      title: 'SIMULATION & AI',
      color: 'cyan',
      items: [
        { id: 'ai', label: 'AI Twin Copilot', icon: Bot, badge: 'NEW' },
        { id: 'whatif', label: 'What-If Scenario Simulator', icon: TrendingUp },
        { id: 'anomaly', label: 'AI Anomaly Detector', icon: AlertTriangle },
        { id: 'bimsync', label: 'BIM / GIS Bi-Directional Sync', icon: Layers },
        { id: 'api', label: 'Digital Twin API Hub', icon: Wifi },
      ]
    }
  ];

  const kpiCards = [
    { title: 'Connected Digital Twins', value: '86', trend: '↑ 14.2% vs last month', icon: Box, color: 'pink' },
    { title: 'Telemetry Ingestion Rate', value: '48.2K /s', trend: '↑ 22.8% vs last month', icon: Waves, color: 'cyan' },
    { title: 'Predictive Health Score', value: '98.4%', trend: 'Optimal Performance', icon: Activity, color: 'purple' },
    { title: 'Energy Efficiency Index', value: '34.2% Saved', trend: '↑ 6.5% vs last month', icon: Zap, color: 'magenta' },
  ];

  const telemetryCards = [
    { title: 'Active Twin Nodes', value: '86', trend: '↑ 8.1% vs last month', icon: Box, color: 'cyan' },
    { title: 'Sensor Streams', value: '14,280', trend: 'Real-time 100ms', icon: Waves, color: 'purple' },
    { title: 'HVAC Efficiency', value: '94.2%', trend: 'Smart Optimized', icon: Wind, color: 'magenta' },
    { title: 'Power Consumption', value: '1.24 MW', trend: '↓ 4.8% vs baseline', icon: Zap, color: 'teal' },
    { title: 'Vibration Anomalies', value: '0 Critical', trend: 'Normal Threshold', icon: Shield, color: 'cyan' },
    { title: 'CO2 Air Quality', value: '520 ppm', trend: 'Healthy Level', icon: Leaf, color: 'teal' },
    { title: 'Predictive Alerts', value: '3 Scheduled', trend: 'Preventative Maint', icon: Bot, color: 'magenta' },
    { title: 'Twin Sync Lag', value: '18 ms', trend: 'Ultra-low Latency', icon: Radio, color: 'magenta' },
  ];

  const platformOverview = {
    title: 'Digital Twin Asset Distribution',
    subtitle: 'Real-time asset telemetry classification',
    totalCount: '86',
    totalLabel: 'TWINS',
    items: [
      { name: 'Commercial Buildings', count: '32 Twins', percent: '37.2%', color: 'green' },
      { name: 'Industrial Plants', count: '24 Twins', percent: '27.9%', color: 'yellow' },
      { name: 'Infrastructure & Bridges', count: '16 Twins', percent: '18.6%', color: 'purple' },
      { name: 'Campus Microgrids', count: '8 Twins', percent: '9.3%', color: 'cyan' },
      { name: 'Smart City Sub-Sectors', count: '6 Twins', percent: '7.0%', color: 'pink' },
    ]
  };

  const statusList = {
    title: 'Live Telemetry & Health Stream',
    viewAllTab: 'equipment',
    items: [
      { name: 'Tower A Chiller Plant Unit 3', status: 'Optimal (98%)', badgeClass: 'active' },
      { name: 'Main Substation Transformer 2', status: 'Monitoring (88%)', badgeClass: 'training' },
      { name: 'Bridge Stress Sensor Array B4', status: 'Stable (0.02mm)', badgeClass: 'deploying' },
      { name: 'Solar Microgrid Inverter Cluster', status: 'Generating (450kW)', badgeClass: 'testing' },
      { name: 'Backup Generator Diesel Level', status: 'Standby (96%)', badgeClass: 'inactive' },
    ]
  };

  const recentActivities = {
    title: 'Digital Twin Event Feed',
    viewAllTab: 'live',
    items: [
      { icon: Waves, text: "AI Twin dynamically balanced AHU 4 cooling load", time: '10:15 AM', color: 'purple' },
      { icon: Zap, text: 'Peak shaving triggered: saved ₹ 42,000 grid charge', time: '09:42 AM', color: 'cyan' },
      { icon: Bot, text: 'Predictive Maintenance alert: Pump 2 bearing replacement scheduled', time: '09:30 AM', color: 'green' },
      { icon: Box, text: 'BIM Rev 8 geometry bi-directionally synchronized', time: '08:55 AM', color: 'blue' },
      { icon: AlertTriangle, text: 'Air filter differential pressure warning resolved', time: '08:30 AM', color: 'red' },
    ]
  };

  const scoreGauge = {
    title: 'System Health & Carbon Score',
    score: '98',
    scoreMax: '/100',
    scoreLabel: 'TWIN HEALTH',
    statusText: 'Optimal',
    viewAllTab: 'esg',
    breakdown: [
      { name: 'Critical Systems Optimal', num: '78 Twins', color: 'green' },
      { name: 'Minor Advisory', num: '8 Twins', color: 'yellow' },
      { name: 'Maintenance Required', num: '0 Twins', color: 'purple' },
      { name: 'Critical Alarm', num: '0 Twins', color: 'red' },
    ],
    footerText: 'Real-time sync: Active (18ms)',
    safeText: '🛡 Zero Critical Faults'
  };

  return (
    <CyberPortalLayout
      portalName="Digital Twin Engineer"
      portalSubtitle="DIGITAL TWIN & TELEMETRY PLATFORM"
      userName="Vikram Malhotra"
      userRole="Lead Digital Twin Architect"
      userAvatar="https://i.pravatar.cc/150?img=60"
      navGroups={navGroups}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      copilotTitle="AI Twin Copilot"
      copilotDesc="Ask me anything about real-time sensors, 3D simulations & telemetry"
      copilotTabId="ai"
      kpiCards={kpiCards}
      telemetryCards={telemetryCards}
      platformOverview={platformOverview}
      statusList={statusList}
      recentActivities={recentActivities}
      scoreGauge={scoreGauge}
    >
      {activeTab === 'live' && <LiveViewerModule />}
      {activeTab === 'asset' && <AssetTwinModule />}
      {activeTab === 'building' && <BuildingTwinModule />}
      {activeTab === 'campus' && <CampusTwinModule />}
      {activeTab === 'city' && <CityTwinModule />}
      {activeTab === 'realtime' && <RealTimeStreamsModule />}
      {activeTab === 'equipment' && <EquipmentHealthModule />}
      {activeTab === 'predictive' && <PredictiveMaintenanceModule />}
      {activeTab === 'energy' && <EnergyIntellModule />}
      {activeTab === 'hvac' && <HVACPerformanceModule />}
      {activeTab === 'struct' && <StructHealthModule />}
      {activeTab === 'esg' && <CarbonESGModule />}
      {activeTab === 'reports' && <ReportsModule />}
      {activeTab === 'settings' && <APIHubModule />}
      {activeTab === 'ai' && <AICenterModule />}
      {activeTab === 'whatif' && <WhatIfModule />}
      {activeTab === 'anomaly' && <AnomalyModule />}
      {activeTab === 'bimsync' && <BIMSyncModule />}
      {activeTab === 'api' && <APIHubModule />}
    </CyberPortalLayout>
  );
}
