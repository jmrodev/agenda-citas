import React from 'react';
import styles from './HelperText.module.css';

const HelperText = ({ children, color = 'default', className = '', ...rest }) => {
  return (
    <span
      className={[
        styles.helperText,
        styles[color] || '',
        className
      ].join(' ').trim()}
      {...rest}
    >
      {children}
    </span>
  );
};

export default HelperText; 