import React, { useState, useEffect } from 'react';
import ModalContainer from '../../molecules/ModalContainer/ModalContainer';
import ModalHeader from '../../molecules/ModalHeader/ModalHeader';
import ModalFooter from '../../molecules/ModalFooter/ModalFooter';
import Button from '../../atoms/Button/Button';
import Input from '../../atoms/Input/Input';
import FormGroup from '../../molecules/FormGroup/FormGroup';
import Alert from '../../atoms/Alert/Alert';
import { patientReferenceService } from '../../../services/patientReferenceService';
import styles from './ReferencePersonFormModal.module.css'; // Crear este archivo CSS

const ReferencePersonFormModal = ({ isOpen, onClose, patientId, referenceToEdit, onSuccess }) => {
  const initialFormState = {
    dni: '',
    name: '',
    last_name: '',
    phone: '',
    relationship: '',
    address: '',
  };

  const [formData, setFormData] = useState(initialFormState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const isEditing = Boolean(referenceToEdit && referenceToEdit.reference_id);

  useEffect(() => {
    if (isOpen) { // Solo actualizar formData si el modal está abierto
      if (isEditing) {
        setFormData({
          dni: referenceToEdit.dni || '',
          name: referenceToEdit.name || '',
          last_name: referenceToEdit.last_name || '',
          phone: referenceToEdit.phone || '',
          relationship: referenceToEdit.relationship || '',
          address: referenceToEdit.address || '',
        });
      } else {
        setFormData(initialFormState);
      }
      setError(''); // Limpiar errores al abrir/cambiar modo
    }
  }, [isOpen, referenceToEdit, isEditing]); // Dependencias clave

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (!formData.dni.trim()) return "El DNI es obligatorio.";
    if (!formData.name.trim()) return "El nombre es obligatorio.";
    if (!formData.last_name.trim()) return "El apellido es obligatorio.";
    // Validaciones adicionales pueden ir aquí (longitud, formato DNI, etc.)
    return ""; // Sin errores
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
      if (isEditing) {
        // Lógica de Actualización (Fase 3)
        await patientReferenceService.updateReference(referenceToEdit.reference_id, formData);
        // console.log("Modo edición - funcionalidad no implementada completamente en este paso.");
        // alert("Funcionalidad de edición no implementada completamente."); // Placeholder
      } else {
        await patientReferenceService.createReference(patientId, formData);
      }
      onSuccess(); // Llama al callback de éxito (cierra modal, refresca lista)
    } catch (err) {
      setError(err.message || `Error al ${isEditing ? 'actualizar' : 'guardar'} la persona de referencia.`);
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
        title={isEditing ? 'Editar Persona de Referencia' : 'Agregar Persona de Referencia'}
        onClose={onClose}
      />
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formContent}>
          {error && <Alert type="error" className={styles.alert}>{error}</Alert>}

          <FormGroup title="DNI" required>
            <Input type="text" name="dni" value={formData.dni} onChange={handleChange} maxLength={20} required />
          </FormGroup>
          <FormGroup title="Nombre" required>
            <Input type="text" name="name" value={formData.name} onChange={handleChange} maxLength={100} required />
          </FormGroup>
          <FormGroup title="Apellido" required>
            <Input type="text" name="last_name" value={formData.last_name} onChange={handleChange} maxLength={100} required />
          </FormGroup>
          <FormGroup title="Teléfono">
            <Input type="tel" name="phone" value={formData.phone} onChange={handleChange} maxLength={30} />
          </FormGroup>
          <FormGroup title="Relación/Parentesco">
            <Input type="text" name="relationship" value={formData.relationship} onChange={handleChange} maxLength={50} />
          </FormGroup>
          <FormGroup title="Dirección">
            <Input type="text" name="address" value={formData.address} onChange={handleChange} maxLength={255} />
          </FormGroup>
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

// PropTypes temporarily removed due to import resolution issue

export default ReferencePersonFormModal;
