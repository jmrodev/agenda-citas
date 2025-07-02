import React from 'react';
import UserListItem from '../../molecules/UserListItem/UserListItem';
import styles from './RecentUsersList.module.css';

const RecentUsersList = ({ users, title = 'Últimos usuarios' }) => (
  <div className={styles.list}>
    <h3 className={styles.title}>{title}</h3>
    {users.length === 0 ? (
      <div className={styles.empty}>No hay usuarios recientes.</div>
    ) : (
      users.map((user, idx) => (
        <UserListItem key={idx} {...user} />
      ))
    )}
  </div>
);

export default RecentUsersList; 