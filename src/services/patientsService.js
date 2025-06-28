// patientsService.js - Servicio para manejar pacientes con backend
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

// Función para cargar pacientes desde el backend
export const cargarPacientesDesdeBackend = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/pacientes`);
    if (!response.ok) {
      throw new Error('Error al cargar pacientes');
    }
    const data = await response.json();
    return data.pacientes || [];
  } catch (error) {
    console.error('Error cargando pacientes desde backend:', error);
    // Fallback a localStorage si el backend falla
    return cargarPacientesDesdeLocalStorage();
  }
};

// Función para guardar pacientes en el backend
export const guardarPacientesEnBackend = async (pacientes) => {
  try {
    const response = await fetch(`${API_BASE_URL}/pacientes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ pacientes }),
    });
    
    if (!response.ok) {
      throw new Error('Error al guardar pacientes');
    }
    
    const result = await response.json();
    console.log('Pacientes guardados en backend:', result);
    return true;
  } catch (error) {
    console.error('Error guardando pacientes en backend:', error);
    // Fallback a localStorage si el backend falla
    return guardarPacientesEnLocalStorage(pacientes);
  }
};

// Función para agregar un paciente al backend
export const agregarPacienteAlBackend = async (pacienteData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/pacientes/agregar`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ paciente: pacienteData }),
    });
    
    if (!response.ok) {
      throw new Error('Error al agregar paciente');
    }
    
    const result = await response.json();
    console.log('Paciente agregado al backend:', result);
    return result.paciente;
  } catch (error) {
    console.error('Error agregando paciente al backend:', error);
    // Fallback a localStorage si el backend falla
    return agregarPaciente(pacienteData);
  }
};

// Función para actualizar un paciente en el backend
export const actualizarPacienteEnBackend = async (id, datosActualizados) => {
  try {
    const response = await fetch(`${API_BASE_URL}/pacientes/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ datosActualizados }),
    });
    
    if (!response.ok) {
      throw new Error('Error al actualizar paciente');
    }
    
    const result = await response.json();
    console.log('Paciente actualizado en backend:', result);
    return result.paciente;
  } catch (error) {
    console.error('Error actualizando paciente en backend:', error);
    // Fallback a localStorage si el backend falla
    return actualizarPaciente(id, datosActualizados);
  }
};

// Función para eliminar un paciente del backend
export const eliminarPacienteDelBackend = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/pacientes/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error('Error al eliminar paciente');
    }
    
    const result = await response.json();
    console.log('Paciente eliminado del backend:', result);
    return true;
  } catch (error) {
    console.error('Error eliminando paciente del backend:', error);
    // Fallback a localStorage si el backend falla
    return eliminarPaciente(id);
  }
};

// Función para buscar pacientes en el backend
export const buscarPacientesEnBackend = async (termino) => {
  try {
    const pacientes = await cargarPacientesDesdeBackend();
    return pacientes.filter(paciente =>
      paciente.name.toLowerCase().includes(termino.toLowerCase()) ||
      paciente.nombre.toLowerCase().includes(termino.toLowerCase()) ||
      paciente.apellido.toLowerCase().includes(termino.toLowerCase())
    );
  } catch (error) {
    console.error('Error buscando pacientes en backend:', error);
    // Fallback a localStorage si el backend falla
    return buscarPacientes(termino);
  }
};

// Funciones de fallback para localStorage (mantener compatibilidad)

// Función para cargar pacientes desde localStorage
export const cargarPacientesDesdeLocalStorage = () => {
  try {
    const savedPatients = localStorage.getItem('patients');
    return savedPatients ? JSON.parse(savedPatients) : [];
  } catch (error) {
    console.error('Error cargando pacientes desde localStorage:', error);
    return [];
  }
};

// Función para guardar pacientes en localStorage
export const guardarPacientesEnLocalStorage = (pacientes) => {
  try {
    localStorage.setItem('patients', JSON.stringify(pacientes));
    console.log('Pacientes guardados en localStorage:', pacientes.length);
    return true;
  } catch (error) {
    console.error('Error guardando pacientes en localStorage:', error);
    return false;
  }
};

// Función para agregar un paciente
export const agregarPaciente = (pacienteData) => {
  try {
    const pacientes = cargarPacientesDesdeLocalStorage();
    const nuevoPaciente = {
      id: Date.now().toString(36) + Math.random().toString(36).substr(2),
      nombre: pacienteData.nombre || '',
      segundoNombre: pacienteData.segundoNombre || '',
      apellido: pacienteData.apellido || '',
      name: pacienteData.name || `${pacienteData.nombre} ${pacienteData.segundoNombre} ${pacienteData.apellido}`.trim(),
      appointments: pacienteData.appointments || [],
      lastVisit: pacienteData.lastVisit || null,
      totalVisits: pacienteData.totalVisits || 0,
      patientInfo: pacienteData.patientInfo || {
        dni: '',
        fechaNacimiento: '',
        telefono: '',
        email: '',
        direccion: '',
        obraSocial: '',
        numeroAfiliado: ''
      }
    };
    
    pacientes.push(nuevoPaciente);
    guardarPacientesEnLocalStorage(pacientes);
    return nuevoPaciente;
  } catch (error) {
    console.error('Error agregando paciente:', error);
    return null;
  }
};

