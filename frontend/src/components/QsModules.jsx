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

export function QsModuleHeader({ title, description, actionText = "Action" }) {
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

export function QsTabs({ tabs, activeTab, onChange }) {
  return (
    <div style={{ display: 'flex', gap: '2rem', borderBottom: '1px solid #334155', marginBottom: '1.5rem', overflowX: 'auto', paddingBottom: '1px' }}>
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

function QsSubModulePlaceholder({ title }) {
  return <PremiumPlaceholder title={title} />;
}

export function QsCopilotInterface() {
  const [msgs, setMsgs] = useState([
    { role: 'assistant', text: 'Good Morning, Arun! I am your AI BOQ Copilot. I have analyzed the latest design revision for Skyline Towers. There is a 12% increase in structural steel quantities. Would you like me to generate a variance report or update the BOQ?' }
  ]);
  const [inp, setInp] = useState('');

  const handleSend = () => {
    if(!inp.trim()) return;
    setMsgs([...msgs, { role: 'user', text: inp }]);
    setInp('');
    setTimeout(() => {
      setMsgs(prev => [...prev, { role: 'assistant', text: 'Generating the variance report now. Based on the current Schedule of Rates (SOR), this variation will increase the cost by ₹ 1.25 Cr. I have also drafted a Change Order request for your review.' }]);
    }, 1000);
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 250px)', backgroundColor: 'rgba(15, 23, 42, 0.7)', backdropFilter: 'blur(16px)', borderRadius: '0.75rem', border: '1px solid rgba(255, 255, 255, 0.1)', overflow: 'hidden' }}>
      <div style={{ padding: '1.5rem', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', backgroundColor: 'rgba(0, 0, 0, 0.2)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{ width: '40px', height: '40px', borderRadius: '0.5rem', backgroundColor: 'rgba(79, 70, 229, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#818cf8' }}>
          <Bot size={24} />
        </div>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', margin: 0, color: '#ffffff' }}>AI BOQ Copilot</h2>
          <p style={{ color: '#94a3b8', margin: 0, fontSize: '0.875rem' }}>Your intelligent commercial assistant</p>
        </div>
      </div>
      
      <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', display: 'flex', gap: '0.5rem', overflowX: 'auto', backgroundColor: 'rgba(0, 0, 0, 0.1)' }}>
        {['Generate BOQ from drawings', 'Compare vendor quotations', 'Check rate analysis', 'Variance IPC', 'Cost forecast'].map(chip => (
          <button key={chip} onClick={() => setInp(chip)} style={{ padding: '0.5rem 1rem', borderRadius: '9999px', border: '1px solid rgba(255, 255, 255, 0.1)', backgroundColor: 'rgba(255, 255, 255, 0.05)', color: '#cbd5e1', fontSize: '0.75rem', cursor: 'pointer', whiteSpace: 'nowrap' }}>
            {chip}
          </button>
        ))}
      </div>
      
      <div style={{ flex: 1, padding: '1.5rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {msgs.map((m, i) => (
          <div key={i} style={{ display: 'flex', gap: '1rem', alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start', maxWidth: '80%' }}>
            {m.role === 'assistant' && (
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#4f46e5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', flexShrink: 0 }}>
                <Bot size={16} />
              </div>
            )}
            <div style={{ padding: '1rem', backgroundColor: m.role === 'user' ? '#4f46e5' : 'rgba(255, 255, 255, 0.05)', color: '#ffffff', borderRadius: '1rem', borderTopLeftRadius: m.role === 'assistant' ? 0 : '1rem', borderTopRightRadius: m.role === 'user' ? 0 : '1rem', border: m.role === 'user' ? 'none' : '1px solid rgba(255, 255, 255, 0.1)', fontSize: '0.875rem', lineHeight: '1.5' }}>
              {m.text}
            </div>
          </div>
        ))}
      </div>

      <div style={{ padding: '1.5rem', backgroundColor: 'rgba(0, 0, 0, 0.2)', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
        <div style={{ display: 'flex', gap: '1rem', position: 'relative' }}>
          <input 
            type="text" 
            placeholder="Send command or ask a question..." 
            value={inp}
            onChange={e => setInp(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            style={{ flex: 1, padding: '1rem 1.5rem', backgroundColor: 'rgba(0, 0, 0, 0.4)', border: '1px solid rgba(255, 255, 255, 0.15)', color: '#ffffff', borderRadius: '9999px', fontSize: '0.875rem', outline: 'none' }}
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

// Rapid stubs for all 40+ requested QS modules
export function BoqManagementModule() {
  const [activeTab, setActiveTab] = useState("Master BOQ");
  return (
    <div>
      <QsModuleHeader title="BOQ Management Center" description="Master Bill of Quantities" />
      <QsTabs tabs={['Master BOQ', 'BOQ Revision History', 'BOQ Comparison', 'BOQ Approval', 'BOQ Templates']} activeTab={activeTab} onChange={setActiveTab} />
      <QsSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function QuantityTakeoffModule() {
  const [activeTab, setActiveTab] = useState("Concrete");
  return (
    <div>
      <QsModuleHeader title="Quantity Takeoff Center" description="Measurement by discipline" />
      <QsTabs tabs={['Concrete', 'Reinforcement', 'Steel', 'Masonry', 'Finishing']} activeTab={activeTab} onChange={setActiveTab} />
      <QsSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function AiTakeoffModule() {
  const [activeTab, setActiveTab] = useState("Auto Drawing Recognition");
  return (
    <div>
      <QsModuleHeader title="AI Quantity Extraction" description="Auto-measurement from drawings" />
      <QsTabs tabs={['Auto Drawing Recognition', 'AI Object Detection', 'Auto Quantity Measurement', 'AI BOQ Generator']} activeTab={activeTab} onChange={setActiveTab} />
      <QsSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function DrawingMeasurementModule() {
  const [activeTab, setActiveTab] = useState("PDF Measurement");
  return (
    <div>
      <QsModuleHeader title="Drawing Measurement Studio" description="Manual and AI-assisted PDF/CAD measurement" />
      <QsTabs tabs={['PDF Measurement', 'CAD Measurement', 'Scale Calibration', 'Area Measurement']} activeTab={activeTab} onChange={setActiveTab} />
      <QsSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function BimQuantityModule() {
  const [activeTab, setActiveTab] = useState("IFC Extraction");
  return (
    <div>
      <QsModuleHeader title="BIM Quantity Takeoff" description="Model-based measurement" />
      <QsTabs tabs={['IFC Extraction', 'Revit Takeoff', 'Navisworks Integration', 'Model Measurement']} activeTab={activeTab} onChange={setActiveTab} />
      <QsSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function MeasurementViewerModule() {
  const [activeTab, setActiveTab] = useState("Interactive 2D");
  return (
    <div>
      <QsModuleHeader title="2D & 3D Measurement Viewer" description="Interactive visualization" />
      <QsTabs tabs={['Interactive 2D', '3D Model', 'Section Views', 'Layer Control']} activeTab={activeTab} onChange={setActiveTab} />
      <QsSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function MaterialEstimationModule() {
  const [activeTab, setActiveTab] = useState("Concrete/Steel");
  return (
    <div>
      <QsModuleHeader title="Material Estimation Center" description="Detailed material requirements" />
      <QsTabs tabs={['Concrete/Steel', 'Cement/Sand', 'Bricks/Blocks', 'Finishing', 'MEP Materials']} activeTab={activeTab} onChange={setActiveTab} />
      <QsSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function CostEstimationModule() {
  const [activeTab, setActiveTab] = useState("Detailed Estimate");
  return (
    <div>
      <QsModuleHeader title="Cost Estimation Center" description="Project cost planning" />
      <QsTabs tabs={['Preliminary Estimate', 'Detailed Estimate', 'Cost Plan', 'Unit Cost Analysis']} activeTab={activeTab} onChange={setActiveTab} />
      <QsSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function RateAnalysisModule() {
  const [activeTab, setActiveTab] = useState("Material Rates");
  return (
    <div>
      <QsModuleHeader title="Rate Analysis Center" description="Component cost breakdown" />
      <QsTabs tabs={['Material Rates', 'Labour Rates', 'Equipment Rates', 'Transportation', 'Overheads']} activeTab={activeTab} onChange={setActiveTab} />
      <QsSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function SorModule() {
  const [activeTab, setActiveTab] = useState("Company SOR");
  return (
    <div>
      <QsModuleHeader title="Schedule of Rates (SOR)" description="Standardized rates repository" />
      <QsTabs tabs={['Government SOR', 'Company SOR', 'Custom SOR', 'Historical Rates']} activeTab={activeTab} onChange={setActiveTab} />
      <QsSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function TenderManagementModule() {
  const [activeTab, setActiveTab] = useState("Commercial Evaluation");
  return (
    <div>
      <QsModuleHeader title="Tender Management" description="Bidding and evaluation" />
      <QsTabs tabs={['Tender Creation', 'Bid Invitations', 'Technical Evaluation', 'Commercial Evaluation']} activeTab={activeTab} onChange={setActiveTab} />
      <QsSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function BidComparisonModule() {
  const [activeTab, setActiveTab] = useState("Rate Comparison");
  return (
    <div>
      <QsModuleHeader title="Bid Comparison Center" description="Evaluate vendor quotations" />
      <QsTabs tabs={['Vendor Comparison', 'Rate Comparison', 'Technical Comparison', 'Financial Comparison']} activeTab={activeTab} onChange={setActiveTab} />
      <QsSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function ProcurementModule() {
  const [activeTab, setActiveTab] = useState("Procurement Schedule");
  return (
    <div>
      <QsModuleHeader title="Procurement Planning" description="Material delivery schedules" />
      <QsTabs tabs={['Procurement Schedule', 'Procurement Packages', 'Material Planning', 'Delivery Planning']} activeTab={activeTab} onChange={setActiveTab} />
      <QsSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function VendorQuoteModule() {
  const [activeTab, setActiveTab] = useState("Quotation Tracking");
  return (
    <div>
      <QsModuleHeader title="Vendor Quotation Management" description="RFQ and tracking" />
      <QsTabs tabs={['RFQ', 'Quotation Tracking', 'Vendor Evaluation', 'Price Comparison']} activeTab={activeTab} onChange={setActiveTab} />
      <QsSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function PurchaseRequestModule() {
  const [activeTab, setActiveTab] = useState("Material Requests");
  return (
    <div>
      <QsModuleHeader title="Purchase Request Management" description="Internal material requests" />
      <QsTabs tabs={['Material Requests', 'Approval Workflow', 'Procurement Status', 'Request History']} activeTab={activeTab} onChange={setActiveTab} />
      <QsSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function PurchaseOrderModule() {
  const [activeTab, setActiveTab] = useState("PO Tracking");
  return (
    <div>
      <QsModuleHeader title="Purchase Order Tracking" description="PO lifecycle" />
      <QsTabs tabs={['PO Creation', 'PO Approval', 'Delivery Status', 'Invoice Matching']} activeTab={activeTab} onChange={setActiveTab} />
      <QsSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function ContractModule() {
  const [activeTab, setActiveTab] = useState("Main Contracts");
  return (
    <div>
      <QsModuleHeader title="Contract Management" description="Main and subcontracts" />
      <QsTabs tabs={['Main Contracts', 'Subcontracts', 'Contract Variations', 'Payment Terms']} activeTab={activeTab} onChange={setActiveTab} />
      <QsSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function VariationOrderModule() {
  const [activeTab, setActiveTab] = useState("Change Requests");
  return (
    <div>
      <QsModuleHeader title="Variation Order Management" description="Track BOQ variations" />
      <QsTabs tabs={['Change Requests', 'Quantity Variations', 'Cost Variations', 'Impact Analysis']} activeTab={activeTab} onChange={setActiveTab} />
      <QsSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function ChangeOrderModule() {
  const [activeTab, setActiveTab] = useState("Scope Changes");
  return (
    <div>
      <QsModuleHeader title="Change Order Management" description="Design and scope changes" />
      <QsTabs tabs={['Design Changes', 'Material Changes', 'Scope Changes', 'Schedule Impacts']} activeTab={activeTab} onChange={setActiveTab} />
      <QsSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function IpcModule() {
  const [activeTab, setActiveTab] = useState("IPC Preparation");
  return (
    <div>
      <QsModuleHeader title="Interim Payment Certificate (IPC)" description="Client billing" />
      <QsTabs tabs={['IPC Preparation', 'Measurement Validation', 'Approval Workflow', 'Payment Tracking']} activeTab={activeTab} onChange={setActiveTab} />
      <QsSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function RaBillModule() {
  const [activeTab, setActiveTab] = useState("RA Bill Preparation");
  return (
    <div>
      <QsModuleHeader title="Running Account (RA) Bills" description="Contractor billing" />
      <QsTabs tabs={['RA Bill Preparation', 'Quantity Verification', 'Payment Certificates', 'Bill History']} activeTab={activeTab} onChange={setActiveTab} />
      <QsSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function ClientBillingModule() {
  const [activeTab, setActiveTab] = useState("Client Invoices");
  return (
    <div>
      <QsModuleHeader title="Client Billing Center" description="Invoicing and retention" />
      <QsTabs tabs={['Client Invoices', 'Payment Tracking', 'Outstanding Amounts', 'Retention Management']} activeTab={activeTab} onChange={setActiveTab} />
      <QsSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function ContractorBillingModule() {
  const [activeTab, setActiveTab] = useState("Contractor Bills");
  return (
    <div>
      <QsModuleHeader title="Contractor Billing Center" description="Subcontractor payments" />
      <QsTabs tabs={['Contractor Bills', 'Verification', 'Approvals', 'Payment Status']} activeTab={activeTab} onChange={setActiveTab} />
      <QsSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function SubcontractBillingModule() {
  const [activeTab, setActiveTab] = useState("Subcontract Bills");
  return (
    <div>
      <QsModuleHeader title="Subcontract Billing" description="Work orders and measurements" />
      <QsTabs tabs={['Work Orders', 'Subcontract Bills', 'Measurement Sheets', 'Payment Releases']} activeTab={activeTab} onChange={setActiveTab} />
      <QsSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function MaterialReconModule() {
  const [activeTab, setActiveTab] = useState("Planned vs Actual");
  return (
    <div>
      <QsModuleHeader title="Material Reconciliation" description="Planned vs actual consumption" />
      <QsTabs tabs={['Planned vs Actual', 'Material Wastage', 'Inventory Balance', 'Stock Reconciliation']} activeTab={activeTab} onChange={setActiveTab} />
      <QsSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function InventoryCostModule() {
  const [activeTab, setActiveTab] = useState("Material Receipts");
  return (
    <div>
      <QsModuleHeader title="Inventory Cost Verification" description="Warehouse tracking" />
      <QsTabs tabs={['Material Receipts', 'Consumption', 'Cost Tracking', 'Warehouse Integration']} activeTab={activeTab} onChange={setActiveTab} />
      <QsSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function EarnedValueModule() {
  const [activeTab, setActiveTab] = useState("Earned Value (EV)");
  return (
    <div>
      <QsModuleHeader title="Earned Value Analysis" description="EV, PV, AC, CPI, SPI" />
      <QsTabs tabs={['Planned Value (PV)', 'Earned Value (EV)', 'Actual Cost (AC)', 'Performance Index']} activeTab={activeTab} onChange={setActiveTab} />
      <QsSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function CashFlowModule() {
  const [activeTab, setActiveTab] = useState("Project Cash Flow");
  return (
    <div>
      <QsModuleHeader title="Cash Flow Forecasting" description="Revenue and expenses" />
      <QsTabs tabs={['Monthly Cash Flow', 'Project Cash Flow', 'Revenue Forecast', 'Expense Forecast']} activeTab={activeTab} onChange={setActiveTab} />
      <QsSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function BudgetActualModule() {
  const [activeTab, setActiveTab] = useState("Cost Variance");
  return (
    <div>
      <QsModuleHeader title="Budget vs Actual" description="Cost tracking" />
      <QsTabs tabs={['Budget Tracking', 'Cost Variance', 'Quantity Variance', 'Forecast Completion Cost']} activeTab={activeTab} onChange={setActiveTab} />
      <QsSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function ProductivityModule() {
  const [activeTab, setActiveTab] = useState("Labour Productivity");
  return (
    <div>
      <QsModuleHeader title="Productivity Analysis" description="Labour and equipment" />
      <QsTabs tabs={['Labour Productivity', 'Equipment Productivity', 'Material Productivity', 'Work Package']} activeTab={activeTab} onChange={setActiveTab} />
      <QsSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function RiskClaimsModule() { return <IssueTracker portalRole="Quantity Surveyor (QS)" projectId={1} defaultCategory="Risk" />; }
export function DocumentModule() { return <DocumentCenter portalRole="Quantity Surveyor (QS)" projectId={1} />; }
export function BimIntegrationModule() {
  const [activeTab, setActiveTab] = useState("BIM Cost Overlay");
  return (
    <div>
      <QsModuleHeader title="BIM Integration" description="Link quantities to models" />
      <QsTabs tabs={['Live Quantity Sync', 'BIM Cost Overlay', 'Object Quantities', 'Design Change Detection']} activeTab={activeTab} onChange={setActiveTab} />
      <QsSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function TwinIntegrationModule() {
  const [activeTab, setActiveTab] = useState("Live Quantity Progress");
  return (
    <div>
      <QsModuleHeader title="Digital Twin Integration" description="Live site progress" />
      <QsTabs tabs={['Live Quantity Progress', 'Material Consumption', 'Cost Monitoring', 'Asset Quantities']} activeTab={activeTab} onChange={setActiveTab} />
      <QsSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function ErpModule() {
  const [activeTab, setActiveTab] = useState("SAP");
  return (
    <div>
      <QsModuleHeader title="ERP Integration" description="Connect to finance systems" />
      <QsTabs tabs={['SAP', 'Oracle', 'Microsoft Dynamics', 'Odoo']} activeTab={activeTab} onChange={setActiveTab} />
      <QsSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function ReportsModule() { return <GoogleDocsReportGenerator portalRole="Quantity Surveyor (QS)" defaultProject="Skyline Towers - Phase 1" />; }

export function AiMlCenterModule() {
  const [t, setT] = useState('AI BOQ Copilot');
  return (
    <div>
      <QsModuleHeader title="AI & ML Center" description="Commercial Intelligence" />
      <QsTabs tabs={['AI BOQ Copilot', 'Quantity Takeoff AI', 'Cost AI', 'Procurement AI', 'Contract AI']} activeTab={t} onChange={setT} />
      {t === 'AI BOQ Copilot' ? <QsCopilotInterface /> : <QsSubModulePlaceholder title={t} />}
    </div>
  );
}
