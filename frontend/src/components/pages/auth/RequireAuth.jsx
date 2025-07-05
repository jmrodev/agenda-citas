import React from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { getToken, getRole, clearSession, isTokenValid } from '../../../auth/session'; // Importar funciones de sesión

/**
 * Componente para proteger rutas privadas.
 * Si no hay token válido, redirige a /login.
 * Si se pasa el prop 'role' o 'allowedRoles', solo permite el acceso si el rol coincide.
 */
const RequireAuth = ({ children, role, allowedRoles }) => {
  const token = getToken();
  const userRole = getRole();
  const location = useLocation();

  if (!token || !isTokenValid(token)) {
    clearSession(); // Limpiar token y rol si no hay token o no es válido
    // No autenticado o token inválido, redirige a login
    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  // Verificar rol requerido (compatibilidad con role y allowedRoles)
  // Esto solo se aplica si se especifican 'role' o 'allowedRoles' en el componente <RequireAuth>
  const specificRoleCheckRequired = role || allowedRoles;
  const roleMatch = role && userRole === role;
  const allowedRolesMatch = allowedRoles && allowedRoles.includes(userRole);

  if (specificRoleCheckRequired && !(roleMatch || allowedRolesMatch)) {
    clearSession(); // Limpiar token y rol si el rol no es el correcto para la ruta
    // Autenticado pero sin el rol requerido/permitido - redirigir a login
    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  // Autenticado y (si aplica) con el rol correcto
  // Si 'children' se pasa directamente (como en <RequireAuth><SomeComponent /></RequireAuth>), se renderiza 'children'.
  // Si RequireAuth se usa como una ruta de layout (<Route element={<RequireAuth />}><Route ... /></Route>),
  // entonces se debe renderizar <Outlet /> para las rutas anidadas.
  return children ? children : <Outlet />;
};

export default RequireAuth;