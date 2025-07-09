import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getMenuByRole } from './AppMenu.jsx';
import styles from './AppSideMenu.module.css';

const AppSideMenu = ({ userRole }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const menuItems = getMenuByRole(userRole);
  const activeIndex = menuItems.findIndex(item => location.pathname.startsWith(`/app/${item.route}`));

  return (
    <nav className={styles.nav}>
      <ul className={styles.menuList}>
        {menuItems.map((item, idx) => (
          <li key={item.label} className={styles.menuItem}>
            <button
              onClick={() => navigate(`/app/${item.route}`)}
              className={`${styles.menuButton} ${idx === activeIndex ? styles.active : ''}`}
            >
              <span className={styles.menuIcon}>{item.icon}</span>
              <span className={styles.menuLabel}>{item.label}</span>
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default AppSideMenu; 