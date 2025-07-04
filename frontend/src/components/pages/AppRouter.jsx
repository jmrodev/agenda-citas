import React from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Login from './auth/Login';
import Register from './auth/Register';
import AdminDashboard from './dashboard/DashboardAdmin';
import DoctorDashboard from './dashboard/DoctorDashboard';
import SecretaryDashboard from './dashboard/SecretaryDashboard';
import RequireAuth from './auth/RequireAuth';
import Settings from './Settings';
import DashboardAdmin from './dashboard/DashboardAdmin';
import PaymentStats from './dashboard/PaymentStats.jsx';
import PatientsList from './patients/PatientsList.jsx';
import CalendarPage from './calendar/CalendarPage';
import DesktopAppPage from './desktop/DesktopAppPage';
import HealthInsurancesPage from './healthinsurances/HealthInsurancesPage';

// Componente que redirige según el rol del usuario
const HomePage = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  
  React.useEffect(() => {
    if (!token) {
      navigate('/login', { replace: true });
      return;
    }
    
    try {
      // Decodificar el token para obtener el rol
      const payload = JSON.parse(atob(token.split('.')[1]));
      const userRole = payload.role;
      
      switch (userRole) {
        case 'admin':
          navigate('/admin', { replace: true });
          break;
        case 'doctor':
          navigate('/doctor', { replace: true });
          break;
        case 'secretary':
          navigate('/secretary', { replace: true });
          break;
        default:
          navigate('/login', { replace: true });
          break;
      }
    } catch (error) {
      // Si hay error al decodificar el token, ir a login
      localStorage.removeItem('token');
      navigate('/login', { replace: true });
    }
  }, [navigate, token]);

  // Mostrar un loading mientras redirige
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      background: 'var(--app-bg, #f9fafb)'
    }}>
      <div>Cargando...</div>
    </div>
  );
};

export default function AppRouter() {
    return (
        <>
            <Routes>
                <Route path='/login' element={<Login />} />
                <Route path='/register' element={<Register />} />
                <Route path='/' element={<HomePage />} />
                <Route path='/admin' element={
                    <RequireAuth allowedRoles={['admin']}>
                        <DashboardAdmin />
                    </RequireAuth>
                } />
                <Route path='/doctor' element={
                    <RequireAuth allowedRoles={['doctor']}>
                        <DoctorDashboard />
                    </RequireAuth>
                } />
                <Route path='/secretary' element={
                    <RequireAuth allowedRoles={['secretary']}>
                        <DesktopAppPage />
                    </RequireAuth>
                } />
                <Route path='/secretary/payment-stats' element={
                    <RequireAuth allowedRoles={['secretary']}>
                        <PaymentStats />
                    </RequireAuth>
                } />
                <Route path='/settings' element={<Settings />} />
                <Route path='/patients' element={
                  <RequireAuth allowedRoles={['admin', 'secretary']}>
                    <PatientsList />
                  </RequireAuth>
                } />
                <Route path='/calendar' element={
                  <RequireAuth allowedRoles={['admin', 'secretary']}>
                    <CalendarPage />
                  </RequireAuth>
                } />
                <Route path='/register-doctor' element={
                  <RequireAuth allowedRoles={['admin', 'secretary']}>
                    <Register defaultRole='doctor' />
                  </RequireAuth>
                } />
                <Route path='/health-insurances' element={
                  <RequireAuth allowedRoles={['admin', 'secretary']}>
                    <HealthInsurancesPage />
                  </RequireAuth>
                } />
                <Route path='*' element={<Navigate to='/login' />} />
            </Routes>
        </>
    );
}

