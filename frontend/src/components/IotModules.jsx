import React, { useState } from 'react';
import { PremiumPlaceholder } from './SharedUI';
import {
  Bot, Plus, Send
} from 'lucide-react';
import { GoogleDocsReportGenerator } from './GoogleDocsReportGenerator';

export function IotModuleHeader({ title, description, actionText = "Action" }) {
  return (
    <div className="page-header" style={{ marginBottom: '2rem' }}>
      <div className="page-title">
        <h1 style={{ fontSize: '2rem', margin: '0 0 0.25rem 0', color: '#ffffff' }}>{title}</h1>
        <p style={{ fontSize: '1rem', margin: 0, color: '#94a3b8' }}>{description}</p>
      </div>
      <div className="header-actions">
        <button className="export-btn">
          <Plus size={16} /> {actionText}
        </button>
      </div>
    </div>
  );
}

export function IotTabs({ tabs, activeTab, onChange }) {
  return (
    <div style={{ display: 'flex', gap: '2rem', borderBottom: '1px solid #1e293b', marginBottom: '1.5rem', overflowX: 'auto', paddingBottom: '1px' }}>
      {tabs.map(t => (
        <button 
          key={t}
          onClick={() => onChange(t)}
          style={{ 
            padding: '0.75rem 0', 
            background: 'none', border: 'none', 
            borderBottom: activeTab === t ? '2px solid #2563eb' : '2px solid transparent',
            color: activeTab === t ? '#ffffff' : '#94a3b8',
            fontWeight: activeTab === t ? 600 : 500,
            fontSize: '0.875rem', cursor: 'pointer', whiteSpace: 'nowrap'
          }}
        >
          {t}
        </button>
      ))}
    </div>
  )
}

function IotSubModulePlaceholder({ title }) {
  return <PremiumPlaceholder title={title} />;
}

