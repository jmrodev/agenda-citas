// server.js - Servidor backend simple para persistencia JSON
const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;
const CITAS_FILE = path.join(__dirname, 'public', 'citas.json');
const PACIENTES_FILE = path.join(__dirname, 'public', 'pacientes.json');

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Función para leer el archivo de citas
async function leerCitas() {
  try {
    const data = await fs.readFile(CITAS_FILE, 'utf8');
    const parsed = JSON.parse(data);
    // Asegurar que siempre devuelva un objeto con citas
    return Array.isArray(parsed) ? { citas: parsed } : parsed;
  } catch (error) {
    console.log('Archivo de citas no encontrado, creando uno nuevo...');
    const citasIniciales = {
      citas: [
        {
          id: "ejemplo-1",
          title: "Reunión de Equipo",
          start: new Date().toISOString(),
          end: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
          createdAt: new Date().toISOString()
        }
      ]
    };
    await fs.writeFile(CITAS_FILE, JSON.stringify(citasIniciales.citas, null, 2));
    return citasIniciales;
  }
}

// Función para escribir el archivo de citas
async function escribirCitas(citas) {
  try {
    // Asegurar que citas sea un array
    const citasArray = Array.isArray(citas) ? citas : [];
    await fs.writeFile(CITAS_FILE, JSON.stringify(citasArray, null, 2));
    return true;
  } catch (error) {
    console.error('Error al escribir citas:', error);
    return false;
  }
}

// Función para leer el archivo de pacientes
async function leerPacientes() {
  try {
    const data = await fs.readFile(PACIENTES_FILE, 'utf8');
    const parsed = JSON.parse(data);
    // Asegurar que siempre devuelva un objeto con pacientes
    return Array.isArray(parsed) ? { pacientes: parsed } : parsed;
  } catch (error) {
    console.log('Archivo de pacientes no encontrado, creando uno nuevo...');
    const pacientesIniciales = {
      pacientes: []
    };
    await fs.writeFile(PACIENTES_FILE, JSON.stringify(pacientesIniciales, null, 2));
    return pacientesIniciales;
  }
}

// Función para escribir el archivo de pacientes
async function escribirPacientes(pacientes) {
  try {
    // Asegurar que pacientes sea un objeto con array de pacientes
    const pacientesObj = Array.isArray(pacientes) ? { pacientes } : pacientes;
    await fs.writeFile(PACIENTES_FILE, JSON.stringify(pacientesObj, null, 2));
    return true;
  } catch (error) {
    console.error('Error al escribir pacientes:', error);
    return false;
  }
}

// Rutas API

// Métodos HTTP disponibles para /api/citas:
// GET    /api/citas         -> Obtener todas las citas
// GET    /api/citas/:id     -> Obtener una cita específica por ID
// POST   /api/citas         -> Guardar todas las citas (sobrescribe)
// POST   /api/citas/agregar -> Agregar una nueva cita
// PUT    /api/citas/:id     -> Actualizar una cita existente
// DELETE /api/citas/:id     -> Eliminar una cita existente

// GET /api/citas - Obtener todas las citas
app.get('/api/citas', async (req, res) => {
  try {
    const data = await leerCitas();
    res.json(data);
  } catch (error) {
    console.error('Error al leer citas:', error);
    res.status(500).json({ error: 'Error al leer citas' });
  }
});

// GET /api/citas/:id - Obtener una cita específica
app.get('/api/citas/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const data = await leerCitas();
    if (!data.citas) return res.status(404).json({ error: 'No hay citas disponibles' });
    const cita = data.citas.find(c => c.id === id);
    if (!cita) return res.status(404).json({ error: 'Cita no encontrada' });
    res.json(cita);
  } catch (error) {
    res.status(500).json({ error: 'Error al leer cita' });
  }
});

// POST /api/citas - Guardar todas las citas
app.post('/api/citas', async (req, res) => {
  try {
    const { citas } = req.body;
    if (!Array.isArray(citas)) {
      return res.status(400).json({ error: 'Formato inválido: se requiere array de citas' });
    }
    
    const success = await escribirCitas(citas);
    if (success) {
      res.json({ message: 'Citas guardadas exitosamente', count: citas.length });
    } else {
      res.status(500).json({ error: 'Error al guardar citas' });
    }
  } catch (error) {
    console.error('Error al guardar citas:', error);
    res.status(500).json({ error: 'Error al guardar citas' });
  }
});

