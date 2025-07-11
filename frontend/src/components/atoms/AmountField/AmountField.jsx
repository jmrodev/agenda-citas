import React from 'react';
import FormGroup from '../../molecules/FormGroup/FormGroup';
import Input from '../Input/Input';
import styles from './AmountField.module.css';

const AmountField = ({ value, onChange, errors = {}, touched = {} }) => {
  return (
    <FormGroup title="Monto (€)" required>
      <Input
        type="number"
        name="amount"
        value={value}
        onChange={onChange}
        min="0"
        step="0.01"
        placeholder="0.00"
        required
      />
      {errors.amount && touched.amount && (
        <div className={styles.error}>{errors.amount}</div>
      )}
    </FormGroup>
  );
};

export default AmountField; 