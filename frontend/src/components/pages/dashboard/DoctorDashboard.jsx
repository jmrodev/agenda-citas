import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../templates/DashboardLayout/DashboardLayout.jsx';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import PeopleIcon from '@mui/icons-material/People';
import MedicationIcon from '@mui/icons-material/Medication';
import SettingsIcon from '@mui/icons-material/Settings';
import StatsGrid from '../../organisms/StatsGrid/StatsGrid.jsx'; // Importar StatsGrid
import QuickActionsBar from '../../organisms/QuickActionsBar/QuickActionsBar.jsx'; // Importar QuickActionsBar
import styles from './DoctorDashboard.module.css'; // Importar CSS Module

const DoctorDashboard = () => {
  const [stats, setStats] = useState({ citas: 0, pacientes: 0, consultas: 0 });

  // Definición de doctorActions dentro del componente o importado si es estático y reutilizable
  const doctorActions = [
    { label: 'Mis citas', icon: <CalendarMonthIcon fontSize="small" />, onClick: () => { window.location.href = '/doctor/appointments'; } },
    { label: 'Pacientes', icon: <PeopleIcon fontSize="small" />, onClick: () => { window.location.href = '/doctor/patients'; } },
    { label: 'Recetas', icon: <MedicationIcon fontSize="small" />, onClick: () => { window.location.href = '/doctor/prescriptions'; } },
    { label: 'Configuración', icon: <SettingsIcon fontSize="small" />, onClick: () => { window.location.href = '/settings'; } }
  ];

  useEffect(() => {
    const fetchStats = async () => {
      const token = localStorage.getItem('token');
      try {
        const citaRes = await fetch('/api/appointments/dashboard-stats', { headers: { 'Authorization': `Bearer ${token}` } });
        const citasData = citaRes.ok ? await citaRes.json() : { citasHoy: 0 };
        const citas = citasData.citasHoy || 0;

        // TODO: Reemplazar con endpoints reales para pacientes y consultas del doctor
        // Por ahora, se usan datos de ejemplo
        setStats({ citas, pacientes: 32, consultas: 45 });
      } catch (error) {
        console.error("Error fetching doctor dashboard stats:", error);
        setStats({ citas: 0, pacientes: 0, consultas: 0 }); // Estado por defecto en caso de error
      }
    };
    fetchStats();
  }, []);

  const statCardsData = [
    {
      title: 'Citas hoy',
      value: stats.citas,
      icon: <CalendarMonthIcon fontSize='inherit' />,
      color: '#43a047'
    },
    {
      title: 'Pacientes asignados',
      value: stats.pacientes,
      icon: <PeopleIcon fontSize='inherit' />,
      color: '#1976d2'
    },
    {
      title: 'Consultas este mes',
      value: stats.consultas,
      icon: <MedicationIcon fontSize='inherit' />,
      color: '#d32f2f'
    }
  ];

  return (
    <DashboardLayout title='Dashboard del Doctor'>
      <StatsGrid stats={statCardsData} />

      <h3 className={styles.sectionTitle}>Acciones Rápidas</h3>
      <QuickActionsBar actions={doctorActions} />

      {/* Aquí podrían ir otros componentes específicos del dashboard del doctor,
          como una lista de próximas citas, notificaciones, etc. */}
    </DashboardLayout>
  );
};

export default DoctorDashboard;
