import React from 'react';
import styles from './StatusIndicator.module.css';
import Chip from '../../atoms/Chip/Chip';

const StatusIndicator = ({
  status,
  icon = null,
  chip = '',
  className = '',
  style = {},
  ...rest
}) => {
  return (
    <div className={[styles.statusIndicator, className].join(' ').trim()} style={style} {...rest}>
      {icon && <span className={styles.icon}>{icon}</span>}
      {chip && <Chip className={styles.chip}>{chip}</Chip>}
      <span className={styles.status}>{status}</span>
    </div>
  );
};

export default StatusIndicator; 