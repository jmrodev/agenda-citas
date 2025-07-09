import React, { useState, useEffect, useMemo } from 'react';
import ModalContainer from '../../molecules/ModalContainer/ModalContainer';
import ModalHeader from '../../molecules/ModalHeader/ModalHeader';
import ModalFooter from '../../molecules/ModalFooter/ModalFooter';
import Button from '../../atoms/Button/Button';
import Input from '../../atoms/Input/Input';
import Select from '../../atoms/Select/Select';
import SearchableSelect from '../../molecules/SearchableSelect/SearchableSelect';
import FormGroup from '../../molecules/FormGroup/FormGroup';
import Alert from '../../atoms/Alert/Alert';
import { authFetch } from '../../../auth/authFetch';
import styles from './AppointmentFormModal.module.css';

const AppointmentFormModal = ({ 
  isOpen,
  onClose,
  onSuccess,
  selectedDateISO, // Recibir el string ISO
  selectedTime,
  appointment,
  isOutOfSchedule = false,
  selectedDoctorId = null,
  selectedDoctorName = ''
}) => {
  const [formData, setFormData] = useState({
    patient_id: '',
    doctor_id: '',
    date: '',
    time: '',
    reason: '',
    type: 'consulta',
    status: 'pendiente',
    service_type: '',
    amount: '',
    payment_method: 'efectivo'
  });

  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditing = Boolean(appointment);

  // Memoizar las opciones de pacientes y doctores para evitar re-renders innecesarios
  const patientOptions = useMemo(() => [
    { value: '', label: 'Seleccionar paciente' },
    ...patients.map(patient => ({
      value: String(patient.patient_id),
      label: `${patient.first_name} ${patient.last_name} - DNI: ${patient.dni}`,
      firstName: patient.first_name,
      lastName: patient.last_name,
      dni: patient.dni
    }))
  ], [patients]);

  // El doctor ya está seleccionado desde el calendario, no necesitamos opciones

  // Solo cargar pacientes al abrir el modal
  useEffect(() => {
    if (isOpen) {
      fetchPatients();
    }
  }, [isOpen]);

  // Solo inicializar el formulario al abrir el modal o cambiar la cita a editar
  useEffect(() => {
    // console.log('useEffect initializeForm triggered:', { isOpen, appointment, selectedDateISO, selectedTime });
    if (isOpen) {
      initializeForm();
    }
  }, [isOpen, appointment, selectedDateISO, selectedTime]); // Usar string ISO en dependencias

  const fetchPatients = async () => {
    try {
      const res = await authFetch('/api/patients');
      if (res.ok) {
        const data = await res.json();
        setPatients(data);
      }
    } catch (err) {
      console.error('Error fetching patients:', err);
    }
  };



  const initializeForm = () => {
    // console.log('initializeForm:', { isEditing, appointment, selectedDateISO, selectedTime });
    if (isEditing && appointment) {
      setFormData({
        patient_id: appointment.patient_id ? String(appointment.patient_id) : '',
        doctor_id: appointment.doctor_id ? String(appointment.doctor_id) : '',
        date: appointment.date ? new Date(appointment.date).toISOString().split('T')[0] : '',
        time: appointment.time || '',
        reason: appointment.reason || '',
        type: appointment.type || 'consulta',
        status: appointment.status || 'pendiente',
        service_type: appointment.service_type || '',
        amount: appointment.amount ? String(appointment.amount) : '',
        payment_method: appointment.payment_method || 'efectivo'
      });
    } else {
      setFormData({
        patient_id: '',
        doctor_id: selectedDoctorId ? String(selectedDoctorId) : '', // Usar el doctor seleccionado
        date: selectedDateISO || '', // Usar directamente el string ISO
        time: selectedTime || '',
        reason: '',
        type: 'consulta',
        status: 'pendiente',
        service_type: '',
        amount: '',
        payment_method: 'efectivo'
      });
    }
    setError('');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (!formData.patient_id) return 'Seleccione un paciente';
    if (!selectedDoctorId) return 'Debe seleccionar un doctor en el calendario';
    if (!formData.date) return 'Seleccione una fecha';
    if (!formData.time) return 'Seleccione una hora';
    if (!formData.reason.trim()) return 'Ingrese el motivo de la consulta';
    if (!formData.amount || parseFloat(formData.amount) <= 0) return 'Ingrese un monto válido';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSubmitting(true);
    try {
      // Convertir la fecha del formato YYYY-MM-DD a objeto { day, month, year }
      const dateParts = formData.date.split('-');
      const dateObject = {
        year: parseInt(dateParts[0]),
        month: parseInt(dateParts[1]),
        day: parseInt(dateParts[2])
      };

      const submitData = {
        ...formData,
        date: dateObject, // Usar el objeto de fecha en lugar del string
        amount: parseFloat(formData.amount) || 0, // Asegurar que amount sea un número
        patient_id: parseInt(formData.patient_id),
        doctor_id: parseInt(formData.doctor_id),
        isOutOfSchedule: isOutOfSchedule // Agregar el flag de fuera de horario
      };

      // Remover campos que no deben enviarse al backend
      delete submitData.patientOptions;
      delete submitData.doctorOptions;

      let res;
      if (isEditing) {
        res = await authFetch(`/api/appointments/${appointment.appointment_id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(submitData)
        });
      } else {
        res = await authFetch('/api/appointments', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(submitData)
        });
      }

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Error al guardar la cita');
      }

      onSuccess();
    } catch (err) {
      setError(err.message || `Error al ${isEditing ? 'actualizar' : 'crear'} la cita`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <ModalContainer onClose={onClose}>
      <ModalHeader
        title={isEditing ? 'Editar Cita' : 'Nueva Cita'}
        onClose={onClose}
      />
      
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formContent}>
          {error && <Alert type="error" className={styles.alert}>{error}</Alert>}

          <div className={styles.row}>
            <FormGroup title="Paciente" required>
              <SearchableSelect
                name="patient_id"
                value={formData.patient_id || ''}
                onChange={handleChange}
                required
                placeholder="Buscar paciente por nombre, apellido o DNI..."
                searchFields={['label', 'firstName', 'lastName', 'dni']}
                options={patientOptions}
              />
            </FormGroup>

            <FormGroup title="Doctor" required>
              {selectedDoctorName ? (
                <div className={styles.doctorInfo}>
                  <span className={styles.doctorName}>{selectedDoctorName}</span>
                  <small className={styles.doctorNote}>Seleccionado desde el calendario</small>
                </div>
              ) : (
                <div className={styles.noDoctorSelected}>
                  <span className={styles.warning}>Debe seleccionar un doctor en el calendario</span>
                </div>
              )}
            </FormGroup>
          </div>

          <div className={styles.row}>
            <FormGroup title="Fecha" required>
              <Input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
              />
            </FormGroup>

            <FormGroup title="Hora" required>
              <Input
                type="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                required
              />
            </FormGroup>
          </div>

          <div className={styles.row}>
            <FormGroup title="Motivo de la consulta" required>
              <Input
                type="text"
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                placeholder="Descripción del motivo de la consulta"
                maxLength={255}
                required
              />
            </FormGroup>

            <FormGroup title="Tipo de consulta">
              <Select
                name="type"
                value={formData.type}
                onChange={handleChange}
                options={[
                  { value: 'consulta', label: 'Consulta' },
                  { value: 'control', label: 'Control' },
                  { value: 'emergencia', label: 'Emergencia' },
                  { value: 'seguimiento', label: 'Seguimiento' }
                ]}
              />
            </FormGroup>
          </div>

          <div className={styles.row}>
            <FormGroup title="Estado">
              <Select
                name="status"
                value={formData.status}
                onChange={handleChange}
                options={[
                  { value: 'pendiente', label: 'Pendiente' },
                  { value: 'confirmada', label: 'Confirmada' },
                  { value: 'cancelada', label: 'Cancelada' },
                  { value: 'completada', label: 'Completada' }
                ]}
              />
            </FormGroup>

            <FormGroup title="Tipo de servicio">
              <Input
                type="text"
                name="service_type"
                value={formData.service_type}
                onChange={handleChange}
                placeholder="Ej: consulta_cardiológica"
                maxLength={100}
              />
            </FormGroup>
          </div>

          <div className={styles.row}>
            <FormGroup title="Monto (€)" required>
              <Input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                min="0"
                step="0.01"
                placeholder="0.00"
                required
              />
            </FormGroup>

            <FormGroup title="Método de pago">
              <Select
                name="payment_method"
                value={formData.payment_method}
                onChange={handleChange}
                options={[
                  { value: 'efectivo', label: 'Efectivo' },
                  { value: 'tarjeta', label: 'Tarjeta' },
                  { value: 'transferencia', label: 'Transferencia' },
                  { value: 'débito', label: 'Débito' }
                ]}
              />
            </FormGroup>
          </div>
        </div>

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
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Guardando...' : (isEditing ? 'Actualizar' : 'Crear')}
          </Button>
        </ModalFooter>
      </form>
    </ModalContainer>
  );
};

export default AppointmentFormModal; 