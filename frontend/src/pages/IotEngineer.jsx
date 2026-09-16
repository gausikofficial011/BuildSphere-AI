import React, { useState } from 'react';
import {
  Activity,
  AlertTriangle,
  Battery,
  Bot,
  Box,
  Camera,
  Cpu,
  Database,
  Eye,
  FileText,
  Layers,
  Radio,
  Router,
  Server,
  Settings,
  Shield,
  Signal,
  Thermometer,
  TrendingUp,
  Wifi,
  Wind,
  Zap
} from 'lucide-react';
import CyberPortalLayout from '../components/CyberPortalLayout';
import {
  DeviceManagementModule, SensorManagementModule, GatewayManagementModule, EdgeComputingModule,
  IIoTModule, SmartBuildingDevModule, SmartConstructionDevModule, PlcScadaModule, BasModule,
  DeviceProvisionModule, DeviceConfigModule, FirmwareModule, RemoteControlModule, LiveDeviceModule,
  TelemetryModule, RealTimeStreamsModule, MqttBrokerModule, OpcuaModule, ModbusModule, BacnetModule,
  LorawanModule, ZigbeeModule, ZwaveModule, BleModule, WifiDeviceModule, CellularModule, CalibrationModule,
  DeviceHealthModule, BatteryModule, AssetTrackingModule, IpsModule, GeofencingModule, DroneRoboticsModule,
  CameraAnalyticsModule, TwinSyncModule, BimSyncModule, GisSyncModule, PredictiveMaintenanceModule,
  EnergyMonitorModule, EnvMonitorModule, OccMonitorModule, SecurityMonitorModule, AlertEventModule,
  WorkflowEngineModule, RulesEngineModule, ApiIntegrationModule, ReportsAnalyticsModule, AiMlCenterModule
} from '../components/IotModules';

