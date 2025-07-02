import React from 'react';
import styles from './StatCard.module.css';

const StatCard = ({ icon, label, value, color = 'var(--primary)' }) => (
  <div className={styles.card} style={{ borderColor: color }}>
    <div className={styles.icon} style={{ color }}>{icon}</div>
    <div className={styles.value}>{value}</div>
    <div className={styles.label}>{label}</div>
  </div>
);

export default StatCard; 