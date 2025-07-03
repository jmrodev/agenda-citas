import styles from './DashboardLayout.module.css';
import Header from '../../organisms/Header/Header.jsx';
import Sidebar from '../../organisms/Sidebar/Sidebar.jsx';

const DashboardLayout = ({ children, title }) => {
  console.log('🏗️ [DashboardLayout] Componente iniciado con title:', title);
  
  return (
    <div className={styles.dashboardContainer}>
      {console.log('🏗️ [DashboardLayout] Renderizando layout')}
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