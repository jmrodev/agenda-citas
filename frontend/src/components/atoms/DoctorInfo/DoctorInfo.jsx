import React from 'react';
import FormGroup from '../../molecules/FormGroup/FormGroup';
import styles from './DoctorInfo.module.css';

const DoctorInfo = ({ selectedDoctorName, errors = {}, touched = {} }) => {
  return (
    <FormGroup title="Doctor" required>
      {selectedDoctorName ? (
        <div className={styles.doctorInfo}>
          <span className={styles.doctorName}>{selectedDoctorName}</span>
          <small className={styles.doctorNote}>Seleccionado desde el calendario</small>
        </div>
      ) : (
        <div className={styles.noDoctorSelected}>
          <span className={styles.warning}>Debe seleccionar un doctor en el calendario</span>
        </div>
      )}
      {errors.doctor_id && touched.doctor_id && (
        <div className={styles.error}>{errors.doctor_id}</div>
      )}
    </FormGroup>
  );
};

export default DoctorInfo; 