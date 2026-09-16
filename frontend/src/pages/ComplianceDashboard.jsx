import React, { useState } from 'react';
import {
  Activity,
  AlertCircle,
  Bot,
  Building2,
  CheckCircle2,
  FileSignature,
  FileText,
  Gavel,
  Layers,
  Scale,
  Settings,
  ShieldAlert,
  ShieldCheck,
  TrendingUp,
  Users
} from 'lucide-react';
import CyberPortalLayout from '../components/CyberPortalLayout';
import {
  ComplianceOverviewModule, ComplianceApprovalsModule, CompliancePermitsModule,
  ComplianceInspectionsModule, ComplianceEnvironmentModule, ComplianceLabourModule,
  ComplianceSafetyModule, ComplianceEsgModule, ComplianceDocsModule, ComplianceNcrModule,
  ComplianceReportsModule, ComplianceRiskModule, ComplianceGisDroneModule,
  ComplianceBimModule, ComplianceAiCenterModule
} from '../components/ComplianceModules';

export default function ComplianceDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const navGroups = [
    {
      title: 'STATUTORY & REGULATORY',
      color: 'pink',
      items: [
        { id: 'overview', label: 'Statutory Compliance Dashboard', icon: Scale },
        { id: 'approvals', label: 'Municipal Sanctions & NOCs', icon: FileSignature },
        { id: 'permits', label: 'Building Permits & Commencement (CC)', icon: Gavel },
        { id: 'environment', label: 'Environmental Clearances (MoEFCC/PCB)', icon: Activity },
        { id: 'labour', label: 'Labor Laws & BOCW Act Compliance', icon: Users },
        { id: 'safety', label: 'Factory & Fire Safety (NBC Part 4)', icon: ShieldCheck },
        { id: 'reports', label: 'Statutory Audit Reports', icon: FileText },
        { id: 'settings', label: 'Settings', icon: Settings },
      ]
    },
    {
      title: 'AUDIT, NCR & AI',
      color: 'cyan',
      items: [
        { id: 'ai', label: 'AI Regulatory Compliance Copilot', icon: Bot, badge: 'NEW' },
        { id: 'inspections', label: 'Government Inspector Audits', icon: CheckCircle2 },
        { id: 'ncr', label: 'Statutory Non-Compliance (NCR)', icon: ShieldAlert },
        { id: 'esg', label: 'RERA & ESG Disclosures', icon: Layers },
      ]
    }
  ];

  const kpiCards = [
    { title: 'Statutory Approvals', value: '28 of 30', trend: '93.3% Sanctions Active', icon: FileSignature, color: 'pink' },
    { title: 'Regulatory Compliance Rate', value: '98.4%', trend: 'RERA & NBC 2024 Audited', icon: Scale, color: 'cyan' },
    { title: 'Active Government Permits', value: '14 Permits', trend: '100% Valid & Renewed', icon: Gavel, color: 'purple' },
    { title: 'Open Compliance NCRs', value: '0 Critical', trend: 'Zero Penalty Risk', icon: ShieldCheck, color: 'magenta' },
  ];

  const telemetryCards = [
    { title: 'RERA Registration', value: 'Certified', trend: 'Quarterly Filing Up to Date', icon: Gavel, color: 'cyan' },
    { title: 'Fire NOC Clearance', value: 'Approved', trend: 'NFPA & NBC Verified', icon: ShieldCheck, color: 'purple' },
    { title: 'MoEFCC Environmental NOC', value: 'Cleared', trend: 'BOD & Air Limits Met', icon: Activity, color: 'magenta' },
    { title: 'Labor BOCW Audit', value: '100% Compliant', trend: 'Minimum Wages & ESI OK', icon: Users, color: 'teal' },
    { title: 'Commencement Cert (CC)', value: 'Plinth CC Valid', trend: 'Superstructure CC Issued', icon: FileSignature, color: 'cyan' },
    { title: 'Pending Renewals', value: '1 in 60 Days', trend: 'DG Set PCB License', icon: Scale, color: 'teal' },
    { title: 'Statutory Inspections', value: '12 Passed', trend: 'Govt Officer Audits', icon: CheckCircle2, color: 'magenta' },
    { title: 'AI Bye-Law Engine', value: '100% Verified', trend: 'Automated FAR & Setback', icon: Bot, color: 'magenta' },
  ];

  const platformOverview = {
    title: 'Statutory Sanction & NOC Portfolio',
    subtitle: 'Municipal and central government authority clearances',
    totalCount: '30',
    totalLabel: 'NOCS',
    items: [
      { name: 'Municipal Corporation Sanctioned Plan', count: 'Approved', percent: '100%', color: 'green' },
      { name: 'State Fire & Rescue Services NOC', count: 'Approved', percent: '100%', color: 'green' },
      { name: 'State Pollution Control Board (CTO/CTE)', count: 'Approved', percent: '100%', color: 'yellow' },
      { name: 'Airport Authority Height NOC (AAI)', count: 'Approved', percent: '100%', color: 'purple' },
      { name: 'Occupancy Certificate (OC) Readiness', count: 'In Review', percent: '75%', color: 'pink' },
    ]
  };

  const statusList = {
    title: 'Regulatory Authority Filings & Status',
    viewAllTab: 'approvals',
    items: [
      { name: 'RERA Q2 Quarterly Progress Report (QPR)', status: 'Filed (Approved)', badgeClass: 'active' },
      { name: 'Central Ground Water Authority (CGWA) NOC', status: 'Approved', badgeClass: 'active' },
      { name: 'Electrical Inspectorate (CEIG) Substation Approval', status: 'Inspected', badgeClass: 'deploying' },
      { name: 'Labor Welfare Cess Deposit (1% BOCW)', status: 'Deposited', badgeClass: 'active' },
      { name: 'Tree Officer Green Plantation Compliance', status: 'Under Review', badgeClass: 'training' },
    ]
  };

  const recentActivities = {
    title: 'Regulatory & Compliance Stream',
    viewAllTab: 'overview',
    items: [
      { icon: Gavel, text: "RERA Q2 Quarterly Compliance Certificate published on official portal", time: '10:15 AM', color: 'purple' },
      { icon: ShieldCheck, text: 'Chief Fire Officer completed final site audit with automated riser pressure test', time: '09:42 AM', color: 'cyan' },
      { icon: Bot, text: 'AI Compliance Copilot cross-referenced NBC 2024 setbacks against As-Built survey', time: '09:30 AM', color: 'green' },
      { icon: Scale, text: 'Pollution Control Board treated effluent water test: COD/BOD well below limits', time: '08:55 AM', color: 'blue' },
      { icon: FileSignature, text: 'Municipal Corporation partial Occupancy Certificate inspection scheduled', time: '08:30 AM', color: 'red' },
    ]
  };

  const scoreGauge = {
    title: 'Regulatory Compliance Health',
    score: '98',
    scoreMax: '/100',
    scoreLabel: 'LEGAL HEALTH',
    statusText: '100% Compliant',
    viewAllTab: 'overview',
    breakdown: [
      { name: 'Sanctions Fully Cleared', num: '28 NOCs', color: 'green' },
      { name: 'Under Routine Processing', num: '2 NOCs', color: 'yellow' },
      { name: 'Show-Cause Notices', num: '0 Notices', color: 'purple' },
      { name: 'Statutory Violations', num: '0 Violations', color: 'red' },
    ],
    footerText: 'Legal Framework: RERA Act / NBC 2024 / MoEFCC Guidelines',
    safeText: '🛡 Zero Regulatory Risk'
  };

  return (
    <CyberPortalLayout
      portalName="Regulatory Compliance"
      portalSubtitle="STATUTORY, RERA & GOVERNMENT COMPLIANCE PORTAL"
      userName="Suresh Kulkarni"
      userRole="Chief Regulatory & Compliance Officer"
      userAvatar="https://i.pravatar.cc/150?img=61"
      navGroups={navGroups}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      copilotTitle="AI Regulatory Copilot"
      copilotDesc="Ask me anything about municipal bye-laws, RERA filings & statutory NOCs"
      copilotTabId="ai"
      kpiCards={kpiCards}
      telemetryCards={telemetryCards}
      platformOverview={platformOverview}
      statusList={statusList}
      recentActivities={recentActivities}
      scoreGauge={scoreGauge}
    >
      {activeTab === 'overview' && <ComplianceOverviewModule />}
      {activeTab === 'approvals' && <ComplianceApprovalsModule />}
      {activeTab === 'permits' && <CompliancePermitsModule />}
      {activeTab === 'environment' && <ComplianceEnvironmentModule />}
      {activeTab === 'labour' && <ComplianceLabourModule />}
      {activeTab === 'safety' && <ComplianceSafetyModule />}
      {activeTab === 'reports' && <ComplianceReportsModule />}
      {activeTab === 'settings' && <ComplianceDocsModule />}
      {activeTab === 'ai' && <ComplianceAiCenterModule />}
      {activeTab === 'inspections' && <ComplianceInspectionsModule />}
      {activeTab === 'ncr' && <ComplianceNcrModule />}
      {activeTab === 'esg' && <ComplianceEsgModule />}
    </CyberPortalLayout>
  );
}
