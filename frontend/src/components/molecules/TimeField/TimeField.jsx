import React from 'react';
import FormField from '../FormField/FormField';
// TimeField.module.css was deleted as its only style (error) is handled by FormField.

/**
 * TimeField is a specialized molecule for time input.
 * It wraps the generic FormField component with configurations specific to time.
 *
 * @param {object} props - The component's props.
 * @param {string} props.value - The current value of the time field (e.g., "HH:MM").
 * @param {function} props.onChange - Callback function invoked when the time value changes.
 * @param {function} [props.onBlur] - Callback function invoked when the field loses focus.
 * @param {object} [props.errors={}] - Object containing validation errors.
 * @param {object} [props.touched={}] - Object indicating which fields have been touched.
 * @param {string} [props.name="time"] - The name attribute for the input field.
 * @param {string} [props.label="Hora"] - The text label for the time field.
 * @param {boolean} [props.required] - If true, marks the field as required.
 * @param {object} [props.rest] - Any other props will be spread onto the underlying FormField and subsequently to the Input atom.
 * @returns {JSX.Element} The rendered time field component.
 */
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
