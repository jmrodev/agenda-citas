import React from 'react';
import styles from './Input.module.css';

const Input = ({
  type = 'text',
  value,
  onChange,
  placeholder = '',
  disabled = false,
  error = false,
  className = '',
  'aria-label': ariaLabel,
  'aria-describedby': ariaDescribedby,
  ...rest
}) => {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedby}
      aria-invalid={error}
      className={[
        styles.input,
        error ? styles.error : '',
        className
      ].join(' ').trim()}
      {...rest}
    />
  );
};

export default Input; 