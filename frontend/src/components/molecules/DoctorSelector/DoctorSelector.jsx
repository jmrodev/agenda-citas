import React from 'react';
import styles from './DoctorSelector.module.css';

const DoctorSelector = ({ doctors, selectedDoctor, onSelect, onClose, variant = 'modal', style = {}, ...rest }) => {
  const content = (
    <div className={styles.selector} style={style} onClick={e => e.stopPropagation()}>
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
      {onClose && <button className={styles.closeBtn} onClick={onClose}>Cerrar</button>}
    </div>
  );

  if (variant === 'modal') {
    return (
      <div className={styles.overlay} onClick={onClose}>
        {content}
      </div>
    );
  }
  if (variant === 'dropdown') {
    return (
      <div className={styles.dropdown} onClick={e => e.stopPropagation()}>
        {content}
      </div>
    );
  }
  // inline
  return content;
};

export default DoctorSelector; 