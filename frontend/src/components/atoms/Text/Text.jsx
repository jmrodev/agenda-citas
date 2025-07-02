import React from 'react';
import styles from './Text.module.css';

const Text = ({
  children,
  as = 'p',
  color = 'default',
  size = 'md',
  className = '',
  ...rest
}) => {
  const Component = as;
  return (
    <Component
      className={[
        styles.text,
        styles[color] || '',
        styles[size] || '',
        className
      ].join(' ').trim()}
      {...rest}
    >
      {children}
    </Component>
  );
};

export default Text; 