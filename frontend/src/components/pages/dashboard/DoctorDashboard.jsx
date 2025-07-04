import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../templates/DashboardLayout/DashboardLayout.jsx';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import PeopleIcon from '@mui/icons-material/People';
import MedicationIcon from '@mui/icons-material/Medication';
import SettingsIcon from '@mui/icons-material/Settings';
import StatsGrid from '../../organisms/StatsGrid/StatsGrid.jsx';
import QuickActionsBar from '../../organisms/QuickActionsBar/QuickActionsBar.jsx';
import { useDoctor } from '../../../hooks/useDoctor';
import styles from './DoctorDashboard.module.css';

const mockDoctors = [
  { id: 1, name: 'Dr. Juan Pérez' },
  { id: 2, name: 'Dra. Ana López' },
  { id: 3, name: 'Dr. Carlos Gómez' }
];

const DoctorDashboard = () => {
  const [stats, setStats] = useState({ citas: 0, pacientes: 0, consultas: 0 });
  const [doctors, setDoctors] = useState(mockDoctors);
  const { doctor, setDoctor, setDoctorById } = useDoctor();

  useEffect(() => {
    // Simular fetch de doctores reales si es necesario
    setDoctors(mockDoctors);
    if (!doctor) setDoctor(mockDoctors[0]);
  }, []);

  useEffect(() => {
    // Simular fetch de stats por doctor
    if (!doctor) return;
    // Aquí deberías hacer fetch real según doctor.id
    setStats({ citas: 5 * doctor.id, pacientes: 30 + doctor.id, consultas: 10 * doctor.id });
  }, [doctor]);

  const doctorStatCard = {
    doctor,
    doctors,
    value: `${stats.citas} citas | ${stats.pacientes} pacientes | ${stats.consultas} consultas` ,
    icon: <PeopleIcon fontSize='inherit' />,
    color: '#1976d2',
    selected: true,
    onDoctorChange: setDoctorById
  };

  // Puedes agregar más StatCards si lo deseas

  const doctorActions = [
    { label: 'Mis citas', icon: <CalendarMonthIcon fontSize="small" />, onClick: () => { window.location.href = '/doctor/appointments'; } },
    { label: 'Pacientes', icon: <PeopleIcon fontSize="small" />, onClick: () => { window.location.href = '/doctor/patients'; } },
    { label: 'Recetas', icon: <MedicationIcon fontSize="small" />, onClick: () => { window.location.href = '/doctor/prescriptions'; } },
    { label: 'Configuración', icon: <SettingsIcon fontSize="small" />, onClick: () => { window.location.href = '/settings'; } }
  ];

  return (
    <DashboardLayout title='Dashboard del Doctor'>
      <StatsGrid stats={[doctorStatCard]} />
      <h3 className={styles.sectionTitle}>Acciones Rápidas</h3>
      <QuickActionsBar actions={doctorActions} />
    </DashboardLayout>
  );
};

export default DoctorDashboard;
