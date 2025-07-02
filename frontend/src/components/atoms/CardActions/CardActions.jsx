import React from 'react';
import styles from './CardActions.module.css';

const CardActions = ({ children, className = '', ...rest }) => {
  return (
    <div className={[styles.cardActions, className].join(' ').trim()} {...rest}>
      {children}
    </div>
  );
};

export default CardActions; 