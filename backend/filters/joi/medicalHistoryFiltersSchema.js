const Joi = require('joi');

const medicalHistoryFiltersSchema = Joi.object({
  paciente_id: Joi.number().integer().min(1),
  doctor_id: Joi.number().integer().min(1),
  fecha: Joi.string().pattern(/^\d{4}-\d{2}-\d{2}$/),
  fecha_desde: Joi.string().pattern(/^\d{4}-\d{2}-\d{2}$/),
  fecha_hasta: Joi.string().pattern(/^\d{4}-\d{2}-\d{2}$/),
  diagnostico: Joi.string().max(255),
  medicamento: Joi.string().max(100),
  limit: Joi.number().integer().min(1).max(100).default(20),
  offset: Joi.number().integer().min(0).default(0),
  order_by: Joi.string().valid('historial_id', 'paciente_id', 'doctor_id', 'fecha', 'diagnostico'),
  order_dir: Joi.string().valid('asc', 'desc').insensitive().default('asc'),
});

module.exports = medicalHistoryFiltersSchema; 