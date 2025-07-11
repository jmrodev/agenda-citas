import React from 'react';
import FormGroup from '../../molecules/FormGroup/FormGroup';
import Input from '../Input/Input';
import styles from './DateField.module.css';

const DateField = ({ value, onChange, errors = {}, touched = {} }) => {
  return (
    <FormGroup title="Fecha" required>
      <Input
        type="date"
        name="date"
        value={value}
        onChange={onChange}
        required
      />
      {errors.date && touched.date && (
        <div className={styles.error}>{errors.date}</div>
      )}
    </FormGroup>
  );
};

export default DateField; 