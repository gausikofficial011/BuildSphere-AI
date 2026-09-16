import React, { useState } from 'react';
import { PremiumPlaceholder } from './SharedUI';
import {
  Bot, Plus, Send
} from 'lucide-react';
import { GoogleDocsReportGenerator } from './GoogleDocsReportGenerator';

export function GisModuleHeader({ title, description, actionText = "Action" }) {
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

export function GisTabs({ tabs, activeTab, onChange }) {
  return (
    <div style={{ display: 'flex', gap: '2rem', borderBottom: '1px solid #e2e8f0', marginBottom: '1.5rem', overflowX: 'auto', paddingBottom: '1px' }}>
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

function GisSubModulePlaceholder({ title }) {
  return <PremiumPlaceholder title={title} />;
}

export function GisCopilotInterface() {
  const [msgs, setMsgs] = useState([
    { role: 'assistant', text: 'Good Morning, Arun! I am your AI GIS Copilot. I can assist you with terrain analysis, satellite imagery classification, utility network planning, or environmental risk assessment. How can I help you today?' }
  ]);
  const [inp, setInp] = useState('');

  const handleSend = () => {
    if(!inp.trim()) return;
    setMsgs([...msgs, { role: 'user', text: inp }]);
    setInp('');
    setTimeout(() => {
      setMsgs(prev => [...prev, { role: 'assistant', text: 'Based on the latest LiDAR scans and soil analysis for Sector 12, I have identified a high risk of waterlogging due to poor drainage slopes. I recommend adjusting the proposed road alignment or incorporating a stormwater retention basin. I have added a flood simulation overlay to your active map viewer.' }]);
    }, 1000);
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 250px)', backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
      <div style={{ padding: '1.5rem', borderBottom: '1px solid #e2e8f0', backgroundColor: 'rgba(255, 255, 255, 0.05)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{ width: '40px', height: '40px', borderRadius: '0.5rem', backgroundColor: '#e0e7ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4f46e5' }}>
          <Bot size={24} />
        </div>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', margin: 0, color: '#ffffff' }}>AI GIS Copilot</h2>
          <p style={{ color: '#64748b', margin: 0, fontSize: '0.875rem' }}>Your intelligent geospatial assistant</p>
        </div>
      </div>
      
      <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid #e2e8f0', display: 'flex', gap: '0.5rem', overflowX: 'auto' }}>
        {['Analyze Flood Risk', 'Find Best Site', 'Show Utility Network', 'Compare Land Use', 'Calculate Area'].map(chip => (
          <button key={chip} onClick={() => setInp(chip)} style={{ padding: '0.5rem 1rem', borderRadius: '9999px', border: '1px solid #e2e8f0', backgroundColor: 'white', color: '#cbd5e1', fontSize: '0.75rem', cursor: 'pointer', whiteSpace: 'nowrap' }}>
            {chip}
          </button>
        ))}
      </div>
      
      <div style={{ flex: 1, padding: '1.5rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.5rem', backgroundColor: 'rgba(255, 255, 255, 0.05)' }}>
        {msgs.map((m, i) => (
          <div key={i} style={{ display: 'flex', gap: '1rem', alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start', maxWidth: '80%' }}>
            {m.role === 'assistant' && (
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#4f46e5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', flexShrink: 0 }}>
                <Bot size={16} />
              </div>
            )}
            <div style={{ padding: '1rem', backgroundColor: m.role === 'user' ? '#4f46e5' : 'white', color: m.role === 'user' ? 'white' : '#ffffff', borderRadius: '1rem', borderTopLeftRadius: m.role === 'assistant' ? 0 : '1rem', borderTopRightRadius: m.role === 'user' ? 0 : '1rem', boxShadow: '0 1px 2px rgba(0,0,0,0.05)', border: m.role === 'user' ? 'none' : '1px solid #e2e8f0', fontSize: '0.875rem', lineHeight: '1.5' }}>
              {m.text}
            </div>
          </div>
        ))}
      </div>

      <div style={{ padding: '1.5rem', backgroundColor: 'white', borderTop: '1px solid #e2e8f0' }}>
        <div style={{ display: 'flex', gap: '1rem', position: 'relative' }}>
          <input 
            type="text" 
            placeholder="Ask your GIS copilot..." 
            value={inp}
            onChange={e => setInp(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            style={{ flex: 1, padding: '1rem 1.5rem', backgroundColor: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: '9999px', fontSize: '0.875rem', outline: 'none' }}
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

// Stubs for GIS modules
export function MapViewerModule() {
  const [t, setT] = useState('Enterprise Map Viewer');
  return <div><GisModuleHeader title="Interactive Map Viewer" description="Central repository for all spatial layers." /><GisTabs tabs={['Enterprise Map Viewer', 'Layer Controls', 'Measurement Tools', 'Time Slider']} activeTab={t} onChange={setT} /><GisSubModulePlaceholder title={t} /></div>;
}
export function SatelliteModule() {
  const [t, setT] = useState('High Res Imagery');
  return <div><GisModuleHeader title="Satellite Imagery Center" description="Manage and analyze satellite data." /><GisTabs tabs={['High Res Imagery', 'Historical Imagery', 'NDVI Layers', 'Thermal Layers']} activeTab={t} onChange={setT} /><GisSubModulePlaceholder title={t} /></div>;
}
export function TerrainModule() {
  const [t, setT] = useState('DEM Generation');
  return <div><GisModuleHeader title="Terrain Analysis Center" description="Analyze surface models and elevation." /><GisTabs tabs={['DEM Generation', 'Slope Analysis', 'Contour Mapping', 'Cut & Fill']} activeTab={t} onChange={setT} /><GisSubModulePlaceholder title={t} /></div>;
}
export function SiteSelectionModule() {
  const [t, setT] = useState('Multi-Criteria Analysis');
  return <div><GisModuleHeader title="Site Selection Center" description="Evaluate suitability of land parcels." /><GisTabs tabs={['Multi-Criteria Analysis', 'Accessibility', 'Environmental Constraints', 'AI Site Ranking']} activeTab={t} onChange={setT} /><GisSubModulePlaceholder title={t} /></div>;
}
export function UtilityModule() {
  const [t, setT] = useState('Water Networks');
  return <div><GisModuleHeader title="Utility Network Mapping" description="Manage underground and above-ground utilities." /><GisTabs tabs={['Water Networks', 'Electrical', 'Telecom', 'Stormwater']} activeTab={t} onChange={setT} /><GisSubModulePlaceholder title={t} /></div>;
}

export function GisAIMLModule() {
  const [t, setT] = useState('AI GIS Copilot');
  return (
    <div>
      <GisModuleHeader title="AI & ML Center" description="Geospatial predictive analytics and computer vision." />
      <GisTabs tabs={['AI GIS Copilot', 'Flood Predictor', 'Satellite Image Analyzer', 'Route Optimizer']} activeTab={t} onChange={setT} />
      {t === 'AI GIS Copilot' ? <GisCopilotInterface /> : <GisSubModulePlaceholder title={t} />}
    </div>
  );
}

// Rapid stubs for the rest
export function WorkspaceModule() { return <GisSubModulePlaceholder title="GIS Workspace" />; }
export function SurveyModule() { return <GisSubModulePlaceholder title="Land Survey Management" />; }
export function InfrastructureModule() { return <GisSubModulePlaceholder title="Infrastructure Planning" />; }
export function EnvironmentModule() { return <GisSubModulePlaceholder title="Environmental Monitoring" />; }
export function DroneModule() { return <GisSubModulePlaceholder title="Drone Mapping Center" />; }
export function LidarModule() { return <GisSubModulePlaceholder title="LiDAR Processing Center" />; }
export function AssetModule() { return <GisSubModulePlaceholder title="Asset GIS Management" />; }
export function TrafficModule() { return <GisSubModulePlaceholder title="Traffic & Mobility Analysis" />; }
export function DisasterModule() { return <GisSubModulePlaceholder title="Disaster Risk Analysis" />; }
export function ReportsModule() { return <GoogleDocsReportGenerator portalRole="GIS Engineer" defaultProject="Skyline Towers - Phase 1" />; }
export function GeoprocessingModule() { return <GisSubModulePlaceholder title="Spatial Analytics (Geoprocessing)" />; }
export function DataManagementModule() { return <GisSubModulePlaceholder title="Spatial Database Center" />; }
export function IoTModule() { return <GisSubModulePlaceholder title="Real-Time IoT GIS" />; }
export function FleetModule() { return <GisSubModulePlaceholder title="GPS Fleet Tracking" />; }
export function GeofencingModule() { return <GisSubModulePlaceholder title="Geofencing Center" />; }
export function ApiModule() { return <GisSubModulePlaceholder title="API & GIS Services" />; }
export function SettingsModule() { return <GisSubModulePlaceholder title="Settings" />; }