// POST /api/citas/agregar - Agregar una nueva cita
app.post('/api/citas/agregar', async (req, res) => {
  try {
    const { cita } = req.body;
    const data = await leerCitas();
    const pacientesData = await leerPacientes();
    const doctoresData = JSON.parse(await fs.readFile(path.join(__dirname, 'public', 'doctores.json'), 'utf8'));

    // Validar existencia de pacienteId y doctorId
    const pacienteExiste = pacientesData.pacientes.some(p => p.id === cita.pacienteId);
    const doctorExiste = doctoresData.doctores.some(d => d.id === cita.doctorId);
    if (!pacienteExiste) {
      return res.status(400).json({ error: 'El pacienteId no existe' });
    }
    if (!doctorExiste) {
      return res.status(400).json({ error: 'El doctorId no existe' });
    }

    // Asegurar que data.citas existe
    if (!data.citas) {
      data.citas = [];
    }

    // Generar ID aleatorio de 6 cifras único
    let nuevoId;
    do {
      nuevoId = Math.floor(100000 + Math.random() * 900000).toString();
    } while (data.citas.some(c => c.id === nuevoId));

    // Unificar campo notes
    const notes = cita.notes || cita.notas || '';

    const nuevaCita = {
      id: nuevoId,
      title: cita.nombre,
      start: cita.fecha,
      end: new Date(new Date(cita.fecha).getTime() + 60 * 60 * 1000),
      notes,
      pacienteId: cita.pacienteId,
      doctorId: cita.doctorId,
      createdAt: new Date().toISOString()
    };

    data.citas.push(nuevaCita);
    const success = await escribirCitas(data.citas);

    if (success) {
      res.json({ message: 'Cita agregada exitosamente', cita: nuevaCita });
    } else {
      res.status(500).json({ error: 'Error al guardar cita' });
    }
  } catch (error) {
    console.error('Error al agregar cita:', error);
    res.status(500).json({ error: 'Error al agregar cita' });
  }
});

// PUT /api/citas/:id - Actualizar una cita
app.put('/api/citas/:id', async (req, res) => {
  try {
    const { id } = req.params;
    let { datosActualizados } = req.body;
    const data = await leerCitas();
    const pacientesData = await leerPacientes();
    const doctoresData = JSON.parse(await fs.readFile(path.join(__dirname, 'public', 'doctores.json'), 'utf8'));

    // Validar existencia de pacienteId y doctorId si se actualizan
    if (datosActualizados.pacienteId) {
      const pacienteExiste = pacientesData.pacientes.some(p => p.id === datosActualizados.pacienteId);
      if (!pacienteExiste) {
        return res.status(400).json({ error: 'El pacienteId no existe' });
      }
    }
    if (datosActualizados.doctorId) {
      const doctorExiste = doctoresData.doctores.some(d => d.id === datosActualizados.doctorId);
      if (!doctorExiste) {
        return res.status(400).json({ error: 'El doctorId no existe' });
      }
    }

    // Unificar campo notes
    if (datosActualizados.notas && !datosActualizados.notes) {
      datosActualizados.notes = datosActualizados.notas;
      delete datosActualizados.notas;
    }
    // Si existen ambos, priorizar 'notes'
    if (datosActualizados.notas) {
      delete datosActualizados.notas;
    }

    // Asegurar que data.citas existe
    if (!data.citas) {
      return res.status(404).json({ error: 'No hay citas disponibles' });
    }

    const citaIndex = data.citas.findIndex(c => c.id === id);
    if (citaIndex === -1) {
      return res.status(404).json({ error: 'Cita no encontrada' });
    }

    data.citas[citaIndex] = { ...data.citas[citaIndex], ...datosActualizados };
    const success = await escribirCitas(data.citas);

    if (success) {
      res.json({ message: 'Cita actualizada exitosamente', cita: data.citas[citaIndex] });
    } else {
      res.status(500).json({ error: 'Error al actualizar cita' });
    }
  } catch (error) {
    console.error('Error al actualizar cita:', error);
    res.status(500).json({ error: 'Error al actualizar cita' });
  }
});

// DELETE /api/citas/:id - Eliminar una cita
app.delete('/api/citas/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const data = await leerCitas();
    
    // Asegurar que data.citas existe
    if (!data.citas) {
      return res.status(404).json({ error: 'No hay citas disponibles' });
    }
    
    const citasFiltradas = data.citas.filter(c => c.id !== id);
    
    if (citasFiltradas.length === data.citas.length) {
      return res.status(404).json({ error: 'Cita no encontrada' });
    }
    
    const success = await escribirCitas(citasFiltradas);
    
    if (success) {
      res.json({ message: 'Cita eliminada exitosamente' });
    } else {
      res.status(500).json({ error: 'Error al eliminar cita' });
    }
  } catch (error) {
    console.error('Error al eliminar cita:', error);
    res.status(500).json({ error: 'Error al eliminar cita' });
  }
});

