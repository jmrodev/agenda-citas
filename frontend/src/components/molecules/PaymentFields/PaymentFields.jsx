import React from 'react';
import FormGroup from '../FormGroup/FormGroup';
import Select from '../../atoms/Select/Select';
import Input from '../../atoms/Input/Input'; // Changed AmountField to Input
import styles from './PaymentFields.module.css';

const PaymentFields = ({
  formData,
  onChange,
  errors = {},
  touched = {}
}) => {
  return (
    <div className={styles.row}>
      <Input
        name="amount"
        type="number"
        value={formData.amount}
        onChange={onChange}
        errors={errors}
        touched={touched}
      />

      <FormGroup title="Método de pago">
        <Select
          name="payment_method"
          value={formData.payment_method}
          onChange={onChange}
          options={[
            { value: 'efectivo', label: 'Efectivo' },
            { value: 'tarjeta', label: 'Tarjeta' },
            { value: 'transferencia', label: 'Transferencia' },
            { value: 'débito', label: 'Débito' }
          ]}
        />
      </FormGroup>
    </div>
  );
};

export default PaymentFields; 