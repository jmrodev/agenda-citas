import React from 'react';
import Backdrop from '../../atoms/Backdrop/Backdrop';
import styles from './ModalContainer.module.css';

const ModalContainer = ({ children, onClose }) => (
  <Backdrop onClick={onClose}>
    <div className={styles.modal} onClick={e => e.stopPropagation()}>
      {children}
    </div>
  </Backdrop>
);

export default ModalContainer; 