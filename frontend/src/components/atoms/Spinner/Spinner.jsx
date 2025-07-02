import React from 'react';
import styles from './Spinner.module.css';

const Spinner = ({ size = 32, color = 'primary', className = '', 'aria-label': ariaLabel = 'Cargando...', ...rest }) => {
  return (
    <span
      className={[styles.spinner, styles[color] || '', className].join(' ').trim()}
      style={{ width: size, height: size }}
      role='status'
      aria-label={ariaLabel}
      {...rest}
    >
      <span className={styles.visuallyHidden}>{ariaLabel}</span>
    </span>
  );
};

export default Spinner; 