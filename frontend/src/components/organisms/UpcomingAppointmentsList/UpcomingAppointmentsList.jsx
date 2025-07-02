import React from 'react';
import AppointmentListItem from '../../molecules/AppointmentListItem/AppointmentListItem';
import styles from './UpcomingAppointmentsList.module.css';

const UpcomingAppointmentsList = ({ appointments }) => (
  <div className={styles.list}>
    <h3 className={styles.title}>Próximas citas</h3>
    {appointments.length === 0 ? (
      <div className={styles.empty}>No hay citas próximas.</div>
    ) : (
      appointments.map((appt, idx) => (
        <AppointmentListItem key={idx} {...appt} />
      ))
    )}
  </div>
);

export default UpcomingAppointmentsList; 