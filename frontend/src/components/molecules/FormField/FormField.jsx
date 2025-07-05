import React, { useState, useCallback, useMemo } from 'react';
import styles from './FormField.module.css';
import Label from '../../atoms/Label/Label';
import Input from '../../atoms/Input/Input';
import Textarea from '../../atoms/Textarea/Textarea';
import Select from '../../atoms/Select/Select';
import HelperText from '../../atoms/HelperText/HelperText';
import FormErrorIcon from '../../atoms/FormErrorIcon/FormErrorIcon';
import { validateField } from '../../../utils/validation';
import { sanitizeText, sanitizeEmail, sanitizePhone, sanitizeDNI, sanitizeDate, sanitizeTime } from '../../../utils/sanitization';

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
  validationRules = [],
  sanitizeType = 'text',
  className = '',
  children,
  ...props
}) => {
  const [isTouched, setIsTouched] = useState(false);
  const [localError, setLocalError] = useState('');

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
        return sanitizeText(value);
    }
  }, [sanitizeType]);

  // Validación en tiempo real
  const validateValue = useCallback((value) => {
    if (validationRules.length === 0) return null;
    return validateField(value, validationRules);
  }, [validationRules]);

  // Manejar cambio de valor
  const handleChange = useCallback((e) => {
    const rawValue = e.target.value;
    const sanitizedValue = sanitizeValue(rawValue);
    const validationError = validateValue(sanitizedValue);

    setLocalError(validationError || '');
    
    if (onChange) {
      onChange({
        ...e,
        target: {
          ...e.target,
          value: sanitizedValue
        }
      });
    }
  }, [sanitizeValue, validateValue, onChange]);

  // Manejar pérdida de foco
  const handleBlur = useCallback((e) => {
    setIsTouched(true);
    const validationError = validateValue(e.target.value);
    setLocalError(validationError || '');
    
    if (onBlur) {
      onBlur(e);
    }
  }, [validateValue, onBlur]);

  // Error final (prop o local)
  const finalError = useMemo(() => {
    return error || (isTouched ? localError : '');
  }, [error, localError, isTouched]);

  // Clases CSS
  const fieldClasses = useMemo(() => {
    return [
      styles.formField,
      finalError ? styles.error : '',
      disabled ? styles.disabled : '',
      className
    ].filter(Boolean).join(' ');
  }, [finalError, disabled, className]);

  // Props para Input (sin pasar error como boolean)
  const inputProps = useMemo(() => {
    const { error: _, ...restProps } = props;
    return {
      ...restProps,
      id: name,
      name: name,
      type: type,
      value: value,
      onChange: handleChange,
      onBlur: handleBlur,
      disabled: disabled,
      placeholder: placeholder
    };
  }, [props, name, type, value, handleChange, handleBlur, disabled, placeholder]);

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
          <Textarea id={name} value={value} onChange={handleChange} onBlur={handleBlur} required={required} {...props} />
        ) : type === 'select' ? (
          <Select id={name} value={value} onChange={handleChange} onBlur={handleBlur} required={required} {...props} />
        ) : (
          <Input
            {...inputProps}
            className={finalError ? styles.inputError : ''}
          />
        )}
        {finalError && <FormErrorIcon className={styles.errorIcon} />}
      </div>
      {(helperText || finalError) && (
        <HelperText type={finalError ? 'error' : 'helper'} className={finalError ? styles.errorText : styles.helperText}>
          {finalError || helperText}
        </HelperText>
      )}
    </div>
  );
});

FormField.displayName = 'FormField';

export default FormField; 