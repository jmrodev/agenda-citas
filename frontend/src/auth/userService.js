import { authFetch } from './authFetch';
import { handleAuthResponse } from './authUtils';

export async function fetchUserProfile() {
  const res = await authFetch('/api/auth/user/profile');
  return await handleAuthResponse(res);
}

export async function updateUserProfile(profileData) {
  const res = await authFetch('/api/auth/user/profile', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(profileData)
  });
  return await handleAuthResponse(res);
} 