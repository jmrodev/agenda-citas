const Joi = require('joi');
const {
    nameSchema,
    optionalNameSchema,
    requiredEmailSchema,
    emailSchema,
    phoneSchema,
    addressSchema,
    optionalPositiveIdSchema,
    timeSchema,
    createUpdateSchema
} = require('./baseSchemas');
const {
    CHAR_LIMITS,
    MEDICAL_SPECIALTIES
} = require('./constants');

// Esquema base para doctores
const doctorBaseSchema = {
    first_name: nameSchema.messages({
        'string.empty': 'El nombre es requerido.',
        'any.required': 'El nombre es requerido.'
    }),
    last_name: nameSchema.messages({
        'string.empty': 'El apellido es requerido.',
        'any.required': 'El apellido es requerido.'
    }),
    specialty: Joi.string().valid(...MEDICAL_SPECIALTIES).max(CHAR_LIMITS.SPECIALTY).required().messages({
        'string.empty': 'La especialidad es requerida.',
        'any.required': 'La especialidad es requerida.',
        'any.only': 'La especialidad seleccionada no es válida.'
    }),
    email: requiredEmailSchema.messages({
        'string.email': 'Debe ingresar un email válido.',
        'string.empty': 'El email es requerido.',
        'any.required': 'El email es requerido.'
    }),
    phone: phoneSchema,
    license_number: Joi.string().max(CHAR_LIMITS.LICENSE_NUMBER).optional().allow(null, ''),
    office_address: addressSchema,
    office_phone: phoneSchema,
    working_days: Joi.string().max(CHAR_LIMITS.NAME).optional().allow(null, ''),
    working_hours_start: timeSchema.optional().allow(null, ''),
    working_hours_end: timeSchema.optional().allow(null, ''),
    appointment_duration_minutes: Joi.number().integer().min(5).max(120).optional().allow(null)
};

// Esquema para crear doctor
const createDoctorSchema = Joi.object(doctorBaseSchema);

// Esquema para actualizar doctor
const updateDoctorSchema = createUpdateSchema({
    first_name: optionalNameSchema,
    last_name: optionalNameSchema,
    specialty: Joi.string().valid(...MEDICAL_SPECIALTIES).max(CHAR_LIMITS.SPECIALTY).optional().messages({
        'any.only': 'La especialidad seleccionada no es válida.'
    }),
    email: emailSchema,
    phone: phoneSchema,
    license_number: Joi.string().max(CHAR_LIMITS.LICENSE_NUMBER).optional().allow(null, ''),
    office_address: addressSchema,
    office_phone: phoneSchema,
    working_days: Joi.string().max(CHAR_LIMITS.NAME).optional().allow(null, ''),
    working_hours_start: timeSchema.optional().allow(null, ''),
    working_hours_end: timeSchema.optional().allow(null, ''),
    appointment_duration_minutes: Joi.number().integer().min(5).max(120).optional().allow(null)
});

module.exports = {
    createDoctorSchema,
    updateDoctorSchema
};
