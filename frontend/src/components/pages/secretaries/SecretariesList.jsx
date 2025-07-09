import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import CardBase from '../../atoms/CardBase/CardBase';
import CardTitle from '../../atoms/CardTitle/CardTitle';
import Button from '../../atoms/Button/Button';
import SearchBar from '../../molecules/SearchBar/SearchBar';
import UserListItem from '../../molecules/UserListItem/UserListItem';
import Alert from '../../atoms/Alert/Alert';
import Spinner from '../../atoms/Spinner/Spinner';
import SecretaryFormModal from '../../organisms/SecretaryFormModal/SecretaryFormModal';
import styles from './SecretariesList.module.css';

const SecretariesList = () => {
  const [secretaries, setSecretaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedSecretary, setSelectedSecretary] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

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

  const currentUserRole = getCurrentUserRole();
  const isAdmin = currentUserRole === 'admin';
  const isSecretary = currentUserRole === 'secretary';

  useEffect(() => {
    fetchSecretaries();
  }, []);

  const fetchSecretaries = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3001/api/secretaries', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Error al cargar las secretarias');
      }

      const data = await response.json();
      setSecretaries(data.secretaries || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (secretary) => {
    // Verificar permisos
    if (isSecretary) {
      // Secretaria solo puede editar su propio perfil
      const currentUserId = getCurrentUserId();
      const secretaryUserId = getSecretaryUserId(secretary.secretary_id);
      
      if (currentUserId !== secretaryUserId) {
        setError('Solo puedes editar tu propio perfil');
        return;
      }
    }

    setSelectedSecretary(secretary);
    setIsEditing(true);
    setShowModal(true);
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

  const getSecretaryUserId = async (secretaryId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3001/api/secretaries/${secretaryId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        return data.secretary.user_id;
      }
    } catch (error) {
      console.error('Error obteniendo usuario de secretaria:', error);
    }
    return null;
  };

  const handleModalSubmit = async (payload) => {
    try {
      const token = localStorage.getItem('token');
      const url = isEditing 
        ? `http://localhost:3001/api/secretaries/${selectedSecretary.secretary_id}/with-password`
        : 'http://localhost:3001/api/secretaries';
      
      const method = isEditing ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Error al guardar la secretaria');
      }

      // Recargar la lista
      await fetchSecretaries();
      setShowModal(false);
      setSelectedSecretary(null);
      setIsEditing(false);
    } catch (err) {
      throw err;
    }
  };

  const handleDelete = async (id) => {
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

      // Recargar la lista
      fetchSecretaries();
    } catch (err) {
      setError(err.message);
    }
  };

  const filteredSecretaries = secretaries.filter(secretary =>
    secretary.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    secretary.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    secretary.phone?.includes(searchTerm)
  );

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <Spinner size={32} color="primary" />
        <p>Cargando secretarias...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <CardTitle>Secretarias</CardTitle>
        {isAdmin && (
          <Button 
            variant="primary"
            onClick={() => {
              setSelectedSecretary(null);
              setIsEditing(false);
              setShowModal(true);
            }}
          >
            Nueva Secretaria
          </Button>
        )}
      </div>

      {error && (
        <Alert type="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <SearchBar
        placeholder="Buscar secretarias..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <CardBase className={styles.listContainer}>
        {filteredSecretaries.length === 0 ? (
          <div className={styles.emptyState}>
            <p>No se encontraron secretarias</p>
            {searchTerm && (
              <Button 
                variant="secondary" 
                onClick={() => setSearchTerm('')}
              >
                Limpiar búsqueda
              </Button>
            )}
          </div>
        ) : (
          <div className={styles.list}>
            {filteredSecretaries.map((secretary) => (
              <UserListItem
                key={secretary.secretary_id}
                user={secretary}
                actions={[
                  {
                    label: 'Ver',
                    onClick: () => window.location.href = `/app/secretaries/${secretary.secretary_id}`
                  },
                  {
                    label: 'Editar',
                    onClick: () => handleEdit(secretary),
                    disabled: isSecretary && getCurrentUserId() !== getSecretaryUserId(secretary.secretary_id)
                  },
                  ...(isAdmin ? [{
                    label: 'Eliminar',
                    onClick: () => handleDelete(secretary.secretary_id),
                    variant: 'danger'
                  }] : [])
                ]}
              />
            ))}
          </div>
        )}
      </CardBase>

      {/* Modal de edición/creación */}
      <SecretaryFormModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setSelectedSecretary(null);
          setIsEditing(false);
        }}
        onSubmit={handleModalSubmit}
        secretary={selectedSecretary}
        isEditing={isEditing}
      />
    </div>
  );
};

export default SecretariesList; 