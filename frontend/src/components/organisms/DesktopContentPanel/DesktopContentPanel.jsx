import React from 'react';
import styles from './DesktopContentPanel.module.css';

const DesktopContentPanel = ({ children }) => (
  <div className={styles.contentPanel}>
    {children}
  </div>
);

export default DesktopContentPanel; 