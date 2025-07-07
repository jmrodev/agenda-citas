import React from 'react';
import styles from './AppLayout.module.css';

const AppLayout = ({ menuBar, sideMenu, children }) => (
  <div className={styles.appLayout}>
    <header>{menuBar}</header>
    <div className={styles.bodyRow}>
      {sideMenu && <aside className={styles.sideMenu}>{sideMenu}</aside>}
      <main className={styles.mainContent}>{children}</main>
    </div>
  </div>
);

export default AppLayout; 