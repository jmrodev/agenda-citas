import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doctorService } from '../../../services/doctorService';
import DoctorFormModal from '../../organisms/DoctorFormModal/DoctorFormModal';
import Alert from '../../atoms/Alert/Alert';
import Loader from '../../atoms/Loader/Loader';
import styles from './DoctorForm.module.css';

const DoctorForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(true);

  const isEditing = Boolean(id);

  useEffect(() => {
    if (isEditing) {
      fetchDoctor();
    } else {
      setLoading(false);
    }
  }, [id]);

  const fetchDoctor = async () => {
    try {
      setLoading(true);
      const data = await doctorService.getById(id);
      setDoctor(data);
    } catch (err) {
      setError('Error al cargar el doctor: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (formData) => {
    try {
      if (isEditing) {
        await doctorService.update(id, formData);
      } else {
        await doctorService.create(formData);
      }
      navigate('/desktop/doctors');
    } catch (err) {
      setError('Error al guardar el doctor: ' + err.message);
    }
  };

  const handleClose = () => {
    setIsModalOpen(false);
    navigate('/desktop/doctors');
  };

  if (loading) {
    return <Loader size="large" text="Cargando doctor..." />;
  }

  return (
    <div className={styles.container}>
      {error && (
        <Alert type="error" onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <DoctorFormModal
        isOpen={isModalOpen}
        onClose={handleClose}
        onSubmit={handleSubmit}
        doctor={doctor}
        isEditing={isEditing}
      />
    </div>
  );
};

export default DoctorForm; 