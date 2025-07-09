import React, { useState, useEffect } from 'react';
import ModalContainer from '../../molecules/ModalContainer/ModalContainer';
import ModalHeader from '../../molecules/ModalHeader/ModalHeader';
import ModalFooter from '../../molecules/ModalFooter/ModalFooter';
import Button from '../../atoms/Button/Button';
import Input from '../../atoms/Input/Input';
import FormGroup from '../../molecules/FormGroup/FormGroup';
import Alert from '../../atoms/Alert/Alert';
import Switch from '../../atoms/Switch/Switch';
import PasswordChangeModal from '../../molecules/PasswordChangeModal/PasswordChangeModal';
import styles from './SecretaryFormModal.module.css';

const SecretaryFormModal = ({ isOpen, onClose, onSubmit, secretary, isEditing }) => {
  const initialFormState = {
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    shift: '',
    entry_time: '',
    exit_time: '',
    username: ''
  };

  const [formData, setFormData] = useState(initialFormState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState({});
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [changePassword, setChangePassword] = useState(false);
  const [passwordData, setPasswordData] = useState(null);
  const [userData, setUserData] = useState(null);

  // Obtener el rol del usuario actual
  const getCurrentUserRole = () => {
    const token = localStorage.getItem('token');
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.role;
    } catch {
      return null;
    }
  };

  const currentUserRole = getCurrentUserRole();
  const isAdmin = currentUserRole === 'admin';
  const isSecretary = currentUserRole === 'secretary';

  // Función para obtener el usuario asociado a la secretaria
  const fetchUserData = async (secretaryId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3001/api/auth/users`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        const user = data.users.find(u => u.entity_id === secretaryId && u.role === 'secretary');
        if (user) {
          setUserData(user);
          setFormData(prev => ({
            ...prev,
            username: user.username || ''
          }));
        }
      }
    } catch (error) {
      console.error('Error obteniendo datos del usuario:', error);
    }
  };

  useEffect(() => {
    if (isOpen) {
      if (isEditing && secretary) {
        setFormData({
          first_name: secretary.first_name || '',
          last_name: secretary.last_name || '',
          email: secretary.email || '',
          phone: secretary.phone || '',
          shift: secretary.shift || '',
          entry_time: secretary.entry_time || '',
          exit_time: secretary.exit_time || '',
          username: ''
        });
        
        // Obtener datos del usuario asociado
        fetchUserData(secretary.secretary_id);
      } else {
        setFormData(initialFormState);
        setUserData(null);
      }
      setError('');
      setChangePassword(false);
      setPasswordData(null);
    }
  }, [isOpen, secretary, isEditing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear validation error for the field being changed
    if (validationErrors[name]) {
      setValidationErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handlePasswordChange = (data) => {
    setPasswordData(data);
    setShowPasswordModal(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setValidationErrors({});

    if (!validateForm()) {
      setIsSubmitting(false);
      return;
    }

    try {
      const payload = {
        secretaryData: {
          first_name: formData.first_name,
          last_name: formData.last_name,
          email: formData.email,
          phone: formData.phone,
          shift: formData.shift || null,
          entry_time: formData.entry_time || null,
          exit_time: formData.exit_time || null,
        }
      };

      // Add username to secretaryData only if creating, or if editing and it's different
      // For new secretaries, username is part of the user creation process, handled by backend.
      // Here, we're focusing on the secretary form data.
      // The username from formData is for the user associated with the secretary.

      // If creating, the onSubmit handler in the parent component (SecretariesList.jsx)
      // will also need to send the username for the new user.
      // For editing, if username is changed, it's handled by `payload.userData`.

      // Si se va a cambiar la contraseña, incluir los datos de contraseña
      if (changePassword && passwordData) {
        payload.passwordData = passwordData;
      }

      // Si se está editando y hay cambios en el username, incluir los datos del usuario
      // Or if creating a new secretary, include username for the new user
      if ((isEditing && userData && formData.username !== userData.username) || (!isEditing && formData.username)) {
        payload.userData = { // This part might need adjustment based on how `onSubmit` expects new user data
          username: formData.username
        };
        if (isEditing && userData) {
          payload.userData.user_id = userData.user_id;
        }
      }

      // The main onSubmit prop will handle the actual API call for creating/updating secretary
      // and potentially the user associated with it.
      // The structure of `payload` should align with what `secretaryService.createSecretary`
      // and `secretaryService.updateSecretaryWithPassword` expect.
      // The backend `createSecretary` in controller expects `req.body` to be `secretaryData` directly
      // and then `userService.createUser` is called separately.
      // Let's adjust the payload for `onSubmit` to be simpler, and let the parent component structure it.

      const submitData = { ...formData };
      if (isEditing) {
        await onSubmit(submitData, passwordData, (userData && formData.username !== userData.username) ? { username: formData.username, user_id: userData.user_id } : null);
      } else {
        // For creation, the parent's onSubmit will handle creating user and secretary
        await onSubmit(submitData); // This will pass all form fields including username
      }

      onClose();
    } catch (err) {
      // Check if the error object has a 'response' and 'data' property for axios-like errors
      if (err.response && err.response.data && err.response.data.error && err.response.data.error.message) {
        setError(err.response.data.error.message);
      } else {
        setError(err.message || 'Error al guardar la secretaria');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.first_name.trim()) errors.first_name = 'El nombre es requerido';
    if (!formData.last_name.trim()) errors.last_name = 'El apellido es requerido';
    if (!formData.email.trim()) {
      errors.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'El formato del email no es válido';
    }
    if (!formData.phone.trim()) errors.phone = 'El teléfono es requerido';

    // Username validation (only if creating or if username field is available)
    // Username is required for new secretaries
    if (!isEditing && !formData.username.trim()) {
        errors.username = 'El nombre de usuario es requerido';
    } else if (formData.username.trim()) { // Validate if username is provided (for new or edit)
        const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
        if (!usernameRegex.test(formData.username)) {
            errors.username = 'Debe tener 3-20 caracteres (letras, números, guion bajo)';
        }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleClose = () => {
    setFormData(initialFormState);
    setError('');
    setValidationErrors({});
    setChangePassword(false);
    setPasswordData(null);
    setUserData(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <ModalContainer onClose={handleClose}>
        <ModalHeader
          title={isEditing ? 'Editar Secretaria' : 'Nueva Secretaria'}
          onClose={handleClose}
        />
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formContent}>
            {error && <Alert type="error" className={styles.alert}>{error}</Alert>}

            <div className={styles.row}>
              <FormGroup title="Nombre" required>
                <Input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  maxLength={50}
                  required
                />
                {validationErrors.first_name && <Alert type="error" size="small" className={styles.fieldAlert}>{validationErrors.first_name}</Alert>}
              </FormGroup>
              <FormGroup title="Apellido" required>
                <Input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  maxLength={50}
                  required
                />
                {validationErrors.last_name && <Alert type="error" size="small" className={styles.fieldAlert}>{validationErrors.last_name}</Alert>}
              </FormGroup>
            </div>

            <div className={styles.row}>
              <FormGroup title="Email" required>
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  maxLength={100}
                  required
                />
                {validationErrors.email && <Alert type="error" size="small" className={styles.fieldAlert}>{validationErrors.email}</Alert>}
              </FormGroup>
              <FormGroup title="Teléfono" required>
                <Input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  maxLength={20}
                  required
                />
                {validationErrors.phone && <Alert type="error" size="small" className={styles.fieldAlert}>{validationErrors.phone}</Alert>}
              </FormGroup>
            </div>

            <div className={styles.row}>
              <FormGroup title="Nombre de Usuario" required={!isEditing}>
                <Input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  maxLength={20}
                  required={!isEditing} // Username required only on creation from this modal's perspective
                  placeholder="Ej: stella_ibarra"
                  helperText="3-20 caracteres (letras, números, _)"
                  disabled={isEditing && !isAdmin && isSecretary} // Secretary cannot edit their own username
                />
                {validationErrors.username && <Alert type="error" size="small" className={styles.fieldAlert}>{validationErrors.username}</Alert>}
              </FormGroup>
              <FormGroup title="Turno">
                <select
                  name="shift"
                  value={formData.shift}
                  onChange={handleChange}
                  className={styles.select}
                >
                  <option value="">Seleccionar turno</option>
                  <option value="mañana">Mañana</option>
                  <option value="tarde">Tarde</option>
                  <option value="noche">Noche</option>
                </select>
              </FormGroup>
            </div>

            <div className={styles.row}>
              <FormGroup title="Hora de entrada">
                <Input
                  type="time"
                  name="entry_time"
                  value={formData.entry_time}
                  onChange={handleChange}
                />
              </FormGroup>
              <FormGroup title="Hora de salida">
                <Input
                  type="time"
                  name="exit_time"
                  value={formData.exit_time}
                  onChange={handleChange}
                />
              </FormGroup>
            </div>

            {/* Sección de cambio de contraseña */}
            {isEditing && (
              <div className={styles.passwordSection}>
                <div className={styles.passwordHeader}>
                  <h4>Cambiar Contraseña</h4>
                  <Switch
                    checked={changePassword}
                    onChange={(checked) => setChangePassword(checked)}
                    label="Cambiar contraseña"
                  />
                </div>
                
                {changePassword && (
                  <div className={styles.passwordInfo}>
                    <p>
                      {isAdmin 
                        ? 'Se requerirá la contraseña de administrador para cambiar la contraseña.'
                        : 'Se requerirá la contraseña actual para cambiar la contraseña.'
                      }
                    </p>
                    <Button
                      type="button"
                      variant="secondary"
                      size="small"
                      onClick={() => setShowPasswordModal(true)}
                    >
                      Configurar Nueva Contraseña
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>

          <ModalFooter>
            <Button 
              type="button" 
              variant="secondary" 
              onClick={handleClose} 
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

      {/* Modal de cambio de contraseña */}
      <PasswordChangeModal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        onSubmit={handlePasswordChange}
        title="Cambiar Contraseña de Secretaria"
        requireCurrentPassword={!isAdmin}
        requireAdminPassword={isAdmin}
        loading={false}
      />
    </>
  );
};

export default SecretaryFormModal; 