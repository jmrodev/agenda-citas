import React from 'react';
import styles from './Badge.module.css';

const Badge = ({ children, color = 'primary', size = 'md', className = '', ...rest }) => {
  return (
    <span
      className={[
        styles.badge,
        styles[color] || '',
        styles[size] || '',
        className
      ].join(' ').trim()}
      {...rest}
    >
      {children}
    </span>
  );
};

export default Badge; 