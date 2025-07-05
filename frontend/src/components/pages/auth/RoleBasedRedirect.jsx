import React from 'react';
import { Navigate } from 'react-router-dom';
import { getRole } from '../../../auth';

const RoleBasedRedirect = () => {
  const userRole = getRole();

  // Todos los usuarios van a /desktop que maneja la lógica específica por rol
  if (userRole && ['admin', 'doctor', 'secretary'].includes(userRole)) {
    return <Navigate to="/desktop" replace />;
  }
  
  // Si no hay rol válido, ir a login
  return <Navigate to="/login" replace />;
};

export default RoleBasedRedirect;
