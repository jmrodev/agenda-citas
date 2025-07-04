import React from 'react';
import styles from './DesktopAppLayout.module.css';

const DesktopAppLayout = ({ menuBar, sideMenu, children }) => (
  <div className={styles.desktopAppLayout}>
    <header>{menuBar}</header>
    <div className={styles.bodyRow}>
      {sideMenu && <aside className={styles.sideMenu}>{sideMenu}</aside>}
      <main className={styles.mainContent}>{children}</main>
    </div>
  </div>
);

export default DesktopAppLayout; 