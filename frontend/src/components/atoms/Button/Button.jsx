import React from 'react';
import styles from './Button.module.css';

const Button = ({ children, onClick, type = 'button', className = '', ...rest }) => {
  return (
    <button
      type={type}
      className={`${styles.button} ${className}`.trim()}
      onClick={onClick}
      {...rest}
    >
      {children}
    </button>
  );
};

export default Button; 