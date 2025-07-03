import React from 'react';
import CloseIcon from '../../atoms/CloseIcon/CloseIcon';
import styles from './ModalHeader.module.css';

const ModalHeader = ({ title, onClose }) => (
  <div className={styles.header}>
    <h2 className={styles.title}>{title}</h2>
    <CloseIcon onClick={onClose} />
  </div>
);

export default ModalHeader; 