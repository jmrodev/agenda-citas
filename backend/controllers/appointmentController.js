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
    console.log('🔍 [AppointmentController] create - Datos recibidos:', req.body);
    let data = { ...req.body };
    
    // Procesar fecha
    if (data.date) {
      if (typeof data.date === 'string') {
        // Si es un string ISO, convertirlo a objeto
        const dateObj = new Date(data.date);
        if (isNaN(dateObj.getTime())) {
          return res.status(400).json({ error: 'Formato de fecha inválido' });
        }
        data.date = {
          day: dateObj.getDate(),
          month: dateObj.getMonth() + 1,
          year: dateObj.getFullYear()
        };
      }
      
      if (typeof data.date === 'object') {
        try {
          data.date = parseAndValidateDate(data.date, 'date', true);
        } catch (err) {
          return res.status(400).json({ error: err.message });
        }
      }
    }
    
    // Procesar payment_date
    if (data.payment_date) {
      if (typeof data.payment_date === 'string') {
        // Si es un string ISO, convertirlo a objeto
        const dateObj = new Date(data.payment_date);
        if (isNaN(dateObj.getTime())) {
          return res.status(400).json({ error: 'Formato de payment_date inválido' });
        }
        data.payment_date = {
          day: dateObj.getDate(),
          month: dateObj.getMonth() + 1,
          year: dateObj.getFullYear()
        };
      }
      
      if (typeof data.payment_date === 'object') {
        try {
          data.payment_date = parseAndValidateDate(data.payment_date, 'payment_date', true);
        } catch (err) {
          return res.status(400).json({ error: err.message });
        }
      }
    }
    
    console.log('🔍 [AppointmentController] create - Datos procesados:', data);
    const appointment = await appointmentService.createAppointment(data);
    console.log('🔍 [AppointmentController] create - Cita creada:', appointment);
    res.status(201).json(appointment);
  } catch (err) {
    console.error('❌ [AppointmentController] create - Error:', err);
    res.status(500).json({ error: err.message });
  }
}

async function update(req, res) {
  try {
    let data = { ...req.body };
    
    // Procesar fecha
    if (data.date) {
      if (typeof data.date === 'string') {
        // Si es un string ISO, convertirlo a objeto
        const dateObj = new Date(data.date);
        if (isNaN(dateObj.getTime())) {
          return res.status(400).json({ error: 'Formato de fecha inválido' });
        }
        data.date = {
          day: dateObj.getDate(),
          month: dateObj.getMonth() + 1,
          year: dateObj.getFullYear()
        };
      }
      
      if (typeof data.date === 'object') {
        try {
          data.date = parseAndValidateDate(data.date, 'date', true);
        } catch (err) {
          return res.status(400).json({ error: err.message });
        }
      }
    }
    
    // Procesar payment_date
    if (data.payment_date) {
      if (typeof data.payment_date === 'string') {
        // Si es un string ISO, convertirlo a objeto
        const dateObj = new Date(data.payment_date);
        if (isNaN(dateObj.getTime())) {
          return res.status(400).json({ error: 'Formato de payment_date inválido' });
        }
        data.payment_date = {
          day: dateObj.getDate(),
          month: dateObj.getMonth() + 1,
          year: dateObj.getFullYear()
        };
      }
      
      if (typeof data.payment_date === 'object') {
        try {
          data.payment_date = parseAndValidateDate(data.payment_date, 'payment_date', true);
        } catch (err) {
          return res.status(400).json({ error: err.message });
        }
      }
    }
    
    const appointment = await appointmentService.updateAppointment(req.params.id, data);
    res.json(appointment);
  } catch (err) {
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