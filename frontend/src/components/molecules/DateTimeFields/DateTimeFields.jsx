import React from 'react';
import DateField from '../../atoms/DateField/DateField';
import TimeField from '../../atoms/TimeField/TimeField';
import styles from './DateTimeFields.module.css';

const DateTimeFields = ({
  formData,
  onChange,
  errors = {},
  touched = {}
}) => {
  return (
    <div className={styles.row}>
      <DateField
        value={formData.date}
        onChange={onChange}
        errors={errors}
        touched={touched}
      />

      <TimeField
        value={formData.time}
        onChange={onChange}
        errors={errors}
        touched={touched}
      />
    </div>
  );
};

export default DateTimeFields; 