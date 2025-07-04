import React from 'react';
import ModalContainer from '../../molecules/ModalContainer/ModalContainer';
import ModalHeader from '../../molecules/ModalHeader/ModalHeader';
import ModalFooter from '../../molecules/ModalFooter/ModalFooter';
import Button from '../../atoms/Button/Button';
import { useViewMode } from '../../context/ViewModeContext';

const formatKey = key => key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

const PatientDetailsModal = ({ open, patient, onClose }) => {
  const { viewMode } = useViewMode();
  if (!open || !patient) return null;

  let content = null;
  if (viewMode === 'tabla') {
    content = (
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <tbody>
          {Object.entries(patient).map(([key, value]) => (
            <tr key={key}>
              <td style={{ fontWeight: 600, padding: '4px 8px', textTransform: 'capitalize', color: '#555' }}>{formatKey(key)}</td>
              <td style={{ padding: '4px 8px', color: '#222' }}>{String(value ?? '-')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  } else if (viewMode === 'lista') {
    content = (
      <ul style={{ padding: 0, margin: 0, listStyle: 'none' }}>
        {Object.entries(patient).map(([key, value]) => (
          <li key={key} style={{ marginBottom: 8 }}>
            <strong style={{ color: '#555', textTransform: 'capitalize' }}>{formatKey(key)}:</strong> <span style={{ color: '#222' }}>{String(value ?? '-')}</span>
          </li>
        ))}
      </ul>
    );
  } else if (viewMode === 'tarjeta') {
    content = (
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
        {Object.entries(patient).map(([key, value]) => (
          <div key={key} style={{ background: '#f5f6fa', borderRadius: 8, padding: 12, minWidth: 120, flex: '1 0 40%' }}>
            <div style={{ fontWeight: 600, color: '#555', textTransform: 'capitalize', marginBottom: 4 }}>{formatKey(key)}</div>
            <div style={{ color: '#222' }}>{String(value ?? '-')}</div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <ModalContainer onClose={onClose}>
      <ModalHeader title={`Detalles de ${patient.first_name} ${patient.last_name}`} onClose={onClose} />
      <div style={{ padding: '1rem', minWidth: 320 }}>
        {content}
      </div>
      <ModalFooter>
        <Button onClick={onClose}>Cerrar</Button>
      </ModalFooter>
    </ModalContainer>
  );
};

export default PatientDetailsModal; 