// Rutas API para Pacientes

// GET /api/pacientes - Obtener todos los pacientes
app.get('/api/pacientes', async (req, res) => {
  try {
    const data = await leerPacientes();
    res.json(data);
  } catch (error) {
    console.error('Error al leer pacientes:', error);
    res.status(500).json({ error: 'Error al leer pacientes' });
  }
});

// POST /api/pacientes - Guardar todos los pacientes
app.post('/api/pacientes', async (req, res) => {
  try {
    const { pacientes } = req.body;
    if (!Array.isArray(pacientes)) {
      return res.status(400).json({ error: 'Formato inválido: se requiere array de pacientes' });
    }
    
    const success = await escribirPacientes(pacientes);
    if (success) {
      res.json({ message: 'Pacientes guardados exitosamente', count: pacientes.length });
    } else {
      res.status(500).json({ error: 'Error al guardar pacientes' });
    }
  } catch (error) {
    console.error('Error al guardar pacientes:', error);
    res.status(500).json({ error: 'Error al guardar pacientes' });
  }
});

// POST /api/pacientes/agregar - Agregar un nuevo paciente
app.post('/api/pacientes/agregar', async (req, res) => {
  try {
    const { paciente } = req.body;
    const data = await leerPacientes();

    // Verificar si ya existe un paciente con el mismo DNI
    if (paciente.patientInfo && paciente.patientInfo.dni) {
      const existe = data.pacientes.some(p => p.patientInfo && p.patientInfo.dni === paciente.patientInfo.dni);
      if (existe) {
        return res.status(409).json({ error: 'Ya existe un paciente con ese DNI' });
      }
    }

    // Asegurar que data.pacientes existe
    if (!data.pacientes) {
      data.pacientes = [];
    }

    const nuevoPaciente = {
      id: paciente.id || Date.now().toString(36) + Math.random().toString(36).substr(2),
      nombre: paciente.nombre || '',
      segundoNombre: paciente.segundoNombre || '',
      apellido: paciente.apellido || '',
      name: paciente.name || `${paciente.nombre} ${paciente.segundoNombre} ${paciente.apellido}`.trim(),
      appointments: paciente.appointments || [],
      lastVisit: paciente.lastVisit || null,
      totalVisits: paciente.totalVisits || 0,
      patientInfo: paciente.patientInfo || {
        dni: '',
        fechaNacimiento: '',
        telefono: '',
        email: '',
        direccion: '',
        obraSocial: '',
        numeroAfiliado: ''
      }
    };

    data.pacientes.push(nuevoPaciente);
    const success = await escribirPacientes(data.pacientes);

    if (success) {
      res.json({ message: 'Paciente agregado exitosamente', paciente: nuevoPaciente });
    } else {
      res.status(500).json({ error: 'Error al guardar paciente' });
    }
  } catch (error) {
    console.error('Error al agregar paciente:', error);
    res.status(500).json({ error: 'Error al agregar paciente' });
  }
});

// PUT /api/pacientes/:id - Actualizar un paciente
app.put('/api/pacientes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { datosActualizados } = req.body;
    
    const data = await leerPacientes();
    
    // Asegurar que data.pacientes existe
    if (!data.pacientes) {
      return res.status(404).json({ error: 'No hay pacientes disponibles' });
    }
    
    const pacienteIndex = data.pacientes.findIndex(p => p.id === id);
    
    if (pacienteIndex === -1) {
      return res.status(404).json({ error: 'Paciente no encontrado' });
    }
    
    data.pacientes[pacienteIndex] = { ...data.pacientes[pacienteIndex], ...datosActualizados };
    const success = await escribirPacientes(data.pacientes);
    
    if (success) {
      res.json({ message: 'Paciente actualizado exitosamente', paciente: data.pacientes[pacienteIndex] });
    } else {
      res.status(500).json({ error: 'Error al actualizar paciente' });
    }
  } catch (error) {
    console.error('Error al actualizar paciente:', error);
    res.status(500).json({ error: 'Error al actualizar paciente' });
  }
});

