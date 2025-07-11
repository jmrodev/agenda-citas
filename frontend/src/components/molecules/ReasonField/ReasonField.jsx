import React from 'react';
import FormField from '../FormField/FormField';
// styles from './ReasonField.module.css' might not be needed

const ReasonField = ({
  value,
  onChange,
  onBlur,
  errors = {},
  touched = {},
  name = "reason",
  label = "Motivo de la consulta",
  ...rest
}) => {
  const errorMessage = touched[name] && errors[name] ? errors[name] : undefined;

  return (
    <FormField
      label={label}
      name={name}
      type="textarea" // Reason for consultation is often a textarea
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      error={errorMessage}
      placeholder={rest.placeholder || "Descripción del motivo de la consulta"}
      maxLength={rest.maxLength || 255}
      required={rest.required}
      sanitizeType="text" // Default text sanitization
      rows={rest.rows || 3} // Default rows for textarea
      {...rest}
    />
  );
};

export default ReasonField;
