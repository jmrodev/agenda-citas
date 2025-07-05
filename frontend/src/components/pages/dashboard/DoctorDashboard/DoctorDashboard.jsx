import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../../templates/DashboardLayout/DashboardLayout.jsx'; // Adjusted path
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import PeopleIcon from '@mui/icons-material/People';
import MedicationIcon from '@mui/icons-material/Medication';
import SettingsIcon from '@mui/icons-material/Settings';
import StatCard from '../../../molecules/StatCard/StatCard'; // Adjusted path
import styles from './DoctorDashboard.module.css'; // Path will be correct once this file is in the new folder

const doctorActions = [
  { label: 'Mis citas', icon: <CalendarMonthIcon fontSize='small' />, onClick: () => { window.location.href = '/doctor/appointments'; } },
  { label: 'Pacientes', icon: <PeopleIcon fontSize='small' />, onClick: () => { window.location.href = '/doctor/patients'; } },
  { label: 'Recetas', icon: <MedicationIcon fontSize='small' />, onClick: () => { window.location.href = '/doctor/prescriptions'; } },
  { label: 'Configuración', icon: <SettingsIcon fontSize='small' />, onClick: () => { window.location.href = '/settings'; } }
];

const DoctorDashboard = () => {
  const [stats, setStats] = useState({ citas: 0, pacientes: 0, consultas: 0 });
  useEffect(() => {
    const fetchStats = async () => {
      const token = localStorage.getItem('token');
      // Citas de hoy
      const citaRes = await fetch('/api/appointments/dashboard-stats', { headers: { 'Authorization': `Bearer ${token}` } });
      const citas = (await citaRes.json()).citasHoy || 0;
      // Pacientes asignados y consultas este mes: datos de ejemplo (reemplazar por endpoints reales si existen)
      setStats({ citas, pacientes: 32, consultas: 45 });
    };
    fetchStats();
  }, []);
  const statCards = [
    {
      title: 'Citas hoy',
      value: stats.citas,
      icon: <CalendarMonthIcon fontSize='inherit' />, theme: 'themeSuccess'
    },
    {
      title: 'Pacientes asignados',
      value: stats.pacientes,
      icon: <PeopleIcon fontSize='inherit' />, theme: 'themeInfo'
    },
    {
      title: 'Consultas este mes',
      value: stats.consultas,
      icon: <MedicationIcon fontSize='inherit' />, theme: 'themeDanger'
    }
  ];
  return (
    <DashboardLayout title='Dashboard Doctor (privado)'>
      <div className={styles.statsContainer}>
        {statCards.map(stat => (
          <StatCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            className={styles[stat.theme]}
          />
        ))}
      </div>
      <DashboardLayout
        title='Dashboard Doctor (privado)'
        actions={doctorActions}
        users={[]}
        activities={[]}
        stats={[]}
        appointments={[]}
      />
    </DashboardLayout>
  );
};

export default DoctorDashboard;
