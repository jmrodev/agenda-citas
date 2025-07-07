import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import CardBase from '../../atoms/CardBase/CardBase';
import CardTitle from '../../atoms/CardTitle/CardTitle';
import Button from '../../atoms/Button/Button';
import InfoRow from '../../molecules/InfoRow/InfoRow';
import Alert from '../../atoms/Alert/Alert';
import Spinner from '../../atoms/Spinner/Spinner';
import styles from './SecretaryView.module.css';

const SecretaryView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [secretary, setSecretary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSecretary();
  }, [id]);

  const fetchSecretary = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3001/api/secretaries/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Error al cargar la secretaria');
      }

      const data = await response.json();
      setSecretary(data.secretary);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar esta secretaria?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3001/api/secretaries/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Error al eliminar la secretaria');
      }

      navigate('/desktop/secretaries');
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <Spinner size={32} color="primary" />
        <p>Cargando secretaria...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <Alert type="error" onClose={() => setError(null)}>
          {error}
        </Alert>
        <Button
          variant="secondary"
          onClick={() => navigate('/desktop/secretaries')}
        >
          Volver a la lista
        </Button>
      </div>
    );
  }

  if (!secretary) {
    return (
      <div className={styles.container}>
        <Alert type="error">
          No se encontró la secretaria
        </Alert>
        <Button
          variant="secondary"
          onClick={() => navigate('/desktop/secretaries')}
        >
          Volver a la lista
        </Button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <CardTitle>Detalles de la Secretaria</CardTitle>
        <div className={styles.actions}>
          <Button
            variant="secondary"
            onClick={() => navigate('/desktop/secretaries')}
          >
            Volver
          </Button>
          <Button
            variant="primary"
            onClick={() => navigate(`/desktop/secretaries/edit/${id}`)}
          >
            Editar
          </Button>
          <Button
            variant="danger"
            onClick={handleDelete}
          >
            Eliminar
          </Button>
        </div>
      </div>

      <CardBase className={styles.detailsContainer}>
        <div className={styles.section}>
          <h3>Información Personal</h3>
          <div className={styles.infoGrid}>
            <InfoRow
              label="Nombre completo"
              value={secretary.name}
            />
            <InfoRow
              label="Email"
              value={secretary.email}
            />
            <InfoRow
              label="Teléfono"
              value={secretary.phone}
            />
          </div>
        </div>

        <div className={styles.section}>
          <h3>Información de Cuenta</h3>
          <div className={styles.infoGrid}>
            <InfoRow
              label="Nombre de usuario"
              value={secretary.username}
            />
            <InfoRow
              label="Rol"
              value="Secretaria"
            />
            <InfoRow
              label="Fecha de creación"
              value={secretary.created_at ? new Date(secretary.created_at).toLocaleDateString('es-ES') : 'N/A'}
            />
            {secretary.updated_at && (
              <InfoRow
                label="Última actualización"
                value={new Date(secretary.updated_at).toLocaleDateString('es-ES')}
              />
            )}
          </div>
        </div>
      </CardBase>
    </div>
  );
};

export default SecretaryView; 