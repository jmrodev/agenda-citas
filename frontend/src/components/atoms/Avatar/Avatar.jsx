import React from 'react';
import styles from './Avatar.module.css';

const Avatar = ({ src, alt = '', size = 40, initials = '', className = '', ...rest }) => {
  return (
    <span
      className={[styles.avatar, className].join(' ').trim()}
      style={{ width: size, height: size, fontSize: size * 0.4 }}
      {...rest}
    >
      {src ? (
        <img src={src} alt={alt} className={styles.img} style={{ width: size, height: size }} />
      ) : (
        <span className={styles.initials}>{initials || '?'}</span>
      )}
    </span>
  );
};

export default Avatar; 