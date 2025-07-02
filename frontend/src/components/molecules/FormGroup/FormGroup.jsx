import React from 'react';
import styles from './FormGroup.module.css';

const FormGroup = ({
  title = '',
  children,
  className = '',
  style = {},
  ...rest
}) => {
  return (
    <fieldset className={[styles.formGroup, className].join(' ').trim()} style={style} {...rest}>
      {title && <legend className={styles.title}>{title}</legend>}
      <div className={styles.fields}>{children}</div>
    </fieldset>
  );
};

export default FormGroup; 