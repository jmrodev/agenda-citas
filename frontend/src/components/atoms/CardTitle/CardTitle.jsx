import React from 'react';
import styles from './CardTitle.module.css';

const CardTitle = ({ children, className = '', ...rest }) => {
  return (
    <h3 className={[styles.cardTitle, className].join(' ').trim()} {...rest}>
      {children}
    </h3>
  );
};

export default CardTitle; 