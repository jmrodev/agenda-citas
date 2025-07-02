import React from 'react';
import styles from './CardSubtitle.module.css';

const CardSubtitle = ({ children, className = '', ...rest }) => {
  return (
    <h4 className={[styles.cardSubtitle, className].join(' ').trim()} {...rest}>
      {children}
    </h4>
  );
};

export default CardSubtitle; 