import React from 'react';
import styles from './Backdrop.module.css';

const Backdrop = ({ onClick, children }) => (
  <section className={styles.backdrop} onClick={onClick}>
    {children}
  </section>
);

export default Backdrop; 