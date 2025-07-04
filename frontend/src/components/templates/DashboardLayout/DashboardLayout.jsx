import React from 'react';
import styles from './DashboardLayout.module.css';
import Header from '../../organisms/Header/Header.jsx';
import Sidebar from '../../organisms/Sidebar/Sidebar.jsx';
import { createLogger } from '../../../utils/debug.js';

const DashboardLayout = ({ children, title }) => {
  const logger = createLogger('DashboardLayout');
  logger.log('Componente iniciado con title:', title);
  
  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.header}>
        <Header />
      </div>
      <div className={styles.aside}>
        <Sidebar />
      </div>
      <main className={styles.main}>
        {title && <h1>{title}</h1>}
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout; 