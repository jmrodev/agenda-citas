import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { authFetch } from '../../../auth/authFetch';
import Button from '../../atoms/Button/Button';
import HealthInsuranceForm from '../../molecules/HealthInsuranceForm/HealthInsuranceForm';
import styles from './HealthInsuranceDetails.module.css';

const HealthInsuranceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [insurance, setInsurance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const fetchInsuranceDetails = async () => {
      try {
        setLoading(true);
        const res = await authFetch(`/api/health-insurances/${id}`);
        
        if (!res.ok) {
          throw new Error(`Error ${res.status}: ${res.statusText}`);
        }
        
        const data = await res.json();
        setInsurance(data);
        setError(null);
      } catch (err) {
        setError(err.message || 'Error al cargar los detalles de la obra social');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchInsuranceDetails();
    }
  }, [id]);

  const handleSave = async (data) => {
    try {
      const response = await authFetch(`/api/health-insurances/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error('Error al actualizar la obra social');
      }

      // Recargar los datos
      const updatedResponse = await authFetch(`/api/health-insurances/${id}`);
      if (updatedResponse.ok) {
        const updatedData = await updatedResponse.json();
        setInsurance(updatedData);
      }

      setShowForm(false);
    } catch (err) {
      console.error('Error al guardar:', err);
      alert(`Error al guardar: ${err.message}`);
    }
  };

  if (loading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  if (error) {
    return <div className={styles.error}>Error: {error}</div>;
  }

  if (!insurance) {
    return <div className={styles.container}>Health insurance not found.</div>;
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Detalles de Obra Social</h2>
      <div className={styles.detailsGrid}>
        <div className={styles.detailItem}>
          <strong>Nombre:</strong>
          <p>{insurance.name}</p>
        </div>
        <div className={styles.detailItem}>
          <strong>Email:</strong>
          <p>{insurance.email}</p>
        </div>
        <div className={styles.detailItem}>
          <strong>Teléfono:</strong>
          <p>{insurance.phone}</p>
        </div>
        <div className={styles.detailItem}>
          <strong>Dirección:</strong>
          <p>{insurance.address}</p>
        </div>
      </div>

      {/* Placeholder for future functionality like listing associated patients/doctors */}
      {/*
      <div className={styles.associatedInfo}>
        <h3>Pacientes Asociados</h3>
        <p>Próximamente...</p>
        <h3>Doctores Asociados</h3>
        <p>Próximamente...</p>
      </div>
      */}

      <div className={styles.actions}>
        <Button variant="outline" onClick={() => navigate('/app/health-insurances')}>
          Volver al Listado
        </Button>
        <Button onClick={() => setShowForm(true)}>
          Editar
        </Button>
      </div>

      {showForm && (
        <HealthInsuranceForm
          initialData={insurance || {}}
          onSave={handleSave}
          onCancel={() => setShowForm(false)}
        />
      )}
    </div>
  );
};

export default HealthInsuranceDetails;
