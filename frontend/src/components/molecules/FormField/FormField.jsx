import React, { useMemo, useCallback } from 'react';
import styles from './FormField.module.css';
import Label from '../../atoms/Label/Label';
import Input from '../../atoms/Input/Input';
import Textarea from '../../atoms/Textarea/Textarea';
import Select from '../../atoms/Select/Select';
import HelperText from '../../atoms/HelperText/HelperText';
import FormErrorIcon from '../../atoms/FormErrorIcon/FormErrorIcon';
import { sanitizeText, sanitizeInputText, sanitizeEmail, sanitizePhone, sanitizeDNI, sanitizeDate, sanitizeTime } from '../../../utils/sanitization';

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
  sanitizeType = 'text',
  className = '',
  children,
  validationRules,
  ...props
}) => {
  // Sanitización según tipo
  const sanitizeValue = useCallback((value) => {
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
    const { error: _, validationRules: __, ...restProps } = props;
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
          children
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