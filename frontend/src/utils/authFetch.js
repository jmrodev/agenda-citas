export async function authFetch(url, options = {}) {
  const token = localStorage.getItem('token');
  const headers = {
    ...options.headers,
    Authorization: `Bearer ${token}`,
  };

  const response = await fetch(url, { ...options, headers });

  if (response.status === 403) {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    window.location.href = '/login';
    return;
  }

  return response;
} 