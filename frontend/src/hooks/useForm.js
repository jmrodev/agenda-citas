import { useState, useCallback, useMemo } from 'react';
import { validate, SCHEMAS } from '../utils/validation';
import { sanitizeForAPI } from '../utils/sanitization';



/**
 * Hook personalizado para manejo de formularios
 * @param {Object} initialValues - Valores iniciales del formulario
 * @param {Object} validationSchema - Esquema de validación
 * @returns {Object} - Funciones y estado del formulario
 */
export const useForm = (initialValues = {}, validationSchema = {}) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validar formulario completo
  const validateForm = useCallback(() => {
    const validationErrors = validate(values, validationSchema);
    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  }, [values, validationSchema]);

  // Validar formulario completo y actualizar errores
  const validateAndUpdateErrors = useCallback(() => {
    const validationErrors = validate(values, validationSchema);
    setErrors(validationErrors);
    return validationErrors;
  }, [values, validationSchema]);

  // Validar campo individual
  const validateField = useCallback((name, value) => {
    if (!validationSchema[name]) return null;
    
    const fieldErrors = validate({ [name]: value }, { [name]: validationSchema[name] });
    return fieldErrors[name] || null;
  }, [validationSchema]);

  // Manejar cambio de campo
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setValues(prev => ({ ...prev, [name]: value }));
    
    // Validar el campo inmediatamente si ya fue tocado
    if (touched[name]) {
      const fieldError = validateField(name, value);
      setErrors(prev => ({
        ...prev,
        [name]: fieldError
      }));
    }
  }, [touched, validateField, values]);

  // Manejar pérdida de foco
  const handleBlur = useCallback((e) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    
    const fieldError = validateField(name, values[name]);
    setErrors(prev => ({
      ...prev,
      [name]: fieldError
    }));
  }, [values, validateField]);

  // Resetear formulario
  const reset = useCallback((newValues = initialValues) => {
    setValues(newValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [initialValues]);

  // Manejar envío del formulario
  const handleSubmit = useCallback(async (onSubmit) => {
    setIsSubmitting(true);
    
    try {
      // Validar formulario completo
      const isValid = validateForm();
      
      if (!isValid) {
        // Marcar todos los campos como tocados para mostrar errores
        const allTouched = Object.keys(values).reduce((acc, key) => {
          acc[key] = true;
          return acc;
        }, {});
        setTouched(allTouched);
        return false;
      }

      // Sanitizar datos antes de enviar
      const sanitizedData = sanitizeForAPI(values, '');
      
      // Llamar función de envío
      const result = await onSubmit(sanitizedData);
      
      return result;
    } catch (error) {
      console.error('Error en formulario:', error);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }, [values, validateForm]);

  // Verificar si el formulario es válido
  const isValid = useMemo(() => {
    // Validar el formulario completo
    const validationErrors = validate(values, validationSchema);
    

    
    // Verificar que no hay errores
    const hasNoErrors = Object.keys(validationErrors).length === 0;
    
    return hasNoErrors;
  }, [values, validationSchema]);

  // Verificar si el formulario ha sido modificado
  const isDirty = useMemo(() => {
    return JSON.stringify(values) !== JSON.stringify(initialValues);
  }, [values, initialValues]);

  return {
    // Estado
    values,
    errors,
    touched,
    isSubmitting,
    isValid,
    isDirty,
    
    // Funciones
    handleChange,
    handleBlur,
    handleSubmit,
    reset,
    setValues,
    setErrors,
    validateForm,
    validateAndUpdateErrors
  };
};

/**
 * Hook para formularios con esquemas predefinidos
 * @param {string} schemaType - Tipo de esquema ('LOGIN', 'REGISTER', 'PATIENT', 'APPOINTMENT')
 * @param {Object} initialValues - Valores iniciales
 * @returns {Object} - Funciones y estado del formulario
 */
export const useFormWithSchema = (schemaType, initialValues = {}) => {
  const validationSchema = SCHEMAS[schemaType] || {};
  
  return useForm(initialValues, validationSchema);
};

/**
 * Hook para formularios de login
 * @param {Object} initialValues - Valores iniciales
 * @returns {Object} - Funciones y estado del formulario de login
 */
export const useLoginForm = (initialValues = {}) => {
  return useFormWithSchema('LOGIN', initialValues);
};

/**
 * Hook para formularios de registro
 * @param {Object} initialValues - Valores iniciales
 * @returns {Object} - Funciones y estado del formulario de registro
 */
export const useRegisterForm = (initialValues = {}) => {
  return useFormWithSchema('REGISTER', initialValues);
};

/**
 * Hook para formularios de pacientes
 * @param {Object} initialValues - Valores iniciales
 * @returns {Object} - Funciones y estado del formulario de pacientes
 */
export const usePatientForm = (initialValues = {}) => {
  return useFormWithSchema('PATIENT', initialValues);
};

/**
 * Hook para formularios de citas
 * @param {Object} initialValues - Valores iniciales
 * @returns {Object} - Funciones y estado del formulario de citas
 */
export const useAppointmentForm = (initialValues = {}) => {
  // No usar esquema de validación estándar, usar validación personalizada
  return useForm(initialValues, {});
}; 