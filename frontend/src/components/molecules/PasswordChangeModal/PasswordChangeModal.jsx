import React, { useState } from 'react';
import ModalContainer from '../ModalContainer/ModalContainer';
import ModalHeader from '../ModalHeader/ModalHeader';
import ModalFooter from '../ModalFooter/ModalFooter';
import Button from '../../atoms/Button/Button';
import FormField from '../FormField/FormField';
import FormGroup from '../FormGroup/FormGroup';
import Alert from '../../atoms/Alert/Alert';
import styles from './PasswordChangeModal.module.css';

const PasswordChangeModal = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  title = 'Cambiar Contraseña',
  requireCurrentPassword = true,
  requireAdminPassword = false,
  loading = false 
}) => {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    adminPassword: ''
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (requireCurrentPassword && !formData.currentPassword) {
      newErrors.currentPassword = 'Contraseña actual es requerida';
    }

    if (!formData.newPassword) {
      newErrors.newPassword = 'Nueva contraseña es requerida';
    } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(formData.newPassword)) {
      newErrors.newPassword = 'Mínimo 8 caracteres, una mayúscula, una minúscula y un número';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirmar contraseña es requerida';
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    if (requireAdminPassword && !formData.adminPassword) {
      newErrors.adminPassword = 'Contraseña de administrador es requerida';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const passwordData = {
      newPassword: formData.newPassword
    };

    if (requireCurrentPassword) {
      passwordData.currentPassword = formData.currentPassword;
    }

    if (requireAdminPassword) {
      passwordData.adminPassword = formData.adminPassword;
    }

    onSubmit(passwordData);
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Limpiar error cuando el usuario empiece a escribir
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleClose = () => {
    setFormData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
      adminPassword: ''
    });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <ModalContainer onClose={handleClose}>
      <ModalHeader title={title} onClose={handleClose} />
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formContent}>
          {requireCurrentPassword && (
            <FormGroup>
              <FormField
                label="Contraseña Actual"
                type="password"
                value={formData.currentPassword}
                onChange={(e) => handleChange('currentPassword', e.target.value)}
                error={errors.currentPassword}
                required
              />
            </FormGroup>
          )}

          <FormGroup>
            <FormField
              label="Nueva Contraseña"
              type="password"
              value={formData.newPassword}
              onChange={(e) => handleChange('newPassword', e.target.value)}
              error={errors.newPassword}
              required
              helperText="Mínimo 8 caracteres, una mayúscula, una minúscula y un número"
            />
          </FormGroup>

          <FormGroup>
            <FormField
              label="Confirmar Nueva Contraseña"
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => handleChange('confirmPassword', e.target.value)}
              error={errors.confirmPassword}
              required
            />
          </FormGroup>

          {requireAdminPassword && (
            <FormGroup>
              <FormField
                label="Contraseña de Administrador"
                type="password"
                value={formData.adminPassword}
                onChange={(e) => handleChange('adminPassword', e.target.value)}
                error={errors.adminPassword}
                required
              />
            </FormGroup>
          )}
        </div>

        <ModalFooter>
          <Button
            type="button"
            variant="secondary"
            onClick={handleClose}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="primary"
            loading={loading}
            disabled={loading}
          >
            Cambiar Contraseña
          </Button>
        </ModalFooter>
      </form>
    </ModalContainer>
  );
};

export default PasswordChangeModal; 