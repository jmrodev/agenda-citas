import React from 'react';
import FormField from '../FormField/FormField';
import Input from '../../atoms/Input/Input';
import styles from './DateTimeFields.module.css';

const DateTimeFields = ({
  formData,
  onChange,
  onBlur,
  errors = {},
  touched = {}
}) => {
  return (
    <div className={styles.row}>
      <FormField
        label="Fecha"
        name="date"
        error={touched.date && errors.date ? errors.date : undefined}
        required
      >
        <Input
          name="date"
          type="date"
          value={formData.date}
          onChange={onChange}
          onBlur={onBlur}
        />
      </FormField>

      <FormField
        label="Hora"
        name="time"
        error={touched.time && errors.time ? errors.time : undefined}
        required
      >
        <Input
          name="time"
          type="time"
          value={formData.time}
          onChange={onChange}
          onBlur={onBlur}
        />
      </FormField>
    </div>
  );
};

export default DateTimeFields; 