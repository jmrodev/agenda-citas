import React from 'react';
import StatCard from '../../molecules/StatCard/StatCard';
import styles from './StatsGrid.module.css';

const StatsGrid = ({ stats }) => (
  <div className={styles.grid}>
    {stats.map((stat, idx) => (
      <StatCard key={idx} {...stat} />
    ))}
  </div>
);

export default StatsGrid;
