import React, { useState, useEffect } from 'react';
import { useLocation, Outlet } from 'react-router-dom';
import AppLayout from '../../templates/AppLayout/AppLayout';
import { ViewModeProvider } from '../../context/ViewModeContext';
import { DoctorProvider } from '../../context/DoctorContext';
import { getRole } from '../../../auth';
import AppHeader from './AppHeader';
import AppSideMenu from './AppSideMenu';
import { getDashboardContentByRole } from './DashboardContent';
import styles from './AppPage.module.css';

const AppPageInner = () => {
  const location = useLocation();
  const userRole = getRole();
  const [stats, setStats] = useState({ 
    pacientes: 0, 
    citas: 0, 
    doctores: 0, 
    secretarias: 0, 
    consultas: 0 
  });

  // Cargar estadísticas según el rol
  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Aquí deberías hacer fetch real de estadísticas según el rol
        // Por ahora usamos datos mock
        setStats({ 
          pacientes: 150, 
          citas: 25, 
          doctores: 8, 
          secretarias: 3, 
          consultas: 45 
        });
      } catch (error) {
        console.error('Error cargando estadísticas:', error);
      }
    };
    fetchStats();
  }, [userRole]);

  return (
    <AppLayout
      menuBar={<AppHeader />}
      sideMenu={<AppSideMenu userRole={userRole} />}
    >
      <div className={styles.content}>
        {location.pathname === '/app' ? (
          getDashboardContentByRole(userRole, null, stats)
        ) : (
          <Outlet />
        )}
      </div>
    </AppLayout>
  );
};

const AppPage = () => (
  <DoctorProvider>
    <ViewModeProvider>
      <AppPageInner />
    </ViewModeProvider>
  </DoctorProvider>
);

export default AppPage; 