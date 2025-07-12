import React from 'react';
import Input from '../../atoms/Input/Input'; // Replaced DateField and TimeField
import styles from './DateTimeFields.module.css';

const DateTimeFields = ({
  formData,
  onChange,
  errors = {},
  touched = {}
}) => {
  return (
    <div className={styles.row}>
      <Input
        name="date"
        type="date"
        value={formData.date}
        onChange={onChange}
        errors={errors}
        touched={touched}
      />

      <Input
        name="time"
        type="time"
        value={formData.time}
        onChange={onChange}
        errors={errors}
        touched={touched}
      />
    </div>
  );
};

export default DateTimeFields; 