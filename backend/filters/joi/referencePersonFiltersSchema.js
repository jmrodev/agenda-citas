const Joi = require('joi');
const {
    dniSchema,
    optionalDniSchema,
    nameSchema,
    optionalNameSchema,
    addressSchema,
    phoneSchema,
    positiveIdSchema
} = require('./baseSchemas');
const {
    CHAR_LIMITS,
    NUMERIC_LIMITS
} = require('./constants');

// Esquema para validar los datos de entrada al CREAR una persona de referencia
const createReferencePersonSchema = Joi.object({
  dni: dniSchema,
  name: nameSchema,
  last_name: nameSchema,
  address: addressSchema,
  phone: phoneSchema,
  relationship: Joi.string().max(CHAR_LIMITS.RELATIONSHIP).optional().allow(null, '')
  // patient_id se tomará de la URL en la ruta POST /api/patients/:patientId/references
});

// Esquema para validar los datos de entrada al ACTUALIZAR una persona de referencia
const updateReferencePersonSchema = Joi.object({
  dni: optionalDniSchema,
  name: optionalNameSchema,
  last_name: optionalNameSchema,
  address: addressSchema,
  phone: phoneSchema,
  relationship: Joi.string().max(CHAR_LIMITS.RELATIONSHIP).optional().allow(null, '')
}).min(1).messages({ // Asegura que al menos un campo se envíe para la actualización
  'object.min': 'Debe proporcionar al menos un campo para actualizar.'
});

// Esquema para FILTRAR la lista de personas de referencia (Query Params)
const listReferencePersonsSchema = Joi.object({
  dni: Joi.string().alphanum().max(CHAR_LIMITS.DNI),
  name: Joi.string().max(CHAR_LIMITS.NAME),
  last_name: Joi.string().max(CHAR_LIMITS.NAME),
  phone: Joi.string().max(CHAR_LIMITS.PHONE),
  address: Joi.string().max(CHAR_LIMITS.ADDRESS),
  relationship: Joi.string().max(CHAR_LIMITS.RELATIONSHIP),
  patient_id: positiveIdSchema,
  limit: Joi.number().integer().min(1).max(NUMERIC_LIMITS.MAX_LIMIT).default(NUMERIC_LIMITS.DEFAULT_LIMIT),
  offset: Joi.number().integer().min(0).default(0),
  order_by: Joi.string().valid('reference_id', 'patient_id', 'dni', 'name', 'last_name', 'phone', 'address', 'relationship').default('reference_id'),
  order_dir: Joi.string().valid('asc', 'desc').insensitive().default('asc'),
});

module.exports = {
  createReferencePersonSchema,
  updateReferencePersonSchema,
  listReferencePersonsSchema
};