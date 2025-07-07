import React from 'react';
import styles from './UserListItem.module.css';
import Button from '../../atoms/Button/Button';

const UserListItem = ({ user, actions, onClick }) => {
  const handleActionClick = (e, action) => {
    e.stopPropagation();
    if (action.onClick) {
      action.onClick();
    }
  };

  return (
    <div className={styles.item} onClick={onClick} tabIndex={0} role='button'>
      <img 
        src={user.avatar || user.profile_image || '/default-avatar.png'} 
        alt={user.name || user.full_name || user.first_name} 
        className={styles.avatar} 
      />
      <div className={styles.info}>
        <div className={styles.name}>
          {user.name || user.full_name || `${user.first_name || ''} ${user.last_name || ''}`.trim() || 'Sin nombre'}
        </div>
        {user.subtitle && <div className={styles.subtitle}>{user.subtitle}</div>}
        {user.email && <div className={styles.subtitle}>{user.email}</div>}
        {user.phone && <div className={styles.subtitle}>{user.phone}</div>}
        {user.shift && <div className={styles.subtitle}>Turno: {user.shift}</div>}
      </div>
      {actions && actions.length > 0 && (
        <div className={styles.actions}>
          {actions.map((action, index) => (
            <Button
              key={index}
              variant={action.variant || 'secondary'}
              size="small"
              onClick={(e) => handleActionClick(e, action)}
            >
              {action.label}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserListItem; 