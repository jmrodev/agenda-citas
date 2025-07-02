import React from 'react';
import styles from './Divider.module.css';

const Divider = ({
  orientation = 'horizontal',
  size = 'md',
  color = 'default',
  className = '',
  ...rest
}) => {
  return (
    <span
      className={[
        styles.divider,
        styles[orientation] || '',
        styles[size] || '',
        styles[color] || '',
        className
      ].join(' ').trim()}
      role='separator'
      aria-orientation={orientation}
      {...rest}
    />
  );
};

export default Divider; 