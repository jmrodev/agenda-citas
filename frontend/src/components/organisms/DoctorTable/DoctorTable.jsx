import React from 'react';
import Button from '../../atoms/Button/Button';
import styles from './DoctorTable.module.css';

const DoctorTable = ({ doctors, onDelete, onEdit }) => {
  if (!doctors || doctors.length === 0) {
    return (
      <div className={styles.emptyState}>
        <p>No hay doctores registrados.</p>
      </div>
    );
  }

  return (
    <div className={styles.tableContainer}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Especialidad</th>
            <th>Licencia</th>
            <th>Teléfono</th>
            <th>Email</th>
            <th>Consulta</th>
            <th>Receta</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {doctors.map((doctor) => (
            <tr key={doctor.doctor_id}>
              <td>
                <div className={styles.nameCell}>
                  <strong>{doctor.first_name} {doctor.last_name}</strong>
                </div>
              </td>
              <td>{doctor.specialty || '-'}</td>
              <td>{doctor.license_number}</td>
              <td>{doctor.phone || '-'}</td>
              <td>{doctor.email || '-'}</td>
              <td>€{doctor.consultation_fee}</td>
              <td>€{doctor.prescription_fee}</td>
              <td>
                <div className={styles.actions}>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(doctor.doctor_id)}
                    title="Editar doctor"
                  >
                    Editar
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => onDelete(doctor.doctor_id)}
                    title="Eliminar doctor"
                  >
                    Eliminar
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DoctorTable; 