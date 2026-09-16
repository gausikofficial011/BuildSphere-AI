import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './SignUp.css';
import {
  ArrowLeft,
  Building2,
  Camera,
  Check,
  Eye,
  EyeOff,
  User,
  Mail,
  Phone,
  Calendar,
  Lock,
  Globe,
  FileText,
  Briefcase,
  Layers,
  HardHat,
  PenTool,
  Scale,
  Calculator,
  Box,
  Cpu,
  Wifi,
  Users,
  Shield,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  UploadCloud,
  Zap,
  Hammer,
  Truck,
  UserCheck
} from 'lucide-react';

const STEPS = [
  { id: 1, title: 'Personal Information', desc: 'Identity details and profile setup' },
  { id: 2, title: 'Organization Details', desc: 'Company, studio or institution info' },
  { id: 3, title: 'Account & Security', desc: 'Credentials and master passkey' },
  { id: 4, title: 'Role Selection', desc: 'Pick your primary AEC domain portal' },
  { id: 5, title: 'Verification', desc: '2FA authentication and activation' }
];

const ROLES_LIST = [
  { id: 'Architect', name: 'Architect', icon: PenTool },
  { id: 'Structural Engineer', name: 'Structural Engineer', icon: Layers },
  { id: 'Civil Engineer', name: 'Civil Engineer', icon: HardHat },
  { id: 'MEP Engineer', name: 'MEP Engineer', icon: Zap },
  { id: 'BIM Manager', name: 'BIM Manager', icon: Box },
  { id: 'Project Manager', name: 'Project Manager', icon: Briefcase },
  { id: 'Cost Engineer', name: 'Cost Engineer', icon: Calculator },
  { id: 'Quantity Surveyor', name: 'Quantity Surveyor (QS)', icon: Scale },
  { id: 'Planning Engineer', name: 'Planning Engineer', icon: Calendar },
  { id: 'Procurement Manager', name: 'Procurement Manager', icon: Briefcase },
  { id: 'Site Engineer', name: 'Site Engineer', icon: HardHat },
  { id: 'Construction Manager', name: 'Construction Manager', icon: Users },
  { id: 'Contractor', name: 'Contractor', icon: Hammer },
  { id: 'Subcontractor', name: 'Subcontractor', icon: Hammer },
  { id: 'Digital Twin Engineer', name: 'Digital Twin Engineer', icon: Cpu },
  { id: 'IoT Engineer', name: 'IoT Engineer', icon: Wifi },
  { id: 'GIS Engineer', name: 'GIS Engineer', icon: Globe },
  { id: 'QA/QC Inspector', name: 'QA/QC Inspector', icon: ShieldCheck },
  { id: 'Client / Owner', name: 'Client / Owner', icon: UserCheck },
  { id: 'Super Admin', name: 'Super Admin', icon: Shield }
];

