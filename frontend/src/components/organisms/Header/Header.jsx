import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Avatar from '../../atoms/Avatar/Avatar';
import Button from '../../atoms/Button/Button';
import styles from './Header.module.css';

const Header = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <Link to='/' className={styles.logo}>Agenda de Citas</Link>
      </div>
      <div className={styles.right}>
        {token && user ? (
          <>
            <span className={styles.userName}>{user.nombre || user.username || 'Usuario'}</span>
            <Avatar
              src={user.avatarUrl}
              initials={user.nombre && user.apellido ? `${user.nombre[0]}${user.apellido[0]}`.toUpperCase() : (user.username ? user.username[0].toUpperCase() : '?')}
              size={36}
            />
            <Button onClick={handleLogout} variant='secondary' style={{ marginLeft: 16 }}>Logout</Button>
          </>
        ) : (
          <Button onClick={() => navigate('/login')}>Login</Button>
        )}
      </div>
    </header>
  );
};

export default Header; 