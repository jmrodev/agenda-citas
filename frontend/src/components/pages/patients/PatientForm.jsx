import React, { useState, useEffect } from 'react';
import { usePatientForm } from '../../../hooks/useForm';
import PatientFormFields from '../../molecules/PatientFormFields/PatientFormFields';
import Button from '../../atoms/Button/Button';
import Alert from '../../atoms/Alert/Alert';
import { patientService } from '../../../services/patientService';
import FormDebug from '../../debug/FormDebug';
import styles from './PatientForm.module.css';

const PatientForm = React.memo(({ onSuccess }) => {
  const [submitStatus, setSubmitStatus] = useState({ type: '', message: '' });

  const {
    values,
    errors,
    touched,
    isSubmitting,
    isValid,
    handleChange,
    handleBlur,
    handleSubmit,
    reset,
    validateAndUpdateErrors
  } = usePatientForm({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    dni: '',
    date_of_birth: '',
    address: '',
    preferred_payment_methods: 'efectivo,débito',
    health_insurance_id: '',
    doctor_ids: [],
    reference_person: {
      name: '',
      last_name: '',
      phone: '',
      relationship: '',
      address: ''
    }
  });



  // Validar formulario cuando cambien los valores
  useEffect(() => {
    validateAndUpdateErrors();
  }, [values, validateAndUpdateErrors]);

  const onSubmit = async (formData) => {
    try {
      setSubmitStatus({ type: '', message: '' });
      
      // Preparar datos para el backend
      const patientData = {
        ...formData,
        // Convertir doctor_ids a array si no lo es
        doctor_ids: Array.isArray(formData.doctor_ids) ? formData.doctor_ids : [],
        // Convertir health_insurance_id a número si existe
        health_insurance_id: formData.health_insurance_id ? parseInt(formData.health_insurance_id) : null
      };

      const result = await patientService.create(patientData);
      
      setSubmitStatus({
        type: 'success',
        message: `Paciente ${result.patient?.first_name} ${result.patient?.last_name} creado exitosamente`
      });

      // Llamar callback de éxito si existe
      if (onSuccess) {
        onSuccess(result);
      }

      // Resetear formulario después de 2 segundos
      setTimeout(() => {
        reset();
        setSubmitStatus({ type: '', message: '' });
      }, 2000);

      return true;
    } catch (error) {
      console.error('Error al guardar paciente:', error);
      setSubmitStatus({
        type: 'error',
        message: error.message || 'Error al crear el paciente'
      });
      return false;
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    await handleSubmit(onSubmit);
  };

  return (
    <div className={styles.patientForm}>
      <h2 className={styles.title}>Nuevo Paciente</h2>
      
      <form onSubmit={handleFormSubmit} className={styles.form}>
        <PatientFormFields
          values={values}
          errors={errors}
          touched={touched}
          onChange={handleChange}
          onBlur={handleBlur}
        />

        <div className={styles.actions}>
          <Button
            type="submit"
            variant="primary"
            size="large"
            disabled={!isValid || isSubmitting}
            loading={isSubmitting}
          >
            {isSubmitting ? 'Guardando...' : 'Guardar Paciente'}
          </Button>
        </div>
      </form>

      {submitStatus.type && (
        <Alert type={submitStatus.type} className={styles.statusAlert}>
          {submitStatus.message}
        </Alert>
      )}

      {Object.keys(errors).length > 0 && (
        <Alert type="error" className={styles.errorAlert}>
          Por favor, corrija los errores en el formulario
        </Alert>
      )}

      {/* Debug component - solo en desarrollo */}
      <FormDebug values={values} errors={errors} touched={touched} />
    </div>
  );
});

PatientForm.displayName = 'PatientForm';

export default PatientForm; 