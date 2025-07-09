const Joi = require('joi');

// Helper para validar fecha que puede ser string YYYY-MM-DD o objeto {day, month, year}
const dateOrDateObjectOptionalSchema = Joi.alternatives().try(
    Joi.string().isoDate().messages({ // Acepta 'YYYY-MM-DD'
        'string.isoDate': 'El formato de fecha debe ser YYYY-MM-DD.'
    }),
    Joi.object({
        day: Joi.number().integer().min(1).max(31).required(),
        month: Joi.number().integer().min(1).max(12).required(),
        year: Joi.number().integer().min(1900).max(2100).required()
    })
).optional().allow(null);

const timeSchemaOptional = Joi.string().pattern(/^([01]\d|2[0-3]):([0-5]\d)$/).optional().allow(null, '').messages({ // HH:MM
    'string.pattern.base': 'El formato de hora debe ser HH:MM.'
});

const doctorBaseSchema = {
    first_name: Joi.string().min(2).max(100).required().messages({
        'string.empty': 'El nombre es requerido.',
        'any.required': 'El nombre es requerido.'
    }),
    last_name: Joi.string().min(2).max(100).required().messages({
        'string.empty': 'El apellido es requerido.',
        'any.required': 'El apellido es requerido.'
    }),
    specialty: Joi.string().max(100).required().messages({
        'string.empty': 'La especialidad es requerida.',
        'any.required': 'La especialidad es requerida.'
    }),
    email: Joi.string().email().required().messages({
        'string.email': 'Debe ingresar un email válido.',
        'string.empty': 'El email es requerido.',
        'any.required': 'El email es requerido.'
    }),
    phone: Joi.string().pattern(/^[0-9+\-\s()]*$/).max(30).optional().allow(null, ''),
    license_number: Joi.string().max(50).optional().allow(null, ''),
    office_address: Joi.string().max(255).optional().allow(null, ''),
    office_phone: Joi.string().pattern(/^[0-9+\-\s()]*$/).max(30).optional().allow(null, ''),

    // working_days puede ser complejo: podría ser un string CSV, un array de números (0-6), o un JSON.
    // Por simplicidad, lo dejaremos como string opcional por ahora.
    // Una validación más robusta podría necesitar una función custom.
    working_days: Joi.string().max(100).optional().allow(null, ''),

    working_hours_start: timeSchemaOptional,
    working_hours_end: timeSchemaOptional,
    appointment_duration_minutes: Joi.number().integer().min(5).max(120).optional().allow(null),

    // user_id se maneja usualmente en el servicio al crear/vincular usuario
    // last_earnings_collection_date: dateOrDateObjectOptionalSchema // Comentado porque el controlador lo parsea manualmente
};

const createDoctorSchema = Joi.object(doctorBaseSchema);

const updateDoctorSchema = Joi.object({
    first_name: Joi.string().min(2).max(100).optional(),
    last_name: Joi.string().min(2).max(100).optional(),
    specialty: Joi.string().max(100).optional(),
    email: Joi.string().email().optional(),
    phone: Joi.string().pattern(/^[0-9+\-\s()]*$/).max(30).optional().allow(null, ''),
    license_number: Joi.string().max(50).optional().allow(null, ''),
    office_address: Joi.string().max(255).optional().allow(null, ''),
    office_phone: Joi.string().pattern(/^[0-9+\-\s()]*$/).max(30).optional().allow(null, ''),
    working_days: Joi.string().max(100).optional().allow(null, ''),
    working_hours_start: timeSchemaOptional,
    working_hours_end: timeSchemaOptional,
    appointment_duration_minutes: Joi.number().integer().min(5).max(120).optional().allow(null),
    // last_earnings_collection_date: dateOrDateObjectOptionalSchema // Comentado
}).min(1).messages({
    'object.min': 'Debe proporcionar al menos un campo para actualizar el doctor.'
});

module.exports = {
    createDoctorSchema,
    updateDoctorSchema
};
