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
  };

  const handlePasswordChange = (data) => {
    setPasswordData(data);
    setShowPasswordModal(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const payload = {
        secretaryData: formData
      };

      // Si se va a cambiar la contraseña, incluir los datos de contraseña
      if (changePassword && passwordData) {
        payload.passwordData = passwordData;
      }

      // Si se está editando y hay cambios en el username, incluir los datos del usuario
      if (isEditing && userData && formData.username !== userData.username) {
        payload.userData = {
          user_id: userData.user_id,
          username: formData.username
        };
      }

      await onSubmit(payload);
      onClose();
    } catch (err) {
      setError(err.message || 'Error al guardar la secretaria');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData(initialFormState);
    setError('');
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
              </FormGroup>
            </div>

            <div className={styles.row}>
              <FormGroup title="Nombre de Usuario" required>
                <Input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  maxLength={20}
                  required
                  placeholder="Ej: stella_ibarra"
                  helperText="Solo letras, números y guion bajo (3-20 caracteres)"
                />
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