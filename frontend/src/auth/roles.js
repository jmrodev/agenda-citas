export const ROLES = {
  ADMIN: 'admin',
  DOCTOR: 'doctor',
  SECRETARY: 'secretary'
};

export function isAllowedRole(userRole, allowedRoles) {
  return allowedRoles.includes(userRole);
} 