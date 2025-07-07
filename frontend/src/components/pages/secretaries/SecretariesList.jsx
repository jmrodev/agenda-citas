import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import CardBase from '../../atoms/CardBase/CardBase';
import CardTitle from '../../atoms/CardTitle/CardTitle';
import Button from '../../atoms/Button/Button';
import SearchBar from '../../molecules/SearchBar/SearchBar';
import UserListItem from '../../molecules/UserListItem/UserListItem';
import Alert from '../../atoms/Alert/Alert';
import Spinner from '../../atoms/Spinner/Spinner';
import styles from './SecretariesList.module.css';

const SecretariesList = () => {
  const [secretaries, setSecretaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

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
        <Link to="/desktop/secretaries/new">
          <Button variant="primary">
            Nueva Secretaria
          </Button>
        </Link>
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
                    onClick: () => window.location.href = `/desktop/secretaries/${secretary.secretary_id}`
                  },
                  {
                    label: 'Editar',
                    onClick: () => window.location.href = `/desktop/secretaries/edit/${secretary.secretary_id}`
                  },
                  {
                    label: 'Eliminar',
                    onClick: () => handleDelete(secretary.secretary_id),
                    variant: 'danger'
                  }
                ]}
              />
            ))}
          </div>
        )}
      </CardBase>
    </div>
  );
};

export default SecretariesList; 