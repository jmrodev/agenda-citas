const Joi = require('joi');

const secretaryActivityFiltersSchema = Joi.object({
  secretary_id: Joi.number().integer().min(1),
  date: Joi.string().pattern(/^\d{4}-\d{2}-\d{2}$/),
  date_from: Joi.string().pattern(/^\d{4}-\d{2}-\d{2}$/),
  date_to: Joi.string().pattern(/^\d{4}-\d{2}-\d{2}$/),
  activity_type: Joi.string().max(50),
  activity_types: Joi.alternatives().try(
    Joi.array().items(Joi.string().max(50)),
    Joi.string()
  ),
  activity_id: Joi.number().integer().min(1),
  detail: Joi.string().max(255),
  time_from: Joi.string().pattern(/^\d{2}:\d{2}:\d{2}$/),
  time_to: Joi.string().pattern(/^\d{2}:\d{2}:\d{2}$/),
  limit: Joi.number().integer().min(1).max(100).default(20),
  offset: Joi.number().integer().min(0).default(0),
  order_by: Joi.string().valid('activity_id', 'secretary_id', 'date', 'time', 'activity_type'),
  order_dir: Joi.string().valid('asc', 'desc').insensitive().default('asc'),
});

module.exports = secretaryActivityFiltersSchema; 