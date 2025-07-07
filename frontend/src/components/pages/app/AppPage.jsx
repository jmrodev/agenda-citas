import React, { useState, useCallback, useMemo } from 'react';
import AppLayout from '../../templates/AppLayout/AppLayout';


import ContentPanel from '../../organisms/ContentPanel/ContentPanel';
import DescriptionIcon from '@mui/icons-material/Description';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import HomeIcon from '@mui/icons-material/Home';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import PeopleIcon from '@mui/icons-material/People';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import EventIcon from '@mui/icons-material/Event';
import PaymentIcon from '@mui/icons-material/Payment';
import AssessmentIcon from '@mui/icons-material/Assessment';
import AssignmentIcon from '@mui/icons-material/Assignment';
import SettingsIcon from '@mui/icons-material/Settings';
import { ViewModeProvider } from '../../context/ViewModeContext';
import ViewModeSelect from '../../organisms/ViewModeSelect/ViewModeSelect';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { DoctorProvider } from '../../context/DoctorContext';
import { useDoctor } from '../../../hooks/useDoctor';
import { getRole } from '../../../auth';
import Alert from '../../atoms/Alert/Alert';
import UserInfo from '../../molecules/UserInfo/UserInfo';
import DoctorSelector from '../../molecules/DoctorSelector/DoctorSelector';
import LogoutIcon from '@mui/icons-material/Logout';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import MedicationIcon from '@mui/icons-material/Medication';
import StatsGrid from '../../organisms/StatsGrid/StatsGrid';
import QuickActionsBar from '../../organisms/QuickActionsBar/QuickActionsBar';

const menuItems = [
  {
    label: 'Archivo',
    icon: <DescriptionIcon fontSize='small' />,
    dropdown: [
      { label: 'Nuevo', icon: <DescriptionIcon fontSize="small" />, onClick: () => alert('Nuevo archivo') },
      { label: 'Abrir', icon: <DescriptionIcon fontSize="small" />, onClick: () => alert('Abrir archivo') },
      { label: 'Guardar', icon: <DescriptionIcon fontSize="small" />, onClick: () => alert('Guardar archivo') }
    ]
  },
  { label: 'Editar', icon: <EditIcon fontSize='small' /> },
  { label: 'Ver', icon: <VisibilityIcon fontSize='small' />, extra: <><ViewModeSelect /></> },
  { label: 'Ayuda', icon: <HelpOutlineIcon fontSize='small' /> }
];

const sideMenuItems = [
  { label: 'Inicio', icon: <HomeIcon fontSize='small' /> },
  { label: 'Agendar cita', icon: <CalendarMonthIcon fontSize='small' /> },
  { label: 'Pacientes', icon: <PeopleIcon fontSize='small' /> },
  { label: 'Doctores', icon: <LocalHospitalIcon fontSize='small' /> },
  { label: 'Calendario', icon: <EventIcon fontSize='small' /> },
  { label: 'Pagos', icon: <PaymentIcon fontSize='small' /> },
  { label: 'Obras Sociales', icon: <AssignmentIcon fontSize='small' />, route: '/health-insurances' },
  { label: 'Reportes', icon: <AssessmentIcon fontSize='small' /> },
  { label: 'Actividades', icon: <AssignmentIcon fontSize='small' /> },
  { label: 'Configuración', icon: <SettingsIcon fontSize='small' /> }
];

const SideContentPanels = [
  () => <div><h2>Bienvenida</h2><p>Panel principal de la secretaria.</p></div>,
  () => <div><h2>Agendar cita</h2><p>Aquí puedes crear una nueva cita.</p></div>,
  ({ doctor, crudMode }) => <PatientsTablePanel doctor={doctor} crudMode={crudMode} />, // Pacientes filtrados por doctor y con modo CRUD
  () => <DoctorDashboard />,
  () => <CalendarPage />,
  () => <PaymentStats />,
  () => <div><h2>Reportes</h2><p>Sección de reportes y estadísticas.</p></div>,
  () => <ActivityLogList activities={[]} />, // Puedes pasarle datos reales si tienes
  () => <Settings />
];

