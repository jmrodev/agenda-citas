import React from 'react';
import { Navigate } from 'react-router-dom';
import { getRole } from '../../../auth';

const RoleBasedRedirect = () => {
  const userRole = getRole();

  // Todos los usuarios van a /app que maneja la lógica específica por rol
  if (userRole && ['admin', 'doctor', 'secretary'].includes(userRole)) {
    return <Navigate to="/app" replace />;
  }
  
  // Si no hay rol válido, ir a login
  return <Navigate to="/login" replace />;
};

export default RoleBasedRedirect;
