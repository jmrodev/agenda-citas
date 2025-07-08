import React from 'react';
import styles from './CardBase.module.css';

const CardBase = ({ children, className = '', style = {}, ...rest }) => {
  return (
    <article className={[styles.cardBase, className].join(' ').trim()} style={style} {...rest}>
      {children}
    </article>
  );
};

export default CardBase; 