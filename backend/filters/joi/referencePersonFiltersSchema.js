const Joi = require('joi');

const referencePersonFiltersSchema = Joi.object({
  paciente_id: Joi.number().integer().min(1),
  dni: Joi.string().alphanum().max(20),
  nombre: Joi.string().max(50),
  apellido: Joi.string().max(50),
  telefono: Joi.string().max(20),
  direccion: Joi.string().max(100),
  parentesco: Joi.string().max(50),
  limit: Joi.number().integer().min(1).max(100).default(20),
  offset: Joi.number().integer().min(0).default(0),
  order_by: Joi.string().valid('reference_id', 'patient_id', 'dni', 'nombre', 'apellido', 'telefono', 'direccion', 'parentesco'),
  order_dir: Joi.string().valid('asc', 'desc').insensitive().default('asc'),
});

module.exports = referencePersonFiltersSchema; 