export default function IotEngineer() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const navGroups = [
    {
      title: 'DEVICE & NETWORK MANAGEMENT',
      color: 'pink',
      items: [
        { id: 'devices', label: 'IoT Device Registry', icon: Cpu },
        { id: 'sensors', label: 'Sensor Grid Management', icon: Thermometer },
        { id: 'gateways', label: 'Edge Gateways & Nodes', icon: Router },
        { id: 'mqtt', label: 'MQTT & Protocols Broker', icon: Signal },
        { id: 'firmware', label: 'OTA Firmware Updates', icon: Server },
        { id: 'battery', label: 'Battery & Power Status', icon: Battery },
        { id: 'health', label: 'Device Health Diagnostics', icon: Activity },
        { id: 'camera', label: 'AI Camera Vision Feeds', icon: Camera },
        { id: 'reports', label: 'IoT Telemetry Reports', icon: FileText },
        { id: 'settings', label: 'Settings', icon: Settings },
      ]
    },
    {
      title: 'ANALYTICS & AUTOMATION',
      color: 'cyan',
      items: [
        { id: 'ai', label: 'AI IoT Copilot', icon: Bot, badge: 'NEW' },
        { id: 'rules', label: 'Automation Rules Engine', icon: Settings },
        { id: 'predictive', label: 'Predictive Fault Detection', icon: AlertTriangle },
        { id: 'energy', label: 'Energy Monitoring', icon: Zap },
        { id: 'api', label: 'IoT Rest & Webhook APIs', icon: Wifi },
      ]
    }
  ];

  const kpiCards = [
    { title: 'Connected IoT Devices', value: '4,892', trend: '↑ 11.2% vs last month', icon: Cpu, color: 'pink' },
    { title: 'Data Ingestion Rate', value: '1.24 GB/h', trend: '↑ 18.5% vs last month', icon: Signal, color: 'cyan' },
    { title: 'Network Online Rate', value: '99.82%', trend: 'Ultra-Reliable Mesh', icon: Wifi, color: 'purple' },
    { title: 'Active Alert Rules', value: '248', trend: '0 Critical Breaches', icon: Shield, color: 'magenta' },
  ];

  const telemetryCards = [
    { title: 'Active Gateways', value: '64', trend: '100% Online', icon: Router, color: 'cyan' },
    { title: 'MQTT Packet Rate', value: '8.4K msg/s', trend: '↑ 14.2% vs last month', icon: Signal, color: 'purple' },
    { title: 'LoRaWAN Nodes', value: '1,240', trend: 'Range 15 Km', icon: Radio, color: 'magenta' },
    { title: 'Zigbee & BLE Grid', value: '2,890', trend: 'Indoor Mesh', icon: Wifi, color: 'teal' },
    { title: 'Edge Compute Load', value: '34.2%', trend: 'Low Latency (4ms)', icon: Cpu, color: 'cyan' },
    { title: 'Battery Level Avg', value: '92.4%', trend: 'Optimal Power', icon: Battery, color: 'teal' },
    { title: 'Anomalies Detected', value: '2 Flags', trend: 'Auto-resolved', icon: AlertTriangle, color: 'magenta' },
    { title: 'AI Diagnostics', value: 'Optimal', trend: '99.9% Sensor Health', icon: Bot, color: 'magenta' },
  ];

  const platformOverview = {
    title: 'Connected Protocol Breakdown',
    subtitle: 'Multi-frequency industrial network distribution',
    totalCount: '4,892',
    totalLabel: 'DEVICES',
    items: [
      { name: 'MQTT / HTTP (TCP/IP)', count: '1,840 Nodes', percent: '37.6%', color: 'green' },
      { name: 'LoRaWAN Long-Range', count: '1,240 Nodes', percent: '25.3%', color: 'yellow' },
      { name: 'Zigbee 3.0 Mesh', count: '1,080 Nodes', percent: '22.1%', color: 'purple' },
      { name: 'Modbus / BACnet (RS485)', count: '480 Nodes', percent: '9.8%', color: 'cyan' },
      { name: 'BLE 5.0 Beacon Mesh', count: '252 Nodes', percent: '5.2%', color: 'pink' },
    ]
  };

  const statusList = {
    title: 'Gateway & Edge Status',
    viewAllTab: 'gateways',
    items: [
      { name: 'Main Tower Edge Gateway G-01', status: 'Online (1.2ms)', badgeClass: 'active' },
      { name: 'Basement Substation Gateway G-02', status: 'Online (2.4ms)', badgeClass: 'active' },
      { name: 'Solar Farm LoRa Gateway G-03', status: 'Transmitting', badgeClass: 'deploying' },
      { name: 'North Perimeter Beacon Cluster', status: 'Checking (100%)', badgeClass: 'training' },
      { name: 'Backup Cellular Failover Node', status: 'Standby Ready', badgeClass: 'inactive' },
    ]
  };

  const recentActivities = {
    title: 'IoT Sensor Telemetry Log',
    viewAllTab: 'sensors',
    items: [
      { icon: Signal, text: "OTA Firmware v2.4.1 deployed to 450 environmental sensors", time: '10:15 AM', color: 'purple' },
      { icon: Zap, text: 'Energy meter peak load trigger: load shed to AHU-02', time: '09:42 AM', color: 'cyan' },
      { icon: Bot, text: 'AI detected vibration signature anomaly on Chiller Pump 1', time: '09:30 AM', color: 'green' },
      { icon: Battery, text: '12 external soil moisture sensor batteries replaced', time: '08:55 AM', color: 'blue' },
      { icon: Shield, text: 'Geofence breach alert on perimeter sensor 81 cleared', time: '08:30 AM', color: 'red' },
    ]
  };

  const scoreGauge = {
    title: 'IoT Network Health & Uptime',
    score: '99',
    scoreMax: '/100',
    scoreLabel: 'NETWORK UPTIME',
    statusText: 'Ultra-Reliable',
    viewAllTab: 'health',
    breakdown: [
      { name: 'Devices Online & Synced', num: '4,888', color: 'green' },
      { name: 'Weak Signal (< -90dBm)', num: '4', color: 'yellow' },
      { name: 'Offline Diagnostics', num: '0', color: 'purple' },
      { name: 'Hardware Faults', num: '0', color: 'red' },
    ],
    footerText: 'Packet Loss: 0.001% • Latency: 4ms',
    safeText: '🛡 All Mesh Networks Operating'
  };

  return (
    <CyberPortalLayout
      portalName="IoT Engineer"
      portalSubtitle="IOT SENSOR & EDGE INTELLIGENCE PORTAL"
      userName="Neha Gupta"
      userRole="IoT & Embedded Systems Engineer"
      userAvatar="https://i.pravatar.cc/150?img=47"
      navGroups={navGroups}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      copilotTitle="AI IoT Copilot"
      copilotDesc="Ask me anything about sensor telemetry, edge gateways & automation"
      copilotTabId="ai"
      kpiCards={kpiCards}
      telemetryCards={telemetryCards}
      platformOverview={platformOverview}
      statusList={statusList}
      recentActivities={recentActivities}
      scoreGauge={scoreGauge}
    >
      {activeTab === 'devices' && <DeviceManagementModule />}
      {activeTab === 'sensors' && <SensorManagementModule />}
      {activeTab === 'gateways' && <GatewayManagementModule />}
      {activeTab === 'mqtt' && <MqttBrokerModule />}
      {activeTab === 'firmware' && <FirmwareModule />}
      {activeTab === 'battery' && <BatteryModule />}
      {activeTab === 'health' && <DeviceHealthModule />}
      {activeTab === 'camera' && <CameraAnalyticsModule />}
      {activeTab === 'reports' && <ReportsAnalyticsModule />}
      {activeTab === 'settings' && <ApiIntegrationModule />}
      {activeTab === 'ai' && <AiMlCenterModule />}
      {activeTab === 'rules' && <RulesEngineModule />}
      {activeTab === 'predictive' && <PredictiveMaintenanceModule />}
      {activeTab === 'energy' && <EnergyMonitorModule />}
      {activeTab === 'api' && <ApiIntegrationModule />}
    </CyberPortalLayout>
  );
}
