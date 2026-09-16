import React, { useState } from 'react';
import {
  Activity,
  AlertCircle,
  Bot,
  Building2,
  CheckCircle2,
  FileSignature,
  FileText,
  Layers,
  PenTool,
  Settings,
  ShieldCheck,
  TrendingUp,
  Users,
  Wallet
} from 'lucide-react';
import CyberPortalLayout from '../components/CyberPortalLayout';
import {
  ConsultantProjectsModule, ConsultantTechnicalReviewModule, ConsultantDrawingReviewModule,
  ConsultantBimReviewModule, ConsultantRfiModule, ConsultantSiteInspectionModule,
  ConsultantQaModule, ConsultantPunchModule, ConsultantSafetyModule,
  ConsultantScheduleModule, ConsultantCostModule, ConsultantComplianceModule,
  ConsultantReportsModule, ConsultantDocsModule, ConsultantMeetingsModule,
  ConsultantCollabModule, ConsultantAiCenterModule
} from '../components/ConsultantModules';

export default function ConsultantDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const navGroups = [
    {
      title: 'ENGINEERING AUDIT & REVIEWS',
      color: 'pink',
      items: [
        { id: 'projects', label: 'Consultant Projects Overview', icon: Building2 },
        { id: 'techreview', label: 'Design Submittals & GFC Reviews', icon: PenTool },
        { id: 'drawings', label: 'Shop Drawing Approvals (Code A/B/C)', icon: FileSignature },
        { id: 'bimreview', label: 'Federated BIM & Clash Audits', icon: Layers },
        { id: 'inspection', label: 'Site Inspection Requests (WIR/MIR)', icon: CheckCircle2 },
        { id: 'rfis', label: 'RFI & Technical Clarifications', icon: AlertCircle },
        { id: 'compliance', label: 'Statutory & Code Compliance', icon: ShieldCheck },
        { id: 'reports', label: 'Consultant QA/QC Audit Reports', icon: FileText },
        { id: 'settings', label: 'Settings', icon: Settings },
      ]
    },
    {
      title: 'SUPERVISION & AI',
      color: 'cyan',
      items: [
        { id: 'ai', label: 'AI Technical Consultant Copilot', icon: Bot, badge: 'NEW' },
        { id: 'qa', label: 'Non-Conformance Reports (NCR)', icon: AlertCircle },
        { id: 'punch', label: 'Punch Lists & Snag Resolution', icon: CheckCircle2 },
        { id: 'schedule', label: 'Independent Schedule & Cost Audit', icon: TrendingUp },
      ]
    }
  ];

  const kpiCards = [
    { title: 'Submittals Reviewed', value: '420 Items', trend: '98.2% Reviewed < 48 hrs', icon: FileSignature, color: 'pink' },
    { title: 'Shop Drawings Approved', value: '348 Code A', trend: 'Code A / B Approvals', icon: PenTool, color: 'cyan' },
    { title: 'Work Inspection Pass Rate', value: '96.8%', trend: 'Rigorous Engineering Audit', icon: CheckCircle2, color: 'purple' },
    { title: 'Technical RFIs Resolved', value: '142 RFIs', trend: 'Avg Resolution 1.4 Days', icon: AlertCircle, color: 'magenta' },
  ];

  const telemetryCards = [
    { title: 'Active Design Submittals', value: '14 Pending', trend: 'Under 24h Review', icon: PenTool, color: 'cyan' },
    { title: 'WIR Inspection Requests', value: '38 WIRs', trend: 'Site Team Deployed', icon: CheckCircle2, color: 'purple' },
    { title: 'BIM Clash Severity', value: '0 High / 2 Minor', trend: 'LOD 350 Synchronized', icon: Layers, color: 'magenta' },
    { title: 'Open Technical RFIs', value: '4 Open', trend: 'Structural Clarifications', icon: AlertCircle, color: 'teal' },
    { title: 'Open NCRs', value: '1 NCR', subDenom: 'Minor', trend: 'Rectification Verified', icon: ShieldCheck, color: 'cyan' },
    { title: 'Site Inspection Audits', value: '48 Audits', trend: '100% Documented', icon: Building2, color: 'teal' },
    { title: 'Schedule Variance (SV)', value: '+4 Days Ahead', trend: 'Independent CPM Audit', icon: TrendingUp, color: 'magenta' },
    { title: 'AI Submittal Checker', value: '0.4s Verification', trend: 'Spec & Standard Match', icon: Bot, color: 'magenta' },
  ];

  const platformOverview = {
    title: 'Submittal Approval Distribution',
    subtitle: 'Consultant review status of contractor submittals',
    totalCount: '420',
    totalLabel: 'SUBMITTALS',
    items: [
      { name: 'Code A (Approved as Submitted)', count: '280 Docs', percent: '66.7%', color: 'green' },
      { name: 'Code B (Approved with Comments)', count: '102 Docs', percent: '24.3%', color: 'yellow' },
      { name: 'Code C (Revise and Resubmit)', count: '24 Docs', percent: '5.7%', color: 'purple' },
      { name: 'Code D (Rejected - Non-Compliant)', count: '8 Docs', percent: '1.9%', color: 'cyan' },
      { name: 'Under Technical Review', count: '6 Docs', percent: '1.4%', color: 'pink' },
    ]
  };

  const statusList = {
    title: 'Critical Engineering Reviews & Audits',
    viewAllTab: 'techreview',
    items: [
      { name: 'Tower A Level 24 Post-Tensioned Shop Drawing', status: 'Code A (Approved)', badgeClass: 'active' },
      { name: 'HVAC Variable Primary Chilled Water P&ID', status: 'Code B (Approved w/ Notes)', badgeClass: 'deploying' },
      { name: 'Facade Unitized Extrusion Structural Calc', status: 'Code A (Approved)', badgeClass: 'active' },
      { name: 'STP MBBR Membrane Aeration Sizing Submittal', status: 'Under Review', badgeClass: 'training' },
      { name: '11kV HT Vacuum Circuit Breaker Test Certificate', status: 'Code A (Approved)', badgeClass: 'active' },
    ]
  };

  const recentActivities = {
    title: 'Consultant Engineering Audit Log',
    viewAllTab: 'techreview',
    items: [
      { icon: CheckCircle2, text: "Structural concrete pre-pour inspection passed for Tower B shear core Level 18", time: '10:15 AM', color: 'purple' },
      { icon: PenTool, text: 'Shop Drawing SD-MEP-448 stamped Code A with zero clashes against arch ceiling', time: '09:42 AM', color: 'cyan' },
      { icon: Bot, text: 'AI Technical Copilot cross-referenced ASTM A615 rebar spec against vendor MTC', time: '09:30 AM', color: 'green' },
      { icon: AlertCircle, text: 'Technical RFI-142 answered: structural beam notch detail clarified with sketch', time: '08:55 AM', color: 'blue' },
      { icon: ShieldCheck, text: 'Independent site concrete core compressive strength audit validated at 42.8 MPa', time: '08:30 AM', color: 'red' },
    ]
  };

  const scoreGauge = {
    title: 'Engineering Governance & Quality Score',
    score: '99',
    scoreMax: '/100',
    scoreLabel: 'ENGINEERING SCORE',
    statusText: 'Flawless',
    viewAllTab: 'reports',
    breakdown: [
      { name: 'Submittals Cleared on Schedule', num: '414 Docs', color: 'green' },
      { name: 'Design Clarifications Closed', num: '142 RFIs', color: 'yellow' },
      { name: 'Active NCR Rectifications', num: '1 NCR', color: 'purple' },
      { name: 'Code Violations', num: '0 Violations', color: 'red' },
    ],
    footerText: 'Supervision Standard: FIDIC Red Book / IS / BS / ACI Codes',
    safeText: '🛡 100% Engineering Rigor'
  };

  return (
    <CyberPortalLayout
      portalName="Engineering Consultant"
      portalSubtitle="INDEPENDENT ENGINEERING & PMC SUPERVISION PORTAL"
      userName="Dr. Arthur Pendelton"
      userRole="Senior Principal Consultant (PMC)"
      userAvatar="https://i.pravatar.cc/150?img=51"
      navGroups={navGroups}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      copilotTitle="AI Technical Consultant Copilot"
      copilotDesc="Ask me anything about Code A/B submittal reviews, FIDIC terms & NDT audits"
      copilotTabId="ai"
      kpiCards={kpiCards}
      telemetryCards={telemetryCards}
      platformOverview={platformOverview}
      statusList={statusList}
      recentActivities={recentActivities}
      scoreGauge={scoreGauge}
    >
      {activeTab === 'projects' && <ConsultantProjectsModule />}
      {activeTab === 'techreview' && <ConsultantTechnicalReviewModule />}
      {activeTab === 'drawings' && <ConsultantDrawingReviewModule />}
      {activeTab === 'bimreview' && <ConsultantBimReviewModule />}
      {activeTab === 'inspection' && <ConsultantSiteInspectionModule />}
      {activeTab === 'rfis' && <ConsultantRfiModule />}
      {activeTab === 'compliance' && <ConsultantComplianceModule />}
      {activeTab === 'reports' && <ConsultantReportsModule />}
      {activeTab === 'settings' && <ConsultantDocsModule />}
      {activeTab === 'ai' && <ConsultantAiCenterModule />}
      {activeTab === 'qa' && <ConsultantQaModule />}
      {activeTab === 'punch' && <ConsultantPunchModule />}
      {activeTab === 'schedule' && <ConsultantScheduleModule />}
    </CyberPortalLayout>
  );
}
