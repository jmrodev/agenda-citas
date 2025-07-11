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
  search: (
    <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
      <circle cx='11' cy='11' r='8' />
      <line x1='21' y1='21' x2='16.65' y2='16.65' />
    </svg>
  ),
  'chevron-down': (
    <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
      <polyline points='6 9 12 15 18 9' />
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
  // Add more icons here as needed
};

/**
 * Icon component displays an SVG icon from a predefined set.
 *
 * @param {object} props - The component's props.
 * @param {string} props.name - The name of the icon to display (must be a key in the `icons` object).
 * @param {number} [props.size=24] - The size (width and height) of the icon in pixels.
 * @param {string} [props.color='currentColor'] - The color of the icon. Can be any valid CSS color string (e.g., 'red', '#FF0000', 'var(--primary-color)').
 * @param {string} [props.className=''] - Additional CSS classes to apply to the icon's wrapper span.
 * @param {string} [props.ariaLabel] - Aria-label for accessibility. If not provided, the icon is decorative or its context should provide a label.
 * @param {object} [props.rest] - Any other props will be spread onto the root span element.
 * @returns {JSX.Element|null} The rendered icon component or null if the icon name is not found.
 */
const Icon = ({ name, size = 24, color = 'currentColor', className = '', 'aria-label': ariaLabel, ...rest }) => {
  const icon = icons[name];
  if (!icon) {
    console.warn(`Icon not found: ${name}`); // Warn if icon name is invalid
    return null;
  }
  return (
    <span
      className={[styles.icon, className].join(' ').trim()}
      style={{ width: size, height: size, color }}
      aria-label={ariaLabel}
      role='img'
      data-testid={rest['data-testid'] || `icon-${name}`}
      {...rest}
    >
      {React.cloneElement(icon, { width: size, height: size, color })}
    </span>
  );
};

export default Icon; 