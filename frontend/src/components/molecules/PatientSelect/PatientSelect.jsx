import React from 'react';
import FormField from '../FormField/FormField'; // Use the generic FormField
import SearchableSelect from '../SearchableSelect/SearchableSelect';
// styles from './PatientSelect.module.css' might not be needed

const PatientSelect = ({
  value,
  onChange, // This onChange is for the SearchableSelect value
  onBlur,
  patientOptions,
  errors = {},
  touched = {},
  name = "patient_id", // Name for FormField (label, error association)
  label = "Paciente",
  required = true, // Default required to true as per original FormGroup
  ...rest // Pass other props to FormField or SearchableSelect
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
