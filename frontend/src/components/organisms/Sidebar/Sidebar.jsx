import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import styles from './Sidebar.module.css';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { createLogger } from '../../../utils/debug.js';

const Sidebar = () => {
  const logger = createLogger('Sidebar');
  logger.log('Componente iniciado');
  
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  
  logger.log('Token:', token ? 'existe' : 'no existe');
  logger.log('Role:', role);
  logger.log('Location:', location.pathname);
  
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const userRole = user.role || role || 'admin';

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <aside className={styles.aside}>
      <nav>
        <ul>
          <li>
            <Link to='/'>Dashboard</Link>
          </li>
          <li>
            <Link to='/settings'>Configuración</Link>
          </li>
          {/* Accesos adicionales según rol */}
          {userRole === 'admin' && (
            <>
              <li><Link to='/app/patients'>Pacientes</Link></li>
              <li><Link to='/app/doctors'>Doctores</Link></li>
              <li><Link to='/app/calendar'>Calendario</Link></li>
              <li><Link to='/app/reports'>Reportes</Link></li>
              <li><Link to='/app/register'>Agregar usuario</Link></li>
            </>
          )}
          {userRole === 'secretary' && (
            <>
              <li>
                <Link to="/secretary" className={location.pathname === '/secretary' ? 'active' : ''}>
                  <DashboardIcon />
                  <span>Dashboard</span>
                </Link>
              </li>
              <li>
                <Link to="/patients" className={location.pathname === '/patients' ? 'active' : ''}>
                  <PeopleIcon />
                  <span>Pacientes</span>
                </Link>
              </li>
              <li>
                <Link to="/calendar" className={location.pathname === '/calendar' ? 'active' : ''}>
                  <CalendarMonthIcon />
                  <span>Calendario</span>
                </Link>
              </li>
              <li>
                <Link to="/secretary/payment-stats" className={location.pathname === '/secretary/payment-stats' ? 'active' : ''}>
                  <AttachMoneyIcon />
                  <span>Estadísticas de Caja</span>
                </Link>
              </li>
            </>
          )}
          <li>
            <button onClick={handleLogout} className={styles.logoutBtn}>Cerrar sesión</button>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar; 