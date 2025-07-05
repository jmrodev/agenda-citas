import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

/**
 * Componente para proteger rutas privadas.
 * Si no hay token, redirige a /login.
 * Si se pasa el prop 'role' o 'allowedRoles', solo permite el acceso si el rol coincide.
 */
const RequireAuth = ({ children, role, allowedRoles }) => {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('role');
  const location = useLocation();

  if (!token) {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    // No autenticado, redirige a login
    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  // Verificar rol requerido (compatibilidad con role y allowedRoles)
  if (role && userRole !== role) {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    // Autenticado pero sin el rol requerido - redirigir a login para evitar ciclos
    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    // Autenticado pero sin uno de los roles permitidos - redirigir a login para evitar ciclos
    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  // Autenticado y (si aplica) con el rol correcto
  return children;
};

export default RequireAuth; 