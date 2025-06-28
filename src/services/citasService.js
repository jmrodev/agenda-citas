// Usar el proxy configurado en package.json
const API_BASE_URL = '/api';

// Función para generar ID único
const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Función para hacer peticiones a la API
const apiRequest = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error en API request a ${endpoint}:`, error);
    throw error;
  }
};

// Función para cargar citas desde la API
export const cargarCitas = async () => {
  try {
    console.log('Cargando citas desde la API...');
    const data = await apiRequest('/citas');
    console.log('Respuesta completa de la API:', data);
    
    // El backend devuelve { citas: [...] } o directamente el array
    if (data && data.citas && Array.isArray(data.citas)) {
      console.log('Citas cargadas desde API (objeto con citas):', data.citas);
      return data.citas;
    } else if (Array.isArray(data)) {
      console.log('Citas cargadas desde API (array directo):', data);
      return data;
    } else {
      console.log('Formato de respuesta inesperado:', data);
      return [];
    }
  } catch (error) {
    console.error('Error al cargar citas desde API, usando localStorage como fallback:', error);
    return cargarCitasDesdeLocalStorage();
  }
};

// Función para guardar citas en la API
export const guardarCitas = async (citas) => {
  try {
    console.log('Guardando citas en la API...');
    const response = await apiRequest('/citas', {
      method: 'POST',
      body: JSON.stringify({ citas })
    });
    
    console.log('Citas guardadas en API:', response);
    
    // También guardar en localStorage como respaldo
    localStorage.setItem('citas', JSON.stringify(citas));
    localStorage.setItem('citas_lastModified', new Date().toLocaleString());
    
    return true;
  } catch (error) {
    console.error('Error al guardar citas en API, usando localStorage:', error);
    // Fallback a localStorage
    try {
      localStorage.setItem('citas', JSON.stringify(citas));
      localStorage.setItem('citas_lastModified', new Date().toLocaleString());
      console.log('Citas guardadas en localStorage como fallback');
      return true;
    } catch (localError) {
      console.error('Error al guardar en localStorage:', localError);
      return false;
    }
  }
};

// Función para agregar una nueva cita
export const agregarCita = async (cita) => {
  try {
    console.log('Agregando cita a la API...');
    const response = await apiRequest('/citas/agregar', {
      method: 'POST',
      body: JSON.stringify({ cita })
    });
    
    console.log('Cita agregada a la API:', response.cita);
    return response.cita;
  } catch (error) {
    console.error('Error al agregar cita a la API, usando método local:', error);
    // Fallback al método local
    const citasExistentes = await cargarCitas();
    
    const nuevaCita = {
      id: generateId(),
      title: cita.nombre,
      start: cita.fecha,
      end: new Date(new Date(cita.fecha).getTime() + 60 * 60 * 1000),
      notes: cita.notas || '',
      createdAt: new Date().toISOString()
    };
    
    const citasActualizadas = [...citasExistentes, nuevaCita];
    await guardarCitas(citasActualizadas);
    
    return nuevaCita;
  }
};

// Función para eliminar una cita
export const eliminarCita = async (citaId) => {
  try {
    console.log('Eliminando cita de la API...');
    await apiRequest(`/citas/${citaId}`, {
      method: 'DELETE'
    });
    
    console.log('Cita eliminada de la API:', citaId);
    return true;
  } catch (error) {
    console.error('Error al eliminar cita de la API, usando método local:', error);
    // Fallback al método local
    const citasExistentes = await cargarCitas();
    const citasFiltradas = citasExistentes.filter(cita => cita.id !== citaId);
    await guardarCitas(citasFiltradas);
    
    return true;
  }
};

// Función para actualizar una cita
export const actualizarCita = async (citaId, datosActualizados) => {
  try {
    console.log('Actualizando cita en la API...');
    const response = await apiRequest(`/citas/${citaId}`, {
      method: 'PUT',
      body: JSON.stringify({ datosActualizados })
    });
    
    console.log('Cita actualizada en la API:', response.cita);
    return true;
  } catch (error) {
    console.error('Error al actualizar cita en la API, usando método local:', error);
    // Fallback al método local
    const citasExistentes = await cargarCitas();
    const citasActualizadas = citasExistentes.map(cita => 
      cita.id === citaId ? { ...cita, ...datosActualizados } : cita
    );
    await guardarCitas(citasActualizadas);
    
    return true;
  }
};

// Función para cargar citas desde localStorage (fallback)
export const cargarCitasDesdeLocalStorage = () => {
  try {
    const citasGuardadas = localStorage.getItem('citas');
    if (citasGuardadas) {
      const citas = JSON.parse(citasGuardadas);
      console.log('Citas cargadas desde localStorage:', citas);
      return citas;
    } else {
      console.log('No hay citas en localStorage, inicializando...');
      return inicializarArchivoJSON();
    }
  } catch (error) {
    console.error('Error al cargar citas desde localStorage:', error);
    return inicializarArchivoJSON();
  }
};

// Función para inicializar el archivo JSON si no existe
const inicializarArchivoJSON = () => {
  console.log('Inicializando con datos de ejemplo...');
  
  const citasIniciales = [
    {
      id: "ejemplo-1",
      title: "Reunión de Equipo",
      start: new Date().toISOString(),
      end: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
      createdAt: new Date().toISOString()
    }
  ];
  
  localStorage.setItem('citas', JSON.stringify(citasIniciales));
  return citasIniciales;
};

// Función para exportar citas a JSON
export const exportarCitasAJSON = async () => {
  try {
    const citas = await cargarCitas();
    const dataStr = JSON.stringify({ citas }, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = 'citas.json';
    link.click();
    
    console.log('Citas exportadas a JSON');
    return true;
  } catch (error) {
    console.error('Error al exportar citas:', error);
    return false;
  }
};

// Función para importar citas desde JSON
export const importarCitasDesdeJSON = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const data = JSON.parse(e.target.result);
        if (data.citas && Array.isArray(data.citas)) {
          await guardarCitas(data.citas);
          console.log('Citas importadas desde JSON:', data.citas);
          resolve(data.citas);
        } else {
          reject(new Error('Formato de archivo inválido'));
        }
      } catch (error) {
        reject(error);
      }
    };
    reader.readAsText(file);
  });
};

// Función para verificar el estado del servidor
export const verificarEstadoServidor = async () => {
  try {
    const response = await apiRequest('/status');
    console.log('Estado del servidor:', response);
    return response;
  } catch (error) {
    console.error('Error al verificar estado del servidor:', error);
    return { status: 'ERROR', message: 'Servidor no disponible' };
  }
};

// Función para limpiar localStorage y recargar desde backend
export const limpiarYRecargarCitas = async () => {
  try {
    console.log('Limpiando localStorage y recargando desde backend...');
    localStorage.removeItem('citas');
    localStorage.removeItem('citas_lastModified');
    
    const citasDelBackend = await cargarCitas();
    if (citasDelBackend && citasDelBackend.length > 0) {
      localStorage.setItem('citas', JSON.stringify(citasDelBackend));
      localStorage.setItem('citas_lastModified', new Date().toLocaleString());
      console.log('Citas recargadas desde backend:', citasDelBackend.length, 'citas');
      return citasDelBackend;
    }
    return [];
  } catch (error) {
    console.error('Error al recargar citas:', error);
    return [];
  }
};

// Obtener una cita por ID desde la API
export const obtenerCitaPorId = async (id) => {
  try {
    const cita = await apiRequest(`/citas/${id}`);
    return cita;
  } catch (error) {
    console.error(`Error al obtener cita por ID (${id}):`, error);
    return null;
  }
}; 