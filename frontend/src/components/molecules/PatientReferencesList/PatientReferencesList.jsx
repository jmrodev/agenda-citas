import React, { useState } from 'react'; // Añadir useState para el estado de carga/error local
import PropTypes from 'prop-types';
import styles from './PatientReferencesList.module.css';
import Button from '../../atoms/Button/Button';
import Alert from '../../atoms/Alert/Alert'; // Para mostrar errores
import { getRole } from '../../../auth';
import { patientReferenceService } from '../../../services/patientReferenceService'; // Importar el servicio

const PatientReferencesList = ({ references, patientId, onUpdate, onEditRequest }) => {
  const userRole = getRole();
  const canManage = userRole === 'admin' || userRole === 'secretary';

  // Estado local para la carga de eliminación y errores
  const [deletingId, setDeletingId] = useState(null); // ID de la referencia que se está eliminando
  const [deleteError, setDeleteError] = useState('');

  if (!references || references.length === 0) {
    return <p className={styles.emptyMessage}>No hay personas de referencia asignadas.</p>;
  }

  const handleEdit = (reference) => {
    if (onEditRequest) {
      onEditRequest(reference);
    }
  };

  const handleDelete = async (referenceId) => {
    if (window.confirm('¿Está seguro de que desea eliminar esta persona de referencia?')) {
      setDeletingId(referenceId);
      setDeleteError('');
      try {
        await patientReferenceService.deleteReference(referenceId);
        if (onUpdate) {
          onUpdate(); // Llama a handleDataUpdate en PatientView para recargar
        }
      } catch (err) {
        console.error("Error al eliminar referencia:", err);
        setDeleteError(err.message || 'No se pudo eliminar la persona de referencia.');
        // Mantener deletingId para mostrar el error en el ítem correcto, o resetear si se prefiere un error global
      } finally {
        // Resetear deletingId solo si no hubo error, o si queremos que el reintento sea posible
        // Si hay error, podríamos querer mantener el estado de 'intentando borrar' o dar opción de reintento
        // Por ahora, lo reseteamos siempre para simplificar.
        setDeletingId(null);
      }
    }
  };

  return (
    <div className={styles.referencesListContainer}>
      {deleteError && <Alert type="error" className={styles.globalError}>{deleteError}</Alert>}
      {references.map((ref) => (
        <div key={ref.reference_id} className={styles.referenceItem}>
          <div className={styles.referenceDetails}>
            <p className={styles.name}>
              <strong>Nombre:</strong> {ref.name} {ref.last_name}
            </p>
            {ref.dni && <p><strong>DNI:</strong> {ref.dni}</p>}
            {ref.relationship && <p><strong>Relación:</strong> {ref.relationship}</p>}
            {ref.phone && <p><strong>Teléfono:</strong> {ref.phone}</p>}
            {ref.address && <p><strong>Dirección:</strong> {ref.address}</p>}
          </div>
          {canManage && (
            <div className={styles.actions}>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleEdit(ref)}
                title="Editar Persona de Referencia" // Tooltip actualizado
                disabled={deletingId === ref.reference_id} // Deshabilitar si se está borrando esta
              >
                Editar
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={() => handleDelete(ref.reference_id)}
                loading={deletingId === ref.reference_id} // Mostrar spinner si se está borrando esta
                disabled={deletingId === ref.reference_id} // Deshabilitar si se está borrando esta
                title="Eliminar Persona de Referencia" // Tooltip actualizado
              >
                {deletingId === ref.reference_id ? 'Eliminando...' : 'Eliminar'}
              </Button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

PatientReferencesList.propTypes = {
  references: PropTypes.arrayOf(PropTypes.shape({
    reference_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired, // ID puede ser string o number
    name: PropTypes.string,
    last_name: PropTypes.string,
    dni: PropTypes.string,
    relationship: PropTypes.string,
    phone: PropTypes.string,
    address: PropTypes.string,
  })).isRequired,
  patientId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  onUpdate: PropTypes.func.isRequired, // Para refrescar la lista después de una acción
  onEditRequest: PropTypes.func.isRequired, // Para solicitar la edición de una referencia
};

export default PatientReferencesList;
