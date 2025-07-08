import React from 'react';
import Icon from '../Icon/Icon';
import styles from './IconButton.module.css';

const IconButton = ({
  icon,
  onClick,
  size = 28,
  color = 'primary',
  'aria-label': ariaLabel,
  disabled = false,
  className = '',
  ...rest
}) => {
  return (
    <button
      type='button'
      className={[styles.iconButton, className].join(' ').trim()}
      onClick={onClick}
      aria-label={ariaLabel}
      disabled={disabled}
      {...rest}
    >
      <Icon name={icon} size={size} color={`var(--${color}-color)`} />
    </button>
  );
};

export default IconButton; 