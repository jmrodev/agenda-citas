import { authFetch } from './authFetch';

export async function fetchUserProfile() {
  const res = await authFetch('/api/auth/user/profile');
  if (!res.ok) throw new Error('No se pudo obtener el perfil');
  return await res.json();
}

export async function updateUserProfile(profileData) {
  const res = await authFetch('/api/auth/user/profile', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(profileData)
  });
  if (!res.ok) throw new Error('No se pudo actualizar el perfil');
  return await res.json();
} 