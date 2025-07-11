import React from 'react';
import FormGroup from '../../molecules/FormGroup/FormGroup';
import SearchableSelect from '../../molecules/SearchableSelect/SearchableSelect';
import styles from './PatientSelect.module.css';

const PatientSelect = ({
  value,
  onChange,
  patientOptions,
  errors = {},
  touched = {}
}) => {
  return (
    <FormGroup title="Paciente" required>
      <SearchableSelect
        name="patient_id"
        value={value || ''}
        onChange={onChange}
        required
        placeholder="Buscar paciente por nombre, apellido o DNI..."
        searchFields={['label', 'firstName', 'lastName', 'dni']}
        options={patientOptions}
      />
      {errors.patient_id && touched.patient_id && (
        <div className={styles.error}>{errors.patient_id}</div>
      )}
    </FormGroup>
  );
};

export default PatientSelect; 