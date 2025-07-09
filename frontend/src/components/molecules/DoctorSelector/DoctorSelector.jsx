import React, { useState, useEffect } from 'react';
import Select from '../../atoms/Select/Select';
import { doctorService } from '../../../services/doctorService';
import styles from './DoctorSelector.module.css';

const DoctorSelector = ({ 
  selectedDoctorId, 
  onDoctorChange, 
  className = '',
  placeholder = 'Seleccionar doctor...'
}) => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const doctorsData = await doctorService.getAll();
      setDoctors(doctorsData);
    } catch (err) {
      setError('Error al cargar doctores');
      console.error('Error fetching doctors:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDoctorChange = (event) => {
    const doctorId = event.target.value;
    onDoctorChange(doctorId ? parseInt(doctorId) : null);
  };

  if (loading) {
    return (
      <div className={`${styles.container} ${className}`}>
        <div className={styles.loading}>Cargando doctores...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`${styles.container} ${className}`}>
        <div className={styles.error}>{error}</div>
      </div>
    );
  }


  
  return (
    <div className={`${styles.container} ${className}`}>
      <label htmlFor="doctor-select" className={styles.label}>
        Doctor:
      </label>
      <Select
        id="doctor-select"
        value={selectedDoctorId || ''}
        onChange={handleDoctorChange}
        className={styles.select}
        options={[
          { value: '', label: placeholder },
          ...doctors.map((doctor) => ({
            value: doctor.doctor_id,
            label: `Dr. ${doctor.first_name} ${doctor.last_name} - ${doctor.specialty}`
          }))
        ]}
      />
    </div>
  );
};

export default DoctorSelector; 