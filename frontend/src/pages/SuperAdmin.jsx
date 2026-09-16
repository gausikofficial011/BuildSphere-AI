import React, { useState } from 'react';
import {
  Activity,
  AlertTriangle,
  ArrowUp,
  Bell,
  Bot,
  Box,
  Brain,
  Building2,
  Calendar,
  CheckCircle2,
  ChevronDown,
  Clock,
  Compass,
  Cpu,
  CreditCard,
  Database,
  DollarSign,
  Download,
  FileSignature,
  FileSpreadsheet,
  FileText,
  Folder,
  Globe,
  HardDrive,
  HardHat,
  Layers,
  Lock,
  Mail,
  Map,
  Maximize2,
  Menu,
  Network,
  Pin,
  Radio,
  Search,
  Server,
  Settings,
  Share2,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Sun,
  TrendingDown,
  TrendingUp,
  User,
  Users,
  Wifi,
  Workflow,
  Zap
} from 'lucide-react';
import './SuperAdmin.css';
import {
  OrganizationsModule,
  UsersModule,
  RolesModule,
  SubscriptionsModule,
  FinanceModule,
  AIMLModule,
  Engine3DModule,
  APIModule,
  SecurityModule,
  DatabaseModule,
  CopilotInterface,
  MachineLearningModule,
  WorkflowModule,
  MonitoringModule
} from '../components/AdminModules';

