import React from 'react';
import styles from './CardBase.module.css';

const CardBase = ({ children, className = '', style = {}, ...rest }) => {
  return (
    <div className={[styles.cardBase, className].join(' ').trim()} style={style} {...rest}>
      {children}
    </div>
  );
};

export default CardBase; 