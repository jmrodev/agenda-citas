import React from 'react';
import styles from './Textarea.module.css';

const Textarea = ({
  value,
  onChange,
  placeholder = '',
  disabled = false,
  error = false,
  className = '',
  rows = 3,
  'aria-label': ariaLabel,
  'aria-describedby': ariaDescribedby,
  ...rest
}) => {
  return (
    <textarea
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedby}
      aria-invalid={error}
      rows={rows}
      className={[
        styles.textarea,
        error ? styles.error : '',
        className
      ].join(' ').trim()}
      {...rest}
    />
  );
};

export default Textarea; 