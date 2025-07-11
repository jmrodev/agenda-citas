import React from 'react';
import FormField from '../FormField/FormField'; // Use the generic FormField
// Input atom is not directly used here anymore, FormField handles it.
// styles from './AmountField.module.css' might not be needed if error styling is handled by FormField

const AmountField = ({
  value,
  onChange,
  onBlur, // Pass onBlur if needed by FormField
  errors = {}, // Expects errors object from formik/hook-form
  touched = {}, // Expects touched object
  name = "amount", // Default name, can be overridden by props
  label = "Monto (€)",
  ...rest // Pass other props like placeholder, disabled, etc.
}) => {
  const errorMessage = touched[name] && errors[name] ? errors[name] : undefined;

  return (
    <FormField
      label={label}
      name={name}
      type="number"
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      error={errorMessage}
      placeholder={rest.placeholder || "0.00"}
      min={rest.min || "0"}
      step={rest.step || "0.01"}
      required={rest.required} // Ensure required is passed if set in ...rest
      // sanitizeType="number" // Add if FormField supports numeric sanitization
      {...rest} // Pass down other native input props
    />
  );
};

export default AmountField;
