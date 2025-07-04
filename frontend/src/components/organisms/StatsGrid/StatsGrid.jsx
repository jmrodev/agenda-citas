import React from 'react';
import StatCard from '../../molecules/StatCard/StatCard';
import QuickAction from '../../molecules/QuickAction/QuickAction';
import styles from './StatsGrid.module.css';

const StatsGrid = ({ stats = [], actions = [] }) => (
  <div className={styles.grid}>
    {stats.map((stat, idx) => (
      <StatCard key={'stat-' + idx} {...stat} color={stat.color || 'var(--primary-color)'} />
    ))}
    {actions.length > 0 && <div className={styles.separator} />}
    {actions.length > 0 && actions.map((action, idx) => (
      <QuickAction key={'action-' + idx} {...action} />
    ))}
  </div>
);

export default StatsGrid;
