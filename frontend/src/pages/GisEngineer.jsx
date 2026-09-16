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
  Compass,
  Database,
  Eye,
  FileCheck,
  FileText,
  Layers,
  Map,
  MessageSquare,
  Navigation,
  Plane,
  Radio,
  RotateCcw,
  Scan,
  Settings,
  ShieldCheck,
  TrendingUp,
  Truck,
  Users,
  Wifi
} from 'lucide-react';
import CyberPortalLayout from '../components/CyberPortalLayout';
import {
  MapViewerModule, SatelliteModule, TerrainModule, SiteSelectionModule, UtilityModule,
  GisAIMLModule, WorkspaceModule, SurveyModule, InfrastructureModule, EnvironmentModule,
  DroneModule, LidarModule, AssetModule, TrafficModule, DisasterModule, ReportsModule,
  GeoprocessingModule, DataManagementModule, IoTModule, FleetModule, GeofencingModule,
  ApiModule, SettingsModule
} from '../components/GisModules';

export default function GisEngineer() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const navGroups = [
    {
      title: 'SPATIAL & MAP MODULES',
      color: 'pink',
      items: [
        { id: 'viewer', label: 'Interactive Map Viewer', icon: Map },
        { id: 'satellite', label: 'Satellite & Aerial Imagery', icon: Plane },
        { id: 'terrain', label: 'Terrain & Elevation (3D)', icon: Navigation },
        { id: 'site', label: 'Site Suitability AI', icon: Scan },
        { id: 'utility', label: 'Underground Utilities (UG)', icon: Layers },
        { id: 'drone', label: 'Drone Survey Mapping', icon: Camera },
        { id: 'lidar', label: 'LiDAR & Point Clouds', icon: Eye },
        { id: 'infra', label: 'Infrastructure GIS', icon: Building },
        { id: 'environment', label: 'Environmental Impact', icon: Activity },
        { id: 'traffic', label: 'Traffic & Mobility Analysis', icon: TrendingUp },
        { id: 'disaster', label: 'Flood & Disaster Risk', icon: AlertTriangle },
        { id: 'reports', label: 'Spatial Reports & Exports', icon: FileText },
        { id: 'settings', label: 'Settings', icon: Settings },
      ]
    },
    {
      title: 'GEOPROCESSING & DATA',
      color: 'cyan',
      items: [
        { id: 'ai', label: 'AI Spatial Copilot', icon: Bot, badge: 'NEW' },
        { id: 'geoprocess', label: 'Geoprocessing Tools', icon: Settings },
        { id: 'datamgmt', label: 'Spatial Database Center', icon: Database },
        { id: 'iot', label: 'IoT Sensor Feeds', icon: Radio },
        { id: 'fleet', label: 'Fleet & Equipment Tracking', icon: Truck },
        { id: 'geofence', label: 'Geofencing Security', icon: ShieldCheck },
        { id: 'api', label: 'GIS API & OGC Services', icon: Wifi },
      ]
    }
  ];

  const kpiCards = [
    { title: 'Mapped Area Coverage', value: '450 Sq Km', trend: '↑ 18.2% vs last month', icon: Map, color: 'pink' },
    { title: 'Spatial Data Layers', value: '184', trend: '↑ 12.4% vs last month', icon: Layers, color: 'cyan' },
    { title: 'Drone Survey Datasets', value: '64 Scans', trend: '↑ 22.5% vs last month', icon: Plane, color: 'purple' },
    { title: 'Geo-Tagged Assets', value: '18,490', trend: '↑ 15.6% vs last month', icon: CheckCircle2, color: 'magenta' },
  ];

  const telemetryCards = [
    { title: 'Active Survey Zones', value: '16', trend: '↑ 8.4% vs last month', icon: Map, color: 'cyan' },
    { title: 'LiDAR Density', value: '120 pts/m²', trend: 'Optimal', icon: Eye, color: 'purple' },
    { title: 'Site Suitability', value: '91.4%', subDenom: 'Zone A', trend: '↑ 3.2% vs last month', icon: Scan, color: 'magenta' },
    { title: 'Utility Clashes', value: '14 Flagged', trend: '↓ 5 vs last month', icon: AlertTriangle, color: 'teal' },
    { title: 'Satellite Feeds', value: '3 Active', trend: 'Sentinel & Maxar', icon: Plane, color: 'cyan' },
    { title: 'Live Geo-Sensors', value: '2,480', trend: '↑ 14.1% vs last month', icon: Radio, color: 'teal' },
    { title: 'Flood Risk Index', value: 'Low (12%)', trend: 'Safe Zone', icon: ShieldCheck, color: 'magenta' },
    { title: 'AI Spatial Accuracy', value: '99.4%', trend: 'Sub-centimeter', icon: Bot, color: 'magenta' },
  ];

  const platformOverview = {
    title: 'Land Use & Coverage Classification',
    subtitle: 'High-resolution multispectral classification',
    totalCount: '256',
    totalLabel: 'SQ KM',
    items: [
      { name: 'Urban & Built-Up', count: '45.2 Sq Km', percent: '17.6%', color: 'green' },
      { name: 'Agricultural Land', count: '98.7 Sq Km', percent: '38.5%', color: 'yellow' },
      { name: 'Forest & Vegetation', count: '67.3 Sq Km', percent: '26.3%', color: 'purple' },
      { name: 'Water Bodies', count: '22.1 Sq Km', percent: '8.6%', color: 'cyan' },
      { name: 'Barren & Rocky Terrain', count: '22.7 Sq Km', percent: '8.9%', color: 'pink' },
    ]
  };

  const statusList = {
    title: 'Survey & Geoprocessing Jobs',
    viewAllTab: 'drone',
    items: [
      { name: 'North Sector Drone Orthomosaic', status: 'Processing (92%)', badgeClass: 'training' },
      { name: 'Underground Pipeline GPR Survey', status: 'Active (Zone B)', badgeClass: 'active' },
      { name: 'DEM/DTM 3D Elevation Mesh', status: 'Completed', badgeClass: 'deploying' },
      { name: 'High-Resolution Satellite Ingestion', status: 'Reviewing', badgeClass: 'testing' },
      { name: 'Geofence Breach Telemetry', status: 'Monitoring', badgeClass: 'inactive' },
    ]
  };

  const recentActivities = {
    title: 'GIS Intelligence Stream',
    viewAllTab: 'viewer',
    items: [
      { icon: Plane, text: "Drone Flight 'DJI Matrice 300' mapped 4.2 sq km", time: '10:15 AM', color: 'purple' },
      { icon: Layers, text: 'Underground Gas Pipeline Shapefile updated by Surveyor', time: '09:42 AM', color: 'cyan' },
      { icon: Bot, text: 'AI detected 12 illegal encroachments near buffer zone', time: '09:30 AM', color: 'green' },
      { icon: Scan, text: 'Site Suitability Report generated for Substation Phase 2', time: '08:55 AM', color: 'blue' },
      { icon: AlertTriangle, text: 'Slope instability warning triggered at Quarry Site C', time: '08:30 AM', color: 'red' },
    ]
  };

  const scoreGauge = {
    title: 'GIS Spatial Data Integrity',
    score: '96',
    scoreMax: '/100',
    scoreLabel: 'DATA INTEGRITY',
    statusText: 'Optimal',
    viewAllTab: 'datamgmt',
    breakdown: [
      { name: 'Sub-Centimeter RTK', num: '148 Layers', color: 'green' },
      { name: 'Standard GPS Accuracy', num: '32 Layers', color: 'yellow' },
      { name: 'Uncalibrated Layers', num: '4 Layers', color: 'purple' },
      { name: 'Critical Coordinate Shift', num: '0 Layers', color: 'red' },
    ],
    footerText: 'Projection: WGS 84 / UTM Zone 43N',
    safeText: '🛡 Coordinate System Calibrated'
  };

  return (
    <CyberPortalLayout
      portalName="GIS Engineer"
      portalSubtitle="GIS & SPATIAL INTELLIGENCE PORTAL"
      userName="Priya Sharma"
      userRole="Senior GIS Engineer"
      userAvatar="https://i.pravatar.cc/150?img=32"
      navGroups={navGroups}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      copilotTitle="AI Spatial Copilot"
      copilotDesc="Ask me anything about GIS maps, satellite feeds & drone data"
      copilotTabId="ai"
      kpiCards={kpiCards}
      telemetryCards={telemetryCards}
      platformOverview={platformOverview}
      statusList={statusList}
      recentActivities={recentActivities}
      scoreGauge={scoreGauge}
    >
      {activeTab === 'viewer' && <MapViewerModule />}
      {activeTab === 'satellite' && <SatelliteModule />}
      {activeTab === 'terrain' && <TerrainModule />}
      {activeTab === 'site' && <SiteSelectionModule />}
      {activeTab === 'utility' && <UtilityModule />}
      {activeTab === 'drone' && <DroneModule />}
      {activeTab === 'lidar' && <LidarModule />}
      {activeTab === 'infra' && <InfrastructureModule />}
      {activeTab === 'environment' && <EnvironmentModule />}
      {activeTab === 'traffic' && <TrafficModule />}
      {activeTab === 'disaster' && <DisasterModule />}
      {activeTab === 'reports' && <ReportsModule />}
      {activeTab === 'settings' && <SettingsModule />}
      {activeTab === 'ai' && <GisAIMLModule />}
      {activeTab === 'geoprocess' && <GeoprocessingModule />}
      {activeTab === 'datamgmt' && <DataManagementModule />}
      {activeTab === 'iot' && <IoTModule />}
      {activeTab === 'fleet' && <FleetModule />}
      {activeTab === 'geofence' && <GeofencingModule />}
      {activeTab === 'api' && <ApiModule />}
    </CyberPortalLayout>
  );
}
