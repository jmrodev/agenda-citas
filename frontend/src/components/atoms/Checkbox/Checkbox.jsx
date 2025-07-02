import React from 'react';
import styles from './Checkbox.module.css';

const Checkbox = ({
  checked = false,
  onChange,
  disabled = false,
  error = false,
  className = '',
  id,
  'aria-label': ariaLabel,
  'aria-describedby': ariaDescribedby,
  ...rest
}) => {
  return (
    <input
      type='checkbox'
      id={id}
      checked={checked}
      onChange={onChange}
      disabled={disabled}
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedby}
      aria-invalid={error}
      className={[
        styles.checkbox,
        error ? styles.error : '',
        className
      ].join(' ').trim()}
      {...rest}
    />
  );
};

export default Checkbox; 