// Función para actualizar un paciente
export const actualizarPaciente = (id, datosActualizados) => {
  try {
    const pacientes = cargarPacientesDesdeLocalStorage();
    const index = pacientes.findIndex(p => p.id === id);
    
    if (index !== -1) {
      pacientes[index] = { ...pacientes[index], ...datosActualizados };
      guardarPacientesEnLocalStorage(pacientes);
      return pacientes[index];
    }
    
    return null;
  } catch (error) {
    console.error('Error actualizando paciente:', error);
    return null;
  }
};

// Función para eliminar un paciente
export const eliminarPaciente = (id) => {
  try {
    const pacientes = cargarPacientesDesdeLocalStorage();
    const pacientesFiltrados = pacientes.filter(p => p.id !== id);
    
    if (pacientesFiltrados.length < pacientes.length) {
      guardarPacientesEnLocalStorage(pacientesFiltrados);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Error eliminando paciente:', error);
    return false;
  }
};

// Función para buscar pacientes
export const buscarPacientes = (termino) => {
  try {
    const pacientes = cargarPacientesDesdeLocalStorage();
    return pacientes.filter(paciente =>
      paciente.name.toLowerCase().includes(termino.toLowerCase()) ||
      paciente.nombre.toLowerCase().includes(termino.toLowerCase()) ||
      paciente.apellido.toLowerCase().includes(termino.toLowerCase())
    );
  } catch (error) {
    console.error('Error buscando pacientes:', error);
    return [];
  }
};

// Función para extraer pacientes únicos de las citas
export const extraerPacientesDeCitas = (citas) => {
  if (!citas || !Array.isArray(citas)) return [];
  
  const patientMap = new Map();
  
  citas.forEach(cita => {
    const patientName = cita.patient || cita.title || 'Paciente sin nombre';
    const patientId = cita.patientId || patientName.toLowerCase().replace(/\s+/g, '-');
    
    if (!patientMap.has(patientId)) {
      // Intentar extraer nombre, segundo nombre y apellido del nombre completo
      const nameParts = patientName.split(' ');
      const nombre = nameParts[0] || '';
      const segundoNombre = nameParts[1] || '';
      const apellido = nameParts.slice(2).join(' ') || '';
      
      patientMap.set(patientId, {
        id: patientId,
        nombre: nombre,
        segundoNombre: segundoNombre,
        apellido: apellido,
        name: patientName,
        appointments: [],
        lastVisit: null,
        totalVisits: 0,
        patientInfo: {
          dni: cita.patientInfo?.dni || '',
          fechaNacimiento: cita.patientInfo?.fechaNacimiento || '',
          telefono: cita.patientInfo?.telefono || '',
          email: cita.patientInfo?.email || '',
          direccion: cita.patientInfo?.direccion || '',
          obraSocial: cita.patientInfo?.obraSocial || '',
          numeroAfiliado: cita.patientInfo?.numeroAfiliado || ''
        }
      });
    }
    
    const patient = patientMap.get(patientId);
    patient.appointments.push(cita);
    patient.totalVisits++;
    
    const appointmentDate = new Date(cita.start);
    if (!patient.lastVisit || appointmentDate > new Date(patient.lastVisit)) {
      patient.lastVisit = cita.start;
    }
  });
  
  return Array.from(patientMap.values());
};

// Obtener estadísticas de pacientes
export const obtenerEstadisticasPacientes = () => {
  try {
    const pacientes = cargarPacientesDesdeLocalStorage();
    const totalPacientes = pacientes.length;
    const totalCitas = pacientes.reduce((total, p) => total + p.totalVisits, 0);
    const promedioCitas = totalPacientes > 0 ? (totalCitas / totalPacientes).toFixed(1) : 0;
    
    // Calcular edad promedio
    const edades = pacientes
      .map(paciente => {
        const fechaNac = paciente.patientInfo?.fechaNacimiento;
        if (!fechaNac) return null;
        const hoy = new Date();
        const fechaNacDate = new Date(fechaNac);
        let edad = hoy.getFullYear() - fechaNacDate.getFullYear();
        const mes = hoy.getMonth() - fechaNacDate.getMonth();
        if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNacDate.getDate())) {
          edad--;
        }
        return edad;
      })
      .filter(edad => edad !== null);
    
    const edadPromedio = edades.length > 0 
      ? Math.round(edades.reduce((sum, edad) => sum + edad, 0) / edades.length)
      : null;
    
    return {
      totalPacientes,
      totalCitas,
      promedioCitas,
      edadPromedio
    };
  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    return {
      totalPacientes: 0,
      totalCitas: 0,
      promedioCitas: 0,
      edadPromedio: null
    };
  }
};

// Limpiar todos los pacientes (para reset)
export const limpiarPacientes = () => {
  try {
    localStorage.removeItem('patients');
    console.log('Pacientes eliminados del localStorage');
    return true;
  } catch (error) {
    console.error('Error al limpiar pacientes:', error);
    return false;
  }
}; 