export function IotCopilotInterface() {
  const [msgs, setMsgs] = useState([
    { role: 'assistant', text: 'Good Morning, Arun! I am your AI IoT Copilot. All MQTT brokers and edge gateways are operating nominally. I detected a minor anomaly in the cooling efficiency of AHU-07 on Floor 3. Would you like me to pull the latest sensor logs or restart the gateway?' }
  ]);
  const [inp, setInp] = useState('');

  const handleSend = () => {
    if(!inp.trim()) return;
    setMsgs([...msgs, { role: 'user', text: inp }]);
    setInp('');
    setTimeout(() => {
      setMsgs(prev => [...prev, { role: 'assistant', text: 'Pulling the logs now... I noticed a 15% drop in water pressure from Sensor-WP-42 over the last 4 hours. It correlates with an alert from the vibration sensor on Pump 03. I recommend triggering the "Pump Diagnostics" automation workflow.' }]);
    }, 1000);
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 250px)', backgroundColor: '#0b1121', borderRadius: '0.75rem', border: '1px solid #1e293b', overflow: 'hidden' }}>
      <div style={{ padding: '1.5rem', borderBottom: '1px solid #1e293b', backgroundColor: 'rgba(0, 0, 0, 0.6)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{ width: '40px', height: '40px', borderRadius: '0.5rem', backgroundColor: 'rgba(37, 99, 235, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#60a5fa' }}>
          <Bot size={24} />
        </div>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', margin: 0, color: '#ffffff' }}>AI IoT Copilot</h2>
          <p style={{ color: '#94a3b8', margin: 0, fontSize: '0.875rem' }}>Your intelligent device and automation assistant</p>
        </div>
      </div>
      
      <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid #1e293b', display: 'flex', gap: '0.5rem', overflowX: 'auto', backgroundColor: '#030712' }}>
        {['Check device health', 'Analyze energy usage', 'Restart Edge Node 4', 'Show active alerts', 'Predict pump failure'].map(chip => (
          <button key={chip} onClick={() => setInp(chip)} style={{ padding: '0.5rem 1rem', borderRadius: '9999px', border: '1px solid #1e293b', backgroundColor: '#ffffff', color: '#cbd5e1', fontSize: '0.75rem', cursor: 'pointer', whiteSpace: 'nowrap' }}>
            {chip}
          </button>
        ))}
      </div>
      
      <div style={{ flex: 1, padding: '1.5rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.5rem', backgroundColor: '#0b1121' }}>
        {msgs.map((m, i) => (
          <div key={i} style={{ display: 'flex', gap: '1rem', alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start', maxWidth: '80%' }}>
            {m.role === 'assistant' && (
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', flexShrink: 0 }}>
                <Bot size={16} />
              </div>
            )}
            <div style={{ padding: '1rem', backgroundColor: m.role === 'user' ? '#2563eb' : '#ffffff', color: '#ffffff', borderRadius: '1rem', borderTopLeftRadius: m.role === 'assistant' ? 0 : '1rem', borderTopRightRadius: m.role === 'user' ? 0 : '1rem', border: m.role === 'user' ? 'none' : '1px solid #1e293b', fontSize: '0.875rem', lineHeight: '1.5' }}>
              {m.text}
            </div>
          </div>
        ))}
      </div>

      <div style={{ padding: '1.5rem', backgroundColor: 'rgba(0, 0, 0, 0.6)', borderTop: '1px solid #1e293b' }}>
        <div style={{ display: 'flex', gap: '1rem', position: 'relative' }}>
          <input 
            type="text" 
            placeholder="Send command or ask a question..." 
            value={inp}
            onChange={e => setInp(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            style={{ flex: 1, padding: '1rem 1.5rem', backgroundColor: '#ffffff', border: '1px solid #1e293b', color: '#ffffff', borderRadius: '9999px', fontSize: '0.875rem', outline: 'none' }}
          />
          <button 
            onClick={handleSend}
            style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#2563eb', color: 'white', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.2s' }}
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}

// Rapid stubs for all 40+ requested IoT modules
export function DeviceManagementModule() {
  const [activeTab, setActiveTab] = useState("Device Inventory");
  return (
    <div>
      <IotModuleHeader title="Device Management Center" description="Manage device lifecycle and inventory" />
      <IotTabs tabs={['Register Devices', 'Remove Devices', 'Group Devices', 'Device Inventory', 'Device Templates']} activeTab={activeTab} onChange={setActiveTab} />
      <IotSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function SensorManagementModule() {
  const [activeTab, setActiveTab] = useState("Temperature/Humidity");
  return (
    <div>
      <IotModuleHeader title="Sensor Management" description="Monitor and configure environmental and physical sensors" />
      <IotTabs tabs={['Temperature/Humidity', 'Air Quality', 'Pressure/Flow', 'Vibration/Noise', 'Occupancy/Motion']} activeTab={activeTab} onChange={setActiveTab} />
      <IotSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function GatewayManagementModule() {
  const [activeTab, setActiveTab] = useState("Gateway Health");
  return (
    <div>
      <IotModuleHeader title="Gateway Management" description="Monitor Edge Gateways and Clusters" />
      <IotTabs tabs={['Gateway Health', 'Gateway Clusters', 'Firmware Updates', 'Remote Restart', 'Gateway Logs']} activeTab={activeTab} onChange={setActiveTab} />
      <IotSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function EdgeComputingModule() {
  const [activeTab, setActiveTab] = useState("Edge AI");
  return (
    <div>
      <IotModuleHeader title="Edge Computing Center" description="Local inference and offline analytics" />
      <IotTabs tabs={['Edge AI', 'Local Inference', 'Offline Analytics', 'Event Processing', 'Container Deployment']} activeTab={activeTab} onChange={setActiveTab} />
      <IotSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function IIoTModule() {
  const [activeTab, setActiveTab] = useState("PLC Integration");
  return (
    <div>
      <IotModuleHeader title="Industrial IoT (IIoT)" description="Factory and heavy equipment monitoring" />
      <IotTabs tabs={['PLC Integration', 'SCADA Dashboard', 'RTU Monitoring', 'Industrial Sensors', 'Production Monitoring']} activeTab={activeTab} onChange={setActiveTab} />
      <IotSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function SmartBuildingDevModule() {
  const [activeTab, setActiveTab] = useState("HVAC Controllers");
  return (
    <div>
      <IotModuleHeader title="Smart Building Devices" description="HVAC, lighting, and access control" />
      <IotTabs tabs={['HVAC Controllers', 'Smart Lighting', 'Smart Locks', 'Occupancy Sensors', 'Smart Thermostats']} activeTab={activeTab} onChange={setActiveTab} />
      <IotSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function SmartConstructionDevModule() {
  const [activeTab, setActiveTab] = useState("Concrete Sensors");
  return (
    <div>
      <IotModuleHeader title="Smart Construction Devices" description="Site monitoring and wearables" />
      <IotTabs tabs={['Concrete Sensors', 'Crane Monitoring', 'Excavator Monitoring', 'Fleet Tracking', 'Worker Safety Wearables']} activeTab={activeTab} onChange={setActiveTab} />
      <IotSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function PlcScadaModule() {
  const [activeTab, setActiveTab] = useState("Siemens PLC");
  return (
    <div>
      <IotModuleHeader title="PLC & SCADA Integration" description="Bridge protocols from industrial controllers" />
      <IotTabs tabs={['Siemens PLC', 'Schneider PLC', 'Allen Bradley PLC', 'SCADA Systems', 'OPC-UA Bridge']} activeTab={activeTab} onChange={setActiveTab} />
      <IotSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function BasModule() {
  const [activeTab, setActiveTab] = useState("HVAC Automation");
  return (
    <div>
      <IotModuleHeader title="Building Automation System (BAS)" description="Core automation workflows" />
      <IotTabs tabs={['HVAC Automation', 'Lighting Automation', 'Fire Automation', 'Energy Automation', 'Security Automation']} activeTab={activeTab} onChange={setActiveTab} />
      <IotSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function DeviceProvisionModule() {
  const [activeTab, setActiveTab] = useState("Auto Provisioning");
  return (
    <div>
      <IotModuleHeader title="Device Provisioning" description="Secure onboarding of new edge devices" />
      <IotTabs tabs={['Auto Provisioning', 'Secure Onboarding', 'Certificate Management', 'Device Authentication']} activeTab={activeTab} onChange={setActiveTab} />
      <IotSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function DeviceConfigModule() {
  const [activeTab, setActiveTab] = useState("Configuration Profiles");
  return (
    <div>
      <IotModuleHeader title="Device Configuration" description="OTA and bulk configuration profiles" />
      <IotTabs tabs={['Configuration Profiles', 'Bulk Configuration', 'OTA Configuration', 'Configuration Backup']} activeTab={activeTab} onChange={setActiveTab} />
      <IotSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function FirmwareModule() {
  const [activeTab, setActiveTab] = useState("OTA Updates");
  return (
    <div>
      <IotModuleHeader title="Device Firmware Management" description="OTA updates and version control" />
      <IotTabs tabs={['OTA Updates', 'Rollback', 'Firmware Health', 'Version Management']} activeTab={activeTab} onChange={setActiveTab} />
      <IotSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function RemoteControlModule() {
  const [activeTab, setActiveTab] = useState("Remote Commands");
  return (
    <div>
      <IotModuleHeader title="Remote Device Control" description="Send commands to edge devices" />
      <IotTabs tabs={['Restart Devices', 'Shutdown', 'Calibration', 'Diagnostics', 'Remote Commands']} activeTab={activeTab} onChange={setActiveTab} />
      <IotSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function LiveDeviceModule() {
  const [activeTab, setActiveTab] = useState("CPU Usage");
  return (
    <div>
      <IotModuleHeader title="Live Device Monitoring" description="Real-time health and diagnostics" />
      <IotTabs tabs={['Online Status', 'CPU Usage', 'Memory Usage', 'Temperature', 'Connectivity Logs']} activeTab={activeTab} onChange={setActiveTab} />
      <IotSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function TelemetryModule() {
  const [activeTab, setActiveTab] = useState("Live Charts");
  return (
    <div>
      <IotModuleHeader title="Telemetry Dashboard" description="Visualizing live sensor streams" />
      <IotTabs tabs={['Live Charts', 'Historical Data', 'Time-Series Graphs', 'Threshold Alerts']} activeTab={activeTab} onChange={setActiveTab} />
      <IotSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function RealTimeStreamsModule() {
  const [activeTab, setActiveTab] = useState("MQTT");
  return (
    <div>
      <IotModuleHeader title="Real-Time Data Streams" description="Protocol routing and processing" />
      <IotTabs tabs={['MQTT', 'Kafka', 'RabbitMQ', 'WebSocket', 'REST API']} activeTab={activeTab} onChange={setActiveTab} />
      <IotSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function MqttBrokerModule() {
  const [activeTab, setActiveTab] = useState("Topics");
  return (
    <div>
      <IotModuleHeader title="MQTT Broker Center" description="Manage topics and QoS" />
      <IotTabs tabs={['Topics', 'Publishers', 'Subscribers', 'QoS Monitoring', 'Message Analytics']} activeTab={activeTab} onChange={setActiveTab} />
      <IotSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function OpcuaModule() {
  const [activeTab, setActiveTab] = useState("Endpoints");
  return (
    <div>
      <IotModuleHeader title="OPC-UA Integration" description="Industrial protocol mapping" />
      <IotTabs tabs={['Endpoints', 'Nodes', 'Subscriptions', 'Security Profiles']} activeTab={activeTab} onChange={setActiveTab} />
      <IotSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function ModbusModule() {
  const [activeTab, setActiveTab] = useState("Modbus TCP");
  return (
    <div>
      <IotModuleHeader title="Modbus Integration" description="Modbus RTU and TCP/IP devices" />
      <IotTabs tabs={['Modbus RTU', 'Modbus TCP', 'Registers', 'Polling Rates']} activeTab={activeTab} onChange={setActiveTab} />
      <IotSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function BacnetModule() {
  const [activeTab, setActiveTab] = useState("Devices");
  return (
    <div>
      <IotModuleHeader title="BACnet Integration" description="Building automation networking" />
      <IotTabs tabs={['Devices', 'Objects', 'Properties', 'COV Subscriptions']} activeTab={activeTab} onChange={setActiveTab} />
      <IotSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function LorawanModule() {
  const [activeTab, setActiveTab] = useState("Devices");
  return (
    <div>
      <IotModuleHeader title="LoRaWAN Management" description="Low power wide area network gateways" />
      <IotTabs tabs={['Gateways', 'Applications', 'Devices', 'Payload Decoders']} activeTab={activeTab} onChange={setActiveTab} />
      <IotSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function ZigbeeModule() {
  const [activeTab, setActiveTab] = useState("Network Map");
  return (
    <div>
      <IotModuleHeader title="Zigbee Management" description="Mesh network configuration" />
      <IotTabs tabs={['Coordinators', 'Routers', 'End Devices', 'Network Map']} activeTab={activeTab} onChange={setActiveTab} />
      <IotSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function ZwaveModule() {
  const [activeTab, setActiveTab] = useState("Nodes");
  return (
    <div>
      <IotModuleHeader title="Z-Wave Management" description="Smart home/building protocol" />
      <IotTabs tabs={['Controllers', 'Nodes', 'Associations', 'Security Keys']} activeTab={activeTab} onChange={setActiveTab} />
      <IotSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function BleModule() {
  const [activeTab, setActiveTab] = useState("Beacons");
  return (
    <div>
      <IotModuleHeader title="BLE Device Center" description="Bluetooth Low Energy beacons and tags" />
      <IotTabs tabs={['Beacons', 'Scanners', 'RSSI Calibration', 'GATT Profiles']} activeTab={activeTab} onChange={setActiveTab} />
      <IotSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function WifiDeviceModule() {
  const [activeTab, setActiveTab] = useState("Connected Devices");
  return (
    <div>
      <IotModuleHeader title="Wi-Fi Device Management" description="IP-based IoT endpoints" />
      <IotTabs tabs={['Connected Devices', 'IP Allocation', 'Bandwidth Usage', 'Security']} activeTab={activeTab} onChange={setActiveTab} />
      <IotSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function CellularModule() {
  const [activeTab, setActiveTab] = useState("SIM Management");
  return (
    <div>
      <IotModuleHeader title="5G/4G IoT Connectivity" description="Cellular modems and SIMs" />
      <IotTabs tabs={['SIM Management', 'Data Usage', 'Signal Strength', 'APN Config']} activeTab={activeTab} onChange={setActiveTab} />
      <IotSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function CalibrationModule() {
  const [activeTab, setActiveTab] = useState("Calibration Schedule");
  return (
    <div>
      <IotModuleHeader title="Sensor Calibration Center" description="Maintain sensor accuracy" />
      <IotTabs tabs={['Calibration Schedule', 'Calibration History', 'Drift Detection', 'Sensor Validation']} activeTab={activeTab} onChange={setActiveTab} />
      <IotSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function DeviceHealthModule() {
  const [activeTab, setActiveTab] = useState("CPU/RAM");
  return (
    <div>
      <IotModuleHeader title="Device Health Monitoring" description="Hardware diagnostics" />
      <IotTabs tabs={['CPU/RAM', 'Temperature', 'Voltage', 'Signal Quality', 'Error Logs']} activeTab={activeTab} onChange={setActiveTab} />
      <IotSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function BatteryModule() {
  const [activeTab, setActiveTab] = useState("Battery Health");
  return (
    <div>
      <IotModuleHeader title="Battery Management" description="Power lifecycle for wireless sensors" />
      <IotTabs tabs={['Battery Health', 'Battery Prediction', 'Charging Cycles', 'Remaining Life']} activeTab={activeTab} onChange={setActiveTab} />
      <IotSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function AssetTrackingModule() {
  const [activeTab, setActiveTab] = useState("Live Tracking");
  return (
    <div>
      <IotModuleHeader title="Asset Tracking" description="GPS, RFID, and UWB positioning" />
      <IotTabs tabs={['Live Tracking', 'History', 'Heat Maps', 'Route Playback']} activeTab={activeTab} onChange={setActiveTab} />
      <IotSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function IpsModule() {
  const [activeTab, setActiveTab] = useState("Worker Tracking");
  return (
    <div>
      <IotModuleHeader title="Indoor Positioning System" description="Worker and visitor tracking indoors" />
      <IotTabs tabs={['Worker Tracking', 'Equipment Tracking', 'Visitor Tracking', 'Emergency Location']} activeTab={activeTab} onChange={setActiveTab} />
      <IotSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function GeofencingModule() {
  const [activeTab, setActiveTab] = useState("Safety Zones");
  return (
    <div>
      <IotModuleHeader title="Geofencing Center" description="Safety and restricted zones" />
      <IotTabs tabs={['Safety Zones', 'Restricted Areas', 'Entry/Exit Alerts', 'Workforce Monitoring']} activeTab={activeTab} onChange={setActiveTab} />
      <IotSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function DroneRoboticsModule() {
  const [activeTab, setActiveTab] = useState("Drone Telemetry");
  return (
    <div>
      <IotModuleHeader title="Drone & Robotics Integration" description="Autonomous agents and telemetry" />
      <IotTabs tabs={['Drone Telemetry', 'Robot Monitoring', 'Autonomous Inspection', 'Mission Planning']} activeTab={activeTab} onChange={setActiveTab} />
      <IotSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function CameraAnalyticsModule() {
  const [activeTab, setActiveTab] = useState("AI CCTV");
  return (
    <div>
      <IotModuleHeader title="Smart Camera Analytics" description="Edge computer vision streams" />
      <IotTabs tabs={['AI CCTV', 'PPE Detection', 'Intrusion Detection', 'Fire Detection']} activeTab={activeTab} onChange={setActiveTab} />
      <IotSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function TwinSyncModule() {
  const [activeTab, setActiveTab] = useState("Live Sensor Overlay");
  return (
    <div>
      <IotModuleHeader title="Digital Twin Synchronization" description="Sync IoT telemetry to digital models" />
      <IotTabs tabs={['Asset Sync', 'Live Sensor Overlay', 'Equipment Status', 'Twin Health']} activeTab={activeTab} onChange={setActiveTab} />
      <IotSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function BimSyncModule() {
  const [activeTab, setActiveTab] = useState("Equipment Mapping");
  return (
    <div>
      <IotModuleHeader title="BIM Synchronization" description="Bind IoT devices to BIM objects" />
      <IotTabs tabs={['Live BIM Objects', 'Equipment Mapping', 'Asset Linking']} activeTab={activeTab} onChange={setActiveTab} />
      <IotSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function GisSyncModule() {
  const [activeTab, setActiveTab] = useState("Asset Locations");
  return (
    <div>
      <IotModuleHeader title="GIS Synchronization" description="Geospatial mapping of outdoor devices" />
      <IotTabs tabs={['Asset Locations', 'Utility Networks', 'Outdoor Devices', 'Infrastructure Mapping']} activeTab={activeTab} onChange={setActiveTab} />
      <IotSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function PredictiveMaintenanceModule() {
  const [activeTab, setActiveTab] = useState("Remaining Useful Life");
  return (
    <div>
      <IotModuleHeader title="Predictive Maintenance Center" description="AI-driven failure prediction" />
      <IotTabs tabs={['Remaining Useful Life', 'Failure Prediction', 'Maintenance Calendar', 'Work Orders']} activeTab={activeTab} onChange={setActiveTab} />
      <IotSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function EnergyMonitorModule() {
  const [activeTab, setActiveTab] = useState("Smart Meters");
  return (
    <div>
      <IotModuleHeader title="Energy Monitoring" description="Power quality and smart meters" />
      <IotTabs tabs={['Smart Meters', 'Solar Monitoring', 'Power Quality', 'Consumption Analytics']} activeTab={activeTab} onChange={setActiveTab} />
      <IotSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function EnvMonitorModule() {
  const [activeTab, setActiveTab] = useState("Air Quality");
  return (
    <div>
      <IotModuleHeader title="Environmental Monitoring" description="Air, water, and weather sensors" />
      <IotTabs tabs={['Air Quality', 'Water Quality', 'Weather', 'Pollution', 'Noise']} activeTab={activeTab} onChange={setActiveTab} />
      <IotSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function OccMonitorModule() {
  const [activeTab, setActiveTab] = useState("Room Occupancy");
  return (
    <div>
      <IotModuleHeader title="Occupancy Monitoring" description="Space utilization and crowd density" />
      <IotTabs tabs={['Room Occupancy', 'Building Utilization', 'Visitor Analytics', 'Crowd Density']} activeTab={activeTab} onChange={setActiveTab} />
      <IotSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function SecurityMonitorModule() {
  const [activeTab, setActiveTab] = useState("Cybersecurity Dashboard");
  return (
    <div>
      <IotModuleHeader title="Security Monitoring" description="Cybersecurity and threat detection" />
      <IotTabs tabs={['Cybersecurity Dashboard', 'Device Authentication', 'Threat Monitoring', 'Encryption Status']} activeTab={activeTab} onChange={setActiveTab} />
      <IotSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function AlertEventModule() {
  const [activeTab, setActiveTab] = useState("Incident Escalation");
  return (
    <div>
      <IotModuleHeader title="Alert & Event Management" description="Notification routing and escalation" />
      <IotTabs tabs={['SMS/Email', 'Push Notifications', 'WhatsApp Alerts', 'Incident Escalation']} activeTab={activeTab} onChange={setActiveTab} />
      <IotSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function WorkflowEngineModule() {
  const [activeTab, setActiveTab] = useState("No-Code Automation");
  return (
    <div>
      <IotModuleHeader title="Automation Workflow Engine" description="No-code automation orchestration" />
      <IotTabs tabs={['No-Code Automation', 'Trigger Rules', 'Scheduled Actions', 'Device Orchestration']} activeTab={activeTab} onChange={setActiveTab} />
      <IotSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function RulesEngineModule() {
  const [activeTab, setActiveTab] = useState("If-Then Logic");
  return (
    <div>
      <IotModuleHeader title="Rules Engine" description="Logic and threshold processing" />
      <IotTabs tabs={['If-Then Logic', 'Threshold Rules', 'AI Recommendations', 'Event Correlation']} activeTab={activeTab} onChange={setActiveTab} />
      <IotSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function ApiIntegrationModule() {
  const [activeTab, setActiveTab] = useState("REST");
  return (
    <div>
      <IotModuleHeader title="API & Integrations" description="External system connections" />
      <IotTabs tabs={['REST', 'GraphQL', 'Webhooks', 'ERP Connectors']} activeTab={activeTab} onChange={setActiveTab} />
      <IotSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function ReportsAnalyticsModule() { return <GoogleDocsReportGenerator portalRole="IoT & Smart Site Lead" defaultProject="Skyline Towers - Phase 1" />; }

export function AiMlCenterModule() {
  const [t, setT] = useState('AI IoT Copilot');
  return (
    <div>
      <IotModuleHeader title="AI & ML Center" description="Edge AI and Predictive Intelligence" />
      <IotTabs tabs={['AI IoT Copilot', 'Predictive Models', 'Computer Vision', 'Anomaly Detection', 'Optimization Models']} activeTab={t} onChange={setT} />
      {t === 'AI IoT Copilot' ? <IotCopilotInterface /> : <IotSubModulePlaceholder title={t} />}
    </div>
  );
}