// DELETE /api/pacientes/:id - Eliminar un paciente
app.delete('/api/pacientes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const data = await leerPacientes();
    
    // Asegurar que data.pacientes existe
    if (!data.pacientes) {
      return res.status(404).json({ error: 'No hay pacientes disponibles' });
    }
    
    const pacientesFiltrados = data.pacientes.filter(p => p.id !== id);
    
    if (pacientesFiltrados.length === data.pacientes.length) {
      return res.status(404).json({ error: 'Paciente no encontrado' });
    }
    
    const success = await escribirPacientes(pacientesFiltrados);
    
    if (success) {
      res.json({ message: 'Paciente eliminado exitosamente' });
    } else {
      res.status(500).json({ error: 'Error al eliminar paciente' });
    }
  } catch (error) {
    console.error('Error al eliminar paciente:', error);
    res.status(500).json({ error: 'Error al eliminar paciente' });
  }
});

// Buscar paciente por DNI
app.get('/api/pacientes/dni/:dni', async (req, res) => {
  try {
    const { dni } = req.params;
    const data = await leerPacientes();
    if (!data.pacientes) return res.status(404).json({ error: 'No hay pacientes disponibles' });
    const paciente = data.pacientes.find(p => p.patientInfo && p.patientInfo.dni === dni);
    if (!paciente) return res.status(404).json({ error: 'Paciente no encontrado' });
    res.json(paciente);
  } catch (error) {
    res.status(500).json({ error: 'Error al buscar paciente por DNI' });
  }
});

// Rutas para Gestión de Datos

// GET /api/export - Exportar todos los datos
app.get('/api/export', async (req, res) => {
  try {
    const citasData = await leerCitas();
    const pacientesData = await leerPacientes();
    
    const exportData = {
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      citas: citasData.citas || [],
      pacientes: pacientesData.pacientes || [],
      metadata: {
        totalCitas: (citasData.citas || []).length,
        totalPacientes: (pacientesData.pacientes || []).length,
        exportDate: new Date().toISOString()
      }
    };
    
    res.json(exportData);
  } catch (error) {
    console.error('Error exportando datos:', error);
    res.status(500).json({ error: 'Error al exportar datos' });
  }
});

// POST /api/import - Importar datos
app.post('/api/import', async (req, res) => {
  try {
    const { citas, pacientes } = req.body;
    
    // Validar datos
    if (!Array.isArray(citas) || !Array.isArray(pacientes)) {
      return res.status(400).json({ error: 'Formato inválido: se requieren arrays de citas y pacientes' });
    }
    
    // Guardar citas
    const citasSuccess = await escribirCitas(citas);
    if (!citasSuccess) {
      return res.status(500).json({ error: 'Error al guardar citas' });
    }
    
    // Guardar pacientes
    const pacientesSuccess = await escribirPacientes(pacientes);
    if (!pacientesSuccess) {
      return res.status(500).json({ error: 'Error al guardar pacientes' });
    }
    
    res.json({ 
      message: 'Datos importados exitosamente',
      citasCount: citas.length,
      pacientesCount: pacientes.length
    });
  } catch (error) {
    console.error('Error importando datos:', error);
    res.status(500).json({ error: 'Error al importar datos' });
  }
});

// GET /api/status - Estado del servidor
app.get('/api/status', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    message: 'Servidor de citas funcionando correctamente'
  });
});

// --- CRUD para Obras Sociales ---
const OBRAS_SOCIALES_FILE = path.join(__dirname, 'public', 'obras-sociales.json');
async function leerObrasSociales() {
  try {
    const data = await fs.readFile(OBRAS_SOCIALES_FILE, 'utf8');
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) ? { obrasSociales: parsed } : parsed;
  } catch (error) {
    return { obrasSociales: [] };
  }
}
async function escribirObrasSociales(obrasSociales) {
  try {
    const obj = Array.isArray(obrasSociales) ? { obrasSociales } : obrasSociales;
    await fs.writeFile(OBRAS_SOCIALES_FILE, JSON.stringify(obj, null, 2));
    return true;
  } catch (error) {
    return false;
  }
}
// GET todas
app.get('/api/obras-sociales', async (req, res) => {
  const data = await leerObrasSociales();
  res.json(data);
});
// GET una por id
app.get('/api/obras-sociales/:id', async (req, res) => {
  const { id } = req.params;
  const data = await leerObrasSociales();
  const os = (data.obrasSociales || []).find(o => o.id === id);
  if (!os) return res.status(404).json({ error: 'Obra social no encontrada' });
  res.json(os);
});
// POST agregar
app.post('/api/obras-sociales', async (req, res) => {
  const { obraSocial } = req.body;
  const data = await leerObrasSociales();
  const nueva = { ...obraSocial, id: obraSocial.id || Math.floor(100000 + Math.random() * 900000).toString() };
  data.obrasSociales.push(nueva);
  await escribirObrasSociales(data.obrasSociales);
  res.json({ message: 'Obra social agregada', obraSocial: nueva });
});
// PUT actualizar
app.put('/api/obras-sociales/:id', async (req, res) => {
  const { id } = req.params;
  const { datosActualizados } = req.body;
  const data = await leerObrasSociales();
  const idx = data.obrasSociales.findIndex(o => o.id === id);
  if (idx === -1) return res.status(404).json({ error: 'Obra social no encontrada' });
  data.obrasSociales[idx] = { ...data.obrasSociales[idx], ...datosActualizados };
  await escribirObrasSociales(data.obrasSociales);
  res.json({ message: 'Obra social actualizada', obraSocial: data.obrasSociales[idx] });
});
// DELETE eliminar
app.delete('/api/obras-sociales/:id', async (req, res) => {
  const { id } = req.params;
  const data = await leerObrasSociales();
  const filtradas = data.obrasSociales.filter(o => o.id !== id);
  if (filtradas.length === data.obrasSociales.length) return res.status(404).json({ error: 'Obra social no encontrada' });
  await escribirObrasSociales(filtradas);
  res.json({ message: 'Obra social eliminada' });
});

