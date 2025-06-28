import { useState, useEffect } from 'react';
import { cargarCitasDesdeLocalStorage, verificarEstadoServidor } from '../services/citasService';

export const useAppData = () => {
  const [citas, setCitas] = useState([]);
  const [serverStatus, setServerStatus] = useState('checking');

  // Función para obtener la próxima cita
  const getProximaCita = () => {
    const ahora = new Date();
    const citasFuturas = citas.filter(cita => new Date(cita.start) > ahora);
    if (citasFuturas.length > 0) {
      return citasFuturas.sort((a, b) => new Date(a.start) - new Date(b.start))[0];
    }
    return null;
  };

  // Función para obtener pacientes con asistencia tardía (simulado)
  const getPacientesAsistenciaTardia = () => {
    return [
      { id: 1, nombre: 'María González', ultimaVisita: '2024-01-15', mesesSinVisitar: 3 },
      { id: 2, nombre: 'Juan Pérez', ultimaVisita: '2024-02-20', mesesSinVisitar: 2 },
      { id: 3, nombre: 'Ana López', ultimaVisita: '2023-12-10', mesesSinVisitar: 4 }
    ];
  };

  const handleDataChange = (nuevasCitas) => {
    const citasConFechas = nuevasCitas.map(cita => ({
      ...cita,
      start: new Date(cita.start),
      end: new Date(cita.end)
    }));
    setCitas(citasConFechas);
  };

  useEffect(() => {
    // Verificar estado del servidor al cargar
    verificarEstadoServidor().then(status => {
      console.log('Estado del servidor:', status);
      setServerStatus(status.status === 'OK' ? 'connected' : 'disconnected');
    });

    // Cargar citas desde localStorage
    try {
      const citasCargadas = cargarCitasDesdeLocalStorage();
      const citasConFechas = citasCargadas.map(cita => ({
        ...cita,
        start: new Date(cita.start),
        end: new Date(cita.end)
      }));
      setCitas(citasConFechas);
    } catch (error) {
      console.error('Error al cargar citas:', error);
      setCitas([]);
    }
  }, []);

  return {
    citas,
    serverStatus,
    getProximaCita,
    getPacientesAsistenciaTardia,
    handleDataChange
  };
}; 