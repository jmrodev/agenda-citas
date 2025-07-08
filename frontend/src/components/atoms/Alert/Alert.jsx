import React from 'react';
import styles from './Alert.module.css';
import Icon from '../Icon/Icon';

const defaultIcons = {
  info: 'info',
  success: 'check',
  warning: 'warning',
  danger: 'close'
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