import React, { useState } from 'react';
import ModalContainer from '../ModalContainer/ModalContainer';
import Button from '../../atoms/Button/Button';
import styles from './HealthInsuranceForm.module.css';

const HealthInsuranceForm = ({ initialData = {}, onSave, onCancel }) => {
  // Validar que initialData no sea null
  const safeInitialData = initialData || {};
  
  const [form, setForm] = useState({
    name: safeInitialData.name || '',
    address: safeInitialData.address || '',
    phone: safeInitialData.phone || '',
    email: safeInitialData.email || ''
  });

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = e => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <ModalContainer onClose={onCancel}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <h3 className={styles.title}>
          {safeInitialData.name ? 'Editar' : 'Nueva'} Obra Social
        </h3>
        
        <div className={styles.formGroup}>
          <label className={styles.label}>Nombre *</label>
          <input 
            name="name" 
            value={form.name} 
            onChange={handleChange} 
            required 
            className={styles.input}
            placeholder="Nombre de la obra social"
          />
        </div>
        
        <div className={styles.formGroup}>
          <label className={styles.label}>Dirección</label>
          <input 
            name="address" 
            value={form.address} 
            onChange={handleChange} 
            className={styles.input}
            placeholder="Dirección de la obra social"
          />
        </div>
        
        <div className={styles.formGroup}>
          <label className={styles.label}>Teléfono</label>
          <input 
            name="phone" 
            value={form.phone} 
            onChange={handleChange} 
            className={styles.input}
            placeholder="Teléfono de la obra social"
          />
        </div>
        
        <div className={styles.formGroup}>
          <label className={styles.label}>Email</label>
          <input 
            name="email" 
            value={form.email} 
            onChange={handleChange} 
            className={styles.input}
            placeholder="Email de la obra social"
          />
        </div>
        
        <div className={styles.actions}>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit">
            {safeInitialData.name ? 'Actualizar' : 'Crear'}
          </Button>
        </div>
      </form>
    </ModalContainer>
  );
};

export default HealthInsuranceForm; 