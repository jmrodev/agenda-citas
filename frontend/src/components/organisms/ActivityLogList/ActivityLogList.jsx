import React from 'react';
import ActivityLogItem from '../../molecules/ActivityLogItem/ActivityLogItem';
import styles from './ActivityLogList.module.css';

const ActivityLogList = ({ activities }) => (
  <div className={styles.list}>
    <h3 className={styles.title}>Actividad de secretarias</h3>
    {activities.length === 0 ? (
      <div className={styles.empty}>No hay actividades recientes.</div>
    ) : (
      activities.map((activity, idx) => (
        <ActivityLogItem key={idx} {...activity} />
      ))
    )}
  </div>
);

export default ActivityLogList; 