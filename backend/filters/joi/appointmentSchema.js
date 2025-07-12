const Joi = require('joi');
const {
    dateOrDateObjectSchema,
    timeSchema,
    positiveIdSchema,
    optionalPositiveIdSchema,
    notesSchema,
    createUpdateSchema
} = require('./baseSchemas');
const {
    APPOINTMENT_STATUSES,
    PAYMENT_STATUSES,
    APPOINTMENT_TYPES,
    CHAR_LIMITS
} = require('./constants');

// Esquema base para citas
const appointmentBaseSchema = {
    patient_id: positiveIdSchema.messages({
        'number.base': 'El ID del paciente debe ser un número.',
        'number.positive': 'El ID del paciente debe ser un número positivo.',
        'any.required': 'El ID del paciente es requerido.'
    }),
    doctor_id: positiveIdSchema.messages({
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
    appointment_type: Joi.string().valid(...APPOINTMENT_TYPES).max(CHAR_LIMITS.SPECIALTY).optional().allow(null, ''),
    status: Joi.string().valid(...APPOINTMENT_STATUSES).optional().allow(null, ''),
    notes: notesSchema,
    payment_status: Joi.string().valid(...PAYMENT_STATUSES).optional().allow(null, ''),
    payment_amount: Joi.number().precision(2).min(0).optional().allow(null),
    payment_date: dateOrDateObjectSchema.optional().allow(null),
    out_of_schedule: Joi.boolean().optional()
};

// Esquema para crear cita
const createAppointmentSchema = Joi.object(appointmentBaseSchema);

// Esquema para actualizar cita
const updateAppointmentSchema = createUpdateSchema({
    patient_id: optionalPositiveIdSchema.messages({
        'number.base': 'El ID del paciente debe ser un número.',
        'number.positive': 'El ID del paciente debe ser un número positivo.'
    }),
    doctor_id: optionalPositiveIdSchema.messages({
        'number.base': 'El ID del doctor debe ser un número.',
        'number.positive': 'El ID del doctor debe ser un número positivo.'
    }),
    date: dateOrDateObjectSchema.optional(),
    time: timeSchema.optional(),
    appointment_type: Joi.string().valid(...APPOINTMENT_TYPES).max(CHAR_LIMITS.SPECIALTY).optional().allow(null, ''),
    status: Joi.string().valid(...APPOINTMENT_STATUSES).optional().allow(null, ''),
    notes: notesSchema,
    payment_status: Joi.string().valid(...PAYMENT_STATUSES).optional().allow(null, ''),
    payment_amount: Joi.number().precision(2).min(0).optional().allow(null),
    payment_date: dateOrDateObjectSchema.optional().allow(null),
    out_of_schedule: Joi.boolean().optional()
});

module.exports = {
    createAppointmentSchema,
    updateAppointmentSchema
};
