const Joi = require('joi');

const timeSchema = Joi.string().pattern(/^([01]\d|2[0-3]):([0-5]\d)$/).required().messages({
    'string.pattern.base': 'El formato de hora debe ser HH:MM.',
    'any.required': 'La hora es requerida.'
});

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
    doctor_id: Joi.number().integer().positive().required().messages({
        'any.required': 'El ID del doctor es requerido.'
    }),
    day_of_week: dayOfWeekSchema,
    start_time: timeSchema,
    end_time: timeSchema.custom((value, helpers) => {
        const { start_time } = helpers.state.ancestors[0]; // Obtener start_time del mismo objeto
        if (start_time && value <= start_time) {
            return helpers.error('any.invalid', { message: 'La hora de fin debe ser posterior a la hora de inicio.' });
        }
        return value;
    }).messages({
        'any.invalid': 'La hora de fin debe ser posterior a la hora de inicio.'
    }),
    is_available: Joi.boolean().default(true).optional()
};

const createConsultationHourSchema = Joi.object(consultationHourBaseSchema);

const updateConsultationHourSchema = Joi.object({
    // doctor_id y day_of_week usualmente no se cambian, se crea/elimina uno nuevo.
    // Si se permite cambiar, deben ser opcionales.
    // doctor_id: Joi.number().integer().positive().optional(),
    // day_of_week: dayOfWeekSchema.optional(),
    start_time: timeSchema.optional(),
    end_time: timeSchema.optional().custom((value, helpers) => {
        const { start_time } = helpers.state.ancestors[0];
        if (start_time && value <= start_time) {
            return helpers.error('any.invalid', { message: 'La hora de fin debe ser posterior a la hora de inicio.' });
        }
        return value;
    }),
    is_available: Joi.boolean().optional()
}).min(1).messages({
    'object.min': 'Debe proporcionar al menos un campo para actualizar el horario de consulta.'
});

// Para bulkCreateOrUpdateConsultationHours, se esperaría un array de estos objetos.
const bulkConsultationHoursSchema = Joi.array().items(Joi.object({
    // Podría ser una mezcla de creación y actualización, o un esquema más específico.
    // Por ahora, asumimos que son para creación o un reemplazo completo.
    // Si es para update, necesitaría un 'id' del consultation_hour.
    // Aquí definimos como si fuera para creación:
    ...consultationHourBaseSchema
    // Si se quisiera permitir opcionalmente un ID para update:
    // id: Joi.number().integer().positive().optional(),
    // ... y hacer los campos base opcionales si hay ID.
})).min(1).messages({
    'array.min': 'Se requiere al menos un horario de consulta.'
});


module.exports = {
    createConsultationHourSchema,
    updateConsultationHourSchema,
    bulkConsultationHoursSchema // Para la ruta de creación/actualización masiva
};