export default function SignUp() {
  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState('Architect');
  const [profilePhoto, setProfilePhoto] = useState(null);
  
  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    collegeEmail: '',
    personalEmail: '',
    phone: '',
    dob: '',
    gender: 'Male',
    orgName: '',
    orgType: 'Architecture & Design Studio',
    companySize: '10-50 Employees',
    website: '',
    gstNumber: '',
    username: '',
    password: '',
    confirmPassword: '',
    securityQuestion: 'What was the name of your first building project?',
    recoveryEmail: '',
    agreedTerms: true
  });

  const navigate = useNavigate();

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfilePhoto(URL.createObjectURL(file));
    }
  };

  const getPasswordStrength = () => {
    const p = formData.password;
    if (!p) return 0;
    let score = 0;
    if (p.length >= 6) score += 1;
    if (/[A-Z]/.test(p)) score += 1;
    if (/[0-9]/.test(p)) score += 1;
    if (/[^A-Za-z0-9]/.test(p)) score += 1;
    return score;
  };

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleFinish = (e) => {
    e.preventDefault();
    localStorage.setItem('auth_user', formData.fullName || formData.username || 'New Engineer');
    localStorage.setItem('user_role', selectedRole);
    navigate('/signin');
  };

  const strength = getPasswordStrength();

  return (
    <div className="cyber-signup-viewport">
      {/* Background Ambient Lighting */}
      <div className="cyber-city-bg">
        <div className="cyber-grid-perspective"></div>
      </div>

      {/* Main HUD Frame */}
      <div className="signup-hud-outer-frame">
        {/* Glowing Corner Brackets */}
        <div className="hud-bracket top-left"></div>
        <div className="hud-bracket top-right"></div>
        <div className="hud-bracket bottom-left"></div>
        <div className="hud-bracket bottom-right"></div>

        {/* Top Header */}
        <header className="signup-top-header">
          <div className="signup-header-left">
            <Link to="/" className="signup-brand-link">
              <div className="signup-brand-hexagon">
                <Building2 size={20} />
              </div>
              <div>
                <div className="signup-brand-title">
                  BuildSphere <span className="text-pink-glow">AI</span>
                </div>
                <span className="signup-brand-sub">Next-Gen AEC Operating System</span>
              </div>
            </Link>

            <Link to="/" className="signup-back-pill">
              <ArrowLeft size={14} />
              <span>Back to Home</span>
            </Link>
          </div>

          <div className="signup-header-right">
            <span className="signin-prompt-text">Already registered?</span>
            <Link to="/signin" className="signin-switch-btn">
              <span>Sign In</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </header>

        {/* Main 2-Column Signup Grid */}
        <main className="signup-main-stage">
          
          {/* Left Column: Progress Stepper & Badges */}
          <aside className="signup-stepper-panel">
            <div className="stepper-header-block">
              <h2>CREATE YOUR ACCOUNT</h2>
              <p>Initialize your identity to collaborate across 3D BIM, Digital Twins, and AI Copilots.</p>
            </div>

            {/* Stepper List */}
            <div className="cyber-steps-list">
              {STEPS.map((step) => {
                const isActive = currentStep === step.id;
                const isCompleted = currentStep > step.id;
                return (
                  <div
                    key={step.id}
                    className={`cyber-step-item ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}
                    onClick={() => {
                      // Allow clicking previous steps
                      if (step.id <= currentStep) setCurrentStep(step.id);
                    }}
                  >
                    <div className="step-badge-circle">
                      {isCompleted ? <Check size={16} /> : step.id}
                    </div>
                    <div className="step-info-text">
                      <h4>{step.title}</h4>
                      <p>{step.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Security Badges */}
            <div className="stepper-footer-features">
              <div className="feature-tag-row">
                <span className="feature-tag-icon">🧠</span>
                <div className="feature-tag-text">
                  <h5>AI Engineering Engine</h5>
                  <p>IS 456, NBC 2024 & FIDIC calibrated</p>
                </div>
              </div>
              <div className="feature-tag-row">
                <span className="feature-tag-icon">🔒</span>
                <div className="feature-tag-text">
                  <h5>Enterprise Grade Security</h5>
                  <p>256-Bit TLS encryption & RBAC policies</p>
                </div>
              </div>
            </div>
          </aside>

          {/* Right Column: Step Form Content */}
          <section className="signup-card-container">
            <div>
              {/* Step Card Header */}
              <div className="step-card-header">
                <div className="step-counter-pill">
                  STEP 0{currentStep} OF 05
                </div>
                <h3>{STEPS[currentStep - 1].title}</h3>
                <p>{STEPS[currentStep - 1].desc}</p>
              </div>

              {/* Step Form Body */}
              <div className="step-body-content">
                
                {/* ---------------- STEP 1: PERSONAL INFO ---------------- */}
                {currentStep === 1 && (
                  <div className="cyber-form-grid">
                    <div className="grid-col-full">
                      <div className="photo-uploader-box">
                        <div className="photo-preview-circle">
                          {profilePhoto ? (
                            <img src={profilePhoto} alt="Profile" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                          ) : (
                            <Camera size={26} />
                          )}
                        </div>
                        <div className="photo-upload-meta">
                          <h5>Profile Photograph</h5>
                          <p>Upload a clear professional photo (JPG, PNG up to 5MB)</p>
                          <label className="btn-upload-action">
                            <UploadCloud size={13} style={{ display: 'inline', marginRight: '4px' }} />
                            Choose Image
                            <input type="file" accept="image/*" onChange={handlePhotoUpload} style={{ display: 'none' }} />
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="cyber-input-group grid-col-full">
                      <label><User size={14} /> Full Name</label>
                      <div className="cyber-field-wrapper">
                        <input
                          type="text"
                          placeholder="e.g. John Doe, Lead Structural Architect"
                          className="cyber-real-input"
                          value={formData.fullName}
                          onChange={(e) => handleInputChange('fullName', e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="cyber-input-group">
                      <label><Mail size={14} /> College / Work Email</label>
                      <div className="cyber-field-wrapper">
                        <input
                          type="email"
                          placeholder="name@institution.edu / name@firm.com"
                          className="cyber-real-input"
                          value={formData.collegeEmail}
                          onChange={(e) => handleInputChange('collegeEmail', e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="cyber-input-group">
                      <label><Mail size={14} /> Personal Email</label>
                      <div className="cyber-field-wrapper">
                        <input
                          type="email"
                          placeholder="personal@gmail.com"
                          className="cyber-real-input"
                          value={formData.personalEmail}
                          onChange={(e) => handleInputChange('personalEmail', e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="cyber-input-group">
                      <label><Phone size={14} /> Phone Number</label>
                      <div className="cyber-field-wrapper">
                        <input
                          type="tel"
                          placeholder="+91 98765 43210"
                          className="cyber-real-input"
                          value={formData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="cyber-input-group">
                      <label><Calendar size={14} /> Date of Birth</label>
                      <div className="cyber-field-wrapper">
                        <input
                          type="date"
                          className="cyber-real-input"
                          value={formData.dob}
                          onChange={(e) => handleInputChange('dob', e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="cyber-input-group grid-col-full">
                      <label><Users size={14} /> Gender</label>
                      <div className="cyber-field-wrapper">
                        <select
                          className="cyber-select-input"
                          value={formData.gender}
                          onChange={(e) => handleInputChange('gender', e.target.value)}
                        >
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Non-Binary">Non-Binary</option>
                          <option value="Prefer not to say">Prefer not to say</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* ---------------- STEP 2: ORGANIZATION DETAILS ---------------- */}
                {currentStep === 2 && (
                  <div className="cyber-form-grid">
                    <div className="cyber-input-group grid-col-full">
                      <label><Building2 size={14} /> Organization / College / Firm Name</label>
                      <div className="cyber-field-wrapper">
                        <input
                          type="text"
                          placeholder="e.g. BuildSphere Engineering Consortium or College of Engineering"
                          className="cyber-real-input"
                          value={formData.orgName}
                          onChange={(e) => handleInputChange('orgName', e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="cyber-input-group">
                      <label><Briefcase size={14} /> Organization Type</label>
                      <div className="cyber-field-wrapper">
                        <select
                          className="cyber-select-input"
                          value={formData.orgType}
                          onChange={(e) => handleInputChange('orgType', e.target.value)}
                        >
                          <option value="Architecture & Design Studio">Architecture &amp; Design Studio</option>
                          <option value="General Civil Contractor">General Civil Contractor</option>
                          <option value="Structural Engineering Consultancy">Structural Engineering Consultancy</option>
                          <option value="MEP & HVAC Specialist">MEP &amp; HVAC Specialist</option>
                          <option value="Academic & Research Institution">Academic &amp; Research Institution</option>
                          <option value="Government & Municipal Body">Government &amp; Municipal Body</option>
                          <option value="Real Estate Developer / Client">Real Estate Developer / Client</option>
                        </select>
                      </div>
                    </div>

                    <div className="cyber-input-group">
                      <label><Users size={14} /> Company / Team Size</label>
                      <div className="cyber-field-wrapper">
                        <select
                          className="cyber-select-input"
                          value={formData.companySize}
                          onChange={(e) => handleInputChange('companySize', e.target.value)}
                        >
                          <option value="1-10 Employees">1-10 Employees (Boutique / Student)</option>
                          <option value="10-50 Employees">10-50 Employees (Mid-Size)</option>
                          <option value="50-200 Employees">50-200 Employees (Growing Firm)</option>
                          <option value="200-1000 Employees">200-1000 Employees (Enterprise)</option>
                          <option value="1000+ Enterprise">1000+ Enterprise (Global Infrastructure)</option>
                        </select>
                      </div>
                    </div>

                    <div className="cyber-input-group">
                      <label><Globe size={14} /> Website / Portfolio URL (Optional)</label>
                      <div className="cyber-field-wrapper">
                        <input
                          type="url"
                          placeholder="https://www.buildsphere.ai"
                          className="cyber-real-input"
                          value={formData.website}
                          onChange={(e) => handleInputChange('website', e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="cyber-input-group">
                      <label><FileText size={14} /> GST / Registration Number (Optional)</label>
                      <div className="cyber-field-wrapper">
                        <input
                          type="text"
                          placeholder="22AAAAA0000A1Z5"
                          className="cyber-real-input"
                          value={formData.gstNumber}
                          onChange={(e) => handleInputChange('gstNumber', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* ---------------- STEP 3: ACCOUNT & SECURITY ---------------- */}
                {currentStep === 3 && (
                  <div className="cyber-form-grid">
                    <div className="cyber-input-group grid-col-full">
                      <label><User size={14} /> Username / Handle</label>
                      <div className="cyber-field-wrapper">
                        <input
                          type="text"
                          placeholder="e.g. alex_chief_architect"
                          className="cyber-real-input"
                          value={formData.username}
                          onChange={(e) => handleInputChange('username', e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="cyber-input-group grid-col-full">
                      <label><Lock size={14} /> Master Password</label>
                      <div className="cyber-field-wrapper">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Create a strong password (min. 8 characters)"
                          className="cyber-real-input"
                          value={formData.password}
                          onChange={(e) => handleInputChange('password', e.target.value)}
                        />
                        <button
                          type="button"
                          className="field-icon-btn"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>

                      {/* Password Strength Indicator */}
                      <div className="password-meter-wrap">
                        <div className="meter-bars">
                          <div className={`meter-bar ${strength >= 1 ? (strength === 1 ? 'active-weak' : strength === 2 ? 'active-fair' : strength === 3 ? 'active-good' : 'active-strong') : ''}`}></div>
                          <div className={`meter-bar ${strength >= 2 ? (strength === 2 ? 'active-fair' : strength === 3 ? 'active-good' : 'active-strong') : ''}`}></div>
                          <div className={`meter-bar ${strength >= 3 ? (strength === 3 ? 'active-good' : 'active-strong') : ''}`}></div>
                          <div className={`meter-bar ${strength >= 4 ? 'active-strong' : ''}`}></div>
                        </div>
                        <div className="meter-label-row">
                          <span>Strength: {strength === 0 ? 'None' : strength === 1 ? 'Weak' : strength === 2 ? 'Fair' : strength === 3 ? 'Good' : 'Strong & Resilient'}</span>
                          <span>Must contain uppercase, number &amp; symbol</span>
                        </div>
                      </div>
                    </div>

                    <div className="cyber-input-group grid-col-full">
                      <label><Lock size={14} /> Confirm Password</label>
                      <div className="cyber-field-wrapper">
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          placeholder="Re-enter your master password"
                          className="cyber-real-input"
                          value={formData.confirmPassword}
                          onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                        />
                        <button
                          type="button"
                          className="field-icon-btn"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                      {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                        <span style={{ fontSize: '0.7rem', color: '#f43f5e', marginTop: '3px' }}>Passwords do not match</span>
                      )}
                    </div>

                    <div className="cyber-input-group">
                      <label><Shield size={14} /> Security Question</label>
                      <div className="cyber-field-wrapper">
                        <select
                          className="cyber-select-input"
                          value={formData.securityQuestion}
                          onChange={(e) => handleInputChange('securityQuestion', e.target.value)}
                        >
                          <option value="What was the name of your first building project?">What was the name of your first building project?</option>
                          <option value="What city did you attend engineering college in?">What city did you attend engineering college in?</option>
                          <option value="What is your favorite architectural monument?">What is your favorite architectural monument?</option>
                        </select>
                      </div>
                    </div>

                    <div className="cyber-input-group">
                      <label><Mail size={14} /> Recovery Email</label>
                      <div className="cyber-field-wrapper">
                        <input
                          type="email"
                          placeholder="backup@email.com"
                          className="cyber-real-input"
                          value={formData.recoveryEmail}
                          onChange={(e) => handleInputChange('recoveryEmail', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* ---------------- STEP 4: ROLE SELECTION MATRIX ---------------- */}
                {currentStep === 4 && (
                  <div>
                    <p style={{ fontSize: '0.78rem', color: '#cbd5e1', marginBottom: '0.85rem' }}>
                      Select the primary workspace suited to your discipline. You can switch portals anytime from your navigation hub.
                    </p>

                    <div className="roles-selector-grid">
                      {ROLES_LIST.map((role) => {
                        const Icon = role.icon;
                        const isSelected = selectedRole === role.id;
                        return (
                          <div
                            key={role.id}
                            className={`role-pick-card ${isSelected ? 'selected' : ''}`}
                            onClick={() => setSelectedRole(role.id)}
                          >
                            <div className="role-pick-icon">
                              <Icon size={16} />
                            </div>
                            <span className="role-pick-name">{role.name}</span>
                            {isSelected && (
                              <div className="role-check-indicator">
                                <Check size={11} />
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* ---------------- STEP 5: VERIFICATION ---------------- */}
                {currentStep === 5 && (
                  <div className="verification-container">
                    <div className="verify-box-card">
                      <div className="verify-box-header">
                        <h4><Mail size={16} color="#22d3ee" /> Email 2FA Code</h4>
                        <span>Code sent to registered email</span>
                      </div>
                      <div className="otp-pin-inputs">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                          <input
                            key={i}
                            type="text"
                            maxLength={1}
                            className="otp-pin-cell"
                            defaultValue={i === 1 ? '4' : i === 2 ? '8' : ''}
                            placeholder="•"
                          />
                        ))}
                      </div>
                    </div>

                    <div className="verify-box-card">
                      <div className="verify-box-header">
                        <h4><Phone size={16} color="#f43f5e" /> Mobile SMS OTP</h4>
                        <span>Valid for 04:59 mins</span>
                      </div>
                      <div className="otp-pin-inputs">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                          <input
                            key={i}
                            type="text"
                            maxLength={1}
                            className="otp-pin-cell"
                            defaultValue={i === 1 ? '9' : i === 2 ? '1' : ''}
                            placeholder="•"
                          />
                        ))}
                      </div>
                    </div>

                    <label className="terms-checkbox-wrap">
                      <input
                        type="checkbox"
                        checked={formData.agreedTerms}
                        onChange={(e) => handleInputChange('agreedTerms', e.target.checked)}
                      />
                      <span className="terms-text">
                        I confirm adherence to the <a href="#terms">BuildSphere AI Governance Policy</a>, statutory building data security standards, and AEC cloud telemetry agreements.
                      </span>
                    </label>
                  </div>
                )}

              </div>
            </div>

            {/* Bottom Step Actions */}
            <div className="step-nav-actions">
              {currentStep > 1 ? (
                <button type="button" className="btn-cyber-back" onClick={handleBack}>
                  <ArrowLeft size={16} />
                  <span>Previous Step</span>
                </button>
              ) : (
                <Link to="/signin" className="btn-cyber-back" style={{ textDecoration: 'none' }}>
                  <ArrowLeft size={16} />
                  <span>Cancel to Sign In</span>
                </Link>
              )}

              {currentStep < 5 ? (
                <button type="button" className="btn-cyber-next" onClick={handleNext}>
                  <span>Continue Step 0{currentStep + 1}</span>
                  <ArrowRight size={16} />
                </button>
              ) : (
                <button type="button" className="btn-cyber-finish" onClick={handleFinish}>
                  <Sparkles size={16} />
                  <span>Launch {selectedRole} Portal</span>
                </button>
              )}
            </div>
          </section>

        </main>
      </div>
    </div>
  );
}
