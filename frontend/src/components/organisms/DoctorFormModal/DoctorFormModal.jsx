import React, { useState, useEffect } from 'react';
import ModalContainer from '../../molecules/ModalContainer/ModalContainer';
import ModalHeader from '../../molecules/ModalHeader/ModalHeader';
import ModalFooter from '../../molecules/ModalFooter/ModalFooter';
import Button from '../../atoms/Button/Button';
import Input from '../../atoms/Input/Input';
import FormGroup from '../../molecules/FormGroup/FormGroup';
import Alert from '../../atoms/Alert/Alert';
import styles from './DoctorFormModal.module.css';

const DoctorFormModal = ({ isOpen, onClose, onSubmit, doctor, isEditing }) => {
  const initialFormState = {
    first_name: '',
    last_name: '',
    specialty: '',
    license_number: '',
    phone: '',
    email: '',
    consultation_fee: '',
    prescription_fee: ''
  };

  const [formData, setFormData] = useState(initialFormState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      if (isEditing && doctor) {
        setFormData({
          first_name: doctor.first_name || '',
          last_name: doctor.last_name || '',
          specialty: doctor.specialty || '',
          license_number: doctor.license_number || '',
          phone: doctor.phone || '',
          email: doctor.email || '',
          consultation_fee: doctor.consultation_fee || '',
          prescription_fee: doctor.prescription_fee || ''
        });
      } else {
        setFormData(initialFormState);
      }
      setError('');
    }
  }, [isOpen, doctor, isEditing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (!formData.first_name.trim()) return "El nombre es obligatorio.";
    if (!formData.last_name.trim()) return "El apellido es obligatorio.";
    if (!formData.license_number.trim()) return "El número de licencia es obligatorio.";
    if (!formData.consultation_fee || parseFloat(formData.consultation_fee) <= 0) {
      return "La tarifa de consulta debe ser mayor a 0.";
    }
    if (!formData.prescription_fee || parseFloat(formData.prescription_fee) <= 0) {
      return "La tarifa de receta debe ser mayor a 0.";
    }
    return "";
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
        consultation_fee: parseFloat(formData.consultation_fee),
        prescription_fee: parseFloat(formData.prescription_fee)
      };
      await onSubmit(submitData);
    } catch (err) {
      setError(err.message || `Error al ${isEditing ? 'actualizar' : 'guardar'} el doctor.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <ModalContainer onClose={onClose}>
      <ModalHeader
        title={isEditing ? 'Editar Doctor' : 'Nuevo Doctor'}
        onClose={onClose}
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
            <FormGroup title="Especialidad">
              <Input
                type="text"
                name="specialty"
                value={formData.specialty}
                onChange={handleChange}
                maxLength={100}
              />
            </FormGroup>
            <FormGroup title="Número de Licencia" required>
              <Input
                type="text"
                name="license_number"
                value={formData.license_number}
                onChange={handleChange}
                maxLength={20}
                required
              />
            </FormGroup>
          </div>

          <div className={styles.row}>
            <FormGroup title="Teléfono">
              <Input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                maxLength={20}
              />
            </FormGroup>
            <FormGroup title="Email">
              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                maxLength={100}
              />
            </FormGroup>
          </div>

          <div className={styles.row}>
            <FormGroup title="Tarifa de Consulta (€)" required>
              <Input
                type="number"
                name="consultation_fee"
                value={formData.consultation_fee}
                onChange={handleChange}
                min="0"
                step="0.01"
                required
              />
            </FormGroup>
            <FormGroup title="Tarifa de Receta (€)" required>
              <Input
                type="number"
                name="prescription_fee"
                value={formData.prescription_fee}
                onChange={handleChange}
                min="0"
                step="0.01"
                required
              />
            </FormGroup>
          </div>
        </div>
        <ModalFooter>
          <Button type="button" variant="secondary" onClick={onClose} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary" loading={isSubmitting} disabled={isSubmitting}>
            {isSubmitting ? 'Guardando...' : (isEditing ? 'Actualizar' : 'Guardar')}
          </Button>
        </ModalFooter>
      </form>
    </ModalContainer>
  );
};

export default DoctorFormModal; 