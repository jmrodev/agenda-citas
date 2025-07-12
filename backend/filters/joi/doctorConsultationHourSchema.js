const Joi = require('joi');
const {
    positiveIdSchema,
    timeSchema,
    createUpdateSchema
} = require('./baseSchemas');

// day_of_week puede ser número (0=Domingo, 1=Lunes, etc.) o string
const dayOfWeekSchema = Joi.alternatives().try(
    Joi.number().integer().min(0).max(6), // Domingo a Sábado
    Joi.string().valid('Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado',
                       'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday')
).required().messages({
    'any.required': 'El día de la semana es requerido.',
    'alternatives.types': 'El día de la semana debe ser un número (0-6) o un nombre de día válido.'
});

const consultationHourBaseSchema = {
    doctor_id: positiveIdSchema.messages({
        'any.required': 'El ID del doctor es requerido.'
    }),
    day_of_week: dayOfWeekSchema,
    start_time: timeSchema.required().messages({
        'any.required': 'La hora es requerida.'
    }),
    end_time: timeSchema.required().custom((value, helpers) => {
        const { start_time } = helpers.state.ancestors[0];
        if (start_time && value <= start_time) {
            return helpers.error('any.invalid', { message: 'La hora de fin debe ser posterior a la hora de inicio.' });
        }
        return value;
    }).messages({
        'any.invalid': 'La hora de fin debe ser posterior a la hora de inicio.',
        'any.required': 'La hora es requerida.'
    }),
    is_available: Joi.boolean().default(true).optional()
};

const createConsultationHourSchema = Joi.object(consultationHourBaseSchema);

const updateConsultationHourSchema = createUpdateSchema({
    start_time: timeSchema.optional().messages({
        'any.required': 'La hora es requerida.'
    }),
    end_time: timeSchema.optional().custom((value, helpers) => {
        const { start_time } = helpers.state.ancestors[0];
        if (start_time && value <= start_time) {
            return helpers.error('any.invalid', { message: 'La hora de fin debe ser posterior a la hora de inicio.' });
        }
        return value;
    }).messages({
        'any.invalid': 'La hora de fin debe ser posterior a la hora de inicio.',
        'any.required': 'La hora es requerida.'
    }),
    is_available: Joi.boolean().optional()
});

// Para bulkCreateOrUpdateConsultationHours
const bulkConsultationHoursSchema = Joi.array().items(Joi.object({
    ...consultationHourBaseSchema
})).min(1).messages({
    'array.min': 'Se requiere al menos un horario de consulta.'
});

module.exports = {
    createConsultationHourSchema,
    updateConsultationHourSchema,
    bulkConsultationHoursSchema
};