// --- CRUD para Doctores ---
const DOCTORES_FILE = path.join(__dirname, 'public', 'doctores.json');
async function leerDoctores() {
  try {
    const data = await fs.readFile(DOCTORES_FILE, 'utf8');
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) ? { doctores: parsed } : parsed;
  } catch (error) {
    return { doctores: [] };
  }
}
async function escribirDoctores(doctores) {
  try {
    const obj = Array.isArray(doctores) ? { doctores } : doctores;
    await fs.writeFile(DOCTORES_FILE, JSON.stringify(obj, null, 2));
    return true;
  } catch (error) {
    return false;
  }
}
// GET todos
app.get('/api/doctores', async (req, res) => {
  const data = await leerDoctores();
  res.json(data);
});
// GET uno por id
app.get('/api/doctores/:id', async (req, res) => {
  const { id } = req.params;
  const data = await leerDoctores();
  const doc = (data.doctores || []).find(d => d.id === id);
  if (!doc) return res.status(404).json({ error: 'Doctor no encontrado' });
  res.json(doc);
});
// POST agregar
app.post('/api/doctores', async (req, res) => {
  const { doctor } = req.body;
  const data = await leerDoctores();
  const nuevo = { ...doctor, id: doctor.id || Math.floor(100000 + Math.random() * 900000).toString() };
  data.doctores.push(nuevo);
  await escribirDoctores(data.doctores);
  res.json({ message: 'Doctor agregado', doctor: nuevo });
});
// PUT actualizar
app.put('/api/doctores/:id', async (req, res) => {
  const { id } = req.params;
  const { datosActualizados } = req.body;
  const data = await leerDoctores();
  const idx = data.doctores.findIndex(d => d.id === id);
  if (idx === -1) return res.status(404).json({ error: 'Doctor no encontrado' });
  data.doctores[idx] = { ...data.doctores[idx], ...datosActualizados };
  await escribirDoctores(data.doctores);
  res.json({ message: 'Doctor actualizado', doctor: data.doctores[idx] });
});
// DELETE eliminar
app.delete('/api/doctores/:id', async (req, res) => {
  const { id } = req.params;
  const data = await leerDoctores();
  const filtrados = data.doctores.filter(d => d.id !== id);
  if (filtrados.length === data.doctores.length) return res.status(404).json({ error: 'Doctor no encontrado' });
  await escribirDoctores(filtrados);
  res.json({ message: 'Doctor eliminado' });
});

// --- GET paciente por ID ---
app.get('/api/pacientes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const data = await leerPacientes();
    if (!data.pacientes) return res.status(404).json({ error: 'No hay pacientes disponibles' });
    const paciente = data.pacientes.find(p => p.id === id);
    if (!paciente) return res.status(404).json({ error: 'Paciente no encontrado' });
    res.json(paciente);
  } catch (error) {
    res.status(500).json({ error: 'Error al leer paciente' });
  }
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor de citas ejecutándose en http://localhost:${PORT}`);
  console.log(`📁 Archivo de citas: ${CITAS_FILE}`);
  console.log(`📁 Archivo de pacientes: ${PACIENTES_FILE}`);
  console.log(`📊 API de citas: http://localhost:${PORT}/api/citas`);
  console.log(`👥 API de pacientes: http://localhost:${PORT}/api/pacientes`);
}); 