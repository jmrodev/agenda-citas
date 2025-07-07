import React from 'react';
import styles from './ContentPanel.module.css';

const ContentPanel = ({ children }) => (
  <div className={styles.contentPanel}>
    {children}
  </div>
);

export default ContentPanel; 