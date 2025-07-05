import React from 'react';
import CalendarDemoPage from './CalendarDemoPage';
import styles from './DevPage.module.css';

const DevPage = React.memo(() => {
  return (
    <div className={styles.devPage}>
      <h1 className={styles.title}>Página de Desarrollo</h1>
      <p className={styles.description}>
        Esta página contiene componentes y funcionalidades en desarrollo para testing.
      </p>
      
      <div className={styles.sections}>
        <section className={styles.section}>
          <h2>Demo del Calendario</h2>
          <CalendarDemoPage />
        </section>
      </div>
    </div>
  );
});

DevPage.displayName = 'DevPage';

export default DevPage; 