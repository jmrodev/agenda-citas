import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import RequireAuth from './auth/RequireAuth'; // Importación directa
import RoleBasedRedirect from './auth/RoleBasedRedirect';
import Loader from '../atoms/Loader/Loader';

// Lazy loading de todas las páginas
const Login = lazy(() => import('./auth/Login'));
const Register = lazy(() => import('./auth/Register'));

// Dashboard pages
const DashboardAdmin = lazy(() => import('./dashboard/DashboardAdmin'));
const SecretaryDashboard = lazy(() => import('./dashboard/SecretaryDashboard'));
const DoctorDashboard = lazy(() => import('./dashboard/DoctorDashboard')); // Corregido
const PaymentStats = lazy(() => import('./dashboard/PaymentStats'));

// Patient pages
const PatientList = lazy(() => import('./patients/PatientsList'));
const PatientForm = lazy(() => import('./patients/PatientForm'));
const PatientView = lazy(() => import('./patients/PatientView'));

// Calendar pages
const CalendarPage = lazy(() => import('./calendar/CalendarPage'));

// Health insurance pages
const HealthInsurancesPage = lazy(() => import('./healthinsurances/HealthInsurancesPage'));

// Desktop pages
const DesktopAppPage = lazy(() => import('./desktop/DesktopAppPage'));

// Settings page
const Settings = lazy(() => import('./Settings'));

// Dev page
const DevPage = lazy(() => import('./dev/DevPage'));

// Componente de fallback para lazy loading
const PageLoader = () => (
  <div style={{ 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    height: '100vh',
    flexDirection: 'column',
    gap: '1rem'
  }}>
    <Loader size="large" text="Cargando página..." />
  </div>
);

const AppRouter = () => {
  return (
    <Router>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Rutas públicas */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Ruta raíz protegida que redirige según el rol */}
          <Route
            path="/"
            element={
              <RequireAuth>
                <RoleBasedRedirect />
              </RequireAuth>
            }
          />
          
          {/* Rutas protegidas */}
          <Route element={<RequireAuth />}>
            {/* Dashboard routes */}
            {/* Se necesita una ruta base para /dashboard o asegurar que todas las subrutas de dashboard estén definidas */}
            {/* Si RoleBasedRedirect ya dirige a /dashboard/admin, /dashboard/secretary, etc.,
                quizás /dashboard como ruta genérica no sea necesaria o deba ser un layout.
                Por ahora, se asume que DashboardAdmin puede ser una vista genérica o de admin. */}
            <Route path="/dashboard" element={<DashboardAdmin />} />
            <Route path="/dashboard/admin" element={<DashboardAdmin />} />
            <Route path="/dashboard/secretary" element={<SecretaryDashboard />} />
            <Route path="/dashboard/doctor" element={<DoctorDashboard />} />
            <Route path="/dashboard/payments" element={<PaymentStats />} />
            
            {/* Patient routes */}
            <Route path="/patients" element={<PatientList />} />
            <Route path="/patients/new" element={<PatientForm />} />
            <Route path="/patients/:id" element={<PatientView />} />
            
            {/* Calendar route */}
            <Route path="/calendar" element={<CalendarPage />} />
            
            {/* Health insurance route */}
            <Route path="/health-insurances" element={<HealthInsurancesPage />} />
            
            {/* Desktop route */}
            <Route path="/desktop" element={<DesktopAppPage />} />
            
            {/* Settings route */}
            <Route path="/settings" element={<Settings />} />
            
            {/* Dev route */}
            <Route path="/dev" element={<DevPage />} />
          </Route>
          
          {/* Ruta 404 - redirigir a login */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Suspense>
    </Router>
  );
};

export default AppRouter;

