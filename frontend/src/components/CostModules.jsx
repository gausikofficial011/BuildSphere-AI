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

export function CostModuleHeader({ title, description, actionText = "Action" }) {
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

export function CostTabs({ tabs, activeTab, onChange }) {
  return (
    <div style={{ display: 'flex', gap: '2rem', borderBottom: '1px solid #334155', marginBottom: '1.5rem', overflowX: 'auto', paddingBottom: '1px' }}>
      {tabs.map(t => (
        <button 
          key={t}
          onClick={() => onChange(t)}
          style={{ 
            padding: '0.75rem 0', 
            background: 'none', border: 'none', 
            borderBottom: activeTab === t ? '2px solid #3b82f6' : '2px solid transparent',
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

function CostSubModulePlaceholder({ title }) {
  return <PremiumPlaceholder title={title} />;
}

export function CostCopilotInterface() {
  const [msgs, setMsgs] = useState([
    { role: 'assistant', text: 'Good Morning, Arun! I am your AI Cost Copilot. The current CPI is 0.92, indicating we are slightly over budget. The primary driver is a 15% escalation in structural steel prices. Should I run a revised Estimate at Completion (EAC) or look for value engineering options?' }
  ]);
  const [inp, setInp] = useState('');

  const handleSend = () => {
    if(!inp.trim()) return;
    setMsgs([...msgs, { role: 'user', text: inp }]);
    setInp('');
    setTimeout(() => {
      setMsgs(prev => [...prev, { role: 'assistant', text: 'Running revised EAC now... Based on current performance trends (CPI=0.92, SPI=0.97), the forecasted Final Cost is ₹ 116.80 Cr (a variance of -₹ 4.30 Cr). I recommend reviewing the Subcontractor packages for potential cost recovery.' }]);
    }, 1000);
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 250px)', backgroundColor: '#e2e8f0', borderRadius: '0.75rem', border: '1px solid #334155', overflow: 'hidden' }}>
      <div style={{ padding: '1.5rem', borderBottom: '1px solid #334155', backgroundColor: '#0b1121', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{ width: '40px', height: '40px', borderRadius: '0.5rem', backgroundColor: 'rgba(59, 130, 246, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#93c5fd' }}>
          <Bot size={24} />
        </div>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', margin: 0, color: '#ffffff' }}>AI Cost Copilot</h2>
          <p style={{ color: '#94a3b8', margin: 0, fontSize: '0.875rem' }}>Your intelligent financial forecasting assistant</p>
        </div>
      </div>
      
      <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid #334155', display: 'flex', gap: '0.5rem', overflowX: 'auto', backgroundColor: 'rgba(0, 0, 0, 0.6)' }}>
        {['Run revised EAC', 'Value engineering options', 'Cash flow analysis', 'Budget variance report', 'Material escalation impact'].map(chip => (
          <button key={chip} onClick={() => setInp(chip)} style={{ padding: '0.5rem 1rem', borderRadius: '9999px', border: '1px solid #334155', backgroundColor: '#0b1121', color: '#cbd5e1', fontSize: '0.75rem', cursor: 'pointer', whiteSpace: 'nowrap' }}>
            {chip}
          </button>
        ))}
      </div>
      
      <div style={{ flex: 1, padding: '1.5rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.5rem', backgroundColor: '#e2e8f0' }}>
        {msgs.map((m, i) => (
          <div key={i} style={{ display: 'flex', gap: '1rem', alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start', maxWidth: '80%' }}>
            {m.role === 'assistant' && (
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', flexShrink: 0 }}>
                <Bot size={16} />
              </div>
            )}
            <div style={{ padding: '1rem', backgroundColor: m.role === 'user' ? '#3b82f6' : '#0b1121', color: '#ffffff', borderRadius: '1rem', borderTopLeftRadius: m.role === 'assistant' ? 0 : '1rem', borderTopRightRadius: m.role === 'user' ? 0 : '1rem', border: m.role === 'user' ? 'none' : '1px solid #334155', fontSize: '0.875rem', lineHeight: '1.5' }}>
              {m.text}
            </div>
          </div>
        ))}
      </div>

      <div style={{ padding: '1.5rem', backgroundColor: '#0b1121', borderTop: '1px solid #334155' }}>
        <div style={{ display: 'flex', gap: '1rem', position: 'relative' }}>
          <input 
            type="text" 
            placeholder="Send command or ask a question..." 
            value={inp}
            onChange={e => setInp(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            style={{ flex: 1, padding: '1rem 1.5rem', backgroundColor: '#e2e8f0', border: '1px solid #334155', color: '#ffffff', borderRadius: '9999px', fontSize: '0.875rem', outline: 'none' }}
          />
          <button 
            onClick={handleSend}
            style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#3b82f6', color: 'white', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.2s' }}
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}

// Rapid stubs for all 40+ requested Cost modules
export function EnterpriseCostModule() {
  const [activeTab, setActiveTab] = useState("Enterprise Budget Dashboard");
  return (
    <div>
      <CostModuleHeader title="Enterprise Cost Control Center" description="Multi-project portfolio view" />
      <CostTabs tabs={['Enterprise Budget Dashboard', 'Multi-Project Cost Monitoring', 'Regional Cost Analysis', 'Portfolio Dashboard']} activeTab={activeTab} onChange={setActiveTab} />
      <CostSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function BudgetPlanningModule() {
  const [activeTab, setActiveTab] = useState("Approved Budget");
  return (
    <div>
      <CostModuleHeader title="Budget Planning Center" description="Initial, approved, and revised budgets" />
      <CostTabs tabs={['Initial Budget', 'Approved Budget', 'Revised Budget', 'Department Budgets', 'Phase Budgets']} activeTab={activeTab} onChange={setActiveTab} />
      <CostSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function CostEstimationModule() {
  const [activeTab, setActiveTab] = useState("Detailed Estimate");
  return (
    <div>
      <CostModuleHeader title="Cost Estimation Center" description="Top-down and bottom-up estimation" />
      <CostTabs tabs={['Preliminary Estimate', 'Concept Estimate', 'Detailed Estimate', 'Parametric Estimate']} activeTab={activeTab} onChange={setActiveTab} />
      <CostSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function ConceptCostModule() {
  const [activeTab, setActiveTab] = useState("Area-Based Estimation");
  return (
    <div>
      <CostModuleHeader title="Conceptual Cost Estimation" description="Early phase cost modeling" />
      <CostTabs tabs={['Area-Based Estimation', 'Volume-Based Estimation', 'Historical Models', 'AI Concept Estimation']} activeTab={activeTab} onChange={setActiveTab} />
      <CostSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function DetailedCostModule() {
  const [activeTab, setActiveTab] = useState("Material Costs");
  return (
    <div>
      <CostModuleHeader title="Detailed Cost Estimation" description="Granular cost breakdown" />
      <CostTabs tabs={['Material Costs', 'Labour Costs', 'Equipment Costs', 'Indirect Costs', 'Overheads']} activeTab={activeTab} onChange={setActiveTab} />
      <CostSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function CbsModule() {
  const [activeTab, setActiveTab] = useState("Cost Codes");
  return (
    <div>
      <CostModuleHeader title="Cost Breakdown Structure (CBS)" description="Hierarchical cost coding" />
      <CostTabs tabs={['Cost Codes', 'Cost Categories', 'Cost Hierarchy', 'Department Allocation']} activeTab={activeTab} onChange={setActiveTab} />
      <CostSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function WbsModule() {
  const [activeTab, setActiveTab] = useState("Work Packages");
  return (
    <div>
      <CostModuleHeader title="Work Breakdown Structure (WBS)" description="Work packages and milestones" />
      <CostTabs tabs={['Work Packages', 'Milestones', 'Cost Packages', 'Activity Costs']} activeTab={activeTab} onChange={setActiveTab} />
      <CostSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function ResourceCostModule() {
  const [activeTab, setActiveTab] = useState("Resource Allocation");
  return (
    <div>
      <CostModuleHeader title="Resource Cost Planning" description="Resource allocation and loading" />
      <CostTabs tabs={['Resource Allocation', 'Cost Loading', 'Productivity Planning', 'Resource Histograms']} activeTab={activeTab} onChange={setActiveTab} />
      <CostSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function MaterialCostModule() {
  const [activeTab, setActiveTab] = useState("Price Escalation");
  return (
    <div>
      <CostModuleHeader title="Material Cost Management" description="Market rates and escalation" />
      <CostTabs tabs={['Material Budget', 'Market Rates', 'Supplier Rates', 'Price Escalation']} activeTab={activeTab} onChange={setActiveTab} />
      <CostSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function LabourCostModule() {
  const [activeTab, setActiveTab] = useState("Crew Productivity");
  return (
    <div>
      <CostModuleHeader title="Labour Cost Management" description="Productivity and overtime" />
      <CostTabs tabs={['Labour Rates', 'Crew Productivity', 'Labour Forecast', 'Overtime Analysis']} activeTab={activeTab} onChange={setActiveTab} />
      <CostSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function EquipmentCostModule() {
  const [activeTab, setActiveTab] = useState("Utilization Cost");
  return (
    <div>
      <CostModuleHeader title="Equipment Cost Management" description="Rental and maintenance costs" />
      <CostTabs tabs={['Rental Analysis', 'Fuel Cost', 'Maintenance Cost', 'Utilization Cost']} activeTab={activeTab} onChange={setActiveTab} />
      <CostSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function SubcontractCostModule() {
  const [activeTab, setActiveTab] = useState("Subcontract Budget");
  return (
    <div>
      <CostModuleHeader title="Subcontract Cost Management" description="Subcontract budgets and payments" />
      <CostTabs tabs={['Subcontract Budget', 'Payment Tracking', 'Cost Comparison']} activeTab={activeTab} onChange={setActiveTab} />
      <CostSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function ProcurementCostModule() {
  const [activeTab, setActiveTab] = useState("Procurement Budget");
  return (
    <div>
      <CostModuleHeader title="Procurement Cost Center" description="PO tracking and logistics" />
      <CostTabs tabs={['Procurement Budget', 'PO Tracking', 'Delivery Costs', 'Logistics Costs']} activeTab={activeTab} onChange={setActiveTab} />
      <CostSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function VendorCostModule() {
  const [activeTab, setActiveTab] = useState("Vendor Cost Comparison");
  return (
    <div>
      <CostModuleHeader title="Vendor Cost Analysis" description="Supplier performance pricing" />
      <CostTabs tabs={['Vendor Cost Comparison', 'Supplier Performance', 'Historical Pricing', 'AI Vendor Ranking']} activeTab={activeTab} onChange={setActiveTab} />
      <CostSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function ContractCostModule() {
  const [activeTab, setActiveTab] = useState("Contract Value");
  return (
    <div>
      <CostModuleHeader title="Contract Cost Management" description="Contract values and commitments" />
      <CostTabs tabs={['Contract Value', 'Payment Schedule', 'Retention', 'Cost Commitments']} activeTab={activeTab} onChange={setActiveTab} />
      <CostSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function ChangeOrderCostModule() {
  const [activeTab, setActiveTab] = useState("Cost Impact");
  return (
    <div>
      <CostModuleHeader title="Change Order Cost Analysis" description="Cost impacts of scope changes" />
      <CostTabs tabs={['Scope Changes', 'Cost Impact', 'Budget Impact', 'Approval Status']} activeTab={activeTab} onChange={setActiveTab} />
      <CostSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function VariationCostModule() {
  const [activeTab, setActiveTab] = useState("Financial Impact");
  return (
    <div>
      <CostModuleHeader title="Variation Cost Management" description="VO tracking and financial risk" />
      <CostTabs tabs={['VO Tracking', 'Cost Approval', 'Financial Impact', 'Risk Analysis']} activeTab={activeTab} onChange={setActiveTab} />
      <CostSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function EvmModule() {
  const [activeTab, setActiveTab] = useState("EVM Dashboard");
  return (
    <div>
      <CostModuleHeader title="Earned Value Management (EVM)" description="PV, EV, AC, and EAC" />
      <CostTabs tabs={['EVM Dashboard', 'CPI/SPI Analysis', 'Variance Analysis', 'EAC/ETC Forecasts']} activeTab={activeTab} onChange={setActiveTab} />
      <CostSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function CpiModule() {
  const [activeTab, setActiveTab] = useState("CPI Dashboard");
  return (
    <div>
      <CostModuleHeader title="Cost Performance Index (CPI)" description="Cost efficiency trends" />
      <CostTabs tabs={['CPI Dashboard', 'Performance Trend', 'AI Cost Prediction']} activeTab={activeTab} onChange={setActiveTab} />
      <CostSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function SpiModule() {
  const [activeTab, setActiveTab] = useState("Schedule Dashboard");
  return (
    <div>
      <CostModuleHeader title="Schedule Performance Index (SPI)" description="Schedule efficiency" />
      <CostTabs tabs={['Schedule Dashboard', 'Delay Impact', 'Schedule Forecast']} activeTab={activeTab} onChange={setActiveTab} />
      <CostSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function CostForecastModule() {
  const [activeTab, setActiveTab] = useState("Final Cost Prediction");
  return (
    <div>
      <CostModuleHeader title="Cost Forecasting Center" description="Predicting final project costs" />
      <CostTabs tabs={['Monthly Forecast', 'Quarterly Forecast', 'Annual Forecast', 'Final Cost Prediction']} activeTab={activeTab} onChange={setActiveTab} />
      <CostSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function CashFlowModule() {
  const [activeTab, setActiveTab] = useState("Net Cash Flow");
  return (
    <div>
      <CostModuleHeader title="Cash Flow Management" description="Inflow, outflow, and burn rate" />
      <CostTabs tabs={['Inflow', 'Outflow', 'Net Cash Flow', 'Burn Rate', 'Financial Forecast']} activeTab={activeTab} onChange={setActiveTab} />
      <CostSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function BudgetActualModule() {
  const [activeTab, setActiveTab] = useState("Cost Comparison");
  return (
    <div>
      <CostModuleHeader title="Budget vs Actual Analysis" description="Variance tracking" />
      <CostTabs tabs={['Cost Comparison', 'Department Analysis', 'Package Analysis', 'Trend Charts']} activeTab={activeTab} onChange={setActiveTab} />
      <CostSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function CostTrendModule() {
  const [activeTab, setActiveTab] = useState("Inflation Trends");
  return (
    <div>
      <CostModuleHeader title="Cost Trend Analytics" description="Historical inflation and escalation" />
      <CostTabs tabs={['Historical Trends', 'Inflation Trends', 'Escalation Analysis']} activeTab={activeTab} onChange={setActiveTab} />
      <CostSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function CostBenchmarkingModule() {
  const [activeTab, setActiveTab] = useState("Industry Benchmarks");
  return (
    <div>
      <CostModuleHeader title="Cost Benchmarking" description="Industry and company standards" />
      <CostTabs tabs={['Similar Projects', 'Industry Benchmarks', 'Regional Benchmarks']} activeTab={activeTab} onChange={setActiveTab} />
      <CostSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function CostRiskModule() {
  const [activeTab, setActiveTab] = useState("Financial Risks");
  return (
    <div>
      <CostModuleHeader title="Cost Risk Management" description="Financial threat analysis" />
      <CostTabs tabs={['Financial Risks', 'Inflation Risk', 'Exchange Rate Risk', 'Delay Cost Risk']} activeTab={activeTab} onChange={setActiveTab} />
      <CostSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function ValueEngineeringModule() {
  const [activeTab, setActiveTab] = useState("Cost Saving Opportunities");
  return (
    <div>
      <CostModuleHeader title="Value Engineering Center" description="Cost saving opportunities" />
      <CostTabs tabs={['Alternative Materials', 'Alternative Methods', 'Cost Saving Opportunities', 'ROI Analysis']} activeTab={activeTab} onChange={setActiveTab} />
      <CostSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function ProfitabilityModule() {
  const [activeTab, setActiveTab] = useState("Margin Analysis");
  return (
    <div>
      <CostModuleHeader title="Profitability Analysis" description="Gross and net margins" />
      <CostTabs tabs={['Gross Profit', 'Net Profit', 'ROI', 'EBITDA', 'Margin Analysis']} activeTab={activeTab} onChange={setActiveTab} />
      <CostSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function FinancialKpiModule() {
  const [activeTab, setActiveTab] = useState("Financial Health");
  return (
    <div>
      <CostModuleHeader title="Financial KPI Dashboard" description="Executive summary of health" />
      <CostTabs tabs={['Revenue', 'Expenses', 'Cash Position', 'Financial Health']} activeTab={activeTab} onChange={setActiveTab} />
      <CostSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function CostOptimizationModule() {
  const [activeTab, setActiveTab] = useState("Material Optimization");
  return (
    <div>
      <CostModuleHeader title="Cost Optimization Center" description="Resource and procurement efficiency" />
      <CostTabs tabs={['Material Optimization', 'Resource Optimization', 'Procurement Optimization']} activeTab={activeTab} onChange={setActiveTab} />
      <CostSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function CarbonCostModule() {
  const [activeTab, setActiveTab] = useState("ESG Dashboard");
  return (
    <div>
      <CostModuleHeader title="Carbon Cost Analysis" description="ESG and embodied carbon pricing" />
      <CostTabs tabs={['Carbon Pricing', 'Embodied Carbon', 'Operational Carbon', 'ESG Dashboard']} activeTab={activeTab} onChange={setActiveTab} />
      <CostSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function LccaModule() {
  const [activeTab, setActiveTab] = useState("Operating Cost");
  return (
    <div>
      <CostModuleHeader title="Lifecycle Cost Analysis (LCCA)" description="Long-term operational costs" />
      <CostTabs tabs={['Construction Cost', 'Operating Cost', 'Maintenance Cost', 'End-of-Life Cost']} activeTab={activeTab} onChange={setActiveTab} />
      <CostSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function BimCostModule() {
  const [activeTab, setActiveTab] = useState("Cost Overlay");
  return (
    <div>
      <CostModuleHeader title="BIM 5D Cost Integration" description="Model-based cost overlay" />
      <CostTabs tabs={['Live Quantities', 'Cost Overlay', 'Quantity Sync', 'Design Change Impact']} activeTab={activeTab} onChange={setActiveTab} />
      <CostSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function TwinCostModule() {
  const [activeTab, setActiveTab] = useState("Live Cost Dashboard");
  return (
    <div>
      <CostModuleHeader title="Digital Twin Cost Monitoring" description="Operational asset costs" />
      <CostTabs tabs={['Live Cost Dashboard', 'Operational Cost', 'Asset Cost', 'Maintenance Cost']} activeTab={activeTab} onChange={setActiveTab} />
      <CostSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function ErpModule() {
  const [activeTab, setActiveTab] = useState("SAP");
  return (
    <div>
      <CostModuleHeader title="ERP & Finance Integration" description="Financial data synchronization" />
      <CostTabs tabs={['SAP', 'Oracle ERP', 'Microsoft Dynamics', 'Odoo']} activeTab={activeTab} onChange={setActiveTab} />
      <CostSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function ReportsModule() { return <GoogleDocsReportGenerator portalRole="Cost Engineer & Estimator" defaultProject="Skyline Towers - Phase 1" />; }

export function AiMlCenterModule() {
  const [t, setT] = useState('AI Cost Copilot');
  return (
    <div>
      <CostModuleHeader title="AI & ML Center" description="Financial Intelligence" />
      <CostTabs tabs={['AI Cost Copilot', 'Cost Prediction AI', 'Budget AI', 'Procurement AI', 'Financial AI']} activeTab={t} onChange={setT} />
      {t === 'AI Cost Copilot' ? <CostCopilotInterface /> : <CostSubModulePlaceholder title={t} />}
    </div>
  );
}
