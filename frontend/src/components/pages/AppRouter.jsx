import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import RequireAuth from './auth/RequireAuth';
import RoleBasedRedirect from './auth/RoleBasedRedirect';
import Loader from '../atoms/Loader/Loader';

// Lazy loading de todas las páginas
const Login = lazy(() => import('./auth/Login'));
const Register = lazy(() => import('./auth/Register'));

// Patient pages
const PatientList = lazy(() => import('./patients/PatientsList'));
const PatientForm = lazy(() => import('./patients/PatientForm'));
const PatientView = lazy(() => import('./patients/PatientView'));

// Calendar pages
const CalendarPage = lazy(() => import('./calendar/CalendarPage'));

// Health insurance pages
const HealthInsurancesPage = lazy(() => import('./healthinsurances/HealthInsurancesPage'));
const HealthInsuranceDetails = lazy(() => import('./healthinsurances/HealthInsuranceDetails')); // Added import for details page

// App pages
const AppPage = lazy(() => import('./app/AppPage'));

// Doctor pages
const DoctorsList = lazy(() => import('./doctors/DoctorsList'));
const DoctorForm = lazy(() => import('./doctors/DoctorForm'));

// Secretary pages
const SecretariesList = lazy(() => import('./secretaries/SecretariesList'));
const SecretaryForm = lazy(() => import('./secretaries/SecretaryForm'));
const SecretaryView = lazy(() => import('./secretaries/SecretaryView'));

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
            {/* App route - Página principal para todos los usuarios */}
            <Route path="/app" element={<AppPage />}>
              {/* Rutas anidadas dentro de app - deben ser relativas */}
              <Route path="patients" element={<PatientList />} />
              <Route path="patients/new" element={<PatientForm />} />
              <Route path="patients/:id" element={<PatientView />} />
              <Route path="patients/edit/:id" element={<PatientForm />} />
              <Route path="calendar" element={<CalendarPage />} />
              <Route path="health-insurances" element={<HealthInsurancesPage />} />
              <Route path="health-insurances/:id" element={<HealthInsuranceDetails />} /> {/* Added route for details page */}
              <Route path="doctors" element={<DoctorsList />} />
              <Route path="doctors/new" element={<DoctorForm />} />
              <Route path="doctors/edit/:id" element={<DoctorForm />} />
              <Route path="secretaries" element={<SecretariesList />} />
              <Route path="secretaries/new" element={<SecretaryForm />} />
              <Route path="secretaries/:id" element={<SecretaryView />} />
              <Route path="secretaries/edit/:id" element={<SecretaryForm />} />
              <Route path="settings" element={<Settings />} />
            </Route>
            
            {/* Rutas legacy - redirigir a app */}
            <Route path="/dashboard/*" element={<Navigate to="/app" replace />} />
            <Route path="/patients" element={<Navigate to="/app/patients" replace />} />
            <Route path="/patients/new" element={<Navigate to="/app/patients/new" replace />} />
            <Route path="/patients/:id" element={<Navigate to="/app/patients/:id" replace />} />
            <Route path="/calendar" element={<Navigate to="/app/calendar" replace />} />
            <Route path="/health-insurances" element={<Navigate to="/app/health-insurances" replace />} />
            <Route path="/health-insurances/:id" element={<Navigate to="/app/health-insurances/:id" replace />} /> {/* Added legacy route redirect */}
            <Route path="/settings" element={<Navigate to="/app/settings" replace />} />
            
            {/* Dev route */}
            <Route path="/dev" element={<DevPage />} />
          </Route>
        </Routes>
      </Suspense>
    </Router>
  );
};

export default AppRouter;

