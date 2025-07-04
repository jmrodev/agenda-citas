import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../templates/DashboardLayout/DashboardLayout.jsx';
import StatsGrid from '../../organisms/StatsGrid/StatsGrid.jsx'; // Importar StatsGrid
// Los iconos sí se necesitan para definir los datos de statCards.
import PeopleIcon from '@mui/icons-material/People';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import { authFetch } from '../../../utils/authFetch';

const DashboardAdmin = () => {
  const [stats, setStats] = useState({ pacientes: 0, citas: 0, doctores: 0, secretarias: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [pacRes, citaRes, docRes, secRes] = await Promise.all([
          authFetch('/api/patients/dashboard-stats'),
          authFetch('/api/appointments/dashboard-stats'),
          authFetch('/api/doctors/dashboard-stats'),
          authFetch('/api/secretaries/dashboard-stats')
        ]);
        // Helper para parsear JSON y obtener el valor o 0
        const getJSONValue = async (response, key, defaultValue = 0) => {
          if (!response || !response.ok) return defaultValue;
          const data = await response.json();
          return data[key] || defaultValue;
        };
        const pacientes = await getJSONValue(pacRes, 'totalPacientes');
        const citas = await getJSONValue(citaRes, 'citasHoy');
        const doctores = await getJSONValue(docRes, 'totalDoctores');
        const secretarias = await getJSONValue(secRes, 'totalSecretarias');
        setStats({ pacientes, citas, doctores, secretarias });
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        // Podrías establecer un estado de error aquí para mostrarlo en la UI
      }
    };
    fetchStats();
  }, []);

  const statCardsData = [
    {
      title: 'Pacientes activos',
      value: stats.pacientes,
      icon: <PeopleIcon fontSize='inherit' />,
      color: '#1976d2'
    },
    {
      title: 'Citas hoy',
      value: stats.citas,
      icon: <CalendarMonthIcon fontSize='inherit' />,
      color: '#43a047'
    },
    {
      title: 'Doctores',
      value: stats.doctores,
      icon: <LocalHospitalIcon fontSize='inherit' />,
      color: '#d32f2f'
    },
    {
      title: 'Secretarias',
      value: stats.secretarias,
      icon: <SupervisorAccountIcon fontSize='inherit' />,
      color: '#fbc02d'
    }
  ];

  return (
    <DashboardLayout title="Bienvenido, Administrador">
      <StatsGrid stats={statCardsData} />
    </DashboardLayout>
  );
};

export default DashboardAdmin; 