import React from 'react';
import Select from '../../atoms/Select/Select';
import styles from './DoctorSelector.module.css';

const DoctorSelector = ({ doctors, selectedDoctorId, onChange }) => (
  <div className={styles.doctorSelector}>
    <label className={styles.label}>Doctor:</label>
    <Select
      value={selectedDoctorId}
      onChange={e => onChange(e.target.value)}
      options={doctors.map(doc => ({
        value: doc.doctor_id.toString(),
        label: `${doc.first_name} ${doc.last_name}`
      }))}
      style={{ minWidth: 200 }}
    />
  </div>
);

export default DoctorSelector; 