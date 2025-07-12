const Joi = require('joi');
const {
    positiveIdSchema
} = require('./baseSchemas');
const {
    CHAR_LIMITS,
    NUMERIC_LIMITS
} = require('./constants');

const secretaryActivityFiltersSchema = Joi.object({
  secretary_id: positiveIdSchema,
  date: Joi.string().pattern(/^\d{4}-\d{2}-\d{2}$/),
  date_from: Joi.string().pattern(/^\d{4}-\d{2}-\d{2}$/),
  date_to: Joi.string().pattern(/^\d{4}-\d{2}-\d{2}$/),
  activity_type: Joi.string().max(CHAR_LIMITS.ACTIVITY_TYPE),
  activity_types: Joi.alternatives().try(
    Joi.array().items(Joi.string().max(CHAR_LIMITS.ACTIVITY_TYPE)),
    Joi.string()
  ),
  activity_id: positiveIdSchema,
  detail: Joi.string().max(CHAR_LIMITS.ACTIVITY_DETAIL),
  time_from: Joi.string().pattern(/^\d{2}:\d{2}:\d{2}$/),
  time_to: Joi.string().pattern(/^\d{2}:\d{2}:\d{2}$/),
  limit: Joi.number().integer().min(1).max(NUMERIC_LIMITS.MAX_LIMIT).default(NUMERIC_LIMITS.DEFAULT_LIMIT),
  offset: Joi.number().integer().min(0).default(0),
  order_by: Joi.string().valid('activity_id', 'secretary_id', 'date', 'time', 'activity_type'),
  order_dir: Joi.string().valid('asc', 'desc').insensitive().default('asc'),
});

module.exports = secretaryActivityFiltersSchema; 