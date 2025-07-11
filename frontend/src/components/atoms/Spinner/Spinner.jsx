import React from 'react';
import styles from './Spinner.module.css';

/**
 * @typedef {('sm'|'md'|'lg'|'xl')} SpinnerNamedSize
 * @typedef {('primary'|'secondary'|'danger'|'success'|'warning'|'light')} SpinnerColor
 */

/**
 * Spinner component displays a circular loading indicator.
 * It can be sized using named sizes or a custom numeric size.
 *
 * @param {object} props - The component's props.
 * @param {SpinnerNamedSize|number} [props.size='md'] - The size of the spinner. Can be a named size ('sm', 'md', 'lg', 'xl') or a number for custom pixel size.
 * @param {SpinnerColor} [props.color='primary'] - The color scheme for the spinner (affects the spinning part's color).
 * @param {string} [props.className=''] - Additional CSS classes to apply to the spinner.
 * @param {string} [props.ariaLabel='Cargando...'] - Aria-label for accessibility, describes what is loading.
 * @param {object} [props.rest] - Any other props will be spread onto the root span element.
 * @returns {JSX.Element} The rendered spinner component.
 */
const Spinner = ({
  size = 'md',
  color = 'primary',
  className = '',
  'aria-label': ariaLabel = 'Cargando...',
  ...rest
}) => {
  const sizeIsNumeric = typeof size === 'number';
  const sizeClass = !sizeIsNumeric ? styles[size] || styles.md : '';

  return (
    <span
      className={[
        styles.spinnerBase, // Renamed base class
        styles[color] || styles.primary, // Color class
        sizeClass, // Named size class
        className
      ].join(' ').trim()}
      style={sizeIsNumeric ? { width: size, height: size, borderWidth: Math.max(1, Math.floor(size / 8)) + 'px' } : {}} // Dynamic border for numeric size
      role='status'
      aria-label={ariaLabel}
      {...rest}
    >
      <span className={styles.visuallyHidden}>{ariaLabel}</span>
    </span>
  );
};

export default Spinner; 