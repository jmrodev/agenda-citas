import React from 'react';
import styles from './Chip.module.css';
import Icon from '../Icon/Icon';

const Chip = ({
  children,
  color = 'primary',
  size = 'md',
  icon,
  onClose,
  className = '',
  ...rest
}) => {
  return (
    <span className={[styles.chip, styles[color] || '', styles[size] || '', className].join(' ').trim()} {...rest}>
      {icon && <Icon name={icon} size={18} className={styles.icon} aria-label='icono' />}
      <span className={styles.label}>{children}</span>
      {onClose && (
        <button type='button' className={styles.close} onClick={onClose} aria-label='Cerrar'>
          <Icon name='close' size={16} />
        </button>
      )}
    </span>
  );
};

export default Chip; 