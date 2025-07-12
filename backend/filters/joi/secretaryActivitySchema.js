const Joi = require('joi');
const {
    dateOrDateObjectSchema,
    timeSchema,
    positiveIdSchema,
    optionalPositiveIdSchema,
    notesSchema
} = require('./baseSchemas');
const {
    CHAR_LIMITS
} = require('./constants');

const createSecretaryActivitySchema = Joi.object({
    secretary_id: positiveIdSchema,
    date: dateOrDateObjectSchema.required().messages({
        'any.required': 'La fecha de la actividad es requerida.'
    }),
    time: timeSchema.required().messages({
        'any.required': 'La hora es requerida.'
    }),
    activity_type: Joi.string().max(CHAR_LIMITS.ACTIVITY_TYPE).required().messages({
        'string.empty': 'El tipo de actividad es requerido.',
        'any.required': 'El tipo de actividad es requerido.'
    }),
    activity_id: optionalPositiveIdSchema, // ID de la entidad relacionada
    details: notesSchema
});

// No hay 'update' en el controlador actual, pero si lo hubiera:
/*
const updateSecretaryActivitySchema = Joi.object({
    date: dateOrDateObjectSchema.optional(),
    time: timeSchema.optional(),
    activity_type: Joi.string().max(CHAR_LIMITS.ACTIVITY_TYPE).optional(),
    activity_id: optionalPositiveIdSchema,
    details: notesSchema
}).min(1).messages({
    'object.min': 'Debe proporcionar al menos un campo para actualizar la actividad.'
});
*/

module.exports = {
    createSecretaryActivitySchema
    // updateSecretaryActivitySchema (si se implementa)
};
