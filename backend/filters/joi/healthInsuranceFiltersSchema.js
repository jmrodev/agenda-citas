const Joi = require('joi');

const healthInsuranceFiltersSchema = Joi.object({
  nombre: Joi.string().max(100),
  codigo: Joi.string().max(50),
  direccion: Joi.string().max(100),
  telefono: Joi.string().max(20),
  estado: Joi.string().max(20),
  limit: Joi.number().integer().min(1).max(100).default(20),
  offset: Joi.number().integer().min(0).default(0),
  order_by: Joi.string().valid('health_insurance_id', 'nombre', 'codigo', 'direccion', 'telefono', 'estado'),
  order_dir: Joi.string().valid('asc', 'desc').insensitive().default('asc'),
});

module.exports = healthInsuranceFiltersSchema; 