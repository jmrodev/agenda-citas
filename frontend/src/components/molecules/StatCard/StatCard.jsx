import React from 'react';
import styles from './StatCard.module.css';

const StatCard = ({ title, value, icon, color = 'var(--primary-color)' }) => (
  <div className={styles.card} style={{ borderColor: color }}>
    {icon && <div className={styles.icon} style={{ color }}>{icon}</div>}
    <h2 className={styles.title}>{title}</h2>
    <p className={styles.value}>{value}</p>
  </div>
);

export default StatCard; 