const getUserInfo = () => {
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

// Menús específicos por rol
const getMenuByRole = (role) => {
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
const getQuickActionsByRole = (role) => {
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

// Dashboard content por rol
const getDashboardContentByRole = (role, doctor, stats) => {
  switch (role) {
    case 'admin':
      return (
        <div>
          <h2>Dashboard de Administración</h2>
          <StatsGrid stats={[
            { title: 'Pacientes activos', value: stats.pacientes || 0, icon: <PeopleIcon fontSize='inherit' />, color: '#1976d2' },
            { title: 'Citas hoy', value: stats.citas || 0, icon: <CalendarMonthIcon fontSize='inherit' />, color: '#43a047' },
            { title: 'Doctores', value: stats.doctores || 0, icon: <LocalHospitalIcon fontSize='inherit' />, color: '#d32f2f' },
            { title: 'Secretarias', value: stats.secretarias || 0, icon: <SupervisorAccountIcon fontSize='inherit' />, color: '#fbc02d' }
          ]} />
          <h3>Acciones Rápidas</h3>
          <QuickActionsBar actions={getQuickActionsByRole(role)} />
        </div>
      );
    
    case 'doctor':
      return (
        <div>
          <h2>Dashboard del Doctor</h2>
          <StatsGrid stats={[
            { 
              title: 'Mi actividad',
              value: `${stats.citas || 0} citas | ${stats.pacientes || 0} pacientes | ${stats.consultas || 0} consultas`,
              icon: <PeopleIcon fontSize='inherit' />,
              color: '#1976d2'
            }
          ]} />
          <h3>Acciones Rápidas</h3>
          <QuickActionsBar actions={getQuickActionsByRole(role)} />
        </div>
      );
    
    case 'secretary':
      return (
        <div>
          <h2>Dashboard de Secretaría</h2>
          <StatsGrid stats={[
            { title: 'Citas hoy', value: stats.citas || 0, icon: <CalendarMonthIcon fontSize='inherit' />, color: '#43a047' },
            { title: 'Pacientes', value: stats.pacientes || 0, icon: <PeopleIcon fontSize='inherit' />, color: '#1976d2' },
            { title: 'Doctores', value: stats.doctores || 0, icon: <LocalHospitalIcon fontSize='inherit' />, color: '#d32f2f' }
          ]} />
          <h3>Acciones Rápidas</h3>
          <QuickActionsBar actions={getQuickActionsByRole(role)} />
        </div>
      );
    
    default:
      return <div><h2>Bienvenido</h2><p>Selecciona una opción del menú.</p></div>;
  }
};

const DesktopHeader = () => {
  const user = getUserInfo();
  const { doctor, setDoctorById } = useDoctor();
  const [showSelector, setShowSelector] = React.useState(false);
  const [doctors, setDoctors] = React.useState([]);
  const [loadingDoctors, setLoadingDoctors] = React.useState(false);

  const getRoleDisplayName = (role) => {
    switch (role) {
      case 'admin': return 'Administrador';
      case 'doctor': return 'Doctor';
      case 'secretary': return 'Secretaria';
      default: return role;
    }
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 2rem', height: 64, background: 'var(--surface, #fff)', borderBottom: '1px solid var(--border-color, #e5e7eb)' }}>
      <UserInfo 
        name={user.name} 
        subtitle={getRoleDisplayName(user.role)} 
        badge={user.email} 
      />
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        {/* Selector de doctor solo para secretarias */}
        {user.role === 'secretary' && (
          <button
            onClick={() => setShowSelector(true)}
            style={{
              background: 'none',
              border: '1px solid var(--primary-color, #1976d2)',
              color: 'var(--primary-color, #1976d2)',
              cursor: 'pointer',
              fontSize: 16,
              padding: '6px 16px',
              borderRadius: 6,
              display: 'flex',
              alignItems: 'center',
              gap: 8
            }}
            title="Cambiar doctor"
          >
            <LocalHospitalIcon fontSize="small" />
            <span>{doctor?.name || 'Seleccionar doctor'}</span>
          </button>
        )}
        
        {showSelector && user.role === 'secretary' && (
          <DoctorSelector
            variant='dropdown'
            doctors={doctors.map(d => ({ ...d, name: d.name || `Dr. ${d.first_name} ${d.last_name}` }))}
            selectedDoctor={doctor}
            onSelect={id => {
              setDoctorById(id);
              setShowSelector(false);
            }}
            onClose={() => setShowSelector(false)}
          />
        )}
        
        <button
          onClick={() => {
            localStorage.removeItem('token');
            localStorage.removeItem('role');
            window.location.href = '/login';
          }}
          style={{
            background: 'none',
            border: '1px solid var(--primary-color, #1976d2)',
            color: 'var(--primary-color, #1976d2)',
            cursor: 'pointer',
            fontSize: 16,
            padding: '6px 16px',
            borderRadius: 6,
            display: 'flex',
            alignItems: 'center',
            gap: 8
          }}
          title="Cerrar sesión"
        >
          <LogoutIcon fontSize="small" />
          <span>Cerrar sesión</span>
        </button>
      </div>
    </div>
  );
};

const DesktopAppPageInner = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const userRole = getRole();
  const [stats, setStats] = React.useState({ pacientes: 0, citas: 0, doctores: 0, secretarias: 0, consultas: 0 });
  
  const menuItems = getMenuByRole(userRole);
  const activeIndex = menuItems.findIndex(item => location.pathname.startsWith(item.route));

  // Cargar estadísticas según el rol
  React.useEffect(() => {
    const fetchStats = async () => {
      try {
        // Aquí deberías hacer fetch real de estadísticas según el rol
        // Por ahora usamos datos mock
        setStats({ pacientes: 150, citas: 25, doctores: 8, secretarias: 3, consultas: 45 });
      } catch (error) {
        console.error('Error cargando estadísticas:', error);
      }
    };
    fetchStats();
  }, [userRole]);

  return (
    <AppLayout
      menuBar={<DesktopHeader />}
      sideMenu={
        <nav style={{ padding: 0 }}>
          <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
            {menuItems.map((item, idx) => (
              <li key={item.label}>
                <button
                  onClick={() => navigate(item.route)}
                  style={{
                    display: 'flex', alignItems: 'center', width: '100%',
                    background: idx === activeIndex ? 'var(--primary-color, #1976d2)' : 'transparent',
                    color: idx === activeIndex ? '#fff' : 'inherit',
                    border: 'none', outline: 'none', padding: '12px 20px', cursor: 'pointer',
                    fontWeight: idx === activeIndex ? 'bold' : 'normal', fontSize: 16
                  }}
                >
                  {item.icon}
                  <span style={{ marginLeft: 12 }}>{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>
      }
    >
      <div style={{ padding: 24, minHeight: 400 }}>
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
      <DesktopAppPageInner />
    </ViewModeProvider>
  </DoctorProvider>
);

export default AppPage; 