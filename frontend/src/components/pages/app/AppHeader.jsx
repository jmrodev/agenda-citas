import React, { useState } from 'react';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import LogoutIcon from '@mui/icons-material/Logout';
import UserInfo from '../../molecules/UserInfo/UserInfo';
import DoctorSelector from '../../molecules/DoctorSelector/DoctorSelector';
import { useDoctor } from '../../../hooks/useDoctor';
import { getUserInfo, getRoleDisplayName } from './AppMenu.jsx';
import styles from './AppHeader.module.css';

const AppHeader = () => {
  const user = getUserInfo();
  const { doctor, setDoctorById } = useDoctor();
  const [showSelector, setShowSelector] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [loadingDoctors, setLoadingDoctors] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    window.location.href = '/login';
  };

  return (
    <div className={styles.header}>
      <UserInfo 
        name={user.name} 
        subtitle={getRoleDisplayName(user.role)} 
        badge={user.email} 
      />
      <div className={styles.actions}>
        {/* Selector de doctor solo para secretarias */}
        {user.role === 'secretary' && (
          <button
            onClick={() => setShowSelector(true)}
            className={styles.doctorSelector}
            title="Cambiar doctor"
          >
            <LocalHospitalIcon fontSize="small" />
            <span className={styles.doctorSelectorText}>
              {doctor?.name || 'Seleccionar doctor'}
            </span>
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
          onClick={handleLogout}
          className={styles.logoutButton}
          title="Cerrar sesión"
        >
          <LogoutIcon fontSize="small" />
          <span className={styles.logoutText}>Cerrar sesión</span>
        </button>
      </div>
    </div>
  );
};

export default AppHeader; 