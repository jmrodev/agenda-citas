import React from 'react';
import PeopleIcon from '@mui/icons-material/People';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import AssignmentIcon from '@mui/icons-material/Assignment';
import AssessmentIcon from '@mui/icons-material/Assessment';
import SettingsIcon from '@mui/icons-material/Settings';
import MedicationIcon from '@mui/icons-material/Medication';

// Menús específicos por rol
export const getMenuByRole = (role) => {
  const baseMenu = [
    { label: 'Pacientes', icon: <PeopleIcon fontSize='small' />, route: 'patients' },
    { label: 'Agenda', icon: <CalendarMonthIcon fontSize='small' />, route: 'calendar' },
    { label: 'Configuración', icon: <SettingsIcon fontSize='small' />, route: 'settings' }
  ];

  switch (role) {
    case 'admin':
      return [
        ...baseMenu,
        { label: 'Doctores', icon: <LocalHospitalIcon fontSize='small' />, route: 'doctors' },
        { label: 'Secretarias', icon: <SupervisorAccountIcon fontSize='small' />, route: 'secretaries' },
        { label: 'Obras Sociales', icon: <AssignmentIcon fontSize='small' />, route: 'health-insurances' },
        { label: 'Reportes', icon: <AssessmentIcon fontSize='small' />, route: 'reports' }
      ];
    
    case 'doctor':
      return [
        ...baseMenu,
        { label: 'Recetas', icon: <MedicationIcon fontSize='small' />, route: 'prescriptions' },
        { label: 'Estadísticas', icon: <AssessmentIcon fontSize='small' />, route: 'stats' }
      ];
    
    case 'secretary':
      return [
        ...baseMenu,
        { label: 'Obras Sociales', icon: <AssignmentIcon fontSize='small' />, route: 'health-insurances' },
        { label: 'Estadísticas', icon: <AssessmentIcon fontSize='small' />, route: 'stats' }
      ];
    
    default:
      return baseMenu;
  }
};

// Acciones rápidas por rol
export const getQuickActionsByRole = (role) => {
  const baseActions = [
    { label: 'Agendar cita', icon: <CalendarMonthIcon fontSize="small" />, onClick: () => window.location.href = '/app/calendar' },
    { label: 'Nuevo paciente', icon: <PeopleIcon fontSize="small" />, onClick: () => window.location.href = '/app/patients/new' }
  ];

  switch (role) {
    case 'admin':
      return [
        ...baseActions,
        { label: 'Nuevo doctor', icon: <LocalHospitalIcon fontSize="small" />, onClick: () => window.location.href = '/app/doctors/new' },
        { label: 'Nueva secretaria', icon: <SupervisorAccountIcon fontSize="small" />, onClick: () => window.location.href = '/app/secretaries/new' }
      ];
    
    case 'doctor':
      return [
        ...baseActions,
        { label: 'Mis citas', icon: <CalendarMonthIcon fontSize="small" />, onClick: () => window.location.href = '/app/calendar' },
        { label: 'Nueva receta', icon: <MedicationIcon fontSize="small" />, onClick: () => window.location.href = '/app/prescriptions/new' }
      ];
    
    case 'secretary':
      return [
        ...baseActions,
        { label: 'Obras sociales', icon: <AssignmentIcon fontSize="small" />, onClick: () => window.location.href = '/app/health-insurances' },
        { label: 'Estadísticas', icon: <AssessmentIcon fontSize="small" />, onClick: () => window.location.href = '/app/stats' }
      ];
    
    default:
      return baseActions;
  }
};

// Función para obtener información del usuario desde el token
export const getUserInfo = () => {
  const token = localStorage.getItem('token');
  if (!token) return { name: 'Usuario', role: '', email: '' };
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return {
      name: payload.username || 'Usuario',
      role: payload.role || '',
      email: payload.email || ''
    };
  } catch {
    return { name: 'Usuario', role: '', email: '' };
  }
};

// Función para obtener el nombre de display del rol
export const getRoleDisplayName = (role) => {
  switch (role) {
    case 'admin': return 'Administrador';
    case 'doctor': return 'Doctor';
    case 'secretary': return 'Secretaria';
    default: return role;
  }
}; 