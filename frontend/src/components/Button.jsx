import React from 'react';
import './Button.css';

export default function Button({ 
  children, 
  variant = 'primary', 
  className = '', 
  fullWidth = false,
  icon: Icon,
  ...props 
}) {
  const classes = `btn btn-${variant} ${fullWidth ? 'w-full' : ''} ${className}`;
  return (
    <button className={classes} {...props}>
      {Icon && <Icon size={20} className="btn-icon" />}
      {children}
    </button>
  );
}
