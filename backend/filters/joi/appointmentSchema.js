const Joi = require('joi');

// Helper para validar fecha que puede ser string YYYY-MM-DD o objeto {day, month, year}
const dateOrDateObjectSchema = Joi.alternatives().try(
    Joi.string().isoDate().messages({ // Acepta 'YYYY-MM-DD'
        'string.isoDate': 'El formato de fecha debe ser YYYY-MM-DD.'
    }),
    Joi.object({
        day: Joi.number().integer().min(1).max(31).required(),
        month: Joi.number().integer().min(1).max(12).required(),
        year: Joi.number().integer().min(1900).max(2100).required()
    }).required()
).messages({
    'alternatives.types': 'La fecha debe ser una cadena YYYY-MM-DD o un objeto con propiedades day, month, year.'
});

const timeSchema = Joi.string().pattern(/^([01]\d|2[0-3]):([0-5]\d)$/).messages({ // HH:MM
    'string.pattern.base': 'El formato de hora debe ser HH:MM.'
});

const appointmentBaseSchema = {
    patient_id: Joi.number().integer().positive().required().messages({
        'number.base': 'El ID del paciente debe ser un número.',
        'number.positive': 'El ID del paciente debe ser un número positivo.',
        'any.required': 'El ID del paciente es requerido.'
    }),
    doctor_id: Joi.number().integer().positive().required().messages({
        'number.base': 'El ID del doctor debe ser un número.',
        'number.positive': 'El ID del doctor debe ser un número positivo.',
        'any.required': 'El ID del doctor es requerido.'
    }),
    date: dateOrDateObjectSchema.required().messages({
        'any.required': 'La fecha de la cita es requerida.'
    }),
    time: timeSchema.required().messages({
        'any.required': 'La hora de la cita es requerida.'
    }),
    appointment_type: Joi.string().max(50).optional().allow(null, ''),
    status: Joi.string().valid('PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED', 'ABSENT').optional().allow(null, ''),
    notes: Joi.string().max(1000).optional().allow(null, ''),
    payment_status: Joi.string().valid('PENDING', 'PAID', 'PARTIAL', 'WAIVED').optional().allow(null, ''),
    payment_amount: Joi.number().precision(2).min(0).optional().allow(null),
    payment_date: dateOrDateObjectSchema.optional().allow(null),
    out_of_schedule: Joi.boolean().optional()
};

const createAppointmentSchema = Joi.object(appointmentBaseSchema);

const updateAppointmentSchema = Joi.object({
    patient_id: Joi.number().integer().positive().optional(),
    doctor_id: Joi.number().integer().positive().optional(),
    date: dateOrDateObjectSchema.optional(),
    time: timeSchema.optional(),
    appointment_type: Joi.string().max(50).optional().allow(null, ''),
    status: Joi.string().valid('PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED', 'ABSENT').optional().allow(null, ''),
    notes: Joi.string().max(1000).optional().allow(null, ''),
    payment_status: Joi.string().valid('PENDING', 'PAID', 'PARTIAL', 'WAIVED').optional().allow(null, ''),
    payment_amount: Joi.number().precision(2).min(0).optional().allow(null),
    payment_date: dateOrDateObjectSchema.optional().allow(null),
    out_of_schedule: Joi.boolean().optional()
}).min(1).messages({
    'object.min': 'Debe proporcionar al menos un campo para actualizar la cita.'
});

module.exports = {
    createAppointmentSchema,
    updateAppointmentSchema
};
