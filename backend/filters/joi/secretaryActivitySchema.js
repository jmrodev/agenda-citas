const Joi = require('joi');

// Helper para validar fecha que puede ser string YYYY-MM-DD o objeto {day, month, year}
const dateOrDateObjectSchema = Joi.alternatives().try(
    Joi.string().isoDate().messages({
        'string.isoDate': 'El formato de fecha debe ser YYYY-MM-DD.'
    }),
    Joi.object({
        day: Joi.number().integer().min(1).max(31).required(),
        month: Joi.number().integer().min(1).max(12).required(),
        year: Joi.number().integer().min(1900).max(new Date().getFullYear()).required()
    }).required()
).messages({
    'alternatives.types': 'La fecha debe ser una cadena YYYY-MM-DD o un objeto {day, month, year}.'
});

const timeSchema = Joi.string().pattern(/^([01]\d|2[0-3]):([0-5]\d)$/).required().messages({ // HH:MM
    'string.pattern.base': 'El formato de hora debe ser HH:MM.',
    'any.required': 'La hora es requerida.'
});

const createSecretaryActivitySchema = Joi.object({
    secretary_id: Joi.number().integer().positive().required().messages({
        'any.required': 'El ID de la secretaria es requerido.'
    }),
    // El controlador espera 'date' en el body
    date: dateOrDateObjectSchema.required().messages({
        'any.required': 'La fecha de la actividad es requerida.'
    }),
    time: timeSchema,
    activity_type: Joi.string().max(100).required().messages({
        'string.empty': 'El tipo de actividad es requerido.',
        'any.required': 'El tipo de actividad es requerido.'
    }),
    activity_id: Joi.number().integer().positive().optional().allow(null), // ID de la entidad relacionada
    details: Joi.string().max(1000).optional().allow(null, '')
});

// No hay 'update' en el controlador actual, pero si lo hubiera:
/*
const updateSecretaryActivitySchema = Joi.object({
    date: dateOrDateObjectSchema.optional(),
    time: timeSchema.optional(),
    activity_type: Joi.string().max(100).optional(),
    activity_id: Joi.number().integer().positive().optional().allow(null),
    details: Joi.string().max(1000).optional().allow(null, '')
}).min(1).messages({
    'object.min': 'Debe proporcionar al menos un campo para actualizar la actividad.'
});
*/

module.exports = {
    createSecretaryActivitySchema
    // updateSecretaryActivitySchema (si se implementa)
};
