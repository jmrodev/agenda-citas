import React, { useState, useEffect } from 'react';
import Button from '../../atoms/Button/Button';
import Input from '../../atoms/Input/Input';
import FormField from '../../molecules/FormField/FormField';
import Alert from '../../atoms/Alert/Alert';
import CloseIcon from '@mui/icons-material/Close';

const PatientForm = ({ patient, onClose, onSave }) => {
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
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

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
    }
  }, [patient]);

  const validate = () => {
    const errors = {};
    if (!formData.first_name.trim()) errors.first_name = 'El nombre es obligatorio';
    if (!formData.last_name.trim()) errors.last_name = 'El apellido es obligatorio';
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email inválido';
    }
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setFieldErrors({});
    
    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const url = patient ? `/api/patients/${patient.patient_id}` : '/api/patients';
      const method = patient ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al guardar paciente');
      }

      onSave();
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

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        background: 'var(--surface)',
        borderRadius: '8px',
        padding: '2rem',
        maxWidth: '600px',
        width: '90%',
        maxHeight: '90vh',
        overflow: 'auto'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2>{patient ? 'Editar Paciente' : 'Nuevo Paciente'}</h2>
          <Button variant="text" onClick={onClose}>
            <CloseIcon />
          </Button>
        </div>

        {error && <Alert type="error">{error}</Alert>}

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gap: '1rem', marginBottom: '1.5rem' }}>
            {/* Información básica */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <FormField
                label="Nombre *"
                value={formData.first_name}
                onChange={(e) => handleChange('first_name', e.target.value)}
                error={fieldErrors.first_name}
                required
              />
              <FormField
                label="Apellido *"
                value={formData.last_name}
                onChange={(e) => handleChange('last_name', e.target.value)}
                error={fieldErrors.last_name}
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <FormField
                label="Fecha de Nacimiento"
                type="date"
                value={formData.date_of_birth}
                onChange={(e) => handleChange('date_of_birth', e.target.value)}
              />
              <FormField
                label="Teléfono"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
              />
            </div>

            <FormField
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              error={fieldErrors.email}
            />

            <FormField
              label="Dirección"
              value={formData.address}
              onChange={(e) => handleChange('address', e.target.value)}
            />

            <FormField
              label="Métodos de Pago Preferidos"
              value={formData.preferred_payment_methods}
              onChange={(e) => handleChange('preferred_payment_methods', e.target.value)}
            />

            {/* Información de referencia */}
            <div style={{ 
              borderTop: '1px solid var(--border-color)', 
              paddingTop: '1rem',
              marginTop: '1rem'
            }}>
              <h3 style={{ marginBottom: '1rem' }}>Persona de Referencia</h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <FormField
                  label="Nombre"
                  value={formData.reference_person.name}
                  onChange={(e) => handleReferenceChange('name', e.target.value)}
                />
                <FormField
                  label="Apellido"
                  value={formData.reference_person.last_name}
                  onChange={(e) => handleReferenceChange('last_name', e.target.value)}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <FormField
                  label="Teléfono"
                  value={formData.reference_person.phone}
                  onChange={(e) => handleReferenceChange('phone', e.target.value)}
                />
                <FormField
                  label="Relación"
                  value={formData.reference_person.relationship}
                  onChange={(e) => handleReferenceChange('relationship', e.target.value)}
                />
              </div>

              <FormField
                label="Dirección"
                value={formData.reference_person.address}
                onChange={(e) => handleReferenceChange('address', e.target.value)}
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" loading={loading}>
              {patient ? 'Actualizar' : 'Crear'} Paciente
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PatientForm; 