import React from 'react';
import PeopleIcon from '@mui/icons-material/People';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import AssessmentIcon from '@mui/icons-material/Assessment';
import StatsGrid from '../../organisms/StatsGrid/StatsGrid';
import QuickActionsBar from '../../organisms/QuickActionsBar/QuickActionsBar';
import { getQuickActionsByRole } from './AppMenu.jsx';
import styles from './DashboardContent.module.css';

// Dashboard content por rol
export const getDashboardContentByRole = (role, doctor, stats) => {
  switch (role) {
    case 'admin':
      return (
        <div className={styles.dashboard}>
          <h2 className={styles.dashboardTitle}>Dashboard de Administración</h2>
          <div className={styles.statsSection}>
            <StatsGrid stats={[
              { title: 'Pacientes activos', value: stats.pacientes || 0, icon: <PeopleIcon fontSize='inherit' />, color: '#1976d2' },
              { title: 'Citas hoy', value: stats.citas || 0, icon: <CalendarMonthIcon fontSize='inherit' />, color: '#43a047' },
              { title: 'Doctores', value: stats.doctores || 0, icon: <LocalHospitalIcon fontSize='inherit' />, color: '#d32f2f' },
              { title: 'Secretarias', value: stats.secretarias || 0, icon: <SupervisorAccountIcon fontSize='inherit' />, color: '#fbc02d' }
            ]} />
          </div>
          <div className={styles.actionsSection}>
            <h3 className={styles.dashboardSubtitle}>Acciones Rápidas</h3>
            <QuickActionsBar actions={getQuickActionsByRole(role)} />
          </div>
        </div>
      );
    
    case 'doctor':
      return (
        <div className={styles.dashboard}>
          <h2 className={styles.dashboardTitle}>Dashboard del Doctor</h2>
          <div className={styles.statsSection}>
            <StatsGrid stats={[
              { 
                title: 'Mi actividad',
                value: `${stats.citas || 0} citas | ${stats.pacientes || 0} pacientes | ${stats.consultas || 0} consultas`,
                icon: <PeopleIcon fontSize='inherit' />,
                color: '#1976d2'
              }
            ]} />
          </div>
          <div className={styles.actionsSection}>
            <h3 className={styles.dashboardSubtitle}>Acciones Rápidas</h3>
            <QuickActionsBar actions={getQuickActionsByRole(role)} />
          </div>
        </div>
      );
    
    case 'secretary':
      return (
        <div className={styles.dashboard}>
          <h2 className={styles.dashboardTitle}>Dashboard de Secretaría</h2>
          <div className={styles.statsSection}>
            <StatsGrid stats={[
              { title: 'Citas hoy', value: stats.citas || 0, icon: <CalendarMonthIcon fontSize='inherit' />, color: '#43a047' },
              { title: 'Pacientes', value: stats.pacientes || 0, icon: <PeopleIcon fontSize='inherit' />, color: '#1976d2' },
              { title: 'Doctores', value: stats.doctores || 0, icon: <LocalHospitalIcon fontSize='inherit' />, color: '#d32f2f' }
            ]} />
          </div>
          <div className={styles.actionsSection}>
            <h3 className={styles.dashboardSubtitle}>Acciones Rápidas</h3>
            <QuickActionsBar actions={getQuickActionsByRole(role)} />
          </div>
        </div>
      );
    
    default:
      return (
        <div className={styles.welcomeMessage}>
          <h2 className={styles.welcomeTitle}>Bienvenido</h2>
          <p className={styles.welcomeText}>Selecciona una opción del menú.</p>
        </div>
      );
  }
};

export default getDashboardContentByRole; 