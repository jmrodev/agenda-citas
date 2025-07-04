import React, { useState, useCallback, useMemo } from 'react';
import DesktopAppLayout from '../../templates/DesktopAppLayout/DesktopAppLayout';
import DesktopMenuBar from '../../organisms/DesktopMenuBar/DesktopMenuBar';
import DesktopSideMenu from '../../organisms/DesktopSideMenu/DesktopSideMenu';
import DesktopContentPanel from '../../organisms/DesktopContentPanel/DesktopContentPanel';
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
// Componentes reales:
import PatientsTablePanel from '../patients/PatientsTablePanel';
import DoctorDashboard from '../dashboard/DoctorDashboard';
import CalendarPage from '../calendar/CalendarPage';
import PaymentStats from '../dashboard/PaymentStats';
import Settings from '../Settings';
import ActivityLogList from '../../organisms/ActivityLogList/ActivityLogList';
import { DoctorProvider } from '../../context/DoctorContext';
import { useDoctor } from '../../../hooks/useDoctor';
import Alert from '../../atoms/Alert/Alert';
import UserInfo from '../../molecules/UserInfo/UserInfo';
import DoctorSelector from '../../molecules/DoctorSelector/DoctorSelector';
import LogoutIcon from '@mui/icons-material/Logout';

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

// Menú lateral solo para secretaria
const secretaryMenu = [
  { label: 'Pacientes', icon: <PeopleIcon fontSize='small' />, route: '/patients' },
  { label: 'Obras Sociales', icon: <AssignmentIcon fontSize='small' />, route: '/health-insurances' },
  { label: 'Agenda', icon: <CalendarMonthIcon fontSize='small' />, route: '/calendar' },
  { label: 'Configuración', icon: <SettingsIcon fontSize='small' />, route: '/settings' }
];

const SecretaryHeader = () => {
  const user = getUserInfo();
  const { doctor, setDoctorById } = useDoctor();
  const [showSelector, setShowSelector] = React.useState(false);
  const [doctors, setDoctors] = React.useState([]);
  const [loadingDoctors, setLoadingDoctors] = React.useState(false);

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 2rem', height: 64, background: 'var(--surface, #fff)', borderBottom: '1px solid var(--border-color, #e5e7eb)' }}>
      <UserInfo name={user.name} subtitle={user.role === 'secretary' ? 'Secretaria' : user.role} badge={user.email} />
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
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
        {showSelector && (
          loadingDoctors ? (
            <div style={{ position: 'absolute', right: 32, top: 72, background: '#fff', border: '1px solid #ccc', padding: 24, borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
              <p style={{ margin: 0 }}>Cargando doctores...</p>
            </div>
          ) : doctors.length === 0 ? (
            <div style={{ position: 'absolute', right: 32, top: 72, background: '#fff', border: '1px solid #ccc', padding: 24, borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
              <p style={{ margin: 0 }}>No hay doctores disponibles.</p>
              <button onClick={() => setShowSelector(false)} style={{ marginTop: 12 }}>Cerrar</button>
            </div>
          ) : (
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
          )
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
  const activeIndex = secretaryMenu.findIndex(item => location.pathname.startsWith(item.route));

  return (
    <DesktopAppLayout
      menuBar={<SecretaryHeader />}
      sideMenu={
        <nav style={{ padding: 0 }}>
          <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
            {secretaryMenu.map((item, idx) => (
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
        <Outlet />
      </div>
    </DesktopAppLayout>
  );
};

const DesktopAppPage = () => (
  <DoctorProvider>
    <ViewModeProvider>
      <DesktopAppPageInner />
    </ViewModeProvider>
  </DoctorProvider>
);

export default DesktopAppPage; 