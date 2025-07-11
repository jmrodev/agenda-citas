import React from 'react';
import FormField from '../FormField/FormField'; // Use the generic FormField
import SearchableSelect from '../SearchableSelect/SearchableSelect';
// PatientSelect.module.css was deleted as its only style (error) is handled by FormField.

/**
 * PatientSelect is a specialized molecule for selecting a patient.
 * It wraps a SearchableSelect component within a FormField for consistent labeling and error handling.
 *
 * @param {object} props - The component's props.
 * @param {string|number} props.value - The current value of the selected patient (typically patient ID).
 * @param {function} props.onChange - Callback function invoked when the selected patient changes.
 * @param {function} [props.onBlur] - Callback function invoked when the field loses focus.
 * @param {Array<object>} props.patientOptions - Array of patient options for the SearchableSelect. Each option should be an object (e.g., { value: '1', label: 'John Doe', firstName: 'John', ...}).
 * @param {object} [props.errors={}] - Object containing validation errors.
 * @param {object} [props.touched={}] - Object indicating which fields have been touched.
 * @param {string} [props.name="patient_id"] - The name attribute for the field, used for label association and error mapping.
 * @param {string} [props.label="Paciente"] - The text label for the patient select field.
 * @param {boolean} [props.required=true] - If true, marks the field as required.
 * @param {string} [props.placeholder="Buscar paciente por nombre, apellido o DNI..."] - Placeholder for the SearchableSelect.
 * @param {Array<string>} [props.searchFields=['label', 'firstName', 'lastName', 'dni']] - Fields to search against in patientOptions.
 * @param {object} [props.rest] - Any other props. Props not explicitly used by PatientSelect or FormField will be passed to SearchableSelect.
 * @returns {JSX.Element} The rendered patient select component.
 */
const PatientSelect = ({
  value,
  onChange,
  onBlur,
  patientOptions,
  errors = {},
  touched = {},
  name = "patient_id",
  label = "Paciente",
  required = true,
  ...rest
}) => {
  const errorMessage = touched[name] && errors[name] ? errors[name] : undefined;

  // Props specifically for SearchableSelect
  const { className, ...searchableSelectProps } = rest;


  return (
    <FormField
      label={label}
      name={name}
      error={errorMessage}
      required={required}
      className={className} // Pass className to FormField's wrapper
    >
      <SearchableSelect
        name={name} // SearchableSelect also needs a name, typically same as FormField for consistency
        value={value || ''}
        onChange={onChange} // Pass the original onChange to SearchableSelect
        onBlur={onBlur} // Pass onBlur to SearchableSelect
        required={required}
        placeholder={searchableSelectProps.placeholder || "Buscar paciente por nombre, apellido o DNI..."}
        searchFields={searchableSelectProps.searchFields || ['label', 'firstName', 'lastName', 'dni']}
        options={patientOptions}
        // Pass any other specific props for SearchableSelect from ...rest
        {...searchableSelectProps}
      />
    </FormField>
  );
};

export default PatientSelect;
