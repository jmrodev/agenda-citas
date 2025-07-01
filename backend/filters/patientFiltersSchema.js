const Joi = require('joi');

const patientFiltersSchema = Joi.object({
  dni: Joi.string().alphanum().max(20),
  nombre: Joi.string().max(50),
  apellido: Joi.string().max(50),
  direccion: Joi.string().max(100),
  telefono: Joi.string().max(20),
  limit: Joi.number().integer().min(1).max(100).default(20),
  offset: Joi.number().integer().min(0).default(0),
  order_by: Joi.string().valid('patient_id', 'first_name', 'last_name', 'dni', 'address', 'phone', 'email', 'date_of_birth'),
  order_dir: Joi.string().valid('asc', 'desc').insensitive().default('asc'),
});

module.exports = patientFiltersSchema; 