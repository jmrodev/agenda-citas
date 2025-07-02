import React from 'react';
import styles from './Select.module.css';

const Select = ({
  value,
  onChange,
  options = [],
  disabled = false,
  error = false,
  className = '',
  'aria-label': ariaLabel,
  'aria-describedby': ariaDescribedby,
  ...rest
}) => {
  return (
    <select
      value={value}
      onChange={onChange}
      disabled={disabled}
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedby}
      aria-invalid={error}
      className={[
        styles.select,
        error ? styles.error : '',
        className
      ].join(' ').trim()}
      {...rest}
    >
      {options.map(opt => (
        <option key={opt.value} value={opt.value} disabled={opt.disabled}>
          {opt.label}
        </option>
      ))}
    </select>
  );
};

export default Select; 