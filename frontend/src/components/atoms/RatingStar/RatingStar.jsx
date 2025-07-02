import React from 'react';
import styles from './RatingStar.module.css';

const RatingStar = ({
  filled = false,
  size = 28,
  color = 'warning',
  onClick,
  className = '',
  'aria-label': ariaLabel = 'Estrella',
  ...rest
}) => {
  return (
    <button
      type='button'
      className={[styles.starButton, className].join(' ').trim()}
      onClick={onClick}
      aria-label={ariaLabel}
      tabIndex={0}
      {...rest}
    >
      <svg
        className={styles.star}
        width={size}
        height={size}
        viewBox='0 0 24 24'
        fill={filled ? 'var(--warning-color, #ffb300)' : 'none'}
        stroke='var(--warning-color, #ffb300)'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
        style={{ color: `var(--${color}-color)` }}
      >
        <polygon points='12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2' />
      </svg>
    </button>
  );
};

export default RatingStar; 