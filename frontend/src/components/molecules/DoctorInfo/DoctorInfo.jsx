import React from 'react';
import FormField from '../FormField/FormField'; // Use the generic FormField
import styles from './DoctorInfo.module.css'; // Keep its specific styles for content display

/**
 * DoctorInfo is a molecule that displays information about a selected doctor
 * or a prompt if no doctor is selected. It's typically used in forms where
 * a doctor selection is required and might have associated validation errors.
 * It uses FormField for consistent labeling and error display.
 *
 * @param {object} props - The component's props.
 * @param {string} [props.selectedDoctorName] - The name of the currently selected doctor.
 * @param {object} [props.errors={}] - Object containing validation errors, typically for 'doctor_id'.
 * @param {object} [props.touched={}] - Object indicating if the 'doctor_id' field has been touched.
 * @param {string} [props.name="doctor_id"] - The logical name for this field, used for error mapping and label association.
 * @param {string} [props.label="Doctor"] - The text label for this information block.
 * @param {boolean} [props.required=true] - If true, marks the label as required.
 * @param {object} [props.rest] - Any other props will be passed to the underlying FormField component.
 * @returns {JSX.Element} The rendered doctor information component.
 */
const DoctorInfo = ({
  selectedDoctorName,
  errors = {},
  touched = {},
  name = "doctor_id",
  label = "Doctor",
  required = true,
  ...rest
}) => {
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
