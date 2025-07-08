import React, { useState, useEffect } from 'react';
import ModalContainer from '../../molecules/ModalContainer/ModalContainer';
import ModalHeader from '../../molecules/ModalHeader/ModalHeader';
import ModalFooter from '../../molecules/ModalFooter/ModalFooter';
import Button from '../../atoms/Button/Button';
import Input from '../../atoms/Input/Input';
import Select from '../../atoms/Select/Select';
import FormGroup from '../../molecules/FormGroup/FormGroup';
import Alert from '../../atoms/Alert/Alert';
import { authFetch } from '../../../auth/authFetch';
import styles from './AppointmentFormModal.module.css';

const AppointmentFormModal = ({ 
  isOpen, 
  onClose, 
  onSuccess, 
  selectedDate, 
  selectedTime, 
  appointment 
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
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditing = Boolean(appointment);

  useEffect(() => {
    if (isOpen) {
      fetchPatients();
      fetchDoctors();
      initializeForm();
    }
  }, [isOpen, appointment, selectedDate, selectedTime]);

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

  const fetchDoctors = async () => {
    try {
      const res = await authFetch('/api/doctors');
      if (res.ok) {
        const data = await res.json();
        setDoctors(data);
      }
    } catch (err) {
      console.error('Error fetching doctors:', err);
    }
  };

  const initializeForm = () => {
    if (isEditing && appointment) {
      // Editar cita existente
      setFormData({
        patient_id: appointment.patient_id?.toString() || '',
        doctor_id: appointment.doctor_id?.toString() || '',
        date: appointment.date ? new Date(appointment.date).toISOString().split('T')[0] : '',
        time: appointment.time || '',
        reason: appointment.reason || '',
        type: appointment.type || 'consulta',
        status: appointment.status || 'pendiente',
        service_type: appointment.service_type || '',
        amount: appointment.amount?.toString() || '',
        payment_method: appointment.payment_method || 'efectivo'
      });
    } else {
      // Nueva cita
      const dateStr = selectedDate ? selectedDate.toISOString().split('T')[0] : '';
      setFormData({
        patient_id: '',
        doctor_id: '',
        date: dateStr,
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
    if (!formData.doctor_id) return 'Seleccione un doctor';
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
      const submitData = {
        ...formData,
        amount: parseFloat(formData.amount),
        patient_id: parseInt(formData.patient_id),
        doctor_id: parseInt(formData.doctor_id)
      };

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
              <Select
                name="patient_id"
                value={formData.patient_id}
                onChange={handleChange}
                required
              >
                <option value="">Seleccionar paciente</option>
                {patients.map(patient => (
                  <option key={patient.patient_id} value={patient.patient_id}>
                    {patient.first_name} {patient.last_name} - DNI: {patient.dni}
                  </option>
                ))}
              </Select>
            </FormGroup>

            <FormGroup title="Doctor" required>
              <Select
                name="doctor_id"
                value={formData.doctor_id}
                onChange={handleChange}
                required
              >
                <option value="">Seleccionar doctor</option>
                {doctors.map(doctor => (
                  <option key={doctor.doctor_id} value={doctor.doctor_id}>
                    Dr. {doctor.first_name} {doctor.last_name} - {doctor.specialty}
                  </option>
                ))}
              </Select>
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
              >
                <option value="consulta">Consulta</option>
                <option value="control">Control</option>
                <option value="emergencia">Emergencia</option>
                <option value="seguimiento">Seguimiento</option>
              </Select>
            </FormGroup>
          </div>

          <div className={styles.row}>
            <FormGroup title="Estado">
              <Select
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="pendiente">Pendiente</option>
                <option value="confirmada">Confirmada</option>
                <option value="cancelada">Cancelada</option>
                <option value="completada">Completada</option>
              </Select>
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
              >
                <option value="efectivo">Efectivo</option>
                <option value="tarjeta">Tarjeta</option>
                <option value="transferencia">Transferencia</option>
                <option value="débito">Débito</option>
              </Select>
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