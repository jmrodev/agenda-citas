const Joi = require('joi');

// Esquema para validar los datos de entrada al CREAR una persona de referencia
const createReferencePersonSchema = Joi.object({
  dni: Joi.string().trim().pattern(/^[0-9A-Z]+$/i).min(5).max(20).required().messages({
    'string.pattern.base': 'DNI debe contener solo números y letras.',
    'string.empty': 'DNI no puede estar vacío.',
    'any.required': 'DNI es requerido.'
  }),
  name: Joi.string().trim().min(2).max(100).required().messages({
    'string.empty': 'Nombre no puede estar vacío.',
    'any.required': 'Nombre es requerido.'
  }),
  last_name: Joi.string().trim().min(2).max(100).required().messages({
    'string.empty': 'Apellido no puede estar vacío.',
    'any.required': 'Apellido es requerido.'
  }),
  address: Joi.string().trim().max(255).allow(null, ''),
  phone: Joi.string().trim().pattern(/^[0-9+\-\s()]*$/).max(30).allow(null, '').messages({
    'string.pattern.base': 'Teléfono contiene caracteres inválidos.'
  }),
  relationship: Joi.string().trim().max(50).allow(null, '')
  // patient_id se tomará de la URL en la ruta POST /api/patients/:patientId/references
});

// Esquema para validar los datos de entrada al ACTUALIZAR una persona de referencia
const updateReferencePersonSchema = Joi.object({
  dni: Joi.string().trim().pattern(/^[0-9A-Z]+$/i).min(5).max(20).optional().messages({
    'string.pattern.base': 'DNI debe contener solo números y letras.'
  }),
  name: Joi.string().trim().min(2).max(100).optional(),
  last_name: Joi.string().trim().min(2).max(100).optional(),
  address: Joi.string().trim().max(255).allow(null, '').optional(),
  phone: Joi.string().trim().pattern(/^[0-9+\-\s()]*$/).max(30).allow(null, '').optional().messages({
    'string.pattern.base': 'Teléfono contiene caracteres inválidos.'
  }),
  relationship: Joi.string().trim().max(50).allow(null, '').optional()
}).min(1).messages({ // Asegura que al menos un campo se envíe para la actualización
  'object.min': 'Debe proporcionar al menos un campo para actualizar.'
});

// Esquema para FILTRAR la lista de personas de referencia (Query Params)
// Cambié el nombre a listReferencePersonsSchema y ajusté campos para consistencia.
const listReferencePersonsSchema = Joi.object({
  dni: Joi.string().alphanum().max(20),
  name: Joi.string().max(100), // Ajustado de 'nombre'
  last_name: Joi.string().max(100), // Ajustado de 'apellido'
  phone: Joi.string().max(30), // Ajustado de 'telefono' y longitud
  address: Joi.string().max(255), // Ajustado de 'direccion' y longitud
  relationship: Joi.string().max(50), // Ajustado de 'parentesco'
  patient_id: Joi.number().integer().min(1), // Útil si se lista globalmente
  limit: Joi.number().integer().min(1).max(100).default(20),
  offset: Joi.number().integer().min(0).default(0),
  order_by: Joi.string().valid('reference_id', 'patient_id', 'dni', 'name', 'last_name', 'phone', 'address', 'relationship').default('reference_id'), // Ajustado
  order_dir: Joi.string().valid('asc', 'desc').insensitive().default('asc'),
});

module.exports = {
  createReferencePersonSchema,
  updateReferencePersonSchema,
  listReferencePersonsSchema
};