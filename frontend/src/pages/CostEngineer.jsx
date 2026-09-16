import React, { useState } from 'react';
import {
  Activity,
  AlertCircle,
  BarChart4,
  Bot,
  Building2,
  Calculator,
  CheckCircle2,
  DollarSign,
  FileText,
  Layers,
  Receipt,
  Scale,
  Settings,
  ShieldCheck,
  TrendingDown,
  TrendingUp,
  Wallet
} from 'lucide-react';
import CyberPortalLayout from '../components/CyberPortalLayout';
import {
  EnterpriseCostModule, BudgetPlanningModule, CostEstimationModule, ConceptCostModule,
  DetailedCostModule, CbsModule, WbsModule, ResourceCostModule, MaterialCostModule,
  LabourCostModule, EquipmentCostModule, SubcontractCostModule, ProcurementCostModule,
  VendorCostModule, ContractCostModule, ChangeOrderCostModule, VariationCostModule,
  EvmModule, CpiModule, SpiModule, CostForecastModule, CashFlowModule, BudgetActualModule,
  CostTrendModule, CostBenchmarkingModule, CostRiskModule, ValueEngineeringModule,
  ProfitabilityModule, FinancialKpiModule, CostOptimizationModule, CarbonCostModule,
  LccaModule, BimCostModule, TwinCostModule, ErpModule, ReportsModule, AiMlCenterModule
} from '../components/CostModules';

