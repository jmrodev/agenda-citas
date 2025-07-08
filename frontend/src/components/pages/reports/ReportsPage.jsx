import React from 'react';
import styles from './ReportsPage.module.css';
import ReportView from '../../organisms/ReportView/ReportView';
import Title from '../../atoms/Title/Title'; // Usar el átomo Title para consistencia

const ReportsPage = () => {
  return (
    <div className={styles.pageContainer}>
      <header className={styles.header}>
        <Title level="h1" className={styles.pageTitle}>Página de Reportes</Title>
      </header>
      <main className={styles.content}>
        <ReportView />
      </main>
    </div>
  );
};

export default ReportsPage;
