const Joi = require('joi');
const {
    APPOINTMENT_STATUSES
} = require('./constants');

const appointmentFiltersSchema = Joi.object({
    fecha: Joi.string().pattern(/^\d{4}-\d{2}-\d{2}$/),
    fecha_desde: Joi.string().pattern(/^\d{4}-\d{2}-\d{2}$/),
    fecha_hasta: Joi.string().pattern(/^\d{4}-\d{2}-\d{2}$/),
    paciente_id: Joi.number().integer().min(1),
    doctor_id: Joi.number().integer().min(1),
    obra_social_id: Joi.number().integer().min(1),
    estado: Joi.string().valid(...APPOINTMENT_STATUSES).max(30),
    limit: Joi.number().integer().min(1).max(100).default(20),
    offset: Joi.number().integer().min(0).default(0),
    order_by: Joi.string().valid('appointment_id', 'patient_id', 'doctor_id', 'date', 'time', 'status', 'type'),
    order_dir: Joi.string().valid('asc', 'desc').insensitive().default('asc'),
});

module.exports = appointmentFiltersSchema; 