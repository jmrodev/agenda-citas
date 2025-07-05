import React from 'react';
import { useNavigate } from 'react-router-dom';
import Spinner from '../../../atoms/Spinner/Spinner'; // Adjusted path for new location
import styles from './LoadingRedirectPage.module.css';

// Componente que redirige según el rol del usuario
const LoadingRedirectPage = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  React.useEffect(() => {
    if (!token) {
      navigate('/login', { replace: true });
      return;
    }

    try {
      // Decodificar el token para obtener el rol
      const payload = JSON.parse(atob(token.split('.')[1]));
      const userRole = payload.role;

      switch (userRole) {
        case 'admin':
          navigate('/admin', { replace: true });
          break;
        case 'doctor':
          navigate('/doctor', { replace: true });
          break;
        case 'secretary':
          navigate('/secretary', { replace: true });
          break;
        default:
          navigate('/login', { replace: true });
          break;
      }
    } catch (error) {
      // Si hay error al decodificar el token, ir a login
      console.error('Error decoding token:', error);
      localStorage.removeItem('token');
      navigate('/login', { replace: true });
    }
  }, [navigate, token]);

  // Mostrar un loading mientras redirige
  return (
    <div className={styles.loadingContainer}>
      <Spinner size={64} color="primary" />
      <p className={styles.loadingText}>Redirigiendo...</p>
    </div>
  );
};

export default LoadingRedirectPage;
