import { useState, useEffect } from 'react';
import { authFetch } from '../auth/authFetch';
import { usePatientOptions } from './usePatientOptions';

/**
 * Hook personalizado para manejo de pacientes
 * @returns {Object} - Estado y funciones para manejo de pacientes
 */
export const usePatients = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Hook ultra-específico para opciones
  const patientOptions = usePatientOptions(patients);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await authFetch('/api/patients');
      if (res.ok) {
        const data = await res.json();
        setPatients(data);
      } else {
        throw new Error('Error al cargar pacientes');
      }
    } catch (err) {
      console.error('Error fetching patients:', err);
      setError(err.message || 'Error al cargar pacientes');
    } finally {
      setLoading(false);
    }
  };

  const refreshPatients = () => {
    fetchPatients();
  };

  return {
    patients,
    patientOptions,
    loading,
    error,
    fetchPatients,
    refreshPatients
  };
}; 