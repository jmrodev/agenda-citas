import React from 'react';
import PatientDoctorFields from '../PatientDoctorFields/PatientDoctorFields';
import DateTimeFields from '../DateTimeFields/DateTimeFields';
import AppointmentDetailsFields from '../AppointmentDetailsFields/AppointmentDetailsFields';
import PaymentFields from '../PaymentFields/PaymentFields';
import styles from './AppointmentFormFields.module.css';

const AppointmentFormFields = ({
  formData,
  patientOptions,
  selectedDoctorName,
  onChange,
  errors = {},
  touched = {}
}) => {
  return (
    <div className={styles.formContent}>
      <PatientDoctorFields
        formData={formData}
        patientOptions={patientOptions}
        selectedDoctorName={selectedDoctorName}
        onChange={onChange}
        errors={errors}
        touched={touched}
      />

      <DateTimeFields
        formData={formData}
        onChange={onChange}
        errors={errors}
        touched={touched}
      />

      <AppointmentDetailsFields
        formData={formData}
        onChange={onChange}
        errors={errors}
        touched={touched}
      />

      <PaymentFields
        formData={formData}
        onChange={onChange}
        errors={errors}
        touched={touched}
      />
    </div>
  );
};

export default AppointmentFormFields; 