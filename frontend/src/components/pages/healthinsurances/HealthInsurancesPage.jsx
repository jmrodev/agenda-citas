import React, { useEffect, useState } from 'react';
import { useDoctor } from '../../context/DoctorContext';
import HealthInsuranceForm from '../../molecules/HealthInsuranceForm/HealthInsuranceForm';
import Button from '../../atoms/Button/Button';
import { authFetch } from '../../../auth/authFetch';
import { createLogger } from '../../../utils/debug.js';

const HealthInsurancesPage = () => {
  const [insurances, setInsurances] = useState([]);
  const [selected, setSelected] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const { doctor } = useDoctor();
  const logger = createLogger('HealthInsurancesPage');

  const fetchInsurances = async () => {
    const res = await authFetch('/api/health-insurances');
    if (!res) return;
    const data = await res.json();
    setInsurances(data);
          logger.log('Obras sociales recibidas:', data);
  };

  const handleSave = async (data) => {
    const method = selected ? 'PUT' : 'POST';
    const url = selected ? `/api/health-insurances/${selected.insurance_id}` : '/api/health-insurances';
    await authFetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    setShowForm(false);
    setSelected(null);
    fetchInsurances();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar obra social?')) return;
    await authFetch(`/api/health-insurances/${id}`, {
      method: 'DELETE'
    });
    fetchInsurances();
  };

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: 24 }}>
      <h2>Obras Sociales</h2>
      {doctor && (
        <div style={{ marginBottom: 16, color: '#444', fontSize: 16 }}>
          <strong>Doctor seleccionado:</strong> {doctor.name || doctor.first_name + ' ' + doctor.last_name}
          {doctor.specialty && <> | <span style={{ color: '#888' }}>{doctor.specialty}</span></>}
          {doctor.email && <> | <span style={{ color: '#aaa' }}>{doctor.email}</span></>}
        </div>
      )}
      <Button onClick={() => { setSelected(null); setShowForm(true); }}>Agregar obra social</Button>
      <ul style={{ marginTop: 24 }}>
        {insurances.map(ins => (
          <li key={ins.insurance_id} style={{ marginBottom: 16, borderBottom: '1px solid #eee', paddingBottom: 8 }}>
            <strong>{ins.name}</strong> ({ins.email})<br/>
            <span style={{ color: '#666', fontSize: 14 }}>{ins.address} | {ins.phone}</span><br/>
            <Button size="sm" onClick={() => { setSelected(ins); setShowForm(true); }}>Editar</Button>
            <Button size="sm" variant='danger' onClick={() => handleDelete(ins.insurance_id)}>Eliminar</Button>
          </li>
        ))}
      </ul>
      {showForm && (
        <HealthInsuranceForm
          initialData={selected}
          onSave={handleSave}
          onCancel={() => { setShowForm(false); setSelected(null); }}
        />
      )}
    </div>
  );
};

export default HealthInsurancesPage; 