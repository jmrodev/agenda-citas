import React from 'react';
import styles from './CardActions.module.css';

const CardActions = ({ children, className = '', ...rest }) => {
  return (
    <footer className={[styles.cardActions, className].join(' ').trim()} {...rest}>
      {children}
    </footer>
  );
};

export default CardActions; 