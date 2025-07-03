import React from 'react';
import styles from './Icon.module.css';

const icons = {
  check: (
    <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
      <polyline points='20 6 10 18 4 12' />
    </svg>
  ),
  close: (
    <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
      <line x1='18' y1='6' x2='6' y2='18' />
      <line x1='6' y1='6' x2='18' y2='18' />
    </svg>
  ),
  user: (
    <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
      <circle cx='12' cy='8' r='4' />
      <path d='M4 20c0-4 8-4 8-4s8 0 8 4' />
    </svg>
  ),
  danger: (
    <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'>
      <polygon points='12,2 22,20 2,20' fill='currentColor' opacity='0.15'/>
      <polygon points='12,2 22,20 2,20' stroke='currentColor' fill='none'/>
      <line x1='12' y1='8' x2='12' y2='14' stroke='currentColor' strokeWidth='2'/>
      <circle cx='12' cy='17' r='1.2' fill='currentColor'/>
    </svg>
  )
};

const Icon = ({ name, size = 24, color = 'currentColor', className = '', 'aria-label': ariaLabel, ...rest }) => {
  const icon = icons[name];
  if (!icon) return null;
  return (
    <span
      className={[styles.icon, className].join(' ').trim()}
      style={{ width: size, height: size, color }}
      aria-label={ariaLabel}
      role='img'
      {...rest}
    >
      {React.cloneElement(icon, { width: size, height: size, color })}
    </span>
  );
};

export default Icon; 