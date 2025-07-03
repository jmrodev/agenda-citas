import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../templates/DashboardLayout/DashboardLayout.jsx';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import PeopleIcon from '@mui/icons-material/People';
import AssignmentIcon from '@mui/icons-material/Assignment';
import SettingsIcon from '@mui/icons-material/Settings';
import StatCard from '../../molecules/StatCard/StatCard';
import { debugDashboard, debugPatients, debugCalendar } from '../../utils/debug';

const secretaryActions = [
  { label: 'Agendar cita', icon: <CalendarMonthIcon fontSize='small' />, onClick: () => { window.location.href = '/appointments/new'; } },
  { label: 'Pacientes', icon: <PeopleIcon fontSize='small' />, onClick: () => { window.location.href = '/patients'; } },
  { label: 'Actividades', icon: <AssignmentIcon fontSize='small' />, onClick: () => { window.location.href = '/secretary/activities'; } },
  { label: 'Configuración', icon: <SettingsIcon fontSize='small' />, onClick: () => { window.location.href = '/settings'; } }
];

const SecretaryDashboard = () => {
  debugDashboard('Componente SecretaryDashboard iniciado');
  
  const [stats, setStats] = useState({ citas: 0, pacientes: 0, pagos: 0 });
  
  debugDashboard('Estado inicial:', stats);
  
  useEffect(() => {
    debugDashboard('useEffect ejecutado');
    
    const fetchStats = async () => {
      debugDashboard('fetchStats iniciado');
      const token = localStorage.getItem('token');
      debugDashboard('Token:', token ? 'existe' : 'no existe');
      
      try {
        debugCalendar('Haciendo petición a /api/appointments/dashboard-stats');
        const citaRes = await fetch('/api/appointments/dashboard-stats', { 
          headers: { 'Authorization': `Bearer ${token}` } 
        });
        debugCalendar('Respuesta citas:', citaRes.status, citaRes.statusText);
        const citasData = await citaRes.json();
        debugCalendar('Datos citas:', citasData);
        
        debugPatients('Haciendo petición a /api/patients/dashboard-stats');
        const pacRes = await fetch('/api/patients/dashboard-stats', { 
          headers: { 'Authorization': `Bearer ${token}` } 
        });
        debugPatients('Respuesta pacientes:', pacRes.status, pacRes.statusText);
        const pacientesData = await pacRes.json();
        debugPatients('Datos pacientes:', pacientesData);
        
        debugDashboard('Haciendo petición a /api/facility-payments/dashboard-stats');
        const pagosRes = await fetch('/api/facility-payments/dashboard-stats', { 
          headers: { 'Authorization': `Bearer ${token}` } 
        });
        debugDashboard('Respuesta pagos:', pagosRes.status, pagosRes.statusText);
        const pagosData = await pagosRes.json();
        debugDashboard('Datos pagos:', pagosData);
        
        const citas = citasData.citasHoy || 0;
        const pacientes = pacientesData.totalPacientes || 0;
        const pagos = pagosData.totalPagos || 0;
        
        debugDashboard('Estadísticas finales:', { citas, pacientes, pagos });
        setStats({ citas, pacientes, pagos });
        
      } catch (error) {
        debugDashboard('Error en fetchStats:', error);
      }
    };
    
    debugDashboard('Llamando a fetchStats');
    fetchStats();
  }, []);
  
  debugDashboard('Renderizando con stats:', stats);
  
  const statCards = [
    {
      title: 'Citas agendadas hoy',
      value: stats.citas,
      icon: <CalendarMonthIcon fontSize='inherit' />, color: '#43a047'
    },
    {
      title: 'Pacientes registrados',
      value: stats.pacientes,
      icon: <PeopleIcon fontSize='inherit' />, color: '#1976d2'
    },
    {
      title: 'Pagos procesados',
      value: stats.pagos,
      icon: <AssignmentIcon fontSize='inherit' />, color: '#fbc02d'
    }
  ];
  
  debugDashboard('StatCards configuradas:', statCards);
  
  return (
    <DashboardLayout title='Dashboard Secretaria (privado)'>
      <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
        {statCards.map(stat => (
          <StatCard key={stat.title} title={stat.title} value={stat.value} icon={stat.icon} color={stat.color} />
        ))}
      </div>
      {/* ... aquí el resto del dashboard ... */}
    </DashboardLayout>
  );
};

export default SecretaryDashboard;