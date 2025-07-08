import React from 'react';
import styles from './ActivityLogItem.module.css';

const ActivityLogItem = ({ time, secretary, activityType, detail }) => (
  <div className={styles.item} data-testid="activity-log-item">
    <div className={styles.time} data-testid="activity-time">{time}</div>
    <div className={styles.info}>
      <div className={styles.activityType} data-testid="activity-type">{activityType}</div>
      <div className={styles.detail} data-testid="activity-detail">{detail}</div>
    </div>
    <div className={styles.secretary} data-testid="activity-secretary">{secretary}</div>
  </div>
);

export default ActivityLogItem; 