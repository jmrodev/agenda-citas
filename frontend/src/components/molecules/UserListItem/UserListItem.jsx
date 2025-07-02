import React from 'react';
import styles from './UserListItem.module.css';

const UserListItem = ({ avatar, name, subtitle, onClick }) => (
  <div className={styles.item} onClick={onClick} tabIndex={0} role='button'>
    <img src={avatar} alt={name} className={styles.avatar} />
    <div className={styles.info}>
      <div className={styles.name}>{name}</div>
      {subtitle && <div className={styles.subtitle}>{subtitle}</div>}
    </div>
  </div>
);

export default UserListItem; 