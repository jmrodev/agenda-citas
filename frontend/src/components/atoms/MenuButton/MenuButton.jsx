import React, { forwardRef } from 'react';
import styles from './MenuButton.module.css';

const MenuButton = forwardRef(({ icon, label, onClick, active }, ref) => (
  <button
    ref={ref}
    className={styles.menuButton + (active ? ' ' + styles.active : '')}
    onClick={onClick}
    type='button'
  >
    {icon && <span className={styles.icon}>{icon}</span>}
    <span className={styles.label}>{label}</span>
  </button>
));

export default MenuButton; 