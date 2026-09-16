import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  BarChart3,
  Box,
  Building2,
  Calculator,
  HardHat,
  Layers,
  PenTool,
  ShieldCheck,
  UserPlus,
  Wifi,
  Sparkles,
  ChevronRight,
  TrendingDown,
  Activity,
  Cpu,
  Compass,
  CheckCircle2,
  Eye,
  Sliders,
  DollarSign,
  Clock,
  AlertTriangle,
  ArrowUpRight,
  Search,
  Globe,
  Award,
  Zap,
  Lock,
  FileSpreadsheet,
  Workflow,
  CloudRain,
  Radio,
  Settings,
  Grid,
  Shield,
  Layers as LayersIcon,
  PieChart,
  User,
  SlidersHorizontal,
  FolderGit2
} from 'lucide-react';
import Button from '../components/Button';
import './Landing.css';

export default function Landing() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('digital-twin');
  const [projectBudget, setProjectBudget] = useState(50);
  const [selectedRoleCategory, setSelectedRoleCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // 20+ Roles list for interactive hub
  const allRoles = [
    { title: 'Project Manager', path: '/projectmanager', category: 'management', icon: Building2, desc: 'Overall project health, milestones & critical path AI' },
    { title: 'Architect', path: '/architect', category: 'design', icon: PenTool, desc: 'Generative layouts, facade design & Revit sync' },
    { title: 'Structural Engineer', path: '/structuralengineer', category: 'engineering', icon: Layers, desc: 'Stress analysis, load simulation & FEA reports' },
    { title: 'BIM Manager', path: '/bimmanager', category: 'design', icon: Box, desc: 'IFC clash detection, 4D/5D model federation' },
    { title: 'Civil Engineer', path: '/civilengineer', category: 'engineering', icon: HardHat, desc: 'Site grading, cut-and-fill & foundation analysis' },
    { title: 'MEP Engineer', path: '/mepengineer', category: 'engineering', icon: Activity, desc: 'HVAC, plumbing, electrical load & duct routing' },
    { title: 'Quantity Surveyor', path: '/quantitysurveyor', category: 'commercial', icon: Calculator, desc: 'Autonomous BOQ extraction & measurement sheets' },
    { title: 'Cost Engineer', path: '/costengineer', category: 'commercial', icon: TrendingDown, desc: 'Predictive cost forecasting & variance control' },
    { title: 'Planning Engineer', path: '/planningengineer', category: 'management', icon: Clock, desc: 'Primavera / MS Project sync & 4D scheduling' },
    { title: 'Site Engineer', path: '/siteengineer', category: 'site', icon: HardHat, desc: 'Daily work logs, concrete pour logs & drone sync' },
    { title: 'Construction Manager', path: '/constructionmanager', category: 'management', icon: Building2, desc: 'Subcontractor dispatch, equipment & crane telematics' },
    { title: 'Digital Twin Engineer', path: '/digitaltwinengineer', category: 'engineering', icon: Cpu, desc: 'Live IoT telemetry, vibration sensors & anomaly AI' },
    { title: 'IoT Engineer', path: '/iotengineer', category: 'engineering', icon: Wifi, desc: 'Sensor mesh network, environmental & power telemetry' },
    { title: 'GIS Engineer', path: '/gisengineer', category: 'engineering', icon: Globe, desc: 'Topographic mapping, drone lidar & geospatial overlay' },
    { title: 'Procurement Manager', path: '/procurement', category: 'commercial', icon: FileSpreadsheet, desc: 'Material supply chain, POs & vendor bidding' },
    { title: 'Contractor Manager', path: '/contractor', category: 'site', icon: Workflow, desc: 'Contractor milestones, labor allocation & RA bills' },
    { title: 'Client Dashboard', path: '/client', category: 'oversight', icon: Award, desc: 'Executive milestone visibility & payment approvals' },
    { title: 'Consultant Dashboard', path: '/consultant', category: 'oversight', icon: CheckCircle2, desc: 'Design review, compliance sign-offs & RFIs' },
    { title: 'Inspector / QA-QC', path: '/inspector', category: 'oversight', icon: ShieldCheck, desc: 'Quality audit checklists, punch-lists & safety compliance' },
    { title: 'Compliance Officer', path: '/compliance', category: 'oversight', icon: Lock, desc: 'NBC / IBC building codes, green rating & environmental audit' },
    { title: 'Technician Portal', path: '/technician', category: 'site', icon: Settings, desc: 'Equipment maintenance, IoT calibration & employee portal assignments' }
  ];

  const filteredRoles = allRoles.filter(role => {
    const matchesCategory = selectedRoleCategory === 'all' || role.category === selectedRoleCategory;
    const matchesQuery = role.title.toLowerCase().includes(searchQuery.toLowerCase()) || role.desc.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  const calculatedSavingsCr = (projectBudget * 0.086).toFixed(2);
  const calculatedDaysSaved = Math.round(projectBudget * 1.6);
  const clashesAvoided = Math.round(projectBudget * 4.8);

  return (
    <div className="cyber-landing-viewport">
      {/* Sci-Fi Hologram City & Matrix Background */}
      <div className="cyber-city-bg">
        <div className="cyber-grid-perspective"></div>
        <div className="city-hologram-silhouette"></div>
        <div className="drone-light-trail drone-1"></div>
        <div className="drone-light-trail drone-2"></div>
        <div className="drone-light-trail drone-3"></div>
      </div>

      {/* Sci-Fi HUD Outer Frame with Angled Corners */}
      <div className="hud-outer-frame">
        <div className="hud-bracket top-left"></div>
        <div className="hud-bracket top-right"></div>
        <div className="hud-bracket bottom-left"></div>
        <div className="hud-bracket bottom-right"></div>
        <div className="hud-frame-line top-line"></div>
        <div className="hud-frame-line bottom-line"></div>
        <div className="hud-frame-line left-line"></div>
        <div className="hud-frame-line right-line"></div>

        {/* LEFT VERTICAL CYBER DOCK */}
        <aside className="cyber-left-dock">
          <div className="dock-bracket top"></div>
          <button className="dock-btn active" title="Command Center" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
            <Grid size={18} />
          </button>
          <button className="dock-btn" title="Spatial 3D OS" onClick={() => navigate('/os')}>
            <Box size={18} />
          </button>
          <button className="dock-btn" title="20+ Dashboards" onClick={() => document.getElementById('roles')?.scrollIntoView({behavior: 'smooth'})}>
            <LayersIcon size={18} />
          </button>
          <button className="dock-btn" title="Cost & BOQ" onClick={() => navigate('/costengineer')}>
            <BarChart3 size={18} />
          </button>
          <button className="dock-btn" title="Architecture Hub" onClick={() => navigate('/architect')}>
            <Building2 size={18} />
          </button>
          <button className="dock-btn" title="System Settings" onClick={() => navigate('/superadmin')}>
            <Settings size={18} />
          </button>
          <div className="dock-bracket bottom"></div>
        </aside>

        {/* MAIN HUD CONTENT WRAPPER */}
        <div className="hud-main-content">

          {/* GLOBAL CLIENT DEMO ANNOUNCEMENT BAR */}
          <div className="hud-demo-announcement-bar">
            <div className="demo-pulse-indicator">
              <span className="pulse-dot"></span>
              <span className="demo-tag">CLIENT EVALUATION SANDBOX</span>
            </div>
            <span className="demo-message">
              ⚡ <strong>Interactive Demo & Dummy Setup:</strong> All 20+ role portals and 3D digital twins are pre-loaded with simulated client enterprise datasets for testing and evaluation.
            </span>
            <button className="demo-quick-login-btn" onClick={() => navigate('/signin')}>
              <span>1-Click Demo Login</span>
              <ArrowUpRight size={13} />
            </button>
          </div>

          {/* TOP HUD NAVBAR */}
          <header className="hud-navbar">
            {/* Logo */}
            <Link to="/" className="hud-brand">
              <div className="hud-brand-hexagon">
                <Building2 size={22} className="hud-brand-icon" />
              </div>
              <div className="hud-brand-text">
                <div className="hud-brand-name">
                  BuildSphere <span className="hud-pink-glow">AI</span>
                </div>
                <span className="hud-brand-sub">Construction Intelligence Platform</span>
              </div>
            </Link>

            {/* Center Navigation in HUD Bracket Capsule */}
            <div className="hud-nav-capsule">
              <div className="capsule-corner-notch left"></div>
              <nav className="hud-nav-links">
                <a href="#platform" className="hud-link active">PLATFORM</a>
                <a href="#solutions" className="hud-link">SOLUTIONS</a>
                <a href="#features" className="hud-link">RESOURCES</a>
                <a href="#roles" className="hud-link">DEMO PORTALS</a>
                <a href="#roi-calculator" className="hud-link">ROI VALUE</a>
                <a href="#contact" className="hud-link">CONTACT</a>
              </nav>
              <div className="capsule-corner-notch right"></div>
            </div>

            {/* Top Right User Profile Capsule (Demo Access) */}
            <div className="hud-user-profile demo-profile-highlight" onClick={() => navigate('/signin')} title="Click for Instant Demo Login">
              <div className="user-avatar-glow demo-glow">
                <Sparkles size={15} color="#38bdf8" />
              </div>
              <div className="user-info-text">
                <span className="user-codename">Client Demo Mode</span>
                <span className="user-role-tag demo-tag-highlight">Instant Access ↗</span>
              </div>
            </div>
          </header>

          {/* HERO SECTION CONTAINER */}
          <main className="hud-hero-stage" id="platform">
            
            {/* LEFT HERO COLUMN */}
            <div className="hud-hero-left">
              <h1 className="hud-cyber-title">
                <span className="title-ai-line">
                  <span className="hud-magenta-text">AI</span> POWERED
                </span>
                <span className="title-construction-line">CONSTRUCTION</span>
                <span className="title-intelligence-line">
                  INTELLIGENCE <span className="hud-cyan-text">PLATFORM</span>
                </span>
              </h1>

              <p className="hud-cyber-description">
                Design. Plan. Build. Operate. All in one intelligent platform. 
                AI and ML models empower your projects, teams, and decisions for a smarter tomorrow.
              </p>

              {/* TRUSTED BY ENTERPRISES */}
              <div className="hud-trusted-by">
                <div className="trusted-header-line">
                  <span className="hud-pink-dot"></span>
                  <span className="trusted-title-text">TRUSTED BY 500+ ORGANIZATIONS WORLDWIDE</span>
                </div>
                <div className="trusted-client-matrix">
                  <span className="matrix-client">LARSEN & TOUBRO</span>
                  <span className="matrix-client">DLF</span>
                  <span className="matrix-client">AECOM</span>
                  <span className="matrix-client">TATA PROJECTS</span>
                  <span className="matrix-client">SHAPOORJI PALLONJI</span>
                  <span className="matrix-client">MEIL</span>
                </div>
              </div>

              {/* HERO SCI-FI ACTION BUTTONS */}
              <div className="hud-hero-actions">
                <Link to="/os" className="hud-btn-primary">
                  <div className="btn-cutout-notch top-left"></div>
                  <div className="btn-cutout-notch bottom-right"></div>
                  <ArrowRight size={18} className="btn-icon" />
                  <span>ENTER SPATIAL OS</span>
                </Link>

                <Link to="/signin" className="hud-btn-secondary">
                  <div className="btn-cutout-notch top-left"></div>
                  <div className="btn-cutout-notch bottom-right"></div>
                  <UserPlus size={18} className="btn-icon" />
                  <span>DASHBOARD LOGIN</span>
                </Link>
              </div>
            </div>

            {/* CENTER HOLOGRAPHIC 3D CITY / BUILDING DAIS */}
            <div className="hud-center-hologram">
              <div className="hologram-dais-platform">
                <div className="dais-ring outer-ring"></div>
                <div className="dais-ring middle-ring"></div>
                <div className="dais-ring inner-ring"></div>
                <div className="dais-vertical-glow"></div>
              </div>

              {/* 3D Wireframe Hologram Building Projection */}
              <div className="hologram-wireframe-city">
                <div className="wireframe-skyscraper tower-center">
                  <div className="skyscraper-floors"></div>
                  <div className="skyscraper-spire"></div>
                </div>
                <div className="wireframe-skyscraper tower-left"></div>
                <div className="wireframe-skyscraper tower-right">
                  <div className="vertical-neon-sign">BUILDSPHERE</div>
                </div>
              </div>

              {/* Holographic Radar Scanner */}
              <div className="hologram-radar-scanner"></div>
            </div>

            {/* RIGHT SIDE FLOATING HUD WIDGETS */}
            <div className="hud-hero-right-widgets">
              
              {/* WIDGET 1: AI MODEL STATUS */}
              <div className="hud-cyber-widget model-status-widget">
                <div className="widget-header">
                  <span className="widget-title">AI MODEL STATUS</span>
                </div>
                <div className="model-status-body">
                  <div className="model-status-left">
                    <span className="label-sm">Active Models</span>
                    <span className="models-count">24</span>
                    <span className="label-xs">Models Running</span>
                    <div className="models-step-meter">
                      <span className="step active"></span>
                      <span className="step active"></span>
                      <span className="step active"></span>
                      <span className="step active"></span>
                      <span className="step"></span>
                    </div>
                  </div>
                  <div className="neural-globe-visual">
                    <div className="globe-wireframe-mesh">
                      <div className="mesh-dot dot-1"></div>
                      <div className="mesh-dot dot-2"></div>
                      <div className="mesh-dot dot-3"></div>
                      <div className="mesh-dot dot-4"></div>
                      <div className="mesh-dot dot-5"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* WIDGET 2: WEATHER HUD */}
              <div className="hud-cyber-widget weather-widget">
                <div className="widget-header">
                  <span className="widget-title">WEATHER</span>
                </div>
                <div className="weather-widget-body">
                  <div className="weather-left-val">
                    <CloudRain size={32} className="weather-icon-cyan" />
                    <div className="weather-temp">28°C</div>
                  </div>
                  <div className="weather-right-desc">
                    <span className="weather-condition">RAINY</span>
                    <span className="weather-humidity">High Humidity</span>
                  </div>
                </div>
              </div>

            </div>

          </main>

          {/* BOTTOM 5-CARD HUD TELEMETRY DASHBOARD DECK */}
          <div className="hud-bottom-telemetry-deck">
            
            {/* 1. PROJECT HEALTH */}
            <div className="hud-deck-card card-project-health">
              <div className="deck-card-bracket"></div>
              <div className="deck-card-header">
                <span>PROJECT HEALTH</span>
              </div>
              <div className="deck-card-content health-grid">
                <div className="cyber-circle-gauge">
                  <svg viewBox="0 0 36 36" className="circular-chart cyber-cyan-pink">
                    <path className="circle-bg"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path className="circle-progress-cyber"
                      strokeDasharray="92, 100"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <text x="18" y="19" className="gauge-text-big">92%</text>
                    <text x="18" y="24" className="gauge-text-sub">EXCELLENT</text>
                  </svg>
                </div>
                <div className="ecg-waveform-visual">
                  <svg viewBox="0 0 120 40" className="ecg-svg">
                    <path d="M0,20 L30,20 L35,10 L40,30 L45,5 L50,35 L55,20 L75,20 L80,12 L85,28 L90,20 L120,20" 
                          fill="none" stroke="#22d3ee" strokeWidth="1.8" className="ecg-line" />
                  </svg>
                </div>
              </div>
            </div>

            {/* 2. COST PREDICTION */}
            <div className="hud-deck-card card-cost-prediction">
              <div className="deck-card-bracket"></div>
              <div className="deck-card-header">
                <span>COST PREDICTION</span>
              </div>
              <div className="deck-card-content cost-content">
                <div className="cost-val-headline">₹ 48.7 Cr.</div>
                <div className="cost-trend-pill">
                  <span className="trend-arrow">▼</span> 8.6% vs Budget
                </div>
                <div className="cost-wave-chart">
                  <svg viewBox="0 0 140 35" className="area-chart-svg">
                    <defs>
                      <linearGradient id="pinkGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#ec4899" stopOpacity="0.6"/>
                        <stop offset="100%" stopColor="#ec4899" stopOpacity="0.0"/>
                      </linearGradient>
                    </defs>
                    <path d="M0,25 Q20,10 40,22 T80,12 T120,24 L140,18 L140,35 L0,35 Z" fill="url(#pinkGradient)" />
                    <path d="M0,25 Q20,10 40,22 T80,12 T120,24 L140,18" fill="none" stroke="#f43f5e" strokeWidth="1.8" />
                  </svg>
                </div>
              </div>
            </div>

            {/* 3. AI RISK SCORE */}
            <div className="hud-deck-card card-risk-score">
              <div className="deck-card-bracket"></div>
              <div className="deck-card-header">
                <span>AI RISK SCORE</span>
              </div>
              <div className="deck-card-content risk-content">
                <div className="risk-header-row">
                  <div className="cyber-shield-badge">
                    <Shield size={20} className="shield-icon-pink" />
                  </div>
                  <div className="risk-text-group">
                    <span className="risk-level-green">LOW RISK</span>
                    <div className="risk-score-num">
                      <strong>18</strong> <span className="denom">/ 100</span>
                    </div>
                  </div>
                </div>
                <div className="audio-equalizer-bars">
                  <span className="eq-bar h-3"></span>
                  <span className="eq-bar h-5"></span>
                  <span className="eq-bar h-8"></span>
                  <span className="eq-bar h-4"></span>
                  <span className="eq-bar h-9"></span>
                  <span className="eq-bar h-2"></span>
                  <span className="eq-bar h-7"></span>
                  <span className="eq-bar h-6"></span>
                  <span className="eq-bar h-4"></span>
                  <span className="eq-bar h-8"></span>
                  <span className="eq-bar h-5"></span>
                  <span className="eq-bar h-3"></span>
                  <span className="eq-bar h-7"></span>
                  <span className="eq-bar h-4"></span>
                </div>
              </div>
            </div>

            {/* 4. PROGRESS TRACKING */}
            <div className="hud-deck-card card-progress-tracking">
              <div className="deck-card-bracket"></div>
              <div className="deck-card-header">
                <span>PROGRESS TRACKING</span>
              </div>
              <div className="deck-card-content progress-grid">
                <div className="cyber-circle-gauge-sm">
                  <svg viewBox="0 0 36 36" className="circular-chart-sm">
                    <path className="circle-bg"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path className="circle-progress-pink-cyan"
                      strokeDasharray="67, 100"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <text x="18" y="21" className="gauge-text-pct">67%</text>
                  </svg>
                </div>
                <div className="cyber-bar-chart-visual">
                  <div className="hud-col-bar p1" style={{height: '35%'}}></div>
                  <div className="hud-col-bar p2" style={{height: '55%'}}></div>
                  <div className="hud-col-bar p3" style={{height: '80%'}}></div>
                  <div className="hud-col-bar p4" style={{height: '45%'}}></div>
                  <div className="hud-col-bar p5" style={{height: '90%'}}></div>
                  <div className="hud-col-bar p6" style={{height: '65%'}}></div>
                </div>
              </div>
            </div>

            {/* 5. ACTIVITY FEED */}
            <div className="hud-deck-card card-activity-feed">
              <div className="deck-card-bracket"></div>
              <div className="deck-card-header flex-between">
                <span>ACTIVITY FEED</span>
                <span className="feed-dots">•••</span>
              </div>
              <div className="deck-card-content feed-list">
                <div className="feed-row">
                  <div className="feed-icon-bubble purple"><Box size={10} /></div>
                  <div className="feed-meta">
                    <span className="feed-action">Structural Analysis</span>
                    <span className="feed-status done">Completed</span>
                  </div>
                  <span className="feed-time">2m ago</span>
                </div>
                <div className="feed-row">
                  <div className="feed-icon-bubble cyan"><Calculator size={10} /></div>
                  <div className="feed-meta">
                    <span className="feed-action">Cost Estimate Updated</span>
                    <span className="feed-status updated">Updated</span>
                  </div>
                  <span className="feed-time">15m ago</span>
                </div>
                <div className="feed-row">
                  <div className="feed-icon-bubble orange"><Wifi size={10} /></div>
                  <div className="feed-meta">
                    <span className="feed-action">Site Survey Data</span>
                    <span className="feed-status synced">Synced</span>
                  </div>
                  <span className="feed-time">33m ago</span>
                </div>
              </div>
            </div>

          </div>

          {/* HUD FOOTER NOTCH BAR */}
          <footer className="hud-bottom-status-bar">
            <div className="status-notch-left">SYS_OK // LATENCY 12ms</div>
            <div className="status-center-brand">— BUILDSPHERE AI v3.0.0 —</div>
            <div className="status-notch-right">ENCRYPTION AES-256 // SPATIAL OS ACTIVE</div>
          </footer>

        </div>

        {/* FLOATING 3D SPATIAL OS LAUNCHER */}
        <button 
          className="hud-floating-cube-launcher" 
          onClick={() => navigate('/os')}
          title="Launch Spatial 3D OS"
        >
          <div className="cube-hex-glow"></div>
          <Box size={22} className="cube-icon" />
        </button>
      </div>

      {/* EXTENDED SECTION: 20+ SPECIALIZED PORTALS EXPLORER */}
      <section className="hud-extended-section" id="roles">
        <div className="extended-section-container">
          <div className="section-header-hud">
            <div className="hud-tag-pill demo-pill">
              <Sparkles size={13} color="#38bdf8" /> CLIENT DEMO SETUP & DUMMY SHOWCASE
            </div>
            <h2>20+ Tailored Dashboards for Every Project Stakeholder</h2>
            <p className="hud-demo-subtext">
              <strong>Interactive Client Demo Environment:</strong> Direct access to dedicated engineering, commercial, and executive portals pre-configured with dummy enterprise datasets, simulated IoT streams, and interactive 3D BIM models for evaluation.
            </p>

            {/* Demo Notice Banner */}
            <div className="hud-demo-roles-banner">
              <Shield size={16} color="#38bdf8" />
              <span>
                <strong>Client Evaluation Setup:</strong> No password or registration required. Click any stakeholder portal below to explore the live dummy environment.
              </span>
              <button className="hud-demo-login-quicklink" onClick={() => navigate('/signin')}>
                1-Click Demo Login Page ↗
              </button>
            </div>

            {/* Filter Pills */}
            <div className="hud-role-filters">
              <button className={`hud-filter-btn ${selectedRoleCategory === 'all' ? 'active' : ''}`} onClick={() => setSelectedRoleCategory('all')}>All Roles ({allRoles.length})</button>
              <button className={`hud-filter-btn ${selectedRoleCategory === 'management' ? 'active' : ''}`} onClick={() => setSelectedRoleCategory('management')}>Management</button>
              <button className={`hud-filter-btn ${selectedRoleCategory === 'design' ? 'active' : ''}`} onClick={() => setSelectedRoleCategory('design')}>Design & BIM</button>
              <button className={`hud-filter-btn ${selectedRoleCategory === 'engineering' ? 'active' : ''}`} onClick={() => setSelectedRoleCategory('engineering')}>Engineering & IoT</button>
              <button className={`hud-filter-btn ${selectedRoleCategory === 'commercial' ? 'active' : ''}`} onClick={() => setSelectedRoleCategory('commercial')}>Cost & Commercial</button>
              <button className={`hud-filter-btn ${selectedRoleCategory === 'site' ? 'active' : ''}`} onClick={() => setSelectedRoleCategory('site')}>Site & Field</button>
              <button className={`hud-filter-btn ${selectedRoleCategory === 'oversight' ? 'active' : ''}`} onClick={() => setSelectedRoleCategory('oversight')}>Client & Oversight</button>
            </div>
          </div>

          <div className="hud-roles-grid">
            {filteredRoles.map((role, idx) => {
              const Icon = role.icon;
              return (
                <div key={idx} className="hud-role-card" onClick={() => navigate(role.path)}>
                  <div className="role-card-top">
                    <div className="role-icon-box"><Icon size={20} /></div>
                    <span className="role-cat-badge">{role.category}</span>
                  </div>
                  <h3>{role.title}</h3>
                  <p>{role.desc}</p>
                  <div className="role-card-footer">
                    <span className="demo-chip-small">Demo Setup</span>
                    <span className="launch-text">Launch Portal</span>
                    <ArrowUpRight size={16} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* EXTENDED SECTION: ROI CALCULATOR */}
      <section className="hud-extended-section" id="roi-calculator">
        <div className="hud-roi-container">
          <div className="hud-roi-left">
            <div className="hud-tag-pill">PROJECT VALUE OPTIMIZATION</div>
            <h2>Estimate Your AI Project Savings</h2>
            <p>Slide project capital expenditure to project immediate cost, schedule, and clash reductions.</p>
            
            <div className="hud-slider-box">
              <div className="slider-header">
                <span>Project CapEx</span>
                <span className="slider-highlight">₹ {projectBudget} Crores</span>
              </div>
              <input 
                type="range" 
                min="5" 
                max="500" 
                step="5" 
                value={projectBudget}
                onChange={(e) => setProjectBudget(Number(e.target.value))}
                className="hud-range-slider"
              />
              <div className="slider-scale">
                <span>₹5 Cr (Boutique)</span>
                <span>₹100 Cr (High-Rise)</span>
                <span>₹500 Cr (Mega Infra)</span>
              </div>
            </div>
          </div>

          <div className="hud-roi-right">
            <div className="roi-kpi-card highlight">
              <span className="kpi-label">Projected Cost Savings</span>
              <div className="kpi-val">₹ {calculatedSavingsCr} Cr</div>
              <span className="kpi-sub">8.6% material & rework reduction</span>
            </div>
            <div className="roi-kpi-card">
              <span className="kpi-label">Schedule Compression</span>
              <div className="kpi-val">{calculatedDaysSaved} Days</div>
              <span className="kpi-sub">Automated 4D critical path resolution</span>
            </div>
            <div className="roi-kpi-card">
              <span className="kpi-label">BIM Clashes Prevented</span>
              <div className="kpi-val">~{clashesAvoided} Clashes</div>
              <span className="kpi-sub">Zero piping or structural collisions</span>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
