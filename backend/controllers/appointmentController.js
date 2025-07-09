const appointmentService = require('../services/appointmentService');
const { parseAndValidateDate } = require('../utils/date');

async function getAll(req, res) {
  try {
    const appointments = await appointmentService.listAppointments();
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getAllWithFilters(req, res) {
  try {
    const appointments = await appointmentService.listAppointmentsWithFilters(req.query);
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function create(req, res) {
  try {
    // req.body ya validado por Joi (createAppointmentSchema)
    // Joi valida que 'date' y 'payment_date' sean string YYYY-MM-DD o objeto {day, month, year}
    // La conversión manual de formato de fecha se elimina, asumiendo que el servicio puede manejar estos formatos.
    const appointmentData = req.body;
    console.log('🔍 [AppointmentController] create - Datos recibidos (validados por Joi):', appointmentData);
    
    const appointment = await appointmentService.createAppointment(appointmentData);
    console.log('🔍 [AppointmentController] create - Cita creada:', appointment);
    res.status(201).json(appointment);
  } catch (err) {
    console.error('❌ [AppointmentController] create - Error:', err);
    res.status(500).json({ error: err.message });
  }
}

async function update(req, res) {
  try {
    // req.body ya validado por Joi (updateAppointmentSchema)
    // La conversión manual de formato de fecha se elimina.
    const appointmentData = req.body;
    console.log('🔍 [AppointmentController] update - Datos recibidos (validados por Joi):', appointmentData);

    const appointment = await appointmentService.updateAppointment(req.params.id, appointmentData);
    if (!appointment) { // Si el servicio devuelve null o undefined cuando no se encuentra la cita
        return res.status(404).json({ error: 'Cita no encontrada para actualizar.' });
    }
    res.json(appointment);
  } catch (err) {
    // Manejar errores específicos del servicio si es necesario (ej. cita no encontrada si el servicio lanza error)
    if (err.message.toLowerCase().includes('not found')) {
        return res.status(404).json({ error: 'Cita no encontrada.' });
    }
    console.error('❌ [AppointmentController] update - Error:', err);
    res.status(500).json({ error: err.message });
  }
}

async function remove(req, res) {
  try {
    await appointmentService.deleteAppointment(req.params.id);
    res.json({ message: 'Cita eliminada' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getMyAppointments(req, res) {
  try {
    const patientId = req.user.entity_id;
    const appointments = await appointmentService.getAppointmentsByPatientId(patientId);
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getDashboardStats(req, res) {
  try {
    const stats = await appointmentService.getDashboardStats();
    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener estadísticas de citas' });
  }
}

async function getAppointmentReportSummary(req, res) {
  try {
    const { startDate, endDate, rangeKey } = req.query;
    if (!startDate || !endDate) {
      return res.status(400).json({ error: 'Los parámetros startDate y endDate son requeridos.' });
    }
    // Aquí también se podrían añadir validaciones para el formato de fecha.

    const reportData = await appointmentService.getAppointmentReportData(startDate, endDate, rangeKey);
    res.json(reportData);
  } catch (err) {
    // Considerar un logging más específico o un error más genérico para el cliente.
    console.error('Error en getAppointmentReportSummary:', err); // Loguear el error completo en servidor
    res.status(500).json({ error: 'Error al obtener el resumen del reporte de citas: ' + err.message });
  }
}

async function getAppointmentsByDoctor(req, res) {
  try {
    const { doctorId } = req.params;
    const appointments = await appointmentService.getAppointmentsByDoctor(doctorId);
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function confirmOutOfScheduleAppointment(req, res) {
  try {
    const { id } = req.params;
    const appointment = await appointmentService.confirmOutOfScheduleAppointment(id);
    res.json({ message: 'Cita confirmada exitosamente', appointment });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function rejectOutOfScheduleAppointment(req, res) {
  try {
    const { id } = req.params;
    const appointment = await appointmentService.rejectOutOfScheduleAppointment(id);
    res.json({ message: 'Cita rechazada exitosamente', appointment });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { 
  getAll, 
  getAllWithFilters, 
  create, 
  update, 
  remove, 
  getMyAppointments, 
  getDashboardStats, 
  getAppointmentReportSummary,
  getAppointmentsByDoctor,
  confirmOutOfScheduleAppointment,
  rejectOutOfScheduleAppointment
};