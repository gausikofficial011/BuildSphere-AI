import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './SignIn.css';
import {
  ArrowLeft,
  Bot,
  Eye,
  EyeOff,
  Building2,
  Lock,
  User,
  Phone,
  Mail,
  Shield,
  Briefcase,
  Layers,
  Activity,
  HardHat,
  Zap,
  Box,
  Globe,
  Cpu,
  Wifi,
  Scale,
  Calculator,
  ShoppingCart,
  Users,
  Hammer,
  Wrench,
  Truck,
  UserCheck,
  MonitorPlay,
  FileSignature,
  ShieldCheck,
  CheckSquare,
  Sparkles,
  Bookmark,
  Grid,
  PenTool,
  Headphones
} from 'lucide-react';
import { connectGoogleDocsAccount } from '../api/googleDocs';

export default function SignIn() {
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState('email'); // 'email' or 'mobile'
  const [rememberMe, setRememberMe] = useState(true);
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const navigate = useNavigate();

  const handleSignIn = (e) => {
    e.preventDefault();
    localStorage.setItem('auth_user', emailInput || 'demo_user');
    navigate('/projectmanager');
  };

  return (
    <div className="cyber-signin-viewport">
      {/* Background Ambience & City Grid */}
      <div className="cyber-city-bg">
        <div className="cyber-grid-perspective"></div>
        <div className="drone-light-trail drone-1"></div>
        <div className="drone-light-trail drone-2"></div>
      </div>

      {/* Main HUD Frame */}
      <div className="signin-hud-outer-frame">
        {/* Glowing Corner Brackets */}
        <div className="hud-bracket top-left"></div>
        <div className="hud-bracket top-right"></div>
        <div className="hud-bracket bottom-left"></div>
        <div className="hud-bracket bottom-right"></div>

        {/* =========================================================================
           TOP FULL-WIDTH HUD HEADER
           ========================================================================= */}
        <header className="signin-top-header">
          <div className="signin-header-left">
            <button className="signin-grid-menu-btn" title="Navigation Grid" onClick={() => navigate('/')}>
              <Grid size={18} />
            </button>

            {/* Brand Logo */}
            <Link to="/" className="signin-brand-link">
              <div className="signin-brand-hexagon">
                <Building2 size={20} className="signin-brand-icon" />
              </div>
              <div className="signin-brand-text">
                <div className="signin-brand-title">
                  BuildSphere <span className="text-pink-glow">AI</span>
                </div>
                <span className="signin-brand-sub">Construction Intelligence Platform</span>
              </div>
            </Link>

            {/* Back to Home Button */}
            <Link to="/" className="signin-back-pill">
              <ArrowLeft size={14} />
              <span>Back to Home</span>
            </Link>
          </div>

          <div className="signin-header-right">
            <button className="signin-bookmarks-btn">
              <Bookmark size={14} />
              <span>All Bookmarks</span>
            </button>
          </div>
        </header>

        {/* =========================================================================
           MAIN 3-COLUMN STAGE
           ========================================================================= */}
        <main className="signin-main-grid">
          
          {/* -----------------------------------------------------------------------
             COLUMN 1: SIGN IN AUTH CARD (LEFT)
             ----------------------------------------------------------------------- */}
          <div className="signin-auth-panel">
            <div className="panel-corner-notch top-left"></div>
            <div className="panel-corner-notch top-right"></div>
            <div className="panel-corner-notch bottom-left"></div>
            <div className="panel-corner-notch bottom-right"></div>

            <div className="auth-title-block">
              <div className="auth-title-left">
                <h1 className="auth-main-heading">
                  WELCOME <br />
                  <span className="text-pink-glow">BACK!</span> 👋
                </h1>
              </div>
              <p className="auth-sub-instruction">
                Sign in to continue or explore via Client Demo Mode
              </p>
            </div>

            {/* CLIENT DEMO HIGHLIGHT BOX */}
            <div className="client-demo-access-card">
              <div className="demo-access-header">
                <div className="demo-header-title-row">
                  <Sparkles size={15} color="#38bdf8" />
                  <strong className="demo-access-title">CLIENT DEMO & DUMMY SANDBOX</strong>
                </div>
                <span className="demo-status-pill">Active Showcase</span>
              </div>
              <p className="demo-access-desc">
                This is a client demonstration setup pre-loaded with simulated enterprise datasets. Use 1-click access to explore all 20+ portals.
              </p>
              <button 
                type="button" 
                className="btn-instant-demo-access"
                onClick={() => {
                  setEmailInput('client.demo@buildsphere.ai');
                  setPasswordInput('DemoClient@2026');
                  localStorage.setItem('auth_user', 'client.demo@buildsphere.ai');
                  localStorage.setItem('auth_role', 'Client Evaluator');
                  setTimeout(() => navigate('/projectmanager'), 250);
                }}
              >
                <Zap size={14} />
                <span>1-Click Client Demo Login (Auto-Fill & Enter)</span>
              </button>
              <div className="demo-creds-preview">
                <span>Demo Account: <strong>client.demo@buildsphere.ai</strong> • Password: <strong>DemoClient@2026</strong></span>
              </div>
            </div>

            {/* Tab Switcher */}
            <div className="auth-tab-bar">
              <button 
                type="button"
                className={`auth-tab-item ${activeTab === 'email' ? 'active' : ''}`}
                onClick={() => setActiveTab('email')}
              >
                <span>Email / ID</span>
                {activeTab === 'email' && <div className="tab-indicator-pink"></div>}
              </button>
              <button 
                type="button"
                className={`auth-tab-item ${activeTab === 'mobile' ? 'active' : ''}`}
                onClick={() => setActiveTab('mobile')}
              >
                <span>Mobile Number</span>
                {activeTab === 'mobile' && <div className="tab-indicator-pink"></div>}
              </button>
            </div>

            {/* Form Fields */}
            <form className="auth-form-fields" onSubmit={handleSignIn}>
              <div className="cyber-field-box">
                <div className="field-icon-wrap">
                  {activeTab === 'email' ? <User size={15} /> : <Phone size={15} />}
                </div>
                <input 
                  type={activeTab === 'email' ? 'text' : 'tel'} 
                  placeholder={activeTab === 'email' ? 'Email / Registration Number / Employee ID' : 'Mobile Number'}
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="cyber-input-element"
                  required
                />
              </div>

              <div className="cyber-field-box">
                <div className="field-icon-wrap">
                  <Lock size={15} />
                </div>
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  placeholder="Password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="cyber-input-element"
                  required
                />
                <button 
                  type="button" 
                  className="field-eye-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>

              {/* Options Row */}
              <div className="auth-remember-row">
                <label className="cyber-check-container">
                  <input 
                    type="checkbox" 
                    checked={rememberMe} 
                    onChange={(e) => setRememberMe(e.target.checked)} 
                  />
                  <span className="check-box-custom"></span>
                  <span className="check-text">Remember Me</span>
                </label>
                <a href="#forgot" className="link-forgot-pink" onClick={(e) => { e.preventDefault(); alert("Password reset link sent to your registered email."); }}>
                  Forgot Password?
                </a>
              </div>

              {/* Sign In Button */}
              <button type="submit" className="btn-cyber-submit-pink">
                <span>SIGN IN</span>
                <span className="submit-arrow">→</span>
              </button>
            </form>

            {/* Divider */}
            <div className="auth-separator">
              <div className="separator-line"></div>
              <span className="separator-badge">OR</span>
              <div className="separator-line"></div>
            </div>

            {/* Social / SSO Grid */}
            <div className="auth-sso-grid">
              <button 
                type="button" 
                className="btn-sso-item"
                onClick={(e) => { 
                  e.preventDefault(); 
                  localStorage.setItem('auth_user', 'gausikgps@gmail.com');
                  localStorage.setItem('auth_provider', 'google');
                  navigate('/projectmanager'); 
                }}
              >
                <img src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" alt="Google" width="16" height="16" />
                <span>Continue with Google</span>
              </button>

              <button 
                type="button" 
                className="btn-sso-item"
                onClick={(e) => { e.preventDefault(); navigate('/projectmanager'); }}
              >
                <img src="https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg" alt="Microsoft" width="16" height="16" />
                <span>Continue with Microsoft</span>
              </button>

              <button 
                type="button" 
                className="btn-sso-item wide"
                onClick={(e) => { e.preventDefault(); navigate('/superadmin'); }}
              >
                <img src="https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg" alt="GitHub" width="16" height="16" className="github-icon-white" />
                <div className="sso-desc-group">
                  <span>Continue with GitHub</span>
                  <span className="sso-subtext">Institution SSO Login</span>
                </div>
              </button>
            </div>

            {/* Card Footer */}
            <div className="auth-panel-footer">
              <span>Don't have an account?</span>{' '}
              <Link to="/signup" className="link-create-cyan">Create Account</Link>
            </div>
          </div>

          {/* -----------------------------------------------------------------------
             COLUMN 2: AI ASSISTANT ROBOT (CENTER)
             ----------------------------------------------------------------------- */}
          <div className="signin-assistant-panel">
            <div className="panel-corner-notch top-left"></div>
            <div className="panel-corner-notch top-right"></div>
            <div className="panel-corner-notch bottom-left"></div>
            <div className="panel-corner-notch bottom-right"></div>

            {/* Mascot Top Block */}
            <div className="assistant-mascot-head">
              <div className="mascot-outer-ring">
                <div className="robot-visor-head">
                  <div className="robot-screen">
                    <span className="visor-eye left"></span>
                    <span className="visor-eye right"></span>
                  </div>
                  <div className="robot-ear-pink left"></div>
                  <div className="robot-ear-pink right"></div>
                </div>
              </div>
              <div className="mascot-greeting">
                <div className="greeting-hello">Hello!</div>
                <div className="greeting-identity">
                  I'm <span className="text-cyan-glow">BuildSphere AI</span> Assistant.
                </div>
              </div>
            </div>

            {/* 5 Feature Items */}
            <div className="assistant-feature-stack">
              <div className="feature-pill-row">
                <div className="pill-icon-box purple"><PenTool size={14} /></div>
                <div className="pill-text-group">
                  <strong>AI Design Assistant</strong>
                  <span>Plan & visualize in seconds</span>
                </div>
              </div>

              <div className="feature-pill-row">
                <div className="pill-icon-box orange"><Calculator size={14} /></div>
                <div className="pill-text-group">
                  <strong>Smart Estimation</strong>
                  <span>Accurate cost & BOQ</span>
                </div>
              </div>

              <div className="feature-pill-row">
                <div className="pill-icon-box cyan"><Activity size={14} /></div>
                <div className="pill-text-group">
                  <strong>Real-time Analytics</strong>
                  <span>Data-driven insights</span>
                </div>
              </div>

              <div className="feature-pill-row">
                <div className="pill-icon-box teal"><ShieldCheck size={14} /></div>
                <div className="pill-text-group">
                  <strong>Secure & Reliable</strong>
                  <span>Enterprise grade security</span>
                </div>
              </div>

              <div className="feature-pill-row">
                <div className="pill-icon-box blue"><Headphones size={14} /></div>
                <div className="pill-text-group">
                  <strong>24/7 Support</strong>
                  <span>We are here for you</span>
                </div>
              </div>
            </div>

            {/* Dots */}
            <div className="assistant-dots-bar">
              <span className="dot-cyber active"></span>
              <span className="dot-cyber"></span>
              <span className="dot-cyber"></span>
              <span className="dot-cyber"></span>
            </div>
          </div>

          {/* -----------------------------------------------------------------------
             COLUMN 3: ROLE DASHBOARD QUICK LAUNCH PORTALS MATRIX (RIGHT)
             ----------------------------------------------------------------------- */}
          <div className="signin-roles-panel">
            
            {/* Demo Header Notice */}
            <div className="signin-demo-roles-banner">
              <Sparkles size={13} color="#38bdf8" />
              <span><strong>1-CLICK CLIENT DEMO PORTALS:</strong> Click any stakeholder card to inspect the dummy client environment (No credentials needed).</span>
            </div>

            {/* Top Billboard & 4 Quick Tiles */}
            <div className="roles-top-row">
              <div className="billboard-neon-box">
                <Building2 size={16} className="billboard-icon" />
                <div className="billboard-title-text">
                  <span>BUILDSPHERE</span>
                  <span>AI</span>
                </div>
              </div>

              <div className="top-tiles-flex">
                <button className="quick-portal-tile" onClick={() => navigate('/bimmanager')}>
                  <Box size={14} className="tile-icon-purple" />
                  <span>BIM Manager</span>
                </button>
                <button className="quick-portal-tile" onClick={() => navigate('/gisengineer')}>
                  <Globe size={14} className="tile-icon-purple" />
                  <span>GIS Engineer</span>
                </button>
                <button className="quick-portal-tile" onClick={() => navigate('/digitaltwinengineer')}>
                  <Cpu size={14} className="tile-icon-cyan" />
                  <span>Digital Twin Eng</span>
                </button>
                <button className="quick-portal-tile" onClick={() => navigate('/iotengineer')}>
                  <Wifi size={14} className="tile-icon-cyan" />
                  <span>IoT Engineer</span>
                </button>
              </div>
            </div>

            {/* 4 Category Matrix Grid */}
            <div className="roles-matrix-grid">
              
              {/* Category 1: Executive & Management (Pink) */}
              <div className="matrix-category-box border-pink">
                <div className="category-title-pink">
                  EXECUTIVE & MANAGEMENT
                </div>
                <div className="tiles-sub-grid">
                  <button className="role-action-tile hover-pink" onClick={() => navigate('/superadmin')}>
                    <Shield size={14} className="icon-pink" />
                    <span className="tile-label">Super Admin</span>
                  </button>
                  <button className="role-action-tile hover-pink" onClick={() => navigate('/orgowner')}>
                    <Building2 size={14} className="icon-pink" />
                    <span className="tile-label">Org Owner</span>
                  </button>
                  <button className="role-action-tile hover-pink" onClick={() => navigate('/projectmanager')}>
                    <Briefcase size={14} className="icon-pink" />
                    <span className="tile-label">Project Manager</span>
                  </button>
                  <button className="role-action-tile hover-pink" onClick={() => navigate('/planningengineer')}>
                    <Activity size={14} className="icon-pink" />
                    <span className="tile-label">Planning Engineer</span>
                  </button>
                </div>
              </div>

              {/* Category 2: Engineering & Design (Cyan) */}
              <div className="matrix-category-box border-cyan">
                <div className="category-title-cyan">
                  ENGINEERING & DESIGN
                </div>
                <div className="tiles-sub-grid">
                  <button className="role-action-tile hover-cyan" onClick={() => navigate('/architect')}>
                    <PenTool size={14} className="icon-cyan" />
                    <span className="tile-label">Architect</span>
                  </button>
                  <button className="role-action-tile hover-cyan" onClick={() => navigate('/civilengineer')}>
                    <HardHat size={14} className="icon-cyan" />
                    <span className="tile-label">Civil Engineer</span>
                  </button>
                  <button className="role-action-tile hover-cyan" onClick={() => navigate('/structuralengineer')}>
                    <Layers size={14} className="icon-cyan" />
                    <span className="tile-label">Structural Engineer</span>
                  </button>
                  <button className="role-action-tile hover-cyan" onClick={() => navigate('/mepengineer')}>
                    <Zap size={14} className="icon-cyan" />
                    <span className="tile-label">MEP Engineer</span>
                  </button>
                  <button className="role-action-tile hover-cyan" onClick={() => navigate('/bimmanager')}>
                    <Box size={14} className="icon-cyan" />
                    <span className="tile-label">BIM Manager</span>
                  </button>
                  <button className="role-action-tile hover-cyan" onClick={() => navigate('/gisengineer')}>
                    <Globe size={14} className="icon-cyan" />
                    <span className="tile-label">GIS Engineer</span>
                  </button>
                  <button className="role-action-tile hover-cyan" onClick={() => navigate('/digitaltwinengineer')}>
                    <Cpu size={14} className="icon-cyan" />
                    <span className="tile-label">Digital Twin Eng</span>
                  </button>
                  <button className="role-action-tile hover-cyan" onClick={() => navigate('/iotengineer')}>
                    <Wifi size={14} className="icon-cyan" />
                    <span className="tile-label">IoT Engineer</span>
                  </button>
                </div>
              </div>

              {/* Category 3: Commercial & Field Execution (Pink) */}
              <div className="matrix-category-box border-pink">
                <div className="category-title-pink">
                  COMMERCIAL & FIELD EXECUTION
                </div>
                <div className="tiles-sub-grid">
                  <button className="role-action-tile hover-pink" onClick={() => navigate('/quantitysurveyor')}>
                    <Scale size={14} className="icon-pink" />
                    <span className="tile-label">Quantity Surveyor</span>
                  </button>
                  <button className="role-action-tile hover-pink" onClick={() => navigate('/costengineer')}>
                    <Calculator size={14} className="icon-pink" />
                    <span className="tile-label">Cost Engineer</span>
                  </button>
                  <button className="role-action-tile hover-pink" onClick={() => navigate('/procurement')}>
                    <ShoppingCart size={14} className="icon-pink" />
                    <span className="tile-label">Procurement</span>
                  </button>
                  <button className="role-action-tile hover-pink" onClick={() => navigate('/siteengineer')}>
                    <HardHat size={14} className="icon-pink" />
                    <span className="tile-label">Site Engineer</span>
                  </button>
                  <button className="role-action-tile hover-pink" onClick={() => navigate('/constructionmanager')}>
                    <Users size={14} className="icon-pink" />
                    <span className="tile-label">Construction Mgr</span>
                  </button>
                  <button className="role-action-tile hover-pink" onClick={() => navigate('/contractor')}>
                    <Hammer size={14} className="icon-pink" />
                    <span className="tile-label">Contractor</span>
                  </button>
                  <button className="role-action-tile hover-pink" onClick={() => navigate('/subcontractor')}>
                    <Wrench size={14} className="icon-pink" />
                    <span className="tile-label">Subcontractor</span>
                  </button>
                  <button className="role-action-tile hover-pink" onClick={() => navigate('/vendor')}>
                    <Truck size={14} className="icon-pink" />
                    <span className="tile-label">Vendor</span>
                  </button>
                  <button className="role-action-tile hover-pink" onClick={() => navigate('/technician')}>
                    <Wrench size={14} className="icon-pink" />
                    <span className="tile-label">Technician</span>
                  </button>
                </div>
              </div>

              {/* Category 4: External & Governance (Cyan) */}
              <div className="matrix-category-box border-cyan">
                <div className="category-title-cyan">
                  EXTERNAL & GOVERNANCE
                </div>
                <div className="tiles-sub-grid">
                  <button className="role-action-tile hover-cyan" onClick={() => navigate('/client')}>
                    <UserCheck size={14} className="icon-cyan" />
                    <span className="tile-label">Client Portal</span>
                  </button>
                  <button className="role-action-tile hover-cyan" onClick={() => navigate('/viewer')}>
                    <MonitorPlay size={14} className="icon-cyan" />
                    <span className="tile-label">Exec Project Viewer</span>
                  </button>
                  <button className="role-action-tile hover-cyan" onClick={() => navigate('/consultant')}>
                    <FileSignature size={14} className="icon-cyan" />
                    <span className="tile-label">Consultant Portal</span>
                  </button>
                  <button className="role-action-tile hover-cyan" onClick={() => navigate('/compliance')}>
                    <ShieldCheck size={14} className="icon-cyan" />
                    <span className="tile-label">Govt Compliance</span>
                  </button>
                  <button className="role-action-tile hover-cyan" onClick={() => navigate('/inspector')}>
                    <CheckSquare size={14} className="icon-cyan" />
                    <span className="tile-label">Inspector Portal</span>
                  </button>
                </div>
              </div>

            </div>

          </div>

        </main>

        {/* Floating 3D Cube Launcher */}
        <button 
          className="signin-floating-cube-btn" 
          onClick={() => navigate('/os')}
          title="Launch Spatial 3D OS"
        >
          <Box size={22} className="cube-icon-glow" />
        </button>

      </div>
    </div>
  );
}
