import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../../templates/DashboardLayout/DashboardLayout.jsx'; // Adjusted path
import StatCard from '../../../molecules/StatCard/StatCard'; // Adjusted path
import PeopleIcon from '@mui/icons-material/People';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import styles from './DashboardAdmin.module.css';

const DashboardAdmin = () => {
  const [stats, setStats] = useState({ pacientes: 0, citas: 0, doctores: 0, secretarias: 0 });
  useEffect(() => {
    const fetchStats = async () => {
      const token = localStorage.getItem('token');
      const [pacRes, citaRes, docRes, secRes] = await Promise.all([
        fetch('/api/patients/dashboard-stats', { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch('/api/appointments/dashboard-stats', { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch('/api/doctors/dashboard-stats', { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch('/api/secretaries/dashboard-stats', { headers: { 'Authorization': `Bearer ${token}` } })
      ]);
      const pacientes = (await pacRes.json()).totalPacientes || 0;
      const citas = (await citaRes.json()).citasHoy || 0;
      const doctores = (await docRes.json()).totalDoctores || 0;
      const secretarias = (await secRes.json()).totalSecretarias || 0;
      setStats({ pacientes, citas, doctores, secretarias });
    };
    fetchStats();
  }, []);
  const statCards = [
    {
      title: 'Pacientes activos',
      value: stats.pacientes,
      icon: <PeopleIcon fontSize='inherit' />, color: '#1976d2'
    },
    {
      title: 'Citas hoy',
      value: stats.citas,
      icon: <CalendarMonthIcon fontSize='inherit' />, color: '#43a047'
    },
    {
      title: 'Doctores',
      value: stats.doctores,
      icon: <LocalHospitalIcon fontSize='inherit' />, color: '#d32f2f'
    },
    {
      title: 'Secretarias',
      value: stats.secretarias,
      icon: <SupervisorAccountIcon fontSize='inherit' />, color: '#fbc02d'
    }
  ];
  return (
    <DashboardLayout>
      <h1>Bienvenido, Administrador</h1>
      <div className={styles.statsContainer}>
        {statCards.map(stat => (
          <StatCard key={stat.title} title={stat.title} value={stat.value} icon={stat.icon} color={stat.color} />
        ))}
      </div>
    </DashboardLayout>
  );
};

export default DashboardAdmin; 