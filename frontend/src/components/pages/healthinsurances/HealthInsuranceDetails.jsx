import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { healthInsuranceService } from '../../../services/healthInsuranceService';
import Button from '../../atoms/Button/Button';
import styles from './HealthInsuranceDetails.module.css'; // We'll create this file next

const HealthInsuranceDetails = () => {
  const { id } = useParams();
  const [insurance, setInsurance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInsuranceDetails = async () => {
      try {
        setLoading(true);
        const data = await healthInsuranceService.getById(id);
        setInsurance(data);
        setError(null);
      } catch (err) {
        setError(err.message || 'Error fetching health insurance details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchInsuranceDetails();
    }
  }, [id]);

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
        <Link to="/health-insurances">
          <Button variant="outline">Volver al Listado</Button>
        </Link>
        {/* TODO: Add Edit button that potentially opens the HealthInsuranceForm modal or navigates to an edit page */}
        {/* <Link to={`/health-insurances/edit/${insurance.insurance_id}`}>
          <Button>Editar</Button>
        </Link> */}
      </div>
    </div>
  );
};

export default HealthInsuranceDetails;
