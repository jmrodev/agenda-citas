import React, { useEffect } from 'react';
import ModalContainer from '../../molecules/ModalContainer/ModalContainer';
import ModalHeader from '../../molecules/ModalHeader/ModalHeader';
import ModalFooter from '../../molecules/ModalFooter/ModalFooter';
import Button from '../../atoms/Button/Button';
import Alert from '../../atoms/Alert/Alert';
import AppointmentFormFields from '../../molecules/AppointmentFormFields/AppointmentFormFields';
import { useAppointmentForm } from '../../../hooks/useForm';
import { usePatients } from '../../../hooks/usePatients';
import { useAppointmentValidation } from '../../../hooks/useAppointmentValidation';
import { useAppointmentInitialization } from '../../../hooks/useAppointmentInitialization';
import { useAppointmentSubmission } from '../../../hooks/useAppointmentSubmission';
import styles from './AppointmentFormModal.module.css';

const AppointmentFormModal = ({ 
  isOpen,
  onClose,
  onSuccess,
  selectedDateISO,
  selectedTime,
  appointment,
  isOutOfSchedule = false,
  selectedDoctorId = null,
  selectedDoctorName = ''
}) => {
  const isEditing = Boolean(appointment);

  // Hook personalizado para manejo de pacientes
  const {
    patientOptions,
    loading: patientsLoading,
    error: patientsError,
    fetchPatients
  } = usePatients();

  // Hook personalizado para manejo del formulario
  const {
    values: formData,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    setValues,
    setErrors,
    setTouched
  } = useAppointmentForm({
    patient_id: '',
    doctor_id: selectedDoctorId ? String(selectedDoctorId) : '',
    date: selectedDateISO || '',
    time: selectedTime || '',
    reason: '',
    type: 'consulta',
    status: 'pendiente',
    service_type: '',
    amount: '',
    payment_method: 'efectivo'
  });

  // Hook personalizado para validación específica
  const { validateAppointmentForm } = useAppointmentValidation(formData, selectedDoctorId);

  // Hook personalizado para inicialización
  const { initializeForEdit, initializeForCreate } = useAppointmentInitialization(setValues);

  // Hook ultra-específico para envío
  const onSubmit = useAppointmentSubmission(isEditing, isOutOfSchedule, onSuccess, onClose);

  // Cargar pacientes al abrir el modal
  useEffect(() => {
    if (isOpen) {
      fetchPatients();
    }
  }, [isOpen]); // Removido fetchPatients de las dependencias

  // Inicializar formulario al abrir el modal o cambiar datos
  useEffect(() => {
    if (isOpen) {
      console.log('🔍 [AppointmentFormModal] Inicializando formulario:', {
        isEditing,
        selectedDoctorId,
        selectedDateISO,
        selectedTime,
        appointment
      });
      
      if (isEditing && appointment) {
        console.log('🔍 [AppointmentFormModal] Inicializando para edición:', appointment);
        initializeForEdit(appointment);
      } else {
        console.log('🔍 [AppointmentFormModal] Inicializando para nueva cita:', {
          selectedDoctorId,
          selectedDateISO,
          selectedTime
        });
        initializeForCreate(selectedDoctorId, selectedDateISO, selectedTime);
      }
    }
  }, [isOpen, appointment, selectedDateISO, selectedTime, selectedDoctorId, isEditing, initializeForEdit, initializeForCreate]);

  // Log para verificar el estado del formulario
  useEffect(() => {
    if (isOpen) {
      console.log('🔍 [AppointmentFormModal] Estado actual del formulario:', formData);
    }
  }, [isOpen, formData]);

  // Validar formulario cuando cambien los datos
  useEffect(() => {
    if (isOpen && Object.keys(formData).length > 0) {
      const validationErrors = validateAppointmentForm();
      setErrors(validationErrors);
    }
  }, [isOpen, formData, validateAppointmentForm, setErrors]);

  const handleFormSubmit = async () => {
    // Validar antes de enviar
    const validationErrors = validateAppointmentForm();
    if (Object.keys(validationErrors).length > 0) {
      console.log('🔍 [AppointmentFormModal] Errores de validación:', validationErrors);
      setErrors(validationErrors);
      // Marcar todos los campos como tocados para mostrar errores
      const allTouched = Object.keys(formData).reduce((acc, key) => {
        acc[key] = true;
        return acc;
      }, {});
      setTouched(allTouched);
      return false;
    }
    
    return handleSubmit(onSubmit);
  };

  if (!isOpen) return null;

  return (
    <ModalContainer onClose={onClose}>
      <ModalHeader
        title={isEditing ? 'Editar Cita' : 'Nueva Cita'}
        onClose={onClose}
      />
      
      <form onSubmit={handleFormSubmit} className={styles.form}>
        {(patientsError || errors.general) && (
          <Alert type="error" className={styles.alert}>
            {patientsError || errors.general}
          </Alert>
        )}

        {/* Debug temporal */}
        {process.env.NODE_ENV === 'development' && (
          <div style={{ 
            background: '#f0f0f0', 
            padding: '10px', 
            margin: '10px 0', 
            border: '1px solid #ccc',
            fontSize: '12px'
          }}>
            <strong>DEBUG - Estado del formulario:</strong>
            <pre>{JSON.stringify(formData, null, 2)}</pre>
            <strong>Errores:</strong>
            <pre>{JSON.stringify(errors, null, 2)}</pre>
            <strong>Campos tocados:</strong>
            <pre>{JSON.stringify(touched, null, 2)}</pre>
            <strong>Doctor seleccionado:</strong>
            <pre>{JSON.stringify({ selectedDoctorId, selectedDoctorName }, null, 2)}</pre>
          </div>
        )}

        <AppointmentFormFields
          formData={formData}
          patientOptions={patientOptions}
          selectedDoctorName={selectedDoctorName}
          onChange={handleChange}
          onBlur={handleBlur}
          errors={errors}
          touched={touched}
        />

        <ModalFooter>
          <Button 
            type="button" 
            variant="secondary" 
            onClick={onClose} 
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button 
            type="submit" 
            variant="primary" 
            loading={isSubmitting} 
            disabled={isSubmitting || patientsLoading}
          >
            {isSubmitting ? 'Guardando...' : (isEditing ? 'Actualizar' : 'Crear')}
          </Button>
        </ModalFooter>
      </form>
    </ModalContainer>
  );
};

export default AppointmentFormModal; 