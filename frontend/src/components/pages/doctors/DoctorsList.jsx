import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { doctorService } from '../../../services/doctorService';
import DoctorTable from '../../organisms/DoctorTable/DoctorTable';
import Button from '../../atoms/Button/Button';
import Alert from '../../atoms/Alert/Alert';
import Loader from '../../atoms/Loader/Loader';
import styles from './DoctorsList.module.css';

const DoctorsList = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const data = await doctorService.getAll();
      setDoctors(data.doctors || data || []);
    } catch (err) {
      setError('Error al cargar los doctores: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (doctorId) => {
    if (window.confirm('¿Está seguro de que desea eliminar este doctor?')) {
      try {
        await doctorService.delete(doctorId);
        setDoctors(prev => prev.filter(d => d.doctor_id !== doctorId));
      } catch (err) {
        setError('Error al eliminar el doctor: ' + err.message);
      }
    }
  };

  if (loading) {
    return <Loader size="large" text="Cargando doctores..." />;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Gestión de Doctores</h1>
        <Link to="/desktop/doctors/new">
          <Button variant="primary">
            Nuevo Doctor
          </Button>
        </Link>
      </div>

      {error && (
        <Alert type="error" onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <DoctorTable 
        doctors={doctors} 
        onDelete={handleDelete}
        onEdit={(doctorId) => window.location.href = `/desktop/doctors/edit/${doctorId}`}
      />
    </div>
  );
};

export default DoctorsList; 