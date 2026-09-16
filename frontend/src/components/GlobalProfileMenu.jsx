import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AlertTriangle, LogOut, Trash2, X
} from 'lucide-react';
import './GlobalProfileMenu.css';

export default function GlobalProfileMenu() {
  const [menuState, setMenuState] = useState({ open: false, x: 0, y: 0 });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClick = (e) => {
      // Check if click is inside an open menu or modal
      if (e.target.closest('.global-profile-menu') || e.target.closest('.delete-account-modal')) {
        return;
      }

      // Check if click is on a profile element
      // We look for common classes used across all dashboards for the user profile
      const profileTarget = 
        e.target.closest('.user-profile, .pm-user, .org-user, .superadmin-user, [class*="-user"], .header-right > div:last-child');

      if (profileTarget) {
        e.preventDefault();
        const rect = profileTarget.getBoundingClientRect();
        
        // Position menu below the profile element
        setMenuState({
          open: true,
          x: rect.right, // align right edge
          y: rect.bottom + 10
        });
      } else {
        // Clicked outside, close menu
        setMenuState(prev => ({ ...prev, open: false }));
      }
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  const handleLogout = () => {
    setMenuState({ open: false, x: 0, y: 0 });
    // Clear any auth tokens/state here if needed
    localStorage.clear();
    navigate('/login');
  };

  const confirmDelete = () => {
    setMenuState({ open: false, x: 0, y: 0 });
    setShowDeleteModal(true);
  };

  const handleDeleteAccount = () => {
    setShowDeleteModal(false);
    // Execute account deletion logic here
    localStorage.clear();
    navigate('/login');
  };

  return (
    <>
      {menuState.open && (
        <div 
          className="global-profile-menu"
          style={{ 
            position: 'fixed', 
            top: `${menuState.y}px`, 
            left: `${menuState.x}px`,
            transform: 'translateX(-100%)', // Shift left by 100% so right edge aligns with x
            zIndex: 9999 
          }}
        >
          <div className="profile-menu-header">
            <span className="profile-menu-title">Account Options</span>
          </div>
          <button className="profile-menu-item" onClick={handleLogout}>
            <LogOut size={16} />
            <span>Logout</span>
          </button>
          <div className="profile-menu-divider"></div>
          <button className="profile-menu-item danger" onClick={confirmDelete}>
            <Trash2 size={16} />
            <span>Delete Account</span>
          </button>
        </div>
      )}

      {showDeleteModal && (
        <div className="delete-modal-overlay">
          <div className="delete-account-modal">
            <button className="close-btn" onClick={() => setShowDeleteModal(false)}>
              <X size={20} />
            </button>
            <div className="modal-icon-container">
              <AlertTriangle size={32} color="#ef4444" />
            </div>
            <h3>Delete Account?</h3>
            <p>
              Are you sure you want to permanently delete this account? All associated project data, documents, and settings will be removed. This action <strong>cannot be undone</strong>.
            </p>
            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setShowDeleteModal(false)}>Cancel</button>
              <button className="btn-delete" onClick={handleDeleteAccount}>Yes, Delete Account</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
