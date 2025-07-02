import React from 'react';
import styles from './Title.module.css';

const Title = ({ children, level = 1, className = '', ...rest }) => {
  const Heading = `h${level}`;
  return (
    <Heading className={[styles.title, styles[`h${level}`], className].join(' ').trim()} {...rest}>
      {children}
    </Heading>
  );
};

export default Title; 