export default function SuperAdmin() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTimeRange, setSelectedTimeRange] = useState('May 12, 2024 - 10:30 AM IST');

  return (
    <div className="cyber-superadmin-layout">
      {/* Background Cyber City Skyline & Grid */}
      <div className="cyber-city-backdrop">
        <div className="city-skyline-silhouette"></div>
        <div className="grid-floor-perspective"></div>
      </div>

      {/* Outer HUD Frame with Corner Notches */}
      <div className="superadmin-hud-frame">
        <div className="hud-corner-notch top-left"></div>
        <div className="hud-corner-notch top-right"></div>
        <div className="hud-corner-notch bottom-left"></div>
        <div className="hud-corner-notch bottom-right"></div>

        {/* =========================================================================
           TOP FULL-WIDTH HUD HEADER
           ========================================================================= */}
        <header className="superadmin-top-navbar">
          <div className="navbar-left-section">
            {/* Hexagonal Emblem Logo */}
            <div className="admin-brand-group">
              <div className="admin-brand-hexagon">
                <Building2 size={22} className="admin-hexagon-icon" />
              </div>
              <div className="admin-brand-labels">
                <div className="admin-brand-title">
                  BuildSphere <span className="text-pink-glow">AI</span>
                </div>
                <span className="admin-brand-subtitle">SUPER ADMIN PORTAL</span>
              </div>
            </div>

            {/* Menu Toggle */}
            <button className="menu-toggle-btn" title="Toggle Navigation">
              <Menu size={18} />
            </button>

            {/* Global Cyber Search Bar */}
            <div className="admin-search-box">
              <Search size={15} className="search-icon-pink" />
              <input 
                type="text" 
                placeholder="Search anything... (Users, Projects, Models)" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="admin-search-input"
              />
              <span className="ctrl-k-badge">CTRL + K</span>
            </div>
          </div>

          <div className="navbar-right-section">
            {/* Notification Bell with Pink Badge */}
            <button className="nav-icon-badge-btn" title="Notifications">
              <Bell size={18} />
              <span className="notification-pill-pink">12</span>
            </button>

            {/* Messages with Pink Badge */}
            <button className="nav-icon-badge-btn" title="Messages">
              <Mail size={18} />
              <span className="notification-pill-pink">6</span>
            </button>

            {/* Globe Language */}
            <button className="nav-icon-btn" title="Language & Region">
              <Globe size={18} />
            </button>

            {/* Fullscreen Toggle */}
            <button className="nav-icon-btn" title="Fullscreen">
              <Maximize2 size={17} />
            </button>

            {/* User Profile Capsule */}
            <div className="admin-profile-capsule">
              <div className="admin-avatar-ring">
                <User size={18} />
                <span className="online-indicator-dot"></span>
              </div>
              <div className="admin-meta-text">
                <div className="admin-name">Super Admin</div>
                <div className="admin-role-status">
                  <span>Platform Owner</span>
                  <span className="online-label">● ONLINE</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* =========================================================================
           MAIN CONTAINER (LEFT SIDEBAR + DASHBOARD CONTENT)
           ========================================================================= */}
        <div className="superadmin-body-container">
          
          {/* -----------------------------------------------------------------------
             LEFT NAVIGATION SIDEBAR
             ----------------------------------------------------------------------- */}
          <aside className="superadmin-sidebar">
            {/* Pinned Top Dashboard Button */}
            <div className="sidebar-top-pinned">
              <button 
                className={`sidebar-top-dashboard-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
                onClick={() => setActiveTab('dashboard')}
              >
                <div className="btn-left-content">
                  <Activity size={18} />
                  <span>Dashboard</span>
                </div>
                <Pin size={14} className="dashboard-pin-icon" />
              </button>
            </div>

            {/* Scrollable Navigation Middle */}
            <div className="sidebar-scrollable-content">
              {/* Group 1: Platform Administration */}
              <div className="sidebar-group">
                <div className="group-heading-pink">PLATFORM ADMINISTRATION</div>
                <nav className="sidebar-nav-list">
                  <button 
                    className={`sidebar-link ${activeTab === 'organizations' ? 'active' : ''}`}
                    onClick={() => setActiveTab('organizations')}
                  >
                    <Building2 size={16} />
                    <span>Organization Management</span>
                  </button>
                  <button 
                    className={`sidebar-link ${activeTab === 'users' ? 'active' : ''}`}
                    onClick={() => setActiveTab('users')}
                  >
                    <Users size={16} />
                    <span>User Management</span>
                  </button>
                  <button 
                    className={`sidebar-link ${activeTab === 'roles' ? 'active' : ''}`}
                    onClick={() => setActiveTab('roles')}
                  >
                    <ShieldCheck size={16} />
                    <span>Roles & Permissions</span>
                  </button>
                  <button 
                    className={`sidebar-link ${activeTab === 'subscriptions' ? 'active' : ''}`}
                    onClick={() => setActiveTab('subscriptions')}
                  >
                    <CreditCard size={16} />
                    <span>Subscription Management</span>
                  </button>
                  <button 
                    className={`sidebar-link ${activeTab === 'finance' ? 'active' : ''}`}
                    onClick={() => setActiveTab('finance')}
                  >
                    <DollarSign size={16} />
                    <span>Financial Management</span>
                  </button>
                  <button 
                    className={`sidebar-link ${activeTab === 'audit' ? 'active' : ''}`}
                    onClick={() => setActiveTab('audit')}
                  >
                    <FileText size={16} />
                    <span>Audit Logs</span>
                  </button>
                </nav>
              </div>

              {/* Group 2: Platform Operations */}
              <div className="sidebar-group">
                <div className="group-heading-cyan">PLATFORM OPERATIONS</div>
                <nav className="sidebar-nav-list">
                  <button 
                    className={`sidebar-link ${activeTab === 'monitoring' ? 'active' : ''}`}
                    onClick={() => setActiveTab('monitoring')}
                  >
                    <Activity size={16} />
                    <span>Platform Monitoring</span>
                  </button>
                  <button 
                    className={`sidebar-link ${activeTab === 'aiml' ? 'active' : ''}`}
                    onClick={() => setActiveTab('aiml')}
                  >
                    <Brain size={16} />
                    <span>AI & ML Control Center</span>
                  </button>
                  <button 
                    className={`sidebar-link ${activeTab === 'mlmodels' ? 'active' : ''}`}
                    onClick={() => setActiveTab('mlmodels')}
                  >
                    <Bot size={16} />
                    <span>Machine Learning Models</span>
                    <span className="sidebar-pill-new">NEW</span>
                  </button>
                  <button 
                    className={`sidebar-link ${activeTab === 'engine3d' ? 'active' : ''}`}
                    onClick={() => setActiveTab('engine3d')}
                  >
                    <Box size={16} />
                    <span>AR/VR Building View</span>
                    <span className="sidebar-pill-new">3D</span>
                  </button>
                  <button 
                    className={`sidebar-link ${activeTab === 'api' ? 'active' : ''}`}
                    onClick={() => setActiveTab('api')}
                  >
                    <Zap size={16} />
                    <span>API Management</span>
                  </button>
                  <button 
                    className={`sidebar-link ${activeTab === 'security' ? 'active' : ''}`}
                    onClick={() => setActiveTab('security')}
                  >
                    <Shield size={16} />
                    <span>Security Center</span>
                  </button>
                  <button 
                    className={`sidebar-link ${activeTab === 'database' ? 'active' : ''}`}
                    onClick={() => setActiveTab('database')}
                  >
                    <Database size={16} />
                    <span>Database Center</span>
                  </button>
                  <button 
                    className={`sidebar-link ${activeTab === 'workflow' ? 'active' : ''}`}
                    onClick={() => setActiveTab('workflow')}
                  >
                    <Workflow size={16} />
                    <span>Workflow Automation</span>
                  </button>
                </nav>
              </div>
            </div>

            {/* Pinned Bottom Copilot Launcher Footer */}
            <div className="sidebar-bottom-pinned">
              <div className="sidebar-copilot-card">
                <div className="copilot-top-info">
                  <div className="copilot-avatar-ring">
                    <Bot size={15} color="#ffffff" />
                  </div>
                  <div className="copilot-text-group">
                    <strong>Super Admin AI Copilot</strong>
                    <span>Ask me anything about the platform</span>
                  </div>
                </div>
                <button 
                  className="copilot-action-btn"
                  onClick={() => setActiveTab('copilot')}
                >
                  <span>Start Conversation</span>
                  <span className="btn-arrow">→</span>
                </button>
              </div>
            </div>
          </aside>

          {/* -----------------------------------------------------------------------
             MAIN DASHBOARD CONTENT AREA
             ----------------------------------------------------------------------- */}
          <main className="superadmin-content-stage">
            
            {activeTab === 'dashboard' ? (
              <>
                {/* 1. GREETING & DATE EXPORT BAR */}
                <div className="dashboard-welcome-bar">
                  <div className="welcome-text-group">
                    <h1 className="welcome-title">
                      Welcome back, <span className="text-pink-glow">Super Admin!</span> 👋
                    </h1>
                    <p className="welcome-subtitle">
                      Here's what's happening on your platform today.
                    </p>
                  </div>

                  <div className="welcome-actions-group">
                    <button className="date-selector-pill">
                      <Calendar size={15} className="icon-pink" />
                      <span>{selectedTimeRange}</span>
                      <ChevronDown size={14} />
                    </button>

                    <button className="export-report-btn">
                      <Download size={15} />
                      <span>Export Report</span>
                    </button>
                  </div>
                </div>

                {/* 2. TOP 4 KPI METRICS CARDS */}
                <div className="top-4-kpi-grid">
                  {/* Card 1: Total Organizations (Pink) */}
                  <div className="kpi-card border-pink">
                    <div className="kpi-icon-box pink">
                      <Building2 size={24} />
                    </div>
                    <div className="kpi-info">
                      <span className="kpi-label">Total Organizations</span>
                      <div className="kpi-number">128</div>
                      <div className="kpi-trend green">
                        <TrendingUp size={13} />
                        <span>12.4% vs last month</span>
                      </div>
                    </div>
                  </div>

                  {/* Card 2: Total Projects (Cyan) */}
                  <div className="kpi-card border-cyan">
                    <div className="kpi-icon-box cyan">
                      <Box size={24} />
                    </div>
                    <div className="kpi-info">
                      <span className="kpi-label">Total Projects</span>
                      <div className="kpi-number">642</div>
                      <div className="kpi-trend green">
                        <TrendingUp size={13} />
                        <span>18.7% vs last month</span>
                      </div>
                    </div>
                  </div>

                  {/* Card 3: Active Users (Purple/Pink) */}
                  <div className="kpi-card border-purple">
                    <div className="kpi-icon-box purple">
                      <Users size={24} />
                    </div>
                    <div className="kpi-info">
                      <span className="kpi-label">Active Users</span>
                      <div className="kpi-number">14,283</div>
                      <div className="kpi-trend green">
                        <TrendingUp size={13} />
                        <span>15.6% vs last month</span>
                      </div>
                    </div>
                  </div>

                  {/* Card 4: Online Users (Magenta/Blue) */}
                  <div className="kpi-card border-magenta">
                    <div className="kpi-icon-box blue">
                      <Wifi size={24} />
                    </div>
                    <div className="kpi-info">
                      <span className="kpi-label">Online Users</span>
                      <div className="kpi-number">1,354</div>
                      <div className="kpi-trend green">
                        <TrendingUp size={13} />
                        <span>4.2% vs last month</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. MIDDLE ROW: 8 TELEMETRY MICRO-CARDS STRIP */}
                <div className="telemetry-8-strip">
                  
                  {/* 1. AI Requests */}
                  <div className="micro-telemetry-card">
                    <div className="micro-header">
                      <Brain size={14} className="micro-icon cyan" />
                      <span>AI Requests</span>
                    </div>
                    <div className="micro-val">98.7K</div>
                    <div className="micro-chart-svg">
                      <svg viewBox="0 0 80 20" className="sparkline">
                        <path d="M0,15 Q20,5 40,12 T80,4" fill="none" stroke="#22d3ee" strokeWidth="1.8" />
                      </svg>
                    </div>
                    <div className="micro-trend green">↑ 32.4% vs last month</div>
                  </div>

                  {/* 2. ML Predictions */}
                  <div className="micro-telemetry-card">
                    <div className="micro-header">
                      <Bot size={14} className="micro-icon purple" />
                      <span>ML Predictions</span>
                    </div>
                    <div className="micro-val">56.3K</div>
                    <div className="micro-chart-svg">
                      <svg viewBox="0 0 80 20" className="sparkline">
                        <path d="M0,16 Q20,12 40,8 T80,5" fill="none" stroke="#a855f7" strokeWidth="1.8" />
                      </svg>
                    </div>
                    <div className="micro-trend green">↑ 28.4% vs last month</div>
                  </div>

                  {/* 3. Storage Used */}
                  <div className="micro-telemetry-card">
                    <div className="micro-header">
                      <Database size={14} className="micro-icon purple" />
                      <span>Storage Used</span>
                    </div>
                    <div className="micro-val">
                      78.4 TB <span className="sub-denom">of 200 TB</span>
                    </div>
                    <div className="micro-chart-svg">
                      <svg viewBox="0 0 80 20" className="sparkline">
                        <path d="M0,14 Q20,8 40,14 T80,6" fill="none" stroke="#ec4899" strokeWidth="1.8" />
                      </svg>
                    </div>
                    <div className="micro-trend green">↑ 5.2% vs last month</div>
                  </div>

                  {/* 4. Active BIM Models */}
                  <div className="micro-telemetry-card">
                    <div className="micro-header">
                      <Layers size={14} className="micro-icon teal" />
                      <span>Active BIM Models</span>
                    </div>
                    <div className="micro-val">2,356</div>
                    <div className="micro-chart-svg">
                      <svg viewBox="0 0 80 20" className="sparkline">
                        <path d="M0,17 Q20,10 40,12 T80,3" fill="none" stroke="#34d399" strokeWidth="1.8" />
                      </svg>
                    </div>
                    <div className="micro-trend green">↑ 14.5% vs last month</div>
                  </div>

                  {/* 5. Digital Twins */}
                  <div className="micro-telemetry-card">
                    <div className="micro-header">
                      <Box size={14} className="micro-icon cyan" />
                      <span>Digital Twins</span>
                    </div>
                    <div className="micro-val">86</div>
                    <div className="micro-chart-svg">
                      <svg viewBox="0 0 80 20" className="sparkline">
                        <path d="M0,15 Q20,6 40,11 T80,5" fill="none" stroke="#22d3ee" strokeWidth="1.8" />
                      </svg>
                    </div>
                    <div className="micro-trend green">↑ 8.1% vs last month</div>
                  </div>

                  {/* 6. Active IoT Devices */}
                  <div className="micro-telemetry-card">
                    <div className="micro-header">
                      <Cpu size={14} className="micro-icon teal" />
                      <span>Active IoT Devices</span>
                    </div>
                    <div className="micro-val">4,892</div>
                    <div className="micro-chart-svg">
                      <svg viewBox="0 0 80 20" className="sparkline">
                        <path d="M0,16 Q20,11 40,7 T80,4" fill="none" stroke="#34d399" strokeWidth="1.8" />
                      </svg>
                    </div>
                    <div className="micro-trend green">↑ 11.2% vs last month</div>
                  </div>

                  {/* 7. API Usage */}
                  <div className="micro-telemetry-card">
                    <div className="micro-header">
                      <Zap size={14} className="micro-icon magenta" />
                      <span>API Usage</span>
                    </div>
                    <div className="micro-val">
                      1.26M <span className="sub-denom">calls</span>
                    </div>
                    <div className="micro-chart-svg">
                      <svg viewBox="0 0 80 20" className="sparkline">
                        <path d="M0,15 Q20,4 40,9 T80,3" fill="none" stroke="#f43f5e" strokeWidth="1.8" />
                      </svg>
                    </div>
                    <div className="micro-trend green">↑ 45.2% vs last month</div>
                  </div>

                  {/* 8. Revenue */}
                  <div className="micro-telemetry-card">
                    <div className="micro-header">
                      <DollarSign size={14} className="micro-icon magenta" />
                      <span>Revenue</span>
                    </div>
                    <div className="micro-val">₹ 3.65 Cr</div>
                    <div className="micro-chart-svg">
                      <svg viewBox="0 0 80 20" className="sparkline">
                        <path d="M0,16 Q20,10 40,6 T80,2" fill="none" stroke="#ec4899" strokeWidth="1.8" />
                      </svg>
                    </div>
                    <div className="micro-trend green">↑ 22.8% vs last month</div>
                  </div>

                </div>

                {/* 4. BOTTOM 4 OPERATIONAL INTELLIGENCE WIDGETS */}
                <div className="operational-4-grid">
                  
                  {/* Widget 1: Platform Overview */}
                  <div className="admin-intel-widget">
                    <div className="widget-top-bar">
                      <div className="widget-titles">
                        <h3>Platform Overview</h3>
                        <span className="widget-sub">Real-time platform summary</span>
                      </div>
                    </div>
                    <div className="overview-donut-layout">
                      <div className="donut-graphic-wrapper">
                        <svg viewBox="0 0 36 36" className="circular-donut">
                          <circle cx="18" cy="18" r="14" fill="none" stroke="#1e1b4b" strokeWidth="3" />
                          <circle cx="18" cy="18" r="14" fill="none" stroke="#10b981" strokeWidth="3.5" strokeDasharray="43, 100" strokeDashoffset="25" />
                          <circle cx="18" cy="18" r="14" fill="none" stroke="#f59e0b" strokeWidth="3.5" strokeDasharray="21, 100" strokeDashoffset="82" />
                          <circle cx="18" cy="18" r="14" fill="none" stroke="#8b5cf6" strokeWidth="3.5" strokeDasharray="14, 100" strokeDashoffset="61" />
                          <circle cx="18" cy="18" r="14" fill="none" stroke="#06b6d4" strokeWidth="3.5" strokeDasharray="12, 100" strokeDashoffset="47" />
                          <circle cx="18" cy="18" r="14" fill="none" stroke="#ec4899" strokeWidth="3.5" strokeDasharray="10, 100" strokeDashoffset="35" />
                        </svg>
                        <div className="donut-center-text">
                          <span className="donut-total-lbl">TOTAL</span>
                          <strong className="donut-count">42</strong>
                          <span className="donut-unit">MODELS</span>
                        </div>
                      </div>
                      <div className="donut-breakdown-list">
                        <div className="donut-list-row">
                          <span className="dot-indicator green"></span>
                          <span className="row-name">Active</span>
                          <strong className="row-val">18 (42.9%)</strong>
                        </div>
                        <div className="donut-list-row">
                          <span className="dot-indicator yellow"></span>
                          <span className="row-name">Training</span>
                          <strong className="row-val">9 (21.4%)</strong>
                        </div>
                        <div className="donut-list-row">
                          <span className="dot-indicator purple"></span>
                          <span className="row-name">Testing</span>
                          <strong className="row-val">6 (14.3%)</strong>
                        </div>
                        <div className="donut-list-row">
                          <span className="dot-indicator cyan"></span>
                          <span className="row-name">Deploying</span>
                          <strong className="row-val">5 (11.9%)</strong>
                        </div>
                        <div className="donut-list-row">
                          <span className="dot-indicator pink"></span>
                          <span className="row-name">Inactive</span>
                          <strong className="row-val">4 (9.5%)</strong>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Widget 2: AI & ML Model Status */}
                  <div className="admin-intel-widget">
                    <div className="widget-top-bar flex-between">
                      <div className="widget-titles">
                        <h3>AI & ML Model Status</h3>
                      </div>
                      <a href="#models" className="link-view-all" onClick={(e) => { e.preventDefault(); setActiveTab('mlmodels'); }}>View All</a>
                    </div>
                    <div className="model-status-table">
                      <div className="model-row">
                        <span className="model-name">Cost Prediction V2</span>
                        <span className="model-badge active">Active</span>
                      </div>
                      <div className="model-row">
                        <span className="model-name">Schedule Optimizer</span>
                        <span className="model-badge training">Training</span>
                      </div>
                      <div className="model-row">
                        <span className="model-name">Risk Assessment AI</span>
                        <span className="model-badge testing">Testing</span>
                      </div>
                      <div className="model-row">
                        <span className="model-name">Design Generator</span>
                        <span className="model-badge deploying">Deploying</span>
                      </div>
                      <div className="model-row">
                        <span className="model-name">Quality Inspector</span>
                        <span className="model-badge inactive">Inactive</span>
                      </div>
                    </div>
                  </div>

                  {/* Widget 3: Recent Activities */}
                  <div className="admin-intel-widget">
                    <div className="widget-top-bar flex-between">
                      <div className="widget-titles">
                        <h3>Recent Activities</h3>
                      </div>
                      <a href="#activities" className="link-view-all" onClick={(e) => { e.preventDefault(); setActiveTab('audit'); }}>View All</a>
                    </div>
                    <div className="recent-activity-feed">
                      <div className="activity-row">
                        <div className="activity-icon-wrap purple"><Building2 size={13} /></div>
                        <div className="activity-text-col">
                          <span>New organization 'NextGen Infra' created</span>
                        </div>
                        <span className="activity-time">10:15 AM</span>
                      </div>
                      <div className="activity-row">
                        <div className="activity-icon-wrap cyan"><Users size={13} /></div>
                        <div className="activity-text-col">
                          <span>User role updated for 25 users</span>
                        </div>
                        <span className="activity-time">09:42 AM</span>
                      </div>
                      <div className="activity-row">
                        <div className="activity-icon-wrap green"><Brain size={13} /></div>
                        <div className="activity-text-col">
                          <span>AI model 'Cost Prediction V2' deployed</span>
                        </div>
                        <span className="activity-time">09:30 AM</span>
                      </div>
                      <div className="activity-row">
                        <div className="activity-icon-wrap blue"><ShieldCheck size={13} /></div>
                        <div className="activity-text-col">
                          <span>System backup completed</span>
                        </div>
                        <span className="activity-time">08:55 AM</span>
                      </div>
                      <div className="activity-row">
                        <div className="activity-icon-wrap red"><AlertTriangle size={13} /></div>
                        <div className="activity-text-col">
                          <span>High storage usage alert resolved</span>
                        </div>
                        <span className="activity-time">08:30 AM</span>
                      </div>
                    </div>
                  </div>

                  {/* Widget 4: Security Overview */}
                  <div className="admin-intel-widget">
                    <div className="widget-top-bar flex-between">
                      <div className="widget-titles">
                        <h3>Security Overview</h3>
                      </div>
                      <a href="#security" className="link-view-all" onClick={(e) => { e.preventDefault(); setActiveTab('security'); }}>View All</a>
                    </div>
                    <div className="security-gauge-layout">
                      <div className="security-gauge-col">
                        <div className="radial-security-gauge">
                          <svg viewBox="0 0 36 36" className="circular-chart cyber-cyan">
                            <path className="circle-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                            <path className="circle-progress-security" strokeDasharray="92, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                            <text x="18" y="17.5" className="sec-gauge-score">92</text>
                            <text x="18" y="21.5" className="sec-gauge-den">/100</text>
                            <text x="18" y="25.5" className="sec-gauge-lbl">SECURITY SCORE</text>
                            <text x="18" y="29.5" className="sec-gauge-status">Excellent</text>
                          </svg>
                        </div>
                      </div>
                      <div className="security-threat-breakdown">
                        <div className="threat-row">
                          <span className="dot-indicator green"></span>
                          <span className="threat-name">Strong</span>
                          <strong className="threat-num">42</strong>
                        </div>
                        <div className="threat-row">
                          <span className="dot-indicator yellow"></span>
                          <span className="threat-name">Medium</span>
                          <strong className="threat-num">12</strong>
                        </div>
                        <div className="threat-row">
                          <span className="dot-indicator purple"></span>
                          <span className="threat-name">Weak</span>
                          <strong className="threat-num">2</strong>
                        </div>
                        <div className="threat-row">
                          <span className="dot-indicator red"></span>
                          <span className="threat-name">Critical</span>
                          <strong className="threat-num">0</strong>
                        </div>
                      </div>
                    </div>
                    <div className="security-widget-footer">
                      <span>Last scan: 15 min ago</span>
                      <span className="safe-badge">🛡 No threats detected</span>
                    </div>
                  </div>

                </div>

                {/* 5. BOTTOM TELEMETRY STATUS STRIP */}
                <footer className="superadmin-bottom-strip">
                  <div className="strip-metric-item">
                    <div className="strip-icon-box"><Server size={14} className="icon-cyan" /></div>
                    <div className="strip-metric-text">
                      <span className="strip-lbl">Server Uptime</span>
                      <strong className="strip-val">99.98%</strong>
                    </div>
                    <div className="strip-sparkline">
                      <svg viewBox="0 0 40 14"><path d="M0,7 Q10,2 20,7 T40,4" fill="none" stroke="#22d3ee" strokeWidth="1.5" /></svg>
                    </div>
                  </div>

                  <div className="strip-metric-item">
                    <div className="strip-icon-box"><Database size={14} className="icon-green" /></div>
                    <div className="strip-metric-text">
                      <span className="strip-lbl">Database Health</span>
                      <strong className="strip-val green">Healthy</strong>
                    </div>
                    <div className="strip-blocks">
                      <span className="block active"></span>
                      <span className="block active"></span>
                      <span className="block active"></span>
                      <span className="block active"></span>
                    </div>
                  </div>

                  <div className="strip-metric-item">
                    <div className="strip-icon-box"><Zap size={14} className="icon-cyan" /></div>
                    <div className="strip-metric-text">
                      <span className="strip-lbl">API Success Rate</span>
                      <strong className="strip-val">99.6%</strong>
                    </div>
                    <div className="strip-bars">
                      <span className="bar h1"></span>
                      <span className="bar h3"></span>
                      <span className="bar h2"></span>
                      <span className="bar h4"></span>
                    </div>
                  </div>

                  <div className="strip-metric-item">
                    <div className="strip-icon-box"><HardDrive size={14} className="icon-cyan" /></div>
                    <div className="strip-metric-text">
                      <span className="strip-lbl">Backup Status</span>
                      <strong className="strip-val">Up to date</strong>
                    </div>
                  </div>

                  <div className="strip-metric-item">
                    <div className="strip-metric-text">
                      <span className="strip-lbl">Active Workflows</span>
                      <strong className="strip-val">312</strong>
                    </div>
                    <div className="strip-sparkline">
                      <svg viewBox="0 0 40 14"><path d="M0,10 Q10,4 20,8 T40,2" fill="none" stroke="#34d399" strokeWidth="1.5" /></svg>
                    </div>
                  </div>

                  {/* 3D Skyline Hologram Emblem on Right */}
                  <div className="strip-skyline-hologram">
                    <Building2 size={24} className="skyline-hologram-svg" />
                  </div>
                </footer>
              </>
            ) : (
              /* DYNAMIC MODULE VIEW */
              <div className="admin-active-module-container">
                <div className="module-top-header-bar">
                  <button className="back-to-dashboard-btn" onClick={() => setActiveTab('dashboard')}>
                    ← Back to Super Admin Dashboard
                  </button>
                </div>

                {activeTab === 'organizations' && <OrganizationsModule />}
                {activeTab === 'users' && <UsersModule />}
                {activeTab === 'roles' && <RolesModule />}
                {activeTab === 'subscriptions' && <SubscriptionsModule />}
                {activeTab === 'finance' && <FinanceModule />}
                {activeTab === 'monitoring' && <MonitoringModule />}
                {activeTab === 'aiml' && <AIMLModule />}
                {activeTab === 'mlmodels' && <MachineLearningModule />}
                {activeTab === 'engine3d' && <Engine3DModule />}
                {activeTab === 'api' && <APIModule />}
                {activeTab === 'security' && <SecurityModule />}
                {activeTab === 'database' && <DatabaseModule />}
                {activeTab === 'workflow' && <WorkflowModule />}
                {activeTab === 'copilot' && <CopilotInterface />}
                {activeTab === 'audit' && <OrganizationsModule />}
              </div>
            )}

          </main>

        </div>

      </div>
    </div>
  );
}
