import React from 'react';
import styles from './Switch.module.css';

const Switch = ({
  checked = false,
  onChange,
  disabled = false,
  error = false,
  className = '',
  'aria-label': ariaLabel,
  ...rest
}) => {
  return (
    <label className={[styles.switch, disabled ? styles.disabled : '', error ? styles.error : '', className].join(' ').trim()}>
      <input
        type='checkbox'
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        aria-label={ariaLabel}
        aria-checked={checked}
        aria-invalid={error}
        {...rest}
      />
      <span className={styles.slider} />
    </label>
  );
};

export default Switch; 