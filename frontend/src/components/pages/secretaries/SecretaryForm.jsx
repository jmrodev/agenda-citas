import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import CardBase from '../../atoms/CardBase/CardBase';
import CardTitle from '../../atoms/CardTitle/CardTitle';
import Button from '../../atoms/Button/Button';
import FormField from '../../molecules/FormField/FormField';
import FormGroup from '../../molecules/FormGroup/FormGroup';
import Alert from '../../atoms/Alert/Alert';
import Spinner from '../../atoms/Spinner/Spinner';
import styles from './SecretaryForm.module.css';

const SecretaryForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);
  
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    shift: '',
    entry_time: '',
    exit_time: '',
    username: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    if (isEditing) {
      fetchSecretary();
    }
  }, [id]);

  const fetchSecretary = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3001/api/secretaries/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Error al cargar la secretaria');
      }

      const data = await response.json();
      const secretary = data.secretary;
      
      setFormData({
        first_name: secretary.first_name || '',
        last_name: secretary.last_name || '',
        email: secretary.email || '',
        phone: secretary.phone || '',
        shift: secretary.shift || '',
        entry_time: secretary.entry_time || '',
        exit_time: secretary.exit_time || '',
        username: secretary.username || '' // Assuming username is part of the secretary object
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.first_name.trim()) {
      errors.first_name = 'El nombre es requerido';
    }

    if (!formData.last_name.trim()) {
      errors.last_name = 'El apellido es requerido';
    }

    if (!formData.email.trim()) {
      errors.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'El email no es válido';
    }

    if (!formData.phone.trim()) {
      errors.phone = 'El teléfono es requerido';
    }

    // Validar username (si se está creando una nueva secretaria)
    if (!isEditing) {
      if (!formData.username || !formData.username.trim()) {
        errors.username = 'El nombre de usuario es requerido';
      } else {
        const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
        if (!usernameRegex.test(formData.username)) {
          errors.username = 'El nombre de usuario debe tener entre 3 y 20 caracteres, solo letras, números y guion bajo.';
        }
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setSaving(true);
      const token = localStorage.getItem('token');
      
      const payload = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        phone: formData.phone,
        shift: formData.shift || null,
        entry_time: formData.entry_time || null,
        exit_time: formData.exit_time || null,
        username: formData.username || null // Include username in payload
      };

      const url = isEditing 
        ? `http://localhost:3001/api/secretaries/${id}`
        : 'http://localhost:3001/api/secretaries';
      
      const method = isEditing ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Error al guardar la secretaria');
      }

      navigate('/app/secretaries');
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Limpiar error de validación cuando el usuario empiece a escribir
    if (validationErrors[field]) {
      setValidationErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <Spinner size={32} color="primary" />
        <p>Cargando secretaria...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <CardBase className={styles.formContainer}>
        <CardTitle>
          {isEditing ? 'Editar Secretaria' : 'Nueva Secretaria'}
        </CardTitle>

        {error && (
          <Alert type="error" onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit} className={styles.form}>
          <FormGroup>
            <FormField
              label="Nombre"
              type="text"
              value={formData.first_name}
              onChange={(e) => handleChange('first_name', e.target.value)}
              error={validationErrors.first_name}
              required
            />
          </FormGroup>

          <FormGroup>
            <FormField
              label="Apellido"
              type="text"
              value={formData.last_name}
              onChange={(e) => handleChange('last_name', e.target.value)}
              error={validationErrors.last_name}
              required
            />
          </FormGroup>

          <FormGroup>
            <FormField
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              error={validationErrors.email}
              required
            />
          </FormGroup>

          <FormGroup>
            <FormField
              label="Teléfono"
              type="tel"
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              error={validationErrors.phone}
              required
            />
          </FormGroup>

          {!isEditing && (
            <FormGroup>
              <FormField
                label="Nombre de usuario"
                type="text"
                value={formData.username}
                onChange={(e) => handleChange('username', e.target.value)}
                error={validationErrors.username}
                required
                helperText="Solo letras, números y guion bajo (3-20 caracteres)"
              />
            </FormGroup>
          )}

          <FormGroup>
            <FormField
              label="Turno"
              type="select"
              value={formData.shift}
              onChange={(e) => handleChange('shift', e.target.value)}
              options={[
                { value: '', label: 'Seleccionar turno' },
                { value: 'mañana', label: 'Mañana' },
                { value: 'tarde', label: 'Tarde' },
                { value: 'noche', label: 'Noche' }
              ]}
            />
          </FormGroup>

          <FormGroup>
            <FormField
              label="Hora de entrada"
              type="time"
              value={formData.entry_time}
              onChange={(e) => handleChange('entry_time', e.target.value)}
            />
          </FormGroup>

          <FormGroup>
            <FormField
              label="Hora de salida"
              type="time"
              value={formData.exit_time}
              onChange={(e) => handleChange('exit_time', e.target.value)}
            />
          </FormGroup>

          <div className={styles.actions}>
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate('/app/secretaries')}
              disabled={saving}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="primary"
              loading={saving}
              disabled={saving}
            >
              {isEditing ? 'Actualizar' : 'Crear'} Secretaria
            </Button>
          </div>
        </form>
      </CardBase>
    </div>
  );
};

export default SecretaryForm; 