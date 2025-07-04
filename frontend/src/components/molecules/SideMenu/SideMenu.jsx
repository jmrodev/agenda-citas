import React from 'react';
import SideMenuButton from '../../atoms/SideMenuButton/SideMenuButton';
import styles from './SideMenu.module.css';

const SideMenu = ({ items, activeIndex, onMenuClick, isCollapsed, onToggleCollapse }) => (
  <nav className={`${styles.sideMenu} ${isCollapsed ? styles.collapsed : ''}`}>
    <div className={styles.toggleButton}>
      <button
        className={styles.collapseButton}
        onClick={onToggleCollapse}
        type="button"
        aria-label={isCollapsed ? "Expandir menú" : "Colapsar menú"}
      >
        <span className={styles.collapseIcon}>◀</span>
      </button>
    </div>
    {items.map((item, idx) => (
      <SideMenuButton
        key={item.label}
        icon={item.icon}
        label={item.label}
        onClick={() => onMenuClick(idx)}
        active={activeIndex === idx}
        isCollapsed={isCollapsed}
      />
    ))}
  </nav>
);

export default SideMenu; 