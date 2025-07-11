import React from 'react';
import FormGroup from '../../molecules/FormGroup/FormGroup';
import Input from '../Input/Input';
import styles from './ReasonField.module.css';

const ReasonField = ({ value, onChange, errors = {}, touched = {} }) => {
  return (
    <FormGroup title="Motivo de la consulta" required>
      <Input
        type="text"
        name="reason"
        value={value}
        onChange={onChange}
        placeholder="Descripción del motivo de la consulta"
        maxLength={255}
        required
      />
      {errors.reason && touched.reason && (
        <div className={styles.error}>{errors.reason}</div>
      )}
    </FormGroup>
  );
};

export default ReasonField; 