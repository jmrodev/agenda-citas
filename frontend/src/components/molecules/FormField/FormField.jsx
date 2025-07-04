import React, { useCallback } from 'react';
import styles from './FormField.module.css';
import Label from '../../atoms/Label/Label';
import Input from '../../atoms/Input/Input';
import Textarea from '../../atoms/Textarea/Textarea';
import Select from '../../atoms/Select/Select';
import HelperText from '../../atoms/HelperText/HelperText';
import FormErrorIcon from '../../atoms/FormErrorIcon/FormErrorIcon';

const FormField = React.memo(({
  label,
  id,
  type = 'text',
  value,
  onChange,
  error = '',
  helperText = '',
  required = false,
  children,
  ...rest
}) => {
  const handleChange = useCallback((e) => {
    if (onChange) {
      onChange(e);
    }
  }, [onChange]);

  return (
    <div className={styles.formField}>
      {label && (
        <Label htmlFor={id} required={required} className={styles.label}>
          {label}
        </Label>
      )}
      <div className={styles.inputWrapper}>
        {children ? (
          children
        ) : type === 'textarea' ? (
          <Textarea id={id} value={value} onChange={handleChange} required={required} {...rest} />
        ) : type === 'select' ? (
          <Select id={id} value={value} onChange={handleChange} required={required} {...rest} />
        ) : (
          <Input id={id} type={type} value={value} onChange={handleChange} required={required} {...rest} />
        )}
        {error && <FormErrorIcon className={styles.errorIcon} />}
      </div>
      {(helperText || error) && (
        <HelperText className={error ? styles.errorText : styles.helperText}>
          {error || helperText}
        </HelperText>
      )}
    </div>
  );
});

FormField.displayName = 'FormField';

export default FormField; 