import React from 'react';
import styles from './QuickAction.module.css';

const QuickAction = ({ icon, label, onClick }) => (
  <button className={styles.action} onClick={onClick} type='button'>
    <span className={styles.icon}>{icon}</span>
    <span className={styles.label}>{label}</span>
  </button>
);

export default QuickAction; 