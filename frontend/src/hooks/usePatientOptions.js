import { useMemo } from 'react';

/**
 * Hook ultra-específico para transformar pacientes en opciones
 * @param {Array} patients - Lista de pacientes
 * @returns {Array} - Opciones formateadas para select
 */
export const usePatientOptions = (patients) => {
  return useMemo(() => {
    const options = [
      { value: '', label: 'Seleccionar paciente' },
      ...patients.map(patient => ({
        value: String(patient.patient_id),
        label: `${patient.first_name} ${patient.last_name} - DNI: ${patient.dni}`,
        firstName: patient.first_name,
        lastName: patient.last_name,
        dni: patient.dni
      }))
    ];
    
    console.log('🔍 [usePatientOptions] Opciones generadas:', options);
    return options;
  }, [patients]);
}; 