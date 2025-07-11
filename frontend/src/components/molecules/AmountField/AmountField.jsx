import React from 'react';
import FormField from '../FormField/FormField'; // Use the generic FormField
// Input atom is not directly used here anymore, FormField handles it.
// AmountField.module.css was deleted as its only style (error) is handled by FormField.

/**
 * AmountField is a specialized molecule for currency amount input.
 * It wraps the generic FormField component with configurations specific to amounts.
 *
 * @param {object} props - The component's props.
 * @param {string|number} props.value - The current value of the amount field.
 * @param {function} props.onChange - Callback function invoked when the amount value changes.
 * @param {function} [props.onBlur] - Callback function invoked when the field loses focus.
 * @param {object} [props.errors={}] - Object containing validation errors, typically from a form library.
 * @param {object} [props.touched={}] - Object indicating which fields have been touched, typically from a form library.
 * @param {string} [props.name="amount"] - The name attribute for the input field.
 * @param {string} [props.label="Monto (€)"] - The text label for the amount field.
 * @param {string} [props.placeholder="0.00"] - Placeholder text for the input.
 * @param {string|number} [props.min="0"] - Minimum allowed value.
 * @param {string|number} [props.step="0.01"] - Step increment for number input.
 * @param {boolean} [props.required] - If true, marks the field as required.
 * @param {object} [props.rest] - Any other props will be spread onto the underlying FormField and subsequently to the Input atom.
 * @returns {JSX.Element} The rendered amount field component.
 */
const AmountField = ({
  value,
  onChange,
  onBlur,
  errors = {},
  touched = {},
  name = "amount",
  label = "Monto (€)",
  ...rest
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
