import React from 'react';
import styles from './Label.module.css';

const Label = ({ children, htmlFor, className = '', ...rest }) => {
  return (
    <label
      htmlFor={htmlFor}
      className={[styles.label, className].join(' ').trim()}
      {...rest}
    >
      {children}
    </label>
  );
};

export default Label; 