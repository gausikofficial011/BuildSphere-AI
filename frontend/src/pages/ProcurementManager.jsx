import React, { useState } from 'react';
import {
  Activity,
  AlertCircle,
  Bot,
  Building2,
  CheckCircle2,
  DollarSign,
  Factory,
  FileCheck2,
  FileSignature,
  FileText,
  Gavel,
  Package,
  Receipt,
  Scale,
  Settings,
  ShieldCheck,
  ShoppingCart,
  TrendingUp,
  Truck,
  Users,
  Wallet
} from 'lucide-react';
import CyberPortalLayout from '../components/CyberPortalLayout';
import {
  ProcurementCommandModule, ProcurementPlanningModule, MrpModule, ProcurementScheduleModule,
  PrModule, PoModule, RfqModule, RfpModule, RfiModule, VendorManagementModule,
  VendorRegistrationModule, VendorQualificationModule, VendorPerformanceModule, SrmModule,
  StrategicSourcingModule, TenderManagementModule, BidEvaluationModule, ReverseAuctionModule,
  ContractManagementModule, MaterialCatalogModule, AvlModule, InventoryModule, WarehouseModule,
  LogisticsModule, ShipmentTrackingModule, DeliverySchedulingModule, GrnModule,
  MaterialInspectionModule, QualityVerificationModule, MaterialReturnModule, ProcurementCostModule,
  BudgetVerificationModule, InvoiceVerificationModule, ThreeWayMatchingModule, PaymentApprovalModule,
  ErpModule, BimMaterialModule, TwinMaterialModule, EsgProcurementModule, CarbonFootprintModule,
  RiskManagementModule, FraudDetectionModule, SupplyChainAnalyticsModule, ReportsModule,
  AiMlCenterModule
} from '../components/ProcurementModules';

