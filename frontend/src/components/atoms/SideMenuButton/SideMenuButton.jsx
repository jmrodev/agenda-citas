import React from 'react';
import styles from './SideMenuButton.module.css';

const SideMenuButton = ({ icon, label, onClick, active, isCollapsed }) => (
  <button
    className={`${styles.sideMenuButton} ${active ? styles.active : ''} ${isCollapsed ? styles.collapsed : ''}`}
    onClick={onClick}
    type='button'
    title={isCollapsed ? label : ''}
  >
    {icon && <span className={styles.icon}>{icon}</span>}
    <span className={styles.label}>{label}</span>
  </button>
);

export default SideMenuButton; 