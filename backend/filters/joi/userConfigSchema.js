const Joi = require('joi');
const {
    NUMERIC_LIMITS
} = require('./constants');

const updateUserConfigSchema = Joi.object({
    session_timeout_minutes: Joi.number().integer().min(NUMERIC_LIMITS.MIN_SESSION_TIMEOUT).max(NUMERIC_LIMITS.MAX_SESSION_TIMEOUT).optional()
    // Podrían añadirse más configuraciones aquí en el futuro
}).min(1).messages({
    'object.min': 'Debe proporcionar al menos un campo para actualizar la configuración.'
});

module.exports = {
    updateUserConfigSchema
};
