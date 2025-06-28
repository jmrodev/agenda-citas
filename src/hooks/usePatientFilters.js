import { useMemo } from 'react';
import { isPacienteActivo } from '../utils/patientUtils';

export const usePatientFilters = (pacientes, searchTerm, filterStatus) => {
  // Filtrar pacientes
  const pacientesFiltrados = useMemo(() => {
    let filtrados = pacientes;
    
    // Filtro por búsqueda
    if (searchTerm) {
      filtrados = filtrados.filter(paciente =>
        paciente.nombre.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Filtro por estado
    const hoy = new Date();
    
    switch (filterStatus) {
      case 'active':
        filtrados = filtrados.filter(paciente => isPacienteActivo(paciente));
        break;
      case 'inactive':
        filtrados = filtrados.filter(paciente => !isPacienteActivo(paciente));
        break;
      case 'upcoming':
        filtrados = filtrados.filter(paciente => 
          paciente.proximaCita && new Date(paciente.proximaCita) > hoy
        );
        break;
      default:
        break;
    }
    
    return filtrados;
  }, [pacientes, searchTerm, filterStatus]);

  return {
    pacientesFiltrados
  };
}; 