import React from 'react';
import styles from './AppointmentListItem.module.css';

const AppointmentListItem = ({ time, patient, doctor, status, onClick }) => (
  <div className={styles.item} onClick={onClick} tabIndex={0} role='button'>
    <div className={styles.time}>{time}</div>
    <div className={styles.info}>
      <div className={styles.patient}>{patient}</div>
      <div className={styles.doctor}>{doctor}</div>
    </div>
    <div className={styles.status}>{status}</div>
  </div>
);

export default AppointmentListItem; 