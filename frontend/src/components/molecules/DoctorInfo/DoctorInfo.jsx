import React from 'react';
import FormField from '../FormField/FormField'; // Use the generic FormField
import styles from './DoctorInfo.module.css'; // Keep its specific styles for content display

const DoctorInfo = ({
  selectedDoctorName,
  errors = {}, // Expects errors object
  touched = {}, // Expects touched object
  name = "doctor_id", // Name for FormField (label, error association)
  label = "Doctor",
  required = true, // Default required as per original
  ...rest // Pass other props to FormField if any
}) => {
  // Assuming errors object might have error for 'name' (e.g., errors.doctor_id)
  const errorMessage = touched[name] && errors[name] ? errors[name] : undefined;

  return (
    <FormField
      label={label}
      name={name}
      error={errorMessage}
      required={required}
      className={styles.formFieldWrapper} // Optional: if DoctorInfo needs specific wrapper style
      {...rest}
      // No 'type' needed as we provide custom children for display
    >
      {selectedDoctorName ? (
        <div className={styles.doctorInfoContent}> {/* Renamed class to avoid conflict if styles.doctorInfo was for FormGroup like structure */}
          <span className={styles.doctorName}>{selectedDoctorName}</span>
          <small className={styles.doctorNote}>Seleccionado desde el calendario</small>
        </div>
      ) : (
        <div className={styles.noDoctorSelected}>
          <span className={styles.warning}>Debe seleccionar un doctor en el calendario</span>
        </div>
      )}
      {/* Error is handled by FormField's HelperText, so direct error rendering here is removed */}
    </FormField>
  );
};

export default DoctorInfo;
