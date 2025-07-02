import React from 'react';
import styles from './InfoRow.module.css';

const InfoRow = ({
  label,
  value,
  icon = null,
  className = '',
  style = {},
  ...rest
}) => {
  return (
    <div className={[styles.infoRow, className].join(' ').trim()} style={style} {...rest}>
      <span className={styles.label}>{label}</span>
      <span className={styles.value}>{value}</span>
      {icon && <span className={styles.icon}>{icon}</span>}
    </div>
  );
};

export default InfoRow; 