import React, { useState, useEffect, useRef } from 'react';
import ModalContainer from '../../molecules/ModalContainer/ModalContainer';
import ModalHeader from '../../molecules/ModalHeader/ModalHeader';
import ModalFooter from '../../molecules/ModalFooter/ModalFooter';
import FormField from '../../molecules/FormField/FormField';
import Button from '../../atoms/Button/Button';
import Alert from '../../atoms/Alert/Alert';
import Select from '../../atoms/Select/Select';
import { parseAndValidateDate } from '../../../utils/date';
import styles from './PatientFormModal.module.css';
import { authFetch } from '../../../auth/authFetch';

const PatientFormModal = ({ open, onClose, onSave, patient }) => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    date_of_birth: '',
    address: '',
    phone: '',
    email: '',
    preferred_payment_methods: '',
    reference_person: {
      name: '',
      last_name: '',
      address: '',
      phone: '',
      relationship: ''
    }
  });
  const [selectedDoctors, setSelectedDoctors] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [birthDate, setBirthDate] = useState({ day: '', month: '', year: '' });
  const firstInputRef = useRef(null);

  // Obtener lista de doctores al abrir el modal
  useEffect(() => {
    if (open) {
      const fetchDoctors = async () => {
        try {
          const res = await authFetch('/api/doctors');
          const data = await res.json();
          console.log('Doctores recibidos (PatientFormModal):', data);
          setDoctors(data);
        } catch (err) {
          setDoctors([]);
        }
      };
      fetchDoctors();
    }
  }, [open]);

  useEffect(() => {
    if (open && firstInputRef.current) {
      firstInputRef.current.focus();
    }
  }, [open]);

  useEffect(() => {
    if (!open) {
      setError('');
      setSuccess('');
      setFieldErrors({});
      setSelectedDoctors([]);
    }
  }, [open]);

  useEffect(() => {
    if (open) {
      const handleEsc = (e) => {
        if (e.key === 'Escape') onClose();
      };
      window.addEventListener('keydown', handleEsc);
      return () => window.removeEventListener('keydown', handleEsc);
    }
  }, [open, onClose]);

  useEffect(() => {
    if (patient) {
      setFormData({
        first_name: patient.first_name || '',
        last_name: patient.last_name || '',
        date_of_birth: patient.date_of_birth ? patient.date_of_birth.split('T')[0] : '',
        address: patient.address || '',
        phone: patient.phone || '',
        email: patient.email || '',
        preferred_payment_methods: patient.preferred_payment_methods || '',
        reference_person: {
          name: patient.reference_name || '',
          last_name: patient.reference_last_name || '',
          address: patient.reference_address || '',
          phone: patient.reference_phone || '',
          relationship: patient.reference_relationship || ''
        }
      });
      // Si el paciente ya tiene doctores asignados, setearlos
      if (patient.doctors) {
        setSelectedDoctors(patient.doctors.map(d => d.doctor_id.toString()));
      } else if (patient.doctor_id) {
        setSelectedDoctors([patient.doctor_id.toString()]);
      } else {
        setSelectedDoctors([]);
      }
      if (patient.date_of_birth) {
        const [year, month, day] = patient.date_of_birth.split('-').map(Number);
        setBirthDate({ day, month, year });
      } else {
        setBirthDate({ day: '', month: '', year: '' });
      }
    } else {
      setFormData({
        first_name: '',
        last_name: '',
        date_of_birth: '',
        address: '',
        phone: '',
        email: '',
        preferred_payment_methods: '',
        reference_person: {
          name: '',
          last_name: '',
          address: '',
          phone: '',
          relationship: ''
        }
      });
      setSelectedDoctors([]);
      setBirthDate({ day: '', month: '', year: '' });
    }
  }, [patient, open]);

  const validate = () => {
    const errors = {};
    if (!formData.first_name.trim()) errors.first_name = 'El nombre es obligatorio';
    if (!formData.last_name.trim()) errors.last_name = 'El apellido es obligatorio';
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email inválido';
    }
    if (formData.phone && !/^[0-9]{7,15}$/.test(formData.phone)) {
      errors.phone = 'Teléfono inválido';
    }
    const dateError = parseAndValidateDate({
      day: Number(birthDate.day),
      month: Number(birthDate.month),
      year: Number(birthDate.year)
    }, 'birth_date', false);
    if (dateError) errors.birth_date = dateError;
    if (!selectedDoctors.length) {
      errors.doctors = 'Debe asignar al menos un doctor';
    }
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setFieldErrors({});
    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    setLoading(true);
    try {
      const url = patient ? `/api/patients/${patient.patient_id}` : '/api/patients';
      const method = patient ? 'PUT' : 'POST';
      const body = JSON.stringify({
        ...formData,
        birth_date: {
          day: Number(birthDate.day),
          month: Number(birthDate.month),
          year: Number(birthDate.year)
        },
        doctor_ids: selectedDoctors.map(Number)
      });
      const response = await authFetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body
      });
      if (!response || !response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al guardar paciente');
      }
      setSuccess(patient ? 'Paciente actualizado correctamente.' : 'Paciente creado correctamente.');
      setTimeout(() => {
        setSuccess('');
        if (onSave) onSave();
      }, 1200);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (fieldErrors[field]) {
      setFieldErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleReferenceChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      reference_person: { ...prev.reference_person, [field]: value }
    }));
  };

  const handleDoctorsChange = (e) => {
    const options = Array.from(e.target.selectedOptions).map(opt => opt.value);
    setSelectedDoctors(options);
    if (fieldErrors.doctors) {
      setFieldErrors(prev => ({ ...prev, doctors: '' }));
    }
  };

  if (!open) return null;

  return (
    <ModalContainer onClose={onClose}>
      <ModalHeader title={patient ? 'Editar Paciente' : 'Nuevo Paciente'} onClose={onClose} />
      {error && <Alert type='error'>{error}</Alert>}
      {success && <Alert type='success'>{success}</Alert>}
      <form className={styles.form} onSubmit={handleSubmit} autoComplete='off'>
        <div className={styles.formFields}>
          <div className={styles.row2}>
            <FormField
              label='Nombre *'
              value={formData.first_name}
              onChange={e => handleChange('first_name', e.target.value)}
              error={fieldErrors.first_name}
              required
              ref={firstInputRef}
            />
            <FormField
              label='Apellido *'
              value={formData.last_name}
              onChange={e => handleChange('last_name', e.target.value)}
              error={fieldErrors.last_name}
              required
            />
          </div>
          <div className={styles.row2}>
            <FormField
              label='Fecha de Nacimiento'
              error={fieldErrors.birth_date}
            >
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                  type='number'
                  placeholder='Día'
                  min='1'
                  max='31'
                  value={birthDate.day}
                  onChange={e => setBirthDate(prev => ({ ...prev, day: e.target.value }))}
                  style={{ width: '4rem' }}
                />
                <input
                  type='number'
                  placeholder='Mes'
                  min='1'
                  max='12'
                  value={birthDate.month}
                  onChange={e => setBirthDate(prev => ({ ...prev, month: e.target.value }))}
                  style={{ width: '4rem' }}
                />
                <input
                  type='number'
                  placeholder='Año'
                  min='1900'
                  max={new Date().getFullYear()}
                  value={birthDate.year}
                  onChange={e => setBirthDate(prev => ({ ...prev, year: e.target.value }))}
                  style={{ width: '6rem' }}
                />
              </div>
            </FormField>
            <FormField
              label='Teléfono'
              value={formData.phone}
              onChange={e => handleChange('phone', e.target.value)}
              error={fieldErrors.phone}
            />
          </div>
          <FormField
            label='Email'
            type='email'
            value={formData.email}
            onChange={e => handleChange('email', e.target.value)}
            error={fieldErrors.email}
          />
          <FormField
            label='Dirección'
            value={formData.address}
            onChange={e => handleChange('address', e.target.value)}
          />
          <FormField
            label='Métodos de Pago Preferidos'
            value={formData.preferred_payment_methods}
            onChange={e => handleChange('preferred_payment_methods', e.target.value)}
          />
          <FormField
            label='Doctores asignados *'
            error={fieldErrors.doctors}
          >
            <Select
              multiple
              value={selectedDoctors}
              onChange={handleDoctorsChange}
              options={doctors.map(doc => ({
                value: doc.doctor_id.toString(),
                label: `${doc.first_name} ${doc.last_name}`
              }))}
              style={{ minHeight: '80px' }}
            />
          </FormField>
          <div className={styles.referenceSection}>
            <h3 className={styles.referenceTitle}>Persona de Referencia</h3>
            <div className={styles.row2}>
              <FormField
                label='Nombre'
                value={formData.reference_person.name}
                onChange={e => handleReferenceChange('name', e.target.value)}
              />
              <FormField
                label='Apellido'
                value={formData.reference_person.last_name}
                onChange={e => handleReferenceChange('last_name', e.target.value)}
              />
            </div>
            <div className={styles.row2}>
              <FormField
                label='Teléfono'
                value={formData.reference_person.phone}
                onChange={e => handleReferenceChange('phone', e.target.value)}
              />
              <FormField
                label='Relación'
                value={formData.reference_person.relationship}
                onChange={e => handleReferenceChange('relationship', e.target.value)}
              />
            </div>
            <FormField
              label='Dirección'
              value={formData.reference_person.address}
              onChange={e => handleReferenceChange('address', e.target.value)}
            />
          </div>
        </div>
        <ModalFooter>
          <Button type='button' variant='outline' onClick={onClose} disabled={loading}>
            Cancelar
          </Button>
          <Button type='submit' loading={loading} variant='primary'>
            {patient ? 'Actualizar' : 'Crear'} Paciente
          </Button>
        </ModalFooter>
      </form>
    </ModalContainer>
  );
};

export default PatientFormModal; 