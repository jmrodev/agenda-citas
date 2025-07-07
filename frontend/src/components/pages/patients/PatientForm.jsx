import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePatientForm } from '../../../hooks/useForm';
import PatientFormFields from '../../molecules/PatientFormFields/PatientFormFields';
import Button from '../../atoms/Button/Button';
import Alert from '../../atoms/Alert/Alert';
import Spinner from '../../atoms/Spinner/Spinner';
import { patientService } from '../../../services/patientService';
import FormDebug from '../../debug/FormDebug';
import styles from './PatientForm.module.css';

const PatientForm = React.memo(({ onSuccess }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [submitStatus, setSubmitStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [patient, setPatient] = useState(null);
  const [error, setError] = useState('');

  const isEditing = Boolean(id);

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
    setValues,
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
    health_insurance_member_number: '',
    doctor_ids: [],
    reference_person: {
      name: '',
      last_name: '',
      phone: '',
      relationship: '',
      address: ''
    }
  });



  // Cargar datos del paciente si estamos editando
  useEffect(() => {
    if (isEditing) {
      fetchPatient();
    }
  }, [id]);

  // Validar formulario cuando cambien los valores
  useEffect(() => {
    validateAndUpdateErrors();
  }, [values, validateAndUpdateErrors]);

  const fetchPatient = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await patientService.getById(id);
      setPatient(data);
      
      // Convertir datos para el formulario
      const formData = {
        first_name: data.first_name || '',
        last_name: data.last_name || '',
        email: data.email || '',
        phone: data.phone || '',
        dni: data.dni || '',
        date_of_birth: data.date_of_birth || '',
        address: data.address || '',
        preferred_payment_methods: data.preferred_payment_methods || 'efectivo,débito',
        health_insurance_id: data.health_insurance_id || '',
        health_insurance_member_number: data.health_insurance_member_number || '',
        doctor_ids: data.doctors?.map(d => d.doctor_id) || [],
        reference_person: {
          name: data.reference_person?.name || '',
          last_name: data.reference_person?.last_name || '',
          phone: data.reference_person?.phone || '',
          relationship: data.reference_person?.relationship || '',
          address: data.reference_person?.address || ''
        }
      };
      
      setValues(formData);
      console.log('Datos del paciente cargados:', data);
      console.log('Datos del formulario:', formData);
    } catch (err) {
      setError(err.message || 'Error al cargar el paciente');
    } finally {
      setLoading(false);
    }
  };

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

      let result;
      if (isEditing) {
        result = await patientService.update(id, patientData);
        setSubmitStatus({
          type: 'success',
          message: `Paciente ${result.first_name} ${result.last_name} actualizado exitosamente`
        });
      } else {
        result = await patientService.create(patientData);
        setSubmitStatus({
          type: 'success',
          message: `Paciente ${result.patient?.first_name} ${result.patient?.last_name} creado exitosamente`
        });
      }

      // Llamar callback de éxito si existe
      if (onSuccess) {
        onSuccess(result);
      }

      // Redirigir o resetear formulario después de 2 segundos
      setTimeout(() => {
        if (isEditing) {
          navigate(`/app/patients/${id}`);
        } else {
          reset();
        }
        setSubmitStatus({ type: '', message: '' });
      }, 2000);

      return true;
    } catch (error) {
      console.error('Error al guardar paciente:', error);
      setSubmitStatus({
        type: 'error',
        message: error.message || `Error al ${isEditing ? 'actualizar' : 'crear'} el paciente`
      });
      return false;
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    await handleSubmit(onSubmit);
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <Spinner size={32} />
        <p>Cargando paciente...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <Alert type="error">{error}</Alert>
        <Button onClick={() => navigate('/app/patients')}>
          Volver a la lista
        </Button>
      </div>
    );
  }

  return (
    <div className={styles.patientForm}>
      <div className={styles.header}>
        <h2 className={styles.title}>
          {isEditing ? 'Editar Paciente' : 'Nuevo Paciente'}
        </h2>
        {isEditing && (
          <Button
            variant="outline"
            size="medium"
            onClick={() => navigate(`/app/patients/${id}`)}
          >
            Cancelar
          </Button>
        )}
      </div>
      
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
            {isSubmitting ? 'Guardando...' : (isEditing ? 'Actualizar Paciente' : 'Guardar Paciente')}
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