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

export function ProcurementModuleHeader({ title, description, actionText = "Action" }) {
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

export function ProcurementTabs({ tabs, activeTab, onChange }) {
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

function ProcurementSubModulePlaceholder({ title }) {
  return <PremiumPlaceholder title={title} />;
}

export function ProcurementCopilotInterface() {
  const [msgs, setMsgs] = useState([
    { role: 'assistant', text: 'Good Morning, Arun! I am your AI Procurement Copilot. I have detected a potential delay for PO #4587 (TMT Bars from Mega Steel Corp) due to logistical issues. This might impact the slab casting schedule next week. Would you like me to find alternative suppliers or expedite shipping?' }
  ]);
  const [inp, setInp] = useState('');

  const handleSend = () => {
    if(!inp.trim()) return;
    setMsgs([...msgs, { role: 'user', text: inp }]);
    setInp('');
    setTimeout(() => {
      setMsgs(prev => [...prev, { role: 'assistant', text: 'Searching for alternatives... I found that InfraBuild Solutions has 150 MT of TMT Bars available at their local warehouse. Generating an emergency RFQ now.' }]);
    }, 1000);
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 250px)', backgroundColor: 'rgba(15, 23, 42, 0.7)', backdropFilter: 'blur(16px)', borderRadius: '0.75rem', border: '1px solid rgba(255, 255, 255, 0.1)', overflow: 'hidden' }}>
      <div style={{ padding: '1.5rem', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', backgroundColor: 'rgba(0, 0, 0, 0.2)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{ width: '40px', height: '40px', borderRadius: '0.5rem', backgroundColor: 'rgba(59, 130, 246, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#93c5fd' }}>
          <Bot size={24} />
        </div>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', margin: 0, color: '#ffffff' }}>AI Procurement Copilot</h2>
          <p style={{ color: '#94a3b8', margin: 0, fontSize: '0.875rem' }}>Your intelligent supply chain and sourcing assistant</p>
        </div>
      </div>
      
      <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', display: 'flex', gap: '0.5rem', overflowX: 'auto', backgroundColor: 'rgba(0, 0, 0, 0.1)' }}>
        {['Vendor performance analysis', 'Price trend analysis', 'PO status summary', 'Inventory forecast', 'Supplier risk assessment'].map(chip => (
          <button key={chip} onClick={() => setInp(chip)} style={{ padding: '0.5rem 1rem', borderRadius: '9999px', border: '1px solid rgba(255, 255, 255, 0.1)', backgroundColor: 'rgba(255, 255, 255, 0.05)', color: '#cbd5e1', fontSize: '0.75rem', cursor: 'pointer', whiteSpace: 'nowrap' }}>
            {chip}
          </button>
        ))}
      </div>
      
      <div style={{ flex: 1, padding: '1.5rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {msgs.map((m, i) => (
          <div key={i} style={{ display: 'flex', gap: '1rem', alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start', maxWidth: '80%' }}>
            {m.role === 'assistant' && (
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', flexShrink: 0 }}>
                <Bot size={16} />
              </div>
            )}
            <div style={{ padding: '1rem', backgroundColor: m.role === 'user' ? '#3b82f6' : 'rgba(255, 255, 255, 0.05)', color: '#ffffff', borderRadius: '1rem', borderTopLeftRadius: m.role === 'assistant' ? 0 : '1rem', borderTopRightRadius: m.role === 'user' ? 0 : '1rem', border: m.role === 'user' ? 'none' : '1px solid rgba(255, 255, 255, 0.1)', fontSize: '0.875rem', lineHeight: '1.5' }}>
              {m.text}
            </div>
          </div>
        ))}
      </div>

      <div style={{ padding: '1.5rem', backgroundColor: 'rgba(0, 0, 0, 0.2)', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
        <div style={{ display: 'flex', gap: '1rem', position: 'relative' }}>
          <input 
            type="text" 
            placeholder="Type your question..." 
            value={inp}
            onChange={e => setInp(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            style={{ flex: 1, padding: '1rem 1.5rem', backgroundColor: 'rgba(0, 0, 0, 0.4)', border: '1px solid rgba(255, 255, 255, 0.15)', color: '#ffffff', borderRadius: '9999px', fontSize: '0.875rem', outline: 'none' }}
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

// Rapid stubs for all 40+ requested Procurement modules
export function ProcurementCommandModule() {
  const [activeTab, setActiveTab] = useState("Enterprise Dashboard");
  return (
    <div>
      <ProcurementModuleHeader title="Procurement Command Center" description="Multi-project procurement pipeline" />
      <ProcurementTabs tabs={['Enterprise Dashboard', 'Multi-Project Procurement', 'Procurement Calendar', 'Procurement Pipeline']} activeTab={activeTab} onChange={setActiveTab} />
      <ProcurementSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function ProcurementPlanningModule() {
  const [activeTab, setActiveTab] = useState("Procurement Packages");
  return (
    <div>
      <ProcurementModuleHeader title="Procurement Planning" description="Packages and timelines" />
      <ProcurementTabs tabs={['Procurement Packages', 'Material Planning', 'Equipment Planning', 'Long Lead Items']} activeTab={activeTab} onChange={setActiveTab} />
      <ProcurementSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function MrpModule() {
  const [activeTab, setActiveTab] = useState("Material Forecast");
  return (
    <div>
      <ProcurementModuleHeader title="Material Requirement Planning (MRP)" description="Forecasting and stock levels" />
      <ProcurementTabs tabs={['Material Forecast', 'Safety Stock', 'Reorder Levels', 'Material Consumption']} activeTab={activeTab} onChange={setActiveTab} />
      <ProcurementSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function ProcurementScheduleModule() {
  const [activeTab, setActiveTab] = useState("Procurement Timeline");
  return (
    <div>
      <ProcurementModuleHeader title="Procurement Schedule" description="Delivery timelines" />
      <ProcurementTabs tabs={['Procurement Timeline', 'Delivery Calendar', 'Critical Deliveries', 'Delayed Orders']} activeTab={activeTab} onChange={setActiveTab} />
      <ProcurementSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function PrModule() {
  const [activeTab, setActiveTab] = useState("Create PR");
  return (
    <div>
      <ProcurementModuleHeader title="Purchase Requisition (PR)" description="Internal material requests" />
      <ProcurementTabs tabs={['Create PR', 'Approval Workflow', 'Department Requests', 'Emergency Requests']} activeTab={activeTab} onChange={setActiveTab} />
      <ProcurementSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function PoModule() {
  const [activeTab, setActiveTab] = useState("PO Tracking");
  return (
    <div>
      <ProcurementModuleHeader title="Purchase Order (PO) Management" description="PO lifecycle" />
      <ProcurementTabs tabs={['Create PO', 'PO Tracking', 'Partial Deliveries', 'Closed POs']} activeTab={activeTab} onChange={setActiveTab} />
      <ProcurementSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function RfqModule() {
  const [activeTab, setActiveTab] = useState("RFQ Comparison");
  return (
    <div>
      <ProcurementModuleHeader title="Request for Quotation (RFQ)" description="Vendor invitations and comparisons" />
      <ProcurementTabs tabs={['RFQ Creation', 'Vendor Responses', 'RFQ Comparison', 'RFQ Analytics']} activeTab={activeTab} onChange={setActiveTab} />
      <ProcurementSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function RfpModule() {
  const [activeTab, setActiveTab] = useState("Technical Evaluation");
  return (
    <div>
      <ProcurementModuleHeader title="Request for Proposal (RFP)" description="Technical and commercial evaluations" />
      <ProcurementTabs tabs={['Proposal Collection', 'Technical Evaluation', 'Commercial Evaluation', 'AI Proposal Ranking']} activeTab={activeTab} onChange={setActiveTab} />
      <ProcurementSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function RfiModule() {
  const [activeTab, setActiveTab] = useState("Supplier Questions");
  return (
    <div>
      <ProcurementModuleHeader title="Request for Information (RFI)" description="Supplier clarifications" />
      <ProcurementTabs tabs={['Supplier Questions', 'Clarifications', 'Technical Discussions']} activeTab={activeTab} onChange={setActiveTab} />
      <ProcurementSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function VendorManagementModule() {
  const [activeTab, setActiveTab] = useState("Vendor Database");
  return (
    <div>
      <ProcurementModuleHeader title="Vendor Management" description="Supplier database" />
      <ProcurementTabs tabs={['Vendor Database', 'Vendor Categories', 'Certifications', 'Banking Information']} activeTab={activeTab} onChange={setActiveTab} />
      <ProcurementSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function VendorRegistrationModule() {
  const [activeTab, setActiveTab] = useState("KYC Verification");
  return (
    <div>
      <ProcurementModuleHeader title="Vendor Registration" description="Onboarding suppliers" />
      <ProcurementTabs tabs={['Online Registration', 'KYC Verification', 'Tax Validation', 'Document Upload']} activeTab={activeTab} onChange={setActiveTab} />
      <ProcurementSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function VendorQualificationModule() {
  const [activeTab, setActiveTab] = useState("Compliance Verification");
  return (
    <div>
      <ProcurementModuleHeader title="Vendor Qualification" description="Compliance and assessment" />
      <ProcurementTabs tabs={['Technical Evaluation', 'Financial Evaluation', 'Compliance Verification', 'Capability Assessment']} activeTab={activeTab} onChange={setActiveTab} />
      <ProcurementSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function VendorPerformanceModule() {
  const [activeTab, setActiveTab] = useState("Delivery Performance");
  return (
    <div>
      <ProcurementModuleHeader title="Vendor Performance Center" description="Delivery and quality KPIs" />
      <ProcurementTabs tabs={['Delivery Performance', 'Quality Rating', 'Response Time', 'Price Competitiveness']} activeTab={activeTab} onChange={setActiveTab} />
      <ProcurementSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function SrmModule() {
  const [activeTab, setActiveTab] = useState("Vendor Scorecards");
  return (
    <div>
      <ProcurementModuleHeader title="Supplier Relationship Management" description="Scorecards and reviews" />
      <ProcurementTabs tabs={['Meetings', 'Performance Reviews', 'Vendor Collaboration', 'Vendor Scorecards']} activeTab={activeTab} onChange={setActiveTab} />
      <ProcurementSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function StrategicSourcingModule() {
  const [activeTab, setActiveTab] = useState("Supplier Optimization");
  return (
    <div>
      <ProcurementModuleHeader title="Strategic Sourcing" description="Global and local suppliers" />
      <ProcurementTabs tabs={['Global Suppliers', 'Local Suppliers', 'Multi-source Procurement', 'Supplier Optimization']} activeTab={activeTab} onChange={setActiveTab} />
      <ProcurementSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function TenderManagementModule() {
  const [activeTab, setActiveTab] = useState("Bid Evaluation");
  return (
    <div>
      <ProcurementModuleHeader title="Tender Management" description="Bidding process" />
      <ProcurementTabs tabs={['Tender Creation', 'Bid Invitations', 'Bid Evaluation', 'Award Recommendation']} activeTab={activeTab} onChange={setActiveTab} />
      <ProcurementSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function BidEvaluationModule() {
  const [activeTab, setActiveTab] = useState("Vendor Ranking");
  return (
    <div>
      <ProcurementModuleHeader title="Bid Evaluation Center" description="Technical and commercial scoring" />
      <ProcurementTabs tabs={['Technical Score', 'Commercial Score', 'Vendor Ranking', 'AI Recommendation']} activeTab={activeTab} onChange={setActiveTab} />
      <ProcurementSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function ReverseAuctionModule() {
  const [activeTab, setActiveTab] = useState("Live Auctions");
  return (
    <div>
      <ProcurementModuleHeader title="Reverse Auction System" description="Live vendor competition" />
      <ProcurementTabs tabs={['Live Auctions', 'Vendor Competition', 'Price Optimization', 'Bid History']} activeTab={activeTab} onChange={setActiveTab} />
      <ProcurementSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function ContractManagementModule() {
  const [activeTab, setActiveTab] = useState("Procurement Contracts");
  return (
    <div>
      <ProcurementModuleHeader title="Contract Management" description="Procurement agreements" />
      <ProcurementTabs tabs={['Procurement Contracts', 'Framework Agreements', 'Contract Renewals', 'Contract KPIs']} activeTab={activeTab} onChange={setActiveTab} />
      <ProcurementSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function MaterialCatalogModule() {
  const [activeTab, setActiveTab] = useState("Company Catalog");
  return (
    <div>
      <ProcurementModuleHeader title="Material Catalog" description="Approved products" />
      <ProcurementTabs tabs={['Company Catalog', 'Approved Products', 'Technical Specifications', 'Price History']} activeTab={activeTab} onChange={setActiveTab} />
      <ProcurementSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function AvlModule() {
  const [activeTab, setActiveTab] = useState("Preferred Vendors");
  return (
    <div>
      <ProcurementModuleHeader title="Approved Vendor List (AVL)" description="Preferred and blacklisted vendors" />
      <ProcurementTabs tabs={['Preferred Vendors', 'Blacklisted Vendors', 'New Vendors', 'Certified Vendors']} activeTab={activeTab} onChange={setActiveTab} />
      <ProcurementSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function InventoryModule() {
  const [activeTab, setActiveTab] = useState("Live Stock");
  return (
    <div>
      <ProcurementModuleHeader title="Inventory Integration" description="Live stock tracking" />
      <ProcurementTabs tabs={['Live Stock', 'Reserved Stock', 'Available Stock', 'Material Movement']} activeTab={activeTab} onChange={setActiveTab} />
      <ProcurementSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function WarehouseModule() {
  const [activeTab, setActiveTab] = useState("Multiple Warehouses");
  return (
    <div>
      <ProcurementModuleHeader title="Warehouse Management" description="Bins and audits" />
      <ProcurementTabs tabs={['Multiple Warehouses', 'Bin Locations', 'Inventory Audits', 'Barcode Tracking']} activeTab={activeTab} onChange={setActiveTab} />
      <ProcurementSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function LogisticsModule() {
  const [activeTab, setActiveTab] = useState("Route Optimization");
  return (
    <div>
      <ProcurementModuleHeader title="Logistics Management" description="Freight and customs" />
      <ProcurementTabs tabs={['Transportation', 'Freight', 'Customs', 'Route Optimization']} activeTab={activeTab} onChange={setActiveTab} />
      <ProcurementSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function ShipmentTrackingModule() {
  const [activeTab, setActiveTab] = useState("GPS Tracking");
  return (
    <div>
      <ProcurementModuleHeader title="Shipment Tracking" description="GPS and ETAs" />
      <ProcurementTabs tabs={['GPS Tracking', 'ETA Prediction', 'Delivery Status', 'Delays']} activeTab={activeTab} onChange={setActiveTab} />
      <ProcurementSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function DeliverySchedulingModule() {
  const [activeTab, setActiveTab] = useState("Delivery Calendar");
  return (
    <div>
      <ProcurementModuleHeader title="Delivery Scheduling" description="Site and warehouse delivery" />
      <ProcurementTabs tabs={['Delivery Calendar', 'Site Delivery', 'Warehouse Delivery', 'Loading Schedule']} activeTab={activeTab} onChange={setActiveTab} />
      <ProcurementSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function GrnModule() {
  const [activeTab, setActiveTab] = useState("Material Receipt");
  return (
    <div>
      <ProcurementModuleHeader title="Goods Receipt Note (GRN)" description="Material receipt and acceptance" />
      <ProcurementTabs tabs={['Material Receipt', 'Inspection', 'Acceptance', 'Quantity Validation']} activeTab={activeTab} onChange={setActiveTab} />
      <ProcurementSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function MaterialInspectionModule() {
  const [activeTab, setActiveTab] = useState("Quality Inspection");
  return (
    <div>
      <ProcurementModuleHeader title="Material Inspection" description="Quality checks" />
      <ProcurementTabs tabs={['Quality Inspection', 'Visual Inspection', 'Lab Reports', 'AI Image Inspection']} activeTab={activeTab} onChange={setActiveTab} />
      <ProcurementSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function QualityVerificationModule() {
  const [activeTab, setActiveTab] = useState("Material Certificates");
  return (
    <div>
      <ProcurementModuleHeader title="Quality Verification" description="Compliance and certificates" />
      <ProcurementTabs tabs={['ISO Compliance', 'Material Certificates', 'Test Reports', 'Inspection Approval']} activeTab={activeTab} onChange={setActiveTab} />
      <ProcurementSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function MaterialReturnModule() {
  const [activeTab, setActiveTab] = useState("Return Requests");
  return (
    <div>
      <ProcurementModuleHeader title="Material Return Management" description="Damages and credits" />
      <ProcurementTabs tabs={['Damaged Materials', 'Wrong Deliveries', 'Return Requests', 'Credit Notes']} activeTab={activeTab} onChange={setActiveTab} />
      <ProcurementSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function ProcurementCostModule() {
  const [activeTab, setActiveTab] = useState("Total Procurement Cost");
  return (
    <div>
      <ProcurementModuleHeader title="Procurement Cost Center" description="Taxes and freight" />
      <ProcurementTabs tabs={['Purchase Cost', 'Freight Cost', 'Tax Analysis', 'Total Procurement Cost']} activeTab={activeTab} onChange={setActiveTab} />
      <ProcurementSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function BudgetVerificationModule() {
  const [activeTab, setActiveTab] = useState("Budget Availability");
  return (
    <div>
      <ProcurementModuleHeader title="Budget Verification" description="Cost approval" />
      <ProcurementTabs tabs={['Budget Availability', 'Cost Approval', 'Budget Consumption']} activeTab={activeTab} onChange={setActiveTab} />
      <ProcurementSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function InvoiceVerificationModule() {
  const [activeTab, setActiveTab] = useState("Invoice Validation");
  return (
    <div>
      <ProcurementModuleHeader title="Invoice Verification" description="OCR and validation" />
      <ProcurementTabs tabs={['Invoice OCR', 'Invoice Validation', 'Duplicate Detection', 'Payment Status']} activeTab={activeTab} onChange={setActiveTab} />
      <ProcurementSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function ThreeWayMatchingModule() {
  const [activeTab, setActiveTab] = useState("AI Verification");
  return (
    <div>
      <ProcurementModuleHeader title="Three-Way Matching" description="PO, GRN, and Invoice" />
      <ProcurementTabs tabs={['Purchase Order', 'Goods Receipt Note', 'Supplier Invoice', 'AI Verification']} activeTab={activeTab} onChange={setActiveTab} />
      <ProcurementSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function PaymentApprovalModule() {
  const [activeTab, setActiveTab] = useState("Vendor Payments");
  return (
    <div>
      <ProcurementModuleHeader title="Payment Approval" description="Vendor payments" />
      <ProcurementTabs tabs={['Finance Approval', 'Vendor Payments', 'Payment Schedule']} activeTab={activeTab} onChange={setActiveTab} />
      <ProcurementSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function ErpModule() {
  const [activeTab, setActiveTab] = useState("SAP");
  return (
    <div>
      <ProcurementModuleHeader title="ERP Integration" description="Finance connections" />
      <ProcurementTabs tabs={['SAP', 'Oracle ERP', 'Microsoft Dynamics', 'Odoo']} activeTab={activeTab} onChange={setActiveTab} />
      <ProcurementSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function BimMaterialModule() {
  const [activeTab, setActiveTab] = useState("Live BOQ");
  return (
    <div>
      <ProcurementModuleHeader title="BIM Material Integration" description="Live quantities" />
      <ProcurementTabs tabs={['Material Mapping', 'Live BOQ', 'Material Quantities', 'Design Changes']} activeTab={activeTab} onChange={setActiveTab} />
      <ProcurementSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function TwinMaterialModule() {
  const [activeTab, setActiveTab] = useState("Asset Tracking");
  return (
    <div>
      <ProcurementModuleHeader title="Digital Twin Material Tracking" description="Asset lifecycle" />
      <ProcurementTabs tabs={['Live Material Usage', 'Warehouse Status', 'Material Lifecycle', 'Asset Tracking']} activeTab={activeTab} onChange={setActiveTab} />
      <ProcurementSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function EsgProcurementModule() {
  const [activeTab, setActiveTab] = useState("ESG Dashboard");
  return (
    <div>
      <ProcurementModuleHeader title="ESG & Sustainable Procurement" description="Green supply chain" />
      <ProcurementTabs tabs={['Green Materials', 'Sustainable Suppliers', 'Carbon Ratings', 'ESG Dashboard']} activeTab={activeTab} onChange={setActiveTab} />
      <ProcurementSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function CarbonFootprintModule() {
  const [activeTab, setActiveTab] = useState("Material Carbon");
  return (
    <div>
      <ProcurementModuleHeader title="Carbon Footprint Tracking" description="Emissions" />
      <ProcurementTabs tabs={['Material Carbon', 'Supplier Carbon', 'Logistics Carbon', 'Procurement Carbon']} activeTab={activeTab} onChange={setActiveTab} />
      <ProcurementSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function RiskManagementModule() {
  const [activeTab, setActiveTab] = useState("Delivery Risk");
  return (
    <div>
      <ProcurementModuleHeader title="Procurement Risk Management" description="Supply chain risks" />
      <ProcurementTabs tabs={['Vendor Risk', 'Delivery Risk', 'Financial Risk', 'Supply Chain Risk']} activeTab={activeTab} onChange={setActiveTab} />
      <ProcurementSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function FraudDetectionModule() {
  const [activeTab, setActiveTab] = useState("AI Fraud Alerts");
  return (
    <div>
      <ProcurementModuleHeader title="Fraud Detection Center" description="Anomalies and duplicates" />
      <ProcurementTabs tabs={['Duplicate Invoices', 'Fake Vendors', 'PO Fraud', 'AI Fraud Alerts']} activeTab={activeTab} onChange={setActiveTab} />
      <ProcurementSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function SupplyChainAnalyticsModule() {
  const [activeTab, setActiveTab] = useState("Lead Time Analysis");
  return (
    <div>
      <ProcurementModuleHeader title="Supply Chain Analytics" description="Trends and KPIs" />
      <ProcurementTabs tabs={['Supplier Analytics', 'Procurement KPIs', 'Lead Time Analysis', 'Price Trends']} activeTab={activeTab} onChange={setActiveTab} />
      <ProcurementSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function ReportsModule() { return <GoogleDocsReportGenerator portalRole="Procurement & Logistics Lead" defaultProject="Skyline Towers - Phase 1" />; }

export function AiMlCenterModule() {
  const [t, setT] = useState('AI Procurement Copilot');
  return (
    <div>
      <ProcurementModuleHeader title="AI & ML Center" description="Supply Chain Intelligence" />
      <ProcurementTabs tabs={['AI Procurement Copilot', 'Procurement AI', 'Supplier AI', 'Inventory AI', 'Logistics AI', 'Financial AI']} activeTab={t} onChange={setT} />
      {t === 'AI Procurement Copilot' ? <ProcurementCopilotInterface /> : <ProcurementSubModulePlaceholder title={t} />}
    </div>
  );
}
