import React from 'react';
import styles from './CardContent.module.css';

const CardContent = ({ children, className = '', ...rest }) => {
  return (
    <section className={[styles.cardContent, className].join(' ').trim()} {...rest}>
      {children}
    </section>
  );
};

export default CardContent; 