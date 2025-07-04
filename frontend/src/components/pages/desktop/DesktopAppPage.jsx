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
import { useNavigate } from 'react-router-dom';
// Componentes reales:
import PatientsTablePanel from '../patients/PatientsTablePanel';
import DoctorDashboard from '../dashboard/DoctorDashboard';
import CalendarPage from '../calendar/CalendarPage';
import PaymentStats from '../dashboard/PaymentStats';
import Settings from '../Settings';
import ActivityLogList from '../../organisms/ActivityLogList/ActivityLogList';
import { DoctorProvider, useDoctor } from '../../context/DoctorContext';
import Alert from '../../atoms/Alert/Alert';

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

const getUserRole = () => {
  const token = localStorage.getItem('token');
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.role;
  } catch {
    return null;
  }
};

const DesktopAppPageInner = () => {
  const [selectedSide, setSelectedSide] = useState(0);
  const [crudMode, setCrudMode] = useState(false);
  const [crudAlert, setCrudAlert] = useState('');
  const [crudAlertType, setCrudAlertType] = useState('info');
  const { doctor, setDoctor, setDoctorById } = useDoctor();
  const [doctors, setDoctors] = useState([]);
  const navigate = useNavigate();
  const userRole = getUserRole();

  // Obtener lista de doctores para el menú
  React.useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('/api/doctors', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        setDoctors(data);
      } catch (err) {
        setDoctors([]);
      }
    };
    fetchDoctors();
  }, []);

  const handleSideMenu = idx => {
    const item = sideMenuItems[idx];
    if (item.route) {
      navigate(item.route);
      setSelectedSide(idx);
      return;
    }
    if (item.onClick) {
      item.onClick();
      return;
    }
    setSelectedSide(idx);
  };

  const toggleCrudMode = useCallback(() => {
    setCrudMode(v => {
      const next = !v;
      setCrudAlert(next ? 'Se habilitó la edición' : 'Se deshabilitó la edición');
      setCrudAlertType(next ? 'danger' : 'success');
      setTimeout(() => setCrudAlert(''), 2000);
      return next;
    });
  }, []);

  // Menú de doctores en vez de opciones de archivo
  const doctorDropdown = doctors.map(d => ({
    label: d.name || `Dr. ${d.first_name} ${d.last_name}`,
    onClick: () => setDoctorById(d.doctor_id || d.id)
  }));

  const menuItemsWithDoctor = useMemo(() => {
    return [
      {
        ...menuItems[0],
        label: (
          <span>
            {doctor && doctor.name ? doctor.name : 'Doctor'}
            {doctor && doctor.specialty && (
              <><br /><span style={{ fontSize: 12, color: '#666' }}>{doctor.specialty}</span></>
            )}
            {doctor && doctor.email && (
              <><br /><span style={{ fontSize: 12, color: '#888' }}>{doctor.email}</span></>
            )}
          </span>
        ),
        dropdown: doctorDropdown
      },
      ...menuItems.slice(1, 2),
      {
        ...menuItems[2],
        extra: <ViewModeSelect />
      },
      ...menuItems.slice(3)
    ];
  }, [doctor, doctors]);

  const menuItemsWithCrud = useMemo(() => menuItemsWithDoctor.map(item =>
    item.label === 'Editar'
      ? { ...item, onClick: toggleCrudMode }
      : item
  ), [toggleCrudMode, menuItemsWithDoctor]);

  // Filtrar menú lateral según rol
  const filteredSideMenuItems = useMemo(() => {
    return sideMenuItems.filter(item => {
      if (item.label === 'Obras Sociales') {
        return userRole === 'admin' || userRole === 'secretary';
      }
      return true;
    });
  }, [userRole]);

  const Panel = SideContentPanels[selectedSide];

  return (
    <DesktopAppLayout
      menuBar={<DesktopMenuBar menuItems={menuItemsWithCrud} />}
      sideMenu={<DesktopSideMenu menuItems={filteredSideMenuItems} onMenuSelect={handleSideMenu} />}
    >
      {crudAlert && (
        <div style={{
          position: 'fixed',
          top: 24,
          right: 32,
          zIndex: 2000,
          minWidth: 220,
          maxWidth: 320
        }}>
          <Alert type={crudAlertType}>{crudAlert}</Alert>
        </div>
      )}
      <DesktopContentPanel>
        <Panel doctor={doctor} crudMode={crudMode} />
      </DesktopContentPanel>
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