import React from 'react';
import PatientSelect from '../PatientSelect/PatientSelect';
import DoctorInfo from '../DoctorInfo/DoctorInfo';
import styles from './PatientDoctorFields.module.css';

const PatientDoctorFields = ({
  formData,
  patientOptions,
  selectedDoctorName,
  onChange,
  errors = {},
  touched = {}
}) => {
  return (
    <div className={styles.row}>
      <PatientSelect
        value={formData.patient_id}
        onChange={onChange}
        patientOptions={patientOptions}
        errors={errors}
        touched={touched}
      />

      <DoctorInfo
        selectedDoctorName={selectedDoctorName}
        errors={errors}
        touched={touched}
      />
    </div>
  );
};

export default PatientDoctorFields; 