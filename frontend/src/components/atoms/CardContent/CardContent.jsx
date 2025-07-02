import React from 'react';
import styles from './CardContent.module.css';

const CardContent = ({ children, className = '', ...rest }) => {
  return (
    <div className={[styles.cardContent, className].join(' ').trim()} {...rest}>
      {children}
    </div>
  );
};

export default CardContent; 