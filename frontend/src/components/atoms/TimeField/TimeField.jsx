import React from 'react';
import FormGroup from '../../molecules/FormGroup/FormGroup';
import Input from '../Input/Input';
import styles from './TimeField.module.css';

const TimeField = ({ value, onChange, errors = {}, touched = {} }) => {
  return (
    <FormGroup title="Hora" required>
      <Input
        type="time"
        name="time"
        value={value}
        onChange={onChange}
        required
      />
      {errors.time && touched.time && (
        <div className={styles.error}>{errors.time}</div>
      )}
    </FormGroup>
  );
};

export default TimeField; 