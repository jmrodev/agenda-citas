import moment from 'moment';

// Formatear fecha para mostrar
export const formatDate = (date) => {
  if (!date) return 'Nunca';
  return moment(date).format('DD/MM/YYYY');
};

// Obtener color de estado del paciente
export const getStatusColor = (paciente) => {
  if (!paciente.ultimaVisita) return '#ff9800'; // Naranja - Sin visitas
  
  const diasSinVisitar = Math.floor((new Date() - new Date(paciente.ultimaVisita)) / (1000 * 60 * 60 * 24));
  
  if (diasSinVisitar <= 30) return '#4caf50'; // Verde - Activo
  if (diasSinVisitar <= 60) return '#ff9800'; // Naranja - Advertencia
  return '#f44336'; // Rojo - Inactivo
};

// Calcular días sin visitar
export const getDiasSinVisitar = (ultimaVisita) => {
  if (!ultimaVisita) return null;
  return Math.floor((new Date() - new Date(ultimaVisita)) / (1000 * 60 * 60 * 24));
};

// Verificar si paciente está activo
export const isPacienteActivo = (paciente) => {
  const diasSinVisitar = getDiasSinVisitar(paciente.ultimaVisita);
  return diasSinVisitar !== null && diasSinVisitar <= 30;
};

// Verificar si paciente tiene asistencia tardía
export const hasAsistenciaTardia = (paciente) => {
  const diasSinVisitar = getDiasSinVisitar(paciente.ultimaVisita);
  return diasSinVisitar !== null && diasSinVisitar > 30;
};

// Obtener texto de estado
export const getStatusText = (paciente) => {
  if (!paciente.ultimaVisita) return 'Sin visitas';
  
  const diasSinVisitar = getDiasSinVisitar(paciente.ultimaVisita);
  
  if (diasSinVisitar <= 30) return 'Activo';
  if (diasSinVisitar <= 60) return 'Advertencia';
  return 'Inactivo';
}; 