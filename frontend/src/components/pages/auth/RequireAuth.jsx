import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

/**
 * Componente para proteger rutas privadas.
 * Si no hay token, redirige a /login.
 * Si se pasa el prop 'role', solo permite el acceso si el rol coincide.
 */
const RequireAuth = ({ children, role }) => {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('role');
  const location = useLocation();

  if (!token) {
    // No autenticado, redirige a login
    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  if (role && userRole !== role) {
    // Autenticado pero sin el rol requerido
    return <Navigate to='/' replace />;
  }

  // Autenticado y (si aplica) con el rol correcto
  return children;
};

export default RequireAuth; 