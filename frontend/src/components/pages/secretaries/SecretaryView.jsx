import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import CardBase from '../../atoms/CardBase/CardBase';
import Title from '../../atoms/Title/Title';
import Button from '../../atoms/Button/Button';
import InfoRow from '../../molecules/InfoRow/InfoRow';
import Alert from '../../atoms/Alert/Alert';
import Spinner from '../../atoms/Spinner/Spinner';
import SecretaryFormModal from '../../organisms/SecretaryFormModal/SecretaryFormModal';
import styles from './SecretaryView.module.css';

const SecretaryView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [secretary, setSecretary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Obtener el rol del usuario actual
  const getCurrentUserRole = () => {
    const token = localStorage.getItem('token');
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.role;
    } catch {
      return null;
    }
  };

  const getCurrentUserId = () => {
    const token = localStorage.getItem('token');
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.user_id;
    } catch {
      return null;
    }
  };

  const currentUserRole = getCurrentUserRole();
  const isAdmin = currentUserRole === 'admin';
  const isSecretary = currentUserRole === 'secretary';
  const canEdit = isAdmin || (isSecretary && secretary?.user_id === getCurrentUserId());

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

  const handleEdit = () => {
    if (!canEdit) {
      setError('No tienes permisos para editar esta secretaria');
      return;
    }
    setShowModal(true);
  };

  const handleModalSubmit = async (payload) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3001/api/secretaries/${id}/with-password`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Error al actualizar la secretaria');
      }

      // Recargar los datos
      await fetchSecretary();
      setShowModal(false);
    } catch (err) {
      throw err;
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

      navigate('/app/secretaries');
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
          onClick={() => navigate('/app/secretaries')}
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
          onClick={() => navigate('/app/secretaries')}
        >
          Volver a la lista
        </Button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Title as="h2">Secretaria</Title>
        <div className={styles.actions}>
          <Button
            variant="secondary"
            onClick={() => navigate('/app/secretaries')}
          >
            Volver
          </Button>
          {canEdit && (
            <Button
              variant="primary"
              onClick={handleEdit}
            >
              Editar
            </Button>
          )}
          {isAdmin && (
            <Button
              variant="danger"
              onClick={handleDelete}
            >
              Eliminar
            </Button>
          )}
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
            {secretary.shift && (
              <InfoRow
                label="Turno"
                value={secretary.shift}
              />
            )}
            {secretary.entry_time && (
              <InfoRow
                label="Hora de entrada"
                value={secretary.entry_time}
              />
            )}
            {secretary.exit_time && (
              <InfoRow
                label="Hora de salida"
                value={secretary.exit_time}
              />
            )}
          </div>
        </div>

        <div className={styles.section}>
          <h3>Información de Cuenta</h3>
          <div className={styles.infoGrid}>
            <InfoRow
              label="Nombre de usuario"
              value={secretary.username || 'N/A'}
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

      {/* Modal de edición */}
      <SecretaryFormModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleModalSubmit}
        secretary={secretary}
        isEditing={true}
      />
    </div>
  );
};

export default SecretaryView; 