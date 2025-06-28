import { useMemo } from 'react';
import { isPacienteActivo, hasAsistenciaTardia } from '../utils/patientUtils';

export const usePatients = (citas) => {
  // Extraer pacientes únicos de las citas
  const pacientes = useMemo(() => {
    const pacientesMap = new Map();
    
    citas.forEach(cita => {
      const pacienteId = cita.patient || cita.title || 'Paciente sin nombre';
      if (!pacientesMap.has(pacienteId)) {
        pacientesMap.set(pacienteId, {
          id: pacienteId,
          nombre: pacienteId,
          citas: [],
          ultimaVisita: null,
          proximaCita: null,
          totalCitas: 0
        });
      }
      
      const paciente = pacientesMap.get(pacienteId);
      paciente.citas.push(cita);
      paciente.totalCitas++;
      
      const fechaCita = new Date(cita.start);
      if (!paciente.ultimaVisita || fechaCita > new Date(paciente.ultimaVisita)) {
        paciente.ultimaVisita = fechaCita;
      }
      
      if (fechaCita > new Date() && (!paciente.proximaCita || fechaCita < new Date(paciente.proximaCita))) {
        paciente.proximaCita = fechaCita;
      }
    });
    
    return Array.from(pacientesMap.values());
  }, [citas]);

  // Calcular estadísticas
  const estadisticas = useMemo(() => {
    const hoy = new Date();
    
    return {
      total: pacientes.length,
      activos: pacientes.filter(p => isPacienteActivo(p)).length,
      inactivos: pacientes.filter(p => !isPacienteActivo(p)).length,
      conCitasProximas: pacientes.filter(p => p.proximaCita && new Date(p.proximaCita) > hoy).length,
      asistenciaTardia: pacientes.filter(p => hasAsistenciaTardia(p)).length
    };
  }, [pacientes]);

  return {
    pacientes,
    estadisticas
  };
}; 