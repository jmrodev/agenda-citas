const Joi = require('joi');
const {
    positiveIdsArraySchema
} = require('./baseSchemas');

const assignDoctorsToPatientSchema = Joi.object({
    doctor_ids: positiveIdsArraySchema.min(1).required().messages({
        'array.base': 'doctor_ids debe ser un array.',
        'array.min': 'Debe proporcionar al menos un ID de doctor.',
        'any.required': 'El campo doctor_ids es requerido.'
    })
});

const assignPatientsToDoctorSchema = Joi.object({
    patient_ids: positiveIdsArraySchema.min(1).required().messages({
        'array.base': 'patient_ids debe ser un array.',
        'array.min': 'Debe proporcionar al menos un ID de paciente.',
        'any.required': 'El campo patient_ids es requerido.'
    })
});

module.exports = {
    assignDoctorsToPatientSchema,
    assignPatientsToDoctorSchema
};
