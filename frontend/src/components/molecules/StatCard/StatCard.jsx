import React from 'react';
import styles from './StatCard.module.css';

const StatCard = ({ title, value, icon, className = '' }) => (
  <div className={`${styles.card} ${className}`}>
    {icon && <div className={styles.icon}>{icon}</div>} {/* Icon color will be handled by parent's CSS module targeting styles.icon */}
    <h2 className={styles.title}>{title}</h2>
    <p className={styles.value}>{value}</p>
  </div>
);

export default StatCard; 