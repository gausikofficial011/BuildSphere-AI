import React from 'react';
import './Input.css';

export default function Input({
  label,
  type = 'text',
  className = '',
  id,
  error,
  icon: Icon,
  onIconClick,
  ...props
}) {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className={`input-group ${className}`}>
      {label && <label htmlFor={inputId} className="input-label">{label}</label>}
      <div className="input-wrapper">
        <input
          id={inputId}
          type={type}
          className={`input-field ${error ? 'input-error' : ''} ${Icon ? 'has-icon' : ''}`}
          {...props}
        />
        {Icon && (
          <button 
            type="button" 
            className="icon-btn" 
            onClick={onIconClick}
            disabled={!onIconClick}
            tabIndex={onIconClick ? 0 : -1}
          >
            <Icon size={18} className="input-icon" />
          </button>
        )}
      </div>
      {error && <span className="input-error-msg">{error}</span>}
    </div>
  );
}
