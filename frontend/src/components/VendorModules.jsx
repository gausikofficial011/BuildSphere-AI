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

export function VendorModuleHeader({ title, description, actionText = "Action" }) {
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

export function VendorTabs({ tabs, activeTab, onChange }) {
  return (
    <div style={{ display: 'flex', gap: '2rem', borderBottom: '1px solid #1e293b', marginBottom: '1.5rem', overflowX: 'auto', paddingBottom: '1px' }}>
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

function VendorSubModulePlaceholder({ title }) {
  return <PremiumPlaceholder title={title} />;
}

export function VendorCopilotInterface() {
  const [msgs, setMsgs] = useState([
    { role: 'assistant', text: 'Welcome back to the ABC Steel Supplies dashboard. You have 9 New RFQs waiting for response. The buyer has confirmed PO #4587. How can I assist you with your sales and logistics today?' }
  ]);
  const [inp, setInp] = useState('');

  const handleSend = () => {
    if(!inp.trim()) return;
    setMsgs([...msgs, { role: 'user', text: inp }]);
    setInp('');
    setTimeout(() => {
      setMsgs(prev => [...prev, { role: 'assistant', text: 'I have logged the request. I will generate a draft quotation for the pending RFQ based on our dynamic pricing engine and current inventory levels.' }]);
    }, 1000);
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 250px)', backgroundColor: '#0a0f1e', borderRadius: '0.75rem', border: '1px solid #1e293b', overflow: 'hidden' }}>
      <div style={{ padding: '1.5rem', borderBottom: '1px solid #1e293b', backgroundColor: '#040814', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{ width: '40px', height: '40px', borderRadius: '0.5rem', backgroundColor: 'rgba(37, 99, 235, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#93c5fd' }}>
          <Bot size={24} />
        </div>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', margin: 0, color: '#ffffff' }}>AI Vendor Copilot</h2>
          <p style={{ color: '#94a3b8', margin: 0, fontSize: '0.875rem' }}>Your intelligent business assistant for sales and operations</p>
        </div>
      </div>
      
      <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid #1e293b', display: 'flex', gap: '0.5rem', overflowX: 'auto', backgroundColor: 'rgba(0, 0, 0, 0.6)' }}>
        {['Order summary', 'Payment status', 'Inventory status', 'RFQ insights', 'Delivery tracking', 'Market trends'].map(chip => (
          <button key={chip} onClick={() => setInp(chip)} style={{ padding: '0.5rem 1rem', borderRadius: '9999px', border: '1px solid #1e293b', backgroundColor: '#0a0f1e', color: '#cbd5e1', fontSize: '0.75rem', cursor: 'pointer', whiteSpace: 'nowrap' }}>
            {chip}
          </button>
        ))}
      </div>
      
      <div style={{ flex: 1, padding: '1.5rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.5rem', backgroundColor: '#0a0f1e' }}>
        {msgs.map((m, i) => (
          <div key={i} style={{ display: 'flex', gap: '1rem', alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start', maxWidth: '80%' }}>
            {m.role === 'assistant' && (
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', flexShrink: 0 }}>
                <Bot size={16} />
              </div>
            )}
            <div style={{ padding: '1rem', backgroundColor: m.role === 'user' ? '#2563eb' : '#040814', color: '#ffffff', borderRadius: '1rem', borderTopLeftRadius: m.role === 'assistant' ? 0 : '1rem', borderTopRightRadius: m.role === 'user' ? 0 : '1rem', border: m.role === 'user' ? 'none' : '1px solid #1e293b', fontSize: '0.875rem', lineHeight: '1.5' }}>
              {m.text}
            </div>
          </div>
        ))}
      </div>

      <div style={{ padding: '1.5rem', backgroundColor: '#040814', borderTop: '1px solid #1e293b' }}>
        <div style={{ display: 'flex', gap: '1rem', position: 'relative' }}>
          <input 
            type="text" 
            placeholder="Type your question or instruction..." 
            value={inp}
            onChange={e => setInp(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            style={{ flex: 1, padding: '1rem 1.5rem', backgroundColor: '#0a0f1e', border: '1px solid #1e293b', color: '#ffffff', borderRadius: '9999px', fontSize: '0.875rem', outline: 'none' }}
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

// Rapid stubs for Vendor modules
export function VendorProfileModule() {
  const [activeTab, setActiveTab] = useState("Company Information");
  return (
    <div>
      <VendorModuleHeader title="Company Profile Management" description="Details and banking" />
      <VendorTabs tabs={['Company Information', 'Branch Offices', 'Banking Information', 'Tax Information']} activeTab={activeTab} onChange={setActiveTab} />
      <VendorSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function VendorKycModule() {
  const [activeTab, setActiveTab] = useState("Business Verification");
  return (
    <div>
      <VendorModuleHeader title="KYC & Compliance" description="Verification and certificates" />
      <VendorTabs tabs={['Business Verification', 'Digital Vendor Passport', 'KYC Documents', 'Certifications Management']} activeTab={activeTab} onChange={setActiveTab} />
      <VendorSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function VendorCatalogModule() {
  const [activeTab, setActiveTab] = useState("Material Catalog");
  return (
    <div>
      <VendorModuleHeader title="Product Catalog Management" description="Materials and services" />
      <VendorTabs tabs={['Material Catalog', 'Equipment Catalog', 'Service Catalog', 'Product Pricing']} activeTab={activeTab} onChange={setActiveTab} />
      <VendorSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function VendorRfqModule() {
  const [activeTab, setActiveTab] = useState("RFQ Center");
  return (
    <div>
      <VendorModuleHeader title="RFQ & Tenders" description="Invitations and bids" />
      <VendorTabs tabs={['RFQ Center', 'Tender Invitations', 'Clarifications', 'Bid Submission']} activeTab={activeTab} onChange={setActiveTab} />
      <VendorSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function VendorQuotationsModule() {
  const [activeTab, setActiveTab] = useState("Create Quotations");
  return (
    <div>
      <VendorModuleHeader title="Quotation Management" description="Drafts and pricing" />
      <VendorTabs tabs={['Create Quotations', 'Pricing Comparison', 'Active Quotations']} activeTab={activeTab} onChange={setActiveTab} />
      <VendorSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function VendorContractsModule() {
  const [activeTab, setActiveTab] = useState("Active Contracts");
  return (
    <div>
      <VendorModuleHeader title="Contract Management" description="Agreements and renewals" />
      <VendorTabs tabs={['Active Contracts', 'Expiring Contracts', 'Service Agreements']} activeTab={activeTab} onChange={setActiveTab} />
      <VendorSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function VendorPoModule() {
  const [activeTab, setActiveTab] = useState("New Orders");
  return (
    <div>
      <VendorModuleHeader title="Purchase Orders" description="Incoming and accepted orders" />
      <VendorTabs tabs={['New Orders', 'Accepted Orders', 'Pending Orders', 'Completed Orders']} activeTab={activeTab} onChange={setActiveTab} />
      <VendorSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function VendorDeliveryModule() {
  const [activeTab, setActiveTab] = useState("Delivery Schedule");
  return (
    <div>
      <VendorModuleHeader title="Delivery Management" description="Schedules and dispatch" />
      <VendorTabs tabs={['Delivery Schedule', 'Goods Dispatch', 'Goods Receipt Status']} activeTab={activeTab} onChange={setActiveTab} />
      <VendorSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function VendorInvoiceModule() {
  const [activeTab, setActiveTab] = useState("Invoice Management");
  return (
    <div>
      <VendorModuleHeader title="Invoice & Payments" description="Billing and forecasts" />
      <VendorTabs tabs={['Invoice Management', 'Payment Dashboard', 'Credit Notes']} activeTab={activeTab} onChange={setActiveTab} />
      <VendorSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function VendorInventoryModule() {
  const [activeTab, setActiveTab] = useState("Inventory Dashboard");
  return (
    <div>
      <VendorModuleHeader title="Inventory & Warehouses" description="Stock levels and aging" />
      <VendorTabs tabs={['Inventory Dashboard', 'Warehouse Management', 'Multi-Warehouse Inventory']} activeTab={activeTab} onChange={setActiveTab} />
      <VendorSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function VendorLogisticsModule() {
  const [activeTab, setActiveTab] = useState("Logistics Management");
  return (
    <div>
      <VendorModuleHeader title="Logistics & Fleet" description="Shipments and routes" />
      <VendorTabs tabs={['Logistics Management', 'Shipment Tracking', 'Fleet Tracking']} activeTab={activeTab} onChange={setActiveTab} />
      <VendorSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function VendorReturnsModule() {
  const [activeTab, setActiveTab] = useState("Return Management");
  return (
    <div>
      <VendorModuleHeader title="Returns & Warranty" description="Claims and replacements" />
      <VendorTabs tabs={['Return Management', 'Warranty Management', 'Service Requests']} activeTab={activeTab} onChange={setActiveTab} />
      <VendorSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function VendorPerformanceModule() {
  const [activeTab, setActiveTab] = useState("Delivery Accuracy");
  return (
    <div>
      <VendorModuleHeader title="Vendor Performance Center" description="KPIs and ratings" />
      <VendorTabs tabs={['Delivery Accuracy', 'Quality Rating', 'Customer Satisfaction']} activeTab={activeTab} onChange={setActiveTab} />
      <VendorSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function VendorEsgModule() {
  const [activeTab, setActiveTab] = useState("ESG Dashboard");
  return (
    <div>
      <VendorModuleHeader title="ESG & Sustainability" description="Green products and carbon" />
      <VendorTabs tabs={['ESG Dashboard', 'Carbon Emission Dashboard', 'Green Products']} activeTab={activeTab} onChange={setActiveTab} />
      <VendorSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function VendorSupportModule() {
  const [activeTab, setActiveTab] = useState("Customer Support Center");
  return (
    <div>
      <VendorModuleHeader title="Support & Service" description="Tickets and knowledge base" />
      <VendorTabs tabs={['Customer Support Center', 'Support Tickets', 'Knowledge Base']} activeTab={activeTab} onChange={setActiveTab} />
      <VendorSubModulePlaceholder title={activeTab} />
    </div>
  );
}
export function VendorReportsModule() { return <GoogleDocsReportGenerator portalRole="Vendor & Supplier Lead" defaultProject="Skyline Towers - Phase 1" />; }

export function VendorAiCenterModule() {
  const [t, setT] = useState('AI Vendor Copilot');
  return (
    <div>
      <VendorModuleHeader title="AI & ML Center" description="Vendor Intelligence" />
      <VendorTabs tabs={['AI Vendor Copilot', 'Sales AI', 'Inventory AI', 'Logistics AI', 'Financial AI']} activeTab={t} onChange={setT} />
      {t === 'AI Vendor Copilot' ? <VendorCopilotInterface /> : <VendorSubModulePlaceholder title={t} />}
    </div>
  );
}
