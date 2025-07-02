import DashboardLayout from '../../templates/DashboardLayout/DashboardLayout.jsx';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import PeopleIcon from '@mui/icons-material/People';
import AssignmentIcon from '@mui/icons-material/Assignment';

const secretaryActions = [
  { label: 'Agendar cita', icon: <CalendarMonthIcon fontSize='small' />, onClick: () => { window.location.href = '/appointments/new'; } },
  { label: 'Pacientes', icon: <PeopleIcon fontSize='small' />, onClick: () => { window.location.href = '/patients'; } },
  { label: 'Actividades', icon: <AssignmentIcon fontSize='small' />, onClick: () => { window.location.href = '/secretary/activities'; } }
];

const SecretaryDashboard = () => (
  <DashboardLayout
    title='Dashboard Secretaria (privado)'
    actions={secretaryActions}
    users={[]}
    activities={[]}
    stats={[]}
    appointments={[]}
  />
);

export default SecretaryDashboard;