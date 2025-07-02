import DashboardLayout from '../../templates/DashboardLayout/DashboardLayout.jsx';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import PeopleIcon from '@mui/icons-material/People';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import BarChartIcon from '@mui/icons-material/BarChart';
import PersonAddIcon from '@mui/icons-material/PersonAdd';

const adminActions = [
  { label: 'Nueva cita', icon: <CalendarMonthIcon fontSize='small' />, onClick: () => { window.location.href = '/appointments/new'; } },
  { label: 'Pacientes', icon: <PeopleIcon fontSize='small' />, onClick: () => { window.location.href = '/patients'; } },
  { label: 'Doctores', icon: <MedicalServicesIcon fontSize='small' />, onClick: () => { window.location.href = '/doctors'; } },
  { label: 'Reportes', icon: <BarChartIcon fontSize='small' />, onClick: () => { window.location.href = '/reports'; } },
  { label: 'Agregar usuario', icon: <PersonAddIcon fontSize='small' />, onClick: () => { window.location.href = '/register'; } }
];

const Dashboard = () => (
  <DashboardLayout
    title='Dashboard Admin (privado)'
    actions={adminActions}
    users={[]}
    activities={[]}
    stats={[]}
    appointments={[]}
  />
);

export default Dashboard;
