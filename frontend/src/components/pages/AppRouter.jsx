import React from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Login from './auth/Login/Login'; // Updated path
import Register from './auth/Register/Register'; // Updated path
import AdminDashboard from './dashboard/DashboardAdmin'; // Duplicate import, will be removed by linter if not used elsewhere or should be DashboardAdmin
import DoctorDashboard from './dashboard/DoctorDashboard';
import SecretaryDashboard from './dashboard/SecretaryDashboard';
import RequireAuth from './auth/RequireAuth';
import Settings from './Settings';
// import DashboardAdmin from './dashboard/DashboardAdmin'; // This was a duplicate import
import PaymentStats from './dashboard/PaymentStats.jsx';
import PatientsList from './patients/PatientsList.jsx';
import CalendarPage from './calendar/CalendarPage';
import LoadingRedirectPage from './auth/LoadingRedirectPage/LoadingRedirectPage.jsx'; // Updated import path

export default function AppRouter() {
    return (
        <>
            <Routes>
                <Route path='/login' element={<Login />} />
                <Route path='/register' element={<Register />} />
                <Route path='/' element={<LoadingRedirectPage />} /> {/* Use the new component */}
                <Route path='/admin' element={
                    <RequireAuth allowedRoles={['admin']}>
                        <AdminDashboard /> {/* Corrected to AdminDashboard if it was the intended one */}
                    </RequireAuth>
                } />
                <Route path='/doctor' element={
                    <RequireAuth allowedRoles={['doctor']}>
                        <DoctorDashboard />
                    </RequireAuth>
                } />
                <Route path='/secretary' element={
                    <RequireAuth allowedRoles={['secretary']}>
                        <SecretaryDashboard />
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
                <Route path='*' element={<Navigate to='/login' />} />
            </Routes>
        </>
    );
}

