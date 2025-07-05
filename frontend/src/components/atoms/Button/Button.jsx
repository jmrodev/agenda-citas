import React from 'react';
import styles from './Button.module.css';

const variantClass = {
  primary: styles.primary,
  secondary: styles.secondary,
  danger: styles.danger,
  success: styles.success,
  outline: styles.outline
};

const sizeClass = {
  sm: styles.sm,
  md: styles.md,
  lg: styles.lg
};

const Button = React.memo(({
  children,
  onClick,
  type = 'button',
  className = '',
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  'aria-label': ariaLabel,
  ...rest
}) => {
  return (
    <button
      type={type}
      className={[
        styles.button,
        variantClass[variant] || '',
        sizeClass[size] || '',
        className
      ].join(' ').trim()}
      onClick={onClick}
      disabled={disabled || loading}
      aria-label={ariaLabel}
      aria-busy={loading}
      {...rest}
    >
      {loading ? <span className={styles.loader} aria-hidden="true" /> : children}
    </button>
  );
});

Button.displayName = 'Button';

export default Button; 