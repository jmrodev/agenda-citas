import React, { useState } from 'react';
import styles from './Image.module.css';

const Image = ({ src, alt = '', width, height, fallback = 'Imagen no disponible', className = '', ...rest }) => {
  const [error, setError] = useState(false);

  if (error) {
    return (
      typeof fallback === 'string' && fallback.startsWith('http') ? (
        <img src={fallback} alt='fallback' className={[styles.image, className].join(' ').trim()} width={width} height={height} />
      ) : (
        <span className={[styles.fallback, className].join(' ').trim()} style={{ width, height }}>{fallback}</span>
      )
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={[styles.image, className].join(' ').trim()}
      width={width}
      height={height}
      onError={() => setError(true)}
      {...rest}
    />
  );
};

export default Image; 