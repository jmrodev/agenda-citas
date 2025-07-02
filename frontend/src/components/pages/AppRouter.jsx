import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './auth/Login';
import Register from './auth/Register';
import Dashboard from './dashboard/Dashboard';
import DoctorDashboard from './dashboard/DoctorDashboard';
import SecretaryDashboard from './dashboard/SecretaryDashboard';
import RequireAuth from './auth/RequireAuth';

export default function AppRouter() {
    return (
        <>
            <Routes>
                <Route path='/login' element={<Login />} />
                <Route path='/register' element={<Register />} />
                <Route path='/' element={
                    <RequireAuth role='admin'>
                        <Dashboard />
                    </RequireAuth>
                } />
                <Route path='/doctor' element={
                    <RequireAuth role='doctor'>
                        <DoctorDashboard />
                    </RequireAuth>
                } />
                <Route path='/secretary' element={
                    <RequireAuth role='secretary'>
                        <SecretaryDashboard />
                    </RequireAuth>
                } />
                <Route path='*' element={<Navigate to='/login' />} />
            </Routes>
        </>
    );
}

