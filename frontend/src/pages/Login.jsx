import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Login.css';
import { apiClient } from '../api/client';
import {
  Activity, ArrowRight, Box, Briefcase, Building2, Calculator, CheckSquare, Cpu, FileDigit, FileSignature, Hammer, HardHat, Layers, Lock, LogIn, Mail, Map, MonitorPlay, PenTool, Scale, ShieldAlert, ShieldCheck, ShoppingCart, Truck, UserCheck, Users, Wifi, Wrench, Zap
} from 'lucide-react';

export default function Login() {
  const [activeTab, setActiveTab] = useState('signin');
  const [selectedRole, setSelectedRole] = useState('/superadmin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSimulatedLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Use real auth endpoint
      const response = await apiClient.post('/auth/login', {
        email,
        password,
        role: selectedRole
      });
      localStorage.setItem('token', response.data.access_token);
      navigate(selectedRole);
    } catch (error) {
      console.error('Login failed', error);
      alert('Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoAccess = (route) => {
    navigate(route);
  };

  return (
    <div className="login-layout cinematic-bg">
      {/* LEFT PANEL */}
      <div className="login-left">
        <div className="dashboard-brand">
          <div className="dashboard-logo"><Building2 size={24} color="white" /></div>
          <div className="dashboard-brand-text">
            <h1>BuildSphere AI</h1>
            <span>Enterprise Ecosystem</span>
          </div>
        </div>

        <div className="login-hero-text">
          <h2>The future of<br/>construction intelligence.</h2>
          <p>Connecting every stakeholder from the BIM modeler in the trench to the executive board. One massive platform. Real-time insights. Complete operational control.</p>
        </div>

        <div className="login-stats">
          <div className="login-stat">
            <h3>15+</h3>
            <span>Dedicated Dashboards</span>
          </div>
          <div className="login-stat">
            <h3>500+</h3>
            <span>Specialized Modules</span>
          </div>
          <div className="login-stat">
            <h3>AI</h3>
            <span>Copilot Integration</span>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="login-right">
        <div className="login-form-container">
          
          <div className="login-tabs">
            <button className={`login-tab ${activeTab === 'signin' ? 'active' : ''}`} onClick={() => setActiveTab('signin')}>Sign In</button>
            <button className={`login-tab ${activeTab === 'signup' ? 'active' : ''}`} onClick={() => setActiveTab('signup')}>Create Account</button>
          </div>

          <form className="login-form" onSubmit={handleSimulatedLogin}>
            {activeTab === 'signup' && (
              <div className="login-input-group">
                <label>Full Name</label>
                <div className="login-input-wrapper">
                  <Users size={16} />
                  <input type="text" className="login-input" placeholder="Enter your full name" required value={fullName} onChange={(e) => setFullName(e.target.value)} />
                </div>
              </div>
            )}
            
            <div className="login-input-group">
              <label>Work Email</label>
              <div className="login-input-wrapper">
                <Mail size={16} />
                <input type="email" className="login-input" placeholder="name@company.com" required value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
            </div>

            <div className="login-input-group">
              <label>Password</label>
              <div className="login-input-wrapper">
                <Lock size={16} />
                <input type="password" className="login-input" placeholder="••••••••" required value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
            </div>

            {activeTab === 'signin' && (
              <div className="login-options">
                <label className="login-checkbox">
                  <input type="checkbox" /> Remember me
                </label>
                <a href="#" className="login-forgot">Forgot password?</a>
              </div>
            )}

            <div className="login-input-group">
              <label>Select Role</label>
              <div className="login-input-wrapper">
                <Briefcase size={16} />
                <select 
                  className="login-input" 
                  value={selectedRole} 
                  onChange={(e) => setSelectedRole(e.target.value)}
                  style={{ backgroundColor: 'transparent', color: 'inherit', border: 'none', width: '100%', outline: 'none', cursor: 'pointer', appearance: 'none' }}
                >
                  <optgroup label="Executive & Management" style={{ color: 'black' }}>
                    <option value="/superadmin">Super Admin</option>
                    <option value="/orgowner">Org Owner</option>
                    <option value="/projectmanager">Project Manager</option>
                    <option value="/planningengineer">Planning Engineer</option>
                  </optgroup>
                  <optgroup label="Engineering & Design" style={{ color: 'black' }}>
                    <option value="/architect">Architect</option>
                    <option value="/civilengineer">Civil Engineer</option>
                    <option value="/structuralengineer">Structural Engineer</option>
                    <option value="/mepengineer">MEP Engineer</option>
                    <option value="/bimmanager">BIM Manager</option>
                    <option value="/gisengineer">GIS Engineer</option>
                    <option value="/digitaltwinengineer">Digital Twin Engineer</option>
                    <option value="/iotengineer">IoT Engineer</option>
                  </optgroup>
                  <optgroup label="Commercial & Field Execution" style={{ color: 'black' }}>
                    <option value="/quantitysurveyor">Quantity Surveyor</option>
                    <option value="/costengineer">Cost Engineer</option>
                    <option value="/procurement">Procurement</option>
                    <option value="/siteengineer">Site Engineer</option>
                    <option value="/constructionmanager">Construction Manager</option>
                    <option value="/contractor">Contractor</option>
                    <option value="/subcontractor">Subcontractor</option>
                    <option value="/vendor">Vendor / Supplier</option>
                  </optgroup>
                  <optgroup label="External & Governance" style={{ color: 'black' }}>
                    <option value="/client">Client Portal</option>
                    <option value="/viewer">Exec Project Viewer</option>
                    <option value="/consultant">Consultant Portal</option>
                    <option value="/compliance">Govt Compliance</option>
                    <option value="/inspector">Inspector Portal</option>
                  </optgroup>
                </select>
              </div>
            </div>

            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? 'Processing...' : activeTab === 'signin' ? 'Sign In' : 'Create Account'} <ArrowRight size={16} />
            </button>
          </form>

          <div className="login-divider">or explore the ecosystem</div>

          {/* DEMO ACCESS HUB */}
          <div className="demo-hub glass-panel">
            <div className="dashboard-header">
              <h3><Zap size={16} color="#3b82f6"/> Demo Access Hub</h3>
              <p>Instantly access any specialized dashboard without a password.</p>
            </div>

            <div className="demo-category">
              <div className="demo-category-title">Executive & Management</div>
              <div className="demo-grid">
                <Link to="/superadmin" className="demo-role-btn">
                  <div className="demo-role-icon"><ShieldAlert size={14}/></div> Super Admin
                </Link>
                <Link to="/orgowner" className="demo-role-btn">
                  <div className="demo-role-icon"><Building2 size={14}/></div> Org Owner
                </Link>
                <Link to="/projectmanager" className="demo-role-btn">
                  <div className="demo-role-icon"><Briefcase size={14}/></div> Project Manager
                </Link>
                <Link to="/planningengineer" className="demo-role-btn">
                  <div className="demo-role-icon"><Activity size={14}/></div> Planning Engineer
                </Link>
              </div>
            </div>

            <div className="demo-category">
              <div className="demo-category-title">Engineering & Design</div>
              <div className="demo-grid">
                <Link to="/architect" className="demo-role-btn">
                  <div className="demo-role-icon"><PenTool size={14}/></div> Architect
                </Link>
                <Link to="/civilengineer" className="demo-role-btn">
                  <div className="demo-role-icon"><HardHat size={14}/></div> Civil Engineer
                </Link>
                <Link to="/structuralengineer" className="demo-role-btn">
                  <div className="demo-role-icon"><Layers size={14}/></div> Structural Engineer
                </Link>
                <Link to="/mepengineer" className="demo-role-btn">
                  <div className="demo-role-icon"><Zap size={14}/></div> MEP Engineer
                </Link>
                <Link to="/bimmanager" className="demo-role-btn">
                  <div className="demo-role-icon"><Box size={14}/></div> BIM Manager
                </Link>
                <Link to="/gisengineer" className="demo-role-btn">
                  <div className="demo-role-icon"><Map size={14}/></div> GIS Engineer
                </Link>
                <Link to="/digitaltwinengineer" className="demo-role-btn">
                  <div className="demo-role-icon"><Cpu size={14}/></div> Digital Twin Eng
                </Link>
                <Link to="/iotengineer" className="demo-role-btn">
                  <div className="demo-role-icon"><Wifi size={14}/></div> IoT Engineer
                </Link>
              </div>
            </div>
            
            <div className="demo-category">
              <div className="demo-category-title">Commercial & Field Execution</div>
              <div className="demo-grid">
                <Link to="/quantitysurveyor" className="demo-role-btn">
                  <div className="demo-role-icon"><Scale size={14}/></div> Quantity Surveyor
                </Link>
                <Link to="/costengineer" className="demo-role-btn">
                  <div className="demo-role-icon"><Calculator size={14}/></div> Cost Engineer
                </Link>
                <Link to="/procurement" className="demo-role-btn">
                  <div className="demo-role-icon"><ShoppingCart size={14}/></div> Procurement
                </Link>
                <Link to="/siteengineer" className="demo-role-btn">
                  <div className="demo-role-icon"><HardHat size={14}/></div> Site Engineer
                </Link>
                <Link to="/constructionmanager" className="demo-role-btn">
                  <div className="demo-role-icon"><Users size={14}/></div> Construction Mgr
                </Link>
                <Link to="/contractor" className="demo-role-btn">
                  <div className="demo-role-icon"><Hammer size={14}/></div> Contractor
                </Link>
                <Link to="/subcontractor" className="demo-role-btn">
                  <div className="demo-role-icon"><Wrench size={14}/></div> Subcontractor
                </Link>
                <Link to="/vendor" className="demo-role-btn">
                  <div className="demo-role-icon"><Truck size={14}/></div> Vendor
                </Link>
              </div>
            </div>

            <div className="demo-category">
              <div className="demo-category-title">External & Governance</div>
              <div className="demo-grid">
                <Link to="/client" className="demo-role-btn">
                  <div className="demo-role-icon"><UserCheck size={14}/></div> Client Portal
                </Link>
                <Link to="/viewer" className="demo-role-btn">
                  <div className="demo-role-icon"><MonitorPlay size={14}/></div> Exec Project Viewer
                </Link>
                <Link to="/consultant" className="demo-role-btn">
                  <div className="demo-role-icon"><FileSignature size={14}/></div> Consultant Portal
                </Link>
                <Link to="/compliance" className="demo-role-btn">
                  <div className="demo-role-icon"><ShieldCheck size={14}/></div> Govt Compliance
                </Link>
                <Link to="/inspector" className="demo-role-btn">
                  <div className="demo-role-icon"><CheckSquare size={14}/></div> Inspector Portal
                </Link>
              </div>
            </div>

          </div>
          
        </div>
      </div>
    </div>
  );
}

