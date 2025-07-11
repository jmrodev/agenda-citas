import React from 'react';
import Button from '../Button/Button'; // Import the main Button component
import styles from './SideMenuButton.module.css';

const SideMenuButton = ({ icon, label, onClick, active, isCollapsed, className = '', ...rest }) => (
  <Button
    className={[
      styles.sideMenuButton,
      active ? styles.active : '',
      isCollapsed ? styles.collapsed : '',
      className
    ].join(' ').trim()}
    onClick={onClick}
    title={isCollapsed && label ? label : undefined} // Ensure title is only set if label exists
    {...rest} // Pass other props like aria-label, disabled
  >
    {icon && <span className={styles.icon}>{icon}</span>}
    {/* The label is always rendered; CSS handles visibility for collapsed state */}
    <span className={styles.label}>{label}</span>
  </Button>
);

SideMenuButton.displayName = 'SideMenuButton';

export default SideMenuButton; 