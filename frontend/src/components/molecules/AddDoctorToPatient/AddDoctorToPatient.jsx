import React, { useState, useEffect } from 'react';
import Button from '../../atoms/Button/Button';
import Select from '../../atoms/Select/Select';
import Alert from '../../atoms/Alert/Alert';
import Spinner from '../../atoms/Spinner/Spinner';
import { authFetch } from '../../../auth/authFetch';
import styles from './AddDoctorToPatient.module.css';

const AddDoctorToPatient = ({ patientId, currentDoctors = [], onDoctorAdded }) => {
  const [availableDoctors, setAvailableDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingDoctors, setLoadingDoctors] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchAvailableDoctors();
  }, [currentDoctors]);

  const fetchAvailableDoctors = async () => {
    setLoadingDoctors(true);
    try {
      const response = await authFetch('/api/doctors');
      if (!response.ok) {
        throw new Error('Error al cargar doctores');
      }
      const allDoctors = await response.json();
      
      // Filtrar doctores que ya están asignados
      const currentDoctorIds = currentDoctors.map(d => d.doctor_id);
      const available = allDoctors.filter(doctor => !currentDoctorIds.includes(doctor.doctor_id));
      
      setAvailableDoctors(available);
      console.log('Doctores disponibles:', available);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingDoctors(false);
    }
  };

  const handleAddDoctor = async () => {
    if (!selectedDoctor) {
      setError('Por favor selecciona un doctor');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await authFetch(`/api/patients/${patientId}/doctors/${selectedDoctor}`, {
        method: 'POST'
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al agregar doctor');
      }

      setSuccess('Doctor agregado correctamente');
      setSelectedDoctor('');
      
      // Notificar al componente padre
      if (onDoctorAdded) {
        onDoctorAdded();
      }

      // Limpiar mensaje de éxito después de 2 segundos
      setTimeout(() => {
        setSuccess('');
      }, 2000);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loadingDoctors) {
    return (
      <div className={styles.container}>
        <h4>Agregar Doctor</h4>
        <div className={styles.loading}>
          <Spinner size={20} />
          <span>Cargando doctores disponibles...</span>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h4>Agregar Doctor</h4>
      
      {error && (
        <Alert type="error" className={styles.error}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert type="success" className={styles.success}>
          {success}
        </Alert>
      )}

      {availableDoctors.length === 0 ? (
        <div className={styles.empty}>
          <p>No hay doctores disponibles para agregar</p>
        </div>
      ) : (
        <div className={styles.form}>
          <div className={styles.selectContainer}>
            <label htmlFor="doctor-select">Seleccionar Doctor:</label>
            <Select
              id="doctor-select"
              value={selectedDoctor}
              onChange={(e) => setSelectedDoctor(e.target.value)}
              disabled={loading}
              options={[
                { value: '', label: '-- Seleccionar doctor --' },
                ...availableDoctors.map(doctor => ({
                  value: doctor.doctor_id.toString(),
                  label: `Dr. ${doctor.first_name} ${doctor.last_name}${doctor.specialty ? ` - ${doctor.specialty}` : ''}`
                }))
              ]}
              // Debug temporal
              onFocus={() => console.log('Select enfocado, opciones:', availableDoctors.length)}
            />
          </div>

          <Button
            onClick={handleAddDoctor}
            disabled={!selectedDoctor || loading}
            loading={loading}
            className={styles.addButton}
          >
            {loading ? 'Agregando...' : 'Agregar Doctor'}
          </Button>
        </div>
      )}
    </div>
  );
};

export default AddDoctorToPatient; 