import React, { useState } from 'react';
import {
  Activity,
  AlertCircle,
  Bot,
  Building2,
  Calculator,
  CheckCircle2,
  DollarSign,
  FileCheck2,
  FileSignature,
  FileText,
  Layers,
  Receipt,
  Scale,
  ScrollText,
  TrendingDown,
  TrendingUp,
  Wallet
} from 'lucide-react';
import CyberPortalLayout from '../components/CyberPortalLayout';
import {
  BoqManagementModule, QuantityTakeoffModule, AiTakeoffModule, DrawingMeasurementModule,
  BimQuantityModule, MeasurementViewerModule, MaterialEstimationModule, CostEstimationModule,
  RateAnalysisModule, SorModule, TenderManagementModule, BidComparisonModule, ProcurementModule,
  VendorQuoteModule, PurchaseRequestModule, PurchaseOrderModule, ContractModule, VariationOrderModule,
  ChangeOrderModule, IpcModule, RaBillModule, ClientBillingModule, ContractorBillingModule,
  SubcontractBillingModule, MaterialReconModule, InventoryCostModule, EarnedValueModule,
  CashFlowModule, BudgetActualModule, ProductivityModule, RiskClaimsModule, DocumentModule,
  BimIntegrationModule, TwinIntegrationModule, ErpModule, ReportsModule, AiMlCenterModule
} from '../components/QsModules';

