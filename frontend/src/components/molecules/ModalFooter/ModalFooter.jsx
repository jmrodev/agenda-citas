import React from 'react';
import styles from './ModalFooter.module.css';

const ModalFooter = ({ children }) => (
  <div className={styles.footer}>
    {children}
  </div>
);

export default ModalFooter; 