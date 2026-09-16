import React, { useState } from 'react';
import {
  Activity,
  AlertCircle,
  Bot,
  Building2,
  CheckCircle2,
  DollarSign,
  Factory,
  FileSignature,
  FileText,
  Gavel,
  Package,
  Receipt,
  Settings,
  ShieldCheck,
  ShoppingCart,
  TrendingUp,
  Truck,
  Wallet
} from 'lucide-react';
import CyberPortalLayout from '../components/CyberPortalLayout';
import {
  VendorProfileModule, VendorKycModule, VendorCatalogModule,
  VendorRfqModule, VendorQuotationsModule, VendorContractsModule,
  VendorPoModule, VendorDeliveryModule, VendorInvoiceModule,
  VendorInventoryModule, VendorLogisticsModule, VendorReturnsModule,
  VendorPerformanceModule, VendorEsgModule, VendorSupportModule,
  VendorReportsModule, VendorAiCenterModule
} from '../components/VendorModules';

export default function VendorDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const navGroups = [
    {
      title: 'ORDERS & DISPATCH',
      color: 'pink',
      items: [
        { id: 'pos', label: 'Received Purchase Orders (POs)', icon: Package },
        { id: 'rfqs', label: 'RFQs & Live E-Bidding', icon: Gavel },
        { id: 'catalog', label: 'Product Catalog & Pricing', icon: ShoppingCart },
        { id: 'delivery', label: 'Dispatch & Advanced Shipping (ASN)', icon: Truck },
        { id: 'invoices', label: 'Tax Invoices & Payment Status', icon: Receipt },
        { id: 'contracts', label: 'Annual Rate Contracts (ARC)', icon: FileSignature },
        { id: 'reports', label: 'Vendor Performance Analytics', icon: FileText },
        { id: 'settings', label: 'Settings', icon: Settings },
      ]
    },
    {
      title: 'SRM & AI PORTAL',
      color: 'cyan',
      items: [
        { id: 'ai', label: 'AI Vendor Copilot', icon: Bot, badge: 'NEW' },
        { id: 'performance', label: 'Vendor Scorecard & SLA Metrics', icon: Activity },
        { id: 'kyc', label: 'KYC & GST/ISO Certifications', icon: ShieldCheck },
        { id: 'support', label: 'Helpdesk & Dispute Resolution', icon: AlertCircle },
      ]
    }
  ];

  const kpiCards = [
    { title: 'Total Purchase Orders', value: '128 POs', trend: '↑ 14.2% vs last month', icon: Package, color: 'pink' },
    { title: 'Order Book Revenue', value: '₹ 4.82 Cr', trend: '88.5% Fulfilled', icon: DollarSign, color: 'cyan' },
    { title: 'On-Time Dispatch Rate', value: '98.4%', trend: 'Avg Lead Time 3.8 Days', icon: Truck, color: 'purple' },
    { title: 'Vendor Tier Rating', value: 'Tier-1 Gold', trend: 'ISO 9001:2015 Audited', icon: ShieldCheck, color: 'magenta' },
  ];

  const telemetryCards = [
    { title: 'Active In-Transit ASN', value: '12 Dispatches', trend: 'Live GPS Tracking', icon: Truck, color: 'cyan' },
    { title: 'Pending Quotations', value: '4 RFQs', trend: 'Closes in 24 hrs', icon: Gavel, color: 'purple' },
    { title: 'Cleared Payments', value: '₹ 3.42 Cr', subDenom: '70.9%', trend: 'Direct Bank Transfer', icon: Receipt, color: 'magenta' },
    { title: 'Pending GST Verification', value: '₹ 48 Lakhs', trend: '2 Invoices', icon: Wallet, color: 'teal' },
    { title: 'Quality Pass Rate', value: '99.8%', trend: 'MTC Certified', icon: CheckCircle2, color: 'cyan' },
    { title: 'Catalog Items Listed', value: '340 SKUs', trend: 'CPWD Spec Grade', icon: ShoppingCart, color: 'teal' },
    { title: 'Customer Ratings', value: '4.9 / 5.0', trend: '120 Reviews', icon: Activity, color: 'magenta' },
    { title: 'AI Demand Forecast', value: '+18% Q3', trend: 'Automated Stock Alert', icon: Bot, color: 'magenta' },
  ];

  const platformOverview = {
    title: 'Order Status & Dispatch Matrix',
    subtitle: 'Active purchase orders fulfillment stages',
    totalCount: '128',
    totalLabel: 'ORDERS',
    items: [
      { name: 'Confirmed & In Manufacturing', count: '42 Orders', percent: '32.8%', color: 'green' },
      { name: 'Quality Inspected & Packed', count: '42 Orders', percent: '32.8%', color: 'yellow' },
      { name: 'Dispatched / In-Transit (ASN)', count: '18 Orders', percent: '14.1%', color: 'purple' },
      { name: 'Delivered & GRN Verified', count: '16 Orders', percent: '12.5%', color: 'cyan' },
      { name: 'New POs Awaiting Confirmation', count: '10 Orders', percent: '7.8%', color: 'pink' },
    ]
  };

  const statusList = {
    title: 'Live RFQs & Bidding Invitations',
    viewAllTab: 'rfqs',
    items: [
      { name: 'RFQ-2024-912: 500 MT Fe500D TMT Steel', status: 'Bid Submitted (₹ 54,200/MT)', badgeClass: 'active' },
      { name: 'RFQ-2024-914: 2,000 m² Vitrified Tiles 1200x600', status: 'Evaluating Bids', badgeClass: 'training' },
      { name: 'RFQ-2024-918: 10,000 Bags OPC 53 Grade Cement', status: 'Shortlisted L1', badgeClass: 'deploying' },
      { name: 'RFQ-2024-922: 400mm DI K9 Water Supply Pipes', status: 'Auction in 2h', badgeClass: 'testing' },
      { name: 'PO-2024-884: Tata Tiscon Rebar Batch MTC', status: 'GRN Approved', badgeClass: 'active' },
    ]
  };

  const recentActivities = {
    title: 'Vendor Dispatch & Invoicing Feed',
    viewAllTab: 'pos',
    items: [
      { icon: Truck, text: "ASN #8842 dispatched: 42 MT TMT Steel on Truck MH-12-RN-4482 with e-Way Bill", time: '10:15 AM', color: 'purple' },
      { icon: Receipt, text: 'Tax Invoice INV-2024-118 (₹ 42.8 Lakhs) approved for 30-day payment cycle', time: '09:42 AM', color: 'cyan' },
      { icon: Bot, text: 'AI Vendor Copilot suggested 2.5% volume discount for Q3 cement bulk tender', time: '09:30 AM', color: 'green' },
      { icon: CheckCircle2, text: 'Factory Mill Test Certificate (MTC) uploaded and validated for Batch #89', time: '08:55 AM', color: 'blue' },
      { icon: Gavel, text: 'Reverse auction completed: Secured L1 bidder status on Tile Package', time: '08:30 AM', color: 'red' },
    ]
  };

  const scoreGauge = {
    title: 'Supplier Performance & On-Time Score',
    score: '98',
    scoreMax: '/100',
    scoreLabel: 'SUPPLIER SCORE',
    statusText: 'Elite Partner',
    viewAllTab: 'performance',
    breakdown: [
      { name: 'On-Time Delivery (OTIF)', num: '98.4%', color: 'green' },
      { name: 'Quality Acceptance Rate', num: '99.8%', color: 'yellow' },
      { name: 'Invoice Accuracy Rate', num: '100%', color: 'purple' },
      { name: 'Customer Complaints', num: '0', color: 'red' },
    ],
    footerText: 'Vendor Accreditation: BuildSphere Verified Tier-1 Partner',
    safeText: '🛡 100% SLA Fulfillment'
  };

  return (
    <CyberPortalLayout
      portalName="Vendor Partner"
      portalSubtitle="MATERIAL SUPPLIER & VENDOR PORTAL"
      userName="Deepak Chawla"
      userRole="Authorized Supplier Representative"
      userAvatar="https://i.pravatar.cc/150?img=69"
      navGroups={navGroups}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      copilotTitle="AI Vendor Copilot"
      copilotDesc="Ask me anything about PO status, ASN tracking, e-Way bills & RFQ bidding"
      copilotTabId="ai"
      kpiCards={kpiCards}
      telemetryCards={telemetryCards}
      platformOverview={platformOverview}
      statusList={statusList}
      recentActivities={recentActivities}
      scoreGauge={scoreGauge}
    >
      {activeTab === 'pos' && <VendorPoModule />}
      {activeTab === 'rfqs' && <VendorRfqModule />}
      {activeTab === 'catalog' && <VendorCatalogModule />}
      {activeTab === 'delivery' && <VendorDeliveryModule />}
      {activeTab === 'invoices' && <VendorInvoiceModule />}
      {activeTab === 'contracts' && <VendorContractsModule />}
      {activeTab === 'reports' && <VendorReportsModule />}
      {activeTab === 'settings' && <VendorProfileModule />}
      {activeTab === 'ai' && <VendorAiCenterModule />}
      {activeTab === 'performance' && <VendorPerformanceModule />}
      {activeTab === 'kyc' && <VendorKycModule />}
      {activeTab === 'support' && <VendorSupportModule />}
    </CyberPortalLayout>
  );
}
