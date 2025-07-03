import React from 'react';
import styles from './Backdrop.module.css';

const Backdrop = ({ onClick, children }) => (
  <div className={styles.backdrop} onClick={onClick}>
    {children}
  </div>
);

export default Backdrop; 