import React from 'react';
import styles from './ProgressBar.module.css';

const ProgressBar = ({ value = 0, color = 'primary', size = 'md', className = '', ...rest }) => {
  const safeValue = Math.max(0, Math.min(100, value));
  return (
    <section className={[styles.progressBar, styles[size] || '', className].join(' ').trim()} {...rest}>
      <span
        className={[styles.bar, styles[color] || ''].join(' ').trim()}
        style={{ width: `${safeValue}%` }}
        role='progressbar'
        aria-valuenow={safeValue}
        aria-valuemin={0}
        aria-valuemax={100}
      />
    </section>
  );
};

export default ProgressBar; 