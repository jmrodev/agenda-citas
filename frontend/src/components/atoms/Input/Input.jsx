import React from 'react';
import styles from './Input.module.css';

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
  return (
    <input
      type={type}
      value={value}
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