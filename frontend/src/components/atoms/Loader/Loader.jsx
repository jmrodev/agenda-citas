import React from 'react';
import styles from './Loader.module.css';

const Loader = ({ size = 'medium', color = 'primary', text = 'Cargando...' }) => {
  const sizeClass = styles[size] || styles.medium;
  const colorClass = styles[color] || styles.primary;

  return (
    <section className={styles.loaderContainer} aria-busy="true" aria-live="polite">
      <span className={`${styles.spinner} ${sizeClass} ${colorClass}`} role="status" aria-label="Cargando"></span>
      {text && <span className={styles.text}>{text}</span>}
    </section>
  );
};

export default Loader; 