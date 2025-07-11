import React from 'react';
import FormField from '../FormField/FormField';
// ReasonField.module.css was deleted as its only style (error) is handled by FormField.

/**
 * ReasonField is a specialized molecule for a text area input, typically for a "reason" or description.
 * It wraps the generic FormField component with configurations suitable for longer text input.
 *
 * @param {object} props - The component's props.
 * @param {string} props.value - The current value of the reason field.
 * @param {function} props.onChange - Callback function invoked when the reason value changes.
 * @param {function} [props.onBlur] - Callback function invoked when the field loses focus.
 * @param {object} [props.errors={}] - Object containing validation errors.
 * @param {object} [props.touched={}] - Object indicating which fields have been touched.
 * @param {string} [props.name="reason"] - The name attribute for the textarea field.
 * @param {string} [props.label="Motivo de la consulta"] - The text label for the reason field.
 * @param {string} [props.placeholder="Descripción del motivo de la consulta"] - Placeholder text.
 * @param {number|string} [props.maxLength=255] - Maximum length for the textarea.
 * @param {number|string} [props.rows=3] - Default number of rows for the textarea.
 * @param {boolean} [props.required] - If true, marks the field as required.
 * @param {object} [props.rest] - Any other props will be spread onto the underlying FormField and subsequently to the Textarea atom.
 * @returns {JSX.Element} The rendered reason field component.
 */
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
