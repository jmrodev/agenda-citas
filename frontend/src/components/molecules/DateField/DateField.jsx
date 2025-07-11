import React from 'react';
import FormField from '../FormField/FormField';
// DateField.module.css was deleted as its only style (error) is handled by FormField.

/**
 * DateField is a specialized molecule for date input.
 * It wraps the generic FormField component with configurations specific to dates.
 *
 * @param {object} props - The component's props.
 * @param {string} props.value - The current value of the date field (e.g., "YYYY-MM-DD").
 * @param {function} props.onChange - Callback function invoked when the date value changes.
 * @param {function} [props.onBlur] - Callback function invoked when the field loses focus.
 * @param {object} [props.errors={}] - Object containing validation errors.
 * @param {object} [props.touched={}] - Object indicating which fields have been touched.
 * @param {string} [props.name="date"] - The name attribute for the input field.
 * @param {string} [props.label="Fecha"] - The text label for the date field.
 * @param {boolean} [props.required] - If true, marks the field as required.
 * @param {object} [props.rest] - Any other props will be spread onto the underlying FormField and subsequently to the Input atom.
 * @returns {JSX.Element} The rendered date field component.
 */
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