export default function CostEngineer() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const navGroups = [
    {
      title: 'COST MANAGEMENT & ESTIMATION',
      color: 'pink',
      items: [
        { id: 'enterprise', label: 'Enterprise Cost Control (EAC)', icon: Wallet },
        { id: 'budget', label: 'Budget Baseline & WBS/CBS', icon: Calculator },
        { id: 'estimation', label: 'Parametric & Detailed Costing', icon: Scale },
        { id: 'evm', label: 'Earned Value Analysis (EVM)', icon: Activity },
        { id: 'forecast', label: 'Estimate at Completion (EAC/ETC)', icon: TrendingUp },
        { id: 'cashflow', label: 'Cash Flow & Working Capital', icon: DollarSign },
        { id: 'valueeng', label: 'Value Engineering & Optimization', icon: CheckCircle2 },
        { id: 'reports', label: 'Cost Variance & Risk Reports', icon: FileText },
        { id: 'settings', label: 'Settings', icon: Settings },
      ]
    },
    {
      title: 'FINANCIAL INTELLIGENCE',
      color: 'cyan',
      items: [
        { id: 'ai', label: 'AI Cost Predictive Copilot', icon: Bot, badge: 'NEW' },
        { id: 'benchmarks', label: 'Historical Cost Benchmarking', icon: BarChart4 },
        { id: 'carboncost', label: 'Embodied Carbon & Life Cycle (LCCA)', icon: Layers },
        { id: 'erp', label: 'ERP & SAP/Oracle Sync', icon: Receipt },
      ]
    }
  ];

  const kpiCards = [
    { title: 'Baseline Budget (BAC)', value: '₹ 112.50 Cr', trend: 'Original Contract Budget', icon: Calculator, color: 'pink' },
    { title: 'Actual Cost (ACWP)', value: '₹ 55.25 Cr', trend: 'Spent to Date (49.1%)', icon: DollarSign, color: 'cyan' },
    { title: 'Estimate at Completion (EAC)', value: '₹ 110.80 Cr', trend: '₹ 1.70 Cr Projected Savings', icon: TrendingUp, color: 'purple' },
    { title: 'Cost Performance Index', value: 'CPI 1.04', trend: 'Positive Margin Delta', icon: ShieldCheck, color: 'magenta' },
  ];

  const telemetryCards = [
    { title: 'Earned Value (BCWP)', value: '₹ 57.46 Cr', subDenom: '51.1%', trend: 'Ahead of Actual Cost', icon: Activity, color: 'cyan' },
    { title: 'Cost Variance (CV)', value: '+ ₹ 2.21 Cr', trend: 'Favorable Variance', icon: TrendingUp, color: 'purple' },
    { title: 'To-Complete Index (TCPI)', value: '0.96', trend: 'Low Budget Stress', icon: Scale, color: 'magenta' },
    { title: 'Value Engg Savings', value: '₹ 3.85 Cr', trend: '12 Approved VEs', icon: CheckCircle2, color: 'teal' },
    { title: 'Contingency Draw', value: '₹ 1.20 Cr of ₹ 6 Cr', trend: '80% Buffer Intact', icon: Wallet, color: 'cyan' },
    { title: 'Material Cost Delta', value: '-2.4% vs WPI', trend: 'Steel Hedge Active', icon: Receipt, color: 'teal' },
    { title: 'Commitment Total', value: '₹ 84.50 Cr', subDenom: '75.1%', trend: 'Subcontracts Bound', icon: Building2, color: 'magenta' },
    { title: 'AI Monte Carlo Sim', value: '94.2% Conf', trend: 'On-Budget Completion', icon: Bot, color: 'magenta' },
  ];

  const platformOverview = {
    title: 'Cost Breakdown Structure (CBS)',
    subtitle: 'Enterprise expenditure by functional division',
    totalCount: '₹ 110.8',
    totalLabel: 'EAC CR',
    items: [
      { name: 'Direct Material Procurement', count: '₹ 46.5 Cr', percent: '42.0%', color: 'green' },
      { name: 'Subcontractor Trade Packages', count: '₹ 32.4 Cr', percent: '29.2%', color: 'yellow' },
      { name: 'Plant & Heavy Equipment Ops', count: '₹ 14.8 Cr', percent: '13.4%', color: 'purple' },
      { name: 'Site Management & Prelims', count: '₹ 11.2 Cr', percent: '10.1%', color: 'cyan' },
      { name: 'Contingency & Escalation Buffer', count: '₹ 5.9 Cr', percent: '5.3%', color: 'pink' },
    ]
  };

  const statusList = {
    title: 'Work Package Cost Variance Alerts',
    viewAllTab: 'evm',
    items: [
      { name: 'Substructure Raft & Shoring', status: 'CPI 1.08 (₹ 42L Saved)', badgeClass: 'active' },
      { name: 'Superstructure RCC Frames', status: 'CPI 1.02 (On Budget)', badgeClass: 'active' },
      { name: 'HVAC Chilled Water System', status: 'CPI 0.98 (₹ 12L Alert)', badgeClass: 'testing' },
      { name: 'Facade Unitized Curtain Wall', status: 'CPI 1.05 (₹ 28L Saved)', badgeClass: 'deploying' },
      { name: 'HT/LT Electrical Distribution', status: 'CPI 1.00 (Nominal)', badgeClass: 'training' },
    ]
  };

  const recentActivities = {
    title: 'Cost Engineering Activity Stream',
    viewAllTab: 'enterprise',
    items: [
      { icon: TrendingUp, text: "AI predictive forecast updated: EAC lowered by ₹ 45 Lakhs", time: '10:15 AM', color: 'purple' },
      { icon: CheckCircle2, text: 'Value Engineering VE-04 approved: optimized precast lintels', time: '09:42 AM', color: 'cyan' },
      { icon: Bot, text: 'AI cost bot detected 3.8% rebar rate inflation risk in Q3 market', time: '09:30 AM', color: 'green' },
      { icon: Calculator, text: 'Earned Value S-Curve data synchronized with SAP ERP Ledger', time: '08:55 AM', color: 'blue' },
      { icon: DollarSign, text: 'Working capital cash flow projection approved for Q3 execution', time: '08:30 AM', color: 'red' },
    ]
  };

  const scoreGauge = {
    title: 'Financial Health & Profitability',
    score: '97',
    scoreMax: '/100',
    scoreLabel: 'COST HEALTH',
    statusText: 'Profitable',
    viewAllTab: 'forecast',
    breakdown: [
      { name: 'Packages Under Budget', num: '16 Packages', color: 'green' },
      { name: 'Packages At Baseline', num: '4 Packages', color: 'yellow' },
      { name: 'Minor Variance (< 2%)', num: '1 Package', color: 'purple' },
      { name: 'Critical Overrun (> 5%)', num: '0 Packages', color: 'red' },
    ],
    footerText: 'EVM Standard: AACE International / ANSI-748',
    safeText: '🛡 Projected Profit Margin: 12.8%'
  };

  return (
    <CyberPortalLayout
      portalName="Cost Engineer"
      portalSubtitle="ENTERPRISE COST ENGINEERING & FINANCIAL INTELLIGENCE PORTAL"
      userName="Marcus Vance"
      userRole="Senior Principal Cost Engineer"
      userAvatar="https://i.pravatar.cc/150?img=57"
      navGroups={navGroups}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      copilotTitle="AI Cost Predictive Copilot"
      copilotDesc="Ask me anything about EVM, EAC forecasting, cash flows & value engineering"
      copilotTabId="ai"
      kpiCards={kpiCards}
      telemetryCards={telemetryCards}
      platformOverview={platformOverview}
      statusList={statusList}
      recentActivities={recentActivities}
      scoreGauge={scoreGauge}
    >
      {activeTab === 'enterprise' && <EnterpriseCostModule />}
      {activeTab === 'budget' && <BudgetPlanningModule />}
      {activeTab === 'estimation' && <CostEstimationModule />}
      {activeTab === 'evm' && <EvmModule />}
      {activeTab === 'forecast' && <CostForecastModule />}
      {activeTab === 'cashflow' && <CashFlowModule />}
      {activeTab === 'valueeng' && <ValueEngineeringModule />}
      {activeTab === 'reports' && <ReportsModule />}
      {activeTab === 'settings' && <ErpModule />}
      {activeTab === 'ai' && <AiMlCenterModule />}
      {activeTab === 'benchmarks' && <CostBenchmarkingModule />}
      {activeTab === 'carboncost' && <CarbonCostModule />}
      {activeTab === 'erp' && <ErpModule />}
    </CyberPortalLayout>
  );
}
