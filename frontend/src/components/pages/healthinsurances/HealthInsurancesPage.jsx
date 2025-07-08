import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'; // Added Link for navigation
import { useDoctor } from '../../../hooks/useDoctor';
import HealthInsuranceForm from '../../molecules/HealthInsuranceForm/HealthInsuranceForm';
import HealthInsuranceDeleteModal from '../../molecules/HealthInsuranceDeleteModal/HealthInsuranceDeleteModal';
import Button from '../../atoms/Button/Button';
import { authFetch } from '../../../auth/authFetch';
import { createLogger } from '../../../utils/debug.js';

const HealthInsurancesPage = () => {
  const [insurances, setInsurances] = useState([]);
  const [selected, setSelected] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [insuranceToDelete, setInsuranceToDelete] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const { doctor } = useDoctor();
  const logger = createLogger('HealthInsurancesPage');
  
  // Obtener el rol del usuario
  const getUserRole = () => {
    const token = localStorage.getItem('token');
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.role;
    } catch {
      return null;
    }
  };

  useEffect(() => {
    logger.log('Componente HealthInsurancesPage montado');
    fetchInsurances();
  }, []);

  const fetchInsurances = async () => {
    try {
      logger.log('Iniciando fetch de obras sociales...');
      const token = localStorage.getItem('token');
      logger.log('Token presente:', !!token);
      
      const res = await authFetch('/api/health-insurances');
      logger.log('Respuesta del servidor:', res);
      
      if (!res) {
        logger.error('No se recibió respuesta del servidor');
        return;
      }
      
      if (!res.ok) {
        logger.error('Error en la respuesta:', res.status, res.statusText);
        return;
      }
      
      const data = await res.json();
      logger.log('Obras sociales recibidas:', data);
      setInsurances(data);
    } catch (error) {
      logger.error('Error al cargar obras sociales:', error);
    }
  };

  const handleSave = async (data) => {
    try {
      logger.log('Guardando obra social:', data);
      const method = selected ? 'PUT' : 'POST';
      const url = selected ? `/api/health-insurances/${selected.insurance_id}` : '/api/health-insurances';
      
      const res = await authFetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      
      if (!res.ok) {
        throw new Error(`Error ${res.status}: ${res.statusText}`);
      }
      
      logger.log('Obra social guardada exitosamente');
      setShowForm(false);
      setSelected(null);
      fetchInsurances();
    } catch (error) {
      logger.error('Error al guardar obra social:', error);
      alert(`Error al guardar: ${error.message}`);
    }
  };

  const handleDeleteClick = (insurance) => {
    setInsuranceToDelete(insurance);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async (id, action) => {
    try {
      setDeletingId(id);
      logger.log('Eliminando obra social:', id, 'con acción:', action);
      
      const res = await authFetch(`/api/health-insurances/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action })
      });
      
      if (!res.ok) {
        throw new Error(`Error ${res.status}: ${res.statusText}`);
      }
      
      logger.log('Obra social eliminada exitosamente');
      fetchInsurances();
    } catch (error) {
      logger.error('Error al eliminar obra social:', error);
      alert(`Error al eliminar: ${error.message}`);
    } finally {
      setDeletingId(null);
    }
  };

  const userRole = getUserRole();
  logger.log('Renderizando HealthInsurancesPage, insurances:', insurances, 'userRole:', userRole);
  
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
            <div style={{ marginTop: '8px', display: 'flex', gap: '8px' }}>
              <Button size="sm" onClick={() => { setSelected(ins); setShowForm(true); }}>Editar</Button>
              <Button 
                size="sm" 
                variant='danger' 
                onClick={() => handleDeleteClick(ins)}
                disabled={deletingId === ins.insurance_id}
              >
                {deletingId === ins.insurance_id ? 'Eliminando...' : 'Eliminar'}
              </Button>
              <Link to={`/app/health-insurances/${ins.insurance_id}`}>
                <Button size="sm" variant="info">Ver Detalles</Button>
              </Link>
            </div>
          </li>
        ))}
      </ul>
      {showForm && (
        <HealthInsuranceForm
          initialData={selected || {}}
          onSave={handleSave}
          onCancel={() => { setShowForm(false); setSelected(null); }}
        />
      )}
      
      {showDeleteModal && (
        <HealthInsuranceDeleteModal
          isOpen={showDeleteModal}
          insurance={insuranceToDelete}
          onClose={() => { setShowDeleteModal(false); setInsuranceToDelete(null); }}
          onConfirmDelete={handleConfirmDelete}
        />
      )}
    </div>
  );
};

export default HealthInsurancesPage; 