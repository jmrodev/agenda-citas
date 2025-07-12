const Joi = require('joi');
const { CHAR_LIMITS } = require('./constants');

const medicalHistoryFiltersSchema = Joi.object({
  medicamento: Joi.string().max(CHAR_LIMITS.MEDICATION),
  limit: Joi.number().integer().min(1).max(100).default(20),
  offset: Joi.number().integer().min(0).default(0),
  order_by: Joi.string().valid('medical_history_id', 'patient_id', 'doctor_id', 'date').default('medical_history_id'),
  order_dir: Joi.string().valid('asc', 'desc').insensitive().default('asc'),
});

module.exports = medicalHistoryFiltersSchema; 