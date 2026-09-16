import React, { useState, useEffect, useCallback } from 'react';
import { Bell, CheckCheck, X, Loader2, AlertCircle, CheckCircle2, Info, AlertTriangle, RefreshCw } from 'lucide-react';

const API = ''; // Vite proxy: /api/* -> http://localhost:8000/*

const NOTIF_CONFIG = {
  success: { color: '#10b981', bg: 'rgba(16,185,129,0.08)', icon: CheckCircle2 },
  info:    { color: '#3b82f6', bg: 'rgba(59,130,246,0.08)',  icon: Info },
  warning: { color: '#f59e0b', bg: 'rgba(245,158,11,0.08)',  icon: AlertTriangle },
  error:   { color: '#ef4444', bg: 'rgba(239,68,68,0.08)',   icon: AlertCircle },
};

const CATEGORY_ICONS = {
  task:      '✅',
  issue:     '⚠️',
  daily_log: '📋',
  document:  '📄',
  report:    '📊',
  general:   '🔔',
};

export function NotificationsPanel({ userEmail = '', compact = false }) {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const fetchNotifications = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (userEmail) params.append('user_email', userEmail);
      const [notifRes, countRes] = await Promise.all([
        fetch(`${API}/api/notifications/?${params}&limit=30`),
        fetch(`${API}/api/notifications/count${userEmail ? `?user_email=${userEmail}` : ''}`)
      ]);
      if (notifRes.ok) setNotifications(await notifRes.json());
      if (countRes.ok) {
        const countData = await countRes.json();
        setUnreadCount(countData.unread_count || 0);
      }
    } catch { }
  }, [userEmail]);

  useEffect(() => {
    fetchNotifications();
    // Poll every 30 seconds for new notifications
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  const markRead = async (id) => {
    try {
      await fetch(`${API}/api/notifications/${id}/read`, { method: 'PATCH' });
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch { }
  };

  const markAllRead = async () => {
    try {
      const params = userEmail ? `?user_email=${userEmail}` : '';
      await fetch(`${API}/api/notifications/mark-all-read${params}`, { method: 'PATCH' });
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
      setUnreadCount(0);
    } catch { }
  };

  const timeAgo = (dateStr) => {
    const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000);
    if (diff < 60) return 'just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  // Compact: just the bell icon with badge
  if (compact) {
    return (
      <div style={{ position: 'relative' }}>
        <button onClick={() => setOpen(!open)} style={{ position: 'relative', background: open ? 'rgba(168, 85, 247, 0.2)' : 'rgba(255,255,255,0.06)', border: `1px solid ${open ? 'rgba(168, 85, 247, 0.5)' : 'rgba(255,255,255,0.15)'}`, borderRadius: '12px', padding: '0.6rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: open ? '#ffffff' : 'rgba(255,255,255,0.85)', transition: 'all 0.25s ease', boxShadow: open ? '0 0 20px rgba(168, 85, 247, 0.3)' : 'none' }}>
          <Bell size={19} style={{ transition: 'transform 0.3s ease' }} />
          {unreadCount > 0 && (
            <span style={{ position: 'absolute', top: '-5px', right: '-5px', background: 'linear-gradient(135deg, #ef4444 0%, #f97316 100%)', color: 'white', fontSize: '0.68rem', fontWeight: 800, minWidth: '19px', height: '19px', padding: '0 4px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 12px rgba(239, 68, 68, 0.7)', border: '2px solid #060917' }}>
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>
        {open && (
          <div style={{ position: 'absolute', top: '115%', right: 0, zIndex: 9999, width: '380px', background: 'linear-gradient(145deg, rgba(16, 21, 46, 0.96) 0%, rgba(7, 11, 26, 0.98) 100%)', backdropFilter: 'blur(32px)', WebkitBackdropFilter: 'blur(32px)', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.12)', boxShadow: '0 25px 60px -10px rgba(0,0,0,0.85), 0 0 35px rgba(168, 85, 247, 0.22)', overflow: 'hidden' }}>
            <NotificationDropdown notifications={notifications} unreadCount={unreadCount} markRead={markRead} markAllRead={markAllRead} fetchNotifications={fetchNotifications} timeAgo={timeAgo} onClose={() => setOpen(false)} dark={true} />
          </div>
        )}
      </div>
    );
  }

  // Full panel mode
  return (
    <div style={{ fontFamily: 'Plus Jakarta Sans, Inter, system-ui, sans-serif', color: '#f1f5f9', background: 'linear-gradient(145deg, rgba(15, 20, 44, 0.65) 0%, rgba(8, 12, 28, 0.5) 100%)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '24px', padding: '2rem', boxShadow: '0 15px 40px rgba(0,0,0,0.5)', backdropFilter: 'blur(28px)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem', paddingBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800, color: '#ffffff', fontFamily: 'Outfit, Sora, sans-serif', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{ padding: '0.5rem', borderRadius: '12px', background: 'rgba(99, 102, 241, 0.18)', border: '1px solid rgba(99, 102, 241, 0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Bell size={22} color="#818cf8" /> 
            </div>
            Activity Notifications
            {unreadCount > 0 && <span style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#f87171', border: '1px solid rgba(239, 68, 68, 0.4)', fontSize: '0.72rem', fontWeight: 800, padding: '0.2rem 0.65rem', borderRadius: '14px', textTransform: 'uppercase', letterSpacing: '0.04em', boxShadow: '0 0 15px rgba(239, 68, 68, 0.25)' }}>{unreadCount} new</span>}
          </h2>
          <p style={{ margin: '0.35rem 0 0', color: '#94a3b8', fontSize: '0.88rem', fontWeight: 500 }}>Live telemetry and operational activity across all construction portals</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button onClick={fetchNotifications} style={{ padding: '0.65rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.05)', color: '#cbd5e1', cursor: 'pointer', transition: 'all 0.25s ease' }} title="Refresh Feed">
            <RefreshCw size={17} />
          </button>
          {unreadCount > 0 && (
            <button onClick={markAllRead} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.65rem 1.15rem', borderRadius: '12px', border: '1px solid rgba(16, 185, 129, 0.35)', background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 700, transition: 'all 0.25s ease', boxShadow: '0 0 15px rgba(16, 185, 129, 0.2)' }}>
              <CheckCheck size={16} /> Mark All Read
            </button>
          )}
        </div>
      </div>
      <NotificationDropdown notifications={notifications} unreadCount={unreadCount} markRead={markRead} markAllRead={markAllRead} fetchNotifications={fetchNotifications} timeAgo={timeAgo} dark={true} />
    </div>
  );
}

function NotificationDropdown({ notifications, unreadCount, markRead, markAllRead, fetchNotifications, timeAgo, onClose, dark }) {
  const textColor = dark ? '#f8fafc' : '#1e293b';
  const subColor = dark ? '#94a3b8' : '#64748b';
  const borderColor = dark ? 'rgba(255,255,255,0.07)' : '#e2e8f0';
  const bgHover = dark ? 'rgba(255,255,255,0.06)' : '#f8fafc';

  return (
    <>
      {onClose && dark && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.1rem 1.4rem', borderBottom: `1px solid ${borderColor}`, background: 'rgba(0,0,0,0.25)' }}>
          <span style={{ fontWeight: 800, fontSize: '0.98rem', color: textColor, fontFamily: 'Outfit, Sora, sans-serif', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Bell size={17} color="#c084fc" /> Notification Center {unreadCount > 0 && <span style={{ background: '#ef4444', color: 'white', fontSize: '0.68rem', fontWeight: 800, padding: '0.1rem 0.55rem', borderRadius: '10px' }}>{unreadCount}</span>}
          </span>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            {unreadCount > 0 && <button onClick={markAllRead} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#22d3ee', fontSize: '0.78rem', fontWeight: 700, transition: 'color 0.2s' }}>Mark read</button>}
            {onClose && <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.6)', padding: '0.25rem', display: 'flex', alignItems: 'center' }}><X size={18} /></button>}
          </div>
        </div>
      )}
      <div style={{ maxHeight: onClose ? '440px' : '650px', overflowY: 'auto' }}>
        {notifications.length === 0 ? (
          <div style={{ padding: '3.5rem 2rem', textAlign: 'center', color: subColor }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '20px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
              <Bell size={28} style={{ opacity: 0.5, color: '#c084fc' }} />
            </div>
            <p style={{ margin: 0, fontSize: '0.95rem', fontWeight: 600, color: textColor }}>No notifications right now</p>
            <p style={{ margin: '0.4rem 0 0', fontSize: '0.8rem', opacity: 0.7, maxWidth: '240px', marginX: 'auto' }}>When team members update tasks, BIM models, or inspection logs, activity will show up here.</p>
          </div>
        ) : (
          notifications.map(notif => {
            const cfg = NOTIF_CONFIG[notif.notif_type] || NOTIF_CONFIG.info;
            const Icon = cfg.icon;
            const catIcon = CATEGORY_ICONS[notif.category] || '🔔';
            return (
              <div key={notif.id} onClick={() => !notif.is_read && markRead(notif.id)} style={{ padding: '1.1rem 1.4rem', borderBottom: `1px solid ${borderColor}`, cursor: notif.is_read ? 'default' : 'pointer', display: 'flex', gap: '1rem', alignItems: 'flex-start', background: notif.is_read ? 'transparent' : 'rgba(168, 85, 247, 0.1)', transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)' }} onMouseOver={e => { if (!notif.is_read) e.currentTarget.style.background = 'rgba(168, 85, 247, 0.16)'; else e.currentTarget.style.background = bgHover; }} onMouseOut={e => { if (!notif.is_read) e.currentTarget.style.background = 'rgba(168, 85, 247, 0.1)'; else e.currentTarget.style.background = 'transparent'; }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '12px', background: cfg.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: `1px solid ${cfg.color}50`, boxShadow: `0 0 12px ${cfg.color}30` }}>
                  <Icon size={18} color={cfg.color} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.75rem' }}>
                    <p style={{ margin: 0, fontSize: '0.88rem', color: textColor, lineHeight: 1.45, fontWeight: notif.is_read ? 500 : 700 }}>
                      <span style={{ marginRight: '0.4rem' }}>{catIcon}</span>{notif.message}
                    </p>
                    {!notif.is_read && <div style={{ width: '9px', height: '9px', borderRadius: '50%', background: '#22d3ee', flexShrink: 0, marginTop: '6px', boxShadow: '0 0 10px #22d3ee' }} />}
                  </div>
                  <span style={{ fontSize: '0.75rem', color: subColor, fontWeight: 500, display: 'block', marginTop: '0.35rem' }}>{timeAgo(notif.created_at)}</span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </>
  );
}

