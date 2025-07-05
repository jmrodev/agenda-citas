import React from 'react';
import { Navigate } from 'react-router-dom';
import { getRole } from '../../../auth/session'; // Asumiendo que getRole está en session.js

const RoleBasedRedirect = () => {
  const userRole = getRole();

  switch (userRole) {
    case 'admin':
      return <Navigate to="/dashboard/admin" replace />;
    case 'secretary':
      return <Navigate to="/dashboard/secretary" replace />;
    case 'doctor':
      return <Navigate to="/dashboard/doctor" replace />;
    default:
      // Si el rol no es ninguno de los esperados o no hay rol (aunque RequireAuth debería manejar esto)
      // redirigir a una página de dashboard genérica o de vuelta a login si es más apropiado.
      // Por ahora, un dashboard genérico.
      return <Navigate to="/dashboard" replace />;
  }
};

export default RoleBasedRedirect;
