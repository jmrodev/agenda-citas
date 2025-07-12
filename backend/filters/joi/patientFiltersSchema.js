const Joi = require('joi');
const {
    CHAR_LIMITS
} = require('./constants');

const patientFiltersSchema = Joi.object({
    dni: Joi.string().alphanum().max(CHAR_LIMITS.DNI),
    nombre: Joi.string().max(CHAR_LIMITS.NAME),
    apellido: Joi.string().max(CHAR_LIMITS.NAME),
    direccion: Joi.string().max(CHAR_LIMITS.ADDRESS),
    telefono: Joi.string().max(CHAR_LIMITS.PHONE),
    limit: Joi.number().integer().min(1).max(100).default(20),
    offset: Joi.number().integer().min(0).default(0),
    order_by: Joi.string().valid('patient_id', 'first_name', 'last_name', 'dni', 'address', 'phone', 'email', 'date_of_birth'),
    order_dir: Joi.string().valid('asc', 'desc').insensitive().default('asc'),
});

module.exports = patientFiltersSchema; 