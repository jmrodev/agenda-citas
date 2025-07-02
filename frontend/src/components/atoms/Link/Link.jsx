import React from 'react';
import styles from './Link.module.css';

const Link = ({
  children,
  href = '#',
  target,
  rel,
  color = 'primary',
  underline = true,
  className = '',
  ...rest
}) => {
  return (
    <a
      href={href}
      target={target}
      rel={rel || (target === '_blank' ? 'noopener noreferrer' : undefined)}
      className={[
        styles.link,
        styles[color] || '',
        underline ? styles.underline : styles.noUnderline,
        className
      ].join(' ').trim()}
      {...rest}
    >
      {children}
    </a>
  );
};

export default Link; 