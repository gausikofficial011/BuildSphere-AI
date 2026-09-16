import React, { useState } from 'react';
import { PremiumPlaceholder } from './SharedUI';
import {
  Bot, Plus, Send
} from 'lucide-react';
import { GoogleDocsReportGenerator } from './GoogleDocsReportGenerator';
import { TaskManager } from './TaskManager';
import { IssueTracker } from './IssueTracker';
import { DailyLogForm } from './DailyLogForm';
import { DocumentCenter } from './DocumentCenter';
import { NotificationsPanel } from './NotificationsPanel';
import { ProjectKPIDashboard } from './ProjectKPIDashboard';
import { ViewerContent } from './Global3DViewer';
export function TwinModuleHeader({ title, description, actionText = "Action" }) {
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

export function TwinTabs({ tabs, activeTab, onChange }) {
  return (
    <div style={{ display: 'flex', gap: '2rem', borderBottom: '1px solid #1e293b', marginBottom: '1.5rem', overflowX: 'auto', paddingBottom: '1px' }}>
      {tabs.map(t => (
        <button 
          key={t}
          onClick={() => onChange(t)}
          style={{ 
            padding: '0.75rem 0', 
            background: 'none', border: 'none', 
            borderBottom: activeTab === t ? '2px solid #4f46e5' : '2px solid transparent',
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

function TwinSubModulePlaceholder({ title }) {
  return <PremiumPlaceholder title={title} />;
}

export function TwinCopilotInterface() {
  const [msgs, setMsgs] = useState([
    { role: 'assistant', text: 'Good Morning, Arun! I am your AI Digital Twin Copilot. All building systems are currently nominal. Energy consumption in Block A is 4% lower than predicted for this hour. How can I assist you with operations today?' }
  ]);
  const [inp, setInp] = useState('');

  const handleSend = () => {
    if(!inp.trim()) return;
    setMsgs([...msgs, { role: 'user', text: inp }]);
    setInp('');
    setTimeout(() => {
      setMsgs(prev => [...prev, { role: 'assistant', text: 'I have analyzed the HVAC performance in Zone C. The anomaly in Chiller 02 is causing a 12% drop in cooling efficiency. I predict a failure in 45 days if left unmaintained. I recommend scheduling an inspection. Would you like me to generate a work order?' }]);
    }, 1000);
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 250px)', backgroundColor: 'rgba(0, 0, 0, 0.2)', borderRadius: '0.75rem', border: '1px solid #1e293b', overflow: 'hidden' }}>
      <div style={{ padding: '1.5rem', borderBottom: '1px solid #1e293b', backgroundColor: 'rgba(0, 0, 0, 0.6)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{ width: '40px', height: '40px', borderRadius: '0.5rem', backgroundColor: 'rgba(79, 70, 229, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#818cf8' }}>
          <Bot size={24} />
        </div>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', margin: 0, color: '#ffffff' }}>AI Digital Twin Copilot</h2>
          <p style={{ color: '#94a3b8', margin: 0, fontSize: '0.875rem' }}>Your intelligent operational assistant</p>
        </div>
      </div>
      
      <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid #1e293b', display: 'flex', gap: '0.5rem', overflowX: 'auto', backgroundColor: '#040814' }}>
        {['Analyze energy performance', 'Check equipment health', 'Simulate fire evacuation', 'Optimize HVAC schedule', 'Predict next failure'].map(chip => (
          <button key={chip} onClick={() => setInp(chip)} style={{ padding: '0.5rem 1rem', borderRadius: '9999px', border: '1px solid #1e293b', backgroundColor: '#ffffff', color: '#cbd5e1', fontSize: '0.75rem', cursor: 'pointer', whiteSpace: 'nowrap' }}>
            {chip}
          </button>
        ))}
      </div>
      
      <div style={{ flex: 1, padding: '1.5rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.5rem', backgroundColor: 'rgba(0, 0, 0, 0.2)' }}>
        {msgs.map((m, i) => (
          <div key={i} style={{ display: 'flex', gap: '1rem', alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start', maxWidth: '80%' }}>
            {m.role === 'assistant' && (
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#4f46e5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', flexShrink: 0 }}>
                <Bot size={16} />
              </div>
            )}
            <div style={{ padding: '1rem', backgroundColor: m.role === 'user' ? '#4f46e5' : '#ffffff', color: '#ffffff', borderRadius: '1rem', borderTopLeftRadius: m.role === 'assistant' ? 0 : '1rem', borderTopRightRadius: m.role === 'user' ? 0 : '1rem', border: m.role === 'user' ? 'none' : '1px solid #1e293b', fontSize: '0.875rem', lineHeight: '1.5' }}>
              {m.text}
            </div>
          </div>
        ))}
      </div>

      <div style={{ padding: '1.5rem', backgroundColor: 'rgba(0, 0, 0, 0.6)', borderTop: '1px solid #1e293b' }}>
        <div style={{ display: 'flex', gap: '1rem', position: 'relative' }}>
          <input 
            type="text" 
            placeholder="Ask your Digital Twin copilot..." 
            value={inp}
            onChange={e => setInp(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            style={{ flex: 1, padding: '1rem 1.5rem', backgroundColor: '#ffffff', border: '1px solid #1e293b', color: '#ffffff', borderRadius: '9999px', fontSize: '0.875rem', outline: 'none' }}
          />
          <button 
            onClick={handleSend}
            style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#4f46e5', color: 'white', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.2s' }}
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}

// Rapid stubs for all 30+ requested modules
import { DigitalTwinEngine } from './DigitalTwinEngine';
import { RevitDynamoBuilder } from './RevitDynamoBuilder';

export function LiveViewerModule() { 
  const [activeTab, setActiveTab] = useState('Digital Twin Telemetry');
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <TwinModuleHeader title="Live Twin Telemetry & 3D Viewer" description="Real-time IoT sensor telemetry and interactive 3D models." />
      <TwinTabs tabs={['Digital Twin Telemetry', 'Revit & Dynamo Builder', 'Interactive 3D Building', 'Live Sensor Overlay']} activeTab={activeTab} onChange={setActiveTab} />
      {activeTab === 'Digital Twin Telemetry' && <DigitalTwinEngine />}
      {activeTab === 'Revit & Dynamo Builder' && <RevitDynamoBuilder />}
      {(activeTab === 'Interactive 3D Building' || activeTab === 'Live Sensor Overlay') && (
        <div style={{ flex: 1, minHeight: '600px', backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #1e293b', overflow: 'hidden' }}>
          <ViewerContent isEmbedded={true} />
        </div>
      )}
    </div>
  );
}
export function AssetTwinModule() {
  const [activeTab, setActiveTab] = useState("Mechanical Assets");
  return (
    <div>
      <TwinModuleHeader title="Asset Digital Twin" description="Detailed digital replicas of equipment" />
      <TwinTabs tabs={['Mechanical Assets', 'Electrical Assets', 'Plumbing Assets', 'Asset Health']} activeTab={activeTab} onChange={setActiveTab} />
      <TwinSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function BuildingTwinModule() {
  const [activeTab, setActiveTab] = useState("Building Systems");
  return (
    <div>
      <TwinModuleHeader title="Building Digital Twin" description="System-level building models" />
      <TwinTabs tabs={['Building Systems', 'Rooms', 'Floors', 'Zones']} activeTab={activeTab} onChange={setActiveTab} />
      <TwinSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function CampusTwinModule() {
  const [activeTab, setActiveTab] = useState("Multiple Buildings");
  return (
    <div>
      <TwinModuleHeader title="Campus Digital Twin" description="Multi-building models" />
      <TwinTabs tabs={['Multiple Buildings', 'Roads', 'Parking', 'Landscaping']} activeTab={activeTab} onChange={setActiveTab} />
      <TwinSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function CityTwinModule() {
  const [activeTab, setActiveTab] = useState("Infrastructure");
  return (
    <div>
      <TwinModuleHeader title="City Digital Twin" description="Infrastructure-scale models" />
      <TwinTabs tabs={['Infrastructure', 'Smart Roads', 'Utilities', 'Smart Traffic']} activeTab={activeTab} onChange={setActiveTab} />
      <TwinSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function IoTDeviceModule() {
  const [activeTab, setActiveTab] = useState("Device Registration");
  return (
    <div>
      <TwinModuleHeader title="IoT Device Manager" description="Manage all connected sensors" />
      <TwinTabs tabs={['Device Registration', 'Health Monitoring', 'Firmware Updates', 'Remote Config']} activeTab={activeTab} onChange={setActiveTab} />
      <TwinSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function SensorMonitorModule() {
  const [activeTab, setActiveTab] = useState("Live Charts");
  return (
    <div>
      <TwinModuleHeader title="Sensor Monitoring Center" description="Live sensor data tracking" />
      <TwinTabs tabs={['Live Charts', 'Historical Trends', 'Threshold Monitoring', 'Alert Rules']} activeTab={activeTab} onChange={setActiveTab} />
      <TwinSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function RealTimeStreamsModule() {
  const [activeTab, setActiveTab] = useState("MQTT Streams");
  return (
    <div>
      <TwinModuleHeader title="Real-Time Data Streams" description="MQTT, Kafka, and WebSocket streams" />
      <TwinTabs tabs={['MQTT Streams', 'Kafka Streams', 'OPC-UA', 'REST APIs']} activeTab={activeTab} onChange={setActiveTab} />
      <TwinSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function LiveBuildingModule() {
  const [activeTab, setActiveTab] = useState("Temperature");
  return (
    <div>
      <TwinModuleHeader title="Live Building Monitoring" description="Real-time building telemetry" />
      <TwinTabs tabs={['Temperature', 'Humidity', 'Energy Usage', 'Water Usage']} activeTab={activeTab} onChange={setActiveTab} />
      <TwinSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function EquipmentHealthModule() {
  const [activeTab, setActiveTab] = useState("Chillers");
  return (
    <div>
      <TwinModuleHeader title="Equipment Health Center" description="Monitor chillers, pumps, and AHUs" />
      <TwinTabs tabs={['Chillers', 'Pumps', 'Boilers', 'AHUs']} activeTab={activeTab} onChange={setActiveTab} />
      <TwinSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function PredictiveMaintenanceModule() {
  const [activeTab, setActiveTab] = useState("Remaining Useful Life");
  return (
    <div>
      <TwinModuleHeader title="Predictive Maintenance" description="Failure prediction and RUL" />
      <TwinTabs tabs={['Remaining Useful Life', 'Maintenance Calendar', 'Failure Prediction', 'Work Orders']} activeTab={activeTab} onChange={setActiveTab} />
      <TwinSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function AssetLifecycleModule() {
  const [activeTab, setActiveTab] = useState("Procurement");
  return (
    <div>
      <TwinModuleHeader title="Asset Lifecycle Management" description="End-to-end asset tracking" />
      <TwinTabs tabs={['Procurement', 'Installation', 'Commissioning', 'Maintenance']} activeTab={activeTab} onChange={setActiveTab} />
      <TwinSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function SmartAutomationModule() {
  const [activeTab, setActiveTab] = useState("Lighting Automation");
  return (
    <div>
      <TwinModuleHeader title="Smart Building Automation" description="Automated building control logic" />
      <TwinTabs tabs={['Lighting Automation', 'HVAC Automation', 'Energy Automation', 'Security']} activeTab={activeTab} onChange={setActiveTab} />
      <TwinSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function OccupancyModule() {
  const [activeTab, setActiveTab] = useState("Live Occupancy");
  return (
    <div>
      <TwinModuleHeader title="Occupancy Intelligence" description="Real-time space utilization" />
      <TwinTabs tabs={['Live Occupancy', 'Space Utilization', 'Heat Maps', 'Crowd Density']} activeTab={activeTab} onChange={setActiveTab} />
      <TwinSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function IPSModule() {
  const [activeTab, setActiveTab] = useState("Worker Tracking");
  return (
    <div>
      <TwinModuleHeader title="Indoor Positioning System" description="Track assets and personnel" />
      <TwinTabs tabs={['Worker Tracking', 'Asset Tracking', 'Visitor Tracking', 'Evacuation']} activeTab={activeTab} onChange={setActiveTab} />
      <TwinSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function EnergyIntellModule() {
  const [activeTab, setActiveTab] = useState("Live Energy Dashboard");
  return (
    <div>
      <TwinModuleHeader title="Energy Intelligence Center" description="Power generation and consumption" />
      <TwinTabs tabs={['Live Energy Dashboard', 'Peak Demand', 'Solar Generation', 'Energy Forecast']} activeTab={activeTab} onChange={setActiveTab} />
      <TwinSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function WaterIntellModule() {
  const [activeTab, setActiveTab] = useState("Water Usage");
  return (
    <div>
      <TwinModuleHeader title="Water Intelligence Center" description="Water usage and leakage" />
      <TwinTabs tabs={['Water Usage', 'Leak Detection', 'Tank Monitoring', 'Water Quality']} activeTab={activeTab} onChange={setActiveTab} />
      <TwinSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function HVACPerformanceModule() {
  const [activeTab, setActiveTab] = useState("Cooling Efficiency");
  return (
    <div>
      <TwinModuleHeader title="HVAC Performance Center" description="Cooling and heating efficiency" />
      <TwinTabs tabs={['Cooling Efficiency', 'Heating Efficiency', 'Airflow', 'Indoor Comfort']} activeTab={activeTab} onChange={setActiveTab} />
      <TwinSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function ElecPerformanceModule() {
  const [activeTab, setActiveTab] = useState("Voltage");
  return (
    <div>
      <TwinModuleHeader title="Electrical Performance Center" description="Power quality and distribution" />
      <TwinTabs tabs={['Voltage', 'Current', 'Power Factor', 'Load Balance']} activeTab={activeTab} onChange={setActiveTab} />
      <TwinSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function FireSafetyModule() {
  const [activeTab, setActiveTab] = useState("Fire Alarms");
  return (
    <div>
      <TwinModuleHeader title="Fire & Life Safety Monitoring" description="Alarms and emergency systems" />
      <TwinTabs tabs={['Fire Alarms', 'Smoke Sensors', 'Sprinkler Status', 'Emergency Exits']} activeTab={activeTab} onChange={setActiveTab} />
      <TwinSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function StructHealthModule() {
  const [activeTab, setActiveTab] = useState("Crack Sensors");
  return (
    <div>
      <TwinModuleHeader title="Structural Health Monitoring" description="Cracks, strains, and vibrations" />
      <TwinTabs tabs={['Crack Sensors', 'Strain Gauges', 'Tilt Sensors', 'Vibration']} activeTab={activeTab} onChange={setActiveTab} />
      <TwinSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function EnvMonitorModule() {
  const [activeTab, setActiveTab] = useState("Weather");
  return (
    <div>
      <TwinModuleHeader title="Environmental Monitoring" description="External conditions" />
      <TwinTabs tabs={['Weather', 'Air Pollution', 'Noise', 'Rainfall']} activeTab={activeTab} onChange={setActiveTab} />
      <TwinSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function AirQualityModule() {
  const [activeTab, setActiveTab] = useState("PM2.5");
  return (
    <div>
      <TwinModuleHeader title="Air Quality Monitoring" description="Indoor air quality tracking" />
      <TwinTabs tabs={['PM2.5', 'PM10', 'CO2', 'VOC']} activeTab={activeTab} onChange={setActiveTab} />
      <TwinSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function CarbonESGModule() {
  const [activeTab, setActiveTab] = useState("Carbon Emissions");
  return (
    <div>
      <TwinModuleHeader title="Carbon & ESG Dashboard" description="Sustainability metrics" />
      <TwinTabs tabs={['Carbon Emissions', 'Energy Savings', 'Sustainability KPIs', 'ESG Metrics']} activeTab={activeTab} onChange={setActiveTab} />
      <TwinSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function BIMSyncModule() {
  const [activeTab, setActiveTab] = useState("Revit & Dynamo Builder");
  return (
    <div>
      <TwinModuleHeader title="BIM Synchronization & Revit/Dynamo Builder" description="Sync physical site telemetry and 3D Revit parametric models." />
      <TwinTabs tabs={['Revit & Dynamo Builder', 'Live BIM Updates', 'IFC Sync', 'Model Changes']} activeTab={activeTab} onChange={setActiveTab} />
      {activeTab === 'Revit & Dynamo Builder' ? <RevitDynamoBuilder /> : <TwinSubModulePlaceholder title={activeTab} />}
    </div>
  );
}
export function GISSyncModule() {
  const [activeTab, setActiveTab] = useState("Maps");
  return (
    <div>
      <TwinModuleHeader title="GIS Synchronization" description="Geospatial data integration" />
      <TwinTabs tabs={['Maps', 'Terrain', 'Infrastructure', 'Utility Networks']} activeTab={activeTab} onChange={setActiveTab} />
      <TwinSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function DroneSyncModule() {
  const [activeTab, setActiveTab] = useState("Drone Flights");
  return (
    <div>
      <TwinModuleHeader title="Drone Synchronization" description="UAV data mapping" />
      <TwinTabs tabs={['Drone Flights', 'Progress Photos', 'Thermal Images', 'Orthomosaics']} activeTab={activeTab} onChange={setActiveTab} />
      <TwinSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function PointCloudSyncModule() {
  const [activeTab, setActiveTab] = useState("LiDAR");
  return (
    <div>
      <TwinModuleHeader title="Point Cloud Synchronization" description="LiDAR scan data" />
      <TwinTabs tabs={['LiDAR', 'Scan-to-BIM', 'Point Cloud Compare', 'As-Built Validation']} activeTab={activeTab} onChange={setActiveTab} />
      <TwinSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function RealityCaptureModule() {
  const [activeTab, setActiveTab] = useState("Photogrammetry");
  return (
    <div>
      <TwinModuleHeader title="Reality Capture Center" description="Photogrammetry and mapping" />
      <TwinTabs tabs={['Photogrammetry', '360 Images', 'Laser Scans', 'Mobile Mapping']} activeTab={activeTab} onChange={setActiveTab} />
      <TwinSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function EventSimModule() {
  const [activeTab, setActiveTab] = useState("Fire Simulation");
  return (
    <div>
      <TwinModuleHeader title="Event Simulation Center" description="Emergency scenarios" />
      <TwinTabs tabs={['Fire Simulation', 'Flood Simulation', 'Evacuation', 'Power Failure']} activeTab={activeTab} onChange={setActiveTab} />
      <TwinSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function WhatIfModule() {
  const [activeTab, setActiveTab] = useState("Equipment Failure");
  return (
    <div>
      <TwinModuleHeader title="What-If Simulation Engine" description="Operational scenarios" />
      <TwinTabs tabs={['Equipment Failure', 'Energy Optimization', 'Occupancy Scenarios', 'Disaster Recovery']} activeTab={activeTab} onChange={setActiveTab} />
      <TwinSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function PredictiveAnalytModule() {
  const [activeTab, setActiveTab] = useState("Performance Forecast");
  return (
    <div>
      <TwinModuleHeader title="Predictive Analytics Center" description="Forecasting models" />
      <TwinTabs tabs={['Performance Forecast', 'Failure Forecast', 'Occupancy Forecast', 'Energy Forecast']} activeTab={activeTab} onChange={setActiveTab} />
      <TwinSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function AnomalyModule() {
  const [activeTab, setActiveTab] = useState("Sensor Anomalies");
  return (
    <div>
      <TwinModuleHeader title="Anomaly Detection Center" description="Identify unusual patterns" />
      <TwinTabs tabs={['Sensor Anomalies', 'Equipment Anomalies', 'Energy Anomalies', 'Water Leaks']} activeTab={activeTab} onChange={setActiveTab} />
      <TwinSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function RiskPredictionModule() {
  const [activeTab, setActiveTab] = useState("Fire Risk");
  return (
    <div>
      <TwinModuleHeader title="Risk Prediction Center" description="Identify and mitigate risks" />
      <TwinTabs tabs={['Fire Risk', 'Equipment Risk', 'Structural Risk', 'Cybersecurity']} activeTab={activeTab} onChange={setActiveTab} />
      <TwinSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function APIHubModule() {
  const [activeTab, setActiveTab] = useState("REST Endpoints");
  return (
    <div>
      <TwinModuleHeader title="Digital Twin API Hub" description="API endpoints and webhooks" />
      <TwinTabs tabs={['REST Endpoints', 'Webhooks', 'GraphQL', 'API Keys']} activeTab={activeTab} onChange={setActiveTab} />
      <TwinSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function ReportsModule() { return <GoogleDocsReportGenerator portalRole="Digital Twin Manager" defaultProject="Skyline Towers - Phase 1" />; }

export function AICenterModule() {
  const [t, setT] = useState('AI Digital Twin Copilot');
  return (
    <div>
      <TwinModuleHeader title="AI & ML Center" description="Intelligence models and copilot" />
      <TwinTabs tabs={['AI Digital Twin Copilot', 'Predictive Models', 'Computer Vision', 'Anomaly Detection']} activeTab={t} onChange={setT} />
      {t === 'AI Digital Twin Copilot' ? <TwinCopilotInterface /> : <TwinSubModulePlaceholder title={t} />}
    </div>
  );
}
