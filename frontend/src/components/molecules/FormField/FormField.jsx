import React, { useMemo, useCallback } from 'react';
import styles from './FormField.module.css';
import Label from '../../atoms/Label/Label';
import Input from '../../atoms/Input/Input';
import Textarea from '../../atoms/Textarea/Textarea';
import Select from '../../atoms/Select/Select';
import HelperText from '../../atoms/HelperText/HelperText';
import FormErrorIcon from '../../atoms/FormErrorIcon/FormErrorIcon';
import { sanitizeText, sanitizeInputText, sanitizeEmail, sanitizePhone, sanitizeDNI, sanitizeDate, sanitizeTime } from '../../../utils/sanitization'; // Note: sanitizeValue is defined but not used.

/**
 * @typedef {('text'|'password'|'email'|'number'|'search'|'tel'|'url'|'date'|'time'|'textarea'|'select')} FormFieldType
 * @typedef {('text'|'email'|'phone'|'dni'|'date'|'time')} SanitizeType
 */

/**
 * FormField is a generic molecule that wraps a form input element (Input, Textarea, Select)
 * with a Label, an optional error/helper message, and an error icon.
 * It handles common form field structure and state display.
 *
 * @param {object} props - The component's props.
 * @param {string} [props.label] - The text label for the form field.
 * @param {string} props.name - The name attribute for the input, used for `htmlFor` in Label and as `id`.
 * @param {FormFieldType} [props.type='text'] - The type of input field to render ('text', 'textarea', 'select', etc.).
 * @param {string|number} [props.value=''] - The current value of the form field.
 * @param {function} props.onChange - Callback function invoked when the field's value changes.
 * @param {function} [props.onBlur] - Callback function invoked when the field loses focus.
 * @param {string} [props.error] - Error message to display for the field. If present, field is styled as error.
 * @param {string} [props.helperText] - Optional helper text to display below the field.
 * @param {boolean} [props.required=false] - If true, marks the label as required. Passed to underlying input if applicable.
 * @param {boolean} [props.disabled=false] - If true, disables the form field.
 * @param {string} [props.placeholder] - Placeholder text for the input field (if applicable).
 * @param {SanitizeType} [props.sanitizeType='text'] - The type of sanitization to apply (Note: sanitization logic is defined but not currently wired up in this component's onChange).
 * @param {string} [props.className=''] - Additional CSS classes to apply to the FormField's root div.
 * @param {React.ReactNode} [props.children] - Optional. If provided, this will be rendered as the input control instead of the default Input/Textarea/Select.
 * @param {object} [props.validationRules] - (Not directly used by FormField display logic, but can be passed down if children or props handle it).
 * @param {object} [props.props] - Any other props will be spread onto the underlying Input, Textarea, or Select component (unless children are provided).
 * @returns {JSX.Element} The rendered form field component.
 */
const FormField = React.memo(({
  label,
  name,
  type = 'text',
  value = '',
  onChange,
  onBlur,
  error,
  helperText,
  required = false,
  disabled = false,
  placeholder,
  sanitizeType = 'text', // Note: sanitizeValue function is defined but not currently used in handleChange
  className = '',
  children,
  validationRules, // Not directly used in rendering logic of FormField itself
  ...props
}) => {
  // Sanitización según tipo (Note: this function is not currently called by handleChange)
  const sanitizeValue = useCallback((valueToSanitize) => {
    switch (sanitizeType) {
      case 'email':
        return sanitizeEmail(value);
      case 'phone':
        return sanitizePhone(value);
      case 'dni':
        return sanitizeDNI(value);
      case 'date':
        return sanitizeDate(value);
      case 'time':
        return sanitizeTime(value);
      case 'text':
      default:
        return sanitizeInputText(value);
    }
  }, [sanitizeType]);

  // Manejar cambio de valor
  const handleChange = useCallback((e) => {
    // Pasar el evento directamente sin modificaciones
    if (onChange) {
      onChange(e);
    }
  }, [onChange]);

  // Clases CSS
  const fieldClasses = useMemo(() => {
    return [
      styles.formField,
      error ? styles.error : '',
      disabled ? styles.disabled : '',
      className
    ].filter(Boolean).join(' ');
  }, [error, disabled, className]);

  // Props para Input (filtrar props que no deben llegar al DOM)
  const inputProps = useMemo(() => {
    const { error: _, validationRules: __, helperText: ___, ...restProps } = props;
    return {
      ...restProps,
      id: name,
      name: name,
      type: type,
      value: value,
      onChange: handleChange,
      onBlur: onBlur,
      disabled: disabled,
      placeholder: placeholder
    };
  }, [props, name, type, value, handleChange, onBlur, disabled, placeholder]);

  return (
    <div className={fieldClasses}>
      {label && (
        <Label htmlFor={name} required={required} className={styles.label}>
          {label}
        </Label>
      )}
      <div className={styles.inputWrapper}>
        {children ? (
          React.isValidElement(children) ? children : null
        ) : type === 'textarea' ? (
          <Textarea 
            id={name} 
            value={value} 
            onChange={handleChange} 
            onBlur={onBlur} 
            required={required} 
            {...inputProps}
          />
        ) : type === 'select' ? (
          <Select 
            id={name} 
            value={value} 
            onChange={handleChange} 
            onBlur={onBlur} 
            required={required} 
            {...inputProps}
          />
        ) : (
          <Input
            {...inputProps}
            className={error ? styles.inputError : ''}
          />
        )}
        {error && <FormErrorIcon className={styles.errorIcon} />}
      </div>
      {(helperText || error) && (
        <HelperText type={error ? 'error' : 'helper'} className={error ? styles.errorText : styles.helperText}>
          {error || helperText}
        </HelperText>
      )}
    </div>
  );
});

FormField.displayName = 'FormField';

export default FormField; 