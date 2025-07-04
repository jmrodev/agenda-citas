import React from 'react';
import styles from './DoctorSelector.module.css';

const DoctorSelector = ({ doctors, selectedDoctor, onSelect, onClose }) => {
  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.selector} onClick={e => e.stopPropagation()}>
        <h3 className={styles.title}>Selecciona un doctor</h3>
        <ul className={styles.list}>
          {doctors.map(doctor => (
            <li
              key={doctor.id || doctor.doctor_id}
              className={(doctor.id || doctor.doctor_id) === (selectedDoctor.id || selectedDoctor.doctor_id) ? styles.selected : ''}
              onClick={() => onSelect(doctor.id || doctor.doctor_id)}
            >
              {doctor.name || `Dr. ${doctor.first_name} ${doctor.last_name}`}
            </li>
          ))}
        </ul>
        <button className={styles.closeBtn} onClick={onClose}>Cerrar</button>
      </div>
    </div>
  );
};

export default DoctorSelector; 