import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { createLogger } from '../../../utils/debug.js';

/**
 * Componente para proteger rutas privadas.
 * Si no hay token, redirige a /login.
 * Si se pasa el prop 'role' o 'allowedRoles', solo permite el acceso si el rol coincide.
 */
const RequireAuth = ({ children, role, allowedRoles }) => {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('role');
  const location = useLocation();
  const logger = createLogger('RequireAuth');

  // Debug logs
  logger.log('Debug:', {
    token: token ? 'exists' : 'missing',
    userRole,
    role,
    allowedRoles,
    pathname: location.pathname
  });

  if (!token) {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    logger.log('No token, redirecting to login');
    // No autenticado, redirige a login
    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  // Verificar rol requerido (compatibilidad con role y allowedRoles)
  if (role && userRole !== role) {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    logger.log('Role mismatch, redirecting to login');
    // Autenticado pero sin el rol requerido - redirigir a login para evitar ciclos
    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    logger.log('Allowed roles mismatch, redirecting to login');
    // Autenticado pero sin uno de los roles permitidos - redirigir a login para evitar ciclos
    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  logger.log('Access granted');
  // Autenticado y (si aplica) con el rol correcto
  return children;
};

export default RequireAuth; 