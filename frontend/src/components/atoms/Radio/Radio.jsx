import React from 'react';
import styles from './Radio.module.css';

const Radio = ({
  checked = false,
  onChange,
  disabled = false,
  error = false,
  className = '',
  id,
  name,
  value,
  'aria-label': ariaLabel,
  'aria-describedby': ariaDescribedby,
  ...rest
}) => {
  return (
    <input
      type='radio'
      id={id}
      name={name}
      value={value}
      checked={checked}
      onChange={onChange}
      disabled={disabled}
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedby}
      aria-invalid={error}
      className={[
        styles.radio,
        error ? styles.error : '',
        className
      ].join(' ').trim()}
      {...rest}
    />
  );
};

export default Radio; 