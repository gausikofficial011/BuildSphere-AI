import React, { useState, useEffect } from 'react';
import {
  Activity,
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  Bell,
  Bot,
  Building2,
  Calendar,
  Check,
  CheckCircle2,
  ChevronDown,
  Clock,
  Database,
  Download,
  FileText,
  Globe,
  HardDrive,
  Layers,
  Mail,
  Maximize2,
  Menu,
  MessageSquare,
  Pin,
  Plus,
  RotateCcw,
  Search,
  Send,
  Server,
  Shield,
  ShieldCheck,
  Sparkles,
  Trash2,
  User,
  Volume2,
  VolumeX,
  Sliders,
  Workflow,
  X,
  Zap
} from 'lucide-react';
import '../pages/SuperAdmin.css';
import { askBuildSphereCopilot } from './copilotEngine';
import { soundFx } from '../utils/soundManager';

export default function CyberPortalLayout({
  portalName = 'Portal',
  portalSubtitle = 'INTELLIGENCE PLATFORM',
  userName = 'Specialist',
  userRole = 'Lead Engineer',
  userAvatar = null,
  navGroups = [],
  activeTab = 'dashboard',
  setActiveTab = () => {},
  copilotTitle = 'AI Copilot',
  copilotDesc = 'Ask me anything about this portal',
  copilotTabId = 'copilot',
  kpiCards = [],
  telemetryCards = [],
  platformOverview = null,
  statusList = null,
  recentActivities = null,
  scoreGauge = null,
  bottomMetrics = null,
  children
}) {
  // State Management
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [selectedTimeRange, setSelectedTimeRange] = useState('May 12, 2024 - 10:30 AM IST');
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isMessagesOpen, setIsMessagesOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isCopilotChatOpen, setIsCopilotChatOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isSoundOpen, setIsSoundOpen] = useState(false);
  const [isAudioMuted, setIsAudioMuted] = useState(soundFx.isMuted);
  const [audioVolume, setAudioVolume] = useState(soundFx.volume);

  // Copilot Interactive Chat State
  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      text: `Hello ${userName}! I am your ${copilotTitle}. How can I assist you with ${portalName} operations, code checks, or calculations today?`,
      time: 'Just now'
    }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isAiTyping, setIsAiTyping] = useState(false);

  // Interactive Notifications State
  const [notifications, setNotifications] = useState([
    { id: 1, title: `High-Priority Alert: ${portalName}`, desc: 'Telemetry threshold nominal. 0 critical faults detected.', time: '5m ago', unread: true, type: 'info' },
    { id: 2, title: 'Weekly Milestone Sync', desc: 'Milestone Progress verified with 98.4% accuracy.', time: '25m ago', unread: true, type: 'success' },
    { id: 3, title: 'Security & QA Scan Passed', desc: 'All statutory records verified against NBC 2024 bye-laws.', time: '1h ago', unread: false, type: 'success' },
    { id: 4, title: 'New Submittal Ready for Review', desc: 'Discipline coordination shop drawings uploaded by contractor.', time: '2h ago', unread: false, type: 'warning' },
  ]);

  // Interactive Messages State
  const [messages, setMessages] = useState([
    { id: 1, sender: 'Arun Kumar (BIM Lead)', text: 'Federated Model Rev 4 published with 0 structural clashes.', time: '12m ago', unread: true },
    { id: 2, sender: 'Priya Sharma (GIS)', text: 'Drone orthomosaic 4K aerial survey updated for North Sector.', time: '45m ago', unread: true },
    { id: 3, sender: 'Marcus Vance (Cost Eng)', text: 'EVM S-Curve report finalized. Under budget by ₹ 1.45 Cr.', time: '2h ago', unread: false },
  ]);

  // Audio-Enabled Toast Helper
  const showToast = (msg, type = 'info') => {
    setToastMessage(msg);
    if (type === 'success') soundFx.playSuccess();
    else if (type === 'warning') soundFx.playWarning();
    else soundFx.playNotification();
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Live Alert Simulator
  const simulateLiveAlert = () => {
    const sampleAlerts = [
      { title: '🚨 Structural Load Verification', desc: 'Column C12 axial capacity verified at 1,480 kN (Safety factor 2.1).', type: 'success' },
      { title: '⚠️ MEP High-Pressure Chilled Line', desc: 'Soft clearance of 150mm maintained across all Level 14 risers.', type: 'warning' },
      { title: '🔔 Permit to Work (PTW #642)', desc: 'Hot work permit approved for Zone B Level 14 structural steel welding.', type: 'info' },
      { title: '✅ Concrete Cube 28-Day Strength', desc: 'Tested at 46.8 MPa (Target 40 MPa) - 100% Passed IS 456 test.', type: 'success' },
      { title: '🤖 AI Copilot Automation', desc: 'Parametric Dynamo script optimized facade panel quantities by 8.4%.', type: 'info' }
    ];
    const chosen = sampleAlerts[Math.floor(Math.random() * sampleAlerts.length)];
    const newNotif = {
      id: Date.now(),
      title: chosen.title,
      desc: chosen.desc,
      time: 'Just now',
      unread: true,
      type: chosen.type
    };
    setNotifications(prev => [newNotif, ...prev]);
    showToast(`${chosen.title}: ${chosen.desc}`, chosen.type);
  };

  // Keyboard Shortcuts (CTRL + K for Search, ESC to close modals)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchModalOpen(prev => !prev);
      }
      if (e.key === 'Escape') {
        setIsSearchModalOpen(false);
        setIsDatePickerOpen(false);
        setIsNotificationsOpen(false);
        setIsMessagesOpen(false);
        setIsProfileOpen(false);
        setIsLangOpen(false);
        setIsCopilotChatOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Fullscreen Handler
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      showToast('Entered Fullscreen Cyber HUD Mode');
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
        showToast('Exited Fullscreen Mode');
      }
    }
  };

  // Export Report Handler
  const handleExportReport = () => {
    const reportData = {
      portal: portalName,
      user: userName,
      role: userRole,
      generatedAt: new Date().toISOString(),
      kpis: kpiCards,
      telemetry: telemetryCards,
      overview: platformOverview,
      statusList: statusList,
      score: scoreGauge?.score || 98
    };
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${portalName.replace(/\s+/g, '_')}_Executive_Audit_Report_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast(`Executive Report for ${portalName} exported & downloaded!`);
  };

  // Send AI Chat Message
  const handleSendChat = async (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: chatInput,
      time: 'Just now'
    };

    const currentHistory = [...chatMessages, userMsg];
    setChatMessages(currentHistory);
    const query = chatInput;
    setChatInput('');
    setIsAiTyping(true);

    const result = await askBuildSphereCopilot({
      message: query,
      role: userRole,
      portal: portalName,
      history: currentHistory.slice(-6)
    });

    setChatMessages(prev => [...prev, {
      id: Date.now() + 1,
      sender: 'ai',
      text: result.reply,
      time: 'Just now'
    }]);
    setIsAiTyping(false);
  };

  // Filtered Navigation Search Items
  const allNavItems = navGroups.flatMap(g => g.items || []);
  const filteredSearchItems = allNavItems.filter(item =>
    item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
    portalName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Default Bottom Telemetry Strip
  const defaultBottomMetrics = {
    serverUptime: '99.98%',
    dbHealth: 'Healthy',
    apiSuccessRate: '99.6%',
    backupStatus: 'Up to date',
    activeWorkflows: '312',
    activeLabel: 'Active Workflows',
    ...bottomMetrics
  };

  return (
    <div className="cyber-superadmin-layout">
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          bottom: '2.5rem',
          right: '2.5rem',
          zIndex: 9999,
          background: 'rgba(9, 8, 26, 0.95)',
          border: '1.5px solid #ec4899',
          boxShadow: '0 0 25px rgba(236, 72, 153, 0.5)',
          borderRadius: '8px',
          padding: '0.85rem 1.4rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          color: '#ffffff',
          backdropFilter: 'blur(16px)',
          animation: 'cyberFadeIn 0.3s ease-out'
        }}>
          <Sparkles size={18} color="#22d3ee" />
          <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>{toastMessage}</span>
        </div>
      )}

      {/* Background Cyber City Skyline & Grid */}
      <div className="cyber-city-backdrop">
        <div className="city-skyline-silhouette"></div>
        <div className="grid-floor-perspective"></div>
      </div>

      {/* Outer HUD Frame with Neon Corner Notches */}
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
            <div className="admin-brand-group" onClick={() => setActiveTab('dashboard')} style={{ cursor: 'pointer' }}>
              <div className="admin-brand-hexagon">
                <Building2 size={22} className="admin-hexagon-icon" />
              </div>
              <div className="admin-brand-labels">
                <div className="admin-brand-title">
                  BuildSphere <span className="text-pink-glow">AI</span>
                </div>
                <span className="admin-brand-subtitle">{portalSubtitle}</span>
              </div>
            </div>

            {/* Menu Toggle */}
            <button
              className="menu-toggle-btn"
              title="Toggle Sidebar"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            >
              <Menu size={18} />
            </button>

            {/* Global Cyber Search Bar */}
            <div className="admin-search-box" onClick={() => setIsSearchModalOpen(true)}>
              <Search size={15} className="search-icon-pink" />
              <input
                type="text"
                placeholder={`Search ${portalName}... (Models, Tasks, Records)`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="admin-search-input"
                readOnly
              />
              <span className="ctrl-k-badge">CTRL + K</span>
            </div>
          </div>

          <div className="navbar-right-section" style={{ position: 'relative' }}>
            {/* Notification Bell with Pink Badge */}
            <button
              className="nav-icon-badge-btn"
              title="Notifications"
              onClick={() => {
                setIsNotificationsOpen(!isNotificationsOpen);
                setIsMessagesOpen(false);
                setIsProfileOpen(false);
                setIsLangOpen(false);
              }}
            >
              <Bell size={18} />
              {notifications.filter(n => n.unread).length > 0 && (
                <span className="notification-pill-pink">{notifications.filter(n => n.unread).length}</span>
              )}
            </button>

            {/* Messages with Pink Badge */}
            <button
              className="nav-icon-badge-btn"
              title="Messages"
              onClick={() => {
                setIsMessagesOpen(!isMessagesOpen);
                setIsNotificationsOpen(false);
                setIsProfileOpen(false);
                setIsLangOpen(false);
              }}
            >
              <Mail size={18} />
              {messages.filter(m => m.unread).length > 0 && (
                <span className="notification-pill-pink">{messages.filter(m => m.unread).length}</span>
              )}
            </button>

            {/* Sound FX Audio Settings Button */}
            <button
              className="nav-icon-btn"
              title="Audio & Sound FX Settings"
              onClick={() => {
                setIsSoundOpen(!isSoundOpen);
                setIsNotificationsOpen(false);
                setIsMessagesOpen(false);
                setIsProfileOpen(false);
                setIsLangOpen(false);
              }}
            >
              {isAudioMuted ? <VolumeX size={18} color="#f43f5e" /> : <Volume2 size={18} color="#22d3ee" />}
            </button>

            {/* Globe Language */}
            <button
              className="nav-icon-btn"
              title="Language & Localization"
              onClick={() => {
                setIsLangOpen(!isLangOpen);
                setIsNotificationsOpen(false);
                setIsMessagesOpen(false);
                setIsProfileOpen(false);
                setIsSoundOpen(false);
              }}
            >
              <Globe size={18} />
            </button>

            {/* Fullscreen Toggle */}
            <button className="nav-icon-btn" title="Toggle Fullscreen" onClick={toggleFullscreen}>
              <Maximize2 size={17} />
            </button>

            {/* User Profile Capsule */}
            <div
              className="admin-profile-capsule"
              onClick={() => {
                setIsProfileOpen(!isProfileOpen);
                setIsNotificationsOpen(false);
                setIsMessagesOpen(false);
                setIsLangOpen(false);
                setIsSoundOpen(false);
              }}
            >
              <div className="admin-avatar-ring">
                {userAvatar ? (
                  <img src={userAvatar} alt={userName} style={{ width: '100%', height: '100%', borderRadius: '50%' }} />
                ) : (
                  <User size={18} />
                )}
                <span className="online-indicator-dot"></span>
              </div>
              <div className="admin-meta-text">
                <div className="admin-name">{userName}</div>
                <div className="admin-role-status">
                  <span>{userRole}</span>
                  <span className="online-label">● ONLINE</span>
                </div>
              </div>
            </div>

            {/* DROPDOWN 0: SOUND FX & AUDIO SETTINGS DRAWER */}
            {isSoundOpen && (
              <div style={{
                position: 'absolute',
                top: '48px',
                right: '160px',
                width: '320px',
                background: 'rgba(9, 8, 26, 0.98)',
                border: '1.5px solid rgba(34, 211, 238, 0.5)',
                borderRadius: '10px',
                boxShadow: '0 10px 40px rgba(6, 182, 212, 0.35)',
                backdropFilter: 'blur(24px)',
                zIndex: 1000,
                display: 'flex',
                flexDirection: 'column',
                padding: '1.1rem',
                animation: 'cyberFadeIn 0.2s ease-out'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid rgba(34, 211, 238, 0.2)', paddingBottom: '0.6rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Sliders size={16} color="#22d3ee" />
                    <strong style={{ fontSize: '0.85rem', color: '#ffffff' }}>Cyber Sound & Haptics</strong>
                  </div>
                  <span style={{ fontSize: '0.68rem', color: '#34d399', fontWeight: 800 }}>Web Audio API</span>
                </div>

                {/* Mute / Unmute Switch */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', background: 'rgba(255,255,255,0.03)', padding: '0.6rem 0.8rem', borderRadius: '6px' }}>
                  <span style={{ fontSize: '0.78rem', color: '#ffffff', fontWeight: 600 }}>Audio Effects</span>
                  <button
                    onClick={() => {
                      const next = !isAudioMuted;
                      setIsAudioMuted(next);
                      soundFx.setMuted(next);
                      if (!next) soundFx.playSuccess();
                    }}
                    style={{
                      background: isAudioMuted ? 'rgba(244,63,94,0.2)' : 'rgba(34,211,238,0.2)',
                      border: `1px solid ${isAudioMuted ? '#f43f5e' : '#22d3ee'}`,
                      color: isAudioMuted ? '#f43f5e' : '#22d3ee',
                      padding: '0.25rem 0.75rem',
                      borderRadius: '9999px',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    {isAudioMuted ? 'Muted' : 'Enabled'}
                  </button>
                </div>

                {/* Master Volume Slider */}
                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#94a3b8', marginBottom: '0.35rem' }}>
                    <span>Master Volume</span>
                    <span style={{ color: '#22d3ee', fontWeight: 700 }}>{Math.round(audioVolume * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={audioVolume}
                    onChange={e => {
                      const val = parseFloat(e.target.value);
                      setAudioVolume(val);
                      soundFx.setVolume(val);
                    }}
                    style={{ width: '100%', accentColor: '#22d3ee', cursor: 'pointer' }}
                  />
                </div>

                {/* SFX Tester Buttons */}
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '0.8rem' }}>
                  <span style={{ display: 'block', fontSize: '0.68rem', color: '#64748b', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Test Sound Presets</span>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.4rem' }}>
                    <button onClick={() => soundFx.playNotification()} style={{ padding: '0.4rem', background: 'rgba(6,182,212,0.1)', border: '1px solid rgba(6,182,212,0.3)', color: '#22d3ee', borderRadius: '4px', fontSize: '0.7rem', cursor: 'pointer', fontWeight: 600 }}>
                      🔔 Alert Ping
                    </button>
                    <button onClick={() => soundFx.playSuccess()} style={{ padding: '0.4rem', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', color: '#34d399', borderRadius: '4px', fontSize: '0.7rem', cursor: 'pointer', fontWeight: 600 }}>
                      🌟 Success Chime
                    </button>
                    <button onClick={() => soundFx.playWarning()} style={{ padding: '0.4rem', background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)', color: '#fbbf24', borderRadius: '4px', fontSize: '0.7rem', cursor: 'pointer', fontWeight: 600 }}>
                      ⚠️ Warning Buzz
                    </button>
                    <button onClick={() => soundFx.playWarp()} style={{ padding: '0.4rem', background: 'rgba(236,72,153,0.1)', border: '1px solid rgba(236,72,153,0.3)', color: '#ec4899', borderRadius: '4px', fontSize: '0.7rem', cursor: 'pointer', fontWeight: 600 }}>
                      🚀 AR/VR Warp
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* DROPDOWN 1: NOTIFICATIONS DRAWER */}
            {isNotificationsOpen && (
              <div style={{
                position: 'absolute',
                top: '48px',
                right: '120px',
                width: '360px',
                background: 'rgba(9, 8, 26, 0.98)',
                border: '1.5px solid rgba(236, 72, 153, 0.4)',
                borderRadius: '8px',
                boxShadow: '0 10px 35px rgba(0, 0, 0, 0.6)',
                backdropFilter: 'blur(20px)',
                zIndex: 1000,
                display: 'flex',
                flexDirection: 'column',
                animation: 'cyberFadeIn 0.2s ease-out'
              }}>
                <div style={{ padding: '0.85rem 1rem', borderBottom: '1px solid rgba(236, 72, 153, 0.2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Bell size={16} color="#f43f5e" />
                    <strong style={{ fontSize: '0.85rem', color: '#ffffff' }}>Live System Alerts</strong>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <button
                      onClick={simulateLiveAlert}
                      style={{ background: 'rgba(236, 72, 153, 0.15)', border: '1px solid rgba(236, 72, 153, 0.4)', color: '#f43f5e', fontSize: '0.68rem', padding: '0.2rem 0.5rem', borderRadius: '4px', cursor: 'pointer', fontWeight: 700 }}
                      title="Trigger an instant real-time site alert"
                    >
                      ⚡ Simulate Alert
                    </button>
                    <button
                      onClick={() => {
                        setNotifications(notifications.map(n => ({ ...n, unread: false })));
                        soundFx.playSuccess();
                        showToast('All notifications marked as read.', 'success');
                      }}
                      style={{ background: 'none', border: 'none', color: '#22d3ee', fontSize: '0.72rem', cursor: 'pointer', fontWeight: 700 }}
                    >
                      Mark All Read
                    </button>
                  </div>
                </div>
                <div style={{ maxHeight: '280px', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
                  {notifications.map(n => (
                    <div key={n.id} style={{ padding: '0.75rem 1rem', borderBottom: '1px solid rgba(255, 255, 255, 0.04)', background: n.unread ? 'rgba(236, 72, 153, 0.06)' : 'transparent', display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.78rem', fontWeight: 800, color: n.unread ? '#f43f5e' : '#ffffff' }}>{n.title}</span>
                        <span style={{ fontSize: '0.65rem', color: '#64748b' }}>{n.time}</span>
                      </div>
                      <p style={{ margin: 0, fontSize: '0.72rem', color: '#94a3b8' }}>{n.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* DROPDOWN 2: MESSAGES DRAWER */}
            {isMessagesOpen && (
              <div style={{
                position: 'absolute',
                top: '48px',
                right: '80px',
                width: '320px',
                background: 'rgba(9, 8, 26, 0.96)',
                border: '1.5px solid rgba(6, 182, 212, 0.4)',
                borderRadius: '8px',
                boxShadow: '0 10px 35px rgba(0, 0, 0, 0.6)',
                backdropFilter: 'blur(20px)',
                zIndex: 1000,
                display: 'flex',
                flexDirection: 'column',
                animation: 'cyberFadeIn 0.2s ease-out'
              }}>
                <div style={{ padding: '0.85rem 1rem', borderBottom: '1px solid rgba(6, 182, 212, 0.2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Mail size={16} color="#22d3ee" />
                    <strong style={{ fontSize: '0.85rem', color: '#ffffff' }}>Team Dispatch Messages</strong>
                  </div>
                </div>
                <div style={{ maxHeight: '280px', overflowY: 'auto' }}>
                  {messages.map(m => (
                    <div key={m.id} style={{ padding: '0.75rem 1rem', borderBottom: '1px solid rgba(255, 255, 255, 0.04)', display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <strong style={{ fontSize: '0.78rem', color: '#22d3ee' }}>{m.sender}</strong>
                        <span style={{ fontSize: '0.65rem', color: '#64748b' }}>{m.time}</span>
                      </div>
                      <p style={{ margin: 0, fontSize: '0.72rem', color: '#e2e8f0' }}>{m.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* DROPDOWN 3: LANGUAGE SELECTOR */}
            {isLangOpen && (
              <div style={{
                position: 'absolute',
                top: '48px',
                right: '40px',
                width: '180px',
                background: 'rgba(9, 8, 26, 0.96)',
                border: '1.5px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '8px',
                boxShadow: '0 10px 35px rgba(0, 0, 0, 0.6)',
                backdropFilter: 'blur(20px)',
                zIndex: 1000,
                padding: '0.5rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.25rem'
              }}>
                {['English (US / UK)', 'Hindi (हिंदी)', 'Arabic (العربية)', 'German (Deutsch)', 'French (Français)'].map((l, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setIsLangOpen(false);
                      showToast(`Language set to ${l}`);
                    }}
                    style={{
                      background: i === 0 ? 'rgba(6, 182, 212, 0.15)' : 'none',
                      border: 'none',
                      color: i === 0 ? '#22d3ee' : '#cbd5e1',
                      padding: '0.45rem 0.65rem',
                      textAlign: 'left',
                      borderRadius: '4px',
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    {l}
                  </button>
                ))}
              </div>
            )}

            {/* DROPDOWN 4: USER PROFILE MODAL */}
            {isProfileOpen && (
              <div style={{
                position: 'absolute',
                top: '48px',
                right: '0',
                width: '240px',
                background: 'rgba(9, 8, 26, 0.96)',
                border: '1.5px solid rgba(236, 72, 153, 0.4)',
                borderRadius: '8px',
                boxShadow: '0 10px 35px rgba(0, 0, 0, 0.6)',
                backdropFilter: 'blur(20px)',
                zIndex: 1000,
                padding: '1rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, #06b6d4, #ec4899)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <User size={22} color="#ffffff" />
                  </div>
                  <div>
                    <strong style={{ fontSize: '0.85rem', color: '#ffffff', display: 'block' }}>{userName}</strong>
                    <span style={{ fontSize: '0.7rem', color: '#22d3ee' }}>{userRole}</span>
                  </div>
                </div>
                <div style={{ fontSize: '0.72rem', color: '#94a3b8', borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '0.5rem' }}>
                  <div>Status: <span style={{ color: '#10b981', fontWeight: 700 }}>● Active Session</span></div>
                  <div>Security: <span style={{ color: '#ffffff' }}>2FA Verified (RBAC)</span></div>
                </div>
                <button
                  onClick={() => {
                    setIsProfileOpen(false);
                    showToast('Profile session refreshed.');
                  }}
                  style={{
                    background: 'rgba(236, 72, 153, 0.2)',
                    border: '1px solid #ec4899',
                    color: '#ffffff',
                    padding: '0.45rem',
                    borderRadius: '4px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  Manage Security & Keys
                </button>
              </div>
            )}

          </div>
        </header>

        {/* =========================================================================
           MAIN CONTAINER (LEFT SIDEBAR + DASHBOARD CONTENT)
           ========================================================================= */}
        <div className="superadmin-body-container">
          
          {/* -----------------------------------------------------------------------
             LEFT NAVIGATION SIDEBAR
             ----------------------------------------------------------------------- */}
          <aside className="superadmin-sidebar" style={{ width: sidebarCollapsed ? '70px' : '250px', transition: 'width 0.2s ease' }}>
            {/* Pinned Top Dashboard Button */}
            <div className="sidebar-top-pinned">
              <button
                className={`sidebar-top-dashboard-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
                onClick={() => {
                  soundFx.playClick();
                  setActiveTab('dashboard');
                }}
              >
                <div className="btn-left-content">
                  <Activity size={18} />
                  {!sidebarCollapsed && <span>Dashboard</span>}
                </div>
                {!sidebarCollapsed && <Pin size={14} className="dashboard-pin-icon" />}
              </button>
            </div>

            {/* Dynamically Rendered Nav Groups (Scrollable Middle) */}
            <div className="sidebar-scrollable-content">
              {navGroups.map((group, gIdx) => (
                <div className="sidebar-group" key={gIdx}>
                  {!sidebarCollapsed && (
                    <div className={group.color === 'cyan' ? 'group-heading-cyan' : 'group-heading-pink'}>
                      {group.title}
                    </div>
                  )}
                  <nav className="sidebar-nav-list">
                    {group.items.map((item) => {
                      const IconComp = item.icon;
                      return (
                        <button
                          key={item.id}
                          className={`sidebar-link ${activeTab === item.id ? 'active' : ''}`}
                          onClick={() => {
                            soundFx.playClick();
                            setActiveTab(item.id);
                          }}
                          title={item.label}
                        >
                          {IconComp && <IconComp size={16} />}
                          {!sidebarCollapsed && <span>{item.label}</span>}
                          {!sidebarCollapsed && item.badge && <span className="sidebar-pill-new">{item.badge}</span>}
                        </button>
                      );
                    })}
                  </nav>
                </div>
              ))}
            </div>

            {/* Bottom Sidebar Copilot Widget (Pinned Bottom Footer) */}
            {!sidebarCollapsed && (
              <div className="sidebar-bottom-pinned">
                <div className="sidebar-copilot-card">
                  <div className="copilot-top-info">
                    <div className="copilot-avatar-ring">
                      <Bot size={15} color="#ffffff" />
                    </div>
                    <div className="copilot-text-group">
                      <strong>{copilotTitle}</strong>
                      <span>{copilotDesc}</span>
                    </div>
                  </div>
                  <button
                    className="copilot-action-btn"
                    onClick={() => {
                      soundFx.playWarp();
                      setIsCopilotChatOpen(true);
                    }}
                  >
                    <span>Ask AI Copilot</span>
                    <span className="btn-arrow">→</span>
                  </button>
                </div>
              </div>
            )}
          </aside>

          {/* -----------------------------------------------------------------------
             MAIN CONTENT STAGE (DASHBOARD OR DYNAMIC SUBMODULE)
             ----------------------------------------------------------------------- */}
          <main className="superadmin-content-stage">
            {activeTab === 'dashboard' ? (
              <>
                {/* 1. GREETING & DATE EXPORT BAR */}
                <div className="dashboard-welcome-bar">
                  <div className="welcome-text-group">
                    <h1 className="welcome-title">
                      Welcome back, <span className="text-pink-glow">{userName}!</span> 👋
                    </h1>
                    <p className="welcome-subtitle">
                      Here's what's happening on your {portalName} portal today.
                    </p>
                  </div>

                  <div className="welcome-actions-group" style={{ position: 'relative' }}>
                    <button
                      className="date-selector-pill"
                      onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
                    >
                      <Calendar size={15} className="icon-pink" />
                      <span>{selectedTimeRange}</span>
                      <ChevronDown size={14} />
                    </button>

                    {/* Date Selector Popover */}
                    {isDatePickerOpen && (
                      <div style={{
                        position: 'absolute',
                        top: '40px',
                        right: '150px',
                        background: 'rgba(9, 8, 26, 0.98)',
                        border: '1.5px solid #22d3ee',
                        borderRadius: '8px',
                        padding: '0.65rem',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.35rem',
                        zIndex: 100,
                        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.8)',
                        backdropFilter: 'blur(16px)',
                        width: '210px'
                      }}>
                        {['Today (Real-Time)', 'This Week (May 06 - 12)', 'Monthly S-Curve (May 2024)', 'Q2 2024 Master Baseline', 'Full Project Lifecycle'].map((range, rI) => (
                          <button
                            key={rI}
                            onClick={() => {
                              setSelectedTimeRange(range);
                              setIsDatePickerOpen(false);
                              showToast(`Timeline filter updated: ${range}`);
                            }}
                            style={{
                              background: selectedTimeRange === range ? 'rgba(6, 182, 212, 0.2)' : 'none',
                              border: 'none',
                              color: selectedTimeRange === range ? '#22d3ee' : '#ffffff',
                              padding: '0.45rem 0.65rem',
                              textAlign: 'left',
                              borderRadius: '4px',
                              fontSize: '0.74rem',
                              fontWeight: 700,
                              cursor: 'pointer'
                            }}
                          >
                            {range}
                          </button>
                        ))}
                      </div>
                    )}

                    <button className="export-report-btn" onClick={handleExportReport}>
                      <Download size={15} />
                      <span>Export Report</span>
                    </button>
                  </div>
                </div>

                {/* 2. TOP 4 KPI METRICS CARDS */}
                {kpiCards && kpiCards.length > 0 && (
                  <div className="top-4-kpi-grid">
                    {kpiCards.slice(0, 4).map((kpi, kIdx) => {
                      const KpiIcon = kpi.icon || Building2;
                      const borderClass = kpi.color === 'cyan' ? 'border-cyan' : kpi.color === 'purple' ? 'border-purple' : kpi.color === 'magenta' ? 'border-magenta' : 'border-pink';
                      const boxClass = kpi.color === 'cyan' ? 'cyan' : kpi.color === 'purple' ? 'purple' : kpi.color === 'blue' ? 'blue' : 'pink';

                      return (
                        <div
                          className={`kpi-card ${borderClass}`}
                          key={kIdx}
                          onClick={() => showToast(`KPI metric selected: ${kpi.title} (${kpi.value})`)}
                          style={{ cursor: 'pointer' }}
                        >
                          <div className={`kpi-icon-box ${boxClass}`}>
                            <KpiIcon size={24} />
                          </div>
                          <div className="kpi-info">
                            <span className="kpi-label">{kpi.title}</span>
                            <div className="kpi-number">{kpi.value}</div>
                            <div className="kpi-trend green">
                              <span>{kpi.trend}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* 3. MIDDLE 8 TELEMETRY MICRO-CARDS STRIP */}
                {telemetryCards && telemetryCards.length > 0 && (
                  <div className="telemetry-8-strip">
                    {telemetryCards.slice(0, 8).map((tel, tIdx) => {
                      const TelIcon = tel.icon || Activity;
                      const iconColorClass = tel.color || 'cyan';
                      const strokeHex = tel.strokeColor || (iconColorClass === 'purple' ? '#a855f7' : iconColorClass === 'teal' ? '#34d399' : iconColorClass === 'magenta' ? '#f43f5e' : '#22d3ee');

                      return (
                        <div
                          className="micro-telemetry-card"
                          key={tIdx}
                          onClick={() => showToast(`Telemetry feed active: ${tel.title}`)}
                          style={{ cursor: 'pointer' }}
                        >
                          <div className="micro-header">
                            <TelIcon size={14} className={`micro-icon ${iconColorClass}`} />
                            <span>{tel.title}</span>
                          </div>
                          <div className="micro-val">
                            {tel.value} {tel.subDenom && <span className="sub-denom">{tel.subDenom}</span>}
                          </div>
                          <div className="micro-chart-svg">
                            <svg viewBox="0 0 80 20" className="sparkline">
                              <path d="M0,15 Q20,6 40,11 T80,4" fill="none" stroke={strokeHex} strokeWidth="1.8" />
                            </svg>
                          </div>
                          <div className="micro-trend green">{tel.trend}</div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* 4. BOTTOM 4 OPERATIONAL INTELLIGENCE WIDGETS */}
                <div className="operational-4-grid">
                  
                  {/* Widget 1: Platform/Role Overview Donut */}
                  {platformOverview && (
                    <div className="admin-intel-widget">
                      <div className="widget-top-bar">
                        <div className="widget-titles">
                          <h3>{platformOverview.title || 'Platform Overview'}</h3>
                          <span className="widget-sub">{platformOverview.subtitle || 'Real-time performance summary'}</span>
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
                            <strong className="donut-count">{platformOverview.totalCount || '42'}</strong>
                            <span className="donut-unit">{platformOverview.totalLabel || 'ITEMS'}</span>
                          </div>
                        </div>
                        <div className="donut-breakdown-list">
                          {platformOverview.items?.map((item, iIdx) => (
                            <div className="donut-list-row" key={iIdx} onClick={() => showToast(`Discipline selected: ${item.name}`)} style={{ cursor: 'pointer' }}>
                              <span className={`dot-indicator ${item.color || 'green'}`}></span>
                              <span className="row-name">{item.name}</span>
                              <strong className="row-val">{item.count} {item.percent && `(${item.percent})`}</strong>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Widget 2: Model / Task Status Table */}
                  {statusList && (
                    <div className="admin-intel-widget">
                      <div className="widget-top-bar flex-between">
                        <div className="widget-titles">
                          <h3>{statusList.title || 'Status Overview'}</h3>
                        </div>
                        {statusList.viewAllTab && (
                          <a href="#view" className="link-view-all" onClick={(e) => { e.preventDefault(); setActiveTab(statusList.viewAllTab); }}>View All</a>
                        )}
                      </div>
                      <div className="model-status-table">
                        {statusList.items?.map((st, sIdx) => (
                          <div className="model-row" key={sIdx} onClick={() => showToast(`Status verified: ${st.name}`)} style={{ cursor: 'pointer' }}>
                            <span className="model-name">{st.name}</span>
                            <span className={`model-badge ${st.badgeClass || 'active'}`}>{st.status}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Widget 3: Recent Activities */}
                  {recentActivities && (
                    <div className="admin-intel-widget">
                      <div className="widget-top-bar flex-between">
                        <div className="widget-titles">
                          <h3>{recentActivities.title || 'Recent Activities'}</h3>
                        </div>
                        {recentActivities.viewAllTab && (
                          <a href="#view" className="link-view-all" onClick={(e) => { e.preventDefault(); setActiveTab(recentActivities.viewAllTab); }}>View All</a>
                        )}
                      </div>
                      <div className="recent-activity-feed">
                        {recentActivities.items?.map((act, aIdx) => {
                          const ActIcon = act.icon || Activity;
                          return (
                            <div className="activity-row" key={aIdx} onClick={() => showToast(`Activity inspected: ${act.text}`)} style={{ cursor: 'pointer' }}>
                              <div className={`activity-icon-wrap ${act.color || 'purple'}`}>
                                <ActIcon size={12} />
                              </div>
                              <div className="activity-text-col">
                                <span>{act.text}</span>
                              </div>
                              <span className="activity-time">{act.time}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Widget 4: Quality / Performance / Security Radial Score Gauge */}
                  {scoreGauge && (
                    <div className="admin-intel-widget">
                      <div className="widget-top-bar flex-between">
                        <div className="widget-titles">
                          <h3>{scoreGauge.title || 'Performance & Security'}</h3>
                        </div>
                        {scoreGauge.viewAllTab && (
                          <a href="#view" className="link-view-all" onClick={(e) => { e.preventDefault(); setActiveTab(scoreGauge.viewAllTab); }}>View All</a>
                        )}
                      </div>
                      <div className="security-gauge-layout">
                        <div className="security-gauge-col">
                          <div className="radial-security-gauge">
                            <svg viewBox="0 0 36 36" className="circular-chart cyber-cyan">
                              <path className="circle-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                              <path className="circle-progress-security" strokeDasharray={`${scoreGauge.score || '92'}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                              <text x="18" y="17.5" className="sec-gauge-score">{scoreGauge.score || '92'}</text>
                              <text x="18" y="21.5" className="sec-gauge-den">{scoreGauge.scoreMax || '/100'}</text>
                              <text x="18" y="25.5" className="sec-gauge-lbl">{scoreGauge.scoreLabel || 'HEALTH SCORE'}</text>
                              <text x="18" y="29.5" className="sec-gauge-status">{scoreGauge.statusText || 'Optimal'}</text>
                            </svg>
                          </div>
                        </div>
                        <div className="security-threat-breakdown">
                          {scoreGauge.breakdown?.map((br, bIdx) => (
                            <div className="threat-row" key={bIdx}>
                              <span className={`dot-indicator ${br.color || 'green'}`}></span>
                              <span className="threat-name">{br.name}</span>
                              <strong className="threat-num">{br.num}</strong>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="security-widget-footer">
                        <span>{scoreGauge.footerText || 'Last scan: 10 min ago'}</span>
                        <span className="safe-badge">{scoreGauge.safeText || '🛡 System Optimal'}</span>
                      </div>
                    </div>
                  )}

                </div>

                {/* 5. BOTTOM TELEMETRY STATUS STRIP */}
                <footer className="superadmin-bottom-strip">
                  <div className="strip-metric-item">
                    <div className="strip-icon-box"><Server size={14} className="icon-cyan" /></div>
                    <div className="strip-metric-text">
                      <span className="strip-lbl">Server Uptime</span>
                      <strong className="strip-val">{defaultBottomMetrics.serverUptime}</strong>
                    </div>
                    <div className="strip-sparkline">
                      <svg viewBox="0 0 40 14"><path d="M0,7 Q10,2 20,7 T40,4" fill="none" stroke="#22d3ee" strokeWidth="1.5" /></svg>
                    </div>
                  </div>

                  <div className="strip-metric-item">
                    <div className="strip-icon-box"><Database size={14} className="icon-green" /></div>
                    <div className="strip-metric-text">
                      <span className="strip-lbl">Database Health</span>
                      <strong className="strip-val green">{defaultBottomMetrics.dbHealth}</strong>
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
                      <strong className="strip-val">{defaultBottomMetrics.apiSuccessRate}</strong>
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
                      <strong className="strip-val">{defaultBottomMetrics.backupStatus}</strong>
                    </div>
                  </div>

                  <div className="strip-metric-item">
                    <div className="strip-metric-text">
                      <span className="strip-lbl">{defaultBottomMetrics.activeLabel}</span>
                      <strong className="strip-val">{defaultBottomMetrics.activeWorkflows}</strong>
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
              /* DYNAMIC SUBMODULE VIEW */
              <div className="admin-active-module-container">
                <div className="module-top-header-bar">
                  <button className="back-to-dashboard-btn" onClick={() => setActiveTab('dashboard')}>
                    ← Back to {portalName} Dashboard
                  </button>
                </div>
                {children}
              </div>
            )}
          </main>

        </div>

      </div>

      {/* =========================================================================
         GLOBAL COMMAND PALETTE & SEARCH MODAL (CTRL + K)
         ========================================================================= */}
      {isSearchModalOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(4, 3, 13, 0.85)',
          backdropFilter: 'blur(20px)',
          zIndex: 10000,
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'center',
          paddingTop: '10vh'
        }} onClick={() => setIsSearchModalOpen(false)}>
          <div style={{
            width: '600px',
            maxWidth: '90vw',
            background: 'rgba(9, 8, 26, 0.98)',
            border: '1.5px solid #22d3ee',
            boxShadow: '0 0 40px rgba(6, 182, 212, 0.4)',
            borderRadius: '12px',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            animation: 'cyberFadeIn 0.2s ease-out'
          }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', padding: '1rem 1.25rem', borderBottom: '1px solid rgba(6, 182, 212, 0.25)', gap: '0.75rem' }}>
              <Search size={18} color="#22d3ee" />
              <input
                type="text"
                autoFocus
                placeholder={`Type command or navigate modules in ${portalName}...`}
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{
                  flex: 1,
                  background: 'none',
                  border: 'none',
                  color: '#ffffff',
                  fontSize: '1rem',
                  outline: 'none',
                  fontWeight: 600
                }}
              />
              <button onClick={() => setIsSearchModalOpen(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>
            <div style={{ maxHeight: '350px', overflowY: 'auto', padding: '0.5rem' }}>
              {filteredSearchItems.length > 0 ? (
                filteredSearchItems.map((item, idx) => {
                  const IconC = item.icon || Activity;
                  return (
                    <div
                      key={idx}
                      onClick={() => {
                        setActiveTab(item.id);
                        setIsSearchModalOpen(false);
                        showToast(`Switched to ${item.label}`);
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0.75rem 1rem',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        background: 'transparent',
                        transition: 'background 0.2s'
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(236, 72, 153, 0.15)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#ffffff', fontSize: '0.85rem', fontWeight: 600 }}>
                        <IconC size={16} color="#ec4899" />
                        <span>{item.label}</span>
                      </div>
                      <span style={{ fontSize: '0.65rem', color: '#22d3ee', fontWeight: 700, textTransform: 'uppercase' }}>Jump →</span>
                    </div>
                  );
                })
              ) : (
                <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b', fontSize: '0.85rem' }}>
                  No matching module found. Press ESC to close.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
         AI COPILOT INTERACTIVE CONVERSATION MODAL
         ========================================================================= */}
      {isCopilotChatOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(4, 3, 13, 0.85)',
          backdropFilter: 'blur(20px)',
          zIndex: 10000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem'
        }} onClick={() => setIsCopilotChatOpen(false)}>
          <div style={{
            width: '650px',
            height: '600px',
            maxWidth: '95vw',
            maxHeight: '90vh',
            background: 'rgba(9, 8, 26, 0.98)',
            border: '1.5px solid #ec4899',
            boxShadow: '0 0 50px rgba(236, 72, 153, 0.45)',
            borderRadius: '12px',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            animation: 'cyberFadeIn 0.2s ease-out'
          }} onClick={e => e.stopPropagation()}>
            {/* Header */}
            <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid rgba(236, 72, 153, 0.3)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(14, 12, 38, 0.9)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#ec4899', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Bot size={18} color="#ffffff" />
                </div>
                <div>
                  <strong style={{ fontSize: '0.95rem', color: '#ffffff', display: 'block' }}>{copilotTitle}</strong>
                  <span style={{ fontSize: '0.65rem', color: '#22d3ee', fontWeight: 700 }}>● Connected to BuildSphere AI Knowledge Engine</span>
                </div>
              </div>
              <button onClick={() => setIsCopilotChatOpen(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            {/* Quick Prompt Chips */}
            <div style={{ padding: '0.65rem 1rem', borderBottom: '1px solid rgba(255, 255, 255, 0.05)', display: 'flex', gap: '0.5rem', overflowX: 'auto', background: 'rgba(5, 4, 15, 0.6)' }}>
              {['Audit IS 456 / NBC Codes', 'Check Clash Tolerances', 'Verify EVM CPI / SPI', 'Explain Lookahead Delays'].map((chip, cI) => (
                <button
                  key={cI}
                  onClick={() => {
                    setChatInput(chip);
                  }}
                  style={{
                    background: 'rgba(6, 182, 212, 0.12)',
                    border: '1px solid rgba(6, 182, 212, 0.35)',
                    color: '#22d3ee',
                    fontSize: '0.68rem',
                    padding: '0.25rem 0.65rem',
                    borderRadius: '9999px',
                    whiteSpace: 'nowrap',
                    cursor: 'pointer',
                    fontWeight: 700
                  }}
                >
                  {chip}
                </button>
              ))}
            </div>

            {/* Chat Body */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {chatMessages.map(m => (
                <div key={m.id} style={{
                  display: 'flex',
                  justifyContent: m.sender === 'user' ? 'flex-end' : 'flex-start'
                }}>
                  <div style={{
                    maxWidth: '80%',
                    padding: '0.75rem 1rem',
                    borderRadius: '10px',
                    fontSize: '0.82rem',
                    lineHeight: 1.4,
                    background: m.sender === 'user' ? 'linear-gradient(135deg, #ec4899 0%, #d946ef 100%)' : 'rgba(16, 14, 42, 0.9)',
                    border: m.sender === 'user' ? 'none' : '1px solid rgba(6, 182, 212, 0.3)',
                    color: '#ffffff',
                    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)'
                  }}>
                    {m.text}
                    <span style={{ display: 'block', fontSize: '0.6rem', color: m.sender === 'user' ? 'rgba(255, 255, 255, 0.7)' : '#64748b', marginTop: '0.25rem', textAlign: 'right' }}>
                      {m.time}
                    </span>
                  </div>
                </div>
              ))}
              {isAiTyping && (
                <div style={{ alignSelf: 'flex-start', background: 'rgba(16, 14, 42, 0.9)', padding: '0.6rem 1rem', borderRadius: '8px', border: '1px solid rgba(6, 182, 212, 0.3)', color: '#22d3ee', fontSize: '0.75rem', fontWeight: 600 }}>
                  <Sparkles size={14} style={{ display: 'inline', marginRight: '0.35rem' }} /> BuildSphere AI is computing...
                </div>
              )}
            </div>

            {/* Input Bar */}
            <form onSubmit={handleSendChat} style={{ padding: '0.85rem 1rem', borderTop: '1px solid rgba(236, 72, 153, 0.25)', display: 'flex', gap: '0.65rem', background: 'rgba(14, 12, 38, 0.9)' }}>
              <input
                type="text"
                placeholder={`Ask ${copilotTitle} anything...`}
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                style={{
                  flex: 1,
                  background: 'rgba(0, 0, 0, 0.5)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: '6px',
                  padding: '0.55rem 0.85rem',
                  color: '#ffffff',
                  fontSize: '0.85rem',
                  outline: 'none'
                }}
              />
              <button
                type="submit"
                style={{
                  background: 'linear-gradient(135deg, #ec4899 0%, #d946ef 100%)',
                  border: 'none',
                  color: '#ffffff',
                  padding: '0.55rem 1.25rem',
                  borderRadius: '6px',
                  fontWeight: 800,
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  boxShadow: '0 0 15px rgba(236, 72, 153, 0.4)'
                }}
              >
                <span>Send</span>
                <Send size={14} />
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
