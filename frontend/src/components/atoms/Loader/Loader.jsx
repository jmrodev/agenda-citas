import React from 'react';
import styles from './Loader.module.css';

const Loader = ({ size = 'medium', color = 'primary', text = 'Cargando...' }) => {
  const sizeClass = styles[size] || styles.medium;
  const colorClass = styles[color] || styles.primary;

  return (
    <div className={styles.loaderContainer}>
      <div className={`${styles.spinner} ${sizeClass} ${colorClass}`}></div>
      {text && <div className={styles.text}>{text}</div>}
    </div>
  );
};

export default Loader; 