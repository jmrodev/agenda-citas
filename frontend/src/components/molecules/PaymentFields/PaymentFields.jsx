import React from 'react';
import FormField from '../FormField/FormField';
import Select from '../../atoms/Select/Select';
import Input from '../../atoms/Input/Input';
import styles from './PaymentFields.module.css';

const PaymentFields = ({
  formData,
  onChange,
  onBlur,
  errors = {},
  touched = {}
}) => {
  return (
    <div className={styles.row}>
      <FormField
        label="Monto"
        name="amount"
        error={touched.amount && errors.amount ? errors.amount : undefined}
      >
        <Input
          name="amount"
          type="number"
          value={formData.amount}
          onChange={onChange}
          onBlur={onBlur}
          placeholder="0.00"
          step="0.01"
          min="0"
        />
      </FormField>

      <FormField
        label="Método de pago"
        name="payment_method"
        error={touched.payment_method && errors.payment_method ? errors.payment_method : undefined}
      >
        <Select
          name="payment_method"
          value={formData.payment_method}
          onChange={onChange}
          onBlur={onBlur}
          options={[
            { value: 'efectivo', label: 'Efectivo' },
            { value: 'tarjeta', label: 'Tarjeta' },
            { value: 'transferencia', label: 'Transferencia' },
            { value: 'débito', label: 'Débito' }
          ]}
        />
      </FormField>
    </div>
  );
};

export default PaymentFields; 