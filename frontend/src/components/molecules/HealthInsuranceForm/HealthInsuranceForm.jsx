import React, { useState } from 'react';
import ModalContainer from '../ModalContainer/ModalContainer';
import Button from '../../atoms/Button/Button';

const HealthInsuranceForm = ({ initialData = {}, onSave, onCancel }) => {
  const [form, setForm] = useState({
    name: initialData.name || '',
    address: initialData.address || '',
    phone: initialData.phone || '',
    email: initialData.email || ''
  });

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = e => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <ModalContainer onClose={onCancel}>
      <form onSubmit={handleSubmit} style={{ minWidth: 320 }}>
        <h3>{initialData.name ? 'Editar' : 'Nueva'} Obra Social</h3>
        <label>Nombre</label>
        <input name="name" value={form.name} onChange={handleChange} required />
        <label>Dirección</label>
        <input name="address" value={form.address} onChange={handleChange} />
        <label>Teléfono</label>
        <input name="phone" value={form.phone} onChange={handleChange} />
        <label>Email</label>
        <input name="email" value={form.email} onChange={handleChange} />
        <div style={{ marginTop: 16, display: 'flex', gap: 12 }}>
          <Button type="submit">{initialData.name ? 'Actualizar' : 'Crear'}</Button>
          <Button type="button" variant="outline" onClick={onCancel}>Cancelar</Button>
        </div>
      </form>
    </ModalContainer>
  );
};

export default HealthInsuranceForm; 