export default function ProcurementManager() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const navGroups = [
    {
      title: 'SOURCING & PURCHASING',
      color: 'pink',
      items: [
        { id: 'command', label: 'Procurement Command Center', icon: ShoppingCart },
        { id: 'pos', label: 'Purchase Orders (PO) & Requisitions', icon: Package },
        { id: 'rfq', label: 'RFQ & Bid Evaluation Matrix', icon: Gavel },
        { id: 'vendors', label: 'Vendor Directory & SRM Ratings', icon: Factory },
        { id: 'contracts', label: 'Vendor Contracts & SLA Terms', icon: FileSignature },
        { id: 'inventory', label: 'Warehouse & Site Inventory (GRN)', icon: Building2 },
        { id: 'logistics', label: 'Logistics & Live Fleet Tracking', icon: Truck },
        { id: 'matching', label: '3-Way Invoice Matching & Audit', icon: Receipt },
        { id: 'reports', label: 'Supply Chain Reports & Analytics', icon: FileText },
        { id: 'settings', label: 'Settings', icon: Settings },
      ]
    },
    {
      title: 'STRATEGIC AI SOURCING',
      color: 'cyan',
      items: [
        { id: 'ai', label: 'AI Supply Chain Copilot', icon: Bot, badge: 'NEW' },
        { id: 'esg', label: 'Green & ESG Certified Sourcing', icon: ShieldCheck },
        { id: 'risk', label: 'Supplier Lead-Time Risk Predictor', icon: AlertCircle },
        { id: 'erp', label: 'SAP / Oracle SCM Integration', icon: Wallet },
      ]
    }
  ];

  const kpiCards = [
    { title: 'Total Purchase Orders', value: '1,245 POs', trend: '↑ 16.8% vs last month', icon: Package, color: 'pink' },
    { title: 'Total Spend Managed', value: '₹ 64.80 Cr', trend: 'Spent / Committed to Date', icon: DollarSign, color: 'cyan' },
    { title: 'Procurement Cost Savings', value: '₹ 4.25 Cr', trend: '6.5% Negotiated Discount', icon: TrendingUp, color: 'purple' },
    { title: 'On-Time Vendor Delivery', value: '96.8%', trend: 'Avg Lead Time 4.2 Days', icon: Truck, color: 'magenta' },
  ];

  const telemetryCards = [
    { title: 'Open Purchase Requisitions', value: '28 PRs', trend: 'Avg Approval 2.4 hrs', icon: ShoppingCart, color: 'cyan' },
    { title: 'Active Vendors (AVL)', value: '184 Verified', trend: 'ISO 9001 Audited', icon: Factory, color: 'purple' },
    { title: 'Goods Received (GRN)', value: '₹ 3.85 Cr', subDenom: 'This Month', trend: '100% Inspected', icon: Building2, color: 'magenta' },
    { title: '3-Way Matched Invoices', value: '98.4%', trend: 'Zero Discrepancy', icon: Receipt, color: 'teal' },
    { title: 'Live In-Transit Shipments', value: '18 Trucks', trend: 'GPS Telematics Active', icon: Truck, color: 'cyan' },
    { title: 'Safety Stock Buffer', value: '21 Days', trend: 'Cement & TMT Secure', icon: Package, color: 'teal' },
    { title: 'Reverse Auctions Done', value: '8 Live', trend: 'Avg 9.2% Price Drop', icon: Gavel, color: 'magenta' },
    { title: 'AI Sourcing Accuracy', value: '99.8%', trend: 'Auto-PO Generation', icon: Bot, color: 'magenta' },
  ];

  const platformOverview = {
    title: 'Category-Wise Procurement Spend',
    subtitle: 'Strategic material & equipment spend breakdown',
    totalCount: '₹ 64.8',
    totalLabel: 'SPEND CR',
    items: [
      { name: 'Structural Steel & TMT Rebar', count: '₹ 24.6 Cr', percent: '38.0%', color: 'green' },
      { name: 'Ready-Mix Concrete (RMC) & Cement', count: '₹ 16.4 Cr', percent: '25.3%', color: 'yellow' },
      { name: 'HVAC Chillers & Electrical Panels', count: '₹ 12.8 Cr', percent: '19.8%', color: 'purple' },
      { name: 'Facade DGU Glass & Aluminum', count: '₹ 6.8 Cr', percent: '10.5%', color: 'cyan' },
      { name: 'Finishing Tiles & Site Consumables', count: '₹ 4.2 Cr', percent: '6.4%', color: 'pink' },
    ]
  };

  const statusList = {
    title: 'High-Value Strategic Orders & RFQs',
    viewAllTab: 'pos',
    items: [
      { name: 'PO-2024-884: 850 MT Fe500D TMT Rebar (Tata Tiscon)', status: 'In-Transit (ETA 2d)', badgeClass: 'active' },
      { name: 'RFQ-2024-112: 3x 600TR Water-Cooled Chillers (Daikin)', status: 'Bid Evaluation', badgeClass: 'training' },
      { name: 'PO-2024-879: 4,500m³ M40 RMC Delivery (UltraTech)', status: 'Active Dispatch', badgeClass: 'active' },
      { name: 'RFQ-2024-108: Unitized Curtain Wall Glazing (Saint-Gobain)', status: 'Reverse Auction', badgeClass: 'deploying' },
      { name: 'PO-2024-862: 11kV HT Substation Switchgear (ABB)', status: 'Factory Inspected', badgeClass: 'active' },
    ]
  };

  const recentActivities = {
    title: 'Supply Chain Operations Stream',
    viewAllTab: 'command',
    items: [
      { icon: Truck, text: "GRN-4428 generated: 42 MT TMT steel received at Central Yard with MTC", time: '10:15 AM', color: 'purple' },
      { icon: Gavel, text: 'Reverse auction completed for facade extrusions: ₹ 38 Lakhs saved', time: '09:42 AM', color: 'cyan' },
      { icon: Bot, text: 'AI detected 4-day monsoon transport bottleneck: rerouted via Highway 48', time: '09:30 AM', color: 'green' },
      { icon: Receipt, text: '3-Way matching verified invoice INV-8891 against PO-824 and GRN-4410', time: '08:55 AM', color: 'blue' },
      { icon: ShieldCheck, text: 'UltraTech RMC supplier plant audit passed ISO 14001 ESG criteria', time: '08:30 AM', color: 'red' },
    ]
  };

  const scoreGauge = {
    title: 'Supplier Performance & Reliability (SRM)',
    score: '96',
    scoreMax: '/100',
    scoreLabel: 'SRM SCORE',
    statusText: 'Tier-1 Elite',
    viewAllTab: 'vendors',
    breakdown: [
      { name: 'Tier-1 Gold Suppliers', num: '142 Vendors', color: 'green' },
      { name: 'Tier-2 Standard Suppliers', num: '38 Vendors', color: 'yellow' },
      { name: 'Audit Under Review', num: '4 Vendors', color: 'purple' },
      { name: 'Blacklisted / Disqualified', num: '0 Vendors', color: 'red' },
    ],
    footerText: 'On-Time In-Full (OTIF) Rate: 97.4%',
    safeText: '🛡 Zero Supply Chain Disruption'
  };

  return (
    <CyberPortalLayout
      portalName="Procurement Manager"
      portalSubtitle="STRATEGIC SOURCING & SUPPLY CHAIN PORTAL"
      userName="Naveen Patnaik"
      userRole="Chief Procurement Officer (CPO)"
      userAvatar="https://i.pravatar.cc/150?img=59"
      navGroups={navGroups}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      copilotTitle="AI Supply Chain Copilot"
      copilotDesc="Ask me anything about PO tracking, vendor negotiations & lead times"
      copilotTabId="ai"
      kpiCards={kpiCards}
      telemetryCards={telemetryCards}
      platformOverview={platformOverview}
      statusList={statusList}
      recentActivities={recentActivities}
      scoreGauge={scoreGauge}
    >
      {activeTab === 'command' && <ProcurementCommandModule />}
      {activeTab === 'pos' && <PoModule />}
      {activeTab === 'rfq' && <RfqModule />}
      {activeTab === 'vendors' && <VendorManagementModule />}
      {activeTab === 'contracts' && <ContractManagementModule />}
      {activeTab === 'inventory' && <InventoryModule />}
      {activeTab === 'logistics' && <LogisticsModule />}
      {activeTab === 'matching' && <ThreeWayMatchingModule />}
      {activeTab === 'reports' && <ReportsModule />}
      {activeTab === 'settings' && <ErpModule />}
      {activeTab === 'ai' && <AiMlCenterModule />}
      {activeTab === 'esg' && <EsgProcurementModule />}
      {activeTab === 'risk' && <RiskManagementModule />}
      {activeTab === 'erp' && <ErpModule />}
    </CyberPortalLayout>
  );
}
