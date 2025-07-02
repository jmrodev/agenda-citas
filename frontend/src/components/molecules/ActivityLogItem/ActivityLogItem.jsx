import React from 'react';
import styles from './ActivityLogItem.module.css';

const ActivityLogItem = ({ time, secretary, activityType, detail }) => (
  <div className={styles.item}>
    <div className={styles.time}>{time}</div>
    <div className={styles.info}>
      <div className={styles.activityType}>{activityType}</div>
      <div className={styles.detail}>{detail}</div>
    </div>
    <div className={styles.secretary}>{secretary}</div>
  </div>
);

export default ActivityLogItem; 