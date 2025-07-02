import React from 'react';
import styles from './CardImage.module.css';

const CardImage = ({ src, alt = '', className = '', style = {}, ...rest }) => {
  return (
    <img
      src={src}
      alt={alt}
      className={[styles.cardImage, className].join(' ').trim()}
      style={style}
      {...rest}
    />
  );
};

export default CardImage; 