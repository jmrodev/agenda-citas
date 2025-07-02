import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import './styles/abstracts/_variables.css';
import AppRouter from './components/pages/AppRouter.jsx';

const handleLogout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '/login';
};


function RequireAuth({ children, allowedRoles }) {
  const location = useLocation();
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  if (!token) {
    return <Navigate to='/login' state={{ from: location }} replace />;
  }
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to='/login' replace />;
  }
  return children;
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AppRouter />
    </BrowserRouter>
  </React.StrictMode>
);