export default function QuantitySurveyor() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const navGroups = [
    {
      title: 'QUANTITY TAKEOFF & BOQ',
      color: 'pink',
      items: [
        { id: 'boq', label: 'Master Bill of Quantities (BOQ)', icon: ScrollText },
        { id: 'takeoff', label: '2D/3D Automated QTO Takeoff', icon: Calculator },
        { id: 'bimqty', label: 'BIM 5D Quantity Extraction', icon: Layers },
        { id: 'rate', label: 'Rate Analysis & DSR/CPWD Rates', icon: Scale },
        { id: 'materials', label: 'Material & Rebar Estimation', icon: FileCheck2 },
        { id: 'tenders', label: 'Tenders & Bid Comparative Statements', icon: FileSignature },
        { id: 'billing', label: 'RA Bills & Interim Payment Certs (IPC)', icon: Receipt },
        { id: 'variations', label: 'Variations & Change Orders (VO)', icon: AlertCircle },
        { id: 'reports', label: 'QS Cost Audit Reports', icon: FileText },
      ]
    },
    {
      title: 'COMMERCIAL & AI',
      color: 'cyan',
      items: [
        { id: 'ai', label: 'AI Cost & BOQ Copilot', icon: Bot, badge: 'NEW' },
        { id: 'earned', label: 'Earned Value Mgmt (EVM: CPI/SPI)', icon: Activity },
        { id: 'cashflow', label: 'Cash Flow S-Curve Forecasting', icon: TrendingUp },
        { id: 'reconciliation', label: 'Material Reconciliation (Cement/Steel)', icon: Wallet },
      ]
    }
  ];

  const kpiCards = [
    { title: 'Approved Contract Value', value: '₹ 112.50 Cr', trend: '↑ 5.2% via Variation Orders', icon: Wallet, color: 'pink' },
    { title: 'Total Invoiced (RA Bills)', value: '₹ 54.20 Cr', trend: '48.2% Paid to Date', icon: Receipt, color: 'cyan' },
    { title: 'Cost Performance Index', value: 'CPI 1.06', trend: 'Under Budget (Favorable)', icon: TrendingUp, color: 'purple' },
    { title: 'BOQ Line Items Verified', value: '3,420 Items', trend: '100% Rate Analyzed', icon: ScrollText, color: 'magenta' },
  ];

  const telemetryCards = [
    { title: 'Certified IPC Total', value: '₹ 4.85 Cr', subDenom: 'RA Bill #08', trend: 'Certified', icon: Receipt, color: 'cyan' },
    { title: 'Approved Variations', value: '14 VOs', trend: '+ ₹ 2.45 Cr Delta', icon: AlertCircle, color: 'purple' },
    { title: 'Steel Reconciliation', value: '+1.2% Wastage', subDenom: 'Allowable 3.0%', trend: 'Saved 42 MT', icon: Scale, color: 'magenta' },
    { title: 'Cement Reconciliation', value: '-0.4% Delta', trend: 'Optimal Consumption', icon: FileCheck2, color: 'teal' },
    { title: 'Schedule Perf Index', value: 'SPI 1.02', trend: 'On Track', icon: Activity, color: 'cyan' },
    { title: 'Pending Claims', value: '2 Under Review', trend: 'Subcontractor Claims', icon: FileSignature, color: 'teal' },
    { title: 'Rate Analysis DB', value: '8,400 Items', trend: 'Q2 2024 Market Rates', icon: Calculator, color: 'magenta' },
    { title: 'AI Takeoff Accuracy', value: '99.4%', trend: 'Instant CAD Extraction', icon: Bot, color: 'magenta' },
  ];

  const platformOverview = {
    title: 'Trade-Wise Cost & BOQ Distribution',
    subtitle: 'Comprehensive elemental cost breakdown',
    totalCount: '₹ 112.5',
    totalLabel: 'CRORES',
    items: [
      { name: 'Civil & Structural Works', count: '₹ 48.2 Cr', percent: '42.8%', color: 'green' },
      { name: 'MEP & Fire Protection', count: '₹ 28.5 Cr', percent: '25.3%', color: 'yellow' },
      { name: 'Finishes & Facade Glazing', count: '₹ 18.2 Cr', percent: '16.2%', color: 'purple' },
      { name: 'External Infrastructure & Roads', count: '₹ 10.4 Cr', percent: '9.2%', color: 'cyan' },
      { name: 'Prelims, Contingency & Taxes', count: '₹ 7.2 Cr', percent: '6.5%', color: 'pink' },
    ]
  };

  const statusList = {
    title: 'Contractor RA Bills & IPC Certification',
    viewAllTab: 'billing',
    items: [
      { name: 'Apex Infra - RA Bill #12 (Civil Works)', status: 'Certified (₹ 3.42 Cr)', badgeClass: 'active' },
      { name: 'Voltas Electro - RA Bill #08 (HVAC Chiller)', status: 'Reviewing (₹ 1.85 Cr)', badgeClass: 'training' },
      { name: 'Saint Gobain - VO #04 (Facade Glazing DGU)', status: 'Approved (₹ 64 Lakhs)', badgeClass: 'deploying' },
      { name: 'Otis Elevators - Milestone Advance Claim', status: 'Passed (₹ 92 Lakhs)', badgeClass: 'active' },
      { name: 'GreenScape - Landscaping RA Bill #02', status: 'Submitted', badgeClass: 'inactive' },
    ]
  };

  const recentActivities = {
    title: 'QS Commercial & Measurement Log',
    viewAllTab: 'boq',
    items: [
      { icon: Receipt, text: "IPC #12 issued for Apex Infra: ₹ 3.42 Cr net payable certified", time: '10:15 AM', color: 'purple' },
      { icon: Calculator, text: 'AI auto-measured 1,420m² drywall partitioning from GFC Arch drawings', time: '09:42 AM', color: 'cyan' },
      { icon: Bot, text: 'AI detected duplicate concrete quantity line item in Subcontractor BOQ', time: '09:30 AM', color: 'green' },
      { icon: AlertCircle, text: 'Variation Order VO-08 price negotiation concluded with 8.5% savings', time: '08:55 AM', color: 'blue' },
      { icon: Scale, text: 'Monthly steel reconciliation approved: 0.8% rolling margin variance', time: '08:30 AM', color: 'red' },
    ]
  };

  const scoreGauge = {
    title: 'Cost Governance & Audit Integrity',
    score: '98',
    scoreMax: '/100',
    scoreLabel: 'AUDIT INTEGRITY',
    statusText: 'Watertight',
    viewAllTab: 'reports',
    breakdown: [
      { name: 'Fully Certified Measurements', num: '184 Items', color: 'green' },
      { name: 'Minor Rate Clarifications', num: '4 Items', color: 'yellow' },
      { name: 'Disputed Claims', num: '0 Items', color: 'purple' },
      { name: 'Budget Overruns', num: '0 Items', color: 'red' },
    ],
    footerText: 'Cost Standard: RICS NRM2 / IS 1200 Method of Measurement',
    safeText: '🛡 100% Commercial Compliance'
  };

  return (
    <CyberPortalLayout
      portalName="Quantity Surveyor"
      portalSubtitle="QUANTITY SURVEYING & COMMERCIAL BILLING PORTAL"
      userName="Ananya Deshmukh"
      userRole="Chief Quantity Surveyor & Contracts Mgr"
      userAvatar="https://i.pravatar.cc/150?img=45"
      navGroups={navGroups}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      copilotTitle="AI Cost & BOQ Copilot"
      copilotDesc="Ask me anything about BOQ items, IPC certification, rate analysis & IS 1200"
      copilotTabId="ai"
      kpiCards={kpiCards}
      telemetryCards={telemetryCards}
      platformOverview={platformOverview}
      statusList={statusList}
      recentActivities={recentActivities}
      scoreGauge={scoreGauge}
    >
      {activeTab === 'boq' && <BoqManagementModule />}
      {activeTab === 'takeoff' && <QuantityTakeoffModule />}
      {activeTab === 'bimqty' && <BimQuantityModule />}
      {activeTab === 'rate' && <RateAnalysisModule />}
      {activeTab === 'materials' && <MaterialEstimationModule />}
      {activeTab === 'tenders' && <TenderManagementModule />}
      {activeTab === 'billing' && <RaBillModule />}
      {activeTab === 'variations' && <VariationOrderModule />}
      {activeTab === 'reports' && <ReportsModule />}
      {activeTab === 'ai' && <AiMlCenterModule />}
      {activeTab === 'earned' && <EarnedValueModule />}
      {activeTab === 'cashflow' && <CashFlowModule />}
      {activeTab === 'reconciliation' && <MaterialReconModule />}
    </CyberPortalLayout>
  );
}
