import React from 'react';
import styles from './Alert.module.css';
import Icon from '../Icon/Icon';

const defaultIcons = {
  info: 'info', // Assumes 'info' icon exists in Icon.jsx, if not use a more generic one or ensure it's added
  success: 'check',
  warning: 'warning', // Assumes 'warning' icon exists or use 'danger' as fallback
  danger: 'danger' // Changed from 'close' to 'danger'
};

const Alert = React.memo(({
  children,
  type = 'info',
  icon,
  onClose,
  className = '',
  ...rest
}) => {
  return (
    <section 
      className={[styles.alert, styles[type] || '', className].join(' ').trim()} 
      role="alert" 
      aria-live="polite"
      {...rest}
    >
      <span className={styles.icon}>
        <Icon name={icon || defaultIcons[type] || 'info'} size={20} />
      </span>
      <span className={styles.content}>{children}</span>
      {onClose && (
        <button type='button' className={styles.close} onClick={onClose} aria-label='Cerrar'>
          <Icon name='close' size={16} />
        </button>
      )}
    </section>
  );
});

Alert.displayName = 'Alert';

export default Alert; 