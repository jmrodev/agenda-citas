import React from 'react';
import styles from './Avatar.module.css';

const sizeMap = {
  sm: 32,
  md: 40,
  lg: 56
};

const Avatar = ({ src, alt = '', size = 'md', initials = '', className = '', ...rest }) => {
  // Permitir size como string o número
  const pxSize = typeof size === 'number' ? size : sizeMap[size] || sizeMap['md'];
  return (
    <span
      className={[styles.avatar, className].join(' ').trim()}
      style={{ '--avatar-size': `${pxSize}px`, fontSize: pxSize * 0.4 }}
      {...rest}
    >
      {src ? (
        <img src={src} alt={alt} className={styles.img} style={{ width: '100%', height: '100%' }} />
      ) : (
        <span className={styles.initials}>{initials || '?'}</span>
      )}
    </span>
  );
};

export default Avatar; 