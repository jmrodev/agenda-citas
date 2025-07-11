import React from 'react';
import Spinner from '../Spinner/Spinner'; // Import the Spinner atom
import styles from './Loader.module.css';

// Mapping Loader sizes to Spinner sizes
const sizeMap = {
  small: 'sm',
  medium: 'md',
  large: 'lg',
  xlarge: 'xl',
};

const Loader = ({ size = 'medium', color = 'primary', text = 'Cargando...', className = '' }) => {
  const spinnerSize = sizeMap[size] || 'md'; // Default to 'md' if size prop is invalid

  return (
    <section className={[styles.loaderContainer, className].join(' ').trim()} aria-busy="true" aria-live="polite">
      <Spinner size={spinnerSize} color={color} aria-label={text || 'Cargando'} />
      {text && <span className={styles.text}>{text}</span>}
    </section>
  );
};

export default Loader; 