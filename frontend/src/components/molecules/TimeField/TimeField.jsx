import React from 'react';
import FormField from '../FormField/FormField';
// styles from './TimeField.module.css' might not be needed

const TimeField = ({
  value,
  onChange,
  onBlur,
  errors = {},
  touched = {},
  name = "time",
  label = "Hora",
  ...rest
}) => {
  const errorMessage = touched[name] && errors[name] ? errors[name] : undefined;

  return (
    <FormField
      label={label}
      name={name}
      type="time"
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      error={errorMessage}
      required={rest.required}
      sanitizeType="time" // FormField has sanitizeTime
      {...rest}
    />
  );
};

export default TimeField;
