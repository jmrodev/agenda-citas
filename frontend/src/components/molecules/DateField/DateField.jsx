import React from 'react';
import FormField from '../FormField/FormField';
// styles from './DateField.module.css' might not be needed

const DateField = ({
  value,
  onChange,
  onBlur,
  errors = {},
  touched = {},
  name = "date",
  label = "Fecha",
  ...rest
}) => {
  const errorMessage = touched[name] && errors[name] ? errors[name] : undefined;

  return (
    <FormField
      label={label}
      name={name}
      type="date"
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      error={errorMessage}
      required={rest.required}
      sanitizeType="date" // FormField has sanitizeDate
      {...rest}
    />
  );
};

export default DateField;
