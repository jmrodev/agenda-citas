import React from 'react';
import { usePatientForm } from '../../../hooks/useForm';
import PatientFormFields from '../../molecules/PatientFormFields/PatientFormFields';
import Button from '../../atoms/Button/Button';
import Alert from '../../atoms/Alert/Alert';
import styles from './PatientForm.module.css';

const PatientForm = React.memo(() => {
  const {
    values,
    errors,
    touched,
    isSubmitting,
    isValid,
    handleChange,
    handleBlur,
    handleSubmit
  } = usePatientForm({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    dni: '',
    date_of_birth: '',
    address: '',
    notes: ''
  });

  const onSubmit = async (formData) => {
    try {
      // Aquí iría la lógica para guardar el paciente
      console.log('Datos del paciente:', formData);
      return true;
    } catch (error) {
      console.error('Error al guardar paciente:', error);
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

      {Object.keys(errors).length > 0 && (
        <Alert type="error" className={styles.errorAlert}>
          Por favor, corrija los errores en el formulario
        </Alert>
      )}
    </div>
  );
});

PatientForm.displayName = 'PatientForm';

export default PatientForm; 