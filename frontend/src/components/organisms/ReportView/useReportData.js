import { useState, useCallback } from 'react';
import { authFetch } from '../../../auth/authFetch';

// Endpoints de la API para cada sección de reportes
const API_ENDPOINTS = {
  patients: '/api/patients/reports/summary',
  appointments: '/api/appointments/reports/summary',
  payments: '/api/facility-payments/reports/summary',
  secretaryActivity: '/api/secretary-activities/reports/summary',
  medicalHistory: '/api/medical-history/reports/summary',
};

/**
 * Hook personalizado para manejar el estado y fetching de los reportes.
 * Devuelve el rango de fechas actual, el setter, el estado de los reportes y la función para fetch de cada sección.
 */
export function useReportData() {
  const [currentDateRange, setCurrentDateRange] = useState(null);
  const [reportData, setReportData] = useState({
    patients: { data: null, loading: true, error: null, available: true },
    appointments: { data: null, loading: true, error: null, available: true },
    payments: { data: null, loading: true, error: null, available: true },
    secretaryActivity: { data: null, loading: true, error: null, available: true },
    medicalHistory: { data: null, loading: true, error: null, available: false },
  });

  // Función para hacer fetch de datos de una sección específica
  const fetchDataForSection = useCallback(async (sectionKey, range, isSectionAvailable) => {
    if (!isSectionAvailable || !range) {
      if (!isSectionAvailable) {
        setReportData(prev => {
          if (prev[sectionKey]?.loading || prev[sectionKey]?.error) {
            return {
              ...prev,
              [sectionKey]: { ...prev[sectionKey], data: prev[sectionKey]?.data, loading: false, error: null }
            };
          }
          return prev;
        });
      }
      return;
    }
    setReportData(prev => ({
      ...prev,
      [sectionKey]: { ...prev[sectionKey], data: prev[sectionKey]?.data, error: null, loading: true }
    }));
    try {
      const queryParams = `?startDate=${range.startDate}&endDate=${range.endDate}&rangeKey=${range.key}`;
      const response = await authFetch(`${API_ENDPOINTS[sectionKey]}${queryParams}`);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Error en la respuesta del servidor' }));
        throw new Error(errorData.message || `Error HTTP ${response.status} al cargar datos de ${sectionKey}`);
      }
      const data = await response.json();
      setReportData(prev => ({
        ...prev,
        [sectionKey]: { ...prev[sectionKey], data, loading: false }
      }));
    } catch (error) {
      console.error(`Error fetching ${sectionKey}:`, error);
      setReportData(prev => ({
        ...prev,
        [sectionKey]: { ...prev[sectionKey], error: error.message, loading: false }
      }));
    }
  }, []);

  return {
    currentDateRange,
    setCurrentDateRange,
    reportData,
    setReportData,
    fetchDataForSection
  };
} 