import React from 'react';
import styles from './Input.module.css';

/**
 * @typedef {('text'|'password'|'email'|'number'|'search'|'tel'|'url'|'date'|'time'|'datetime-local')} InputType
 */

/**
 * Input component is a wrapper around the native HTML input element,
 * providing consistent styling and handling common input attributes.
 *
 * @param {object} props - The component's props.
 * @param {InputType} [props.type='text'] - The type of the input field.
 * @param {string|number} [props.value=''] - The current value of the input field.
 * @param {function} props.onChange - Callback function invoked when the input value changes. Receives the native event.
 * @param {string} [props.placeholder=''] - Placeholder text for the input field.
 * @param {string} [props.className=''] - Additional CSS classes to apply to the input element.
 * @param {boolean} [props.disabled=false] - If true, disables the input field.
 * @param {boolean} [props.required=false] - If true, marks the input field as required.
 * @param {string} [props.ariaLabel] - Aria-label for accessibility. Essential if no visible label is associated.
 * @param {string} [props.name] - The name attribute for the input field.
 * @param {function} [props.onBlur] - Callback function invoked when the input field loses focus.
 * @param {object} [props.rest] - Any other native HTML input attributes will be spread onto the input element.
 * @returns {JSX.Element} The rendered input component.
 */
const Input = React.memo(({
  type = 'text',
  value = '',
  onChange,
  placeholder = '',
  className = '',
  disabled = false,
  required = false,
  'aria-label': ariaLabel,
  ...rest
}) => {
  // Ensure value is not null or undefined to prevent React warnings for uncontrolled components
  const currentValue = value === null || value === undefined ? '' : value;

  return (
    <input
      value={currentValue}
      type={type}
      onChange={onChange}
      placeholder={placeholder}
      className={[styles.input, className].join(' ').trim()}
      disabled={disabled}
      required={required}
      aria-label={ariaLabel}
      {...rest}
    />
  );
});

Input.displayName = 'Input';

export default Input; 