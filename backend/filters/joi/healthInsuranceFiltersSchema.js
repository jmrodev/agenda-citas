const Joi = require('joi');
const { CHAR_LIMITS } = require('./constants');

const healthInsuranceFiltersSchema = Joi.object({
  estado: Joi.string().max(CHAR_LIMITS.STATUS),
  limit: Joi.number().integer().min(1).max(100).default(20),
  offset: Joi.number().integer().min(0).default(0),
  order_by: Joi.string().valid('health_insurance_id', 'name', 'estado').default('health_insurance_id'),
  order_dir: Joi.string().valid('asc', 'desc').insensitive().default('asc'),
});

module.exports = healthInsuranceFiltersSchema; 