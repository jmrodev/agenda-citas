import DashboardLayout from '../../templates/DashboardLayout/DashboardLayout.jsx';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import PeopleIcon from '@mui/icons-material/People';
import MedicationIcon from '@mui/icons-material/Medication';

const doctorActions = [
  { label: 'Mis citas', icon: <CalendarMonthIcon fontSize='small' />, onClick: () => { window.location.href = '/doctor/appointments'; } },
  { label: 'Pacientes', icon: <PeopleIcon fontSize='small' />, onClick: () => { window.location.href = '/doctor/patients'; } },
  { label: 'Recetas', icon: <MedicationIcon fontSize='small' />, onClick: () => { window.location.href = '/doctor/prescriptions'; } }
];

const DoctorDashboard = () => (
  <DashboardLayout
    title='Dashboard Doctor (privado)'
    actions={doctorActions}
    users={[]}
    activities={[]}
    stats={[]}
    appointments={[]}
  />
);

export default DoctorDashboard;
